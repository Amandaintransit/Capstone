
function saveFirstPage() {
    let custA = document.getElementById("custodianA").value;
    let custB = document.getElementById("custodianB").value;
    let numbOfChildren = Number(document.getElementById("numberOfChildren").value);

    localStorage.setItem("custodianA", custA);
     localStorage.setItem("custodianB", custB);
     localStorage.setItem("numberOfChildren", numbOfChildren);

    window.location.href = "custodianInformation.html";
}
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


/*calculate AGI for custodian A*/
function calculateAdjustedGrossIncomeA() {
    let gross = Number(document.getElementById("grossIncomeA").value);
    let maintenance = Number(document.getElementById("maintenanceDeductionA").value);
    let priorChildDeduction = Number(document.getElementById("priorbornChildDeductionA").value);

    let adjustedGrossIncomeA = gross - maintenance - priorChildDeduction;

    const output = document.getElementById("agiA");
    if (output){
        output.textContent = adjustedGrossIncomeA.toFixed(2);
    }
     sessionStorage.setItem('adjustedGrossIncomeA', adjustedGrossIncomeA);

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
     sessionStorage.setItem('adjustedGrossIncomeB', adjustedGrossIncomeB);
    return adjustedGrossIncomeB;
   

}
function calculateCombinedIncome() {
  
  const agiA = Number(sessionStorage.getItem("adjustedGrossIncomeA"));
  const agiB = Number(sessionStorage.getItem("adjustedGrossIncomeB"));

  const combinedIncome = agiA + agiB;
 sessionStorage.setItem("combinedIncome", combinedIncome);

  const display = document.getElementById("combinedAgi");
  if (display) {
    display.textContent = combinedIncome.toFixed(2);
  }
 
    return combinedIncome;
}
    
/*pull the data from the google sheet table*/

  async function accessChildSupportTable() {

        const GuidelinesUrl ="https://sheets.googleapis.com/v4/spreadsheets/1lX7V_8IEhObhv6MXnffKUwwiilZkn6LvLDbFd_HPShA/values/ChildSupportTable?key=AIzaSyDV5DJJSaoS8aOsw8q3WMtnAMg7Gxo5jvg";
        const response = await fetch(GuidelinesUrl);
        const data = await response.json();

        return data.values;
    }
      
    function formatTable(rows) {
      const headers = rows[0];
      const dataRows = rows.slice(1);

      return dataRows.map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
          
        return obj;
      });

    }
    

    function findBaseObligation(kyTable, combinedIncome, numChildren) {
      
      const childColumnHeader = `${numChildren} ${numChildren == 1? "child" : "children"}`;      

      const incomeValue = Number(combinedIncome);

      for (const row of kyTable ){
         const rowIncome = Number(row["Combined Income"]);

        if (rowIncome == incomeValue) {
          return row[childColumnHeader];
        }
      }
      return `No guideline row found for income ${combinedIncome}`;
    }

    async function calculateBaseObligation() {
      const rows = await accessChildSupportTable();
      const table = formatTable(rows);
      const combinedIncome = Number(sessionStorage.getItem("combinedIncome"));
      const numChildren = Number(localStorage.getItem("numberOfChildren"));
     
      const amount = findBaseObligation(table, combinedIncome, numChildren);

      const result = document.getElementById("result");
      if (result) {
        result.textContent = "Base Obligation: " + amount; 
      }
    }

    
      /*
    let kyTable = null;

async function loadSupportTable() {
  if (kyTable) return;
  try {
    const resp = await fetch("kentuckySupportTable.json");
    kyTable = await resp.json();
  } catch (err) {
    console.error("Error loading Kentucky support table:", err);
  }
}

/**
 * Get the KY basic child support obligation.
 * @param {number} combinedIncome - combined monthly adjusted gross income
 * @param {number} numChildren - number of children (1–6)
 * @returns {number} support obligation, or null if not found
 */
/*
function getKentuckySupport(combinedIncome, numChildren) {
  if (!kyTable) {
    console.warn("Support table not loaded yet!");
    return null;
  }

  // Clamp numChildren to 6 (since table is "6 or more")
  const idx = Math.min(numChildren, 6) - 1;
  if (idx < 0) {
    console.warn("Invalid number of children for support lookup:", numChildren);
    return null;
  }

  // Round down combinedIncome to nearest lower bracket of $100
  const bracket = Math.floor(combinedIncome / 100) * 100;

  // If combination is beyond highest key in table, pick the highest defined or handle separately
  const keys = Object.keys(kyTable).map(k => Number(k)).sort((a, b) => a - b);
  let useKey = bracket;
  if (!kyTable.hasOwnProperty(bracket.toString())) {
    // If bracket not defined, find the next lower key
    for (let i = keys.length - 1; i >= 0; i--) {
      if (keys[i] <= combinedIncome) {
        useKey = keys[i];
        break;
      }
    }
  }

  const row = kyTable[useKey.toString()];
  if (!row) {
    console.warn("No support row found for bracket", useKey);
    return null;
  }

  return row[idx];
}
*/
/*
// After you calculate adjusted gross incomes:
async function calculateSupport() {
  await loadSupportTable();

  const agiA = calculateAdjustedGrossIncomeA(); // you already have this
  const agiB = Number(document.getElementById("grossIncomeB").value)
    - Number(document.getElementById("maintenanceDeductionB").value || 0)
    - Number(document.getElementById("priorBornChildDeductionB").value || 0);

  const combined = agiA + agiB;

  const numChildren = Number(document.getElementById("numChildren").value) || 1;

  const baseObligation = getKentuckySupport(combined, numChildren);
  if (baseObligation == null) {
    console.error("Could not compute base obligation");
    return;
  }

  // Calculate each parent’s share
  const shareA = combined > 0 ? (agiA / combined) * baseObligation : 0;
  const shareB = baseObligation - shareA;

  // Display the results
  document.getElementById("combinedAgi").textContent = combined.toFixed(2);
  document.getElementById("baseObligation").textContent = baseObligation.toFixed(2);
  document.getElementById("shareA").textContent = shareA.toFixed(2);
  document.getElementById("shareB").textContent = shareB.toFixed(2);

  // (Optional) store in localStorage
  localStorage.setItem("kyCombinedAGI", combined);
  localStorage.setItem("kyBaseObligation", baseObligation);
  localStorage.setItem("kyShareA", shareA);
  localStorage.setItem("kyShareB", shareB);
}
<button type="button" onclick="calculateSupport()">Calculate Support</button>

<p>Combined AGI: <span id="combinedAgi"></span></p>
<p>Guideline Support Obligation: <span id="baseObligation"></span></p>
<p><span id="welcome1"></span>'s Share: <span id="shareA"></span></p>
<p><span id="CustB"></span>'s Share: <span id="shareB"></span></p>


/*wrapping previous code b/c javascript was breaking b/c trying to set before existed


        document.getElementById("welcome1").textContent = cusA;
    }
    if (document.getElementById("custB")) {
        document.getElementById("CustB").textContent = cusB;
    }
    if (document.getElementById("CustBmaintenance")) {
        document.getElementById("CustBmaintenance").textContent = cusB;
    }
    if (document.getElementById("CustBpriorsupport")) {
        document.getElementById("CustBpriorsupport").textContent = cusB;
    }
    if (document.getElementById("CustBhealth")) {
        document.getElementById("CustBhealth").textContent = cusB;
    }
    if (document.getElementById("CustBchildcare")) {
        document.getElementById("CustBchildcare").textContent = cusB;
    }

    }
    fillCustodianNames();
    */

/*save data to calculate AGI
function saveCustAIncomeInfo() {
    let CAGI = document.getElementById("grossIncomeA").value;
    let MDA = document.getElementById("maintenanceDeductionA").value;
    let PBCDA = document.getElementById("priorbornChildDeductionA").value;

    localStorage.setItem("grossIncomeA", CAGI);
    localStorage.setItem("maintenanceDeductionA", MDA);
    localStorage.setItem("priorbornChildDeductionA", PBCDA);

}*/

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
