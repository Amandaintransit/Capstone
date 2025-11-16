

const params = new URLSearchParams(window.location.search);

document.getElementById("custodianA").textContent = params.get("custodianA");

document.getElementById("custodianB").textContent = params.get("custodianB");

/*const custodianA = params.get("CustodianA");
const custodianB = params.get("CustodianB");
const numberOfChildren = params.get("NumberOfChildren");

document.getElementById("custodianAinfo").value = custodianA;




    const resultsList = document.getElementById('results')
    new URLSearchParams(window.location.search).forEach((value, name)=> {
        resultsList.append(`${name}: ${value}`)
        resultsList.append(document.createElement('br'))
    })
*/