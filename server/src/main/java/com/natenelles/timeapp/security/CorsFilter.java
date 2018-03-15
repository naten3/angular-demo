package com.natenelles.timeapp.security;

import org.apache.catalina.connector.RequestFacade;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

//@Component
//@Order(Ordered.HIGHEST_PRECEDENCE)
class CorsFilter implements Filter {

  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
    HttpServletResponse response = (HttpServletResponse) res;
    response.setHeader("Access-Control-Allow-Origin", "*"); //TODO make this secure
    response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "x-requested-with, X-XSRF-TOKEN");
    response.setHeader("Access-Control-Max-Age", "3600");
    if (!"OPTIONS".equals(((RequestFacade) req).getMethod())) {
      try {
        chain.doFilter(req, res);
      } catch (Exception e) {
        //todo
      }
    }
  }

  public void init(FilterConfig filterConfig) {}

  public void destroy() {}

}
