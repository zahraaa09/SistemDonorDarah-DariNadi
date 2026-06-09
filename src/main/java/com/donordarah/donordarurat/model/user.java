package com.donordarah.donordarurat.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String phone;
    
    @Column(name = "blood_type")
    private String bloodType;
    
    @Column(name = "is_available")
    private Boolean isAvailable = false;
    
    @ManyToOne
    @JoinColumn(name = "location_id")
    private location location;
}