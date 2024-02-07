
const APIKEY = "65b11c87a07ee8c4ea038308"

var apiUrl = 'https://fedassignment2-b6e1.restdb.io/rest/account'; // Replace with your API URL

function signup()
{
    document.getElementById("signup").addEventListener("submit", function(e){
        
        e.preventDefault();
        

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


        fetch(apiUrl, settings)
        .then(response =>{
            if (!response.ok) { // Check if response status is not OK
            throw new Error('Error:', error);
            }return response.json()
        })
        .then(data => {
            alert("Sign up Succesful!");
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
            fetch('https://fedassignment2-b6e1.restdb.io/rest/shoppingcart', cartsettings)
            .then(data =>{
                console.log(data);
            })
            fetch('https://fedassignment2-b6e1.restdb.io/rest/pointcard', pointssettings)
            .then(data =>{
                console.log(data);
            })
        })
        .catch(error =>{
            console.error('Error:', error);
            alert("Email or username already in use / Invalid email");
        });
        document.getElementById("register-form").reset();

    });
}

function login(){
    document.getElementById("loginform").addEventListener("submit", function(e){
        e.preventDefault(); 
        
    
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
        .then(data => {
            if (data.length > 0 && data[0].password === password) { // Assuming the API returns a token on successful login
                console.log(data);
                alert("Login successful!");
                // Store the token/session data
                localStorage.setItem('username', username); // Storing token instead of username
                email = data[0].email;
                let accountdetails =  data[0]._id;
                localStorage.setItem('account', accountdetails);
                localStorage.setItem('loggedin', 'true');

                fetch('https://fedassignment2-b6e1.restdb.io/rest/pointcard', settings)
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Extract the ObjectID from the response
                    if (data.length > 0) {
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].user[0]._id == localStorage.getItem('account')) {
                            localStorage.setItem('pointcardid', data[i]._id);
                            console.log(localStorage.getItem('pointcardid'));
                        }
                    }
                    // Now you can use this ObjectID to perform further operations
                    } else {
                    console.log('No data found');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                fetch('https://fedassignment2-b6e1.restdb.io/rest/shoppingcart', settings)
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Extract the ObjectID from the response
                    if (data.length > 0) {
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].user[0]._id == localStorage.getItem('account')) {
                            localStorage.setItem('cartid', data[i]._id);
                            console.log(localStorage.getItem('cartid'));
                        }
                    }
                    // Now you can use this ObjectID to perform further operations
                    } else {
                    console.log('No data found');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            window.location.href = "index.html";// Replace with your destination URL
            } else {
                // Handle login failure
                alert('Login failed!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Login failed!");
        });
    });

}


if (window.location.href.includes('login.html')) {
    login();
} else if (window.location.href.includes('signup.html')) {
    signup();
}