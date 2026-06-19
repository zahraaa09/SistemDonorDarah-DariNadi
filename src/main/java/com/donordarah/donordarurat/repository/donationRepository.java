package com.donordarah.donordarurat.repository;

import com.donordarah.donordarurat.model.donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface donationRepository extends JpaRepository<donation, Integer> {
    List<donation> findByDonorId(Integer donorId);
}