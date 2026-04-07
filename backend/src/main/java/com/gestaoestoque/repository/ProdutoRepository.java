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

    Page<Produto> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Produto> findBySupplierId(Long supplierId, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE p.quantity <= p.minQuantity")
    List<Produto> findLowStockProducts();

    Page<Produto> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.quantity * p.price), 0) FROM Produto p")
    BigDecimal calculateTotalStockValue();

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.quantity <= p.minQuantity")
    Long countLowStockProducts();

    Page<Produto> findByCompanyId(Long companyId, Pageable pageable);

    Page<Produto> findByNameContainingIgnoreCaseAndCompanyId(String name, Long companyId, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE p.quantity <= p.minQuantity AND p.company.id = :companyId")
    List<Produto> findLowStockProductsByCompanyId(@Param("companyId") Long companyId);

    boolean existsBySkuAndCompanyId(String sku, Long companyId);

    @Query("SELECT COALESCE(SUM(p.quantity * p.price), 0) FROM Produto p WHERE p.company.id = :companyId")
    BigDecimal calculateTotalStockValueByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.quantity <= p.minQuantity AND p.company.id = :companyId")
    Long countLowStockProductsByCompanyId(@Param("companyId") Long companyId);

    long countByCompanyId(Long companyId);
}