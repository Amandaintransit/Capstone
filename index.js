
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
        document.getElementById("BPercent").textContent = cusB;   

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

  document.getElementById("combinedAgi").textContent = combinedIncome.toFixed(2);
  
 
    return combinedIncome;
}

function calculatePercentageCusA() {
  const agiA = Number(sessionStorage.getItem("adjustedGrossIncomeA"));
  const agiB = Number(sessionStorage.getItem("adjustedGrossIncomeB"));

  const combinedIncome = Number(sessionStorage.getItem("combinedIncome"))

  const percentageCustA = agiA/combinedIncome * 100;
  sessionStorage.setItem("percentageCustA", percentageCustA)

  document.getElementById("percentA").textContent = percentageCustA.toFixed(0) +"%";

  return percentageCustA;

}

function calculatePercentageCusB() {  
  const agiA = Number(sessionStorage.getItem("adjustedGrossIncomeA"));
  const agiB = Number(sessionStorage.getItem("adjustedGrossIncomeB"));

  const combinedIncome = Number(sessionStorage.getItem("combinedIncome"))

  const percentageCustB = agiB/combinedIncome;
  sessionStorage.setItem("percentageCustB", percentageCustB)

  document.getElementById("percentB").textContent = percentageCustB.toFixed(0) + "%";

  return percentageCustB;}
    
/*pull the data from the google sheet table*/

  async function accessChildSupportTable() {

        const GuidelinesUrl ="https://sheets.googleapis.com/v4/spreadsheets/1lX7V_8IEhObhv6MXnffKUwwiilZkn6LvLDbFd_HPShA/values/ChildSupportTable?key=";
        const response = await fetch(GuidelinesUrl);
        const data = await response.json();

        return data.values;
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
    const combinedIncome = Number(sessionStorage.getItem("combinedIncome"));
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

      sessionStorage.setItem("baseObligation", amount);

      return amount;
   }
   function percentageToObligation(){
  const Apercent = Number(sessionStorage.getItem("percentageCustA"));
  const fullObligation = Number(sessionStorage.getItem("amount"));
  const obligationA = (percentageCustA * .01) * fullObligation;

}