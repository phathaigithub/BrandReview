package com.example.BrandReview.service;

import com.example.BrandReview.dto.request.AuthenticationResquest;
import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.dto.response.AuthenticationResponse;
import com.example.BrandReview.responsitory.EmployeeRepository;
import com.example.BrandReview.responsitory.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    final EmployeeRepository employeeRepository;


    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Use HS512 for stronger encryption
    private static final long EXPIRATION_TIME = 3600 * 1000 * 24;


    public AuthenticationResponse authenticate(AuthenticationResquest request) {
        var employee = employeeRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        boolean auth = passwordEncoder.matches(request.getPassword(), employee.getPassword());
//        boolean auth = employee.getPassword().equals(request.getPassword());

        if (!auth) {
            throw new AppException(ErrorCode.AUTHENTICATED);
        }

        String positionName = employee.getPosition().getName();
        String token = generateToken(employee.getUsername(), positionName);

        // Trả về token với thông tin xác thực
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public static String generateToken(String username, String positionName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("position", positionName); // Thêm tên Position vào claims
        return createToken(claims, username);
    }

    private static String createToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .claim("username", username)
                .signWith(key)
                .compact();
    }

}
