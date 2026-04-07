package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByEmpresaId(Long empresaId);
    List<Categoria> findByEmpresaIdAndAtivoTrue(Long empresaId);
    Optional<Categoria> findByEmpresaIdAndNome(Long empresaId, String nome);
    boolean existsByEmpresaIdAndNome(Long empresaId, String nome);
}