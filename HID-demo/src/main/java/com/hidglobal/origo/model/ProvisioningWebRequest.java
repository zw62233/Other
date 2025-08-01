package com.hidglobal.origo.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include. NON_NULL)
public class ProvisioningWebRequest {

    private String issuanceToken;
    private String applicationId;
    private WebProperties web;
    private AppleWalletRequest appleWallet;
    private GoogleWalletRequest googleWallet;

}
