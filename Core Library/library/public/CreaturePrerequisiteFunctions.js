async function createCreatureTypeRows(IDSuffix){
	let limitsChoice = document.getElementById("isCreatureTypeLimits"+IDSuffix).value;
	let referenceRow = document.getElementById("rowIsCreatureTypeLimits"+IDSuffix);

	if(limitsChoice != "" && document.getElementById("rowCreatureTypeLimits"+IDSuffix) == null){
		let request = await fetch("macro:pm.GetCreatureTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allCreatureTypes = await request.json();
		let CreatureTypeOptions = createHTMLMultiselectOptions(allCreatureTypes,"CreatureTypeLimits"+IDSuffix);
		let limitsChoiceDisplay;
		if(limitsChoice == "Exclusive"){
			limitsChoiceDisplay = "Prohibited";
		}
		else{
			limitsChoiceDisplay = "Allowed";
		}

		referenceRow = createTableRow(referenceRow,"rowCreatureTypeLimits"+IDSuffix,"<th><span id='CreatureTypeLimitsSpan"+IDSuffix+"'>"+limitsChoiceDisplay+"</span> Creature Types:</th><td><span class='check-multiple' style='width:100%'>"+CreatureTypeOptions+"</span></td>");
	}
	else if(limitsChoice == ""){
		referenceRow.nextElementSibling.remove();
	}
	else{
		let limitsChoiceDisplay;
		if(limitsChoice == "Exclusive"){
			limitsChoiceDisplay = "Prohibited";
		}
		else{
			limitsChoiceDisplay = "Allowed";
		}
		document.getElementById("CreatureTypeLimitsSpan"+IDSuffix).innerHTML = limitsChoiceDisplay;
	}
}

async function createCreatureSubtypeRows(IDSuffix){
	let limitsChoice = document.getElementById("isCreatureSubtypeLimits"+IDSuffix).value;
	let referenceRow = document.getElementById("rowIsCreatureSubtypeLimits"+IDSuffix);
	
	if(limitsChoice != "" && document.getElementById("rowCreatureSubtypeLimits"+IDSuffix) == null){
		let request = await fetch("macro:pm.GetRaces@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allCreatureRaces = await request.json();
		let requestSubtypes = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.CreatureSubtypes']"});
		let allCreatureSubtypes = await requestSubtypes.json();
		allCreatureSubtypes = allCreatureRaces.concat(allCreatureSubtypes);
		allCreatureSubtypes = sortData(allCreatureSubtypes);

		let CreatureSubtypeOptions = createHTMLMultiselectOptions(allCreatureSubtypes,"CreatureSubtypeLimits"+IDSuffix);
		let limitsChoiceDisplay;
		if(limitsChoice == "Exclusive"){
			limitsChoiceDisplay = "Prohibited";
		}
		else{
			limitsChoiceDisplay = "Allowed";
		}

		referenceRow = createTableRow(referenceRow,"rowCreatureSubtypeLimits"+IDSuffix,"<th><span id='CreatureSubtypeLimitsSpan"+IDSuffix+"'>"+limitsChoiceDisplay+"</span> Creature Types:</th><td><span class='check-multiple' style='width:100%'>"+CreatureSubtypeOptions+"</span></td>");
	}
	else if(limitsChoice == ""){
		referenceRow.nextElementSibling.remove();
	}
	else{
		let limitsChoiceDisplay;
		if(limitsChoice == "Exclusive"){
			limitsChoiceDisplay = "Prohibited";
		}
		else{
			limitsChoiceDisplay = "Allowed";
		}
		document.getElementById("CreatureSubtypeLimitsSpan"+IDSuffix).innerHTML = limitsChoiceDisplay;
	}
}

function createSizePrereqRows(IDSuffix){
	referenceRow = document.getElementById("rowSizePrereqs"+IDSuffix);
	sizeChoice = document.getElementById("SizePrereqs"+IDSuffix).value;

	if(sizeChoice == ""){
		deleteInterveningElements(referenceRow,document.getElementById("rowSizePrereqsEnd"+IDSuffix).nextElementSibling);
	}
	else{
		if(document.getElementById("rowSizePrereqsEnd"+IDSuffix) == null){
			createTableRow(referenceRow,"rowSizePrereqsEnd"+IDSuffix,"");
		}

		if(sizeChoice == "Inclusive" || sizeChoice == "Exclusive"){
			if(document.getElementById("rowSizePrereqsSelect"+IDSuffix) == null){
				deleteInterveningElements(referenceRow,document.getElementById("rowSizePrereqsEnd"+IDSuffix));

				let allSizes = ["Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"];
				let sizeOptions = "";
				for (let size of allSizes){
					sizeOptions = sizeOptions + "<label><input type='checkbox' id='SizePrereqsChoice"+size+IDSuffix+"' name='SizePrereqsChoice"+size+IDSuffix+"'><span>"+size+"</span></label>";
				}

				referenceRow = createTableRow(referenceRow,"rowSizePrereqsSelect"+IDSuffix,"<th><span id='SizePrereqChoiceHeaderSpan"+IDSuffix+"'></span></th><td><div class='check-multiple' style='width:100%'>"+sizeOptions+"</div></td>");
			}

			if(sizeChoice == "Inclusive"){
				document.getElementById("SizePrereqChoiceHeaderSpan"+IDSuffix).innerHTML = "Allowed Sizes";
			}
			else{
				document.getElementById("SizePrereqChoiceHeaderSpan"+IDSuffix).innerHTML = "Prohibited Sizes";
			}
		}
		else if(sizeChoice == "RelativeMaximum"){
			deleteInterveningElements(referenceRow,document.getElementById("rowSizePrereqsEnd"+IDSuffix));

			referenceRow = createTableRow(referenceRow,"rowSizePrereqsRange"+IDSuffix,"<th>Largest Allowed Size:</th><td><input type='number' id='SizePrereqsRelativeMagnitude"+IDSuffix+"' name='SizePrereqsRelativeMagnitude"+IDSuffix+"' min=0 value=0 style='width:25px'> size(s) <select id='SizePrereqsRelativeDirection"+IDSuffix+"' name='SizePrereqsRelativeDirection"+IDSuffix+"'><option value='Larger'>Larger</option><option value='Smaller'>Smaller</option></select></div></td>");
		}
		else if(sizeChoice == "RelativeMinimum"){
			deleteInterveningElements(referenceRow,document.getElementById("rowSizePrereqsEnd"+IDSuffix));

			referenceRow = createTableRow(referenceRow,"rowSizePrereqsRange"+IDSuffix,"<th>Smallest Allowed Size:</th><td><input type='number' id='SizePrereqsRelativeMagnitude"+IDSuffix+"' name='SizePrereqsRelativeMagnitude"+IDSuffix+"' min=0 value=0 style='width:25px'> size(s) <select id='SizePrereqsRelativeDirection"+IDSuffix+"' name='SizePrereqsRelativeDirection"+IDSuffix+"'><option value='Larger'>Larger</option><option value='Smaller'>Smaller</option></select></div></td>");
		}
		else if(sizeChoice == "Relative"){
			deleteInterveningElements(referenceRow,document.getElementById("rowSizePrereqsEnd"+IDSuffix));

			referenceRow = createTableRow(referenceRow,"rowSizePrereqsRange"+IDSuffix,"<th>Size Must be Within:</th><td><input type='number' id='SizePrereqsRelativeMagnitude"+IDSuffix+"' name='SizePrereqsRelativeMagnitude"+IDSuffix+"' min=0 value=0 style='width:25px'> size(s) of User</div></td>");
		}
		else{
			deleteInterveningElements(referenceRow,document.getElementById("rowSizePrereqsEnd"+IDSuffix));

			let allSizes = ["Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"];
			let sizeOptions = "";
			for (let size of allSizes){
				sizeOptions += "<option value='"+size+"'>"+size+"</option>";
			}

			referenceRow = createTableRow(referenceRow,"rowSizePrereqsRange"+IDSuffix,"<th>Range of Allowed Sizes:</th><td><select id='SizePrereqsMinimum"+IDSuffix+"' name='SizePrereqsMinimum"+IDSuffix+"'><option value=''>No Minimum</option>"+sizeOptions+"</select> - <select id='SizePrereqsMaximum"+IDSuffix+"' name='SizePrereqsMaximum"+IDSuffix+"'><option value=''>No Maximum</option>"+sizeOptions+"</select></div></td>");

			document.getElementById("SizePrereqsMaximum"+IDSuffix).addEventListener("change",function(){
				let minimumSelection = document.getElementById("SizePrereqsMinimum"+IDSuffix).value;
				let maximumSelection = this.value;
				if(minimumSelection == "" || maximumSelection == ""){
					return;
				}

				let allSizes = ["Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"];
				let minimumIndex = allSizes.indexOf(minimumSelection);
				let maximumIndex = allSizes.indexOf(maximumSelection);

				if(minimumIndex > maximumIndex){
					document.getElementById("SizePrereqsMinimum"+IDSuffix).value = maximumSelection;
				}
			});

			document.getElementById("SizePrereqsMinimum"+IDSuffix).addEventListener("change",function(){
				let minimumSelection = this.value;
				let maximumSelection = document.getElementById("SizePrereqsMaximum"+IDSuffix).value;
				if(minimumSelection == "" || maximumSelection == ""){
					return;
				}

				let allSizes = ["Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"];
				let minimumIndex = allSizes.indexOf(minimumSelection);
				let maximumIndex = allSizes.indexOf(maximumSelection);

				if(minimumIndex > maximumIndex){
					document.getElementById("SizePrereqsMaximum"+IDSuffix).value = minimumSelection;
				}
			});
		}
	} 
}