package com.example.website.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@DiscriminatorValue("2")
public class Employee extends User {
    // Employee-specific fields if any, or you can leave it empty
}