function createChooseSizeRows(tableID,endRowID){
	let SizeSelection = document.getElementById("Size").value;
	if(SizeSelection == "Choose"){
		let nextRowIndex = document.getElementById("rowSize").rowIndex + 1;

		let SizeOptionsArray = ["Tiny","Small","Medium","Large","Huge"];
		let SizeOptions = "";
		for(let tempSize of SizeOptionsArray){
			SizeOptions = SizeOptions + "<label><input type='checkbox' id='Size"+tempSize+"' name='Size"+tempSize+"'><span>"+tempSize+"</span></label>";
		}
		addTableRow(tableID,nextRowIndex,"rowSizeOptions","<th>Size Options:</th><td><div class='check-multiple' style='width:100%'>"+SizeOptions+"</div></td>");
		nextRowIndex++;

		document.getElementById("SizeSmall").setAttribute("checked","");
		document.getElementById("SizeMedium").setAttribute("checked","");
	}
	else{
		clearUnusedTable(tableID,"rowSize",endRowID);
	}
}

async function createAttributeSelectionRows(endRowID,idSuffix){
	if(arguments.length == 1){
		idSuffix = "";
	}
	let AttributeMethod = document.getElementById("AttributeAllocationMethod").value;
	let tableID = document.getElementById("AttributeAllocationMethod").closest("table").id;

	if(AttributeMethod == "Preset"){
		let previouslyMixed = document.getElementById("rowPresetAttributesAll") != null;
		if(previouslyMixed){
			clearUnusedTable(tableID,"rowEndPresetAttributes",endRowID);
		}
		else{
			await createPresetAttributeRows();
		}
	}
	else if(AttributeMethod == "Mixed"){
		let nextRowIndex;
		let needsPresetOptions = document.getElementById("rowPresetAttributesAll") == null;
		if(needsPresetOptions){
			nextRowIndex = document.getElementById("rowAttributeAllocationMethod").rowIndex + 1;
		}
		else{
			nextRowIndex = document.getElementById("rowEndPresetAttributes").rowIndex + 1;
		}

		addTableRow(tableID,nextRowIndex,"rowChosenAttributeButtons","<th text-align='center' colspan='2'><input type='button' id='addAttributeChoice' value='New Attribute Bonus' onclick='addAttributeChoiceRow()'>  <input type='button' id='removeAttributeChoice' value='Remove Attribute Bonus' onclick='removeAttributeChoiceRow()'><input type='hidden' id='AttributeChoiceNumber' name='AttributeChoiceNumber' value=0></th>");
		nextRowIndex++;

		addAttributeChoiceRow();
		if(needsPresetOptions){
			await createPresetAttributeRows();
		}
	}
	else if(AttributeMethod == "Choice"){
		let nextRowIndex = document.getElementById("rowAttributeAllocationMethod").rowIndex + 1;
		let previouslyMixed = document.getElementById("rowChosenAttributeButtons") != null;
		if(previouslyMixed){
			if(document.getElementById("rowAttributeChoice0") != null){
				clearUnusedTable(tableID,"rowAttributeAllocationMethod","rowChosenAttribute0");	
			}
			else{
				clearUnusedTable(tableID,"rowAttributeAllocationMethod","rowChosenAttributeButtons");	
			}
		}
		else{
			if(document.getElementById("rowPresetAttributesAll") != null){
				clearUnusedTable(tableID,"rowAttributeAllocationMethod",endRowID);
			}

			addTableRow(tableID,nextRowIndex,"rowChosenAttributeButtons","<th text-align='center' colspan='2'><input type='button' id='addAttributeChoice' value='New Attribute Bonus' onclick='addAttributeChoiceRow()'>  <input type='button' id='removeAttributeChoice' value='Remove Attribute Bonus' onclick='removeAttributeChoiceRow()'><input type='hidden' id='AttributeChoiceNumber' name='AttributeChoiceNumber' value=0></th>");
			nextRowIndex++;
	
			addAttributeChoiceRow();
		}
	}
	else{
		clearUnusedTable(tableID,"rowAttributeAllocationMethod",endRowID);
	}
	return "not gonna work";
}

async function addAttributeChoiceRow(){
	let tableID = document.getElementById("rowChosenAttributeButtons").closest("table").id;
	let currentAttributeChoiceNumber = document.getElementById("AttributeChoiceNumber").value;
	let nextRowIndex = document.getElementById("rowChosenAttributeButtons").rowIndex;

	addTableRow(tableID,nextRowIndex,"rowAttributeChoice"+currentAttributeChoiceNumber,"<td style='text-align: center' colspan='2'>Allocate <input type='number' id='AttributeChoicePoints"+currentAttributeChoiceNumber+"' name='AttributeChoicePoints"+currentAttributeChoiceNumber+"' value=1 style='width:25px'> point(s) to <select id='AttributeChoiceMethod"+currentAttributeChoiceNumber+"' name='AttributeChoiceMethod"+currentAttributeChoiceNumber+"' onchange='createAttributeChoiceInput("+currentAttributeChoiceNumber+")'><option value='Any'>Any Attribute</option><option value='Inclusive'>Include Choices</option><option value='Exclusive'>Exclude Choices</option></select><span id='AttributeChoiceInput"+currentAttributeChoiceNumber+"' hidden></span></td>");
	nextRowIndex++;

	let newChoiceNumber = Number(currentAttributeChoiceNumber) + 1;
	document.getElementById("AttributeChoiceNumber").value = newChoiceNumber;
	if(newChoiceNumber > 1 && document.getElementById("rowAttributeChoicesUnique") == null){
		addTableRow(tableID,nextRowIndex,"rowAttributeChoicesUnique","<th><label for='AttributeChoicesUnique'>Must be Different Ability Scores:</label></th><td><input type='checkbox' id='AttributeChoicesUnique' name='AttributeChoicesUnique'></td>");
		nextRowIndex++;
	}
}

async function createAttributeChoiceInput(whichChoice){
	let attributeChoiceMethod = document.getElementById("AttributeChoiceMethod"+whichChoice).value;
	let attributeMultiselectBox = document.getElementById("AttributeChoiceInput"+whichChoice);

	if(attributeChoiceMethod == "Any"){
		attributeMultiselectBox.innerHTML = "";
		attributeMultiselectBox.removeAttribute("class","");
		attributeMultiselectBox.removeAttribute("style","");
		attributeMultiselectBox.setAttribute("hidden","");
	}
	else if(attributeMultiselectBox.innerHTML == ""){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: ""});
		let AllAttributes = await request.json();
		let AttributeOptions = createHTMLMultiselectOptions(AllAttributes,"AttributeChoice"+whichChoice);

		attributeMultiselectBox.innerHTML = AttributeOptions;
		attributeMultiselectBox.setAttribute("class","check-multiple");
		attributeMultiselectBox.setAttribute("style","width:50%; text-align:left");
		attributeMultiselectBox.removeAttribute("hidden","");
	}
}

function removeAttributeChoiceRow(){
	let tableID = document.getElementById("rowChosenAttributeButtons").closest("table").id;
	let currentAttributeChoiceNumber = Number(document.getElementById("AttributeChoiceNumber").value) - 1;
	
	let table = document.getElementById(tableID);
	table.deleteRow(document.getElementById("rowAttributeChoice"+currentAttributeChoiceNumber).rowIndex);

	document.getElementById("AttributeChoiceNumber").value = currentAttributeChoiceNumber;
	if(currentAttributeChoiceNumber < 2 && document.getElementById("rowAttributeChoicesUnique") != null){
		document.getElementById("rowAttributeChoicesUnique").remove();
	}
}

async function createPresetAttributeRows(){
	let tableID = document.getElementById("rowAttributeAllocationMethod").closest("table").id;
	let nextRowIndex = document.getElementById("rowAttributeAllocationMethod").rowIndex + 1;

	addTableRow(tableID,nextRowIndex,"rowPresetAttributesAll","<th>Bonus to All Attributes:</th><td><input type='number' id='PresetAttributesAll' name='PresetAttributesAll' value=0 style='width:25px'></td>");
	nextRowIndex++;

	let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: ""});
	let AllAttributes = await request.json();

	for(let tempAttribute of AllAttributes){
		addTableRow(tableID,nextRowIndex,"rowPresetAttributes"+tempAttribute.DisplayName,"<th><label for='PresetAttributes"+tempAttribute.Name+"'>Bonus to "+tempAttribute.DisplayName+":</label></th><td><input type='number' id='PresetAttributes"+tempAttribute.Name+"' name='PresetAttributes"+tempAttribute.Name+"' value=0 style='width:25px'></td>");
		nextRowIndex++;
	}

	addTableRow(tableID,nextRowIndex,"rowEndPresetAttributes","");
	nextRowIndex++;
	document.getElementById("rowEndPresetAttributes").setAttribute("hidden","");
}

async function createVisionRows(endRowID){
	let tableID = document.getElementById("rowIsVision").closest("table").id;
	if(document.getElementById("isVision").checked){
		let nextRowIndex = document.getElementById("rowIsVision").rowIndex + 1;

		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core",{method: "POST", body: "['sb.VisionTypes']"});
		let AllVisionTypes = await request.json();
		
		for(let visionType of AllVisionTypes){
			addTableRow(tableID,nextRowIndex,"rowVision"+visionType.Name,"<th><label for='Vision"+visionType.Name+"Distance'>"+visionType.DisplayName+" Distance:</label></th><td><input type='number' id='Vision"+visionType.Name+"Distance' name='Vision"+visionType.Name+"Distance' min=0 value=0 style='width:35px'> <input type='checkbox' id='isVision"+visionType.Name+"Unlimited' name='isVision"+visionType.Name+"Unlimited' onchange='toggleFieldEnabled("+'"Vision'+visionType.Name+"Distance"+'","'+"isVision"+visionType.Name+"Unlimited"+'"'+")'> Unlimited?</td>");
			nextRowIndex++;
		}

		document.getElementById("VisionNormalSightDistance").setAttribute("disabled","");
		document.getElementById("isVisionNormalSightUnlimited").setAttribute("checked","");
	}
	else{
		clearUnusedTable(tableID,"rowIsVision",endRowID);
	}
}

async function addLanguageKnownRow(){
	let currentLanguageNumber = Number(document.getElementById("LanguageKnownNumber").value) + 1;
	document.getElementById("LanguageKnownNumber").value = currentLanguageNumber;
	let tableID = document.getElementById("rowLanguageKnownButtons").closest("table").id;

	let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core",{method: "POST", body: "['sb.Languages']"});
	let AllLanguages = await request.json();
	let LanguageOptions = createHTMLSelectOptions(AllLanguages);

	let nextRowIndex = document.getElementById("rowLanguageKnownButtons").rowIndex;
	addTableRow(tableID,nextRowIndex,"rowLanguageKnown"+currentLanguageNumber,"<th><label for='LanguageKnown"+currentLanguageNumber+"'>Known Language #"+(currentLanguageNumber+1)+":</label></th><td><select id='LanguageKnown"+currentLanguageNumber+"' name='LanguageKnown"+currentLanguageNumber+"'>"+LanguageOptions+"</select></td>");
}

function removeLanguageKnownRow(){
	let currentLanguageKnownNumber = Number(document.getElementById("LanguageKnownNumber").value);
	let buttonsPriorRow = document.getElementById("rowLanguageKnownButtons").previousElementSibling;
	if(buttonsPriorRow.id.substring(0,16) === "rowLanguageKnown"){
		buttonsPriorRow.remove();
	}

	document.getElementById("LanguageKnownNumber").value = currentLanguageKnownNumber - 1;
}