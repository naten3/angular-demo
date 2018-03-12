package io.abnd.security;

import com.allanditzel.springframework.security.web.csrf.CsrfTokenResponseHeaderBindingFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.session.web.http.HeaderHttpSessionStrategy;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
  @Autowired
  private RestAuthenticationEntryPoint restAuthenticationEntryPoint;

  @Autowired
  private AuthenticationSuccessHandler
  authenticationSuccessHandler;

  @Autowired
  private CustomUserDetailService userDetailService;

  @Bean
  HeaderHttpSessionStrategy sessionStrategy() {
    return new HeaderHttpSessionStrategy();
  }


  @Override
  protected void configure(AuthenticationManagerBuilder auth)
  throws Exception {
    auth.userDetailsService(userDetailService)
    //.passwordEncoder(new BCryptPasswordEncoder(5));TODO
    .passwordEncoder(NoOpPasswordEncoder.getInstance());
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
    .csrf().disable()//.csrfTokenRepository(csrfTokenRepository()).ignoringAntMatchers("/login")//TODO
    //.and()
    .exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint)
    .and()
    .authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/login**").permitAll()
    .antMatchers(HttpMethod.GET, "/users/available**").permitAll()
    .regexMatchers(HttpMethod.POST, "\\/users\\/?").permitAll()
    .anyRequest().authenticated()
    .and()
    .formLogin()
    .successHandler(authenticationSuccessHandler)
    .failureHandler(new SimpleUrlAuthenticationFailureHandler())
    .and()
    .logout()
    .and()
    .addFilterAfter(new CsrfTokenResponseHeaderBindingFilter(), CsrfFilter.class); //TODO make this a cookie
    //.addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class);
  }

  private CsrfTokenRepository csrfTokenRepository() {
    HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
    repository.setHeaderName("X-XSRF-TOKEN");
    return repository;
  }
}
