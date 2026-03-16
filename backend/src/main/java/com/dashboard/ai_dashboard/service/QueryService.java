package com.dashboard.ai_dashboard.service;

import com.dashboard.ai_dashboard.dto.QueryRequest;
import com.dashboard.ai_dashboard.dto.QueryResponse;
import com.dashboard.ai_dashboard.model.Dataset;
import com.dashboard.ai_dashboard.repository.DatasetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QueryService {

    private final DatasetRepository datasetRepository;
    private final JdbcTemplate jdbcTemplate;
    private final GeminiService geminiService;

    public QueryResponse processQuery(QueryRequest request){

        Dataset dataset =
                datasetRepository.findById(request.getDatasetId())
                        .orElseThrow();

        String tableName = dataset.getTableName();
        String columns = dataset.getColumns();

        String prompt = """
You are a PostgreSQL expert.

Table name: %s
Columns: %s

Generate a PostgreSQL SQL query for the following question:

%s

Return ONLY SQL. Do not explain anything.
""".formatted(
                tableName,
                columns,
                request.getQuery()
        );

        String sql = geminiService.generateSQL(prompt);
//        String sql = geminiService.generateSQL(prompt);

// Fix numeric aggregations
        sql = sql.replaceAll("SUM\\((.*?)\\)", "SUM(CAST($1 AS NUMERIC))");
        sql = sql.replaceAll("AVG\\((.*?)\\)", "AVG(CAST($1 AS NUMERIC))");

        // Security check
        List<Map<String,Object>> result =
                jdbcTemplate.queryForList(sql);
        if(!sql.toLowerCase().startsWith("select")){
            throw new RuntimeException("Only SELECT queries are allowed");
        }

        List<String> labels = new ArrayList<>();
        List<Object> values = new ArrayList<>();

        if(!result.isEmpty()){

            Map<String,Object> firstRow = result.get(0);
            List<String> cols = new ArrayList<>(firstRow.keySet());

            if(cols.size() >= 2){

                String labelColumn = cols.get(0);
                String valueColumn = cols.get(1);

                for(Map<String,Object> row : result){
                    labels.add(String.valueOf(row.get(labelColumn)));
                    values.add(row.get(valueColumn));
                }

            }
        }

        String chartType;


// user selected chart from dropdown
        if(request.getChartType() != null && !request.getChartType().isEmpty()){
            chartType = request.getChartType();
        }
        else{
            chartType = detectChartType(request.getQuery());
        }

        return new QueryResponse(
                sql,
                result,
                chartType,
                labels,
                values
        );
    }
    private String detectChartType(String query){

        query = query.toLowerCase();

        if(query.contains("trend") || query.contains("over time")){
            return "line";
        }

        if(query.contains("distribution") || query.contains("percentage")){
            return "pie";
        }

        return "bar";
    }

}