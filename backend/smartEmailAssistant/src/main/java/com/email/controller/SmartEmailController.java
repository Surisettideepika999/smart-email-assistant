package com.email.controller;

import com.email.model.request.EmailRequest;
import com.email.service.SmartEmailService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class SmartEmailController {
    private final SmartEmailService service;

    public SmartEmailController(SmartEmailService service) {
        this.service = service;
    }

    @PostMapping("/getSuggestion")
    public String getMessage(@RequestBody EmailRequest emailRequest){
        return service.getContent(emailRequest);
    }
}
