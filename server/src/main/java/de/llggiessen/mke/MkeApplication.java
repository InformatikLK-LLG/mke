package de.llggiessen.mke;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MkeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MkeApplication.class, "--server.port=4001");
	}

}
