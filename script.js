
// Function to add items to cart
function addToCart() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let itemImage, itemName, itemPrice;
            let cardBody = this.closest('.card-body');
            const cardID = cardBody.querySelector('.id').textContent.trim();
            let cartid = localStorage.getItem('cartid');
            let settings = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY

                }
            };
            fetch(`https://fedassignment2-b6e1.restdb.io/rest/item`,settings)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.forEach(element => {
                    if (element.id == cardID){
                        let item = element;
                        fetch(`https://fedassignment2-b6e1.restdb.io/rest/shoppingcart/${cartid}`,settings)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data=>{
                            let cart = data.id;
                            cart.push(item);
                            let settings = {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-apikey': APIKEY
                                },
                                body: JSON.stringify({ id: cart })
                            };
                            
                
                            fetch(`https://fedassignment2-b6e1.restdb.io/rest/shoppingcart/${cartid}`, settings)
                            .then(response => {
                                if (response.status === 200) {
                                  console.log('Data updated successfully!');
                                } else {
                                  console.error('Failed to update data. Status code:', response.status);
                                }
                              })
                        })
                        

            
                    }
                });
            

            });
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
    document.getElementById('checkout').addEventListener('click', async function() {
        const APIKEY = "65b11c87a07ee8c4ea038308";
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price.slice(1)) * item.quantity), 0);
        let points = Math.floor(totalPrice * 0.72);
        let id = localStorage.getItem('pointcardid');

        try {
            // Update points
            let pointsResponse = await fetch(`https://fedassignment2-b6e1.restdb.io/rest/pointcard/${id}`, {
                method: 'GET',
                headers: {
                    'x-apikey': APIKEY
                }
            });
            if (!pointsResponse.ok) throw new Error('Network response was not ok for points update');
            let pointsData = await pointsResponse.json();
            let currentPoints = pointsData.points || 0;
            let newTotalPoints = currentPoints + points;
    
            await fetch(`https://fedassignment2-b6e1.restdb.io/rest/pointcard/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY
                },
                body: JSON.stringify({ points: newTotalPoints })
            });
    
            // Update stock for each item
            for (const element of cart) {
                let itemResponse = await fetch(`https://fedassignment2-b6e1.restdb.io/rest/item?q={"itemname":"${element.name}"}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': APIKEY
                    }
                });
                if (!itemResponse.ok) throw new Error('Network response was not ok for item fetch');
                let itemData = await itemResponse.json();
                let stock = itemData[0].stock;
                let newstock = stock - element.quantity;
    
                await fetch(`https://fedassignment2-b6e1.restdb.io/rest/item/${itemData[0]._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': APIKEY
                    },
                    body: JSON.stringify({ stock: newstock })
                });
            }
    
            alert("Points earned: " + points);
            localStorage.removeItem('cart');
            window.location.href = "index.html"; // Redirect to the home page after all operations are complete
        } catch (error) {
            console.error('Error during checkout process:', error);
        }
    });

    
};