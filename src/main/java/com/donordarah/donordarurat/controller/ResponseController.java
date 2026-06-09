package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.dto.responseRequestDTO;
import com.donordarah.donordarurat.model.requestResponse;
import com.donordarah.donordarurat.model.donorRequest;
import com.donordarah.donordarurat.model.user;
import com.donordarah.donordarurat.repository.requestResponseRepository;
import com.donordarah.donordarurat.repository.donorRequestRepository;
import com.donordarah.donordarurat.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "*")
public class ResponseController {
    
    @Autowired
    private requestResponseRepository responseRepository;
    
    @Autowired
    private donorRequestRepository requestRepository;
    
    @Autowired
    private userRepository userRepository;
    
    @PostMapping
    public String createResponse(@RequestBody responseRequestDTO dto, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        
        // Validasi duplikat respon
        if (responseRepository.findByRequestIdAndUserId(dto.getRequestId(), userId).isPresent()) {
            return "You have already responded to this request";
        }
        
        user user = userRepository.findById(userId).orElse(null);
        donorRequest request = requestRepository.findById(dto.getRequestId()).orElse(null);
        
        if (request == null || !request.getStatus().equals("OPEN")) {
            return "Request is not available";
        }
        
        requestResponse response = new requestResponse();
        response.setStatus("PENDING");
        response.setRespondedAt(LocalDateTime.now());
        response.setRequest(request);
        response.setUser(user);
        
        responseRepository.save(response);
        return "Response recorded. WhatsApp contact: " + request.getContactPhone();
    }
    
    @GetMapping("/my")
    public List<requestResponse> getMyResponses(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        return responseRepository.findByUserId(userId);
    }
}