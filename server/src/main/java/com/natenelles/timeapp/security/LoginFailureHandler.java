package com.natenelles.timeapp.security;

import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class LoginFailureHandler implements AuthenticationFailureHandler {
    @Autowired
    UserService userService;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        Optional.ofNullable(request.getParameter("username"))
                .ifPresent(username -> userService.handleLoginFailure(username));
    }
}
