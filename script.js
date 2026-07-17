// ==========================
// PIX PAY - PART 
// ==========================

// Default Balance
if (localStorage.getItem("balance") == null) {
    localStorage.setItem("balance", "1000");
}

// ==========================
// Register
// ==========================
function register(){

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
    window.location.href="login.html";
}

// ==========================
// Login
// ==========================
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
        window.location.href="dashboard.html";

    }else{

        alert("Invalid Email or Password");

    }

}

// ==========================
// Logout
// ==========================
function logout(){

    localStorage.removeItem("loggedIn");
    window.location.href="index.html";

}

// ==========================
// Balance
// ==========================
function loadBalance(){

    let balance = Number(localStorage.getItem("balance")) || 0;

    let balanceText = document.getElementById("balance");

    if(balanceText){
        balanceText.innerHTML = "$" + balance.toFixed(2);
    }

}

// ==========================
// Deposit
// ==========================
function submitDeposit(){

    let amount = Number(document.getElementById("amount").value);
    let txid = document.getElementById("txid").value;
    let receipt = document.getElementById("receipt").files.length;
    let network = document.getElementById("network").value;

    if(amount<=0 || txid==="" || receipt==0){
        alert("Please complete all fields.");
        return;
    }

    let balance = Number(localStorage.getItem("balance"));
    balance += amount;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type:"Deposit",
        network:network.toUpperCase(),
        amount:amount,
        status:"Completed",
        date:new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Deposit Successful!");

}

// ==========================
// Withdraw
// ==========================
function submitWithdraw(){

    let amount = Number(document.getElementById("amount").value);

    let balance = Number(localStorage.getItem("balance"));

    if(amount<=0){
        alert("Enter valid amount");
        return;
    }

    if(amount>balance){
        alert("Insufficient Balance");
        return;
    }

    balance -= amount;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type:"Withdraw",
        amount:amount,
        date:new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Withdraw Successful!");

        }
