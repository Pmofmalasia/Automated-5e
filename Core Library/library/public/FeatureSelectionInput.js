function createFeatureTypeRows(tableID,nextRowIndex,idSuffix,validTypes){
	let ClassOptions;
	if(arguments.length > 3){
		if(typeof(validTypes) == "string"){
			validTypes = [validTypes];
		}
		//TODO: May want to hide this line if there is only one option allowed (e.g. must be a class, so no point in showing this line). May want to do the same for next round of selection also, would need a new argument to this function
		for(let featureType of validTypes){
			ClassOptions = ClassOptions + "<option value='"+featureType+"'>"+featureType+"</option>";
		}
	}
	else{
		ClassOptions = "<option value='Class'>Class</option><option value='Race'>Race</option><option value='Feat'>Feat</option><option value='Condition'>Condition</option><option value='Item'>Item</option><option value='Background'>Background</option>";
	}

	let finalIDSuffix = "";

	if(arguments.length > 2){
		finalIDSuffix = idSuffix;
	}

	addTableRow(tableID,nextRowIndex,"rowFeatureType"+finalIDSuffix,"<th><label for='FeatureType"+finalIDSuffix+"'>Feature Type:</label></th><td><select id='FeatureType"+finalIDSuffix+"' name='FeatureType"+finalIDSuffix+"' onchange='createFeatureClassRows("+'"'+tableID+'","'+finalIDSuffix+'"'+")'>"+ClassOptions+"</select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowFeatureTypeEnd"+finalIDSuffix,"");
	document.getElementById("rowFeatureTypeEnd"+finalIDSuffix).setAttribute("hidden","");

	createFeatureClassRows(tableID,finalIDSuffix);
}

async function createFeatureClassRows(tableID,idSuffix,secondaryType){
	let selectOptions = "";
	let selectTitle = "";

	let finalSecondaryType = "";
	if(arguments.length > 2){
		finalSecondaryType = secondaryType;
	}
	let typeSelection = document.getElementById("FeatureType"+finalSecondaryType+idSuffix).value;

	if(finalSecondaryType == "Condition" && document.getElementById("rowFeatureTypeCondition") != null){
		clearUnusedTable(tableID,"rowFeatureTypeCondition"+idSuffix,"rowFeatureTypeEnd"+idSuffix);
	}
	else{
		clearUnusedTable(tableID,"rowFeatureType"+idSuffix,"rowFeatureTypeEnd"+idSuffix);
	}

	let nextRowIndex = document.getElementById("rowFeatureType"+finalSecondaryType+idSuffix).rowIndex + 1;

	if(typeSelection == "Class"){
		let request = await fetch("macro:pm.GetClasses@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allClasses = await request.json();

		selectTitle = "Class";
		selectOptions = createHTMLSelectOptions(allClasses);
	}
	else if(typeSelection == "Race"){
		let request = await fetch("macro:pm.GetRaces@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allRaces = await request.json();

		selectTitle = "Race";
		selectOptions = createHTMLSelectOptions(allRaces);
	}
	else if(typeSelection == "Feat"){
		let request = await fetch("macro:pm.GetFeats@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allFeats = await request.json();

		selectTitle = "Feat";
		selectOptions = createHTMLSelectOptions(allFeats);
	}
	else if(typeSelection == "Condition"){
		//Note: Conditions can be associated with any of the other options, so they need to go another round of selections.

		addTableRow(tableID,nextRowIndex,"rowFeatureTypeCondition"+idSuffix,"<th><label for='FeatureTypeCondition"+idSuffix+"'>Associated With:</label></th><td><select id='FeatureTypeCondition"+idSuffix+"' name='FeatureTypeCondition"+idSuffix+"' onchange='createFeatureClassRows("+'"'+tableID+'","'+idSuffix+'","Condition"'+")'><option value='BaseCondition'>Base Condition</option><option value='Class'>Class</option><option value='Race'>Race</option><option value='Feat'>Feat</option><option value='Item'>Item</option><option value='Background'>Background</option></select></td>");
		nextRowIndex++;

		createFeatureClassRows(tableID,idSuffix,"Condition");
	}
	else if(typeSelection == "BaseCondition"){
		let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allConditions = await request.json();

		selectTitle = "Condition";
		selectOptions = createHTMLSelectOptions(allConditions);
	}
	else if(typeSelection == "Background"){
		let request = await fetch("macro:pm.GetBackgrounds@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allBackgrounds = await request.json();

		selectTitle = "Background";
		selectOptions = createHTMLSelectOptions(allBackgrounds);
	}

	if(typeSelection != "Condition"){
		addTableRow(tableID,nextRowIndex,"rowFeatureClass"+idSuffix,"<th><label for='FeatureClass"+idSuffix+"'>"+selectTitle+":</label></th><td><select id='FeatureClass"+idSuffix+"' name='FeatureClass"+idSuffix+"' onchange='createFeatureSubclassRows("+'"'+tableID+'","'+idSuffix+'"'+")'>"+selectOptions+"</select></td>");
		nextRowIndex++;

		createFeatureSubclassRows(tableID,idSuffix);
	}
}

async function createFeatureSubclassRows(tableID,idSuffix){
	let typeSelection = document.getElementById("FeatureType"+idSuffix).value;
	let classSelection = document.getElementById("FeatureClass"+idSuffix).value;
	let nextRowIndex = document.getElementById("rowFeatureClass"+idSuffix).rowIndex + 1;
	clearUnusedTable(tableID,"rowFeatureClass"+idSuffix,"rowFeatureTypeEnd"+idSuffix);

	if(typeSelection == "Condition"){
		typeSelection = document.getElementById("FeatureTypeCondition"+idSuffix).value;
	}

	let subclassTitle;
	let subclassOptions = "<option value=''>None</option>";
	let noInputTest = true;

	//TODO: May want to add in item rarity just so the list isn't overwhelming
	if(typeSelection == "Class"){
		let request = await fetch("macro:pm.GetSubclasses@lib:pm.a5e.Core", {method: "POST", body: "['"+classSelection+"']"});
		let allSubclasses = await request.json();

		if(allSubclasses.length > 0){
			noInputTest = false;
		}
		subclassTitle = "Subclass";
		subclassOptions = subclassOptions + createHTMLSelectOptions(allSubclasses);
	}
	else if(typeSelection == "Race"){
		let request = await fetch("macro:pm.GetSubraces@lib:pm.a5e.Core", {method: "POST", body: "['"+classSelection+"']"});
		let allSubclasses = await request.json();

		if(allSubclasses.length > 0){
			noInputTest = false;
		}
		subclassTitle = "Subrace";
		subclassOptions = subclassOptions + createHTMLSelectOptions(allSubclasses);
	}
	
	if(noInputTest){
		addTableRow(tableID,nextRowIndex,"rowFeatureSubclass"+idSuffix,"<input type='hidden' id='FeatureSubclass"+idSuffix+"' name='FeatureSubclass"+idSuffix+"' value=''>");
		nextRowIndex++;
		document.getElementById("rowFeatureSubclass"+idSuffix).setAttribute("hidden","");

		createFeatureSelectionRows(tableID,idSuffix);
		return;
	}

	subclassOptions = subclassOptions + "<option value='Any'>Any</option>";

	addTableRow(tableID,nextRowIndex,"rowFeatureSubclass"+idSuffix,"<th><label for='FeatureSubclass"+idSuffix+"'>"+subclassTitle+":</label></th><td><select id='FeatureSubclass"+idSuffix+"' name='FeatureSubclass"+idSuffix+"' onchange='createFeatureSelectionRows("+'"'+tableID+'","'+idSuffix+'"'+")'>"+subclassOptions+"</select></td>");
	nextRowIndex++;

	createFeatureSelectionRows(tableID,idSuffix);
}

async function createFeatureSelectionRows(tableID,idSuffix){
	let typeSelection = document.getElementById("FeatureType"+idSuffix).value;
	let classSelection = document.getElementById("FeatureClass"+idSuffix).value;
	let subclassSelection = document.getElementById("FeatureSubclass"+idSuffix).value;
	clearUnusedTable(tableID,"rowFeatureSubclass"+idSuffix,"rowFeatureTypeEnd"+idSuffix);
	let nextRowIndex = document.getElementById("rowFeatureSubclass"+idSuffix).rowIndex + 1;

	let featureOptions;
	let featureTitle;
	if(typeSelection == "Class" || typeSelection == "Race"){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Abilities']"});
		let allFeatures = await request.json();

		let validFeatures = allFeatures.filter(function(filterableFeatures){
			return filterableFeatures['Class'] == classSelection;
		});
		if(subclassSelection != "Any"){
			validFeatures = validFeatures.filter(function(filterableFeatures){
				return filterableFeatures['Subclass'] == subclassSelection;
			});			
		}

		featureOptions = createHTMLSelectOptions(validFeatures);

		if(typeSelection == "Class"){
			featureTitle = "Class Feature";
		}
		else{
			featureTitle = "Racial Feature";
		}
	}
	else if(typeSelection == "Feat"){
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Feats']"});
		let allFeats = await request.json();
		
		featureOptions = createHTMLSelectOptions(allFeats);
		featureTitle = "Feat";
	}
	else if(typeSelection == "Condition"){
		let conditionType = document.getElementById("FeatureTypeCondition"+idSuffix).value;
		let validConditions;
		if(conditionType == "BaseCondition"){
			let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
			validConditions = await request.json();
		}
		else{
			let request = await fetch("macro:pm.a5e.GetConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
			let allConditions = await request.json();

			validConditions = allConditions.filter(function(filterableConditions){
				return filterableConditions['Class'] == classSelection;
			});
			if(subclassSelection != "Any" && (conditionType == "Class" || conditionType == "Race")){
				validFeatures = validFeatures.filter(function(filterableConditions){
					return filterableConditions['Subclass'] == subclassSelection;
				});			
			}
		}
		
		featureOptions = createHTMLSelectOptions(validConditions);
		featureTitle = "Condition";
	}
	else if(typeSelection == "Background"){
		//TODO: Add a check for if searching for the background or an associated background feature, OR search for the background and then offer the feature as an option later? The latter seems like better UX.
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.Abilities']"});
		let allFeats = await request.json();
		
		featureOptions = "<option value=''>None</option>" + createHTMLSelectOptions(allFeats);
		featureTitle = "Background Feature";
	}

	addTableRow(tableID,nextRowIndex,"rowFeatureSelection"+idSuffix,"<th><label for='FeatureSelection"+idSuffix+"'>"+featureTitle+":</label></th><td><select id='FeatureSelection"+idSuffix+"' name='FeatureSelection"+idSuffix+"'>"+featureOptions+"</select></td>");
}

setTimeout(createFeatureTypeRows,1,"FeatureSelectionTestTable",0);

//TODO: Should have options to cut off selections at any point - e.g. only select a class, class + subclass, class + subclass + feature, etc.

//TODO: Should also add an option for multiselect on whatever the final step is. May want to have the final argument of the initial function be an object since this is a lot of options that may not be required.

//Following notes will probably be for general feature stuff - should limit feature selection stuff to its own file as it will be used in many different places 

//Check if has a resource, remove if no MaxResource key. If no valid features, replace select options with 'No Valid Features' (or any other key using SearchKey arg)

//For resource selection purproses, will also need an option to just select the current thing you're making OR use the name only and not the class/subclass info (for things like Channel Divinity)