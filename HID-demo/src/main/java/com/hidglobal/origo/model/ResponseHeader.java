package com.hidglobal.origo.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseHeader {
    private String statusCode;
    private String subStatusCode;
    private String statusMessage;
}