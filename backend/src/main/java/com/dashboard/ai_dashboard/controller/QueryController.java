package com.dashboard.ai_dashboard.controller;

import com.dashboard.ai_dashboard.dto.QueryRequest;
import com.dashboard.ai_dashboard.dto.QueryResponse;
import com.dashboard.ai_dashboard.service.QueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/query")
@RequiredArgsConstructor
public class QueryController {

    private final QueryService queryService;

    @PostMapping
    public QueryResponse query(@RequestBody QueryRequest request){

        return queryService.processQuery(request);

    }

}