package com.natenelles.timeapp.security;

import com.allanditzel.springframework.security.web.csrf.CsrfTokenResponseHeaderBindingFilter;
import com.natenelles.timeapp.config.social.FacebookConnectionSignup;
import com.natenelles.timeapp.config.social.FacebookSignInAdapter;
import com.natenelles.timeapp.config.social.SocialSessionStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.session.web.http.HeaderHttpSessionStrategy;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.mem.InMemoryUsersConnectionRepository;
import org.springframework.social.connect.web.ProviderSignInController;

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

  //social beans
  @Autowired
  private ConnectionFactoryLocator connectionFactoryLocator;

  @Autowired
  private UsersConnectionRepository usersConnectionRepository;

  @Autowired
  private FacebookConnectionSignup facebookConnectionSignup;


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
            .antMatchers("/signin/**").permitAll()
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

  @Bean
  public ProviderSignInController providerSignInController(
          FacebookSignInAdapter facebookSignInAdapter,
          @Value("${social-login-host}") String socialLoginHost,
          @Value("${social-redirect-url}") String socialRedirectUrl) {
    ((InMemoryUsersConnectionRepository) usersConnectionRepository)
            .setConnectionSignUp(facebookConnectionSignup);

    ProviderSignInController signInController = new ProviderSignInController(
            connectionFactoryLocator,
            usersConnectionRepository,
            facebookSignInAdapter);
    signInController.setSessionStrategy(new SocialSessionStrategy());
    signInController.setApplicationUrl(socialLoginHost);
    signInController.setPostSignInUrl(socialRedirectUrl);

    return signInController;
  }

}
