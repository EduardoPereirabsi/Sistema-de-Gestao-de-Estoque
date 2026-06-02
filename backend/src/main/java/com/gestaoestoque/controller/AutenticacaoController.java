package com.gestaoestoque.controller;

import com.gestaoestoque.dto.request.CadastroRequest;
import com.gestaoestoque.dto.request.EsqueciSenhaRequest;
import com.gestaoestoque.dto.request.LoginRequest;
import com.gestaoestoque.dto.request.RedefinirSenhaRequest;
import com.gestaoestoque.dto.response.AutenticacaoResponse;
import com.gestaoestoque.dto.response.ErroResponse;
import com.gestaoestoque.service.AutenticacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@SecurityRequirements
@Tag(name = "Autenticação", description = "Endpoints de login, cadastro e recuperação de senha")
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    @PostMapping("/login")
    @Operation(
            summary = "Autenticar usuário e retornar tokens JWT",
            description = "Autentica um usuário com email e senha. Quando o mesmo email está vinculado a mais de uma empresa, a resposta retorna a lista de empresas disponíveis para seleção."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticação concluída com sucesso ou empresas retornadas para seleção",
                    content = @Content(schema = @Schema(implementation = AutenticacaoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Credenciais inválidas, usuário inativo ou dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "404", description = "Empresa informada não encontrada para o usuário autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<AutenticacaoResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(autenticacaoService.login(request));
    }

    @PostMapping("/register")
    @Operation(
            summary = "Cadastrar novo usuário e empresa",
            description = "Cria uma nova empresa e registra o primeiro usuário com perfil de administrador."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário e empresa cadastrados com sucesso",
                    content = @Content(schema = @Schema(implementation = AutenticacaoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos para cadastro",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<AutenticacaoResponse> register(@Valid @RequestBody CadastroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(autenticacaoService.register(request));
    }

    @PostMapping("/forgot-password")
    @Operation(
            summary = "Solicitar token de recuperação de senha por email",
            description = "Gera um token de recuperação para todos os usuários vinculados ao email informado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Token(s) de recuperação gerado(s) com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos para solicitação de recuperação",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado para o email informado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody EsqueciSenhaRequest request) {
        autenticacaoService.forgotPassword(request.getEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Redefinir senha usando token de recuperação",
            description = "Redefine a senha do usuário a partir de um token de recuperação válido."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Senha redefinida com sucesso"),
            @ApiResponse(responseCode = "400", description = "Token inválido, expirado ou dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody RedefinirSenhaRequest request) {
        autenticacaoService.resetPassword(request.getToken(), request.getNovaSenha());
        return ResponseEntity.noContent().build();
    }
}
