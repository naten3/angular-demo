package com.natenelles.timeapp.config.social;

import org.springframework.social.connect.Connection;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.User;
import org.springframework.social.google.api.Google;

public class SocialUtils {
    public static User getFacebookUser(Connection<?> connection) {
        return ((Connection<Facebook>) connection).getApi()
                .fetchObject("me", User.class, new String[]{"id", "email", "first_name", "last_name"});
    }

    public static Google getGoogleApi(Connection<?> connection) {
        return ((Connection<Google>) connection).getApi();
    }
}
