package com.natenelles.timeapp.model.users;

import javax.validation.constraints.Size;

public class SignupInvite {
    @Size(min = 2, max = 300)
    String email;

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
