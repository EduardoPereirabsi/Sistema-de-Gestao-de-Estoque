package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    java.util.Optional<Fornecedor> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);

    List<Fornecedor> findByEmpresaId(Long empresaId);

    boolean existsByCnpjAndEmpresaId(String cnpj, Long empresaId);
}