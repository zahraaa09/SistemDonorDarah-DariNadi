package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.model.location;
import com.donordarah.donordarurat.repository.locationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {
    
    @Autowired
    private locationRepository locationRepository;
    
    @GetMapping
    public List<location> getAll() {
        return locationRepository.findAll();
    }
    
    @PostMapping
    public location create(@RequestBody location location) {
        return locationRepository.save(location);
    }
}