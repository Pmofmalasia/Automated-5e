function clearUnusedTable(tableID,startRowID,endRowID){
    let table = document.getElementById(tableID);
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
    }
}

function addTableRow(tableID,rowIndex,rowID,rowHTML){
    let table = document.getElementById(tableID);
    let newRow = table.insertRow(rowIndex);
    newRow.id = rowID;
    newRow.innerHTML = rowHTML;
}

function toggleFieldEnabled(toDisable,checkboxID){
	if(document.getElementById(checkboxID).checked){
		document.getElementById(toDisable).setAttribute("disabled","");
	}
	else{
		document.getElementById(toDisable).removeAttribute("disabled","");
	}
}

function createHTMLSelectOptions(inputData,valueKey){
	let finalOptions = "";
	for(let tempObject of inputData){
		if(arguments.length > 1){
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

async function submitData(formName,nextMacroName){
    let form = document.getElementById(formName);
    let submitData = Object.fromEntries(new FormData(form));
    let request = fetch("macro:"+nextMacroName+"@Lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}