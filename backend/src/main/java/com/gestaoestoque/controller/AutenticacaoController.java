package com.gestaoestoque.controller;

import com.gestaoestoque.dto.request.CadastroRequest;
import com.gestaoestoque.dto.request.EsqueciSenhaRequest;
import com.gestaoestoque.dto.request.LoginRequest;
import com.gestaoestoque.dto.request.RedefinirSenhaRequest;
import com.gestaoestoque.dto.response.AutenticacaoResponse;
import com.gestaoestoque.service.AutenticacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints de login, cadastro e recuperação de senha")
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    @PostMapping("/login")
    @Operation(summary = "Autenticar usuário e retornar tokens JWT")
    public ResponseEntity<AutenticacaoResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(autenticacaoService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Cadastrar novo usuário e empresa")
    public ResponseEntity<AutenticacaoResponse> register(@Valid @RequestBody CadastroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(autenticacaoService.register(request));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Solicitar token de recuperação de senha por email")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody EsqueciSenhaRequest request) {
        autenticacaoService.forgotPassword(request.getEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Redefinir senha usando token de recuperação")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody RedefinirSenhaRequest request) {
        autenticacaoService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}
