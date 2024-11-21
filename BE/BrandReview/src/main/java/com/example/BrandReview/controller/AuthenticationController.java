package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.dto.request.AuthenticationResquest;
import com.example.BrandReview.dto.response.AuthenticationResponse;
import com.example.BrandReview.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class AuthenticationController {

    AuthenticationService authenticationService; //

    @PostMapping("/employee")
    ApiResponse<AuthenticationResponse> authEmployee(@RequestBody AuthenticationResquest request) {
        var result = authenticationService.auth_employee(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    @PostMapping("/user")
    ApiResponse<AuthenticationResponse> authUser(@RequestBody AuthenticationResquest request) {
        var result = authenticationService.auth_user(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }




}
