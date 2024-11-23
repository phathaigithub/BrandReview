package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Brand;
import com.example.BrandReview.model.BrandType;
import com.example.BrandReview.model.User;
import com.example.BrandReview.service.BrandService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

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

    @GetMapping("/slug/{brand_slug}")
    public ApiResponse<Brand> getBrandBySlug(@PathVariable String brand_slug) {
        ApiResponse<Brand> response = new ApiResponse<>();
        response.setResult(brandService.getBrandBySlug(brand_slug)); // Trả về json trạng thái của request
        return response;
    }

    @PostMapping("/add")
    public ApiResponse<Brand> add(
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam("location") String location,
            @RequestParam("google") String google,
            @RequestParam("facebook") String facebook,
            @RequestParam("brandType") String brandTypeJson,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        ApiResponse<Brand> response = new ApiResponse<>();
        
        try {
            Brand brand = new Brand();
            brand.setName(name);
            brand.setPhone(phone);
            brand.setLocation(location);
            brand.setGoogle(google);
            brand.setFacebook(facebook);
            
            // Parse brandType from JSON string
            ObjectMapper mapper = new ObjectMapper();
            JsonNode brandTypeNode = mapper.readTree(brandTypeJson);
            BrandType brandType = new BrandType();
            brandType.setId(brandTypeNode.get("id").asInt());
            brandType.setName(brandTypeNode.get("name").asText());
            brand.setBrandType(brandType);

            // Handle image upload
            String imagePath;
            if (image == null || image.isEmpty()) {
                imagePath = "branddefault.jpg"; // Default image for brands
            } else {
                String uniqueName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis();
                String originalFilename = image.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                imagePath = uniqueName + extension;
                
                // Save image to the same folder as user images
                Path filePath = Paths.get("src/main/resources/static/uploads/" + imagePath);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, image.getBytes());
            }
            
            brand.setImage(imagePath);
            Brand savedBrand = brandService.saveBrand(brand);
            
            response.setCode(200);
            response.setMessage("Brand created successfully");
            response.setResult(savedBrand);
            return response;
            
        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable("id") int brandId) {
        ApiResponse<String> response = new ApiResponse<>();

        brandService.deleteBrand(brandId);
        response.setResult("brand deleted successfully");

        return response;
    }

    @PutMapping("/edit/{id}")
    public ApiResponse<Brand> edit(
            @PathVariable("id") int brandId,
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam("location") String location,
            @RequestParam("google") String google,
            @RequestParam("facebook") String facebook,
            @RequestParam("priority") int priority,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        ApiResponse<Brand> response = new ApiResponse<>();
        
        try {
            Brand updatedBrand = new Brand();
            updatedBrand.setName(name);
            updatedBrand.setPhone(phone);
            updatedBrand.setLocation(location);
            updatedBrand.setGoogle(google);
            updatedBrand.setFacebook(facebook);
            updatedBrand.setPriority(priority);

            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                String uniqueName = UUID.randomUUID().toString() + "_" + 
                    System.currentTimeMillis() + "_" + image.getOriginalFilename();
                
                Path uploadPath = Paths.get("src/main/resources/static/uploads");
                Files.createDirectories(uploadPath);
                
                // Delete old image if exists
                Brand existingBrand = brandService.getBrandById(brandId);
                if (existingBrand != null && existingBrand.getImage() != null 
                    && !existingBrand.getImage().equals("branddefault.jpg")) {
                    Path oldImagePath = uploadPath.resolve(existingBrand.getImage());
                    Files.deleteIfExists(oldImagePath);
                }
                
                // Save new image
                Files.copy(image.getInputStream(), 
                          uploadPath.resolve(uniqueName), 
                          StandardCopyOption.REPLACE_EXISTING);
                updatedBrand.setImage(uniqueName);
            }

            Brand updated = brandService.updateBrand(brandId, updatedBrand);
            response.setCode(200);
            response.setMessage("Brand updated successfully");
            response.setResult(updated);
            
        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
        
        return response;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportUsersToExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Brands");
            List<Brand> brands = brandService.getAllBrands();

            // Tạo dòng header
            Row headerRow = sheet.createRow(0);
            String[] columnHeaders = {"ID", "Tên thương hiệu","Dịch vụ", "Số điện thoại", "Địa chỉ", "Google", "Facebook", "Ngày tạo"};
            for (int i = 0; i < columnHeaders.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnHeaders[i]);
            }

            // Ghi dữ liệu  vào các dòng tiếp theo
            int rowNum = 1;
            for (Brand brand : brands) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(brand.getId());
                row.createCell(1).setCellValue(brand.getName());
                row.createCell(2).setCellValue(brand.getBrandType().getName());
                row.createCell(3).setCellValue(brand.getPhone());
                row.createCell(4).setCellValue(brand.getLocation());
                row.createCell(5).setCellValue(brand.getGoogle());
                row.createCell(6).setCellValue(brand.getFacebook());
                row.createCell(7).setCellValue(brand.getInitDate().toString());
            }

            // Tạo output stream và trả về file Excel dưới dạng byte[]
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            byte[] excelData = outputStream.toByteArray();

            // Thiết lập headers cho response
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=brands.xlsx");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(excelData);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

