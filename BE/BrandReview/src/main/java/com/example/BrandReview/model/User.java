package com.example.BrandReview.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
    private String phone;
    private String email;
    private Boolean isEnable = true;
    private String name;
    private LocalDate birth;
    private String gender;
    private LocalDateTime initDate = LocalDateTime.now();

    public User(String username, String password){
        this.username = username;
        this.password = password;
    }

}

