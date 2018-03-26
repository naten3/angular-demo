package com.natenelles.timeapp.config.social;

import com.google.common.collect.ImmutableSet;
import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionSignUp;
import org.springframework.social.google.api.Google;
import org.springframework.social.google.api.oauth2.UserInfo;
import org.springframework.social.google.api.plus.Person;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.natenelles.timeapp.config.social.SocialUtils.getFacebookUser;
import static com.natenelles.timeapp.config.social.SocialUtils.getGoogleApi;

@Service
public class SocialConnectionSignup implements ConnectionSignUp {
    public static final String FACEBOOK_NAME_PREFIX = "~FB";
    public static final String GOOGLE_NAME_PREFIX = "~GP";
    public static final String DUMMY = "DUMMY";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public String execute(Connection<?> connection) {
        if(connection.getKey().getProviderId().equals("google")) {
            return googleSignup(connection);
        } else if (connection.getKey().getProviderId().equals("facebook")) {
            return facebookSignup(connection);
        } else {
            throw new IllegalArgumentException("Unrecognized provider");
        }
    }

    private String facebookSignup(Connection<?> connection) {
        org.springframework.social.facebook.api.User facebookUser = getFacebookUser(connection);
        User user = new User();
        user.setUsername(FACEBOOK_NAME_PREFIX + facebookUser.getId());
        //this is not ideal
        user.setPassword(passwordEncoder.encode(DUMMY));
        user.setEmail(facebookUser.getEmail());
        user.setEmailVerified(true);
        user.setFirstName(facebookUser.getFirstName());
        user.setLastName(facebookUser.getLastName());
        user.setSocialProfileImage(Optional.of(connection.getImageUrl()));
        user.setRoles(ImmutableSet.of(new UserRole(UserRole.USER), new UserRole(UserRole.FACEBOOK_USER)));
        user.setFacebookId(Optional.of(facebookUser.getId()));
        userRepository.save(user);

        return user.getUsername();
    }

    private String googleSignup(Connection<?> connection) {
        Google google = getGoogleApi(connection);
        UserInfo userInfo = google.oauth2Operations().getUserinfo();
        User user = new User();
        user.setUsername(GOOGLE_NAME_PREFIX + userInfo.getId());
        //this is not ideal
        user.setPassword(passwordEncoder.encode(DUMMY));
        user.setEmail(userInfo.getEmail());
        user.setEmailVerified(true);
        user.setFirstName(userInfo.getGivenName());
        user.setLastName(userInfo.getFamilyName());
        user.setSocialProfileImage(Optional.of(userInfo.getPicture()));
        user.setRoles(ImmutableSet.of(new UserRole(UserRole.USER), new UserRole(UserRole.GOOGLE_USER)));
        user.setGoogleId(Optional.of(userInfo.getId()));
        userRepository.save(user);

        return user.getUsername();
    }
}
