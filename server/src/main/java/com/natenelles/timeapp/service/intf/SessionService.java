package com.natenelles.timeapp.service.intf;

import org.springframework.security.core.GrantedAuthority;

import java.util.Set;

public interface SessionService {

    void handleLogin(long userId, String sessionId);

    void handleLogout(long userId, String sessionId);

    void handleDeleteUser(long userId);

    void handleChangeRoles(long userId, Set<? extends GrantedAuthority> authorities);
}
