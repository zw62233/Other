package com.hidglobal.origo.exception;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {

    @JsonProperty
    private ResponseHeader responseHeader;

    public Message() {
    }

    public Message(ResponseHeader responseHeader) {
        this.responseHeader = responseHeader;
    }
}
