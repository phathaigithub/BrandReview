package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.model.Brand;
import com.example.BrandReview.model.User;
import com.example.BrandReview.service.BrandService;
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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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

    @GetMapping("/slug/{brand_slug}")
    public ApiResponse<Brand> getBrandBySlug(@PathVariable String brand_slug) {
        ApiResponse<Brand> response = new ApiResponse<>();
        response.setResult(brandService.getBrandBySlug(brand_slug)); // Trả về json trạng thái của request
        return response;
    }

    @PostMapping("/add")
    public ApiResponse<Brand> add(@RequestBody @Valid Brand brand) {
        ApiResponse<Brand> response = new ApiResponse<>();
        response.setResult(brandService.saveBrand(brand)); // Trả về json trạng thái của request
        return response;
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable("id") int brandId) {
        ApiResponse<String> response = new ApiResponse<>();

        brandService.deleteBrand(brandId);
        response.setResult("brand deleted successfully");

        return response;
    }

    @PutMapping("/edit/{id}")
    public ApiResponse<Brand> edit(@PathVariable("id") int brandId, @RequestBody @Valid Brand updatedBrand) {
        ApiResponse<Brand> response = new ApiResponse<>();

        Brand updated = brandService.updateBrand(brandId, updatedBrand);
        response.setResult(updated);

        return response;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportUsersToExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Brands");
            List<Brand> brands = brandService.getAllBrands();

            // Tạo dòng header
            Row headerRow = sheet.createRow(0);
            String[] columnHeaders = {"ID", "Tên thương hiệu", "Số điện thoại", "Địa chỉ", "Google", "Facebook", "Ngày tạo"};
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
                row.createCell(2).setCellValue(brand.getPhone());
                row.createCell(3).setCellValue(brand.getLocation());
                row.createCell(4).setCellValue(brand.getGoogle());
                row.createCell(5).setCellValue(brand.getFacebook());
                row.createCell(6).setCellValue(brand.getInitDate().toString());
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

