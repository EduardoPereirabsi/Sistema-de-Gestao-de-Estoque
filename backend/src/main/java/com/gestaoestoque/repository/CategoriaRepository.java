package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByName(String name);

    boolean existsByName(String name);

    List<Categoria> findByCompanyId(Long companyId);

    boolean existsByNameAndCompanyId(String name, Long companyId);

    Optional<Categoria> findByNameAndCompanyId(String name, Long companyId);
}