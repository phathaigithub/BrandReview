package com.example.BrandReview.dto;

import com.example.BrandReview.model.ReviewImage;

import java.time.LocalDateTime;
import java.util.List;

public class ReviewDTO {
    private Integer id;
    private String userName;
    private String brandName;
    private String content;
    private LocalDateTime initDate;
    private Integer status;
    private Integer brandId;
    private List<ReviewImage> images;

    // Constructor
    public ReviewDTO(Integer id, String userName, String brandName, String content, 
                    LocalDateTime initDate, Integer status, Integer brandId, List<ReviewImage> images) {
        this.id = id;
        this.userName = userName;
        this.brandName = brandName;
        this.content = content;
        this.initDate = initDate;
        this.status = status;
        this.brandId = brandId;
        this.images = images;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getInitDate() {
        return initDate;
    }

    public void setInitDate(LocalDateTime initDate) {
        this.initDate = initDate;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getBrandId() {
        return brandId;
    }

    public void setBrandId(Integer brandId) {
        this.brandId = brandId;
    }

    public List<ReviewImage> getImages() {
        return images;
    }

    public void setImages(List<ReviewImage> images) {
        this.images = images;
    }
}