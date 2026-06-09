package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.model.hospital;
import com.donordarah.donordarurat.repository.hospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {
    
    @Autowired
    private hospitalRepository hospitalRepository;
    
    @GetMapping
    public List<hospital> getAll(@RequestParam(required = false) Integer locationId) {
        if (locationId != null) {
            return hospitalRepository.findByLocationId(locationId);
        }
        return hospitalRepository.findAll();
    }
    
    @PostMapping
    public hospital create(@RequestBody hospital hospital) {
        return hospitalRepository.save(hospital);
    }
}