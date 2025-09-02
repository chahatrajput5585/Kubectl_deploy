let menuItems = [];
let editingId = null;

async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        
        if (data.success) {
            menuItems = data.data;
            renderMenuTable();
        }
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

function renderMenuTable() {
    const tbody = document.getElementById('menu-table-body');
    
    if (menuItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    No menu items found. Add some items to get started!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = menuItems.map(item => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-lg mr-4 object-cover" onerror="this.src='/images/placeholder.jpg'; this.style.backgroundColor='#f3f4f6';">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${item.name}</div>
                        <div class="text-sm text-gray-500">${item.desc.substring(0, 50)}...</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.type === 'veg' ? 'bg-green-100 text-green-800' : 
                      item.type === 'nonveg' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'}">
                    ${item.type.toUpperCase()}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹${item.price}
                ${item.originalPrice ? `<span class="line-through text-gray-500 ml-2">₹${item.originalPrice}</span>` : ''}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${item.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editItem('${item._id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteItem('${item._id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Add New Menu Item';
    document.getElementById('submit-text').textContent = 'Add Item';
    document.getElementById('menu-form').reset();
    
    // Reset image preview
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('image-error').classList.add('hidden');
    
    document.getElementById('menu-modal').classList.remove('hidden');
}

function editItem(id) {
    const item = menuItems.find(i => i._id === id);
    if (!item) return;

    editingId = id;
    document.getElementById('modal-title').textContent = 'Edit Menu Item';
    document.getElementById('submit-text').textContent = 'Update Item';
    
    // Populate form
    document.getElementById('item-id').value = item._id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-type').value = item.type;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-original-price').value = item.originalPrice || '';
    document.getElementById('item-image').value = item.image;
    document.getElementById('item-desc').value = item.desc;
    document.getElementById('item-popular').checked = item.popular;
    
    // Trigger image preview for editing
    const imageInput = document.getElementById('item-image');
    imageInput.dispatchEvent(new Event('input'));
    
    document.getElementById('menu-modal').classList.remove('hidden');
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
        const response = await fetch(`/api/menu/${id}`, {
            method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadMenuItems(); // Reload the table
            showToast('Menu item deleted successfully!');
        } else {
            showToast('Error deleting menu item', 'error');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Error deleting menu item', 'error');
    }
}

function hideModal() {
    document.getElementById('menu-modal').classList.add('hidden');
}

// Form submission
document.getElementById('menu-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        name: document.getElementById('item-name').value.trim(),
        type: document.getElementById('item-type').value,
        price: parseFloat(document.getElementById('item-price').value),
        originalPrice: parseFloat(document.getElementById('item-original-price').value) || undefined,
        image: document.getElementById('item-image').value.trim(),
        desc: document.getElementById('item-desc').value.trim(),
        popular: document.getElementById('item-popular').checked,
    };

    try {
        const url = editingId ? `/api/menu/${editingId}` : '/api/menu';
        const method = editingId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (data.success) {
            hideModal();
            loadMenuItems();
            showToast(editingId ? 'Menu item updated successfully!' : 'Menu item added successfully!');
        } else {
            showToast(data.message || 'Error saving menu item', 'error');
        }
    } catch (error) {
        console.error('Error saving item:', error);
        showToast('Error saving menu item', 'error');
    }
});

function showToast(message, type = 'success') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Image preview functionality
function setupImagePreview() {
    const imageInput = document.getElementById('item-image');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const imageError = document.getElementById('image-error');
    
    imageInput.addEventListener('input', function() {
        const imageUrl = this.value.trim();
        
        if (imageUrl) {
            // Reset states
            imagePreview.classList.add('hidden');
            imageError.classList.add('hidden');
            
            // Test if image loads
            const testImg = new Image();
            testImg.onload = function() {
                previewImg.src = imageUrl;
                imagePreview.classList.remove('hidden');
                imageError.classList.add('hidden');
            };
            testImg.onerror = function() {
                imagePreview.classList.add('hidden');
                imageError.classList.remove('hidden');
            };
            testImg.src = imageUrl;
        } else {
            imagePreview.classList.add('hidden');
            imageError.classList.add('hidden');
        }
    });
}

// Enhanced form validation
function validateForm() {
    const name = document.getElementById('item-name').value.trim();
    const type = document.getElementById('item-type').value;
    const price = document.getElementById('item-price').value;
    const image = document.getElementById('item-image').value.trim();
    const desc = document.getElementById('item-desc').value.trim();
    
    if (!name) {
        showToast('Please enter a name for the menu item', 'error');
        return false;
    }
    
    if (!type) {
        showToast('Please select a category', 'error');
        return false;
    }
    
    if (!price || price <= 0) {
        showToast('Please enter a valid price', 'error');
        return false;
    }
    
    if (!image) {
        showToast('Please provide an image URL', 'error');
        return false;
    }
    
    // Validate URL format
    try {
        new URL(image);
    } catch (e) {
        showToast('Please provide a valid image URL', 'error');
        return false;
    }
    
    if (!desc) {
        showToast('Please enter a description', 'error');
        return false;
    }
    
    return true;
}

// Load menu items on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    setupImagePreview();
});
