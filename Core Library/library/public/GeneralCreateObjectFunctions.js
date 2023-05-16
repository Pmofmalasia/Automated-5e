function createNewTemplateRows(tableID,nextRowIndex,ObjectType){
	addTableRow(tableID,nextRowIndex,"rowNewTypeName","<th><label for='NewTypeName'>New "+ObjectType+" Type Name:</label></th><td><input type='text' id='NewTypeName' name='NewTypeName'></td>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"rowIsNewTemplate","<th><label for='isNewTemplate'>Add New "+ObjectType+" as Template:</label></th><td><input type='checkbox' id='isNewTemplate' name='isNewTemplate' value=1></td>");
	nextRowIndex++;
}

function updateWithTemplateData(tableID,TemplateData){
	if(TemplateData.Size != null && document.getElementById("Size") != null){document.getElementById("Size").value = TemplateData.Size;}

	if(TemplateData.Rarity != null && document.getElementById("Rarity") != null){document.getElementById("Rarity").value = TemplateData.Rarity;}

	if(TemplateData.Cost != null && document.getElementById("Cost") != null){document.getElementById("Cost").value = TemplateData.Cost;}

	if(TemplateData.CostUnits != null && document.getElementById("CostUnits") != null){document.getElementById("CostUnits").value = TemplateData.CostUnits;}

	if(TemplateData.Weight != null && document.getElementById("Weight") != null){document.getElementById("Weight").value = TemplateData.Weight;}

	let TemplateIsMagical = TemplateData.isMagical;
	if(TemplateIsMagical != null && document.getElementById("isMagical") != null){
		if(TemplateIsMagical == 1){
			document.getElementById("isMagical").setAttribute("checked","");
			document.getElementById("isMagical").dispatchEvent(new Event('change'));

			if(TemplateData.isAttunement == 1){
				document.getElementById("isAttunement").setAttribute("checked","");
			}
			else{
				document.getElementById("isAttunement").removeAttribute("checked","");
			}
			
			if(TemplateData.isSentient == 1){
				document.getElementById("isSentient").setAttribute("checked","");
				document.getElementById("isSentient").dispatchEvent(new Event('change'));
				//TODO: Add sentient item data population once it has been added to the processing function
			}
			else{
				document.getElementById("isSentient").removeAttribute("checked","");
				document.getElementById("isSentient").dispatchEvent(new Event('change'));
			}
			
			if(TemplateData.isCursed == 1){
				document.getElementById("isCursed").setAttribute("checked","");
			}
			else{
				document.getElementById("isCursed").removeAttribute("checked","");
			}
		}
	}

	if(TemplateData.MaxResource != null && document.getElementById("isCharges") != null){
		document.getElementById("isCharges").setAttribute("checked","");
		document.getElementById("isCharges").dispatchEvent(new Event('change'));

		document.getElementById("MaxResource").value = TemplateData.MaxResource;

		let RestoreInstances = new Array("ShortRest","LongRest","Dawn","StartTurn","Initiative");
		for(let tempInstance of RestoreInstances){
			if(TemplateData["Restore"+tempInstance] != null){
				document.getElementById("Restore"+tempInstance).setAttribute("checked","");
			}
			else{
				document.getElementById("Restore"+tempInstance).removeAttribute("checked","");
			}
		}
		
		let templateRestoreMethod = TemplateData.RestoreMethod;
		document.getElementById("RestoreMethod").value = templateRestoreMethod;
		document.getElementById("RestoreMethod").dispatchEvent(new Event('change'));

		if(templateRestoreMethod == "Fixed"){
			document.getElementById("RestoreAmount").value = TemplateData.RestoreAmount;
		}
		else if(templateRestoreMethod == "Rolled"){
			document.getElementById("RestoreAmountDieNumber").value = TemplateData.RestoreAmountDieNumber;
			document.getElementById("RestoreAmountDieSize").value = TemplateData.RestoreAmountDieSize;
			document.getElementById("RestoreAmountBonus").value = TemplateData.RestoreAmountBonus;
		}
		else if(templateRestoreMethod == "Chance"){
			document.getElementById("RestoreChanceDieNumber").value = TemplateData.RestoreChanceDieNumber;
			document.getElementById("RestoreChanceDieSize").value = TemplateData.RestoreChanceDieSize;
			document.getElementById("RestoreChanceBonus").value = TemplateData.RestoreChanceBonus;
		}
		else if(templateRestoreMethod == "Attribute"){
			document.getElementById("RestoreAmountMultiplier").value = TemplateData.RestoreAmountMultiplier;
			document.getElementById("RestoreAmountAttribute").value = TemplateData.RestoreAmountAttribute;
			document.getElementById("RestoreAmountBonus").value = TemplateData.RestoreAmountBonus;
		}
		else if(templateRestoreMethod == "Proficiency"){
			document.getElementById("RestoreAmountMultiplier").value = TemplateData.RestoreAmountMultiplier;
			document.getElementById("RestoreAmountBonus").value = TemplateData.RestoreAmountBonus;
		}
	}

	let TemplateMaterials = TemplateData.Materials;
	let TemplateHasMaterial = 0;
	if(TemplateData.Materials != null && document.getElementById("objectMaterialIron") != null){
		for(let tempMaterial of TemplateMaterials){
			document.getElementById("objectMaterial"+tempMaterial).setAttribute("checked","");
			TemplateHasMaterial = 1;
		}
		createChooseMainMaterialRows(tableID);
		if(TemplateHasMaterial == 1){
			if(TemplateData.MainMaterial != "@@Variable"){
				document.getElementById("MainMaterial").value = TemplateData.MainMaterial;
			}
		}
	}

	if(TemplateData.Coating != null && document.getElementById("Coating") != null){
		document.getElementById("Coating").value = TemplateData.Coating;
	}

	if(TemplateData.Integrity != null && document.getElementById("Integrity") != null){
		document.getElementById("Integrity").value = TemplateData.Integrity;
	}

	if(TemplateData.StateOfMatter != null && document.getElementById("StateOfMatter") != null){
		document.getElementById("StateOfMatter").value = TemplateData.StateOfMatter;
	}

	if(TemplateData.isFlammable != null && document.getElementById("isFlammable") != null){
		document.getElementById("isFlammable").value = TemplateData.isFlammable;
	}

	if(TemplateData.isMagnetic != null && document.getElementById("isMagnetic") != null){
		document.getElementById("isMagnetic").value = TemplateData.isMagnetic;
	}
}

async function createChooseMainMaterialRows(tableID){
	let nextRowIndex = document.getElementById("rowMaterials").rowIndex+1;

	let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectMaterials']"});
	let allMaterials = await request.json();

	let chosenMaterials = [];
	let chosenObjectTags = [];
	for(let tempMaterial of allMaterials){
		if(document.getElementById("objectMaterial"+tempMaterial.Name).checked){
			chosenMaterials.push(tempMaterial);
			for(let tempTag of tempMaterial.ObjectTags)
			if(!chosenObjectTags.includes(tempTag)){
				chosenObjectTags.push(tempTag);
			}
		}
	}
//TODO: Add selection of appropriate ObjectTags here, based on tags on the materials
	if(chosenMaterials.length > 1){
		let mainMaterialOptions = "";
		for(let tempChosenMaterial of chosenMaterials){
			mainMaterialOptions = mainMaterialOptions + "<option value='"+tempChosenMaterial.Name+"'>"+tempChosenMaterial.DisplayName+"</option>";
		}

		if(document.getElementById("rowMainMaterial") == null){
			addTableRow(tableID,nextRowIndex,"rowMainMaterial","<th><label for='MainMaterial'>Main Material:</label></th><td><select id='MainMaterial' name='MainMaterial'>"+mainMaterialOptions+"</select></td>");
			nextRowIndex++;
		}
		else{
			let priorSelection = document.getElementById("MainMaterial").value;
			document.getElementById("MainMaterial").innerHTML = mainMaterialOptions;
			document.getElementById("MainMaterial").value = priorSelection;
		}
	}
	else{
		if(document.getElementById("rowMainMaterial") != null){
			document.getElementById(tableID).deleteRow(nextRowIndex)
		}
	}

	for(let tempMaterial of chosenObjectTags){
		document.getElementById("objectMaterialTag"+tempMaterial.Name).setAttribute("checked","")
	}
}