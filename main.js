document.addEventListener('DOMContentLoaded', function() {
    const APIKEY = "65b11c87a07ee8c4ea038308"
    document.getElementById("add-update-msg").style.display = "none";

    document.getElementById("signup").addEventListener("click", function(e){
        
        e.preventDefault();
        var apiUrl = 'https://fedassignment2-b6e1.restdb.io/rest/account'; // Replace with your API URL

        let username = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("pass").value;

        let jsondata = {
            "username": username,
            "email": email,
            "password": password
        }
        let settings = {
            method: "POST", //[cher] we will use post to send info
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            },
            body: JSON.stringify(jsondata),
            beforeSend: function () {
                //@TODO use loading bar instead
                // Disable our button or show loading bar
                document.getElementById("signup").disabled = true;
                // Clear our form using the form ID and triggering its reset feature
                document.getElementById("register-form").reset();
            }
            }
        fetch(apiUrl, settings)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("signup").disabled = false;
                //@TODO update frontend UI 
                document.getElementById("add-update-msg").innerText = "Contact record successfully added";
                document.getElementById("add-update-msg").style.display = "block";
                setTimeout(function () {
                document.getElementById("add-update-msg").style.display = "none";
                }, 3000);
                // Clear the form
                document.getElementById("register-form").reset();
            })
        .finally(() => {
            document.getElementById("signup").disabled = false;
        });
        document.getElementById("register-form").reset();
        });
    });

