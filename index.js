
function saveFirstPage() {
    let custA = document.getElementById("custodianA").value;
    let custB = document.getElementById("custodianB").value;


    localStorage.setItem("custodianA", custA);
     localStorage.setItem("custodianB", custB);
    window.location.href = "custodianInformation.html";
}
let cusA = localStorage.getItem("custodianA")
let cusB =localStorage.getItem("custodianB");

document.getElementById("welcome1").textContent = cusA;
document.getElementById("CustB").textContent = cusB;
document.getElementById("CustBmaintenance").textContent = cusB
document.getElementById("CustBpriorsupport").textContent = cusB
document.getElementById("CustBhealth").textContent = cusB;
document.getElementById("CustBchildcare").textContent = cusB;

/*
const params = new URLSearchParams(window.location.search);

document.getElementById("custodianA").textContent = params.get("custodianA");
document.getElementById("custodianB").textContent = params.get("custodianB");

function calculateAdjustedGrossIncomeA() {

let custodianAGrossIncome = document.getElementById("grossIncomeA").value;
let maintenanceDeductionA = document.getElementById("maintenanceDeductionA").value;
let priorBornChildDeductionA = document.getElementById("priorBornChildDeductionA").value;

let AGIcustodianA = custodianAGrossIncome - maintenanceDeductionA - priorBornChildDeductionA;

document.getElementById("result").textContent = <p>`Your Adjusted Gross Income: ${AGIcustodianA}</p>;
}*/
