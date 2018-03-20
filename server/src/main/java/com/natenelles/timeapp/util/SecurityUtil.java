package com.natenelles.timeapp.util;

import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.exception.UnauthorizedException;
import com.natenelles.timeapp.security.CustomSpringUser;

public class SecurityUtil {
    public static void checkUserOrAdmin(CustomSpringUser principal, long userId) {
        if ((principal).getId() != userId && !principal.hasAuthority(UserRole.USER_ADMIN)
                && !principal.hasAuthority(UserRole.ADMIN)) {
            throw new UnauthorizedException();
        }
    }
}
