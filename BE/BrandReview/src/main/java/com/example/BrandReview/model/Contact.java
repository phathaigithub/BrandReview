package com.example.BrandReview.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String name;
    String phone;
    String content;
    Integer isexcuted = 0;
//    0là chưa xử lí,1 là đang xử lý 2 là đã xử lý

    @Column(name = "InitDate")
    private LocalDateTime InitDate = LocalDateTime.now();

}
