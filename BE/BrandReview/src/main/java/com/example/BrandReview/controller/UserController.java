package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.model.User;
import com.example.BrandReview.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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


}
