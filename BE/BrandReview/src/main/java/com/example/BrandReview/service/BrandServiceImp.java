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

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BrandServiceImp implements BrandService {
    @Autowired
    private BrandRepository brandRepository;

    @Override
    public Brand getBrandById(int id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
    }
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
        String slug = generateSlug(brand.getName());
        
        // Check if slug already exists
        if (brandRepository.findBrandBySlugIgnoreCase(slug) != null) {
            throw new AppException(ErrorCode.BRANDNAME_EXISTED);
        }
        
        if (brand.getInitDate() == null) {
            brand.setInitDate(LocalDateTime.now());
        }
        
        brand.setSlug(slug);
        brand.setStatus(1);
        return brandRepository.save(brand);
    }

    private String generateSlug(String name) {
        if (name == null) return "";
        
        String normalized = java.text.Normalizer
                .normalize(name, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")  // Remove diacritics
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")  // Keep only letters, numbers, spaces and hyphens
                .trim()
                .replaceAll("\\s+", "-")          // Replace spaces with single hyphen
                .replaceAll("-+", "-");           // Replace multiple hyphens with single hyphen
        
        return normalized;
    }

    @Override
    public void deleteBrand(int brandId) {
        brandRepository.deleteById(brandId);
    }

    @Override
    public Brand updateBrand(int id, Brand updatedBrand) {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        existingBrand.setName(updatedBrand.getName());
        existingBrand.setPhone(updatedBrand.getPhone());
        existingBrand.setLocation(updatedBrand.getLocation());
        existingBrand.setGoogle(updatedBrand.getGoogle());
        existingBrand.setFacebook(updatedBrand.getFacebook());
        existingBrand.setPriority(updatedBrand.getPriority());
        
        // Update image only if a new one is provided
        if (updatedBrand.getImage() != null) {
            existingBrand.setImage(updatedBrand.getImage());
        }

        return brandRepository.save(existingBrand);
    }
}
