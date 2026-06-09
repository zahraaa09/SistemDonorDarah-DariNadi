package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.model.donation;
import com.donordarah.donordarurat.model.donorRequest;
import com.donordarah.donordarurat.model.user;
import com.donordarah.donordarurat.repository.donationRepository;
import com.donordarah.donordarurat.repository.donorRequestRepository;
import com.donordarah.donordarurat.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {
    
    @Autowired
    private donationRepository donationRepository;
    
    @Autowired
    private donorRequestRepository requestRepository;
    
    @Autowired
    private userRepository userRepository;
    
    @PostMapping
    public String recordDonation(@RequestParam Integer requestId, @RequestParam Integer donorId, HttpSession session) {
        donorRequest request = requestRepository.findById(requestId).orElse(null);
        user donor = userRepository.findById(donorId).orElse(null);
        
        if (request == null || donor == null) {
            return "Invalid request or donor";
        }
        
        donation donation = new donation();
        donation.setStatus("COMPLETED");
        donation.setDonationDate(LocalDateTime.now());
        donation.setDonor(donor);
        donation.setRequest(request);
        
        donationRepository.save(donation);
        
        // Tutup request setelah donasi berhasil
        request.setStatus("CLOSED");
        requestRepository.save(request);
        
        return "Donation recorded successfully";
    }
    
    @GetMapping("/my")
    public List<donation> getMyDonations(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        return donationRepository.findByDonorId(userId);
    }
}