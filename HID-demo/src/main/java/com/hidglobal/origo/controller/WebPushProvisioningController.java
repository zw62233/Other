package com.hidglobal.origo.controller;

import com.hidglobal.origo.model.*;
import com.hidglobal.origo.properties.AppProperties;
import com.hidglobal.origo.service.WebPushProvisioningService;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/origo/webpush", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*")
public class WebPushProvisioningController {

    private final WebPushProvisioningService webPushProvisioningService;


//    @PostMapping("/v1/provision")
//    public ResponseEntity<ProvisioningWebResponse> getWalletProvisioningDetailsV1(@RequestBody ProvisioningWebRequest provisioningWebRequest, HttpServletRequest httpServletRequest) {
//        log.info("WebPushProvisioningController : getWalletProvisioningDetailsV1 : Start");
//        return new ResponseEntity<>(webPushProvisioningService.getWalletProvisioningDetailsV1(provisioningWebRequest), HttpStatus.OK);
//    }

    @PostMapping("/v2/provision")
    public ResponseEntity<ProvisioningWebResponse> getWalletProvisioningDetailsV2(@RequestBody WalletProvisioningRequest walletProvisioningRequest, HttpServletRequest httpServletRequest) {
        log.info("WebPushProvisioningController : getWalletProvisioningDetailsV2 : Start");
        return new ResponseEntity<>(webPushProvisioningService.getWalletProvisioningDetailsV2(walletProvisioningRequest, httpServletRequest), HttpStatus.OK);
    }

    @PostMapping("/v2/platforms")
    public ResponseEntity<ServiceListResponse> getSupportedPlatformDetails(@RequestBody AuthenticationRequest authenticationRequest, HttpServletRequest httpServletRequest) {
        log.info("WebPushProvisioningController : getSupportedPlatformDetails : Start");
        return new ResponseEntity<>(webPushProvisioningService.getSupportedPlatformDetails(authenticationRequest, httpServletRequest), HttpStatus.OK);
    }

    //AuthAPI
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> getAuthentication(@RequestBody AuthenticationRequest authenticationRequest, HttpServletRequest httpServletRequest) {
        log.info("WebPushProvisioningController : getAuthentication : Start");
        return new ResponseEntity<>(webPushProvisioningService.getAuthentication(authenticationRequest, httpServletRequest), HttpStatus.OK);
    }

    @GetMapping("/get-details")
    public ResponseEntity<AppProperties> getDetails() {
        log.info("WebPushProvisioningController : getDetails : Start");
        return new ResponseEntity<>(webPushProvisioningService.getDetails(), HttpStatus.OK);
    }

}
