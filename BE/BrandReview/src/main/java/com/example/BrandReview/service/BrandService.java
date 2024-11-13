package com.example.BrandReview.service;

import com.example.BrandReview.model.Brand;
import com.example.BrandReview.model.User;

import java.util.List;

public interface BrandService{
    List<Brand> getAllBrands();
    Brand getBrandBySlug(String slug);

    public Brand saveBrand(Brand brand);
    void deleteBrand(int brandId);
    public Brand updateBrand(int id, Brand brandId);
}
