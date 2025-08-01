package com.hidglobal.origo.model;

import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppleWalletRequest {
    @NotBlank
    private String type;

    @NotBlank
    private String version;
}