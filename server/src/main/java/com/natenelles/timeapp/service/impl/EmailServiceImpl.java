package com.natenelles.timeapp.service.impl;

import com.natenelles.timeapp.service.intf.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService{
    @Value("${email-verification-url}")
    private String emailVerificationBaseUrl;

    JavaMailSender emailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendUserVerificationEmail(String userEmail, String token, long userId) {
        String verificationUrl = getUserVerificationUrl(userId, token);
        String messageText = getEmailVerificationMessageText(verificationUrl);

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true);
            helper.setTo(userEmail);
            helper.setSubject("Verify Your Account With Time Viewer");
            helper.setText(messageText);
            emailSender.send(message);
        } catch (MessagingException m) {
            throw new RuntimeException(m);
        }
    }

    private static String getEmailVerificationMessageText(String url) {
        return String.format("Thank you for signing up for Time Viewer! Please follow the verification link to activate your account: %s " +
                "If you did not sign up please disregard this email.", url);
    }

    private String getUserVerificationUrl(long userId, String token) {
        return String.format("%s?userId=%s&token=%s", emailVerificationBaseUrl, userId, token);
    }
}
