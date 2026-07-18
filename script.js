// ==========================
// PIX PAY - PART 
// ==========================
const plans = {
    5:{daily:0.73,days:20},
    10:{daily:1.45,days:20},
    20:{daily:2.9,days:20},
    40:{daily:5.8,days:20},
    80:{daily:12,days:20},
    160:{daily:24,days:20},
    320:{daily:48,days:20},
    640:{daily:96,days:20},
    1280:{daily:195,days:20},
    2560:{daily:400,days:20},
    6000:{daily:900,days:20},
    10000:{daily:1580,days:20}
};
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

    if(amount <= 0 || txid=="" || receipt==0){
        alert("Please fill all fields and upload screenshot.");
        return;
    }

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
    loadStats();

    alert("Deposit request submitted! Waiting for Admin approval.");

}

// ==========================
// Withdraw
// ==========================
function submitWithdraw(){

    let amount = Number(document.getElementById("amount").value);

    if(amount <= 0){
        alert("Enter valid amount");
        return;
    }

    let balance = Number(localStorage.getItem("balance"));

    if(balance < amount){
        alert("Not enough balance!");
        return;
    }

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type: "Withdraw",
        amount: amount,
        status: "Pending",
        date: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();
    loadStats();

    alert("Withdraw submitted successfully!");

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

    let investments = JSON.parse(localStorage.getItem("investments")) || [];

    investments.push({
        amount: price,
        daily: plans[price].daily,
        days: 20,
        start: Date.now(),
        lastClaim: Date.now(),
        claimedDays: 0,
        finished: false
    });

    localStorage.setItem("investments", JSON.stringify(investments));

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        type:"Investment",
        amount:price,
        date:new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadBalance();
    loadStats();

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
window.onload = function(){

    autoProfit();

    loadBalance();

    loadStats();

    updateCountdown();

    // Countdown រៀងរាល់ 1 វិនាទី
    setInterval(updateCountdown,1000);

    // ពិនិត្យប្រាក់រៀងរាល់ 1 នាទី
    setInterval(autoProfit,60000);

    if(document.getElementById("network")){
        changeWallet();
    }

    if(document.getElementById("historyList")){
        loadHistory();
    }

    if(document.getElementById("adminHistory")){
        loadAdminHistory();
    }

}
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
// ==========================
// Admin Panel
// ==========================

function loadAdminHistory(){

    let history = JSON.parse(localStorage.getItem("history")) || [];

    let admin = document.getElementById("adminHistory");

    if(!admin) return;

    if(history.length === 0){
        admin.innerHTML = "<p>No requests found.</p>";
        return;
    }

    let html = "";

    history.forEach(function(item,index){

        html += `
        <div class="card" style="margin-bottom:15px;">
            <h3>${item.type}</h3>

            ${item.network ? `<p><strong>Network:</strong> ${item.network}</p>` : ""}

            <p><strong>Amount:</strong> $${item.amount}</p>

            <p><strong>Status:</strong> ${item.status || "Completed"}</p>

            <p><strong>Date:</strong> ${item.date}</p>

            <button onclick="approveRequest(${index})">✅ Approve</button>

            <button onclick="rejectRequest(${index})">❌ Reject</button>

        </div>
        `;
    });

    admin.innerHTML = html;

}
// ==========================
// Admin Approve / Reject
// ==========================
function approveRequest(index){

    let history = JSON.parse(localStorage.getItem("history")) || [];

    let balance = Number(localStorage.getItem("balance")) || 0;

    if(history[index].type==="Deposit" && history[index].status==="Pending"){
        balance += Number(history[index].amount);
    }

    if(history[index].type==="Withdraw" && history[index].status==="Pending"){
        balance -= Number(history[index].amount);
    }

    localStorage.setItem("balance", balance);

    history[index].status="Completed";

    localStorage.setItem("history", JSON.stringify(history));

    alert("Approved!");

    loadAdminHistory();
}

function rejectRequest(index){

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history[index].status = "Rejected";

    localStorage.setItem("history", JSON.stringify(history));

    alert("Request Rejected!");

    loadAdminHistory();

}
function adminLogin(){

    let email = document.getElementById("adminUser").value.trim();
    let pass = document.getElementById("adminPass").value.trim();

    if(email === "admin@gmail.com" && pass === "123456"){

        localStorage.setItem("adminLogin","true");

        window.location.href = "admin.html";

    }else{

        alert("Wrong Email or Password");

    }

        }
function autoProfit(){

    let balance = Number(localStorage.getItem("balance")) || 0;

    let investments = JSON.parse(localStorage.getItem("investments")) || [];

    let now = Date.now();

    investments.forEach(plan=>{

        if(plan.finished) return;

        while(now - plan.lastClaim >= 86400000 && plan.claimedDays < 20){

            balance += plan.daily;

            plan.claimedDays++;

            plan.lastClaim += 86400000;

            if(plan.claimedDays >= 20){

                balance += plan.amount * 0.5;

                plan.finished = true;

            }

        }

    });

    localStorage.setItem("balance", balance);
    localStorage.setItem("investments", JSON.stringify(investments));

    loadBalance();
    loadStats();
    }


// ==========================
// AUTO PROFIT + COUNTDOWN
// ==========================

function autoProfit(){

    let balance = Number(localStorage.getItem("balance")) || 0;

    let investments = JSON.parse(localStorage.getItem("investments")) || [];

    let now = Date.now();

    investments.forEach(plan=>{

        if(plan.finished) return;

        while(now - plan.lastClaim >= 86400000 && plan.claimedDays < plan.days){

            // Daily Profit
            balance += Number(plan.daily);

            plan.claimedDays++;

            plan.lastClaim += 86400000;

            // Finish Plan
            if(plan.claimedDays >= plan.days){

                // Return 50% Principal
                balance += plan.amount * 0.5;

                plan.finished = true;

            }

        }

    });

    localStorage.setItem("balance",balance);
    localStorage.setItem("investments",JSON.stringify(investments));

    loadBalance();
    loadStats();

}

// ==========================
// COUNTDOWN
// ==========================

function updateCountdown(){

    let investments = JSON.parse(localStorage.getItem("investments")) || [];

    investments.forEach(plan=>{

        let el = document.getElementById("countdown"+plan.amount);

        if(!el) return;

        if(plan.finished){

            el.innerHTML="Completed";

            return;

        }

        let next = plan.lastClaim + 86400000;

        let diff = next - Date.now();

        if(diff < 0) diff = 0;

        let h = Math.floor(diff/3600000);

        let m = Math.floor((diff%3600000)/60000);

        let s = Math.floor((diff%60000)/1000);

        el.innerHTML =
            String(h).padStart(2,"0")+":"+
            String(m).padStart(2,"0")+":"+
            String(s).padStart(2,"0");

    });

            }
