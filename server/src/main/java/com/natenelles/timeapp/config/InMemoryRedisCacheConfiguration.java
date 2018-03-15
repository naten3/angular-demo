package com.natenelles.timeapp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import redis.embedded.RedisServer;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;

@Configuration
@Profile({ "local" })
public class InMemoryRedisCacheConfiguration {

  protected RedisServer redisServer;
  protected final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

  @Value("${cache.expiration.default:10800}")
  private long cacheExpirationDefault;
    /**
     * Start an embedded Redis server instance if the application is being
     * run locally (application property spring.redist.host is null or empty).
     *
     * @throws IOException
     */
    @PostConstruct
    public void startEmbeddedRedis() throws IOException {
        redisServer = new RedisServer(6380);
        redisServer.start();
        LOGGER.info("Started embedded Redis server on port 6380");
    }

    /**
     * Stop the embedded Redis server instance if it is running.
     */
    @PreDestroy
    public void stopEmbeddedRedis() {
        redisServer.stop();
        System.out.println("Stopped embedded Redis server running on port 6380");
    }

}
