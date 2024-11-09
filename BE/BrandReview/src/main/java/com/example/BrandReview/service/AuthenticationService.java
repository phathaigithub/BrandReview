package com.example.BrandReview.service;

import com.example.BrandReview.dto.request.AuthenticationResquest;
import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.response.AuthenticationResponse;
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

    final UserRepository userRepository;

    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Use HS512 for stronger encryption
    private static final long EXPIRATION_TIME = 3600 * 1000;

    public AuthenticationResponse authenticate(AuthenticationResquest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        boolean auth = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!auth) {
            throw new AppException(ErrorCode.AUTHENTICATED);
        }
        String token = generateToken(user.getUsername());

        // Return response with token and authenticated status
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public static String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private static String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

}
