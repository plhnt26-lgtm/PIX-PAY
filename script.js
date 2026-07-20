import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ===============================
// REGISTER
// ===============================
async function register(){

const fullname=document.getElementById("fullname").value.trim();
const email=document.getElementById("email").value.trim();
const password=document.getElementById("password").value;

if(fullname==""||email==""||password==""){
alert("Please fill all fields");
return;
}

try{

const userCredential=await createUserWithEmailAndPassword(auth,email,password);

const user=userCredential.user;

await setDoc(doc(db,"users",user.uid),{

fullname:fullname,
email:email,
balance:0,
totalDeposit:0,
totalWithdraw:0,
totalInvestment:0,
createdAt:new Date().toISOString()

});

alert("Registration Successful");

window.location.href="login.html";

}catch(error){

alert(error.message);

}

}

// ===============================
// LOGIN
// ===============================
async function login(){

const email=document.getElementById("email").value.trim();
const password=document.getElementById("password").value;

if(email==""||password==""){
alert("Please fill all fields");
return;
}

try{

await signInWithEmailAndPassword(auth,email,password);

window.location.href="dashboard.html";

}catch(error){

alert(error.message);

}

}

// ===============================
// LOGOUT
// ===============================
async function logout(){

await signOut(auth);

window.location.href="login.html";

}

// ===============================
// CHECK LOGIN
// ===============================
onAuthStateChanged(auth,async(user)=>{

if(!user){

if(
location.pathname.includes("dashboard")||
location.pathname.includes("deposit")||
location.pathname.includes("withdraw")||
location.pathname.includes("history")||
location.pathname.includes("profile")
){

window.location.href="login.html";

}

return;

}

const snap=await getDoc(doc(db,"users",user.uid));

if(!snap.exists()) return;

const data=snap.data();

// User Name
const fullname=document.getElementById("fullnameText");

if(fullname){
fullname.innerHTML=data.fullname;
}

// Balance
const balance=document.getElementById("balance");

if(balance){
balance.innerHTML="$"+Number(data.balance).toFixed(2);
}

});

// ===============================
// SHOW PASSWORD
// ===============================
function showPassword(){

const pass=document.getElementById("password");

if(pass){

pass.type=
pass.type==="password"?"text":"password";

}

}

// ===============================
// MENU
// ===============================
function toggleMenu(){

const menu=document.getElementById("topMenu");

if(menu){

menu.classList.toggle("show");

}

}

// ===============================
// EXPORT
// ===============================
window.register=register;
window.login=login;
window.logout=logout;
window.showPassword=showPassword;
window.toggleMenu=toggleMenu;
import {
collection,
addDoc,
getDocs,
query,
where,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ===============================
// Deposit
// ===============================
async function submitDeposit(){

const user=auth.currentUser;

if(!user){
alert("Please login");
return;
}

const amount=Number(document.getElementById("amount").value);
const network=document.getElementById("network").value;
const txid=document.getElementById("txid").value;

if(amount<=0||txid==""){
alert("Please fill all fields");
return;
}

await addDoc(collection(db,"transactions"),{

uid:user.uid,
type:"Deposit",
amount:amount,
network:network,
txid:txid,
status:"Pending",
createdAt:serverTimestamp()

});

alert("Deposit submitted.");

location.href="history.html";

}

// ===============================
// Withdraw
// ===============================
async function submitWithdraw(){

const user=auth.currentUser;

if(!user){
alert("Please login");
return;
}

const amount=Number(document.getElementById("amount").value);
const wallet=document.getElementById("wallet").value;

if(amount<=0||wallet==""){
alert("Please fill all fields");
return;
}

await addDoc(collection(db,"transactions"),{

uid:user.uid,
type:"Withdraw",
amount:amount,
wallet:wallet,
status:"Pending",
createdAt:serverTimestamp()

});

alert("Withdraw submitted.");

location.href="history.html";

}

// ===============================
// Load History
// ===============================
async function loadHistory(){

const user=auth.currentUser;

if(!user) return;

const history=document.getElementById("historyList");

if(!history) return;

const q=query(
collection(db,"transactions"),
where("uid","==",user.uid)
);

const snapshot=await getDocs(q);

history.innerHTML="";

if(snapshot.empty){

history.innerHTML="<p>No Transaction.</p>";

return;

}

snapshot.forEach(doc=>{

const item=doc.data();

let color="#666";

if(item.type=="Deposit") color="#0abf53";
if(item.type=="Withdraw") color="#ff3b30";

history.innerHTML+=`

<div class="history-item">

<div>

<b>${item.type}</b>

<p>${item.status}</p>

</div>

<strong style="color:${color};">

$${item.amount}

</strong>

</div>

`;

});

}

// ===============================
window.submitDeposit=submitDeposit;
window.submitWithdraw=submitWithdraw;
window.loadHistory=loadHistory;
import {
doc,
getDoc,
updateDoc,
addDoc,
collection,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ===========================
// Load Balance
// ===========================
async function loadBalance(){

const user=auth.currentUser;
if(!user) return;

const ref=doc(db,"users",user.uid);
const snap=await getDoc(ref);

if(!snap.exists()) return;

const data=snap.data();

const balance=document.getElementById("balance");

if(balance){
balance.innerHTML="$"+Number(data.balance||0).toFixed(2);
}

}

// ===========================
// VIP Plans
// ===========================
const plans={

5:{daily:0.73,days:20},
10:{daily:1.45,days:20},
20:{daily:2.90,days:20},
40:{daily:5.80,days:20},
80:{daily:12,days:20},
160:{daily:24,days:20},
320:{daily:48,days:20},
640:{daily:96,days:20},
1280:{daily:195,days:20},
2560:{daily:400,days:20},
6000:{daily:900,days:20},
10000:{daily:1580,days:20}

};

// ===========================
// Buy Plan
// ===========================
async function buyPlan(price){

const user=auth.currentUser;

if(!user) return;

const ref=doc(db,"users",user.uid);
const snap=await getDoc(ref);

const data=snap.data();

let balance=Number(data.balance||0);

if(balance<price){

alert("Insufficient Balance");

return;

}

balance-=price;

await updateDoc(ref,{
balance:balance
});

await addDoc(collection(db,"investments"),{

uid:user.uid,

amount:price,

daily:plans[price].daily,

days:plans[price].days,

claimed:0,

status:"Running",

createdAt:serverTimestamp()

});

await addDoc(collection(db,"transactions"),{

uid:user.uid,

type:"Investment",

amount:price,

status:"Completed",

createdAt:serverTimestamp()

});

alert("VIP Plan Purchased");

loadBalance();

}

// ===========================
// Auto Profit
// ===========================
async function autoProfit(){

const user=auth.currentUser;

if(!user) return;

const q=query(
collection(db,"investments"),
where("uid","==",user.uid)
);

const snap=await getDocs(q);

snap.forEach(async(item)=>{

const plan=item.data();

if(plan.claimed>=plan.days) return;

const ref=doc(db,"investments",item.id);

await updateDoc(ref,{
claimed:plan.claimed+1
});

const userRef=doc(db,"users",user.uid);

const userSnap=await getDoc(userRef);

const balance=Number(userSnap.data().balance||0)+plan.daily;

await updateDoc(userRef,{
balance:balance
});

await addDoc(collection(db,"transactions"),{

uid:user.uid,

type:"Profit",

amount:plan.daily,

status:"Completed",

createdAt:serverTimestamp()

});

});

loadBalance();

}

// ===========================
window.buyPlan=buyPlan;
window.loadBalance=loadBalance;
window.autoProfit=autoProfit;
import {
collection,
getDocs,
query,
where,
doc,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// =========================
// Logout
// =========================
async function logout(){

await signOut(auth);

location.href="login.html";

}

// =========================
// Admin Statistics
// =========================
async function loadAdminStats(){

const snap=await getDocs(collection(db,"transactions"));

let deposit=0;
let withdraw=0;
let pending=0;

snap.forEach(item=>{

const data=item.data();

if(data.type==="Deposit")
deposit+=Number(data.amount);

if(data.type==="Withdraw")
withdraw+=Number(data.amount);

if(data.status==="Pending")
pending++;

});

if(document.getElementById("adminDeposit"))
document.getElementById("adminDeposit").innerHTML="$"+deposit.toFixed(2);

if(document.getElementById("adminWithdraw"))
document.getElementById("adminWithdraw").innerHTML="$"+withdraw.toFixed(2);

if(document.getElementById("adminPending"))
document.getElementById("adminPending").innerHTML=pending;

}

// =========================
// Admin History
// =========================
async function loadAdminHistory(){

const box=document.getElementById("adminHistory");

if(!box) return;

const snap=await getDocs(collection(db,"transactions"));

box.innerHTML="";

snap.forEach(item=>{

const data=item.data();

box.innerHTML+=`

<div class="history-item">

<div>

<b>${data.type}</b>

<p>${data.status}</p>

<p>$${data.amount}</p>

</div>

<div>

<button onclick="approveRequest('${item.id}')">✅</button>

<button onclick="rejectRequest('${item.id}')">❌</button>

</div>

</div>

`;

});

}

// =========================
// Approve
// =========================
async function approveRequest(id){

const ref=doc(db,"transactions",id);

const snap=await getDoc(ref);

if(!snap.exists()) return;

const data=snap.data();

if(data.status==="Completed") return;

await updateDoc(ref,{
status:"Completed"
});

alert("Approved");

loadAdminHistory();
loadAdminStats();

}

// =========================
// Reject
// =========================
async function rejectRequest(id){

const ref=doc(db,"transactions",id);

await updateDoc(ref,{
status:"Rejected"
});

alert("Rejected");

loadAdminHistory();
loadAdminStats();

}

// =========================
// Notification
// =========================
function loadNotification(){

const box=document.getElementById("notificationBox");

if(box){
