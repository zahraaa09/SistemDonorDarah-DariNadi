package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.model.user;
import com.donordarah.donordarurat.model.donorRequest;
import com.donordarah.donordarurat.repository.userRepository;
import com.donordarah.donordarurat.repository.donorRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "*")
public class MatchController {
    
    @Autowired
    private userRepository userRepository;
    
    @Autowired
    private donorRequestRepository requestRepository;
    
    @GetMapping("/donors")
    public List<user> getMatchingDonors(@RequestParam String bloodType, @RequestParam Integer locationId) {
        return userRepository.findByBloodTypeAndIsAvailableTrueAndLocationId(bloodType, locationId);
    }
    
    @GetMapping("/requests")
    public List<donorRequest> getMatchingRequests(@RequestParam String bloodType, @RequestParam Integer locationId) {
        return requestRepository.findByStatusAndBloodTypeAndHospitalLocationId("OPEN", bloodType, locationId);
    }
}