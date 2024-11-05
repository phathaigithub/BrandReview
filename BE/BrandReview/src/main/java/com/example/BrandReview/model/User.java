package com.example.BrandReview.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "User")
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

    @Column(name = "IsEnable")
    private Boolean isEnable;
    private String name;
    private LocalDate birth;
    private String gender;
    @Column(name = "InitDate")
    private LocalDateTime InitDate = LocalDateTime.now();

    public User(String username, String password){
        this.username = username;
        this.password = password;
    }

}

