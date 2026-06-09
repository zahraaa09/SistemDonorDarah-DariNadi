package com.donordarah.donordarurat.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "donor_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class donorRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "patient_name")
    private String patientName;
    
    @Column(name = "blood_type")
    private String bloodType;
    
    private Integer quantity;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    private String status = "OPEN"; // OPEN / CLOSED
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private user user;
    
    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private hospital hospital;
}