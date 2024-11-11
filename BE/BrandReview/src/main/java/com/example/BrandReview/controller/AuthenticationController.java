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
//@CrossOrigin
public class AuthenticationController {

    AuthenticationService authenticationService; //

    @CrossOrigin(origins = "http://localhost:3001", allowedHeaders = "*", allowCredentials = "true", methods = {RequestMethod.POST})
    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationResquest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }




}
