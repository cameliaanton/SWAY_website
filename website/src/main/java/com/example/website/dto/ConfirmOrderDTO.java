package com.example.website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ConfirmOrderDTO {
    String deliveryMethod;
    String paymentMethod;
    String address;
    Double totalPayment;

}
