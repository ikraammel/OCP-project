package com.ocp.ecommerce.dto;

import lombok.Data;

@Data
public class UserDto {
    private String uid;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
