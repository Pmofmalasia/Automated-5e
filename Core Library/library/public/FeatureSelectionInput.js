
async function createFeatureSelectionRows(tableID,nextRowIndex,idSuffix,SearchKey){
	let request = await fetch("macro:pm.GetClasses@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allClasses = await request.json();

	let ClassOptions = createHTMLSelectOptions(allClasses);
	ClassOptions = ClassOptions + "<option value='Class'>Class</option><option value='Racial'>Racial</option><option value='Feat'>Feat</option><option value='Condition'>Condition</option><option value='Item'>Item</option><option value='Background'>Background</option>";

	let finalIDSuffix = "";

	if(arguments.length > 2){
		finalIDSuffix = idSuffix;
	}

	addTableRow(tableID,nextRowIndex,"rowFeatureTypeSelection"+finalIDSuffix,"<th style='colspan:2'><select id='FeatureTypeSelection"+finalIDSuffix+"' name='FeatureTypeSelection"+finalIDSuffix+"' onchange='createFeatureClassSelect("+'"'+tableID+'","'+finalIDSuffix+'"'+")'></select><select id='FeatureClassSelection"+finalIDSuffix+"' name='FeatureClassSelection"+finalIDSuffix+"' onchange='createFeatureSubclassSelect("+'"'+tableID+'","'+finalIDSuffix+'"'+")'>"+SubclassOptions+"</select></th>");
	nextRowIndex++;
}

async function createFeatureClassSelect(tableID,idSuffix){

}

//Check if has a resource, remove if no MaxResource key. If no valid features, replace select options with 'No Valid Features' (or any other key using SearchKey arg)

//For resource selection purproses, will also need an option to just select the current thing you're making OR use the name only and not the class/subclass info (for things like Channel Divinity)