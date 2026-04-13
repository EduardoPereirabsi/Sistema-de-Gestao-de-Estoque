package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findBySku(String sku);

    boolean existsBySku(String sku);

    Page<Produto> findByCategoriaId(Long categoriaId, Pageable pageable);

    Page<Produto> findByFornecedorId(Long fornecedorId, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE p.quantidade <= p.quantidadeMinima")
    List<Produto> findLowStockProducts();

    Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.quantidade * p.preco), 0) FROM Produto p")
    BigDecimal calculateTotalStockValue();

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.quantidade <= p.quantidadeMinima")
    Long countLowStockProducts();

    Page<Produto> findByEmpresaId(Long empresaId, Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCaseAndEmpresaId(String nome, Long empresaId, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE p.quantidade <= p.quantidadeMinima AND p.empresa.id = :empresaId")
    List<Produto> findLowStockProductsByEmpresaId(@Param("empresaId") Long empresaId);

    boolean existsBySkuAndEmpresaId(String sku, Long empresaId);

    @Query("SELECT COALESCE(SUM(p.quantidade * p.preco), 0) FROM Produto p WHERE p.empresa.id = :empresaId")
    BigDecimal calculateTotalStockValueByEmpresaId(@Param("empresaId") Long empresaId);

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.quantidade <= p.quantidadeMinima AND p.empresa.id = :empresaId")
    Long countLowStockProductsByEmpresaId(@Param("empresaId") Long empresaId);

    long countByEmpresaId(Long empresaId);
}