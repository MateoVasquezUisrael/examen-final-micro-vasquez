package com.uisrael.vault.models;

import org.springframework.context.annotation.Primary;
import javax.persistence.*;

@Entity
@Table(name = "Descuento")
public class Descuentos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double descuento;
    private Boolean estado;
    
    // Relación 1-1 con Producto
    @OneToOne
    @JoinColumn(name = "idproducto", referencedColumnName = "id")
    private Producto producto;  // Asumiendo que tu clase se llama "Producto"

    // Constructores
    public Descuentos() {}

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}

