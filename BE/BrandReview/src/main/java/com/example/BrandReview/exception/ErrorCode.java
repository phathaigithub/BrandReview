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
    AUTHENTICATED(1006, "Tên đăng nhập hoặc mật khẩu không đúng"),
    POSITION_NOT_FOUND(1007, "Role khong ton tai"),
    EMPLOYEE_NOT_FOUND(1008,"Không tìm thấy nhân viên"),
    USER_NOT_FOUND(1009,"Không tìm thấy người dùng"),
    BRAND_NOT_FOUND(1010, "Không tìm thấy thương hiệu")
    ;
    private int code;
    private String message;
}
