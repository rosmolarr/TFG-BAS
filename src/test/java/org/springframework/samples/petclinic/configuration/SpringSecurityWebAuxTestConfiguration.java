package org.springframework.samples.petclinic.configuration;

import java.util.Arrays;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.samples.bas.configuration.services.UserDetailsImpl;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@TestConfiguration
public class SpringSecurityWebAuxTestConfiguration {

    @Bean
    @Primary
    public UserDetailsService userDetailsService() {

        UserDetailsImpl adminActiveUser = new UserDetailsImpl(1, "admin", "password",
        		Arrays.asList(
                        new SimpleGrantedAuthority("ADMIN"))
        );
        
        UserDetailsImpl entidadActiveUser = new UserDetailsImpl(1, "entidad", "password",
        		Arrays.asList(
                        new SimpleGrantedAuthority("ENTIDAD"))
        );

        return new InMemoryUserDetailsManager(Arrays.asList(
        		adminActiveUser, entidadActiveUser
        ));
    }
}
