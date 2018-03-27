package com.natenelles.timeapp.service.impl;

import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.Multimap;
import com.natenelles.timeapp.service.intf.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.session.SessionRepository;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    UsersConnectionRepository usersConnectionRepository;

    Multimap<Long,String> userIdToSessionIds = LinkedListMultimap.create();

    @Override
    public void handleLogin(long userId, String sessionId) {
        userIdToSessionIds.put(userId, sessionId);
    }

    @Override
    public void handleLogout(long userId, String sessionId) {
        userIdToSessionIds.remove(userId, sessionId);
    }

    @Override
    public void handleDeleteUser(long userId) {
        Optional.ofNullable(userIdToSessionIds.get(userId)).ifPresent(sessionIds -> {
            sessionIds.forEach((sessionRepository::delete));
        });
    }

    @Override
    public void handleChangeRoles(long userId, Set<? extends GrantedAuthority> authorities) {
        //For now just log them out, maybe something else in the future
        handleDeleteUser(userId);
    }
}
