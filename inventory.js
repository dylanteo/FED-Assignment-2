const APIKEY = "65b11c87a07ee8c4ea038308";

document.addEventListener('DOMContentLoaded', function() {
    updatePricesFromAPI();
});

function updatePricesFromAPI() {
    fetch('https://fedassignment2-b6e1.restdb.io/rest/item',{// Replace with your API URL
        method : 'GET',
        headers: {
            'x-apikey': APIKEY,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(items => {
        // Process each card
        document.querySelectorAll('.card').forEach(card => {
            const cardID = card.querySelector('.id').textContent.trim();
            const item = items.find(item => item.id == cardID);
            if (item) {
                card.querySelector('.card-title').textContent = item.itemname;
                card.querySelector('.card-text').textContent = `$${item.price}0`;
                const addToCartButton = card.querySelector('.btn-primary');
                addToCartButton.setAttribute('data-name', item.itemname);
                addToCartButton.setAttribute('data-price', `$${item.price}0`);
            }
        });
    })
    .catch(error => console.error('Error:', error));
}