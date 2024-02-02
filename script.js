// Function to add items to cart
function addToCart() {
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let cardBody = this.closest('.card-body');
            let itemImage = cardBody.previousElementSibling.getAttribute('src');
            let itemName = cardBody.querySelector('.card-title').textContent;
            let itemPrice = cardBody.querySelector('.card-text').textContent;

            let item = {
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            };

            const existingItem = cart.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(item);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });
}

if (window.location.href.includes('shopping.html')) {
    addToCart();
}



// Function to display cart items on checkout page
// Function to display and manage cart items
function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.querySelector('.cart');
    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        let itemHtml = `
            <div class="row main align-items-center">
                <div class="col-2"><img class="img-fluid" src="${item.image}" alt="${item.name}"></div>
                <div class="col">
                    <div class="row text-muted">${item.name}</div>
                    <div class="row">Quantity: ${item.quantity}</div>
                </div>
                <div class="col">&euro; ${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)} <span class="close" onclick="removeItem(${index})">&#10005;</span></div>
            </div>
        `;
        cartContainer.innerHTML += itemHtml;
    });

    updateSummary();
}

function updateSummary() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price.slice(1)) * item.quantity), 0);
    
    document.querySelector('.summary .col').textContent = `ITEMS ${totalItems}`;
    document.querySelector('.summary .col.text-right').textContent = `&euro; ${totalPrice.toFixed(2)}`;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove item at index
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // Refresh cart display
}

if (window.location.href.includes('checkout.html')) {
    displayCart();
}


// Check which page is currently loaded and run the appropriate function
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes('shopping.html')) {
        addToCart();
    } else if (window.location.href.includes('checkout.html')) {
        displayCart();
    }
});
