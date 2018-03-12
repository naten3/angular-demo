package io.abnd;

import liquibase.integration.spring.SpringLiquibase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@SpringBootApplication
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
