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

function createAttributeSelectionRows(tableID,endRowID){
	let AttributeMethod = document.getElementById("AttributeAllocationMethod").value;

	if(AttributeMethod == "Preset"){
		let previouslyMixed = document.getElementById("rowPresetAttributesAll") != null;
		if(previouslyMixed){
			clearUnusedTable(tableID,"rowEndPresetAttributes",endRowID);
		}
		else{
			createPresetAttributeRows(tableID);
		}
	}
	else if(AttributeMethod == "Mixed"){
		let nextRowIndex = document.getElementById("rowAttributeAllocationMethod").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowChosenAttributeButtons","<th text-align='center' colspan='2'><input type='button' id='addAttributeChoice' value='New Attribute Bonus' onclick='addAttributeChoiceRow("+'"'+tableID+'"'+")'>  <input type='button' id='removeAttributeChoice' value='Remove Attribute Bonus' onclick='removeAttributeChoiceRow("+'"'+tableID+'"'+")'><input type='hidden' id='AttributeChoiceNumber' name='AttributeChoiceNumber' value=0></th>");
		nextRowIndex++;

		addAttributeChoiceRow(tableID);

		let needsPresetOptions = document.getElementById("rowPresetAttributesAll") == null;
		if(needsPresetOptions){
			createPresetAttributeRows(tableID);
		}
	}
	else{
		clearUnusedTable(tableID,"rowAttributeAllocationMethod",endRowID);
	}
}

async function addAttributeChoiceRow(tableID){
	let currentAttributeChoiceNumber = document.getElementById("AttributeChoiceNumber").value;
	let nextRowIndex = document.getElementById("rowChosenAttributeButtons").rowIndex;

	addTableRow(tableID,nextRowIndex,"rowAttributeChoice"+currentAttributeChoiceNumber,"<td style='text-align: center' colspan='2'>Allocate <input type='number' id='AttributeChoicePoints"+currentAttributeChoiceNumber+"' name='AttributeChoicePoints"+currentAttributeChoiceNumber+"' value=1 style='width:25px'> point(s) to <select id='AttributeChoiceMethod"+currentAttributeChoiceNumber+"' name='AttributeChoiceMethod"+currentAttributeChoiceNumber+"' onchange='createAttributeChoiceInput("+currentAttributeChoiceNumber+")'><option value='Any'>Any Attribute</option><option value='Inclusive'>Include Choices</option><option value='Exclusive'>Exclude Choices</option></select><span id='AttributeChoiceInput"+currentAttributeChoiceNumber+"' hidden></span></td>");
	nextRowIndex++;

	document.getElementById("AttributeChoiceNumber").value = Number(currentAttributeChoiceNumber) + 1;
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

function removeAttributeChoiceRow(tableID){
	let currentAttributeChoiceNumber = Number(document.getElementById("AttributeChoiceNumber").value) - 1;
	
	let table = document.getElementById(tableID);
	table.deleteRow(document.getElementById("rowAttributeChoice"+currentAttributeChoiceNumber).rowIndex);

	document.getElementById("AttributeChoiceNumber").value = currentAttributeChoiceNumber;
}

async function createPresetAttributeRows(tableID){
	let nextRowIndex = document.getElementById("rowAttributeAllocationMethod").rowIndex + 1;

	addTableRow(tableID,nextRowIndex,"rowPresetAttributesAll","<th>Bonus to All Attributes:</th><td><input type='number' id='PresetAttributesAll' name='PresetAttributesAll' value=0 style='width:25px'></td>");
	nextRowIndex++;

	let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core",{method: "POST", body: ""});
	let AllAttributes = await request.json();

	for(let tempAttribute of AllAttributes){
		addTableRow(tableID,nextRowIndex,"rowPresetAttributes"+tempAttribute.DisplayName,"<th><label for='PresetAttributes"+tempAttribute.Name+"Bonus to "+tempAttribute.DisplayName+":</th><td><input type='number' id='PresetAttributes"+tempAttribute.Name+"' name='PresetAttributes"+tempAttribute.Name+"' value=0 style='width:25px'></td>");
		nextRowIndex++;
	}

	addTableRow(tableID,nextRowIndex,"rowEndPresetAttributes","");
	nextRowIndex++;
	document.getElementById("rowEndPresetAttributes").setAttribute("hidden","");
}

function createVisionRows(tableID,endRowID){
	if(document.getElementById("isVision").checked){
		let nextRowIndex = document.getElementById("rowIsVision").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowIsNormalVision","<th><label for='isNormalVision'>Has Normal Vision:</label></th><td><input type='checkbox' id='isNormalVision' name='isNormalVision' checked></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowDarkvisionDistance","<th><label for='DarkvisionDistance'>Darkvision Distance:</label></th><td><input type='number' id='DarkvisionDistance' name='DarkvisionDistance' min=0 value=60 style='width:25px'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowBlindsightDistance","<th><label for='BlindsightDistance'>Blindsight Distance:</label></th><td><input type='number' id='BlindsightDistance' name='BlindsightDistance' min=0 value=0 style='width:25px'></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowTruesightDistance","<th><label for='TruesightDistance'>Truesight Distance:</label></th><td><input type='number' id='TruesightDistance' name='TruesightDistance' min=0 value=0 style='width:25px'></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowIsVision",endRowID);
	}
}

async function addLanguageKnownRow(tableID){
	let currentLanguageNumber = Number(document.getElementById("LanguageKnownNumber").value) + 1;
	document.getElementById("LanguageKnownNumber").value = currentLanguageNumber;

	let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core",{method: "POST", body: "['sb.Languages']"});
	let AllLanguages = await request.json();
	let LanguageOptions = createHTMLSelectOptions(AllLanguages);

	let nextRowIndex = document.getElementById("rowLanguageKnownButtons").rowIndex;
	addTableRow(tableID,nextRowIndex,"rowLanguageKnown"+currentLanguageNumber,"<th><label for='LanguageKnown"+currentLanguageNumber+"'>Known Language #"+(currentLanguageNumber+1)+":</label></th><td><select id='LanguageKnown"+currentLanguageNumber+"' name='LanguageKnown"+currentLanguageNumber+"' value=1 min=0>"+LanguageOptions+"</select></td>");
}

function removeLanguageKnownRow(tableID){
	let currentLanguageKnownNumber = Number(document.getElementById("LanguageKnownNumber").value);
	
	let table = document.getElementById(tableID);
	table.deleteRow(document.getElementById("rowLanguageKnown"+currentLanguageKnownNumber).rowIndex);

	document.getElementById("LanguageKnownNumber").value = currentLanguageKnownNumber - 1;
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('CreateRaceTable').innerHTML = userdata;

	document.getElementById("LanguageKnown0").value = "Common";
	document.getElementById("CreatureType").value = "Humanoid";
}

setTimeout(loadUserData, 1);