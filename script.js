// Register
function register() {

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(fullname==="" || email==="" || password===""){
        alert("Please fill all fields.");
        return;
    }

    const user = {
        fullname: fullname,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration Successful!");

    window.location.href = "login.html";
}

// Login
function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
        alert("No account found.");
        return;
    }

    if(email===user.email && password===user.password){

        localStorage.setItem("loggedIn","true");

        alert("Login Successful");

        window.location.href="dashboard.html";

    }else{

        alert("Invalid Email or Password");

    }

}

// Deposit
function submitDeposit(){

    alert("Deposit Submitted!");

}

// Withdraw
function submitWithdraw(){

    alert("Withdraw Submitted!");

}
