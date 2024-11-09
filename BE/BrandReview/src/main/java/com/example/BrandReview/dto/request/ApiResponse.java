package com.example.BrandReview.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.web.bind.annotation.ResponseStatus;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private int code;
    private String message;
    private T result;

}
