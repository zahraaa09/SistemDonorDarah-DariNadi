package com.donordarah.donordarurat.controller;

import com.donordarah.donordarurat.model.user;
import com.donordarah.donordarurat.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private userRepository userRepository;
    
    @GetMapping("/profile")
    public user getProfile(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        return userRepository.findById(userId).orElse(null);
    }
    
    @PutMapping("/profile")
    public user updateProfile(@RequestBody user updatedUser, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        user user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setName(updatedUser.getName());
            user.setPhone(updatedUser.getPhone());
            user.setBloodType(updatedUser.getBloodType());
            user.setLocation(updatedUser.getLocation());
            return userRepository.save(user);
        }
        return null;
    }
    
    @PutMapping("/availability")
    public String updateAvailability(@RequestParam Boolean isAvailable, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        user user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setIsAvailable(isAvailable);
            userRepository.save(user);
            return "Availability updated to " + isAvailable;
        }
        return "User not found";
    }
    
    @GetMapping("/donors")
    public List<user> getDonors(@RequestParam String bloodType, @RequestParam Integer locationId) {
        return userRepository.findByBloodTypeAndIsAvailableTrueAndLocationId(bloodType, locationId);
    }
}