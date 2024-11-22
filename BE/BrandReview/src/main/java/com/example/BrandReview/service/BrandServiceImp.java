package com.example.BrandReview.service;

import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Brand;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.model.Position;
import com.example.BrandReview.responsitory.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BrandServiceImp implements BrandService {
    @Autowired
    private BrandRepository brandRepository;

    @Override
    public List<Brand> getAllBrands() {
        List<Brand> list =  (List<Brand>) brandRepository.findAll();

        return list.stream()
                .sorted(Comparator.comparing(Brand::getPriority).reversed())
                .toList();
    }
    public Brand getBrandBySlug(String slug){
       return (Brand) brandRepository.findBrandBySlugIgnoreCase(slug);
    }

    @Override
    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public void deleteBrand(int brandId) {
        brandRepository.deleteById(brandId);
    }

    @Override
    public Brand updateBrand(int id, Brand updatedBrand) {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        // Update the fields with new values
        existingBrand.setName(updatedBrand.getName());
        existingBrand.setPhone(updatedBrand.getPhone());
        existingBrand.setLocation(updatedBrand.getLocation());
        existingBrand.setGoogle(updatedBrand.getGoogle());
        existingBrand.setFacebook(updatedBrand.getFacebook());

        return brandRepository.save(existingBrand);
    }
}
