function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/delete-product/${id}`, { method: 'DELETE' })
            .then(res => { window.location.href = '/'; })
            .catch(err => alert('Error deleting product'));
    }
}
