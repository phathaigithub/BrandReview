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


}
