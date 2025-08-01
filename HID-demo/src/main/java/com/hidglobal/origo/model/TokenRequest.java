package com.hidglobal.origo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenRequest {
    private String clientId;
    private String clientSecret;
    private String grantType;
}