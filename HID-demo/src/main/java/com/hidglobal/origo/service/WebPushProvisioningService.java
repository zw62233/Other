package com.hidglobal.origo.service;


import com.hidglobal.origo.exception.CustomException;
import com.hidglobal.origo.exception.Message;
import com.hidglobal.origo.model.*;
import com.hidglobal.origo.properties.AppProperties;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Random;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
public class WebPushProvisioningService {

    private static final Random rand = new Random();
    public static final String HTTP_HEADER_X_REQUEST_ID = "x-requestId";
    public static final String HTTP_HEADER_APPLICATION_ID = "Application-ID";
    public static final String HTTP_ERROR_404_MESSAGE = "The requested resource is not found";
    public static final String INTERNAL_SERVER_ERROR = "Internal Server Error";
    public static final String INCORRECT_AUTHORIZATION_HEADER = "The Authorization header is missing or contains an invalid access token";

    private final WebClient wwpWebClient;

    private final WebClient authWebClient;

    private final WebClient googleWebClient;

    private final AppProperties appProperties;


//    public ProvisioningWebResponse getWalletProvisioningDetailsV1(ProvisioningWebRequest provisioningWebRequest) {
//
//        return wwpWebClient.post()
//                .uri(uriBuilder -> uriBuilder.path("/v1/provision").build())
//                .body(Mono.just(provisioningWebRequest), ProvisioningWebRequest.class)
//                .header(HTTP_HEADER_X_REQUEST_ID, "12312384")
//                .header(HTTP_HEADER_APPLICATION_ID, "HID-MOBILE_ACCESS")
//                .retrieve()
//                .onStatus(httpStatus -> httpStatus.value() == 400, error -> Mono.error(new CustomException(400, "Not Found")))
//                .onStatus(httpStatus -> httpStatus.value() == 401, error -> Mono.error(new CustomException(401, INCORRECT_AUTHORIZATION_HEADER)))
//                .onStatus(httpStatus -> httpStatus.value() == 404, error -> Mono.error(new CustomException(404, HTTP_ERROR_404_MESSAGE)))
//                .onStatus(HttpStatusCode::is5xxServerError, clientResponse -> Mono.error(new CustomException(500, INTERNAL_SERVER_ERROR)))
//                .bodyToMono(ProvisioningWebResponse.class)
//                .doOnError(error -> log.error("", error))
//                .block();
//    }

    public ProvisioningWebResponse getWalletProvisioningDetailsV2(WalletProvisioningRequest walletProvisioningRequest, HttpServletRequest httpServletRequest) {

        if (walletProvisioningRequest.getWalletType() == null) {
            throw new CustomException(400, "Wallet Type is missing");
        }
        if (walletProvisioningRequest.getWalletType().equals("GOOGLE_WALLET") && walletProvisioningRequest.getGoogleWallet() == null) {
            throw new CustomException(400, "Google Wallet Details are missing");
        }
        ProvisioningWebRequest provisioningWebRequest = constructProvisioningWebRequest(walletProvisioningRequest);
        System.out.println("Request: " + provisioningWebRequest.toString());

        String authHeader = httpServletRequest.getHeader("Authorization") != null ? httpServletRequest.getHeader("Authorization") : null;
        System.out.println("Authorization Header: " + authHeader);
        if (authHeader == null) {
            throw new CustomException(401, "Unauthorized Request");
        }
        // try{
        //   System.out.println("provisioningWebRequest: " + new ObjectMapper().writeValueAsString(provisioningWebRequest));
        // }
        // catch(JsonProcessingException e){
        //     System.out.println(e.getMessage);
        // }
        return wwpWebClient.post()
                .uri(uriBuilder -> uriBuilder.path("/v2/provision").build())
                .body(Mono.just(provisioningWebRequest), ProvisioningWebRequest.class)
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .header(HTTP_HEADER_X_REQUEST_ID, generateRandomString(8))
                .header(HTTP_HEADER_APPLICATION_ID, appProperties.getApplicationId())
                .retrieve()
                .onStatus(HttpStatus::isError, response -> response.bodyToMono(Message.class)
                        .flatMap(error -> Mono.error(new CustomException(Integer.parseInt(error.getResponseHeader().getStatusCode()), error.getResponseHeader()))))
                .bodyToMono(ProvisioningWebResponse.class)
                .doOnError(error -> log.error("", error))
                .block();
    }

    private ProvisioningWebRequest constructProvisioningWebRequest(WalletProvisioningRequest walletProvisioningRequest) {
        String linkingTokenObj = null;
        if (walletProvisioningRequest.getWalletType().equals("GOOGLE_WALLET")) {
            GoogleWalletCreds googleWalletCreds = walletProvisioningRequest.getGoogleWallet();
            String idToken = googleWalletCreds.getIdToken();
            TokenInfoResponse tokenInfoResponse = googleWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/oauth2/v3/tokeninfo")
                            .queryParam("id_token", idToken)
                            .build())
                    .header(HTTP_HEADER_X_REQUEST_ID, generateRandomString(8))
                    .header(HTTP_HEADER_APPLICATION_ID, appProperties.getApplicationId())
                    .retrieve()
                    .onStatus(HttpStatus::isError, response -> response.bodyToMono(Message.class)
                            .flatMap(error -> Mono.error(new CustomException(Integer.parseInt(error.getResponseHeader().getStatusCode()), error.getResponseHeader()))))
                    .bodyToMono(TokenInfoResponse.class)
                    .doOnError(error -> log.error("", error))
                    .block();

            try {
                if (tokenInfoResponse != null) {
                    linkingTokenObj = getLinkingTokenObject(tokenInfoResponse.getSub(), tokenInfoResponse.getAud());
                }
            } catch (Exception e) {
                System.out.println("Error while getting linking token");
                System.out.println(e.getMessage());
                throw new CustomException(500, INTERNAL_SERVER_ERROR);
            }
        }

        if (walletProvisioningRequest.getWalletType().equals("GOOGLE_WALLET")) {
            return ProvisioningWebRequest.builder()
                    .issuanceToken(walletProvisioningRequest.getIssuanceToken())
                    .applicationId("HID-MOBILE_ACCESS")
                    .web(WebProperties.builder().language("en-US").build())
                    .googleWallet(GoogleWalletRequest.builder().type("CORPORATE_ID_WEB").version("V1").linkingTokenObject(linkingTokenObj).build())
                    .build();
        } else {
            return ProvisioningWebRequest.builder()
                    .issuanceToken(walletProvisioningRequest.getIssuanceToken())
                    .applicationId("HID-MOBILE_ACCESS")
                    .web(WebProperties.builder().language("en-US").build())
                    .appleWallet(AppleWalletRequest.builder().type("CORPORATE_ID_WEB").version("V1").build())
                    .build();
        }
    }

    private String getLinkingTokenObject(String sub, String aud) throws NoSuchAlgorithmException {
        String nonce = UUID.randomUUID().toString();
        String concatenated = sub + nonce;
        String hashedUserId = DigestUtils.sha256Hex(concatenated);
        String linkingTokenObject = String.format("{\"nonce\":\"%s\",\"hashedUserId\":\"%s\",\"aud\":\"%s\"}", nonce, hashedUserId, aud);
        System.out.println("Linking Token : " + linkingTokenObject);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(linkingTokenObject.getBytes(StandardCharsets.UTF_8));
    }

    /*private String getLinkingTokenObject(String sub, String aud) throws NoSuchAlgorithmException {
        String nonce = UUID.randomUUID().toString();
        String concatenated = sub + nonce;
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashedBytes = digest.digest(concatenated.getBytes(StandardCharsets.UTF_8));
        String hashedUserId = Base64.getUrlEncoder().withoutPadding().encodeToString(hashedBytes);
        String linkingTokenObject = String.format("{\"nonce\":\"%s\",\"hashedUserId\":\"%s\",\"aud\":\"%s\"}", nonce, hashedUserId, aud);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(linkingTokenObject.getBytes(StandardCharsets.UTF_8));
    }*/

    public ServiceListResponse getSupportedPlatformDetails(AuthenticationRequest authenticationRequest, HttpServletRequest httpServletRequest) {

        ServiceListRequest serviceListRequest = ServiceListRequest.builder().issuanceToken(authenticationRequest.getIssuanceToken()).applicationId("HID-MOBILE_ACCESS").build();

        String authHeader = httpServletRequest.getHeader("Authorization") != null ? httpServletRequest.getHeader("Authorization") : null;
        System.out.println("Authorization Header: " + authHeader);
        if (authHeader == null) {
            throw new CustomException(401, "Unauthorized Request");
        }

        return wwpWebClient.post()
                .uri(uriBuilder -> uriBuilder.path("/v2/platforms").build())
                .body(Mono.just(serviceListRequest), ServiceListRequest.class)
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .header(HTTP_HEADER_X_REQUEST_ID, generateRandomString(8))
                .header(HTTP_HEADER_APPLICATION_ID, appProperties.getApplicationId())
                .retrieve()
                .onStatus(HttpStatus::isError, response -> response.bodyToMono(Message.class)
                        .flatMap(error -> Mono.error(new CustomException(Integer.parseInt(error.getResponseHeader().getStatusCode()), error.getResponseHeader()))))
                .bodyToMono(ServiceListResponse.class)
                .doOnError(error -> log.error("", error))
                .block();
    }

    public AuthenticationResponse getAuthentication(AuthenticationRequest authenticationRequest, HttpServletRequest httpServletRequest) {

        TokenRequest tokenRequest = TokenRequest.builder()
                .clientId(appProperties.getClientDetails().getClientId())
                .clientSecret(appProperties.getClientDetails().getClientSecret())
                .grantType("client_credentials")
                .build();

        TokenResponse tokenResponse = authWebClient.post()
                .uri(uriBuilder -> uriBuilder.path("/authentication/customer/{org-id}/token").build(appProperties.getClientDetails().getOrganizationId()))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header(HTTP_HEADER_X_REQUEST_ID, appProperties.getClientDetails().getOrganizationId())
                .body(BodyInserters.fromFormData("client_id", tokenRequest.getClientId())
                        .with("client_secret", tokenRequest.getClientSecret())
                        .with("grant_type", tokenRequest.getGrantType()))
                .retrieve()
                .onStatus(HttpStatus::isError, response -> response.bodyToMono(Message.class)
                        .flatMap(error -> Mono.error(new CustomException(Integer.parseInt(error.getResponseHeader().getStatusCode()), error.getResponseHeader()))))
                .bodyToMono(TokenResponse.class)
                .doOnError(error -> log.error("", error))
                .block();

        return AuthenticationResponse.builder().accessToken(tokenResponse.getAccessToken()).build();  //TokenResponse
    }

    public AppProperties getDetails() {
        return appProperties;
//       return new ObjectMapper().convertValue(appProperties, new TypeReference<Map<String, Object>>() {});
    }

    public String generateRandomString(int n) {
        byte[] array = new byte[256];
        rand.nextBytes(array);
        String randomString = new String(array, StandardCharsets.UTF_8);
        StringBuilder sb = new StringBuilder();

        for (int k = 0; k < randomString.length(); k++) {
            char ch = randomString.charAt(k);
            if (((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) && (n > 0)) {
                sb.append(ch);
                n--;
            }
        }
        return sb.toString();
    }
}