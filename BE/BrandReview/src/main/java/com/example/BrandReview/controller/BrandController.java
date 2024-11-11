package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.model.Brand;
import com.example.BrandReview.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/brand")
@CrossOrigin
public class BrandController {
    @Autowired
    private BrandService brandService;

    @GetMapping("/getAllBrands")
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping("slug/{brand_slug}")
    public ApiResponse<Brand> getBrandBySlug(@PathVariable String brand_slug) {
        ApiResponse<Brand> response = new ApiResponse<>();
        response.setResult(brandService.getBrandBySlug(brand_slug)); // Trả về json trạng thái của request
        return response;
    }
}
