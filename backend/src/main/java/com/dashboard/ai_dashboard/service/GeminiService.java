package com.dashboard.ai_dashboard.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public GeminiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    public String generateSQL(String prompt) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        Map response = webClient.post()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/models/gemini-2.5-flash:generateContent")
                                .queryParam("key", apiKey)
                                .build()
                )
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List candidates = (List) response.get("candidates");

        Map candidate = (Map) candidates.get(0);

        Map content = (Map) candidate.get("content");

        List parts = (List) content.get("parts");

        Map part = (Map) parts.get(0);

        String text = part.get("text").toString();

        // Clean SQL formatting if Gemini returns ```sql blocks
        text = text.replace("```sql", "")
                .replace("```", "")
                .trim();

        return text;
    }
}