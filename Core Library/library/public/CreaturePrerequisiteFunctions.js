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

		referenceRow = createTableRow(referenceRow,"rowCreatureTypeLimits"+IDSuffix,"<th><span id='CreatureTypeLimitsSpan"+IDSuffix+"'>"+limitsChoiceDisplay+"</span> Creature Types:</th><td><div class='check-multiple' style='width:100%'>"+CreatureTypeOptions+"</div></td>");
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

		referenceRow = createTableRow(referenceRow,"rowCreatureSubtypeLimits"+IDSuffix,"<th><span id='CreatureSubtypeLimitsSpan"+IDSuffix+"'>"+limitsChoiceDisplay+"</span> Creature Types:</th><td><div class='check-multiple' style='width:100%'>"+CreatureSubtypeOptions+"</div></td>");
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

function createSpeedPrereqRows(IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}
	let referenceRow = document.getElementById("rowSpeedPrereqs"+IDSuffix);
	let prereqType = document.getElementById("SpeedPrereqs"+IDSuffix).value;

	if(prereqType === ""){
		deleteInterveningElements(referenceRow,document.getElementById("rowSpeedPrereqsEnd"+IDSuffix).nextElementSibling);
	}
	else{
		let speedTypes = [
			{Name:"Walking",DisplayName:"Walking"},
			{Name:"Burrow",DisplayName:"Burrowing"},
			{Name:"Climb",DisplayName:"Climbing"},
			{Name:"Fly",DisplayName:"Flying"},
			{Name:"Swim",DisplayName:"Swimming"}
		];

		if(document.getElementById("rowSpeedPrereqsEnd"+IDSuffix) == null){
			let endRow = createTableRow(referenceRow,"rowSpeedPrereqsEnd"+IDSuffix,"<th colspan=2></th>");
			endRow.classList.add("minor-section-end");
		}

		if(prereqType === "Inclusive" || prereqType === "Exclusive"){
			let speedsMultiselect = createHTMLMultiselectOptions(speedTypes,"SpeedChoice"+IDSuffix);

			if(document.getElementById("rowSpeedPrereqsInclude"+IDSuffix) == null){
				deleteInterveningElements(referenceRow,document.getElementById("rowSpeedPrereqsEnd"+IDSuffix));

				referenceRow = createTableRow(referenceRow,"rowSpeedPrereqsInclude"+IDSuffix,"<th><span id='SpeedPrereqsIncludeSpan"+IDSuffix+"'></span> Speed Types</th><td><div class='check-multiple' style='width:100%'>"+speedsMultiselect+"</div></td>");
			}

			if(prereqType === "Inclusive"){
				document.getElementById("SpeedPrereqsIncludeSpan"+IDSuffix).innerHTML = "Allowed";
			}
			else{
				document.getElementById("SpeedPrereqsIncludeSpan"+IDSuffix).innerHTML = "Prohibited";
			}
		}
		else if(prereqType === "Range"){
			deleteInterveningElements(referenceRow,document.getElementById("rowSpeedPrereqsEnd"+IDSuffix));

			let speedTypeOptions = createHTMLSelectOptions(speedTypes);
			speedTypeOptions = "<option value='Any'>Any Type</option>"+speedTypeOptions+"<option value='All'>All Types</option>";

			referenceRow = createTableRow(referenceRow,"rowSpeedPrereqsRange"+IDSuffix,"<th><label for='SpeedPrereqsRangeMaximum"+IDSuffix+"'>Speed Range and Type:</label></th><td><input type='number' id='SpeedPrereqsRangeMinimum"+IDSuffix+"' name='SpeedPrereqsRangeMinimum"+IDSuffix+"' value=0 min=0 style='width:25px' class='small-number'> - <input type='number' id='SpeedPrereqsRangeMaximum"+IDSuffix+"' name='SpeedPrereqsRangeMaximum"+IDSuffix+"' value=0 min=0 style='width:25px' class='small-number'><select id='SpeedPrereqsRangeType"+IDSuffix+"' name='SpeedPrereqsRangeType"+IDSuffix+"'>"+speedTypeOptions+"</select><select id='SpeedPrereqsRangeIgnore"+IDSuffix+"'><option value='Minimum'>No Minimum</option><option value='Maximum'>No Maximum</option><option value=''>Both Min and Max</option></select></td>");

			document.getElementById("SpeedPrereqsRangeIgnore"+IDSuffix).addEventListener("change",function(){
				let ignoreChoice = this.value;
				let minInput = document.getElementById("SpeedPrereqsRangeMinimum"+IDSuffix);
				let maxInput = document.getElementById("SpeedPrereqsRangeMaximum"+IDSuffix);
				if(ignoreChoice === ""){
					minInput.removeAttribute("disabled");
					maxInput.removeAttribute("disabled");
				}
				else if(ignoreChoice === "Minimum"){
					maxInput.removeAttribute("disabled");
					minInput.setAttribute("disabled","");
				}
				else if(ignoreChoice === "Maximum"){
					minInput.removeAttribute("disabled");
					maxInput.setAttribute("disabled","");
				}
			});

			document.getElementById("SpeedPrereqsRangeMaximum"+IDSuffix).addEventListener("change",function(){
				let currentMinInput = document.getElementById("SpeedPrereqsRangeMinimum"+IDSuffix);
				if(currentMinInput.disabled === true){
					return;
				}

				let currentMax = this.value;
				let currentMin = currentMinInput.value;

				if(currentMin > currentMax){
					currentMinInput.value = currentMax;
				}
			});

			document.getElementById("SpeedPrereqsRangeMinimum"+IDSuffix).addEventListener("change",function(){
				let currentMaxInput = document.getElementById("SpeedPrereqsRangeMaximum"+IDSuffix);
				if(currentMaxInput.disabled === true){
					return;
				}

				let currentMin = this.value;
				let currentMax = currentMaxInput.value;

				if(currentMin > currentMax){
					currentMaxInput.value = currentMin;
				}
			});
		}
		else if(prereqType === "Relative"){
			deleteInterveningElements(referenceRow,document.getElementById("rowSpeedPrereqsEnd"+IDSuffix));

			let speedTypeOptions = createHTMLSelectOptions(speedTypes);
			speedTypeOptions = "<option value='Any'>Any Speed</option>"+speedTypeOptions+"<option value='All'>All Speeds</option>";

			referenceRow = createTableRow(referenceRow,"rowSpeedPrereqsRange"+IDSuffix,"<th><label for='SpeedPrereqsRange"+IDSuffix+"'>Speed Compared to User:</label></th><td><select id='SpeedPrereqsRange"+IDSuffix+"' name='SpeedPrereqsRange"+IDSuffix+"'><option value='LessThan'>Slower Than</option><option value='GreaterThan'>Faster Than</option></select><select id='SpeedPrereqsRangeType"+IDSuffix+"' name='SpeedPrereqsRangeType"+IDSuffix+"'>"+speedTypeOptions+"</select></td>");
		}
	}
}