
function createResourceRows(FeatureData){
	let referenceRow = document.getElementById("rowIsResources");
	let isResourceChoice = document.getElementById("isResources").value;

	if(document.getElementById("rowResourcesEnd") !== null){
		deleteInterveningElements(referenceRow,document.getElementById("rowResourcesEnd").nextElementSibling);
	}

	if(isResourceChoice !== ""){
		//TODO: MaxResource Still need a way to make display name = chosen spell name

		let resourceRowData = [];
		let resourceListeners = [];
		if(isResourceChoice === "one"){
			resourceRowData.push({
				RowID:"rowResource",
				Contents:"<th><label for='ResourceDisplayName'>Resource Display Name:</label></th><td><input type='text' id='ResourceDisplayName' name='ResourceDisplayName' value='"+FeatureData.DisplayName+"'></td>"
			});
		}
		else{
			resourceRowData.push({
				RowID:"rowResource",
				Contents:"<th><label for='ResourceDisplayName'>Resource Display Name:</label></th><td><input type='text' id='ResourceDisplayName' name='ResourceDisplayName'></td>"
			});
		}

		let resourceNumberTypes = "<option value='1'>One</option><option value='OtherNumber'>Other Number</option><option value='Attribute'>Attribute-Based</option><option value='Proficiency'>Proficiency-Based</option><option value='Level'>Level-Based</option><option value='NonlinearLevel'>Nonlinear Level-Based</option>";
		if(FeatureData.Type === "Class"){
			resourceNumberTypes += "<option value='Class'>Class Level-Based</option><option value='NonlinearClass'>Nonlinear Class Level-Based</option>";
		}
		else if(FeatureData.Type === "Condition"){
			resourceNumberTypes += "<option value='Tier'>Condition Tier-Based</option>";
		}
		resourceNumberTypes += "<option value='combo'>Combination of Above</option>";
		resourceRowData.push({
			RowID:"rowResourceAmountType",
			Contents:"<th><label for='ResourceAmountType'>Maximum Amount of Resource:</label></th><td><select id='ResourceAmountType' name='ResourceAmountType'>"+resourceNumberTypes+"</select></td>"
		});
		resourceListeners.push({
			elementID:"ResourceAmountType",
			listener:"change",
			functionName:"createResourceAmountTypeRow",
			functionArgs:{}
		});

		if(isResourceChoice === "multiple"){
			resourceRowData.push({
				RowID:"rowResourceGainedLevel",
				Contents:"<th><label for='ResourceGainedLevel'>Resource Gained at Level:</label></th><td><input type='number' class='small-number' id='ResourceGainedLevel' name='ResourceGainedLevel' value='"+FeatureData.Level+"' min='"+FeatureData.Level+"'></td>"
			});			
		}

		resourceRowData.push({
			RowID:"rowResourceSpecialType",
			Contents:"<th><label for='ResourceSpecialType'>Resource is a Special Type:</label></th><td><select id='ResourceSpecialType' name='ResourceSpecialType'><option value=''>No - Standard</option><option value='Die'>Die Resource</option><option value='SpellSlot'>Spell Slot Resource</option><option value='Time'>Time Resource</option></select></td>"
		});
		resourceListeners.push({
			elementID:"ResourceSpecialType",
			listener:"change",
			functionName:"createResourceSpecialTypeRow",
			functionArgs:{}
		});

		resourceRowData.push({
			RowID:"rowMultiResourceEnd",
			Contents:"<th colspan=2></th>"
		});

		createMultiRowButtonsInput("Resource",referenceRow,resourceRowData,"Resource",resourceListeners);
		if(isResourceChoice === "one"){
			let buttonsRow = document.getElementById("rowResourceButtons");
			referenceRow = buttonsRow.previousElementSibling;
			buttonsRow.remove();
		}
		else{
			document.getElementById("AddResourceButton").addEventListener("click",function(){
				let currentNumber = Number(document.getElementById("ResourceNumber").value);
				if(currentNumber > 1){
					document.getElementById("rowMultiResourceEnd"+(currentNumber-2)).classList.add("section-end");
				}
			});
			document.getElementById("RemoveResourceButton").addEventListener("click",function(){
				let currentNumber = Number(document.getElementById("ResourceNumber").value);
				if(currentNumber > 0){
					document.getElementById("rowMultiResourceEnd"+(currentNumber-1)).classList.remove("section-end");
				}
			});
			referenceRow = document.getElementById("rowResourceButtons");
		}

		//Created before addResourceRestorationRows so it can find this row with .nextElementSibling
		createTableRow(referenceRow,"rowResourcesEnd","<th colspan=2></th>");
		document.getElementById("rowResourcesEnd").classList.add("section-end");

		addResourceRestorationRows(referenceRow);
	}
}

function createResourceAmountTypeRow(i){
	let resourceNumberType = document.getElementById("ResourceAmountType"+i).value;
	let referenceRow = document.getElementById("rowResourceAmountType"+i);

	let endRow = document.getElementById("rowResourceAmountTypeEnd"+i);
	if(endRow !== null){
		deleteInterveningElements(referenceRow,endRow);
		if(resourceNumberType === "One"){
			endRow.remove();
		}
	}
	else{
		let endRow = createTableRow(referenceRow,"rowResourceAmountTypeEnd"+i,"<th colspan=2></th>");
		endRow.classList.add("section-end");
		endRow.setAttribute("hidden","");
	}

	document.getElementById("PrimeStat").removeEventListener("change",attributeResourcePrimeStatOption);

	if(resourceNumberType === "OtherNumber"){
		referenceRow = createTableRow(referenceRow,"rowResourceAmount"+i,"<th><label for='ResourceAmount"+i+"'>Resource Amount:</label></th><td><input type='number' class='small-number' id='ResourceAmount"+i+"' name='ResourceAmount"+i+"' value=2 min=1></td>");
	}
	else if(resourceNumberType === "Attribute"){
		let attributeOptions = createHTMLSelectOptions(attributes);
		if(document.getElementById("PrimeStat") !== null){
			if(document.getElementById("PrimeStat").value !== ""){
				attributeOptions = "<option value='PrimeStat' id='ResourceAmountPrimeStatOption"+i+"'>Use Primary Stat</option>" + attributeOptions;
			}
		}
		referenceRow = createTableRow(referenceRow,"rowResourceAmount"+i,"<th><label for='ResourceAmount"+i+"'>Resource Amount:</label></th><td><select id='ResourceAmount"+i+"' name='ResourceAmount"+i+"'>"+attributeOptions+"</select><select id='ResourceAmountModifierType"+i+"' name='ResourceAmountModifierType"+i+"'><option value='Multiply'>Times</option><option value='Add'>Plus</option><option value='Divide'>Divided By</option></select><input type='number' class='small-number' id='ResourceAmountModifier"+i+"' name='ResourceAmountModifier"+i+"' value=1> (min. <input type='number' class='small-number' id='ResourceAmountMinimum"+i+"' name='ResourceAmountMinimum"+i+"' value=1 min=0>)</td>");

		function attributeResourcePrimeStatOption(){
			let primeStatChoice = document.getElementById("PrimeStat").value;
			let ResourceNumber = document.getElementById("ResourceNumber");
			if(ResourceNumber === null){
				ResourceNumber = 1;
			}
			else{
				ResourceNumber = Number(ResourceNumber.value);
			}

			for(let i = 0; i < ResourceNumber; i++){
				let primeStatOption = document.getElementById("ResourceAmountPrimeStatOption"+i);
				if(primeStatChoice === ""){
					if(primeStatOption !== null){
						primeStatOption.remove();
					}
				}
				else if(primeStatOption === null){
					primeStatOption = document.createElement("option");
					primeStatOption.innerHTML = "Use Primary Stat";
					primeStatOption.value = "PrimeStat";

					document.getElementById("ResourceAmount"+i).insertAdjacentElement("afterbegin",primeStatOption);
				}
			}
		}

		document.getElementById("PrimeStat").addEventListener("change",attributeResourcePrimeStatOption);
	}
	else if(resourceNumberType === "Proficiency"){
		referenceRow = createTableRow(referenceRow,"rowResourceAmount"+i,"<th><label for='ResourceAmountModifier"+i+"'>Resource Amount:</label></th><td>Proficiency Bonus <select id='ResourceAmountModifierType"+i+"' name='ResourceAmountModifierType"+i+"'><option value='Multiply'>Times</option><option value='Add'>Plus</option><option value='Divide'>Divided By</option></select><input type='number' class='small-number' id='ResourceAmountModifier"+i+"' name='ResourceAmountModifier"+i+"' value=1> (min. <input type='number' class='small-number' id='ResourceAmountMinimum"+i+"' name='ResourceAmountMinimum"+i+"' value=1 min=0>)</td>");
	}
	else if(resourceNumberType === "Level" || resourceNumberType === "Class"){
		referenceRow = createTableRow(referenceRow,"rowResourceAmount"+i,"<th><label for='ResourceAmountModifier"+i+"'>Resource Amount:</label></th><td>Level <select id='ResourceAmountModifierType"+i+"' name='ResourceAmountModifierType"+i+"'><option value='Multiply'>Times</option><option value='Add'>Plus</option><option value='Divide'>Divided By</option></select><input type='number' class='small-number' id='ResourceAmountModifier"+i+"' name='ResourceAmountModifier"+i+"' value=1> (min. <input type='number' class='small-number' id='ResourceAmountMinimum"+i+"' name='ResourceAmountMinimum"+i+"' value=1 min=0>)</td>");
	}
	else if(resourceNumberType === "NonlinearClass" || resourceNumberType === "NonlinearLevel"){
		let baseLevel = FeatureData.Level;
		createMultiRowButtonsInput("NonlinearLevelResource"+i,referenceRow,"<th>Total Resource at Level <input type='number' value='"+baseLevel+"' id='NonlinearLevelResourceLevel"+i+"' name='NonlinearLevelResourceLevel"+i+"' class='small-number'>:</th><td><input type='number' class='small-number' id='NonlinearLevelResourceAmount"+i+"' name='NonlinearLevelResourceAmount"+i+"' value=1 min=0></td>","Resource Tier");
	}
	else if(resourceNumberType === "Tier"){
		referenceRow = createTableRow(referenceRow,"rowResourceAmount"+i,"<th><label for='ResourceAmountModifier"+i+"'>Resource Amount:</label></th><td>Condition Tier <select id='ResourceAmountModifierType"+i+"' name='ResourceAmountModifierType"+i+"'><option value='Multiply'>Times</option><option value='Add'>Plus</option><option value='Divide'>Divided By</option></select><input type='number' class='small-number' id='ResourceAmountModifier"+i+"' name='ResourceAmountModifier"+i+"' value=1> (min. <input type='number' class='small-number' id='ResourceAmountMinimum"+i+"' name='ResourceAmountMinimum"+i+"' value=1 min=0>)</td>");
	}
	else if(resourceNumberType === "combo"){
		//TODO: Make this be a thing. Maybe change the original input into a multiselect, and have that multiselect toggle parts on/off - to prevent it from getting too long and still be able to include scaling specific to each type
	}
}

function createResourceSpecialTypeRow(i){
	let referenceElement = document.getElementById("rowResourceSpecialType"+i);
	let specialResourceType = document.getElementById("ResourceSpecialType"+i).value;

	if(referenceElement.nextElementSibling.id === "rowResourceSpecialTypeInfo"+i){
		referenceElement.nextElementSibling.remove();
	}

	if(specialResourceType === "Die"){
		referenceElement = createTableRow(referenceElement,"rowResourceSpecialTypeInfo"+i,"<th><label for='ResourceSpecialDieSize"+i+"'>Resource Die Size:</label></th><td><input type='number' id='ResourceSpecialDieSize"+i+"' name='ResourceSpecialDieSize"+i+"' class='small-number' value=6 min=1><span id='ResourceSpecialScalingSpan"+i+"'></span></td>");

		document.getElementById("FeatureTierType").addEventListener("change",createResourceSpecialScaling);
	}
	else if(specialResourceType === "SpellSlot"){
		referenceElement = createTableRow(referenceElement,"rowResourceSpecialTypeInfo"+i,"<th><label for='ResourceSpecialSlotLevel"+i+"'>Resource Spell Slot Level:</label></th><td><input type='number' id='ResourceSpecialSlotLevel"+i+"' name='ResourceSpecialSlotLevel"+i+"' class='small-number' value=1 min=1><span id='ResourceSpecialScalingSpan"+i+"'></span></td>");

		document.getElementById("FeatureTierType").addEventListener("change",createResourceSpecialScaling);
	}
	else if(specialResourceType === "Time"){
		let timeUnitsSelect = createTimeUnitsSelect();
		referenceElement = createTableRow(referenceElement,"rowResourceSpecialTypeInfo"+i,"<th><label for='ResourceTimeUnits"+i+"'>Units of Time:</label></th><td><select id='ResourceTimeUnits"+i+"' name='ResourceTimeUnits"+i+"'>"+timeUnitsSelect+"</select> (Value Determined Above)</td>");
	}
	
	if(specialResourceType === "Time" || specialResourceType === ""){
		let currentNumber = Number(document.getElementById("ResourceNumber").value);
		let needsListener = false;
		for(let j = 0; j < currentNumber; j++){
			let scalingSpan = document.getElementById("ResourceSpecialScalingSpan"+j);
			if(scalingSpan !== null){
				needsListener = true;
				break;
			}
		}

		if(!needsListener){
			document.getElementById("FeatureTierType").removeEventListener("change",createResourceSpecialScaling);
		}
	}
}

function createResourceSpecialScaling(){
	let currentNumber = Number(document.getElementById("ResourceNumber").value);
	let isLevelScaling = document.getElementById("FeatureTierType").value;

	for(let i = 0; i < currentNumber; i++){
		let scalingSpan = document.getElementById("ResourceSpecialScalingSpan"+i);
		if(scalingSpan !== null){
			if(isLevelScaling === ""){
				scalingSpan.innerHTML = "";
			}
			else{
				let levelScalingSelect = createAHLSelect("ResourceSpecialScalingHow"+i);
				scalingSpan.innerHTML = " + <input type='number' class='small-number' id='ResourceSpecialScaling"+i+"' name='ResourceSpecialScaling"+i+"'>"+levelScalingSelect;
			}
		}
	}
}

function addResourceRestorationRows(referenceRow,i){
	if(i === undefined){
		i = "";
	}
	let isResourceChoice = document.getElementById("isResources").value;
	let initialReferenceRow = referenceRow;

	let restoreWhenOptions = [
		{DisplayName:"Short Rest",Name:"ShortRest"},
		{DisplayName:"Long Rest",Name:"LongRest"},
		{DisplayName:"At Dawn",Name:"Dawn"},
		{DisplayName:"At Dusk",Name:"Dusk"},
		{DisplayName:"Start of Turn",Name:"StartTurn"},
		{DisplayName:"End of Turn",Name:"EndTurn"},
		{DisplayName:"Rolling Initiative",Name:"Initiative"},
		{DisplayName:"Restored by an Item",Name:"Item"}
	]
	if(isResourceChoice === "multiple" && i === ""){
		restoreWhenOptions.push({DisplayName:"Different for Each Resource",Name:"DifferentByResource"});
	}
	let restoreWhenMultiselect = createHTMLMultiselectOptions(restoreWhenOptions,"ResourceRestore"+i);
	referenceRow = createTableRow(referenceRow,"rowResourceRestore"+i,"<th>When Resource is Restored:</th><td><div class='check-multiple'>"+restoreWhenMultiselect+"</div></td>");

	referenceRow = createTableRow(referenceRow,"rowResourceRestoreMethod"+i,"<th><label for='ResourceRestoreMethod"+i+"'>How Resource is Restored:</label></th><td><select id='ResourceRestoreMethod"+i+"' name='ResourceRestoreMethod"+i+"'><option value='Full'>Fully Recharge</option><option value='Fixed'>Fixed Amount Regained</option><option value='Rolled'>Rolled Amount</option><option value='Chance'>Chance to Restore</option><option value='UpTo'>Restore Up to Amount</option><option value='Attribute'>Based on Attribute</option><option value='Proficiency'>Based on Proficiency</option></select></td>");
	document.getElementById("ResourceRestoreMethod"+i).addEventListener("change",function(){
		createRestoreMethodRows(i);
	});

	if(isResourceChoice === "multiple" && i === ""){
		document.getElementById("ResourceRestoreDifferentByResource").addEventListener("change",function(){
			let resourceNum = Number(document.getElementById("ResourceNumber").value);

			for(let j = 0; j < resourceNum; j++){
				addResourceRestorationRows(document.getElementById("rowResourceSpecialType"+j),j);
			}

			document.getElementById("AddResourceButton").addEventListener("click",addResourceRestorationRowsOnButton);

			deleteInterveningElements(initialReferenceRow,referenceRow.nextElementSibling);

			createTableRow(initialReferenceRow,"rowSingleResourceRestoration","<th colspan=2 style='text-align:center'><input type='button' id='isRevertMultiRestoration' value='Revert to Single Restoration Method for All Resources'></th>");
			document.getElementById("isRevertMultiRestoration").addEventListener("click",function(){
				let resourceNum = Number(document.getElementById("ResourceNumber").value);
				for(let j = 0; j < resourceNum; j++){
					let endRow = document.getElementById("rowResourceRestoreAmount"+j);
					if(endRow === null){
						endRow = document.getElementById("rowResourceRestoreMethod"+j);
					}

					deleteInterveningElements(document.getElementById("rowResourceRestore"+j).previousElementSibling,endRow.nextElementSibling);
				}

				document.getElementById("rowSingleResourceRestoration").remove();
				addResourceRestorationRows(initialReferenceRow);
			});
		});
	}
}

function addResourceRestorationRowsOnButton(){
	let i = Number(document.getElementById("ResourceNumber").value);
	let referenceElement = document.getElementById("rowResourceSpecialType"+(i-1));
	addResourceRestorationRows(referenceElement,i);
}

function createRestoreMethodRows(i){
	if(i === undefined){
		i = "";
	}
	let referenceRow = document.getElementById("rowResourceRestoreMethod"+i);
	let endRow = document.getElementById("rowResourceRestoreAmount"+i);
	if(endRow !== null){
		deleteInterveningElements(referenceRow,endRow.nextElementSibling);
	}

	let restoreMethodChoice = document.getElementById("ResourceRestoreMethod"+i).value;
	if(restoreMethodChoice == "Fixed"){
		referenceRow = createTableRow(referenceRow,"rowResourceRestoreAmount"+i,"<th><label for='RestoreAmount"+i+"'>Amount Restored:</label></th><td><input type='number' id='RestoreAmount"+i+"' name='RestoreAmount"+i+"' min='0' value='1' class='small-number'></td>");
	}
	else if(restoreMethodChoice == "Rolled"){
		referenceRow = createTableRow(referenceRow,"rowResourceRestoreAmount"+i,"<th><label for='RestoreAmountDieNumber"+i+"'>Amount Recharged:</label></th><td><input type='number' id='RestoreAmountDieNumber"+i+"' name='RestoreAmountDieNumber"+i+"' min='0' value='1' class='small-number'> d <input type='number' id='RestoreAmountDieSize"+i+"' name='RestoreAmountDieSize"+i+"' min='0' value='6' class='small-number'> + <input type='number' id='RestoreAmountBonus"+i+"' name='RestoreAmountBonus"+i+"' value=0 class='small-number'></td>");
	}
	else if(restoreMethodChoice == "Chance"){
		referenceRow = createTableRow(referenceRow,"rowResourceChanceDice"+i,"<th><label for='RestoreChanceDieNumber"+i+"'>Dice Rolled:</label></th><td><input type='number' id='RestoreChanceDieNumber"+i+"' name='RestoreChanceDieNumber"+i+"' min='0' value='1' class='small-number'> d <input type='number' id='RestoreChanceDieSize"+i+"' name='RestoreChanceDieSize"+i+"' min='0' value='6' class='small-number'> + <input type='number' id='RestoreChanceBonus"+i+"' name='RestoreChanceBonus"+i+"' value=0 class='small-number'></td>");
		
		referenceRow = createTableRow(referenceRow,"rowResourceRestoreAmount"+i,"<th><label for='RestoreChanceTarget"+i+"'>Minimum Successful Recharge Roll:</label></th><td><input type='number' id='RestoreChanceTarget"+i+"' name='RestoreChanceTarget"+i+"' min='0' value='5' class='small-number'></td>");
	}
	else if(restoreMethodChoice == "UpTo"){
		referenceRow = createTableRow(referenceRow,"rowResourceRestoreAmount"+i,"<th><label for='RestoreAmount"+i+"'>Set Resource To:</label></th><td><input type='number' id='RestoreAmount"+i+"' name='RestoreAmount"+i+"' min='0' value='1' class='small-number'></td>");
	}
	else if(restoreMethodChoice == "Attribute"){
		let AttributeOptions = createHTMLSelectOptions(attributes);

		referenceRow = createTableRow(referenceRow,"rowResourceRestoreAmount"+i,"<th><label for='RestoreAmountMultiplier"+i+"'>Amount Recharged:</label></th><td>(<input type='number' id='RestoreAmountMultiplier"+i+"' name='RestoreAmountMultiplier"+i+"' min='0' value='1' class='small-number'> * <select id='RestoreAmountAttribute"+i+"' name='RestoreAmountAttribute"+i+"'>"+AttributeOptions+"</select>) + <input type='number' id='RestoreAmountBonus"+i+"' name='RestoreAmountBonus"+i+"' value=0 class='small-number'></td>");
	}
	else if(restoreMethodChoice == "Proficiency"){
		referenceRow = createTableRow(referenceRow,"rowResourceRestoreAmount"+i,"<th><label for='RestoreAmountMultiplier"+i+"'>Amount Recharged:</label></th><td>(<input type='number' id='RestoreAmountMultiplier"+i+"' name='RestoreAmountMultiplier"+i+"' min='0' value='1' class='small-number'> * Proficiency) + <input type='number' id='RestoreAmountBonus"+i+"' name='RestoreAmountBonus"+i+"' value=0 class='small-number'></td>");
	}
}
