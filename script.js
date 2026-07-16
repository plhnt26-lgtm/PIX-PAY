// Register
function register() {
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(fullname==="" || email==="" || password===""){
        alert("Please fill all fields.");
        return;
    }

    const user = { fullname, email, password };
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

// Balance
if(localStorage.getItem("balance")==null){
    localStorage.setItem("balance",1000);
}

function loadBalance(){
    const balance = localStorage.getItem("balance");
    const balanceText = document.getElementById("balance");

    if(balanceText){
        balanceText.innerHTML = "$" + Number(balance).toFixed(2);
    }
}

// Buy Plan
function buyPlan(price) {
function buyPlan(price) {

    let balance = Number(localStorage.getItem("balance")) || 0;

    if (balance < price) {
        alert("Not enough balance!");
        return;
    }

    if (!confirm("Do you want to buy this plan for $" + price + "?")) {
        return;
    }

    balance -= price;

    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history") || "[]");

    history.push({
        type: "Investment",
        amount: price,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Plan purchased successfully!");
}
    localStorage.setItem("balance", balance);

    let history = JSON.parse(localStorage.getItem("history") || "[]");

    history.push({
        type: "Investment",
        amount: price,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();

    alert("Plan purchased successfully!");
}

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

// History
function loadHistory(){

    let history = JSON.parse(localStorage.getItem("history")) || [];
    let historyList = document.getElementById("historyList");

    if(!historyList) return;

    if(history.length===0){
        historyList.innerHTML="<p>No investment history.</p>";
        return;
    }

    let html="";

    history.forEach(function(item){
        html += `
        <div class="card" style="margin-top:15px;">
            <h3>${item.type}</h3>
            <p>Amount: $${item.amount}</p>
            <p>Date: ${item.date}</p>
        </div>`;
    });

    historyList.innerHTML = html;
}
