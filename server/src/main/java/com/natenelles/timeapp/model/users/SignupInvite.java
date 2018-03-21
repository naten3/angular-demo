package com.natenelles.timeapp.model.users;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class SignupInvite {
    @NotNull
    @Size(min = 2, max = 300)
    String email;

    public SignupInvite() {}

    public SignupInvite(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
