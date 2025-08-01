package com.hidglobal.origo.exception;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class ResponseHeader {
    @JsonProperty
    private String statusCode;
    @JsonProperty
    private String subStatusCode;
    @JsonProperty
    private String statusMessage;
}
