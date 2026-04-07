package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
    List<Fornecedor> findByEmpresaId(Long empresaId);
    List<Fornecedor> findByEmpresaIdAndAtivoTrue(Long empresaId);
    boolean existsByEmpresaIdAndCnpj(Long empresaId, String cnpj);
}