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

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    final EmployeeRepository employeeRepository;
    final UserRepository userRepository;
    private static final Key key = new SecretKeySpec(
            "b7a65d0c081c3b23c498f66b045b39f3f33cd5f6a7ad79c0e1ab3d3c7c5c903d".getBytes(),
            SignatureAlgorithm.HS256.getJcaName()
    );
    private static final long EXPIRATION_TIME = 3600 * 1000 * 24;

    public AuthenticationResponse auth_user(AuthenticationResquest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXISTED));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        boolean auth = passwordEncoder.matches(request.getPassword(), user.getPassword());
//        boolean auth = user.getPassword().equals(request.getPassword());
        if (!auth) {
            throw new AppException(ErrorCode.AUTHENTICATED);
        }
        int id = user.getId();
        String avatar = user.getAvatar();
        String email = user.getEmail();
        String name = user.getName();
        String token = generateUserToken(id, email, name, avatar);
        // Trả về token với thông tin xác thực
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }
    public AuthenticationResponse auth_employee(AuthenticationResquest request) {
        var employee = employeeRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        boolean auth = passwordEncoder.matches(request.getPassword(), employee.getPassword());
//        boolean auth = employee.getPassword().equals(request.getPassword());

        if (!auth) {
            throw new AppException(ErrorCode.AUTHENTICATED);
        }

        String positionName = employee.getPosition().getName();
        String username = employee.getUsername();
        String token = generateToken(username, positionName);

        // Trả về token với thông tin xác thực
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public static String generateToken(String username, String positionName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("position", positionName); // Thêm tên Position vào claims
        return createEmployeeToken(claims, username);
    }
    public static String generateUserToken(int id, String email, String name,  String avatar) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("name", name);
        claims.put("avatar", avatar);
        return createUserToken(claims, email);
    }

    private static String createEmployeeToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .claim("username", username)
                .signWith(key)
                .compact();
    }
    private static String createUserToken(Map<String, Object> claims, String email) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .claim("email", email)
                .signWith(key)
                .compact();
    }
}
