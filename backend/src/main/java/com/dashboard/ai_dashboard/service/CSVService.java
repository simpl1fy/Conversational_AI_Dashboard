package com.dashboard.ai_dashboard.service;

import com.dashboard.ai_dashboard.model.Dataset;
import com.dashboard.ai_dashboard.repository.DatasetRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CSVService {

    private final JdbcTemplate jdbcTemplate;
    private final DatasetRepository datasetRepository;

    public Dataset uploadCSV(MultipartFile file) {

        try {

            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(file.getInputStream()));

            CSVParser parser = CSVFormat.DEFAULT.parse(reader);

            Iterator<CSVRecord> iterator = parser.iterator();

            // Skip broken row
            iterator.next();

            // Read header row
            CSVRecord headerRow = iterator.next();

            List<String> headers = new ArrayList<>();

            for (String header : headerRow) {
                headers.add(header.trim().replace(" ", "_"));
            }

            String tableName = "dataset_" + System.currentTimeMillis();

            createTable(headers, tableName);

            insertRows(iterator, headers, tableName);

            Dataset dataset = new Dataset();

            dataset.setName(file.getOriginalFilename());
            dataset.setTableName(tableName);
            dataset.setColumns(headers.toString());
            dataset.setCreatedAt(LocalDateTime.now());
            return datasetRepository.save(dataset);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void createTable(List<String> headers, String tableName) {

        StringBuilder sql = new StringBuilder("CREATE TABLE " + tableName + " (");

        for (String column : headers) {
            sql.append(column).append(" TEXT,");
        }

        sql.deleteCharAt(sql.length() - 1);
        sql.append(")");

        jdbcTemplate.execute(sql.toString());
    }

    private void insertRows(Iterator<CSVRecord> iterator, List<String> headers, String tableName) {

        while (iterator.hasNext()) {

            CSVRecord record = iterator.next();

            StringBuilder sql = new StringBuilder("INSERT INTO " + tableName + " VALUES (");

            for (int i = 0; i < headers.size(); i++) {
                sql.append("?,");
            }

            sql.deleteCharAt(sql.length() - 1);
            sql.append(")");

            Object[] values = new Object[headers.size()];

            for (int i = 0; i < headers.size(); i++) {
                values[i] = record.get(i);
            }

            jdbcTemplate.update(sql.toString(), values);
        }
    }
}