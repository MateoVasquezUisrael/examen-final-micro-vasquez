// URL base de tu API
const API_BASE_URL = 'http://localhost:8081/api/vault';

// Cargar todos los productos
async function loadProductos() {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const productos = await response.json();
        displayProductos(productos);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar productos', 'error');
    }
}

// Mostrar productos en el DOM
function displayProductos(productos) {
    const lista = document.getElementById('productos-lista');
    
    if (productos.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #999;">No hay productos registrados</p>';
        return;
    }
    
    lista.innerHTML = productos.map(producto => `
        <div class="item-card">
            <div class="item-header">
                <span class="item-title">${producto.nombre}</span>
                <div class="item-actions">
                    <button class="btn btn-edit" onclick="editProducto(${producto.id})">Editar</button>
                    <button class="btn btn-delete" onclick="deleteProducto(${producto.id})">Eliminar</button>
                </div>
            </div>
            <div class="item-details">
                <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
                <p><strong>Stock:</strong> ${producto.stock} unidades</p>
                ${producto.descripcion ? `<p><strong>Descripción:</strong> ${producto.descripcion}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Crear producto
document.getElementById('producto-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const producto = {
        nombre: document.getElementById('producto-nombre').value,
        precio: parseFloat(document.getElementById('producto-precio').value),
        stock: parseInt(document.getElementById('producto-stock').value),
        descripcion: document.getElementById('producto-descripcion').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        
        if (!response.ok) throw new Error('Error al crear producto');
        
        showNotification('Producto creado exitosamente', 'success');
        e.target.reset();
        loadProductos();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al crear producto', 'error');
    }
});

// Eliminar producto
async function deleteProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar producto');
        
        showNotification('Producto eliminado exitosamente', 'success');
        loadProductos();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar producto', 'error');
    }
}

// Editar producto (simplificado - muestra prompt)
async function editProducto(id) {
    const newPrice = prompt('Ingrese el nuevo precio:');
    if (newPrice === null) return;
    
    try {
        // Primero obtener el producto actual
        const getResponse = await fetch(`${API_BASE_URL}/productos/${id}`);
        const producto = await getResponse.json();
        
        // Actualizar solo el precio
        producto.precio = parseFloat(newPrice);
        
        const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });
        
        if (!response.ok) throw new Error('Error al actualizar producto');
        
        showNotification('Producto actualizado exitosamente', 'success');
        loadProductos();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al actualizar producto', 'error');
    }
}