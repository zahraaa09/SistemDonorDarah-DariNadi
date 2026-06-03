package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.model.location;
import com.donordarah.donordarurat.repository.locationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class testController {
    
    @Autowired
    private locationRepository locationRepository;
    
    @GetMapping("/locations")
    public List<location> getAll() {
        return locationRepository.findAll();
    }
    
    @PostMapping("/locations")
    public location create(@RequestBody location location) {
        return locationRepository.save(location);
    }
}