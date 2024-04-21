package org.springframework.samples.bas.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {
	
	@Autowired
	GenericIdToEntityConverter idToEntityConverter;
	
    @Override
    public void addFormatters(FormatterRegistry registry) {
    	
        registry.addConverter(idToEntityConverter);
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "https://tfg-bas.vercel.app",
                "https://tfg-bas-git-main-rosmolarrs-projects.vercel.app",
                "https://tfg-kpuul0z51-rosmolarrs-projects.vercel.app",
                "https://tfg-bas.ew.r.appspot.com/"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}