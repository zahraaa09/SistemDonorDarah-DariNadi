package com.donordarah.donordarurat.repository;

import com.donordarah.donordarurat.model.hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface hospitalRepository extends JpaRepository<hospital, Integer> {
    List<hospital> findByLocationId(Integer locationId);
}