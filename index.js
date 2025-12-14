
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
    let gross = Number(document.getElementById("grossIncomeB").value);
    let maintenance = Number(document.getElementById("maintenanceDeductionB").value);
    let priorChildDeduction = Number(document.getElementById("priorbornChildDeductionB").value);

    let adjustedGrossIncomeB = gross - maintenance - priorChildDeduction;

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
    localStorage.setItem("obligationB", obligationB)

    document.getElementById("dollarObligationB").textContent = obligationB.toFixed(2);

    return obligationB;
 }

 function calculateNetObligationA() {
    const minuend = Number(localStorage.getItem("obligationA"));
  
    const insA = Number(document.getElementById("healthInsurancePremiumA").value);
    const childcareA = Number(document.getElementById("childCareCostsA").value);
   
    const subtrahend = insA + childcareA;

    const differenceA = minuend - subtrahend;
      localStorage.setItem("differenceA", differenceA)
        document.getElementById("differenceA").textContent = differenceA.toFixed(2); 
        
      return differenceA;
 }
  function calculateNetObligationB() {
    const minuend = Number(localStorage.getItem("obligationB"));
  
    const insB = Number(document.getElementById("healthInsurancePremiumB").value);
    const childcareB = Number(document.getElementById("childCareCostsB").value);
   
    const subtrahend = insB + childcareB;

    const differenceB = minuend - subtrahend;
      localStorage.setItem("differenceB", differenceB)
        document.getElementById("differenceB").textContent = differenceB.toFixed(2); 
        
      return differenceB;
  }

  function calculateFinalObligation(){
     const timesharingDays = Number(document.getElementById("timesharingB").value);
    console.log(timesharingDays)
     const timesharingPercent = timesharingDays/365;
     console.log(timesharingPercent); 
    const fullObligation = Number(localStorage.getItem("baseObligation"));
    console.log(fullObligation);
    const credit = timesharingPercent * fullObligation;
    console.log(credit);
  
    const netDifB = Number(localStorage.getItem("differenceB"));
    console.log(netDifB);
    const monthlyObligation = netDifB - credit;
      console.log(monthlyObligation);
 
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

  // Downstream calculations
  percentageToObligationA();
  percentageToObligationB();
  calculateNetObligationA();
  calculateNetObligationB();
  calculateFinalObligation();

  // 🔍 DEBUG (remove later)
  console.log("PAGE 2 STORAGE SNAPSHOT:");
  console.log("combinedIncome", localStorage.getItem("combinedIncome"));
  console.log("baseObligation", localStorage.getItem("baseObligation"));
  console.log("monthlyObligation", localStorage.getItem("monthlyObligation"));

  // Navigate ONLY after everything is saved
  window.location.href = "worksheet.html";
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



 function savePageTwo() {
  
  calculateCombinedIncome();
  calculatePercentageCusA();
  calculatePercentageCusB();

  getBaseObligation().then(() => {
    percentageToObligationA();
    percentageToObligationB();
    calculateNetObligationA();
    calculateNetObligationB();
    calculateFinalObligation();

    
    window.location.href = "worksheet.html";
  });
}
*/
    
 function loadWorksheet() {
  const custA = localStorage.getItem("custodianA");
  const custB = localStorage.getItem("custodianB");
  const kids = localStorage.getItem("numberOfChildren");

  const grossA = Number(localStorage.getItem("grossIncomeA"));
  const maintenanceA = Number(localStorage.getItem("maintenanceDeductionA"));
  const priorChildDeductionA = Number(localStorage.getItem("priorbornChildDeductionA"));
  const adjustedGrossIncomeA = Number(localStorage.getItem("adjustedGrossIncomeA"));

  const combinedIncome = localStorage.getItem("combinedIncome");
  const baseObligation = localStorage.getItem("baseObligation");
  const monthlyObligation = localStorage.getItem("monthlyObligation");

   
  if (document.getElementById("worksheetCustA")) {
    document.getElementById("worksheetCustA").textContent = custA;
    document.getElementById("worksheetCustB").textContent = custB;
    document.getElementById("worksheetKids").textContent = kids;
    document.getElementById("worksheetGrossA").textContent = Number(grossA).toFixed(2);
    document.getElementById("worksheetMaintenanceA").textContent =  Number(maintenanceA).toFixed(2);
    document.getElementById("worksheetChildDeductionA").textContent = Number(priorChildDeductionA).toFixed(2);
  
      
    document.getElementById("worksheetCombined").textContent = Number(combinedIncome).toFixed(2);

    document.getElementById("worksheetBase").textContent = Number(baseObligation).toFixed(2);

    document.getElementById("worksheetMonthly").textContent = Number(monthlyObligation).toFixed(2);
  }
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
