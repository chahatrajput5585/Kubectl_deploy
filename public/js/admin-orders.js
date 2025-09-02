let allOrders = [];
let filteredOrders = [];

async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        
        if (data.success) {
            allOrders = data.data;
            filteredOrders = [...allOrders];
            renderOrdersTable();
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function renderOrdersTable() {
    const tbody = document.getElementById('orders-table-body');
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No orders found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #${order._id.slice(-8)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${order.user.name}</div>
                <div class="text-sm text-gray-500">${order.user.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${order.items.length} items
                <div class="text-xs text-gray-500">
                    ${order.items.slice(0, 2).map(item => item.name).join(', ')}
                    ${order.items.length > 2 ? '...' : ''}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₹${order.total}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <select onchange="updateOrderStatus('${order._id}', this.value)" 
                        class="text-sm border rounded px-2 py-1 ${getStatusClass(order.status)}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${new Date(order.createdAt).toLocaleDateString()}
                <div class="text-xs">${new Date(order.createdAt).toLocaleTimeString()}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="viewOrderDetails('${order._id}')" class="text-indigo-600 hover:text-indigo-900">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-orange-100 text-orange-800',
        ready: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Order status updated successfully!');
            loadOrders(); // Reload orders
        } else {
            showToast('Error updating order status', 'error');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('Error updating order status', 'error');
    }
}

function filterOrders() {
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    filteredOrders = allOrders.filter(order => {
        const matchesStatus = !statusFilter || order.status === statusFilter;
        const matchesDate = !dateFilter || 
            new Date(order.createdAt).toDateString() === new Date(dateFilter).toDateString();
        
        return matchesStatus && matchesDate;
    });
    
    renderOrdersTable();
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o._id === orderId);
    if (!order) return;
    
    const items = order.items.map(item => `${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
    
    alert(`Order Details:

Customer: ${order.user.name}
Email: ${order.user.email}
Status: ${order.status.toUpperCase()}
Date: ${new Date(order.createdAt).toLocaleString()}

Items:
${items}

Subtotal: ₹${order.subtotal}
Delivery Fee: ₹${order.deliveryFee}
Total: ₹${order.total}

${order.deliveryAddress ? `Address: ${order.deliveryAddress}` : ''}
${order.phoneNumber ? `Phone: ${order.phoneNumber}` : ''}
${order.notes ? `Notes: ${order.notes}` : ''}`);
}

function showToast(message, type = 'success') {
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

document.addEventListener('DOMContentLoaded', loadOrders);
