// ==========================
// PIX PAY - script.js
// ==========================

// Default Balance
if (localStorage.getItem("balance") == null) {
    localStorage.setItem("balance", "1000");
}

// ==========================
// Register
// ==========================
function register() {

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (fullname === "" || email === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }

    const user = {
        fullname,
        email,
        password
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration Successful!");
    window.location.href = "login.html";
}

// ==========================
// Login
// ==========================
function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("No account found.");
        return;
    }

    if (email === user.email && password === user.password) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Email or Password");
    }

}

// ==========================
// Balance
// ==========================
function loadBalance() {

    const balance = Number(localStorage.getItem("balance")) || 0;

    const balanceText = document.getElementById("balance");

    if (balanceText) {
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

    if(amount <= 0 || txid=="" || receipt==0){
        alert("Please fill all fields.");
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
        status:"Pending",
        date:new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Deposit Submitted!");

}
// ==========================
// Withdraw
// ==========================
function submitWithdraw(){

    let amount = Number(document.getElementById("amount").value);

    let balance = Number(localStorage.getItem("balance"));

    if(amount <= 0){
        alert("Enter valid amount.");
        return;
    }

    if(amount > balance){
        alert("Insufficient Balance!");
        return;
    }

    balance -= amount;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type:"Withdraw",
        amount:amount,
        status:"Pending",
        date:new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Withdraw Submitted!");

}

// ==========================
// Buy Investment
// ==========================
function buyPlan(price){

    let balance = Number(localStorage.getItem("balance"));

    if(balance < price){
        alert("Not enough balance!");
        return;
    }

    if(!confirm("Buy $" + price + " Plan?")){
        return;
    }

    balance -= price;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type:"Investment",
        amount:price,
        status:"Running",
        date:new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Investment Successful!");

}

// ==========================
// History
// ==========================
function loadHistory(){

    let history = JSON.parse(localStorage.getItem("history")) || [];

    let historyList = document.getElementById("historyList");

    if(!historyList) return;

    if(history.length===0){
        historyList.innerHTML="<p>No history found.</p>";
        return;
    }

    let html="";

    history.slice().reverse().forEach(function(item){

        html += `
        <div class="card" style="margin-top:15px;">
            <h3>${item.type}</h3>
            ${item.network ? `<p><b>Network:</b> ${item.network}</p>` : ""}
            <p><b>Amount:</b> $${item.amount}</p>
            ${item.status ? `<p><b>Status:</b> ${item.status}</p>` : ""}
            <p><b>Date:</b> ${item.date}</p>
        </div>
        `;

    });

    historyList.innerHTML = html;

}

// ==========================
// Logout
// ==========================
function logout(){

    localStorage.removeItem("loggedIn");
    window.location.href="index.html";

}

// ==========================
// Wallet
// ==========================
function changeWallet(){

    let network=document.getElementById("network").value;
    let wallet=document.getElementById("walletAddress");
    let qr=document.getElementById("walletQR");

    if(network=="trx"){
        wallet.textContent="TCuA1a25GMck
