package com.dashboard.ai_dashboard.controller;

import com.dashboard.ai_dashboard.model.Dataset;
import com.dashboard.ai_dashboard.repository.DatasetRepository;
import com.dashboard.ai_dashboard.service.CSVService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/datasets")
@RequiredArgsConstructor
public class DatasetController {

    private final CSVService csvService;
    private final DatasetRepository datasetRepository;

    @PostMapping("/upload")
    public Dataset uploadCSV(@RequestParam("file") MultipartFile file) {

        return csvService.uploadCSV(file);

    }
    @GetMapping
    public List<Dataset> getDatasets(){
        return datasetRepository.findAll();
    }

}