package com.example.BrandReview.model;
import java.util.List;
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
    private int status;
    private int priority;
    private String phone;
    @Column(length = 2048)
    private String google;
    private String location;
    private String facebook;
    private String image;
    private String slug;

    @ManyToOne
    @JoinColumn(name = "TypeID", nullable = false)
    private BrandType brandType;

    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
    private LocalDateTime initDate;




}

