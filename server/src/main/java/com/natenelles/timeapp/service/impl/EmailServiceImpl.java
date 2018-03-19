package com.natenelles.timeapp.service.impl;

import com.natenelles.timeapp.service.intf.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService{
    @Value("${email-verification-url}")
    private String emailVerificationBaseUrl;

    @Value("${user-invite-url}")
    private String userInviteUrl;

    JavaMailSender emailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Async
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

    @Async
    @Override
    public void sendUserInviteEmail(String email, String token) {
        String userInviteUrl = getUserInviteUrl(token);
        String messageText = getUserInviteMessage(userInviteUrl);

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Time Viewer Registration Invite");
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

    private static String getUserInviteMessage(String url) {
        return String.format("You've been invited to register to Time Viewer! Follow the link to complete registration: %s", url);
    }

    private String getUserInviteUrl(String token) {
        return String.format("%s?token=%s", userInviteUrl, token);
    }
}
