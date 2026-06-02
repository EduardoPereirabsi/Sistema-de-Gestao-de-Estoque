package com.gestaoestoque.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "test-secret-key-for-testing-purposes-only-256-bits!!");
        ReflectionTestUtils.setField(tokenProvider, "accessTokenExpiration", 900000L);
        ReflectionTestUtils.setField(tokenProvider, "refreshTokenExpiration", 604800000L);
    }

    @Test
    @DisplayName("deve gerar access token valido")
    void deveGerarAccessTokenValido() {
        String token = tokenProvider.generateAccessToken(1L);
        assertThat(token).isNotNull().isNotEmpty();
        assertThat(tokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("deve gerar refresh token valido")
    void deveGerarRefreshTokenValido() {
        String token = tokenProvider.generateRefreshToken(1L);
        assertThat(token).isNotNull().isNotEmpty();
        assertThat(tokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("deve extrair userId do token")
    void deveExtrairUserId() {
        String token = tokenProvider.generateAccessToken(42L);
        assertThat(tokenProvider.extractUserId(token)).isEqualTo(42L);
    }

    @Test
    @DisplayName("deve retornar false para token invalido")
    void deveRetornarFalseParaInvalido() {
        assertThat(tokenProvider.validateToken("token-invalido")).isFalse();
    }

    @Test
    @DisplayName("deve retornar false para token null")
    void deveRetornarFalseParaNull() {
        assertThat(tokenProvider.validateToken(null)).isFalse();
    }

    @Test
    @DisplayName("deve retornar false para token vazio")
    void deveRetornarFalseParaVazio() {
        assertThat(tokenProvider.validateToken("")).isFalse();
    }

    @Test
    @DisplayName("deve retornar false para token expirado")
    void deveRetornarFalseParaExpirado() throws InterruptedException {
        ReflectionTestUtils.setField(tokenProvider, "accessTokenExpiration", 1L);
        String token = tokenProvider.generateAccessToken(1L);
        Thread.sleep(50);
        assertThat(tokenProvider.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("tokens de access e refresh devem ser diferentes")
    void tokensDevemSerDiferentes() {
        String access = tokenProvider.generateAccessToken(1L);
        String refresh = tokenProvider.generateRefreshToken(1L);
        assertThat(access).isNotEqualTo(refresh);
    }

    @Test
    @DisplayName("diferentes userIds geram tokens diferentes")
    void diferentesUserIdsGeramTokensDiferentes() {
        String t1 = tokenProvider.generateAccessToken(1L);
        String t2 = tokenProvider.generateAccessToken(2L);
        assertThat(t1).isNotEqualTo(t2);
    }

    @Test
    @DisplayName("deve rejeitar token com chave diferente")
    void deveRejeitarTokenComChaveDiferente() {
        String token = tokenProvider.generateAccessToken(1L);
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "outra-chave-secreta-diferente-para-testar-validacao!!");
        assertThat(tokenProvider.validateToken(token)).isFalse();
    }
}
