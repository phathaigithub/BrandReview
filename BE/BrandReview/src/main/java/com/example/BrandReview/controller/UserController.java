package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.model.User;
import com.example.BrandReview.responsitory.UserRepository;
import com.example.BrandReview.responsitory.UserRepository;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "/user")
@CrossOrigin

public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ApiResponse<User> add(@RequestBody @Valid User user) {
        ApiResponse<User> response = new ApiResponse<>();
        User savedUser = userService.saveUser(user);
        response.setCode(200); // HTTP 200 OK
        response.setMessage("User created successfully");
        response.setResult(savedUser);
        return response;

    }
    @GetMapping("/get/{id}")
    public ApiResponse<User> getUserById(@PathVariable("id") int userId) {
        ApiResponse<User> response = new ApiResponse<>();

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        response.setCode(200);
        response.setMessage("User retrieved successfully");
        response.setResult(user);

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
            String[] columnHeaders = {"ID", "Name", "Gender", "Phone", "Email", "InitDate"};
            for (int i = 0; i < columnHeaders.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnHeaders[i]);
            }

            // Ghi dữ liệu nhân viên vào các dòng tiếp theo
            int rowNum = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getName());
                row.createCell(2).setCellValue(user.getGender());
                row.createCell(3).setCellValue(user.getPhone());
                row.createCell(4).setCellValue(user.getEmail());
                row.createCell(5).setCellValue(user.getInitDate().toString());
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

    @PostMapping("/upload/{id}")
    public ApiResponse<User> uploadImage(
            @PathVariable("id") int userId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        ApiResponse<User> response = new ApiResponse<>();
        
        try {
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            String imagePath;
            if (image == null || image.isEmpty()) {
                imagePath = "default.png";
            } else {
                String uniqueName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis();
                String originalFilename = image.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                imagePath = uniqueName + extension;
                
                Path filePath = Paths.get("src/main/resources/static/uploads/" + imagePath);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, image.getBytes());
            }
            
            user.setAvatar(imagePath);
            User updatedUser = userRepository.save(user);
            
            response.setCode(200);
            response.setMessage("User image updated successfully");
            response.setResult(updatedUser);
            return response;
            
        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @PutMapping("/change-password/{id}")
    public ApiResponse<String> changePassword(
            @PathVariable("id") int userId,
            @RequestBody Map<String, String> passwords) {
        ApiResponse<String> response = new ApiResponse<>();
        
        userService.changePassword(
            userId,
            passwords.get("oldPassword"),
            passwords.get("newPassword")
        );
        
        response.setCode(200);
        response.setMessage("Password changed successfully");
        response.setResult("Password updated");
        return response;
    }

}
