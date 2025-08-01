package com.hidglobal.origo.exception;

public class CustomException extends RuntimeException {

    private final int statusCode;
    private final ResponseHeader responseHeader;

    public CustomException(int statusCode, ResponseHeader responseHeader) {
        super(responseHeader.getStatusMessage());
        this.statusCode = statusCode;
        this.responseHeader = responseHeader;
    }

    public CustomException(int statusCode, String message) {
        super(message);
        this.statusCode = statusCode;
        ResponseHeader responseHeader = new ResponseHeader();
        responseHeader.setSubStatusCode(String.valueOf(statusCode));
        responseHeader.setStatusMessage(message);
        this.responseHeader = responseHeader;
    }


    public int getStatusCode() {
        return statusCode;
    }

    public ResponseHeader getResponseHeader() {
        return responseHeader;
    }
}
