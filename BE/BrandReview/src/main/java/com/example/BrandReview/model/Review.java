package com.example.BrandReview.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
//@Table(name = "Brand")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "BrandID", nullable = false)
    @JsonIgnore
    private Brand brand;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewImage> images;
    private Integer status;

    private String content;
    private double SpaceScore;
    private double QualityScore;
    private double LocationScore;
    private double ServiceScore;
    private double PriceScore;

    // @ManyToOne
    // @JoinColumn(name = "TypeID", nullable = false)
    // private BrandType brandType;
    @Column(name = "InitDate")
    private LocalDateTime InitDate;
}

