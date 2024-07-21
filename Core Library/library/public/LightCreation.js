function toggleLightTable(startRowID,endRowID,idSuffix){
	let finalIDSuffix = "";
	if(arguments.length > 2){
		finalIDSuffix = idSuffix;
	}
	let tableID = document.getElementById(startRowID).closest("table").id;

	if(document.getElementById("isLight"+finalIDSuffix).checked){
		createLightTable(startRowID,endRowID,finalIDSuffix);
	}
	else{
		clearUnusedTable(tableID,startRowID,endRowID);
	}
}

function createLightTable(startRowID,endRowID,idSuffix){
	let finalIDSuffix = "";
	if(arguments.length > 2){
		finalIDSuffix = idSuffix;
	}
	let tableID = document.getElementById(startRowID).closest("table").id;

	let nextRowIndex = document.getElementById(startRowID).rowIndex+1;

	clearUnusedTable(tableID,startRowID,endRowID);

	addTableRow(tableID,nextRowIndex,"rowLightHeader"+finalIDSuffix,"<th colspan=2 style='text-align:center'>Light Configurations<input type='hidden' value=0 id='LightConfigurationNumber"+finalIDSuffix+"' name='LightConfigurationNumber"+finalIDSuffix+"'></th>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowLightButtons"+finalIDSuffix,"<th colspan=2 style='text-align:center'><input type='button' value='Add Configuration' onclick='addLightConfigurationRow("+'"'+finalIDSuffix+'"'+")'><input type='button' value='Remove Configuration' onclick='removeLightConfigurationRow("+'"'+finalIDSuffix+'"'+")'></th>");
	nextRowIndex++;

	addLightConfigurationRow(finalIDSuffix);
}

function addLightConfigurationRow(idSuffix){
	let tableID = document.getElementById("rowLightButtons"+idSuffix).closest("table").id;
	let nextRowIndex = document.getElementById("rowLightButtons"+idSuffix).rowIndex;
	let whichConfiguration = Number(document.getElementById("LightConfigurationNumber"+idSuffix).value);

	addTableRow(tableID,nextRowIndex,"rowLightConfiguration"+whichConfiguration+idSuffix,"<td colspan=2 style='text-align:center'><select id='lightType"+whichConfiguration+idSuffix+"' name='lightType"+whichConfiguration+idSuffix+"' onchange='adjustLightTypeOptions("+whichConfiguration+',"'+idSuffix+'"'+")'><option value='Bright'>Bright Light</option><option value='Dim'>Dim Light</option><option value='BrightDim'>Bright + Dim Light</option><option value='Darkness'>Darkness</option><option value='Obscure'>Heavily Obscures</option><option value='Covered'>None (Covered)</option></select><b>:</b> <span id='LightConfiguration"+whichConfiguration+idSuffix+"'><input type='hidden' id='lightDistanceValue"+whichConfiguration+idSuffix+"' name='lightDistanceValue"+whichConfiguration+idSuffix+"' min=0 value=0 style='width:25px'><input type='hidden' id='lightDistanceUnits"+whichConfiguration+idSuffix+"' name='lightDistanceUnits"+whichConfiguration+idSuffix+"' value='Feet'><input type='hidden' id='LightShape"+whichConfiguration+idSuffix+"' name='LightShape"+whichConfiguration+idSuffix+"' value='Sphere'></span><span id='LightShapeSpan"+whichConfiguration+idSuffix+"'></span><span id='LightExtraData"+whichConfiguration+idSuffix+"'></span></td>");
	nextRowIndex++;

	document.getElementById("LightConfigurationNumber"+idSuffix).value = whichConfiguration + 1;
	toggleUseTimeLightConfiguration(idSuffix);
	adjustLightTypeOptions(whichConfiguration,idSuffix);
}

function adjustLightTypeOptions(whichConfiguration,idSuffix){
	let thisLightConfigurationSpan = document.getElementById("LightConfiguration"+whichConfiguration+idSuffix);
	let thisLightExtraDataSpan = document.getElementById("LightExtraData"+whichConfiguration+idSuffix);
	let thisLightShapeSpan = document.getElementById("LightShapeSpan"+whichConfiguration+idSuffix);

	let currentDistanceValue = document.getElementById("lightDistanceValue"+whichConfiguration+idSuffix).value;
	let currentDistanceUnits = document.getElementById("lightDistanceUnits"+whichConfiguration+idSuffix).value;
	let lightSelection = document.getElementById("lightType"+whichConfiguration+idSuffix).value;

	if(lightSelection == "Covered"){
		thisLightConfigurationSpan.innerHTML = "<input type='hidden' id='lightDistanceValue"+whichConfiguration+idSuffix+"' name='lightDistanceValue"+whichConfiguration+idSuffix+"' min=0 value=0 style='width:25px'><input type='hidden' id='lightDistanceUnits"+whichConfiguration+idSuffix+"' name='lightDistanceUnits"+whichConfiguration+idSuffix+"' value='Feet'><input type='hidden' id='LightShape"+whichConfiguration+idSuffix+"' name='LightShape"+whichConfiguration+idSuffix+"' value='Sphere'> On but no light emitted";

		thisLightShapeSpan.innerHTML = "";
		thisLightExtraDataSpan.innerHTML = "";
	}
	else{
		if(thisLightShapeSpan.innerHTML == ""){
			thisLightShapeSpan.innerHTML = "<select id='LightShape"+whichConfiguration+idSuffix+"' name='LightShape"+whichConfiguration+idSuffix+"'><option value='Sphere'>Spherical</option><option value='Cone'>Conical</option></select>";
		}

		if(lightSelection == "Darkness"){
			thisLightConfigurationSpan.innerHTML = "<input type='number' id='lightDistanceValue"+whichConfiguration+idSuffix+"' name='lightDistanceValue"+whichConfiguration+idSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+whichConfiguration+idSuffix+"' name='lightDistanceUnits"+whichConfiguration+idSuffix+"'><option value='Feet'>Foot</option><option value='Miles'>Mile</option></select>";
			document.getElementById("lightDistanceValue"+whichConfiguration+idSuffix).value = currentDistanceValue;
			document.getElementById("lightDistanceUnits"+whichConfiguration+idSuffix).value = currentDistanceUnits;

			thisLightExtraDataSpan.innerHTML = "darkness";
		}
		else if(lightSelection == "BrightDim"){
			thisLightConfigurationSpan.innerHTML = "<input type='number' id='lightDistanceValue"+whichConfiguration+idSuffix+"' name='lightDistanceValue"+whichConfiguration+idSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+whichConfiguration+idSuffix+"' name='lightDistanceUnits"+whichConfiguration+idSuffix+"'><option value='Feet'>Foot</option><option value='Miles'>Mile</option></select> bright <b>+</b> <input type='number' id='secondaryLightDistanceValue"+whichConfiguration+idSuffix+"' name='secondaryLightDistanceValue"+whichConfiguration+idSuffix+"' min=0 value=30 style='width:25px'> dim";
			document.getElementById("lightDistanceValue"+whichConfiguration+idSuffix).value = currentDistanceValue;
			document.getElementById("secondaryLightDistanceValue"+whichConfiguration+idSuffix).value = currentDistanceValue;
			document.getElementById("lightDistanceUnits"+whichConfiguration+idSuffix).value = currentDistanceUnits;

			let isChecked = document.getElementById("isSunlight"+whichConfiguration+idSuffix);
			thisLightExtraDataSpan.innerHTML = "<select id='isSunlight"+whichConfiguration+idSuffix+"' name='isSunlight"+whichConfiguration+idSuffix+"'><option value='Light'>Light</option><option value='Sunlight'>Sunlight</option></select>";

			if(isChecked == null){
				isChecked = false;
			}
			else{
				isChecked = isChecked.checked;
			}
			if(isChecked){
				document.getElementById("isSunlight"+whichConfiguration+idSuffix).setAttribute("checked","");
			}
		}
		else if(lightSelection == "Obscure"){
			thisLightConfigurationSpan.innerHTML = "<input type='number' id='lightDistanceValue"+whichConfiguration+idSuffix+"' name='lightDistanceValue"+whichConfiguration+idSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+whichConfiguration+idSuffix+"' name='lightDistanceUnits"+whichConfiguration+idSuffix+"'><option value='Feet'>Foot</option><option value='Miles'>Mile</option></select>";

			document.getElementById("lightDistanceValue"+whichConfiguration+idSuffix).value = currentDistanceValue;
			document.getElementById("lightDistanceUnits"+whichConfiguration+idSuffix).value = currentDistanceUnits;

			thisLightExtraDataSpan.innerHTML = "obscured area";
		}
		else{
			thisLightConfigurationSpan.innerHTML = "<input type='number' id='lightDistanceValue"+whichConfiguration+idSuffix+"' name='lightDistanceValue"+whichConfiguration+idSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+whichConfiguration+idSuffix+"' name='lightDistanceUnits"+whichConfiguration+idSuffix+"'><option value='Feet'>Foot</option><option value='Miles'>Mile</option></select>";

			document.getElementById("lightDistanceValue"+whichConfiguration+idSuffix).value = currentDistanceValue;
			document.getElementById("lightDistanceUnits"+whichConfiguration+idSuffix).value = currentDistanceUnits;

			let isChecked = document.getElementById("isSunlight"+whichConfiguration+idSuffix);
			thisLightExtraDataSpan.innerHTML = "<select id='isSunlight"+whichConfiguration+idSuffix+"' name='isSunlight"+whichConfiguration+idSuffix+"'><option value='Light'>Light</option><option value='Sunlight'>Sunlight</option></select>";

			if(isChecked == null){
				isChecked = false;
			}
			else{
				isChecked = isChecked.checked;
			}
			if(isChecked){
				document.getElementById("isSunlight"+whichConfiguration+idSuffix).setAttribute("checked","");
			}
		}
	}

	applyUseAOELightOption(idSuffix);
}

function applyUseAOELightOption(idSuffix){
	if(document.getElementById("LightConfigurationNumber"+idSuffix) == null){
		//returns if there's no lights present
		return;
	}

	let configNumber = Number(document.getElementById("LightConfigurationNumber"+idSuffix).value);

	let removeAOEOptionTest = false;
	if(document.getElementById("aoeShape") != null){
		if(document.getElementById("aoeShape").value != "None"){
			for(let i=0; i<configNumber; i++){
				let thisShapeSelect = document.getElementById("LightShape"+i+idSuffix);
				let thisUseAOEOption = document.getElementById("UseAOEOption"+i+idSuffix);
				if(thisShapeSelect != null && thisUseAOEOption == null){
					let newUseAOEOption = document.createElement("option");
					newUseAOEOption.id = "UseAOEOption"+i+idSuffix;
					newUseAOEOption.innerHTML = "AoE Based";
					newUseAOEOption.value = "AOE";
					thisShapeSelect.appendChild(newUseAOEOption);
				}
			}
		}
		else{
			removeAOEOptionTest = true;
		}
	}

	if(removeAOEOptionTest){
		for(let i=0; i<configNumber; i++){
			if(document.getElementById("UseAOEOption"+i+idSuffix) != null){
				document.getElementById("UseAOEOption"+i+idSuffix).remove();
			}
		}
	}
}

function removeLightConfigurationRow(idSuffix){
	document.getElementById("rowLightButtons"+idSuffix).previousElementSibling.remove();
	let whichConfiguration = Number(document.getElementById("LightConfigurationNumber"+idSuffix).value);	
	document.getElementById("LightConfigurationNumber"+idSuffix).value = whichConfiguration - 1;

	toggleUseTimeLightConfiguration(idSuffix);
}

function toggleUseTimeLightConfiguration(idSuffix){
	let configurationNumber = Number(document.getElementById("LightConfigurationNumber"+idSuffix).value);
	let buttonsRow = document.getElementById("rowLightButtons"+idSuffix);
	let tableID = buttonsRow.closest("table").id;

	if(configurationNumber > 1 && document.getElementById("rowUseTimeLightConfiguration"+idSuffix) == null){
		let endRowID = buttonsRow.nextElementSibling.id;
		let nextRowIndex = buttonsRow.rowIndex + 1;

		let UseTimeOptionsArray = ["Free","Item Interaction","Action","Bonus Action","Reaction","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours","Custom"];
		let UseTimeOptions = "";
		for(let tempOption of UseTimeOptionsArray){
			UseTimeOptions = UseTimeOptions + "<option value='"+tempOption+"'>"+tempOption+"</option>";
		}

		addTableRow(tableID,nextRowIndex,"rowUseTimeLightConfiguration"+idSuffix,"<th><label for='UseTimeLightConfiguration"+idSuffix+"'>Time to Change Light:</label></th><td><select id='UseTimeLightConfiguration"+idSuffix+"' name='UseTimeLightConfiguration"+idSuffix+"' onchange='createCustomUseTimeRows("+'"'+tableID+'","UseTimeLightConfiguration'+idSuffix+'","'+endRowID+'"'+")'>"+UseTimeOptions+"</select></td>");
	}
	else if(configurationNumber <= 1 && document.getElementById("rowUseTimeLightConfiguration"+idSuffix) != null){
		let useTimeRowIDs = ["rowUseTimeLightConfiguration"+idSuffix,"rowCustomUseTimeLightConfiguration"+idSuffix,"rowUseTimeLightConfiguration"+idSuffix+"ReactionDescription"];

		while(useTimeRowIDs.includes(buttonsRow.nextElementSibling.id)){
			buttonsRow.nextElementSibling.remove();
		}
	}
}