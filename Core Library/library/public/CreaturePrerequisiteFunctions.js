function addCreatureTypePrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	referenceRow = createTableRow(insertAfter,"rowIsCreatureTypeLimits"+IDSuffix,"<th><label for='isCreatureTypeLimits"+IDSuffix+"'>Limit By Creature Type:</th><td><select id='isCreatureTypeLimits"+IDSuffix+"' name='isCreatureTypeLimits"+IDSuffix+"'><option value=''>No Limit</option><option value='Inclusive'>Include Choices</option><option value='Exclusive'>Exclude Choices</option></select></td>");
	document.getElementById("isCreatureTypeLimits"+IDSuffix).addEventListener("change",function(){
		createCreatureTypeRows(IDSuffix);
	});

	return referenceRow;
}

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

function addCreatureSubtypePrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	referenceRow = createTableRow(insertAfter,"rowIsCreatureSubtypeLimits"+IDSuffix,"<th><label for='isCreatureSubtypeLimits"+IDSuffix+"'>Limit By Creature Subtype:</th><td><select id='isCreatureSubtypeLimits"+IDSuffix+"' name='isCreatureSubtypeLimits"+IDSuffix+"'><option value=''>No Limit</option><option value='Inclusive'>Include Choices</option><option value='Exclusive'>Exclude Choices</option></select></td>");
	document.getElementById("isCreatureSubtypeLimits"+IDSuffix).addEventListener("change",function(){
		createCreatureSubtypeRows(IDSuffix);
	});

	return referenceRow;
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

function addSizePrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	referenceRow = createTableRow(insertAfter,"rowSizePrereqs"+IDSuffix,"<th><label for='SizePrereqs"+IDSuffix+"'>Limit By Creature Size:</th><td><select id='SizePrereqs"+IDSuffix+"' name='SizePrereqs"+IDSuffix+"'><option value=''>No Limit</option><option value='Range'>Min/Maximum Sizes</option><option value='RelativeMaximum'>Maximum Relative to User's Size</option><option value='RelativeMinimum'>Minimum Relative to User's Size</option><option value='Relative'>Min/Maximum Relative to User's Size</option><option value='Inclusive'>Include Specific Sizes</option><option value='Exclusive'>Exclude Specific Sizes</option></select></td>");
	document.getElementById("SizePrereqs"+IDSuffix).addEventListener("change",function(){
		createSizePrereqRows(IDSuffix);
	});

	return referenceRow;
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

function addAllegiancePrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	let referenceRow = createTableRow(insertAfter,"rowAllegiancePrereq"+IDSuffix,"<th><label for='AllegiancePrereq"+IDSuffix+"'>Allegiance of Target:</label></th><td><select id='AllegiancePrereq"+IDSuffix+"' name='AllegiancePrereq"+IDSuffix+"'><option value='All'>Anyone</option><option value='Self'>Self Only</option><option value='Allies'>Allies</option><option value='AlliesNonself'>Allies Other Than Self</option><option value='NotSelf'>Anyone Other Than Self</option><option value='Enemies'>Enemies</option><option value='Nonhostile'>Nonhostile Creatures</option><option value='NonhostileNotself'>Nonhostile Creatures, Not Self</option></select></td>");

	return referenceRow;
}

function addPerceptionPrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	let PerceptionTypes = [
		{Name:"Sight",DisplayName:"Can See User"},
		{Name:"Hear",DisplayName:"Can Hear User"},
		{Name:"Understand",DisplayName:"Can Understand User"}
	]
	let perceptionOptions = createHTMLMultiselectOptions(PerceptionTypes,"TargetPerception"+IDSuffix)
	let referenceRow = createTableRow(insertAfter,"rowPerceptionPrereq"+IDSuffix,"<th>Perception of User Required:</th><td><div class='check-multiple' style='width:100%; height=48px'>"+perceptionOptions+"</div></td>");

	return referenceRow;
}

function addHPPrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	let referenceRow = createTableRow(insertAfter,"rowHPPrereq"+IDSuffix,"<th><label for='HPPrereqType"+IDSuffix+"'>Hit Point Requirements:</label></th><td><select id='HPPrereqType"+IDSuffix+"' name='HPPrereqType"+IDSuffix+"' onchange='createTargetHPTable("+'"'+IDSuffix+'"'+")'><option value=''>No Requirement</option><option value='AtMaximumHP'>At Maximum HP</option><option value='Damaged'>Below Maximum HP</option><option value='OverHalfHP'>Over Half HP</option><option value='BelowHalfHP'>Below Half HP</option><option value='NoHP'>No HP Remaining</option><option value='HasHP'>Has at Least 1 HP</option><option value='Comparison'>Other Comparison</option></select></td>");
	document.getElementById("HPPrereqType"+IDSuffix).addEventListener("change",function(){
		createHPPrereqRow(IDSuffix);
	});

	return referenceRow;
}

function createHPPrereqRow(IDSuffix){
	let referenceRow = document.getElementById("rowHPPrereq"+IDSuffix);
	let HPRequirementChoice = document.getElementById("HPPrereqType"+IDSuffix).value;

	if(HPRequirementChoice != "Comparison"){
		let endRow;
		if(document.getElementById("rowHPPrereqComparison"+IDSuffix) == null){
			endRow = document.getElementById("rowHPPrereq"+IDSuffix).nextElementSibling;
		}
		else{
			endRow = document.getElementById("rowHPPrereqComparison"+IDSuffix).nextElementSibling;
		}

		deleteInterveningElements(referenceRow,endRow);
	}
	else{
		referenceRow = createTableRow(referenceRow,"rowHPPrereqComparison"+IDSuffix,"<th><label for='HPPrereqComparitor"+IDSuffix+"'>HP Must Be:</label></th><td><select id='HPPrereqComparitor"+IDSuffix+"' name='HPPrereqComparitor"+IDSuffix+"'><option value='LessEqual'><=</option><option value='Less'><</option><option value='Equal'>=</option><option value='Greater'>></option><option value='GreaterEqual'>>=</option></select><select id='HPPrereqTargetType"+IDSuffix+"' name='HPPrereqTargetType"+IDSuffix+"'><option value='Value'>A Fixed Value</option><option value='Token'>Another Token</option></select>: <span id='HPPrereqTargetBoundary"+IDSuffix+"'><input type='number' id='HPPrereqTarget"+IDSuffix+"' name='HPPrereqTarget"+IDSuffix+"' style='width:30px' value=100></span></td>");

		document.getElementById("HPPrereqTargetType"+IDSuffix).addEventListener("change",function(){
			let targetType = this.value;

			if(targetType == "Value"){
				document.getElementById("HPPrereqTargetBoundary"+IDSuffix).innerHTML = "<input type='number' id='HPPrereqTarget"+IDSuffix+"' name='HPPrereqTarget"+IDSuffix+"' width='30px' value=100>";
			}
			else if(targetType == "Token"){
				document.getElementById("HPPrereqTargetBoundary"+IDSuffix).innerHTML = "<select id='HPPrereqTarget"+IDSuffix+"' name='HPPrereqTarget"+IDSuffix+"'><option value='User'>User of Feature</option><option value='Targets'>Other Targets</option><option value=''>Other Token</option></select>";
			}
		});
	}
}

function addAbilityScorePrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	let referenceRow = createTableRow(insertAfter,"rowAbilityScorePrereq"+IDSuffix,"<th><label for='isAbilityScore"+IDSuffix+"'>Limit By Ability Scores:</th><td><select name='isAbilityScore"+IDSuffix+"' id='isAbilityScore"+IDSuffix+"'><option value=''>No Limit</option><option value='Inclusive'>Include Choices</option><option value='Exclusive'>Exclude Choices</option></select></td>");
	document.getElementById("isAbilityScore"+IDSuffix).addEventListener("change",function(){
		createAbilityScorePrereqRows(IDSuffix);
	});

	return referenceRow;
}

async function createAbilityScorePrereqRows(IDSuffix){
	let referenceRow = document.getElementById("rowAbilityScorePrereq"+IDSuffix);
	let prereqChoice = document.getElementById("isAbilityScore"+IDSuffix).value;

	if(prereqChoice === ""){
		if(document.getElementById("rowAbilityScorePrereqEnd"+IDSuffix) !== null){
			deleteInterveningElements(referenceRow,document.getElementById("rowAbilityScorePrereqEnd"+IDSuffix).nextElementSibling);
		}
	}
	else{
		if(document.getElementById("rowAbilityScorePrereqEnd"+IDSuffix) === null){
			let endRow = createTableRow(referenceRow,"rowAbilityScorePrereqEnd"+IDSuffix,"<th colspan=2></th>");
			endRow.classList.add("section-end");

			referenceRow = createTableRow(referenceRow,"rowAbilityScorePrereqTitle"+IDSuffix,"<th colspan='2'><span id='AbilityScorePrereqTitle"+IDSuffix+"'></span> Ability Scores</th>");

			let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
			let attributeList = await request.json();
			let attributeSelection = createHTMLSelectOptions(attributeList);

			let rowContents = "<th colspan='2'><select id='AbilityScorePrereqType"+IDSuffix+"' name='AbilityScorePrereqType"+IDSuffix+"'><option value='Minimum'>Minimum</option><option value='Maximum'>Maximum</option><option value='Range'>Min-Max Range</option></select><select id='AbilityScorePrereqAttribute"+IDSuffix+"' name='AbilityScorePrereqAttribute"+IDSuffix+"'>"+attributeSelection+"</select>: <input type='number' id='AbilityScorePrereqMinimum"+IDSuffix+"' name='AbilityScorePrereqMinimum"+IDSuffix+"' min=0 value=0 style='width:25px'> - <input type='number' id='AbilityScorePrereqMaximum"+IDSuffix+"' name='AbilityScorePrereqMaximum"+IDSuffix+"' min=0 value=30 style='width:25px' disabled></th>";

			let listeners = [
				{
					elementID:"AbilityScorePrereqType"+IDSuffix,
					listener:"change",
					functionName:"toggleAbilityScorePrereqType",
					functionArgs:IDSuffix
				}
			]

			createMultiRowButtonsInput("AbilityScorePrereq"+IDSuffix,referenceRow,rowContents,"Ability Score Limit",listeners);

			referenceRow = createTableRow(document.getElementById("rowAbilityScorePrereq"+IDSuffix+"Buttons"),"rowAbilityScorePrereqCombineHow"+IDSuffix,"<th><label for='AbilityScorePrereqCombineHow"+IDSuffix+"'>Ability Scores Needed to Meet Prerequisite:</label></th><td><select id='AbilityScorePrereqCombineHow"+IDSuffix+"' name='AbilityScorePrereqCombineHow"+IDSuffix+"'><option value='All'>All of the Above</option><option value='One'>At Least One of the Above</option><option value='OtherNum'>Some Other Number Met</option><option value='Other'>Some Other Configuration</option></select><span id='AbilityScorePrereqCombineHowSpan"+IDSuffix+"'></span></td>");
			document.getElementById("AbilityScorePrereqCombineHow"+IDSuffix).addEventListener("change",function(){
				let choice = this.value;
				if(choice === "OtherNum"){
					document.getElementById("AbilityScorePrereqCombineHowSpan"+IDSuffix).innerHTML = ": <input type='number' id='AbilityScorePrereqCombineNumber"+IDSuffix+"' name='AbilityScorePrereqCombineNumber"+IDSuffix+"' value=2 min=1 class='small-number'>";
				}
				else{
					document.getElementById("AbilityScorePrereqCombineHowSpan"+IDSuffix).innerHTML = "";
				}
			});

			document.getElementById("rowAbilityScorePrereqCombineHow"+IDSuffix).setAttribute("hidden","");

			function toggleAbilityScorePrereqNumber(IDSuffix){
				let currentAmount = Number(document.getElementById("AbilityScorePrereq"+IDSuffix+"Number").value);
				if(currentAmount === 1){
					document.getElementById("AbilityScorePrereqCombineHow"+IDSuffix).value = "All";
					document.getElementById("rowAbilityScorePrereqCombineHow"+IDSuffix).setAttribute("hidden","");
				}
				else if(currentAmount === 2){
					document.getElementById("rowAbilityScorePrereqCombineHow"+IDSuffix).removeAttribute("hidden");
				}
			}

			document.getElementById("AddAbilityScorePrereq"+IDSuffix+"Button").addEventListener("click",function(){
				toggleAbilityScorePrereqNumber(IDSuffix);
			});

			document.getElementById("RemoveAbilityScorePrereq"+IDSuffix+"Button").addEventListener("click",function(){
				toggleAbilityScorePrereqNumber(IDSuffix);

				let currentNumber = Number(document.getElementById("AbilityScorePrereq"+IDSuffix+"Number").value);
				if(currentNumber <= 1){
					let combineHow = document.getElementById("AbilityScorePrereqCombineHow"+IDSuffix);
					combineHow.value = "All";
					combineHow.dispatchEvent(new Event("change"));
				}
			});
		}

		if(prereqChoice === "Inclusive"){
			document.getElementById("AbilityScorePrereqTitle"+IDSuffix).innerHTML = "Required";

			if(document.getElementById("rowAbilityScorePrereqTitle"+IDSuffix).hidden === true){
				document.getElementById("AbilityScorePrereqCombineHow"+IDSuffix).value = "All";
			}
		}
		else{
			document.getElementById("AbilityScorePrereqTitle"+IDSuffix).innerHTML = "Prohibited";

			if(document.getElementById("rowAbilityScorePrereqTitle"+IDSuffix).hidden === true){
				document.getElementById("AbilityScorePrereqCombineHow"+IDSuffix).value = "One";
			}
		}
	}
}

function toggleAbilityScorePrereqType(instanceNumber,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}
	let currentAbilityScoreTypeSelection = document.getElementById("AbilityScorePrereqType"+IDSuffix+instanceNumber).value;
	let minScoreID = "AbilityScorePrereqMinimum"+IDSuffix+instanceNumber;
	let maxScoreID = "AbilityScorePrereqMaximum"+IDSuffix+instanceNumber;

	if(currentAbilityScoreTypeSelection == "Minimum"){
		document.getElementById(minScoreID).removeAttribute('disabled');
		document.getElementById(maxScoreID).setAttribute('disabled','');
	}
	else if(currentAbilityScoreTypeSelection == "Maximum"){
		document.getElementById(minScoreID).setAttribute('disabled','');
		document.getElementById(maxScoreID).removeAttribute('disabled');
	}
	else if(currentAbilityScoreTypeSelection == "Range"){
		document.getElementById(minScoreID).removeAttribute('disabled');
		document.getElementById(maxScoreID).removeAttribute('disabled');
	}
}

function addAlignmentPrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	let referenceRow = createTableRow(insertAfter,"rowAlignmentPrereqMethod"+IDSuffix,"<th><label for='AlignmentPrereqMethod"+IDSuffix+"'>Alignment Requirements:</th><td><select name='AlignmentPrereqMethod"+IDSuffix+"' id='AlignmentPrereqMethod"+IDSuffix+"'><option value=''>None</option><option value='Inclusive'>Include Alignments</option><option value='Exclusive'>Exclude Alignments</option></select></td>");
	document.getElementById("AlignmentPrereqMethod"+IDSuffix).addEventListener("change",function(){
		createAlignmentPrereqRows(IDSuffix);
	});

	return referenceRow;
}

function createAlignmentPrereqRows(IDSuffix){
	let referenceRow = document.getElementById("rowAlignmentPrereqMethod"+IDSuffix);
	let prereqChoice = document.getElementById("AlignmentPrereqMethod"+IDSuffix).value;
	let prereqRow = document.getElementById("rowAlignmentPrereq"+IDSuffix);

	if(prereqChoice === ""){
		if(prereqRow !== null){
			prereqRow.remove();
		}
	}
	else{
		if(prereqRow === null){
			let alignmentList = [
				{Name:"LawfulGood",DisplayName:"Lawful Good"},
				{Name:"LawfulNeutral",DisplayName:"Lawful Neutral"},
				{Name:"LawfulEvil",DisplayName:"Lawful Evil"},
				{Name:"NeutralGood",DisplayName:"Neutral Good"},
				{Name:"NeutralNeutral",DisplayName:"True Neutral"},
				{Name:"NeutralEvil",DisplayName:"Neutral Evil"},
				{Name:"ChaoticGood",DisplayName:"Chaotic Good"},
				{Name:"ChaoticNeutral",DisplayName:"Chaotic Neutral"},
				{Name:"ChaoticEvil",DisplayName:"Chaotic Evil"},
				{Name:"UnalignedUnaligned",DisplayName:"Unaligned"}
			]
			let alignmentOptions = createHTMLMultiselectOptions(alignmentList,"AlignmentPrereq"+IDSuffix);
			referenceRow = createTableRow(referenceRow,"rowAlignmentPrereq"+IDSuffix,"<th><span id='AlignmentPrereqSpan"+IDSuffix+"'></span> Alignments:</th><td><div class='check-multiple' style='width:100%'>"+alignmentOptions+"</div></td>");
		}

		if(prereqChoice === "Inclusive"){
			document.getElementById("AlignmentPrereqSpan"+IDSuffix).innerHTML = "Required";
		}
		else{
			document.getElementById("AlignmentPrereqSpan"+IDSuffix).innerHTML = "Prohibited";
		}
	}
}

function addConditionPrereqRow(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	let referenceRow = createTableRow(insertAfter,"rowConditionPrereqHow"+IDSuffix,"<th><label for='ConditionPrereqHow"+IDSuffix+"'>Active Condition Requirements:</label></th><td><select name='ConditionPrereqHow"+IDSuffix+"' id='ConditionPrereqHow"+IDSuffix+"'><option value=''>None</option><option value='Inclusive'>Must Have Certain Conditions</option><option value='Exclusive'>Cannot Have Certain Conditions</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
	document.getElementById("ConditionPrereqHow"+IDSuffix).addEventListener("change",function(){
		createConditionPrereqRows(IDSuffix);
	});

	return referenceRow;
}

async function createConditionPrereqRows(IDSuffix){
	let referenceRow = document.getElementById("rowConditionPrereqHow"+IDSuffix);
	let conditionHow = document.getElementById("ConditionPrereqHow"+IDSuffix).value;

	if(conditionHow === ""){
		let endRow = document.getElementById("rowConditionPrereqEnd"+IDSuffix);
		if(endRow !== null)
		deleteInterveningElements(referenceRow,endRow.nextElementSibling);
	}
	else{
		if(document.getElementById("rowConditionPrereqEnd"+IDSuffix) === null){
			let endRow = createTableRow(referenceRow,"rowConditionPrereqEnd"+IDSuffix,"<th colspan=2></th>");
			endRow.classList.add("section-end");
		}

		let alreadyInclusiveTest = document.getElementById("rowConditionPrereqInclusive"+IDSuffix) !== null;
		let alreadyExclusiveTest = document.getElementById("rowConditionPrereqExclusive"+IDSuffix) !== null;
	
		let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
		let baseConditions = await request.json();
		baseConditions.push({Name:"NonBaseCondition",DisplayName:"Non-Base Condition"});

		if((conditionHow === "Inclusive" || conditionHow === "Mixture") && !alreadyInclusiveTest){
			let inclusiveConditionOptions = createHTMLMultiselectOptions(baseConditions,"ConditionPrereqInclusive"+IDSuffix);
			referenceRow = createTableRow(referenceRow,"rowConditionPrereqInclusive"+IDSuffix,"<th>Required Active Conditions:</th><td><div class='check-multiple' style='width:100%'>"+inclusiveConditionOptions+"</div></td>");

			document.getElementById("ConditionPrereqInclusive"+IDSuffix+"NonBaseCondition").addEventListener("change",function(){
				createConditionPrereqNonBaseRows(IDSuffix,"Inclusive");
			});

			referenceRow = createTableRow(referenceRow,"rowConditionPrereqCombineInclusive"+IDSuffix,"<th><label for='ConditionPrereqCombineInclusive"+IDSuffix+"'>Conditions Needed to Meet Requirement:</label></th><td><select id='ConditionPrereqCombineInclusive"+IDSuffix+"' name='ConditionPrereqCombineInclusive"+IDSuffix+"'><option value='All'>All of the Above</option><option value='One'>At Least One of the Above</option><option value='OtherNum'>Some Other Number Met</option><option value='Other'>Some Other Configuration</option></select><span id='ConditionPrereqCombineInclusiveSpan"+IDSuffix+"'></span></td>");

			document.getElementById("ConditionPrereqCombineInclusive"+IDSuffix).addEventListener("change",function(){
				let choice = this.value;
				if(choice === "OtherNum"){
					document.getElementById("ConditionPrereqCombineInclusiveSpan"+IDSuffix).innerHTML = ": <input type='number' id='ConditionPrereqCombineNumberInclusive"+IDSuffix+"' name='ConditionPrereqCombineNumberInclusive"+IDSuffix+"' value=2 min=1 class='small-number'>";
				}
				else{
					//TODO: Needs other configuration options (also for attributes)
					document.getElementById("ConditionPrereqCombineInclusiveSpan"+IDSuffix).innerHTML = "";
				}
			});
		}

		if((conditionHow === "Exclusive" || conditionHow === "Mixture") && !alreadyExclusiveTest){
			let thisReferenceRow = referenceRow;
			if(alreadyInclusiveTest && conditionHow === "Mixture"){
				thisReferenceRow = document.getElementById("rowConditionPrereqSetByUser"+IDSuffix).previousElementSibling;
			}
			let exclusiveConditionOptions = createHTMLMultiselectOptions(baseConditions,"ConditionPrereqExclusive"+IDSuffix);
			referenceRow = createTableRow(thisReferenceRow,"rowConditionPrereqExclusive"+IDSuffix,"<th>Prohibited Active Conditions:</th><td><div class='check-multiple' style='width:100%'>"+exclusiveConditionOptions+"</div></td>");

			document.getElementById("ConditionPrereqExclusive"+IDSuffix+"NonBaseCondition").addEventListener("change",function(){
				createConditionPrereqNonBaseRows(IDSuffix,"Exclusive");
			});

			referenceRow = createTableRow(referenceRow,"rowConditionPrereqCombineExclusive"+IDSuffix,"<th><label for='ConditionPrereqCombineExclusive"+IDSuffix+"'>Conditions Needed to Break Requirement:</label></th><td><select id='ConditionPrereqCombineExclusive"+IDSuffix+"' name='ConditionPrereqCombineExclusive"+IDSuffix+"'><option value='All'>All of the Above</option><option value='One' selected>At Least One of the Above</option><option value='OtherNum'>Some Other Number Met</option><option value='Other'>Some Other Configuration</option></select><span id='ConditionPrereqCombineExclusiveSpan"+IDSuffix+"'></span></td>");

			document.getElementById("ConditionPrereqCombineExclusive"+IDSuffix).addEventListener("change",function(){
				let choice = this.value;
				if(choice === "OtherNum"){
					document.getElementById("ConditionPrereqCombineExclusiveSpan"+IDSuffix).innerHTML = ": <input type='number' id='ConditionPrereqCombineNumberExclusive"+IDSuffix+"' name='ConditionPrereqCombineNumberExclusive"+IDSuffix+"' value=2 min=1 class='small-number'>";
				}
				else{
					//TODO: Needs other configuration options (also for attributes)
					document.getElementById("ConditionPrereqCombineExclusiveSpan"+IDSuffix).innerHTML = "";
				}
			});
		}

		if(document.getElementById("rowConditionPrereqSetByUser"+IDSuffix) === null){
			referenceRow = createTableRow(referenceRow,"rowConditionPrereqSetByUser"+IDSuffix,"<th><label for='isConditionPrereqSetByUser"+IDSuffix+"'>Condition Must Be Inflicted by User?</label></th><td><select id='isConditionPrereqSetByUser"+IDSuffix+"' name='isConditionPrereqSetByUser"+IDSuffix+"'><option value=''>Not Relevant</option><option value='1'>Required</option><option value='0'>Cannot Be</option></select></td>");
		}

		if(alreadyInclusiveTest && conditionHow === "Exclusive"){
			let endRow;
			if(alreadyExclusiveTest){
				endRow = document.getElementById("rowConditionPrereqExclusive"+IDSuffix);
			}
			else{
				endRow = document.getElementById("rowConditionPrereqSetByUser"+IDSuffix);
			}
			deleteInterveningElements(document.getElementById("rowConditionPrereqInclusive"+IDSuffix).previousElementSibling,endRow);
		}

		if(alreadyExclusiveTest && conditionHow === "Inclusive"){
			deleteInterveningElements(document.getElementById("rowConditionPrereqExclusive"+IDSuffix).previousElementSibling,document.getElementById("rowConditionPrereqSetByUser"+IDSuffix));
		}
	}
}

async function createConditionPrereqNonBaseRows(IDSuffix,InclusiveExclusive){
	let referenceRow = document.getElementById("rowConditionPrereq"+InclusiveExclusive+IDSuffix);
	let isNonBase = document.getElementById("ConditionPrereq"+InclusiveExclusive+IDSuffix+"NonBaseCondition").checked;

	if(isNonBase){
		let request = await fetch("macro:pm.a5e.GetConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
		let conditionList = await request.json();

		let conditionDisplayList = [];
		for(let condition of conditionList){
			conditionDisplayList.push(condition.DisplayName);
		}

		let rowContents = "<th style='text-align:left' colspan=2><span class='autocomplete-table'><input type='text' id='ConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+"' name='ConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+"' style='width:75%'><span id='ValidationSpanConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+"'></span></span></th>";

		createMultiRowButtonsInput("ConditionPrereqNonBase"+InclusiveExclusive+IDSuffix,referenceRow,rowContents,"Non-Base Condition");

		document.getElementById("AddConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+"Button").addEventListener("click",function(){
			let currentNumber = Number(document.getElementById("ConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+"Number").value) - 1;
			let newRowInput = document.getElementById("ConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+currentNumber);

			autocomplete(newRowInput,conditionDisplayList,conditionList);
		});

		//Manual activation is needed here because the first click event fires before autocomplete can add its listeners
		autocomplete(document.getElementById("ConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+0),conditionDisplayList,conditionList);
	}
	else if(document.getElementById("rowConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+"Buttons") !== null){
		deleteInterveningElements(referenceRow,document.getElementById("rowConditionPrereqNonBase"+InclusiveExclusive+IDSuffix+"Buttons").nextElementSibling);
	}
}

function zzzzplaceholdereasycopy(insertAfter,IDSuffix){
	if(IDSuffix === undefined){
		IDSuffix = "";
	}

	let referenceRow = createTableRow(insertAfter,"rowAllegiancePrereq"+IDSuffix,"");

	return referenceRow;
}