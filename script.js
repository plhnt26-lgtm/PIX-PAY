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
        fullname: fullname,
        email: email,
        password: password
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
function submitDeposit() {

    const amount = Number(document.getElementById("amount").value);

    if (amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    let balance = Number(localStorage.getItem("balance"));

    balance += amount;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type: "Deposit",
        amount: amount,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    alert("Deposit Successful!");

    loadBalance();

}

// ==========================
// Withdraw
// ==========================
function submitWithdraw() {

    const amount = Number(document.getElementById("amount").value);

    let balance = Number(localStorage.getItem("balance"));

    if (amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    if (amount > balance) {
        alert("Insufficient Balance");
        return;
    }

    balance -= amount;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type: "Withdraw",
        amount: amount,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    alert("Withdraw Successful!");

    loadBalance();

}

// ==========================
// Buy Investment Plan
// ==========================
function buyPlan(price) {

    let balance = Number(localStorage.getItem("balance"));

    if (balance < price) {
        alert("Not enough balance!");
        return;
    }

    const ok = confirm("Buy $" + price + " Investment Plan?");

    if (!ok) return;

    balance -= price;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type: "Investment",
        amount: price,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Investment Successful!");

}

// ==========================
// History
// ==========================
function loadHistory() {

    const history = JSON.parse(localStorage.getItem("history")) || [];

    const historyList = document.getElementById("historyList");

    if (!historyList) return;

    if (history.length === 0) {

        historyList.innerHTML = "<p>No history found.</p>";

        return;

    }

    let html = "";

    history.reverse().forEach(function(item) {

        html += `
        <div class="card">
            <h3>${item.type}</h3>
            <p><strong>Amount:</strong> $${item.amount}</p>
            <p><strong>Date:</strong> ${item.date}</p>
        </div>
        `;

    });

    historyList.innerHTML = html;

}

// ==========================
// Logout
// ==========================
function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "index.html";

}
function changeWallet(){

    let network = document.getElementById("network").value;
    let wallet = document.getElementById("walletAddress");

    if(network=="trx"){
        wallet.innerHTML="TCuA1a25GMckqtgu3KAXW3bBxu4kgSatfJ";
    }

    if(network=="bnb"){
        wallet.innerHTML="0x6680AF9efF2dE9f9bfAbac09520Bd8Fb1F5f6E0a";
    }

    if(network=="bsc"){
        wallet.innerHTML="0x6680AF9efF2dE9f9bfAbac09520Bd8Fb1F5f6E0a";
    }

    if(network=="sol"){
        wallet.innerHTML="FHYuDadDJfRKQrLNWXCHsZUbxZMDA1JybnFQmSvZnPfC";
    }

    if(network=="usdtsol"){
        wallet.innerHTML="FHYuDadDJfRKQrLNWXCHsZUbxZMDA1JybnFQmSvZnPfC";
    }

}

function copyAddress(){

    let address=document.getElementById("walletAddress").innerText;

    navigator.clipboard.writeText(address);

    alert("Address Copied!");

}
