package com.hidglobal.origo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class OrigoWebpushProvisioningServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrigoWebpushProvisioningServiceApplication.class, args);
	}

}
