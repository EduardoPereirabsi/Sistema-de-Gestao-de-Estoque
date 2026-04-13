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

    Page<MovimentacaoEstoque> findByProdutoId(Long produtoId, Pageable pageable);

    Page<MovimentacaoEstoque> findByTipo(TipoMovimentacao tipo, Pageable pageable);

    @Query("SELECT sm FROM MovimentacaoEstoque sm WHERE sm.criadoEm BETWEEN :start AND :end")
    Page<MovimentacaoEstoque> findByDateRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("SELECT COUNT(sm) FROM MovimentacaoEstoque sm WHERE MONTH(sm.criadoEm) = MONTH(CURRENT_DATE) AND YEAR(sm.criadoEm) = YEAR(CURRENT_DATE)")
    Long countMovementsThisMonth();

    Page<MovimentacaoEstoque> findByEmpresaId(Long empresaId, Pageable pageable);

    @Query("SELECT COUNT(sm) FROM MovimentacaoEstoque sm WHERE MONTH(sm.criadoEm) = MONTH(CURRENT_DATE) AND YEAR(sm.criadoEm) = YEAR(CURRENT_DATE) AND sm.empresa.id = :empresaId")
    Long countMovementsThisMonthByEmpresaId(@Param("empresaId") Long empresaId);

    @Query("SELECT sm.tipo, CAST(sm.criadoEm AS LocalDate), COUNT(sm) FROM MovimentacaoEstoque sm " +
            "WHERE sm.empresa.id = :empresaId AND sm.criadoEm >= :startDate " +
            "GROUP BY sm.tipo, CAST(sm.criadoEm AS LocalDate) " +
            "ORDER BY CAST(sm.criadoEm AS LocalDate)")
    java.util.List<Object[]> countByTipoAndDataGrouped(
            @Param("empresaId") Long empresaId,
            @Param("startDate") LocalDateTime startDate
    );
}