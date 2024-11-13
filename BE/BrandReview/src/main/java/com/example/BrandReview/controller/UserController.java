package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.model.User;
import com.example.BrandReview.service.UserService;
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
@RequestMapping(path = "/user")
@CrossOrigin

public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ApiResponse<User> add(@RequestBody @Valid User user) {
        ApiResponse<User> response = new ApiResponse<>();
        response.setResult(userService.saveUser(user)); // Trả về json trạng thái của request
        return response;
    }

    @GetMapping("/getAll")
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable("id") int userId) {
        ApiResponse<String> response = new ApiResponse<>();

        userService.deleteUser(userId);
        response.setResult("User deleted successfully");

        return response;
    }

    @PutMapping("/edit/{id}")
    public ApiResponse<User> edit(@PathVariable("id") int userId, @RequestBody @Valid User updatedUser) {
        ApiResponse<User> response = new ApiResponse<>();

        User updated = userService.updateUser(userId, updatedUser);
        response.setResult(updated);

        return response;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportUsersToExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Users");
            List<User> users = userService.getAllUsers();

            // Tạo dòng header
            Row headerRow = sheet.createRow(0);
            String[] columnHeaders = {"ID", "Username", "Name", "Gender", "Phone", "Email", "InitDate"};
            for (int i = 0; i < columnHeaders.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnHeaders[i]);
            }

            // Ghi dữ liệu nhân viên vào các dòng tiếp theo
            int rowNum = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getUsername());
                row.createCell(2).setCellValue(user.getName());
                row.createCell(3).setCellValue(user.getGender());
                row.createCell(4).setCellValue(user.getPhone());
                row.createCell(5).setCellValue(user.getEmail());
                row.createCell(6).setCellValue(user.getInitDate().toString());
            }

            // Tạo output stream và trả về file Excel dưới dạng byte[]
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            byte[] excelData = outputStream.toByteArray();

            // Thiết lập headers cho response
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=users.xlsx");

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
