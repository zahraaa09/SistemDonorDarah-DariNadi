package com.donordarah.donordarurat.repository;

import com.donordarah.donordarurat.model.requestResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface requestResponseRepository extends JpaRepository<requestResponse, Integer> {
    List<requestResponse> findByUserId(Integer userId);
    Optional<requestResponse> findByRequestIdAndUserId(Integer requestId, Integer userId);
}