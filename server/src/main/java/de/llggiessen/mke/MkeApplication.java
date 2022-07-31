package de.llggiessen.mke;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MkeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MkeApplication.class, args);
	}

}
