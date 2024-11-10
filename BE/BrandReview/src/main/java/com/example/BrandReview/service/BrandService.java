package com.example.BrandReview.service;

import com.example.BrandReview.model.Brand;
import java.util.List;

public interface BrandService{
    List<Brand> getAllBrands();
    Brand getBrandBySlug(String slug);
}
