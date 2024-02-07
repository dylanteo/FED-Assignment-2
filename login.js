
document.addEventListener('DOMContentLoaded', function() {
    const APIKEY = "65b11c87a07ee8c4ea038308";

    document.getElementById("loginform").addEventListener("submit", function(e){
        e.preventDefault(); 
        
    
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        
        fetch('https://fedassignment2-b6e1.restdb.io/rest/account?q={"username":"' + username + '"}', {
            method: 'GET', // Changed to POST
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY
            },
        })
        .then(response => {
            if (!response.ok) { // Check if response status is not OK
              throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0 && data[0].password === password) { // Assuming the API returns a token on successful login
                alert("Login successful!");
                // Store the token/session data
                localStorage.setItem('username', username); // Storing token instead of username
                email = data[0].email;
                let accountdetails =  `${username} ${email} ${password}`;
                localStorage.setItem('account', accountdetails);
                localStorage.setItem('loggedin', 'true');
                window.location.href = 'index.html'; // Replace with your destination URL
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
});
