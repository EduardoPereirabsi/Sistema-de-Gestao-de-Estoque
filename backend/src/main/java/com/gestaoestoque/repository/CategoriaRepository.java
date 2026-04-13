package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByNome(String nome);

    boolean existsByNome(String nome);

    List<Categoria> findByEmpresaId(Long empresaId);

    boolean existsByNomeAndEmpresaId(String nome, Long empresaId);

    Optional<Categoria> findByNomeAndEmpresaId(String nome, Long empresaId);
}