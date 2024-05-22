package com.example.website.dto;

import com.example.website.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterClient {
    private User user;
    private String password;
    private String repeatPassword;
}
