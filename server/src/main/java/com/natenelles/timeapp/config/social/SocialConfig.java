package com.natenelles.timeapp.config.social;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.social.config.annotation.SocialConfigurerAdapter;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.support.ConnectionFactoryRegistry;
import org.springframework.social.facebook.connect.FacebookConnectionFactory;
import org.springframework.social.google.config.boot.GoogleAutoConfiguration;
import org.springframework.social.google.connect.GoogleConnectionFactory;

import javax.inject.Inject;

@Configuration
@Import(GoogleAutoConfiguration.class)
public class SocialConfig {

    @Value("${spring.social.google.app-id}")
    private static String googleClientId = "252423253731-mnl5a1gp4bm8gsb77pp3v85etnvkjoek.apps.googleusercontent.com";
    @Value("${spring.social.google.app-secret}")
    private static String googleClientSecret = "4viUayoE1p3KN8nqWD-V-gQG";
    @Value("${spring.social.facebook.app-id}")
    private static String facebookClientId;
    @Value("${spring.social.facebook.app-secret}")
    private static String facebookClientSecret;

    //@Bean
    //public ConnectionFactoryLocator connectionFactoryLocator() {
    //    ConnectionFactoryRegistry registry = new ConnectionFactoryRegistry();
    //    registry.addConnectionFactory(new GoogleConnectionFactory(googleClientId, googleClientSecret));
    //    registry.addConnectionFactory(new FacebookConnectionFactory(facebookClientId, facebookClientSecret));
    //    return registry;
    //}

    //@Bean
    //GoogleConnectionFactory googleConnectionFactory() {
    //    return new GoogleConnectionFactory(googleClientId, googleClientSecret);
    //}
}
