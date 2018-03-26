package com.natenelles.timeapp.security;

import com.natenelles.timeapp.service.intf.SessionService;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomLogoutHandler implements LogoutSuccessHandler {

    @Autowired
    SessionService sessionService;

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (authentication != null) {
            long id = ((CustomSpringUser) authentication.getPrincipal()).getId();
            sessionService.handleLogout(id, RequestContextHolder.currentRequestAttributes().getSessionId());
            response.setStatus(HttpStatus.OK.value());
        }
    }
}
