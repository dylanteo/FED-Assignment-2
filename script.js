
// Function to add items to cart
function addToCart() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let itemImage, itemName, itemPrice;
            
            if (window.location.href.includes("shopping.html")) {
                let cardBody = this.closest('.card-body');
                itemImage = cardBody.previousElementSibling.getAttribute('src');
                itemName = cardBody.querySelector('.card-title').textContent;
                itemPrice = cardBody.querySelector('.card-text').textContent;
            }
            if (window.location.href.includes("productpage.html")){
                let page = document.querySelector(".price");
                itemImage = document.querySelector('.img-main').getAttribute('src');
                itemName = page.querySelector('.price-main__heading').textContent;
                itemPrice = page.querySelector('.price-box__main-new').textContent;
            }

            // Ensure that item details are not undefined
            if (!itemName || !itemPrice || !itemImage) {
                console.error("Item details not found");
                return; // Exit the function if item details are not found
            }


            
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
                <div class="col">S$ ${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)} <span class="close" onclick="removeItem(${index})">&#10005;</span></div>
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
    document.querySelector('.summary .col.text-right').textContent = `S$ ${totalPrice.toFixed(2)}`;
    const elements = document.querySelectorAll('.col.text-right');

    if (elements.length >= 2) {
        const secondElement = elements[1];
        secondElement.textContent = `S$ ${(totalPrice+5).toFixed(2)}`;
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove item at index
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // Refresh cart display
}




// Check which page is currently loaded and run the appropriate function
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes('shopping.html') || window.location.href.includes('productpage.html')) {
        addToCart();
    } else if (window.location.href.includes('checkout.html')) {
        displayCart();
        checkout();
    }
});

if (localStorage.getItem('loggedin') === 'true'){
    document.getElementById("usernamePlaceholder").textContent = localStorage.getItem('username');
}

function checkout() {
    // Add event listener to the "CHECKOUT" button
    document.getElementById('checkout').addEventListener('click', function() {
        const APIKEY = "65b11c87a07ee8c4ea038308";
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price.slice(1)) * item.quantity), 0);
        let points = Math.floor(totalPrice * 0.72);
        let id = localStorage.getItem('pointcardid');

        fetch(`https://fedassignment2-b6e1.restdb.io/rest/pointcard/${id}`, {
            method: 'GET',
            headers: {
                'x-apikey': APIKEY
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let currentPoints = data.points || 0; // default to 0 if no points are set
            let newTotalPoints = currentPoints + points;
        
            var settings = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY
                },
                body: JSON.stringify({ points: newTotalPoints })
            };
            fetch(`https://fedassignment2-b6e1.restdb.io/rest/pointcard/${id}`, settings)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('PATCH request successful:', data);
            })
            .catch(error => {
                console.error('Error during PATCH request:', error);
            });
        alert("Points earned: "+ points);
        localStorage.removeItem('cart');
        window.location.href = "index.html";// Redirect to the home page
        });
    })
};