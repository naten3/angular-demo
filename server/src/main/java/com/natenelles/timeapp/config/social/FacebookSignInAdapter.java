package com.natenelles.timeapp.config.social;

import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.security.CustomSpringUser;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.web.SignInAdapter;
import org.springframework.social.support.URIBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import static com.natenelles.timeapp.config.social.FacebookConnectionSignup.DUMMY;
import static com.natenelles.timeapp.config.social.SocialUtils.getFacebookUser;

@Component
public class FacebookSignInAdapter implements SignInAdapter {
    @Autowired
    private UserService userService;

    @Value("${social-redirect-url}")
    private String socialRedirectUrl;

    @Override
    public String signIn(String localUserId, Connection<?> connection, NativeWebRequest request) {
        //TODO make this more secure
        User user = userService.getByUsername(localUserId).orElseThrow(() -> new IllegalStateException("No user found with fb id"));

        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(UserRole::getRoleName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
        CustomSpringUser customSpringUser = new CustomSpringUser
                (user.getUsername(),
                        user.getPassword(), true, true,
                        true, true, authorities, user.getId());

        //This is a hack to authenticate
        UsernamePasswordAuthenticationToken principal = new UsernamePasswordAuthenticationToken(customSpringUser, DUMMY);

        SecurityContextHolder.getContext().setAuthentication(principal);

        String authToken = RequestContextHolder.currentRequestAttributes().getSessionId();
        String redirectUrl = URIBuilder.fromUri(socialRedirectUrl).queryParam("x-auth-token", authToken).build().toString();

        return redirectUrl;
    }
}
