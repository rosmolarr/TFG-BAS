package org.springframework.samples.bas.configuration;

import static org.springframework.security.config.Customizer.withDefaults;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.util.Arrays;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.samples.bas.configuration.jwt.AuthEntryPointJwt;
import org.springframework.samples.bas.configuration.jwt.AuthTokenFilter;
import org.springframework.samples.bas.configuration.services.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Autowired
	DataSource dataSource;

	private static final String ADMIN = "ADMIN";
	private static final String ENTIDAD = "ENTIDAD";
	

	@Bean
	protected SecurityFilterChain configure(HttpSecurity http) throws Exception {
		
		http
			.cors(withDefaults())		
			.csrf(AbstractHttpConfigurer::disable)		
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))			
			.headers((headers) -> headers.frameOptions((frameOptions) -> frameOptions.disable()))
			.exceptionHandling((exepciontHandling) -> exepciontHandling.authenticationEntryPoint(unauthorizedHandler))			
			
			.authorizeHttpRequests(authorizeRequests ->	authorizeRequests
			.requestMatchers("/resources/**", "/webjars/**", "/static/**", "/swagger-resources/**").permitAll()			
			.requestMatchers("/", "/oups","/api/v1/auth/**","/v3/api-docs/**","/swagger-ui.html","/swagger-ui/**").permitAll()	
			.requestMatchers("/api/v1/entidades/{id}").hasAuthority(ENTIDAD)											
			.requestMatchers("/api/v1/entidades/**").hasAuthority(ADMIN)
			.requestMatchers("/api/v1/comunicaciones/**").hasAnyAuthority(ADMIN, ENTIDAD)
			.requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/users/**")).hasAnyAuthority(ADMIN, ENTIDAD)
			.anyRequest().denyAll())					
			.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);		
		return http.build();
	}

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
		return config.getAuthenticationManager();
	}	


	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
}