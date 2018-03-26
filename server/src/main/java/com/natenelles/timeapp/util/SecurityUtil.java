package com.natenelles.timeapp.util;

import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.exception.UnauthorizedException;
import com.natenelles.timeapp.security.CustomSpringUser;

public class SecurityUtil {
    public static void checkOwnerOrUserAdmin(CustomSpringUser principal, long userId) {
        if ((principal).getId() != userId && !principal.hasAuthority(UserRole.USER_ADMIN)
                && !principal.hasAuthority(UserRole.ADMIN)) {
            throw new UnauthorizedException();
        }
    }

    public static void checkOwnerOrAdmin(CustomSpringUser principal, long userId) {
        if ((principal).getId() != userId && !principal.hasAuthority(UserRole.ADMIN)) {
            throw new UnauthorizedException();
        }
    }

    public static void checkUserAdmin(CustomSpringUser principal) {
        if (!principal.hasAuthority(UserRole.USER_ADMIN) && !principal.hasAuthority(UserRole.ADMIN)) {
            throw new UnauthorizedException();
        }
    }
}
