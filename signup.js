document.addEventListener('DOMContentLoaded', function() {
    const APIKEY = "65b11c87a07ee8c4ea038308"

    document.getElementById("signup").addEventListener("click", function(e){
        
        e.preventDefault();
        var apiUrl = 'https://fedassignment2-b6e1.restdb.io/rest/account'; // Replace with your API URL

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
            document.getElementById("register-form").reset();
        })
        .catch(error =>{
            console.error('Error:', error);
            alert("Email or username already in use / Invalid email");
        });
        document.getElementById("register-form").reset();
    });
});

