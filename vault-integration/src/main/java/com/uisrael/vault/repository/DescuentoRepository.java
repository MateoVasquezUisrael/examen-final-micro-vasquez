package com.uisrael.vault.repository;

import com.uisrael.vault.models.Descuentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DescuentoRepository extends JpaRepository<Descuentos, Long> {
}
