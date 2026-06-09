package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.dto.loginRequest;
import com.donordarah.donordarurat.dto.registerRequest;
import com.donordarah.donordarurat.model.user;
import com.donordarah.donordarurat.repository.userRepository;
import com.donordarah.donordarurat.repository.locationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private userRepository userRepository;
    
    @Autowired
    private locationRepository locationRepository;
    
    @PostMapping("/register")
    public String register(@RequestBody registerRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }
        
        user user = new user();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // TODO: encrypt password
        user.setPhone(request.getPhone());
        user.setBloodType(request.getBloodType());
        user.setIsAvailable(false);
        user.setLocation(locationRepository.findById(request.getLocationId()).orElse(null));
        
        userRepository.save(user);
        return "Registration successful";
    }
    
    @PostMapping("/login")
    public String login(@RequestBody loginRequest request, HttpSession session) {
        user user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null && user.getPassword().equals(request.getPassword())) {
            session.setAttribute("userId", user.getId());
            return "Login successful";
        }
        return "Invalid email or password";
    }
    
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logout successful";
    }
}