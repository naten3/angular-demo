package com.natenelles.timeapp.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class UserInvite {
    @Id
    String email;
    String verificationToken;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }
}
