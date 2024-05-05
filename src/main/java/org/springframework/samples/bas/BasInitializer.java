package org.springframework.samples.bas;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import jakarta.annotation.PostConstruct;

public class BasInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(BasApplication.class);
	}

	@PostConstruct
    public void init() {
        Properties props = new Properties();
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(".secrets")) {
            props.load(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }

        String username = props.getProperty("DB_USERNAME");
        String password = props.getProperty("DB_PASSWORD");

        // Usa las variables username y password según sea necesario
    }
}
