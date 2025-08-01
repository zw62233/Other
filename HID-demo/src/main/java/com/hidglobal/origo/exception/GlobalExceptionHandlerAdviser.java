package com.hidglobal.origo.exception;

import com.hidglobal.origo.properties.AppProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandlerAdviser {
    private final AppProperties appProperties;

    @Autowired
    public GlobalExceptionHandlerAdviser(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Message> internalServerErrorHandler(CustomException e) {
        log.error("Error log in Advice", e);
        final ResponseHeader response = e.getResponseHeader();
        if (response != null && response.getStatusCode() != null && response.getStatusCode().equals("400")) {
            log.error("Error from provision system: {}", response);
            if (appProperties.getErrorMappingDetails() != null && !appProperties.getErrorMappingDetails().isEmpty()) {
                if (appProperties.getErrorMappingDetails().containsKey(response.getSubStatusCode())) {
                    response.setStatusMessage(appProperties.getErrorMappingDetails().get(response.getSubStatusCode()));
                }
            } else {
                // Default configuration for error mapping
                String subStatusCode = response.getSubStatusCode();
                switch (subStatusCode) {
                    case "INVALID_ISSUANCE_TOKEN":
                    case "ISSUANCE_TOKEN_EXPIRED":
                    case "UN_SUPPORTED_REQUEST":
                        response.setStatusMessage("There was an issue processing your request. If this issue continues, the link may have expired or is no longer valid. Please request a new one or contact support for assistance");
                        break;
                    case "CARD_IN_TOO_MANY_WALLETS":
                        response.setStatusMessage("You already have a card on your device. If you don't see it or face any issues, please contact support for assistance");
                        break;
                }
            }
        } else {
            log.error("response from provision system is empty");
        }
        return ResponseEntity.status(e.getStatusCode() != 0 ? e.getStatusCode() : INTERNAL_SERVER_ERROR.value())
                .body(new Message(response));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Message> internalServerErrorHandler(Exception e) {
        log.error("Error log in Advice", e);
        ResponseHeader responseHeader = new ResponseHeader();
        responseHeader.setStatusCode("500");
        responseHeader.setStatusMessage("Internal Server Error");
        responseHeader.setSubStatusCode("INTERNAL_SERVER_ERROR");
        return ResponseEntity.status(INTERNAL_SERVER_ERROR.value())
                .body(new Message(responseHeader));
    }
}
