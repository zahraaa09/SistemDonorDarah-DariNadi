package com.donordarah.donordarurat.dto;

import lombok.Data;

@Data
public class registerRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String bloodType;
    private Integer locationId;
}