package com.hidglobal.origo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenInfoResponse {
    private String iss;
    private String azp;
    private String aud;
    private String sub;
    private String hd;
    private String email;
    private boolean emailVerified;
    private String nonce;
    private long nbf;
    private String name;
    private String picture;
    private String givenName;
    private String familyName;
    private String locale;
    private long iat;
    private long exp;
    private String jti;
}