package com.dashboard.ai_dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class QueryResponse {

    private String sql;

    private List<Map<String,Object>> data;

    private String chartType;

    private List<String> labels;

    private List<Object> values;

}