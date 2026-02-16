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
    
    lista.innerHTML = descuentos.map(descuento => `
        <div class="item-card">
            <div class="item-header">
                <span class="item-title">${descuento.producto.nombre}</span>
                <div class="item-actions">
                    <span class="badge ${descuento.estado ? 'badge-active' : 'badge-inactive'}">
                        ${descuento.estado ? 'Activo' : 'Inactivo'}
                    </span>
                    <button class="btn btn-delete" onclick="deleteDescuento(${descuento.id})">Eliminar</button>
                </div>
            </div>
            <div class="item-details">
                <p><strong>Descuento:</strong> ${(descuento.descuento * 100).toFixed(0)}%</p>
                <p><strong>Precio Original:</strong> $${descuento.producto.precio.toFixed(2)}</p>
                <p><strong>Precio con Descuento:</strong> $${(descuento.producto.precio * (1 - descuento.descuento)).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

// Cargar productos en el select
async function loadProductosSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        const productos = await response.json();
        
        const select = document.getElementById('descuento-producto');
        select.innerHTML = '<option value="">Seleccionar Producto</option>' + 
            productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear descuento');
        }
        
        showNotification('Descuento creado exitosamente', 'success');
        e.target.reset();
        loadDescuentos();
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message, 'error');
    }
});

// Eliminar descuento
async function deleteDescuento(id) {
    if (!confirm('¿Estás seguro de eliminar este descuento?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/descuentos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar descuento');
        
        showNotification('Descuento eliminado exitosamente', 'success');
        loadDescuentos();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar descuento', 'error');
    }
}