package com.example.BrandReview.service;

import com.example.BrandReview.model.Brand;
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
}
