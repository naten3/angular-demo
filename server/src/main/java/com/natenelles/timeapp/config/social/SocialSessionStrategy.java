package com.natenelles.timeapp.config.social;

import org.springframework.social.connect.web.SessionStrategy;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.ServletWebRequest;

public class SocialSessionStrategy implements SessionStrategy {
    public void setAttribute(RequestAttributes request, String name, Object value) {
        request.setAttribute(name, value, RequestAttributes.SCOPE_SESSION);
    }

    public Object getAttribute(RequestAttributes request, String name) {

        ServletWebRequest servletWebRequest = (ServletWebRequest) request;
        return servletWebRequest.getParameter(getRealAttributeName(name));
    }

    public void removeAttribute(RequestAttributes request, String name) {
        request.removeAttribute(name, RequestAttributes.SCOPE_SESSION);
    }

    //*oauth2State is wrong for facebook, oauthToken is wrong for Twitter
    private static String getRealAttributeName(String name) {
        if (name.equals("oauth2State")) {
            return "state";
        } else if (name.equals("oauthToken")) {
            return "oauth_token";
        }
        else {
            return name;
        }
    }
}
