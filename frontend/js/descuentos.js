// Cargar todos los descuentos
async function loadDescuentos() {
    try {
        const response = await fetch(`${API_BASE_URL}/descuentos`);
        if (!response.ok) throw new Error('Error al cargar descuentos');
        
        const descuentos = await response.json();
        displayDescuentos(descuentos);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar descuentos', 'error');
    }
}

// Mostrar descuentos en el DOM
function displayDescuentos(descuentos) {
    const lista = document.getElementById('descuentos-lista');
    
    if (descuentos.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #999;">No hay descuentos registrados</p>';
        return;
    }
    
    lista.innerHTML = descuentos.map(descuento => {
        const precioOriginal = descuento.producto.precio;
        const precioConDescuento = precioOriginal * (1 - descuento.descuento);
        const precioFinal = descuento.producto.iva ? precioConDescuento * 1.15 : precioConDescuento;
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <span class="item-title">${descuento.producto.nombre}</span>
                    <div class="item-actions">
                        <span class="badge ${descuento.estado ? 'badge-active' : 'badge-inactive'}">
                            ${descuento.estado ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>
                <div class="item-details">
                    <p><strong>Descuento:</strong> ${(descuento.descuento * 100).toFixed(0)}%</p>
                    <p><strong>Precio Original:</strong> $${precioOriginal.toFixed(2)}</p>
                    <p><strong>Precio con Descuento:</strong> $${precioConDescuento.toFixed(2)}</p>
                    ${descuento.producto.iva ? 
                        `<p><strong>Precio Final (con IVA 15%):</strong> $${precioFinal.toFixed(2)}</p>` : 
                        `<p><strong>Precio Final:</strong> $${precioFinal.toFixed(2)}</p>`
                    }
                    <p><strong>Categoría:</strong> ${descuento.producto.idcategoria}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Cargar productos en el select
async function loadProductosSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        const productos = await response.json();
        
        const select = document.getElementById('descuento-producto');
        select.innerHTML = '<option value="">Seleccionar Producto</option>' + 
            productos.map(p => `<option value="${p.id}">${p.nombre} - $${p.precio.toFixed(2)}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar productos', 'error');
    }
}

// Crear descuento
document.getElementById('descuento-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const porcentaje = parseFloat(document.getElementById('descuento-porcentaje').value);
    
    // Convertir porcentaje (1-100) a decimal (0.01-1)
    const descuentoDecimal = porcentaje / 100;
    
    const descuento = {
        descuento: descuentoDecimal,
        estado: document.getElementById('descuento-estado').checked,
        producto: {
            id: parseInt(document.getElementById('descuento-producto').value)
        }
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/descuentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(descuento)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al crear descuento');
        }
        
        showNotification('Descuento creado exitosamente', 'success');
        e.target.reset();
        // Resetear el checkbox a su valor por defecto (checked)
        document.getElementById('descuento-estado').checked = true;
        loadDescuentos();
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message, 'error');
    }
});
