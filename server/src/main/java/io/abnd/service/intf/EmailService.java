package io.abnd.service.intf;

public interface EmailService {
    void sendUserVerificationEmail(String email, String token, String username);
}
