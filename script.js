
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
                console.log(itemPrice);
            }

            // Ensure that item details are not undefined
            if (!itemName || !itemPrice || !itemImage) {
                console.error("Item details not found");
                return; // Exit the function if item details are not found
            }

            let formattedPrice = parseFloat(itemPrice.replace(/[^0-9.-]+/g, "")); // Remove non-numeric characters

            let item = {
                name: itemName,
                price: formattedPrice,
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
                <div class="col">S$ ${(parseFloat(item.price) * item.quantity).toFixed(2)} <span class="close" onclick="removeItem(${index})">&#10005;</span></div>
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
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove item at index
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // Refresh cart display
}


function checkout() {
    // Add event listener to the "CHECKOUT" button
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price.slice(1)) * item.quantity), 0);
    document.getElementById('pointstoadd').textContent = `POINTS: ${localStorage.getItem('points')} (100 points=$1)`
    document.getElementById('checkoutform').addEventListener("submit", function(e){
        e.preventDefault();
        let pointsused = document.getElementById('pointstouse').value || 0;
        console.log(pointsused);
        if(pointsused < parseInt(localStorage.getItem('points'))){
            let discount = pointsused/100;
            let newtotalPrice = totalPrice;
            newtotalPrice -= discount;
            newtotalPrice += 5;
            console.log(newtotalPrice);
            let points = Math.floor(newtotalPrice * 0.72);

            // Get the modal
            var modal = document.getElementById('paymentSuccessModal');

            modal.style.display = "block";

            document.getElementById("pointsearned").textContent = `Points to Earn: ${points}`;
            document.getElementById("user").textContent = `Username: ${localStorage.getItem('username')}`;
            document.getElementById("total").textContent = `Amount to pay: ${newtotalPrice}`
            document.getElementById("usedpoints").textContent = `Points Used: ${pointsused} (${discount})`
            
            // Get the <span> element that closes the modal
            var x = document.getElementById("x");

            // When the user clicks on <span> (x), close the modal
            x.onclick = function() {
            modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
            }

            document.getElementById('confirm').addEventListener('click', async function() {
                const APIKEY = "65b11c87a07ee8c4ea038308";
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
                    let currentPoints = pointsData.points;
                    let newTotalPoints = currentPoints + points - pointsused;
            
                    await fetch(`https://fedassignment2-b6e1.restdb.io/rest/pointcard/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-apikey': APIKEY
                        },
                        body: JSON.stringify({ points: newTotalPoints })
                    });
                    localStorage.setItem('points', newTotalPoints);
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
            
                    alert("Payment Confirmed");
                    localStorage.removeItem('cart');
                    window.location.href = "index.html"; // Redirect to the home page after all operations are complete
                } catch (error) {
                    console.error('Error during checkout process:', error);
                }
            });
        }
        else{
            alert('Invalid Points')
            document.getElementById('checkoutform').reset()
        }
    })

    

    
};

// Check which page is currently loaded and run the appropriate function
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes('shopping.html') || window.location.href.includes('productpage.html')) {
        addToCart();
    } else if (window.location.href.includes('checkout.html')) {
        displayCart();
        checkout();
    }
});


if (localStorage.getItem('loggedin') === 'true' && !window.location.href.includes('checkout.html')){
    document.getElementById("usernamePlaceholder").innerHTML = `
    <li class="nav-item dropdown">
    <a class="nav-link profile-dropdown-toggle" href="#" id="profileDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fa-solid fa-circle-user me-1"></i> ${localStorage.getItem('username').toUpperCase()} <i class="fa-solid fa-arrow-down"></i>
    </a>
    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
        <div class="profile-card">
            <div class="profile-card-body">
                <h5 class="profile-card-title">${localStorage.getItem('username')}</h5>
                <p class="profile-card-text">Points: ${localStorage.getItem('points')}</p>
                <a href="#" class="btn btn-danger btn-logout">Log Out</a>
            </div>
        </div>
    </div>
</li>`

    document.querySelector('.btn-logout').addEventListener('click',function(){
        localStorage.clear();
        location.reload();
    })
}
