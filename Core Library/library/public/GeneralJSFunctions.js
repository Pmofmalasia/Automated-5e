function clearUnusedTable(tableID,startRowID,endRowID){
    let table = document.getElementById(tableID);
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
    }
}

function deleteInterveningElements(startRow,endRow){
    while(startRow.nextElementSibling != endRow){
        startRow.nextElementSibling.remove();
    }
}

function addTableRow(tableID,rowIndex,rowAttributes,rowHTML){
    let table = document.getElementById(tableID);
    let newRow = table.insertRow(rowIndex);
	if (typeof rowAttributes == "object"){
		for(let key of Object.keys(rowAttributes)){
			newRow[key] = rowAttributes[key];
		}
	}
	else{
		newRow.id = rowAttributes;
	}
    newRow.innerHTML = rowHTML;
}

function createTableRow(referenceRow,rowAttributes,rowHTML,options){
	let insertDirection = "afterend";
	if(arguments.length > 3){
		if(options.InsertDirection === "before"){
			insertDirection = "beforebegin";
		}
		else if(options.InsertDirection != undefined){
			insertDirection = options.InsertDirection;
		}
	}

	let newRow = document.createElement("tr");
	if (typeof rowAttributes == "object"){
		for(let key of Object.keys(rowAttributes)){
			newRow.setAttribute(key,rowAttributes[key]);
		}
	}
	else{
		newRow.id = rowAttributes;
	}

	newRow.innerHTML = rowHTML;

	referenceRow.insertAdjacentElement(insertDirection,newRow);

	return newRow;
}

function appendIDToChildren(element,IDSuffix){
	let referenceElement = element.firstElementChild;
	while(referenceElement !== null){
		if(referenceElement.id !== undefined){
			referenceElement.id += IDSuffix;
		}
		
		if(referenceElement.name !== undefined){
			referenceElement.name += IDSuffix;
		}

		if(referenceElement.firstElementChild !== null){
			appendIDToChildren(referenceElement,IDSuffix);
		}

		referenceElement = referenceElement.nextElementSibling;
	}
}

function toggleFieldEnabled(toDisable,checkboxID){
	let toDisableIDs = toDisable;
	if(typeof toDisable != "object"){
		toDisableIDs = [toDisable];
	}
	else{
		toDisableIDs = toDisable;
	}

	for(let thisDisableID of toDisableIDs){
		if(document.getElementById(checkboxID).checked){
			document.getElementById(thisDisableID).setAttribute("disabled","");
		}
		else{
			document.getElementById(thisDisableID).removeAttribute("disabled","");
		}
	}
}

function createHTMLSelectOptions(inputData,valueKey,idKey,idPrefix){
	let finalOptions = "";
	for(let tempObject of inputData){
		if(arguments.length > 1){
			let tempIDString = "";
			if(arguments.length > 2){
				tempIDString = " id='"+idPrefix+tempObject[idKey]+"'";
			}

			if(valueKey == ""){
				finalOptions = finalOptions + "<option value='"+btoa(JSON.stringify(tempObject))+"'>"+tempObject.DisplayName+"</option>";
			}
			else{
				let tempObjectKeyValue = tempObject[valueKey];
				finalOptions = finalOptions + "<option value='"+tempObjectKeyValue+"'>"+tempObject.DisplayName+"</option>";
			}
		}
		else{
			finalOptions = finalOptions + "<option value='"+tempObject.Name+"'>"+tempObject.DisplayName+"</option>";
		}
	}
	return finalOptions;
}

function createHTMLMultiselectOptions(inputData,prefix,changeFunction,extraArguments){
	let finalOptions = "";

	for(let tempObject of inputData){
		let changeFunctionString = "";
		let tempName = tempObject.Name;

		if(arguments.length > 2){
			let extraArgumentString = "";
			if(arguments.length > 3){
				for(let tempArgument of extraArguments){
					extraArgumentString = extraArgumentString + ',"'+tempArgument+'"';
				}
			}
			changeFunctionString = " onchange='"+changeFunction+"("+'"'+tempName+'"'+extraArgumentString+")'";
		}

		finalOptions = finalOptions + "<label><input type='checkbox' id='"+prefix+tempName+"' name='"+prefix+tempName+"'"+changeFunctionString+"><span>"+tempObject.DisplayName+"</span></label>";
	}
	return finalOptions;
}

function timeDisplay(timeData){
	let timeDisplay = "";
	if(!["free","interaction","action","bonus","reaction"].includes(timeData.Units)){
		timeDisplay += timeData.Value + " "+ capitalize(timeData.Units);
		if(timeData.Value != 1){
			timeDisplay += "s";
		}
	}
	else{
		if(timeData.Units === "action"){
			timeDisplay = "Action";
		}
		else if(timeData.Units === "bonus"){
			timeDisplay = "Bonus Action";
		}
		else if(timeData.Value === "reaction"){
			timeDisplay = "Reaction";
		}
		else if(timeData.Value === "free"){
			timeDisplay = "Free";
		}
		else if(timeData.Value === "interaction"){
			timeDisplay = "Item Interaction";
		}
	}

	return timeDisplay;
}

function capitalize(string){
	if(string === ""){return string;}
    return string[0].toUpperCase() + string.slice(1);
}

function createMultiRowButtonsInput(baseName,referenceRow,rowContents,buttonName,listeners){
	if(arguments.length < 5){listeners = [];}

	referenceRow = createTableRow(referenceRow,"row"+baseName+"Buttons","<th colspan=2 style='text-align:center'><input type='button' id='Add"+baseName+"Button' value='Add "+buttonName+"'><input type='button' id='Remove"+baseName+"Button' value='Remove "+buttonName+"'><input type='hidden' id='"+baseName+"Number' name='"+baseName+"Number' value=0></th>");

	document.getElementById("Add"+baseName+"Button").addEventListener("click",function(){
		let referenceRow = document.getElementById("row"+baseName+"Buttons").previousElementSibling;
		let instanceNumber = Number(document.getElementById(baseName+"Number").value);
		document.getElementById(baseName+"Number").value = instanceNumber + 1;

		referenceRow = createTableRow(referenceRow,"row"+baseName+instanceNumber,rowContents);

		appendIDToChildren(referenceRow,instanceNumber);
		
		for(let func of listeners){
			document.getElementById(func.elementID + instanceNumber).addEventListener(func.listener,function(){
				window[func.functionName](instanceNumber,func.functionArgs);
			});
		}

		return instanceNumber;
	});

	document.getElementById("Remove"+baseName+"Button").addEventListener("click",function(){
		let instanceNumber = Number(document.getElementById(baseName+"Number").value);

		if(instanceNumber > 0){
			instanceNumber--;
			let referenceRow = document.getElementById("row"+baseName+instanceNumber);
			
			deleteInterveningElements(referenceRow.previousElementSibling,document.getElementById("row"+baseName+"Buttons"));

			document.getElementById(baseName+"Number").value = instanceNumber;
		}

		return instanceNumber;
	});

	document.getElementById("Add"+baseName+"Button").dispatchEvent(new Event("click"));
}

function sortData(data){
	return data.sort(function(a,b){
		if ( a.Name < b.Name ){
			return -1;
		}
		if ( a.Name > b.Name ){
			return 1;
		}
			return 0;
	});
}

async function evaluateMacro(macro){
	try {
		let uri = "macro:EvaluateMacro@lib:pm.a5e.Core";
		let r = await fetch(uri, { method: "POST", body: macro });
		let result = await r.text();
		return result;
	} catch (error) {
		console.log("### evaluateMacro: " + error.stack);
	}
}

async function MTFunction(functionName,functionArgs){
	if(!Array.isArray(functionArgs)){
		functionArgs = [functionArgs];
	}
	let request = await fetch("macro:js.a5e.MaptoolFunction@Lib:pm.a5e.Core", {method: "POST", body: "["+functionName+","+JSON.stringify(functionArgs)+"]"});
	let result = await request.json();
	return result[0];
}

async function mtSetProperty(property,value,token){
	let request = await fetch("macro:js.setProperty@Lib:pm.a5e.Core", {method: "POST", body: "["+property+","+value+","+token+"]"});
	let result = await request.json();
	return result;
}

async function submitData(formName,nextMacroName){
    let form = document.getElementById(formName);
    let submitData = Object.fromEntries(new FormData(form));
	try {
		let request = fetch("macro:"+nextMacroName+"@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    	let result = await request.json();		
	} catch (error) {
		console.log("Stack Trace: " + error.stack);
		console.log("Message: " + error.message);
	}
}