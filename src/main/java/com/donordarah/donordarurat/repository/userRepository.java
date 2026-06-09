package com.donordarah.donordarurat.repository;

import com.donordarah.donordarurat.model.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface userRepository extends JpaRepository<user, Integer> {
    Optional<user> findByEmail(String email);
    List<user> findByBloodTypeAndIsAvailableTrueAndLocationId(String bloodType, Integer locationId);
}