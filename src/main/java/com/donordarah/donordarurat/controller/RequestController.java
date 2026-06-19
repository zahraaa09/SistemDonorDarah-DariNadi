package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.dto.donorRequestDTO;
import com.donordarah.donordarurat.model.donorRequest;
import com.donordarah.donordarurat.model.user;
import com.donordarah.donordarurat.model.hospital;
import com.donordarah.donordarurat.repository.donorRequestRepository;
import com.donordarah.donordarurat.repository.userRepository;
import com.donordarah.donordarurat.repository.hospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {
    
    @Autowired
    private donorRequestRepository requestRepository;
    
    @Autowired
    private userRepository userRepository;
    
    @Autowired
    private hospitalRepository hospitalRepository;
    
    @PostMapping
    public donorRequest createRequest(@RequestBody donorRequestDTO dto, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        user user = userRepository.findById(userId).orElse(null);
        hospital hospital = hospitalRepository.findById(dto.getHospitalId()).orElse(null);
        
        donorRequest request = new donorRequest();
        request.setPatientName(dto.getPatientName());
        request.setBloodType(dto.getBloodType());
        request.setQuantity(dto.getQuantity());
        request.setContactPhone(dto.getContactPhone());
        request.setStatus("OPEN");
        request.setCreatedAt(LocalDateTime.now());
        request.setUser(user);
        request.setHospital(hospital);
        
        return requestRepository.save(request);
    }
    
    @GetMapping("/my")
    public List<donorRequest> getMyRequests(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        return requestRepository.findByUserId(userId);
    }
    
    @GetMapping("/open")
    public List<donorRequest> getOpenRequests() {
        return requestRepository.findByStatus("OPEN");
    }
    
    @GetMapping("/{id}")
    public donorRequest getRequestDetail(@PathVariable Integer id) {
        return requestRepository.findById(id).orElse(null);
    }
    
    @PutMapping("/{id}/close")
    public String closeRequest(@PathVariable Integer id, HttpSession session) {
        donorRequest request = requestRepository.findById(id).orElse(null);
        if (request != null && request.getUser().getId().equals(session.getAttribute("userId"))) {
            request.setStatus("CLOSED");
            requestRepository.save(request);
            return "Request closed";
        }
        return "Unauthorized or request not found";
    }
}