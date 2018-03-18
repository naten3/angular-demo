package com.natenelles.timeapp.config.social;

import org.springframework.social.connect.Connection;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.User;

public class SocialUtils {
    public static User getFacebookUser(Connection<?> connection) {
        return ((Connection<Facebook>) connection).getApi()
                .fetchObject("me", User.class, new String[]{"id", "email", "first_name", "last_name"});
    }
}
