package com.example.BrandReview.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định"),
    USER_EXISTED(1001, "Tên đăng nhập đã tồn tại"),
    EMAIL_EXISTED(1002, "Email đã tồn tại"),
    EMAIL_INVALID(1003, "Email phải hợp lệ và chứa ký tự @"),
    USER_INVALID(1004, "Tên đăng nhập phải gồm tối thiểu 4 ký tự"),
    PASSWORD_INVALID(1005, "Mật khẩu phải gồm tối thiểu 6 ký tự"),
    USER_NOT_EXISTED(1006, "Tên đăng nhập không tồn tại"),
    AUTHENTICATED(1006, "Tên đăng nhập hoặc mật khẩu không đúng")
    ;
    private int code;
    private String message;
}
