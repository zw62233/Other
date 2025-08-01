package com.hidglobal.origo.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "web-push")
public class AppProperties {
    private String profile;
    private String applicationId;
    private String authUrl;
    private String provisioningUrl;
    private ClientDetails clientDetails;
    private GoogleConfig google;
    private Map<String, String> errorMappingDetails;

    @Getter
    public static class ClientDetails {
        private String organizationId;
        private String clientId;
        private String clientSecret;

        public ClientDetails setOrganizationId(String organizationId) {
            this.organizationId = organizationId;
            return this;
        }

        public ClientDetails setClientId(String clientId) {
            this.clientId = clientId;
            return this;
        }

        public ClientDetails setClientSecret(String clientSecret) {
            this.clientSecret = clientSecret;
            return this;
        }
    }


    @Getter
    public static class GoogleConfig {
        private String clientId;
        private String clientSecret;
        private String redirectUrl;
        private String provisioningUrl;

        public GoogleConfig setClientId(String clientId) {
            this.clientId = clientId;
            return this;
        }

        public GoogleConfig setClientSecret(String clientSecret) {
            this.clientSecret = clientSecret;
            return this;
        }

        public GoogleConfig setRedirectUrl(String redirectUrl) {
            this.redirectUrl = redirectUrl;
            return this;
        }

        public GoogleConfig setProvisioningUrl(String provisioningUrl) {
            this.provisioningUrl = provisioningUrl;
            return this;
        }
    }
}
