package com.example.BrandReview.model;

import jakarta.persistence.*;
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
//@Table(name = "Brand")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String status;
    private int priority;
    private String phone;
    private String google;
    private String location;
    private String facebook;
    private String image;
    private String slug;

    @Column(name = "InitDate")
    private LocalDateTime InitDate = LocalDateTime.now();




}

