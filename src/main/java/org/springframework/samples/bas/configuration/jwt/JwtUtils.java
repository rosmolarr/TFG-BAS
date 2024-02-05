package org.springframework.samples.bas.configuration.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.samples.bas.configuration.services.UserDetailsImpl;
import org.springframework.samples.bas.entidad.EntidadService;
import org.springframework.samples.bas.user.Authorities;
import org.springframework.samples.bas.user.User;
import org.springframework.samples.bas.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtUtils {

	@Autowired
    private UserService userService;

	@Autowired
    private EntidadService entidadService;

	private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

	@Value("${bas.app.jwtSecret}")
	private String jwtSecret;

	@Value("${bas.app.jwtExpirationMs}")
	private int jwtExpirationMs;

	public String generateJwtToken(Authentication authentication) {

		UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
		User user = userService.findUser(userPrincipal.getUsername());

		Map<String, Object> claims = new HashMap<>();
		claims.put("authorities",
				userPrincipal.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList()));
		
		if(user.getAuthority().toString() == "ENTIDAD") {
			Integer entidadId = entidadService.findByUserId(user.getId()).getId();
			claims.put("entidadId", entidadId.toString());
		}

		return Jwts.builder().setClaims(claims).setSubject((userPrincipal.getUsername())).setIssuedAt(new Date())
				.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
	}

	public String generateTokenFromUsername(String username, Authorities authority) {
		User user = userService.findUser(username);
		Map<String, Object> claims = new HashMap<>();
		claims.put("authorities", authority.getAuthority());

		if(user.getAuthority().toString() == "ENTIDAD") {
			Integer entidadId = entidadService.findByUserId(user.getId()).getId();
			claims.put("entidadId", entidadId.toString());
		}

		return Jwts.builder().setClaims(claims).setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
	}

	public String getUserNameFromJwtToken(String token) {
		return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
	}

	public boolean validateJwtToken(String authToken) {
		try {
			Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
			return true;
		} catch (SignatureException e) {
			logger.error("Invalid JWT signature: {}", e.getMessage());
		} catch (MalformedJwtException e) {
			logger.error("Invalid JWT token: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			logger.error("JWT token is expired: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			logger.error("JWT token is unsupported: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			logger.error("JWT claims string is empty: {}", e.getMessage());
		}

		return false;
	}
}
