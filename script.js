
// Function to add items to cart
function addToCart() {
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const APIKEY = "65b11c87a07ee8c4ea038308"
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let cardBody = this.closest('.card-body');
            let itemImage = cardBody.previousElementSibling.getAttribute('src');
            let itemname = cardBody.querySelector('.card-title').textContent;
            let price = cardBody.querySelector('.card-text').textContent;
            const cardID = cardBody.querySelector('.id').textContent.trim();
            let id = JSON.stringify({
                cardID,
                itemname,
                price
            });
            let item = {
                name: itemname,
                price: price,
                image: itemImage,
                quantity: 1
            }
            let settings = {
                method: 'PATCH',
                headers: {
                    'x-apikey': APIKEY
                },
                body: JSON.stringify({ field2: id })
            };
            let user = localStorage.getItem('account');

            fetch(`https://fedassignment2-b6e1.restdb.io/rest/shoppingcart/${user}`, settings)
            .then(response => {
                if (response.status === 200) {
                  console.log('Data updated successfully!');
                } else {
                  console.error('Failed to update data. Status code:', response.status);
                }
              })


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

// Check which page is currently loaded and run the appropriate function
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes('shopping.html')) {
        addToCart();
    } else if (window.location.href.includes('checkout.html')) {
        displayCart();
    }
});

if (localStorage.getItem('loggedin') === 'true'){
    document.getElementById("usernamePlaceholder").textContent = localStorage.getItem('username');
}

function checkout(){

}