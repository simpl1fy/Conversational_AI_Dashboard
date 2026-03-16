package com.dashboard.ai_dashboard.repository;

import com.dashboard.ai_dashboard.model.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DatasetRepository extends JpaRepository<Dataset, Long> {
}