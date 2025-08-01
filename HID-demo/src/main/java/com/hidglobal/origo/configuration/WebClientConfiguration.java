package com.hidglobal.origo.configuration;

import com.hidglobal.origo.properties.AppProperties;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;

@Slf4j
@Configuration
public class WebClientConfiguration {

    private final AppProperties appProperties;

    @Autowired
    public WebClientConfiguration(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public WebClient wwpWebClient() {
        return WebClient.builder()
                .baseUrl(appProperties.getProvisioningUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient()))
                .build();
    }

    @Bean
    public WebClient authWebClient() {
        return WebClient.builder()
                .baseUrl(appProperties.getAuthUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient()))
                .build();
    }

    @Bean
    public WebClient googleWebClient() {
        return WebClient.builder()
                .baseUrl(appProperties.getGoogle().getProvisioningUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient()))
                .build();
    }

    private HttpClient httpClient() {
        try {
            SslContext sslContext = SslContextBuilder.forClient().trustManager(InsecureTrustManagerFactory.INSTANCE).build();
            return HttpClient.create().secure(sslContextSpec -> sslContextSpec.sslContext(sslContext));
        } catch (SSLException e) {
            log.error("Failed to create SSL context", e);
            throw new RuntimeException("SSL context creation failed", e);
        }
    }
}