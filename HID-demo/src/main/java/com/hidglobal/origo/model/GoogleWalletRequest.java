package com.hidglobal.origo.model;

import javax.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class GoogleWalletRequest {
    private String sessionId;

    @NotBlank
    private String version;

    @NotBlank
    private String type;

    @NotBlank
    private String linkingTokenObject;
}