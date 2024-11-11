package com.example.BrandReview.dto.response;

import com.example.BrandReview.model.Position;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
//@Table(name = "User")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmployeeResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String phone;
    private String email;
    private Boolean isEnable;
    private String name;
    private LocalDate birth;
    private String gender;

    @ManyToOne
    @JoinColumn(name = "Position")
    private Position position;

}
