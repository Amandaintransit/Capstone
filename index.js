
function saveFirstPage() {
  
    let custA = document.getElementById("custodianA").value;
    let custB = document.getElementById("custodianB").value;
    let numbOfChildren = Number(document.getElementById("numberOfChildren").value);

    localStorage.setItem("custodianA", custA);
     localStorage.setItem("custodianB", custB);
     localStorage.setItem("numberOfChildren", numbOfChildren);

     window.location.href = "custodianInformation.html";

}

  function loadCustodianInformation(){  

let cusA = localStorage.getItem("custodianA");
let cusB =localStorage.getItem("custodianB");
let numOfChildren = localStorage.getItem("numberOfChildren");

    
        document.getElementById("welcome1").textContent = cusA;
        document.getElementById("CustB").textContent = cusB;
        document.getElementById("CustBmaintenance").textContent = cusB;
        document.getElementById("CustBpriorsupport").textContent = cusB;
        document.getElementById("CustBhealth").textContent = cusB;
        document.getElementById("CustBchildcare").textContent = cusB;
        document.getElementById("CustBagi").textContent = cusB;   
        document.getElementById("kids").textContent = numOfChildren;
        document.getElementById("BPercent").textContent = cusB; 
        document.getElementById("BObligation").textContent = cusB;
        document.getElementById("BOblig").textContent = cusB;  
        document.getElementById("OtherCustodian").textContent = cusB;
        document.getElementById("CustBDeductions").textContent = cusB;
  }
/*calculate AGI for custodian A*/
function calculateAdjustedGrossIncomeA() {
    let grossA = Number(document.getElementById("grossIncomeA").value);
    let maintenanceA = Number(document.getElementById("maintenanceDeductionA").value);
    let priorChildDeductionA = Number(document.getElementById("priorbornChildDeductionA").value);
    
   localStorage.setItem("grossIncomeA", grossA);
    localStorage.setItem("maintenanceDeductionA", maintenanceA);
    localStorage.setItem("priorbornChildDeductionA", priorChildDeductionA);

    let adjustedGrossIncomeA = grossA - maintenanceA - priorChildDeductionA;

    const output = document.getElementById("agiA");
    if (output){
        output.textContent = adjustedGrossIncomeA.toFixed(2);
    }
    
     localStorage.setItem('adjustedGrossIncomeA', adjustedGrossIncomeA);

    return adjustedGrossIncomeA;

}

/*calculate AGI for custodian B*/
function calculateAdjustedGrossIncomeB() {
    let grossB = Number(document.getElementById("grossIncomeB").value);
    let maintenanceB = Number(document.getElementById("maintenanceDeductionB").value);
    let priorChildDeductionB = Number(document.getElementById("priorbornChildDeductionB").value);

    localStorage.setItem("grossIncomeB", grossB);
    localStorage.setItem("maintenanceDeductionB", maintenanceB);
    localStorage.setItem("priorbornChildDeductionB", priorChildDeductionB)

    let adjustedGrossIncomeB = grossB - maintenanceB - priorChildDeductionB;

    const output = document.getElementById("agiB");
    if (output) {
        output.textContent = adjustedGrossIncomeB.toFixed(2);
    }
     localStorage.setItem('adjustedGrossIncomeB', adjustedGrossIncomeB);
    return adjustedGrossIncomeB;

}
function calculateCombinedIncome() {
  
  const agiA = Number(localStorage.getItem("adjustedGrossIncomeA"));
  const agiB = Number(localStorage.getItem("adjustedGrossIncomeB"));

  const combinedIncome = agiA + agiB;
 localStorage.setItem("combinedIncome", combinedIncome);

  document.getElementById("combinedAgi").textContent = combinedIncome.toFixed(2);
  
 
    return combinedIncome;
}

function calculatePercentageCusA() {
  const agiA = Number(localStorage.getItem("adjustedGrossIncomeA"));
  const agiB = Number(localStorage.getItem("adjustedGrossIncomeB"));

  const combinedIncome = Number(localStorage.getItem("combinedIncome"))

  const percentageCustA = agiA/combinedIncome * 100;
  localStorage.setItem("percentageCustA", percentageCustA)

  document.getElementById("percentA").textContent = percentageCustA.toFixed(0) +"%";

  return percentageCustA;

}

function calculatePercentageCusB() {  
  const agiA = Number(localStorage.getItem("adjustedGrossIncomeA"));
  const agiB = Number(localStorage.getItem("adjustedGrossIncomeB"));

  const combinedIncome = Number(localStorage.getItem("combinedIncome"))

  const percentageCustB = agiB/combinedIncome * 100;
  localStorage.setItem("percentageCustB", percentageCustB)

  document.getElementById("percentB").textContent = percentageCustB.toFixed(0) + "%";

  return percentageCustB;}
    
/*pull the data from the google sheet table*/

  async function accessChildSupportTable() {
    try {
        const GuidelinesUrl ="https://sheets.googleapis.com/v4/spreadsheets/1lX7V_8IEhObhv6MXnffKUwwiilZkn6LvLDbFd_HPShA/values/ChildSupportTable?key=AIzaSyDV5DJJSaoS8aOsw8q3WMtnAMg7Gxo5jvg";
        const response = await fetch(GuidelinesUrl);
        
        if (!response.ok){
          throw new Error("Could not access guidelines");
        }
        const data = await response.json();

        return data.values;
    }
    catch (error) {
      console.error("error", error)
    }
    }

    /*finds highest income that combined income is lower than -- also cleans data b/c there were commas used in some figures*/

   function findIncomeRow(values, combinedIncome){
      for (let i = 1; i<values.length; i++){
        const raw = values[i][0];
        const rowIncome = Number(raw.replace(/,/g, ""));
       
        if (isNaN(rowIncome)){
          console.warn("Invalid income:", raw);
          continue;
        }
        if (combinedIncome < rowIncome) {
          return i -1;
        }
      }
      return values.length - 1;
   }
      
   function findChildColumn(values, numChildren){
      const headerRow = values[0];

      for (let col =1; col < headerRow.length; col++) {
        if (headerRow[col].startsWith(numChildren.toString())) {
          return col;
        }
      }
      return null;
   }
   async function getBaseObligation(){
    const combinedIncome = Number(localStorage.getItem("combinedIncome"));
    const numChildren = Number(localStorage.getItem("numberOfChildren"));

    const values = await accessChildSupportTable();

    const childCol = findChildColumn(values, numChildren);
    if (childCol === null) {
      console.error("Number of Children Exceeds Chart", numChildren);
      return null;
    }

    const incomeRow = findIncomeRow(values, combinedIncome);
    console.log("incomeRow =", incomeRow);
console.log("childCol =", childCol);
console.log("Raw cell value =", values[incomeRow]?.[childCol]);

    const rawAmount = values[incomeRow][childCol];
    const amount =  Number(String(rawAmount).replace(/,/g, "").trim());

      const base = document.getElementById("baseObligation");
      if (base) {
        base.textContent = amount.toFixed(2);
      } 

      localStorage.setItem("baseObligation", amount);

      return amount;
   }
   function percentageToObligationA(){
  const Apercent = Number(localStorage.getItem("percentageCustA"));
  const fullObligation = Number(localStorage.getItem("baseObligation"));
  const obligationA = (Apercent * .01) * fullObligation;
    localStorage.setItem("obligationA", obligationA)

    document.getElementById("dollarObligationA").textContent = obligationA.toFixed(2);

    return obligationA;
}
 function percentageToObligationB(){
  const Bpercent = Number(localStorage.getItem("percentageCustB"));
  const fullObligation = Number(localStorage.getItem("baseObligation"));
  const obligationB = (Bpercent * .01) * fullObligation;
    localStorage.setItem("obligationB", obligationB);

    document.getElementById("dollarObligationB").textContent = obligationB.toFixed(2);

    return obligationB;
 }

 function calculateNetObligationA() {
    const minuend = Number(localStorage.getItem("obligationA"));
  
    const insA = Number(document.getElementById("healthInsurancePremiumA").value);
    const childcareA = Number(document.getElementById("childCareCostsA").value);
   
    localStorage.setItem("healthInsurancePremiumA", insA);
    localStorage.setItem("childCareCostsA", childcareA);

    const subtrahend = insA + childcareA;

    const differenceA = minuend - subtrahend;
      
        document.getElementById("differenceA").textContent = differenceA.toFixed(2); 
      localStorage.setItem("differenceA", differenceA)  
      return differenceA;
 }
  function calculateNetObligationB() {
    const minuend = Number(localStorage.getItem("obligationB"));
  
    const insB = Number(document.getElementById("healthInsurancePremiumB").value);
    const childcareB = Number(document.getElementById("childCareCostsB").value);
   
    localStorage.setItem("healthInsurancePremiumB", insB);
    localStorage.setItem("childCareCostsB", childcareB);

    const subtrahend = insB + childcareB;

    const differenceB = minuend - subtrahend;
      
        document.getElementById("differenceB").textContent = differenceB.toFixed(2); 
        localStorage.setItem("differenceB", differenceB);
      return differenceB;
  }

  function calculateFinalObligation(){
     const timesharingInput = document.getElementById("timesharingB");
     const timesharingDays = Number(timesharingInput?.value) || 0;
     
    
    localStorage.setItem("timesharingB", timesharingDays);

    let multiplier;

        switch (true){
          case timesharingDays <73:
            multiplier = 1;
            break;
          case timesharingDays >= 73 && timesharingDays <=87:
            multiplier = .105;
            break;
          case timesharingDays>=88 && timesharingDays<=115:
            multiplier = .15;
            break;
          case timesharingDays >=116 && timesharingDays <=129:
            multiplier =.205;
            break;
          case timesharingDays>=130 && timesharingDays<=142:
            multiplier = .25;
            break;
          case timesharingDays>=143 && timesharingDays<=152:
            multiplier = .305;
            break;
          case timesharingDays>=153 && timesharingDays <=162:
            multiplier = .36;
            break;
          case timesharingDays>=163 && timesharingDays<=172:
            multiplier = .42;
            break;
          case timesharingDays>=173 && timesharingDays<=181:
            multiplier = .485;
            break;
          case timesharingDays>=182:
            multiplier =.50;
            break;
          default:
            multiplier = 1;
        }
      
        const multiplierPercent = (multiplier * 100).toFixed(1) + "%";
        localStorage.setItem("multiplier", multiplier);
        localStorage.setItem("multiplierPercent", multiplierPercent);

     document.getElementById("creditPercentage").textContent = multiplierPercent;
    
    const fullObligation = Number(localStorage.getItem("baseObligation"));
    const netDifB = Number(localStorage.getItem("differenceB"));
    const multiplierCredit = localStorage.getItem("multiplier")
    const credit = multiplier * netDifB;
            console.log(netDifB);
            console.log(multiplierCredit);
            console.log(credit);

    const monthlyObligation = netDifB - credit;
    
    localStorage.setItem("monthlyObligation", monthlyObligation)
    
    if (monthlyObligation <0){
  document.getElementById("monthlyObligation").textContent = `Your monthly child support obligation will be $ ${Math.abs(monthlyObligation.toFixed(2))}`;  
}
else {
  document.getElementById("monthlyObligation").textContent = `You should receive monthly child support of $ ${monthlyObligation.toFixed(2)}`; 
}
      return monthlyObligation;

  }

  async function savePageTwo() {
  // Force AGI calculations
  calculateAdjustedGrossIncomeA();
  calculateAdjustedGrossIncomeB();

  // Force combined + percentages
  calculateCombinedIncome();
  calculatePercentageCusA();
  calculatePercentageCusB();

  // Wait for guideline lookup
  await getBaseObligation();

  
  percentageToObligationA();
  percentageToObligationB();
  calculateNetObligationA();
  calculateNetObligationB();
  calculateFinalObligation();


  window.location.href = "worksheet.html";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = value;
}

function setMoney(id, value) {
  const num = Number(value);
  if (!isFinite(num)) {
    setText(id, "0.00");
    return;
  }
  setText(id, num.toFixed(2));
}

function setPercent(id, value) {
  const num = Number(value);
  if (!isFinite(num)) {
    setText(id, "0%");
    return;
  }
  setText(id, num.toFixed(0) + "%");
}

function loadWorksheet() {

  
  setText("worksheetCustA", localStorage.getItem("custodianA"));
  setText("worksheetCustB", localStorage.getItem("custodianB"));
  setText("worksheetKids", localStorage.getItem("numberOfChildren"));

 
  setMoney("worksheetGrossA", localStorage.getItem("grossIncomeA"));
  setMoney("worksheetMaintenanceA", localStorage.getItem("maintenanceDeductionA"));
  setMoney("worksheetChildDeductionA", localStorage.getItem("priorbornChildDeductionA"));
  setMoney("worksheetAdjustedGrossIncomeA", localStorage.getItem("adjustedGrossIncomeA"));
  setMoney("worksheetInsurancePremiumA", localStorage.getItem("healthInsurancePremiumA"));
  setMoney("worksheetChildcareA", localStorage.getItem("childCareCostsA"));

 
  setMoney("worksheetGrossB", localStorage.getItem("grossIncomeB"));
  setMoney("worksheetMaintenanceB", localStorage.getItem("maintenanceDeductionB"));
  setMoney("worksheetChildDeductionB", localStorage.getItem("priorbornChildDeductionB"));
  setMoney("worksheetAdjustedGrossIncomeB", localStorage.getItem("adjustedGrossIncomeB"));
  setMoney("worksheetInsurancePremiumB", localStorage.getItem("healthInsurancePremiumB"));
  setMoney("worksheetChildcareB", localStorage.getItem("childCareCostsB"));

 
  setPercent("worksheetPercentA", localStorage.getItem("percentageCustA"));
  setPercent("worksheetPercentB", localStorage.getItem("percentageCustB"));
  
  setMoney("worksheetOblA", localStorage.getItem("obligationA"));
  setMoney("worksheetOblB", localStorage.getItem("obligationB"));

  setMoney("worksheetNetOblA", localStorage.getItem("differenceA"));
  setMoney("worksheetNetOblB", localStorage.getItem("differenceB"));

  // ---- Time-sharing ----
  setText(
    "worksheetTimesharingB",
    Number(localStorage.getItem("timesharingB")) || 0
  );
  setText(
      "worksheetMultiplierPercentB", 
      localStorage.getItem("multiplierPercent")) || "0%";
 

  
  setMoney("worksheetCombined", localStorage.getItem("combinedIncome"));
  setMoney("worksheetBase", localStorage.getItem("baseObligation"));
  setMoney("worksheetMonthly", localStorage.getItem("monthlyObligation"));
}
function handleCaringChildUnder3Toggle(){
  
}


function handleDeductionsAToggle(){
    const yesChecked = document.getElementById("deductionsAYes").checked;
    const container = document.getElementById("deductionsAContainer");

    if(yesChecked) {
      container.style.display = "block";
    } else {
      container.style.display = "none";

    document.getElementById("maintenanceDeductionA").value = 0;
    document.getElementById("priorbornChildDeductionA").value = 0;
    }
}
  function handleDeductionsBToggle(){
    const yesChecked = document.getElementById("deductionsBYes").checked;
    const container = document.getElementById("deductionsBContainer");

    if(yesChecked) {
      container.style.display = "block";
    } else {
      container.style.display = "none";

    document.getElementById("maintenanceDeductionB").value = 0;
    document.getElementById("priorbornChildDeductionB").value = 0;
    }
}

/*function savePageTwo() {
  const requiredKeys = [
    "combinedIncome",
    "baseObligation",
    "monthlyObligation"
  ];

  for (const key of requiredKeys) {
    if (!localStorage.getItem(key)) {
      alert("Please complete all calculations before continuing.");
      return;
    }
  }

  window.location.href = "worksheet.html";
}

*/
 /*   
 function loadWorksheet() {
  const custA = localStorage.getItem("custodianA");
  const custB = localStorage.getItem("custodianB");
  const kids = localStorage.getItem("numberOfChildren");

  const grossA = Number(localStorage.getItem("grossIncomeA"));
  const maintenanceA = Number(localStorage.getItem("maintenanceDeductionA"));
  const priorChildDeductionA = Number(localStorage.getItem("priorbornChildDeductionA"));

  const adjustedGrossIncomeA = Number(localStorage.getItem("adjustedGrossIncomeA"));

  const grossB = Number(localStorage.getItem("grossIncomeB"));
  const maintenanceB = Number(localStorage.getItem("maintenanceDeductionB"));
  const priorChildDeductionB = Number(localStorage.getItem("priorbornChildDeductionB"));

  const adjustedGrossIncomeB = Number(localStorage.getItem("adjustedGrossIncomeB"));


  const combinedIncome = localStorage.getItem("combinedIncome");
  const baseObligation = localStorage.getItem("baseObligation");
  const monthlyObligation = localStorage.getItem("monthlyObligation");

  const insA = localStorage.getItem("healthInsurancePremiumA");
  const childcareA = localStorage.getItem("childCareCostsA");

  const insB = localStorage.getItem("healthInsurancePremiumB");
  const childcareB = localStorage.getItem("childCareCostsB");

  const percentageCustA = localStorage.getItem("percentageCustA");
  const percentageCustB = localStorage.getItem("percentageCustB");

  const obligationA = localStorage.getItem("obligationA");
  const obligationB = localStorage.getItem("obligationB");

  const timesharingDays = localStorage.getItem("timesharingB");
  const differenceA = localStorage.getItem("differenceA");
  const differenceB = localStorage.getItem("differenceB");
   
  if (document.getElementById("worksheetCustA")) {
    document.getElementById("worksheetCustA").textContent = custA;
    document.getElementById("worksheetCustB").textContent = custB;
    document.getElementById("worksheetKids").textContent = kids;
    document.getElementById("worksheetGrossA").textContent = Number(grossA).toFixed(2);
    document.getElementById("worksheetMaintenanceA").textContent =  Number(maintenanceA).toFixed(2);
    document.getElementById("worksheetChildDeductionA").textContent = Number(priorChildDeductionA).toFixed(2);
    
    document.getElementById("worksheetAdjustedGrossIncomeA").textContent = Number(adjustedGrossIncomeA).toFixed(2);
    document.getElementById("worksheetInsurancePremiumA").textContent = Number(insA).toFixed(2);
    document.getElementById("worksheetChildcareA").textContent = Number(childcareA).toFixed(2);

    document.getElementById("worksheetGrossB").textContent = Number(grossB).toFixed(2);
    document.getElementById("worksheetMaintenanceB").textContent =  Number(maintenanceB).toFixed(2);
    document.getElementById("worksheetChildDeductionB").textContent = Number(priorChildDeductionB).toFixed(2);

    document.getElementById("worksheetInsurancePremiumB").textContent = Number(insB).toFixed(2);
    document.getElementById("worksheetChildcareB").textContent = Number(childcareB).toFixed(2);

    document.getElementById("worksheetAdjustedGrossIncomeB").textContent = Number(adjustedGrossIncomeB).toFixed(2);
      
    document.getElementById("worksheetCombined").textContent = Number(combinedIncome).toFixed(2);

    document.getElementById("worksheetPercentA").textContent = Number(percentageCustA).toFixed(0) +"%";
    document.getElementById("worksheetPercentB").textContent = Number(percentageCustB).toFixed(0) +"%";

    document.getElementById("worksheetOblA").textContent = Number(obligationA).toFixed(2);
    document.getElementById("worksheetOblB").textContent = Number(obligationB).toFixed(2);

    document.getElementById("worksheetNetOblA").textContent = Number(differenceA).toFixed(2);
    document.getElementById("worksheetNetOblB").textContent = Number(differenceB).toFixed(2);
    document.getElementById("worksheetTimesharingB").textContent = Number(timesharingDays);

    document.getElementById("worksheetBase").textContent = Number(baseObligation).toFixed(2);

    document.getElementById("worksheetMonthly").textContent = Number(monthlyObligation).toFixed(2);
  }
}
*/