package com.example.BrandReview.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int level;

    private String name;



}

