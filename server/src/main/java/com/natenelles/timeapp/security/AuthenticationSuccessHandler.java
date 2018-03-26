package com.natenelles.timeapp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.natenelles.timeapp.model.users.UserResponse;
import com.natenelles.timeapp.service.intf.SessionService;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  final String AUTH_TOKEN_HEADER = "x-auth-token";

  @Autowired
  private ObjectMapper jacksonObjectMapper;
  @Autowired
  private UserService userService;
  @Autowired
  SessionService sessionService;



  private RequestCache requestCache = new HttpSessionRequestCache();

  @Override
  public void onAuthenticationSuccess(
  HttpServletRequest request,
  HttpServletResponse response,
  Authentication authentication)
  throws ServletException, IOException

  {
    userService.resetInvalidLoginCount(((CustomSpringUser) authentication.getPrincipal()).getId());


    SavedRequest savedRequest = requestCache.getRequest(request, response);

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    CustomSpringUser user = ((CustomSpringUser) authentication.getPrincipal());

    //Save session key
    sessionService.handleLogin(user.getId(), RequestContextHolder.currentRequestAttributes().getSessionId());

    //Add user info to response

    UserResponse userResponse = userService.getUser(user.getId()).orElseThrow(ServletException::new);
    response.getWriter().write(jacksonObjectMapper.writeValueAsString(userResponse));

    if (savedRequest == null) {
      clearAuthenticationAttributes(request);
      return;
    }
    String targetUrlParam = getTargetUrlParameter();
    if (isAlwaysUseDefaultTargetUrl()
    || (targetUrlParam != null
    && StringUtils.hasText(request.getParameter(targetUrlParam)))) {
      requestCache.removeRequest(request, response);
      clearAuthenticationAttributes(request);
      return;
    }

    clearAuthenticationAttributes(request);
  }

  public void setRequestCache(RequestCache requestCache) {
    this.requestCache = requestCache;
  }
}
