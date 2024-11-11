package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
