
const APIKEY = "65b11c87a07ee8c4ea038308";

document.addEventListener('DOMContentLoaded', function() {
    updatePricesFromAPI();
    getid();
});

function updatePricesFromAPI() {
    fetch('https://fedassignment2-b6e1.restdb.io/rest/item', { // Replace with your API URL
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
                let price = parseFloat(item.price).toFixed(2);
                card.querySelector('.card-title').textContent = item.itemname;
                card.querySelector('.card-text').textContent = `$${price}`;
                img = card.querySelector('.card-img-top');
                img.src = `https://fedassignment2-b6e1.restdb.io/media/${item.photo[0]}`;
            }
        });
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Hide the loading screen here, after the data is fetched
        document.getElementById('loading-screen').style.display = 'none';
        document.body.style.visibility = 'visible';
    });
}

// Call updatePricesFromAPI when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updatePricesFromAPI);



function getid(){
    document.querySelectorAll('.card').forEach(button => {
        button.addEventListener('click', function() {
            const cardID = button.querySelector('.id').textContent.trim();
            window.location.href = "productpage.html?cardID=" + encodeURIComponent(cardID);
        });
    })
    document.querySelectorAll('.card .btn-primary').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // This stops the click event from bubbling up to the .card element
        });
    });

}

function getCardIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('cardID'); // Extracts 'cardID' from the query string
}

function updateProductPage() {
    const cardID = getCardIDFromURL();
    if (!cardID) return; // If no cardID is found, exit the function

    fetch('https://fedassignment2-b6e1.restdb.io/rest/item', {
        method: 'GET',
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
        const item = items.find(item => item.id == cardID);
        if (item) {
            updatePageContent(item);
        }
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        // Hide the loading screen here, after the data is fetched
        document.getElementById('loading-screen').style.display = 'none';
        document.body.style.visibility = 'visible';
    });
}




function updatePageContent(item) {
    // Assuming '.price' is a container in your productpage.html
    let page = document.querySelector(".price");
    let price = parseFloat(item.price).toFixed(2);
    
    page.querySelector('.price-main__heading').textContent = item.itemname;
    page.querySelector('.price-txt').textContent = item.description;
    page.querySelector(".price-box__main-new").textContent = price;
    page.querySelector('.price-box__old').textContent = (price * 2).toFixed(2);
    page.querySelector("#stock").textContent = item.stock;
    document.querySelector('.img-main').src = `https://fedassignment2-b6e1.restdb.io/media/${item.photo[0]}`
}

// Call updateProductPage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateProductPage);
