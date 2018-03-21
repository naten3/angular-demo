package com.natenelles.timeapp.config.social;

import com.google.common.collect.ImmutableSet;
import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionSignUp;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.natenelles.timeapp.config.social.SocialUtils.getFacebookUser;

@Service
public class FacebookConnectionSignup implements ConnectionSignUp {
    public static final String FACEBOOK_NAME_PREFIX = "~FB";
    public static final String DUMMY = "DUMMY";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public String execute(Connection<?> connection) {
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
}
