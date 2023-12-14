const form = document.getElementById("transactionForm")

form.addEventListener("submit", function(event) {
  event.preventDefault();

  let transactionFormData = new FormData(form);
  let transactionObj = convertFormDataToTransactionObj(transactionFormData)
  saveTransactionObj(transactionObj)
  
  insertRowInTransactionTable(transactionObj)
  form.reset();
 

})
function draw_category() {
  let allCategorys = [ 
  "Diversion", 
  "Higiene",
  "Tecnologia",
  "Gastos imprevistos",
  "Sueldo en Dolares",
  "Transporte",
  ]
  for(let index = 0; index < allCategorys.length; index++ ) {
    insertCategory(allCategorys[index])
  }  
}

function insertCategory(categoryName) {
  const selectElement = document.getElementById("transactionCategory")
    
    let htmlToInsert = `<option>${categoryName} </option>` 
    selectElement.insertAdjacentHTML("beforeend",htmlToInsert)
}


document.addEventListener("DOMContentLoaded", function(event) {
  draw_category()
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
  transactionObjArr.forEach( 
      function(arrayElement) {
          insertRowInTransactionTable(arrayElement)
     
      }
  )


})

function getNewTransactionId(){
  let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
  let newTransactionId = JSON.parse(lastTransactionId) + 1;
  localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId))
  return newTransactionId;
}


function convertFormDataToTransactionObj(transactionFormData){
  let transactionType = transactionFormData.get("transactionType")
  let transactionDescription = transactionFormData.get("transactionDescription")
  let transactionAmount = transactionFormData.get("transactionAmount")
  let transactionCategory = transactionFormData.get("transactionCategory")
  let transactionId = getNewTransactionId();
  return {
   "transactionType":transactionType , 
   "transactionDescription":transactionDescription , 
   "transactionAmount": transactionAmount, 
   "transactionCategory":transactionCategory,
   "transactionId": transactionId
  }
}



function insertRowInTransactionTable(transactionObj) {

  let transactionTableRef = document.getElementById("transactionTable");

  let newTransactionRowRef = transactionTableRef.insertRow( -1 );

  newTransactionRowRef.setAttribute("transactionId", transactionObj["transactionId"])
 
  let newTypeCellRef = newTransactionRowRef.insertCell(0);
  newTypeCellRef.textContent = transactionObj ["transactionType"]; 

  newTypeCellRef = newTransactionRowRef.insertCell(1);
  newTypeCellRef.textContent = transactionObj ["transactionDescription"];

  newTypeCellRef = newTransactionRowRef.insertCell(2);
  newTypeCellRef.textContent = transactionObj ["transactionAmount"];

  newTypeCellRef = newTransactionRowRef.insertCell(3);
  newTypeCellRef.textContent = transactionObj ["transactionCategory"];
  
  let newDeleteCell = newTransactionRowRef.insertCell(4);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  newDeleteCell.appendChild(deleteButton)

  deleteButton.addEventListener("click", (event) => {
      let transactionRow = event.target.parentNode.parentNode;
      let transactionId = transactionRow.getAttribute("transactionId");
     //console.log(transactionRow.getAttribute("transactionId"))
     transactionRow.remove();
     deleteTransactionObj(transactionId);
  })
}

//le paso como parametro el transactionId de la transaccion que quiero eliminar
function deleteTransactionObj(transactionId) {
  //obtengo las transacciones de mi "base de datos" (Desconvierto de json a objeto)
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
  //busco el indice de la transaccion que quiero eliminar
  let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == transactionId);
  //elimino el elemneto de esa posicion  
  transactionObjArr.splice(transactionIndexInArray, 1);
  //convierto de objeto a JSON 
  let transactionArrayJSON = JSON.stringify(transactionObjArr);
  //guardo myArray de transacciones en formato JSON en el localstorage 
  localStorage.setItem("transactionData",transactionArrayJSON)
}

function saveTransactionObj(transactionObj) {

  let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
  myTransactionArray.push(transactionObj);
  //convierto myArray de transacciones a JSON
  let transactionArrayJSON = JSON.stringify(myTransactionArray);
  //guardo myArray de transacciones en formato JSON en el localstorage 
  localStorage.setItem("transactionData",transactionArrayJSON)
}