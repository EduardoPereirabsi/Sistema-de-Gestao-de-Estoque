package com.gestaoestoque.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CategoriaResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}