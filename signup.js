
const APIKEY = "65b11c87a07ee8c4ea038308"

var apiUrl = 'https://fedassignment2-b6e1.restdb.io/rest/account'; // Replace with your API URL

function signup()
{
    document.getElementById("signup").addEventListener("submit", async function(e){
        
        e.preventDefault();
        
        document.getElementById('loading-screen').style.display = 'flex';

        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;


        let settings = {
            method: "POST", //[cher] we will use post to send info
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            },
            body: JSON.stringify({
                username,
                email,
                password
            }),
            beforeSend: function () {
                // Clear our form using the form ID and triggering its reset feature
                document.getElementById("register-form").reset();
            }
        }


        await fetch(apiUrl, settings)
        .then(response =>{
            if (!response.ok) { // Check if response status is not OK
            throw new Error('Error:', error);
            }return response.json()
        })
        .then(async data => {
            console.log(data);
            let user = data;
            let cartsettings = {
                method: "POST", //[cher] we will use post to send info
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                },
                body: JSON.stringify({
                    user
                })
            }
            let pointssettings = {
                method: "POST", //[cher] we will use post to send info
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                },
                body: JSON.stringify({
                    user,
                    points: 0
                })
            }
            await fetch('https://fedassignment2-b6e1.restdb.io/rest/shoppingcart', cartsettings)
            .then(data =>{
                console.log(data);
            })
            await fetch('https://fedassignment2-b6e1.restdb.io/rest/pointcard', pointssettings)
            .then(data =>{
                console.log(data);
            })
            document.getElementById('loading-screen').style.display = 'none';
            alert("Sign up Succesful!");
        })
        .catch(error =>{
            console.error('Error:', error);
            document.getElementById('loading-screen').style.display = 'none';
            alert("Email or username already in use / Invalid email");
        });
        document.getElementById("register-form").reset();

    });
}

function login(){
    document.getElementById("loginform").addEventListener("submit", function(e){
        e.preventDefault(); 
        
        document.getElementById('loading-screen').style.display = 'flex';
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        
        var settings = {
            method: 'GET', // Changed to POST
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY
            }
        }
        fetch(`${apiUrl}?q={"username":"${username}"}`, settings)
        .then(response => {
            if (!response.ok) { // Check if response status is not OK
              throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            if (data.length > 0 && data[0].password === password) { // Assuming the API returns a token on successful login
                //console.log(data);
                
                // Store the token/session data
                localStorage.setItem('username', username); // Storing token instead of username
                email = data[0].email;
                let accountdetails =  data[0]._id;
                localStorage.setItem('account', accountdetails);
                localStorage.setItem('loggedin', 'true');

                await fetchAdditionalData('https://fedassignment2-b6e1.restdb.io/rest/pointcard', settings, 'pointcardid');
                await fetchAdditionalData('https://fedassignment2-b6e1.restdb.io/rest/shoppingcart', settings, 'cartid');
                document.getElementById('loading-screen').style.display = 'none';
                alert("Login successful!");
                window.location.href = "index.html";
                
            } else {
                // Handle login failure
                document.getElementById('loading-screen').style.display = 'none';
                alert('Login failed!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('loading-screen').style.display = 'none';
            alert("Login failed!");
        });
    });

}

async function fetchAdditionalData(url, settings, localStorageKey) {
    const response = await fetch(url, settings);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.length > 0) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (data[i].user[0]._id == localStorage.getItem('account')) {
                localStorage.setItem(localStorageKey, data[i]._id);
                if (url == 'https://fedassignment2-b6e1.restdb.io/rest/pointcard' ){
                    localStorage.setItem('points', data[i].points)
                }
                console.log(localStorage.getItem(localStorageKey));
                break; // Assuming you only need to match the first found item
            }
        }
    } else {
        console.log('No data found');
    }
}

if (window.location.href.includes('login.html')) {
    login();
} else if (window.location.href.includes('signup.html')) {
    signup();
}