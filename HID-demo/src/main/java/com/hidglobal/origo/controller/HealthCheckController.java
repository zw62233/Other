package com.hidglobal.origo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    @GetMapping("health")
    public ResponseEntity<Void> health() {
        return ResponseEntity.noContent().build();
    }
}
