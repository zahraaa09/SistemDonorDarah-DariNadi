package com.donordarah.donordarurat.repository;

import com.donordarah.donordarurat.model.location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface locationRepository extends JpaRepository<location, Integer> {
}