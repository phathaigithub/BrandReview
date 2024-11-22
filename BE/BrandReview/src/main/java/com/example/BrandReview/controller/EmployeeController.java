package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.service.EmployeeService;
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
@RequestMapping(path = "/employee")
@CrossOrigin
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/add")
    public ApiResponse<Employee> add(@RequestBody @Valid Employee employee) {
        ApiResponse<Employee> response = new ApiResponse<>();
        response.setResult(employeeService.saveEmployee(employee)); // Trả về json trạng thái của request
        return response;
    }

    @GetMapping("/getAll")
    public List<Employee> getAll() {
        return employeeService.getAllEmployees();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable("id") int employeeId) {
        ApiResponse<String> response = new ApiResponse<>();

        employeeService.deleteEmployee(employeeId);
        response.setResult("Employee deleted successfully");

        return response;
    }

    @PutMapping("/edit/{id}")
    public ApiResponse<Employee> edit(@PathVariable("id") int employeeId, @RequestBody @Valid Employee updatedEmployee) {
        ApiResponse<Employee> response = new ApiResponse<>();

        Employee updated = employeeService.updateEmployee(employeeId, updatedEmployee);
        response.setResult(updated);

        return response;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportEmployeesToExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Employees");
            List<Employee> employees = employeeService.getAllEmployees();

            // Tạo dòng header
            Row headerRow = sheet.createRow(0);
            String[] columnHeaders = {"ID", "Username", "Name", "Gender", "Phone", "Email", "Position", "InitDate"};
            for (int i = 0; i < columnHeaders.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnHeaders[i]);
            }

            // Ghi dữ liệu nhân viên vào các dòng tiếp theo
            int rowNum = 1;
            for (Employee employee : employees) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(employee.getId());
                row.createCell(1).setCellValue(employee.getUsername());
                row.createCell(2).setCellValue(employee.getName());
                row.createCell(3).setCellValue(employee.getGender());
                row.createCell(4).setCellValue(employee.getPhone());
                row.createCell(5).setCellValue(employee.getEmail());
                row.createCell(6).setCellValue(employee.getPosition().getName());
                row.createCell(7).setCellValue(employee.getInitDate().toString());
            }

            // Tạo output stream và trả về file Excel dưới dạng byte[]
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            byte[] excelData = outputStream.toByteArray();

            // Thiết lập headers cho response
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=employees.xlsx");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(excelData);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{username}")
    public ApiResponse<Employee> getEmployeeByUsername(@PathVariable("username") String username) {
        ApiResponse<Employee> response = new ApiResponse<>();
        Employee employee = employeeService.getEmployeeByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        response.setResult(employee);
        return response;
    }

    @PutMapping("/editusername/{username}")
    public ApiResponse<Employee> editByUsername(
            @PathVariable("username") String username, 
            @RequestBody @Valid Employee updatedEmployee) {
        ApiResponse<Employee> response = new ApiResponse<>();
        Employee updated = employeeService.updateEmployeeByUsername(username, updatedEmployee);
        response.setResult(updated);
        return response;
    }

}
