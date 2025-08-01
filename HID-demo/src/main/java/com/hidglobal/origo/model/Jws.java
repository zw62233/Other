package com.hidglobal.origo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Jws {

    @JsonProperty("protected")
    private String protectedd;
    private String payload;
    private String signature;
    private Header header;
}
