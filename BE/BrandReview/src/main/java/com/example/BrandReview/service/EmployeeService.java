package com.example.BrandReview.service;


import com.example.BrandReview.model.Employee;
import java.util.List;

public interface EmployeeService {
    public Employee saveEmployee(Employee employee);
    public List<Employee> getAllEmployees();
//    public Employee getEmployeeById(int id);
}
