function clearUnusedTable(tableID,startRowID,endRowID){
    let table = document.getElementById(tableID);
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
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

async function submitData(formName,nextMacroName){
    let form = document.getElementById(formName);
    let submitData = Object.fromEntries(new FormData(form));
    let request = fetch("macro:"+nextMacroName+"@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}