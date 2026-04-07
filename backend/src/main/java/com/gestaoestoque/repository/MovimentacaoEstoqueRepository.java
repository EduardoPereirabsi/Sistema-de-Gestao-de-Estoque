package com.gestaoestoque.repository;

import com.gestaoestoque.entity.MovimentacaoEstoque;
import com.gestaoestoque.enums.TipoMovimentacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    Page<MovimentacaoEstoque> findByProductId(Long productId, Pageable pageable);

    Page<MovimentacaoEstoque> findByType(TipoMovimentacao type, Pageable pageable);

    @Query("SELECT sm FROM MovimentacaoEstoque sm WHERE sm.createdAt BETWEEN :start AND :end")
    Page<MovimentacaoEstoque> findByDateRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("SELECT COUNT(sm) FROM MovimentacaoEstoque sm WHERE MONTH(sm.createdAt) = MONTH(CURRENT_DATE) AND YEAR(sm.createdAt) = YEAR(CURRENT_DATE)")
    Long countMovementsThisMonth();

    Page<MovimentacaoEstoque> findByCompanyId(Long companyId, Pageable pageable);

    @Query("SELECT COUNT(sm) FROM MovimentacaoEstoque sm WHERE MONTH(sm.createdAt) = MONTH(CURRENT_DATE) AND YEAR(sm.createdAt) = YEAR(CURRENT_DATE)AND sm.company.id = :companyId")
    Long countMovementsThisMonthByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT sm.type, CAST(sm.createdAt AS LocalDate), COUNT(sm) FROM MovimentacaoEstoque sm " +
            "WHERE sm.company.id = :companyId AND sm.createdAt >= :startDate " +
            "GROUP BY sm.type, CAST(sm.createdAt AS LocalDate) " +
            "ORDER BY CAST(sm.createdAt AS LocalDate)")
    java.util.List<Object[]> countByTypeAndDateGrouped(
            @Param("companyId") Long companyId,
            @Param("startDate") LocalDateTime startDate
    );
}