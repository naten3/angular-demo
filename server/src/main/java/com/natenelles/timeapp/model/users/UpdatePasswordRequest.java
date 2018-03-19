package com.natenelles.timeapp.model.users;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class UpdatePasswordRequest {
    @NotNull
    @Size(max = 100,  min = 2)
    String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
