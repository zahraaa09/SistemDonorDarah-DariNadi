package com.donordarah.donordarurat.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class requestResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String status = "PENDING"; // PENDING / ACCEPTED / REJECTED
    
    @Column(name = "responded_at")
    private LocalDateTime respondedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private donorRequest request;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private user user;
}