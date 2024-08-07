function createFeatureTypeRows(tableID,nextRowIndex,extraData){
	let ClassOptions = "<option value='Class'>Class</option><option value='Race'>Race</option><option value='Feat'>Feat</option><option value='Condition'>Condition</option><option value='Item'>Item</option><option value='Background'>Background</option><option value='FightingStyle'>Fighting Style</option><option value='MonsterFeature'>NPC Feature</option>";
	let idSuffix = "";
	let hideTest = false;
	let multiTest = false;
	let stopPoint = "";

	if(arguments.length > 2){
		let validOptions = extraData.ValidOptions;
		if(validOptions != null){
			ClassOptions = "";

			if(typeof(validOptions) == "string"){
				validOptions = [validOptions];
				hideTest = true;
			}

			if(validOptions.length < 2){
				hideTest = true;
			}

			for(let featureType of validOptions){
				ClassOptions = ClassOptions + "<option value='"+featureType+"'>"+featureType+"</option>";
			}			
		}

		if(extraData.idSuffix != null){
			idSuffix = extraData.idSuffix;
		}

		if(extraData.StopPoint != null){
			stopPoint = extraData.StopPoint;
		}

		if(extraData.MultiSelect != null){
			if(extraData.MultiSelect == 1){
				multiTest = true;
			}
		}
	}

	addTableRow(tableID,nextRowIndex,"rowFeatureType"+idSuffix,"<th><label for='FeatureType"+idSuffix+"'>Feature Type:</label></th><td><select id='FeatureType"+idSuffix+"' name='FeatureType"+idSuffix+"' onchange='createFeatureClassRows("+'"'+idSuffix+'"'+")'>"+ClassOptions+"</select></td>");
	nextRowIndex++;

	if(hideTest){
		document.getElementById("rowFeatureType"+idSuffix).setAttribute("hidden","");
	};

	addTableRow(tableID,nextRowIndex,"rowFeatureTypeEnd"+idSuffix,"");
	document.getElementById("rowFeatureTypeEnd"+idSuffix).setAttribute("hidden","");

	createFeatureClassRows(idSuffix);
}

async function createFeatureClassRows(idSuffix,secondaryType){
	let selectOptions = "";
	let selectTitle = "";
	if(arguments.length == 0){
		idSuffix = "";
	}
	
	let finalSecondaryType = "";
	if(arguments.length > 1){
		finalSecondaryType = secondaryType;
	}
	let typeSelection = document.getElementById("FeatureType"+finalSecondaryType+idSuffix).value;
	let tableID = document.getElementById("FeatureType"+finalSecondaryType+idSuffix).closest("table").id;
	
	if(finalSecondaryType == "Condition" && document.getElementById("rowFeatureTypeCondition") != null){
		clearUnusedTable(tableID,"rowFeatureTypeCondition"+idSuffix,"rowFeatureTypeEnd"+idSuffix);
	}
	else{
		clearUnusedTable(tableID,"rowFeatureType"+idSuffix,"rowFeatureTypeEnd"+idSuffix);
	}
	
	let nextRowIndex = document.getElementById("rowFeatureType"+finalSecondaryType+idSuffix).rowIndex + 1;
	let noInputTest = false;
	let predeterminedClass = "";
	
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
	else if(typeSelection == "Condition"){
		//Note: Conditions can be associated with any of the other options, so they need to go another round of selections.

		addTableRow(tableID,nextRowIndex,"rowFeatureTypeCondition"+idSuffix,"<th><label for='FeatureTypeCondition"+idSuffix+"'>Associated With:</label></th><td><select id='FeatureTypeCondition"+idSuffix+"' name='FeatureTypeCondition"+idSuffix+"' onchange='createFeatureClassRows("+'"'+idSuffix+'","Condition"'+")'><option value='BaseCondition'>Base Condition</option><option value='Class'>Class</option><option value='Race'>Race</option><option value='Feat'>Feat</option><option value='Item'>Item</option><option value='Background'>Background</option></select></td>");
		nextRowIndex++;

		createFeatureClassRows(idSuffix,"Condition");
	}
	else if(typeSelection == "BaseCondition"){
		let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allConditions = await request.json();

		selectTitle = "Condition";
		selectOptions = createHTMLSelectOptions(allConditions);
	}
	else{
		noInputTest = true;
		if(typeSelection == "Feat"){
			predeterminedClass = "Feat";
		}
		else if(typeSelection == "MonsterFeature"){
			predeterminedClass = "Monster";
		}
		else if(typeSelection == "FightingStyle"){
			predeterminedClass = "FightingStyle";
		}
		else if(typeSelection == "Background"){
			predeterminedClass = "Background";
		}
	}
	
	if(typeSelection != "Condition"){
		if(noInputTest){
			addTableRow(tableID,nextRowIndex,"rowFeatureClass"+idSuffix,"<input type='hidden' id='FeatureClass"+idSuffix+"' name='FeatureClass"+idSuffix+"' value='"+predeterminedClass+"'>");
			nextRowIndex++;			
		}
		else{
			addTableRow(tableID,nextRowIndex,"rowFeatureClass"+idSuffix,"<th><label for='FeatureClass"+idSuffix+"'>"+selectTitle+":</label></th><td><select id='FeatureClass"+idSuffix+"' name='FeatureClass"+idSuffix+"' onchange='createFeatureSubclassRows("+'"'+tableID+'","'+idSuffix+'"'+")'>"+selectOptions+"</select></td>");
			nextRowIndex++;			
		}

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
	else if(typeSelection == "Background"){
		let request = await fetch("macro:pm.GetBackgrounds@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allBackgrounds = await request.json();

		if(allBackgrounds.length > 0){
			noInputTest = false;
		}
		subclassTitle = "Background";
		subclassOptions = createHTMLSelectOptions(allBackgrounds);
	}
	
	if(noInputTest){
		addTableRow(tableID,nextRowIndex,"rowFeatureSubclass"+idSuffix,"<input type='hidden' id='FeatureSubclass"+idSuffix+"' name='FeatureSubclass"+idSuffix+"' value=''>");
		nextRowIndex++;
		document.getElementById("rowFeatureSubclass"+idSuffix).setAttribute("hidden","");
	}
	else{
		addTableRow(tableID,nextRowIndex,"rowFeatureSubclass"+idSuffix,"<th><label for='FeatureSubclass"+idSuffix+"'>"+subclassTitle+":</label></th><td><select id='FeatureSubclass"+idSuffix+"' name='FeatureSubclass"+idSuffix+"'>"+subclassOptions+"</select></td>");
		nextRowIndex++;		
	}
}

async function createFeatureSelectionRows(tableID,idSuffix){
	//Currently stopping at subclass selection
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

async function createFeatureInputRow(startRowID,idPrefix,Header,FeatureType){
	let startRow = document.getElementById(startRowID);
	let tableID = startRow.closest("table").id;
	let nextRowIndex = startRow.rowIndex + 1;

	let allFeatureOptions = [];
	let finalFeatureOptions = [];
	if(arguments.length < 4){
		let featureProperties = ["sb.Abilities","sb.Feats","sb.Conditions","sb.Objects","sb.MonsterFeatures"];
		for(let property of featureProperties){
			let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: '["'+property+'"]'});
			allFeatureOptions = allFeatureOptions.concat(await request.json());
		}
		
		for(let feature of allFeatureOptions){
			finalFeatureOptions.push(feature.DisplayName);
		}
	}
	else{
		let propertyName = "sb.Abilities";
		if(FeatureType == "Feat"){
			propertyName = "sb.Feats";
		}
		else if(FeatureType == "Condition"){
			propertyName = "sb.Conditions";
		}
		else if(FeatureType == "Item"){
			propertyName = "sb.Objects";
		}
		else if(FeatureType == "MonsterFeature"){
			propertyName = "sb.MonsterFeatures";
		}

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: '["'+propertyName+'"]'});
		allFeatureOptions = await request.json();

		if(FeatureType == "Class"){
			let requestClass = await fetch("macro:pm.GetClasses@lib:pm.a5e.Core", {method: "POST", body: '["Name","json"]'});
			let allClasses = await requestClass.json();

			for(let feature of allFeatureOptions){
				if(allClasses.includes(feature['Class'])){
					finalFeatureOptions.push(feature.DisplayName);
				}
			}
		}
		else if(FeatureType == "Race"){
			let requestRace = await fetch("macro:pm.GetRaces@lib:pm.a5e.Core", {method: "POST", body: '["Name","json"]'});
			let allRaces = await requestRace.json();

			for(let feature of allFeatureOptions){
				if(allRaces.includes(feature['Class'])){
					finalFeatureOptions.push(feature.DisplayName);
				}
			}
		}
		else if(FeatureType == "FightingStyle"){
			for(let feature of allFeatureOptions){
				if(feature['Class'] == "FightingStyle"){
					finalFeatureOptions.push(feature.DisplayName);
				}
			}
		}
		else if(FeatureType == "Background"){
			for(let feature of allFeatureOptions){
				if(feature['Subclass'] == "Background"){
					finalFeatureOptions.push(feature.DisplayName);
				}
			}
		}
		else{
			for(let feature of allFeatureOptions){
				finalFeatureOptions.push(feature.DisplayName);
			}
		}		
	}

	addTableRow(tableID,nextRowIndex,"row"+idPrefix+"Feature","<th><label for='"+idPrefix+"Feature'>"+Header+":</label></th><td class='autocomplete-table'><input type='text' id='"+idPrefix+"Feature' name='"+idPrefix+"Feature'><span id='ValidationSpan"+idPrefix+"Feature'></span></td>");

	autocomplete(document.getElementById(idPrefix+"Feature"),finalFeatureOptions,allFeatureOptions);
}

async function createSpellInputRow(startRowID,idPrefix,Header){
	let startRow = document.getElementById(startRowID);
	let tableID = startRow.closest("table").id;
	let nextRowIndex = startRow.rowIndex + 1;

	let allSpellOptionsDisplay = [];
	let request = await fetch("macro:pm.a5e.GetSpells@lib:pm.a5e.Core", {method: "POST", body: ""});
	let allSpellOptions = await request.json();
	for(let spell of allSpellOptions){
		allSpellOptionsDisplay.push(spell.DisplayName);
	}

	addTableRow(tableID,nextRowIndex,"row"+idPrefix+"Spell","<th><label for='"+idPrefix+"Spell'>"+Header+":</label></th><td class='autocomplete-table'><input type='text' id='"+idPrefix+"Spell' name='"+idPrefix+"Spell'><span id='ValidationSpan"+idPrefix+"Spell'></span></td>");

	autocomplete(document.getElementById(idPrefix+"Spell"),allSpellOptionsDisplay,allSpellOptions);
}

//TODO: Add check if has a resource, remove if no MaxResource key. If no valid features, replace select options with 'No Valid Features' (or any other key using SearchKey arg)

//For resource selection purproses, will also need an option to just select the current thing you're making OR use the name only and not the class/subclass info (for things like Channel Divinity)