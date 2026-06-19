package com.donordarah.donordarurat.dto;

import lombok.Data;

@Data
public class donorRequestDTO {
    private String patientName;
    private String bloodType;
    private Integer quantity;
    private String contactPhone;
    private Integer hospitalId;
}