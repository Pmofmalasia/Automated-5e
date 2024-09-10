function addFeatureChoicesRows(){
	let referenceRow = document.getElementById("rowChoicesWhenGainedTitle");

	referenceRow = createTableRow(referenceRow,"rowFeatureTierType","<th><span class='info-tooltip' title='Consistent: Like Ki/Sneak Attack, which improve every/every other level; Inconsistent: Like Rage, which improves its damage after 8 levels, then 7 levels, etc.'><img src='lib://pm.a5e.core/InterfaceImages/info.png'> <label for='FeatureTierType'>How Feature Changes with Leveling:</label></span></th><td><select id='FeatureTierType' name='FeatureTierType'><option value=''>No Change</option><option value='consistent'>At Consistent Intervals</option><option value='inconsistent'>At Inconsistent Intervals</option></select></td>");
	document.getElementById("FeatureTierType").addEventListener("change",function(){
		let buttonsRow = document.getElementById("rowFeatureTierLevelButtons");
		if(this.value === "" || this.value === "consistent"){
			deleteInterveningElements(document.getElementById("rowFeatureTierType"),buttonsRow.nextElementSibling);
		}
		else if(buttonsRow === null){
			createMultiRowButtonsInput("FeatureTierLevel",document.getElementById("rowFeatureTierType"),"<th><label for='TierLevelSeparator'>Next Break Point at Level:</label></th><td><input type='number' class='small-number' id='TierLevelSeparator' name='TierLevelSeparator' min="+FeatureData.Level+" value="+FeatureData.Level+"></td>","Break Point");
		}
	});

	referenceRow = createTableRow(referenceRow,"rowIsResources","<th><span class='info-tooltip' title='Does NOT apply for abilities that use resources of another feature, e.g. Lore Bard - Cutting Words uses Bardic Inspiration, NOT its own resource.'><img src='lib://pm.a5e.core/InterfaceImages/info.png'> <label for='isResources'>Feature Has its Own Resources:</label></span></th><td><select id='isResources' name='isResources'><option value=''>No Resource</option><option value='one'>Single Resource</option><option value='multiple'>Multiple Resources</option></select></span></td>");
	document.getElementById("isResources").addEventListener("change",function(){
		createResourceRows();
	});

	if(FeatureType !== "Class"){
		referenceRow = createTableRow(referenceRow,"rowIsAssociatedClass","<th><span class='info-tooltip' title='For features like Magic Initiate which have choices based on their class.'><img src='lib://pm.a5e.core/InterfaceImages/info.png'> <label for='isAssociatedClass'>Has Associated Class:</label></th><td><input type='checkbox' id='isAssociatedClass' name='isAssociatedClass'></span></td>");
		document.getElementById("isAssociatedClass").addEventListener("change",function(){
			let referenceRow = document.getElementById("rowIsAssociatedClass");
			let choice = this.checked;
			if(choice){
				let classOptions = createHTMLMultiselectOptions(classes,"isAssociatedClassOption");
				referenceRow = createTableRow(referenceRow,"rowAssociatedClassOptions","<th>Class Options:</th><td><div style='width:100%' class='check-multiple'>"+classOptions+"</div></td>");
			}
			else{
				if(referenceRow.nextElementSibling.id === "rowAssociatedClassOptions"){
					referenceRow.nextElementSibling.remove();
				}			
			}
		});		
	}


	let attributeOptions = createHTMLSelectOptions(attributes);
	referenceRow = createTableRow(referenceRow,"rowPrimeStat","<th><label for='PrimeStat'>Feature has Main Attribute:</label></th><td><span id='PrimeStatSpan'><select id='PrimeStat' name='PrimeStat'><option value=''>None</option>"+attributeOptions+"<option value='variable'>Multiple Options</option></select></span></td>");
	document.getElementById("PrimeStat").addEventListener("change",function(){
		let referenceElement = document.getElementById("rowPrimeStat");
		let endRow = document.getElementById("rowPrimeStatEnd");
		if(this.value === "variable" && endRow === null){
			let attributeMultiselect = createHTMLMultiselectOptions(attributes,"optionPrimeStat");
			referenceElement = createTableRow(referenceElement,"rowPrimeStatMulti","<th>Main Attribute Options:</th><td><div style='width:100%' class='check-multiple'>"+attributeMultiselect+"</div></td>");

			referenceElement = createTableRow(referenceElement,"rowPrimeStatMethod","<th><label for='PrimeStatMethod'>Method of Choosing Attribute:</label></th><td><select id='PrimeStatMethod' name='PrimeStatMethod'><option value='ChooseGained'>Choose When Gaining Feature</option><option value='ChooseAlways'>Choose When Using Feature</option><option value='Maximum'>Use Higher Stat</option><option value='Minimum'>Use Lower Stat</option></select></td>");

			referenceElement = createTableRow(referenceElement,"rowPrimeStatEnd","<th colspan=2></th>");
			referenceElement.classList.add("section-end");
		}
		else if(endRow !== null){
			deleteInterveningElements(referenceElement,endRow.nextElementSibling);
		}
	});
	function variablePrimeStatCastingClass(){
		let primeStatInput = document.getElementById("PrimeStat");
		let isAssociatedClass = document.getElementById("isAssociatedClass").checked;
		let castingClassOption = document.getElementById("PrimeStatOptionCastingClass");

		if(isAssociatedClass){
			if(primeStatInput !== null && castingClassOption !== null){
				castingClassOption = document.createElement("option");
				castingClassOption.value = "CastingClass";
				castingClassOption.id = "PrimeStatOptionCastingClass";
				primeStatInput.insertAdjacentElement("beforeend",castingClassOption);
			}
		}
		else if(castingClassOption !== null){
			castingClassOption.remove();
		}
	}
	variablePrimeStatCastingClass();
	document.getElementById("isAssociatedClass").addEventListener("change",variablePrimeStatCastingClass);

	referenceRow = createTableRow(referenceRow,"rowIsSubfeatures","<th><span class='info-tooltip' title='For features like Eldritch Invocations, which select a number of associated features.'><img src='lib://pm.a5e.core/InterfaceImages/info.png'> <label for='isSubfeatures'>Choose from Associated Subfeatures:</label></span></th><td><input type='checkbox' id='isSubfeatures' name='isSubfeatures'></td>");
	document.getElementById("isSubfeatures").addEventListener("change",function(){
		let referenceElement = document.getElementById("rowIsSubfeatures");
		let endRow = document.getElementById("rowSubfeatureEnd");
		if(this.checked && endRow === null){
			referenceElement = createTableRow(referenceElement,"rowSubfeatureNumber","<th><label for='SubfeatureNumber'>Number of Subfeatures Gained:</label></th><td><input type='number' id='SubfeatureNumber' name='SubfeatureNumber' class='small-number'><span id='SubfeatureScalingSpan'></span></td>");

			referenceElement = createTableRow(referenceElement,"rowSubfeatureWhen","<th><label for='SubfeatureExchangeNumber'>When to Exchange Subfeatures:</label></th><td><input type='number' class='small-number' id='SubfeatureExchangeNumber' name='SubfeatureExchangeNumber' value=1 min=0> features <select id='SubfeatureExchangeWhen' name='SubfeatureExchangeWhen'><option value=''>Cannot Exchange Subfeatures</option><option value='Level'>On Leveling</option><option value='ASI'>When Gaining an ASI</option><option value='LongRest'>On Long Rest</option><option value='ShortRest'>On Short Rest</option><option value='AnyTime'>Any Time</option></select></td>");

			referenceElement = createTableRow(referenceElement,"rowSubfeatureEnd","<th colspan=2></th>");
			referenceElement.classList.add("section-end");
		}
		else if(endRow !== null){
			deleteInterveningElements(referenceElement,endRow.nextElementSibling);
		}
	});

	referenceRow = createTableRow(referenceRow,"rowIsStoredValues","<th><span class='info-tooltip' title='For example choosing an associated damage type on gaining the feature (Zealot Barbarian), or making some choice that affect this or later features (Dragonborn color). Check to view options.'><img src='lib://pm.a5e.core/InterfaceImages/info.png'> <label for='isStoredValues'>Has Other Miscellaneous Choices:</label></span></th><td><input type='checkbox' id='isStoredValues' name='isStoredValues'></td>");
	document.getElementById("isStoredValues").addEventListener("change",function(){
		let referenceElement = document.getElementById("rowIsStoredValues");
		//TODO: Add this functionality. Will probably do a multibuttons row type deal with the type of misc. choice being selected on a dropdown.
	});
}

function addFeaturePassiveRows(){
	let referenceRow = document.getElementById("rowPassiveFeaturesTitle");
}

function addFeatureActiveRows(){
	let referenceRow = document.getElementById("rowActiveFeaturesTitle");

	addActiveEffectsRow(referenceRow);
}

function createAHLSelect(ahlSelectID){
	let ahlSelectHTML;
	let ahlType = document.getElementById("FeatureTierType").value;
	let ahlDisplay = "";

	if(ahlType === ""){
		return "";
	}

	if(ahlType === "consistent"){
		ahlDisplay = "Level";
	}
	else{
		ahlDisplay = "Interval";
	}

	ahlSelectHTML = "<select id='"+ahlSelectID+"' name='"+ahlSelectID+"'><option value='0'>No Increase</option><option value='1'>Every "+ahlDisplay+"</option><option value='2'>Every Other "+ahlDisplay+"</option><option value='3'>Every Three "+ahlDisplay+"s</option><option value='4'>Every Four "+ahlDisplay+"s</option><option value='5'>Every Five "+ahlDisplay+"s</option><option value='6'>Every Six "+ahlDisplay+"s</option><option value='7'>Every Seven "+ahlDisplay+"s</option><option value='8'>Every Eight "+ahlDisplay+"s</option><option value='9'>Every Nine "+ahlDisplay+"s</option><option value='10'>Every Ten "+ahlDisplay+"s</option></select>";

	return ahlSelectHTML;
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	userdata = JSON.parse(userdata);
	ParentToken = userdata.ParentToken;
	FeatureData = userdata.PriorData;
	FeatureType = FeatureData.FeatureType;

	document.getElementById("CreateFeatureCoreTable").innerHTML = userdata.Input;

	attributes = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
	attributes = await attributes.json();

	classes = await fetch("macro:pm.GetClasses@lib:pm.a5e.Core", {method: "POST", body: ""});
	classes = await classes.json();

	document.getElementById("submitButton").addEventListener("click",function(){
		submitData('CreateFeatureCore','CreateFeatureCoreProcessing',{ParentToken:ParentToken,Feature:FeatureData});
	});
	
	addFeatureChoicesRows();
	addFeaturePassiveRows();
	addFeatureActiveRows();
}

setTimeout(loadUserData, 1);