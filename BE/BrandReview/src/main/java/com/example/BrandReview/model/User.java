package com.example.BrandReview.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
//@Table(name = "User")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(min = 6, message = "PASSWORD_INVALID")
    private String password;

    private String phone;

    @Email(message = "EMAIL_INVALID")
    private String email;

    private String avatar;
    private Boolean isEnable;
    private String name;
    private LocalDate birth;
    private String gender;
    @Column(name = "InitDate")
    private LocalDateTime InitDate = LocalDateTime.now();

    public User(String email, String password) {
        this.password = password;
        this.email = email;
    }
    @PostLoad
    public void setDefaultAvatarIfNull() {
        if (this.avatar == null) {
            this.avatar = "default.png";  // Set default value if still null after loading
        }
    }
}

