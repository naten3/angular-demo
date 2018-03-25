package com.natenelles.timeapp;

import liquibase.integration.spring.SpringLiquibase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.servlet.annotation.MultipartConfig;
import javax.sql.DataSource;

@SpringBootApplication
@EnableAsync
public class TimeApi extends SpringBootServletInitializer {

  @Autowired
  DataSource dataSource;

  public static void main(String[] args) {
  	SpringApplication.run(TimeApi.class, args);
  }


  @Bean
  @Profile({ "local" })
  @Primary
  //Use the default liquibase name, as spring boot liquibase support expects a bean of this name
  public SpringLiquibase liquibase() {
    SpringLiquibase springLiquibase = new SpringLiquibase();
    springLiquibase.setDataSource(dataSource);
    springLiquibase.setChangeLog("classpath:db.changelog-master.xml");
    springLiquibase.setContexts("testdata");
    return springLiquibase;
  }
}
