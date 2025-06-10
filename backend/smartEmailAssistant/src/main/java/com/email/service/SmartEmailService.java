package com.email.service;

import com.email.model.request.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class SmartEmailService {
    @Value("${GEMINI.API.KEY}")
    private String GEMINI_API_KEY;
    @Value("${GEMINI.API.URL}")
    private  String GEMINI_URL;
    private WebClient webClient;
    public SmartEmailService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public String getContent(EmailRequest emailRequest) {
        System.out.println(GEMINI_URL+GEMINI_API_KEY);
        String prompt= getPrompt(emailRequest);
        Map<String, Object> requestBody=Map.of("contents",new Object[]{
                Map.of("parts",new Object[]{
                        Map.of("text",prompt)
                })
        });
       String response= webClient.post()
                .uri(GEMINI_URL+GEMINI_API_KEY)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return extractResponse(response);
    }

    private String extractResponse(String response) {
        try {
            ObjectMapper objectMapper=new ObjectMapper();
            JsonNode rootNode=objectMapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }catch (Exception e){
            return "Error processing request "+e.getMessage();
        }
    }

    private String getPrompt(EmailRequest emailRequest) {
        StringBuilder prompt=new StringBuilder();
        prompt.append("Generate a response for the following email. Don't include subject line. ");
        if(emailRequest.getTone()!=null){
            prompt.append("The tone should be ").append(emailRequest.getTone());
        }
        prompt.append("The email is: ").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
