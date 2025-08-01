package com.hidglobal.origo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {

    @GetMapping("/wpp/token")
    public String token() {
        return "forward:/"; // Redirects to UI page
    }

    @GetMapping("/wpp")
    public String home() {
        return "redirect:/wpp/token"; // Redirects to UI page
    }

    @GetMapping("/wpp/redeem")
    public String redeem(@RequestParam("issuanceCode") String issuanceCode) {
        return "forward:/?issuanceCode=" + issuanceCode; // Redirects to UI page
    }

}
