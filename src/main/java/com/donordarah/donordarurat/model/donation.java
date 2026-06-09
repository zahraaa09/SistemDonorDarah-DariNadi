package com.donordarah.donordarurat.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String status = "COMPLETED";
    
    @Column(name = "donation_date")
    private LocalDateTime donationDate = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private user donor;
    
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private donorRequest request;
}