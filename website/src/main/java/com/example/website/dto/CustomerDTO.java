package com.example.website.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomerDTO {
    private String email;
    private String LastName;
    private String FirstName;
    private String address;
    private String telephone;
    private String gender;
    private Boolean subscribe;
    private Date dateBirth;

}
