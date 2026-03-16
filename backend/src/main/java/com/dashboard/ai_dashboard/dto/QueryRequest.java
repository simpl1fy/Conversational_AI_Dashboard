package com.dashboard.ai_dashboard.dto;

import lombok.Data;

@Data
public class QueryRequest {

    private Long datasetId;

    private String query;

    private String chartType;

}