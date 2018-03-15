package com.natenelles.timeapp.service.intf;

public interface EmailService {
    void sendUserVerificationEmail(String email, String token, long userId);
}
