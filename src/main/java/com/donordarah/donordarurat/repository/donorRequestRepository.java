package com.donordarah.donordarurat.repository;

import com.donordarah.donordarurat.model.donorRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface donorRequestRepository extends JpaRepository<donorRequest, Integer> {
    List<donorRequest> findByUserId(Integer userId);
    List<donorRequest> findByStatus(String status);
    List<donorRequest> findByStatusAndBloodTypeAndHospitalLocationId(String status, String bloodType, Integer locationId);
}