//Note: This depends on some functions in CreateSubeffect.js

async function createTargetingRows(tableID,startRowID,IDSuffix){
	let nextRowIndex = document.getElementById(startRowID).rowIndex;

	addTableRow(tableID,nextRowIndex,"Range"+IDSuffix,"<th><label for='RangeType"+IDSuffix+"'>Range Type:</label></th><td><select id='RangeType"+IDSuffix+"' name='RangeType"+IDSuffix+"' onchange='createRangeTable("+'"'+tableID+'","'+IDSuffix+'"'+")'><option value='Self'>Self</option><option value='SelfRanged'>Self with Range</option><option value='Touch'>Touch</option><option value='Ranged'>Ranged</option><option value='UnlimitedRange'>Unlimited Range</option></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"AoE"+IDSuffix,"<th><label for='aoeShape"+IDSuffix+"'>Area of Effect Shape:</label></th><td><select id='aoeShape"+IDSuffix+"' name='aoeShape"+IDSuffix+"' onchange='createAoETable("+'"'+tableID+'"'+',1,"'+IDSuffix+'"'+")'><option value='None'>None</option><option value='Cone'>Cone</option><option value='Cube'>Cube</option><option value='Cylinder'>Cylinder</option><option value='Half Sphere'>Half Sphere</option><option value='Line'>Line</option><option value='Panels'>Panels</option><option value='Sphere'>Sphere</option><option value='Wall'>Wall</option><option value='Choose'>Multiple Options</option></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowTargetNumber"+IDSuffix,"<th><label for='TargetNumber"+IDSuffix+"'>Maximum Number of Targets:</label></th><td><input type='number' id='TargetNumber"+IDSuffix+"' name='TargetNumber"+IDSuffix+"' value=1 min=1 style='width:25px'><input type='checkbox' id='isTargetNumberUnlimited"+IDSuffix+"' name='isTargetNumberUnlimited"+IDSuffix+"' value=1 onchange='createTargetNumberToggle("+'"'+tableID+'","'+IDSuffix+'"'+")'>Unlimited</td>");
	nextRowIndex++;

	if(checkEffectType()=="Spell"){
		let TargetNumberAHLScalingSelect = await createAHLSelect("TargetNumberAHLScaling"+IDSuffix);

		addTableRow(tableID,nextRowIndex,"rowTargetNumberAHL"+IDSuffix,"<th><label for='TargetNumberAHL"+IDSuffix+"'>Increased Target Number AHL:</label></th><td><input type='number' id='TargetNumberAHL"+IDSuffix+"' name='TargetNumberAHL"+IDSuffix+"' value=0 min=0 style='width:25px'>"+TargetNumberAHLScalingSelect+"</td>");
		nextRowIndex++;		
	}

	addTableRow(tableID,nextRowIndex,"rowMustTargetAll"+IDSuffix,"<th><label for='MustTargetAll"+IDSuffix+"'>Must Affect All Valid Targets:</label></th><td><input type='checkbox' id='MustTargetAll"+IDSuffix+"' name='MustTargetAll"+IDSuffix+"'></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowMultitargetDistance"+IDSuffix,"<th><label for='MultitargetDistance"+IDSuffix+"'>Maximum Distance Between Targets:</label></th><td><input type='number' id='MultitargetDistance"+IDSuffix+"' name='MultitargetDistance"+IDSuffix+"' value=5 min=0 style='width:25px' disabled><input type='checkbox' id='isMultitargetDistanceUnlimited"+IDSuffix+"' name='isMultitargetDistanceUnlimited"+IDSuffix+"' checked onchange='toggleFieldEnabled("+'"MultitargetDistance'+IDSuffix+'","isMultitargetDistanceUnlimited'+IDSuffix+'"'+")'>Same as Overall Range</td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowMissiles"+IDSuffix,"<th><label for='isMissiles"+IDSuffix+"'>Is it a Missile Effect?</label></th><td><input type='checkbox' id='isMissiles"+IDSuffix+"' name='isMissiles"+IDSuffix+"' onchange='createMissilesRows("+'"'+tableID+'","'+IDSuffix+'"'+")'></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowTargetCover"+IDSuffix,"<th><label for='MaxCover"+IDSuffix+"'>Most Cover Target Can Be Behind:</th><td><select name='MaxCover"+IDSuffix+"' id='MaxCover"+IDSuffix+"'><option value='None'>None</option><option value='Half'>Half</option><option value='ThreeQuarters' selected>Three-Quarters</option><option value='Full'>Full</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowIsSight"+IDSuffix,"<th><label for='isSight"+IDSuffix+"'>Requires Sight on Target:</label></th><td><input type='checkbox' id='isSight"+IDSuffix+"' name='isSight"+IDSuffix+"'></td>");
	nextRowIndex++;

	//Note: Free hand option will be moved to being a requirement for creating an object
	addTableRow(tableID,nextRowIndex,"Target"+IDSuffix,"<th><label for='TargetType"+IDSuffix+"'>Target Type:</label></th><td><select id='TargetType"+IDSuffix+"' name='TargetType"+IDSuffix+"' onchange='createTargetTable("+'"'+tableID+'","Target'+IDSuffix+'","TargetType'+IDSuffix+'","'+IDSuffix+'"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option><option value='CreatureObject'>Creature or Object</option><option value='AnyObject'>Any Object</option><option value='ObjectNotWorn'>Object Not Held or Worn</option><option value='ObjectWorn'>Object Held or Worn</option><option value='ObjectNonmagical'>Non-Magical Object</option><option value='ObjectMagical'>Magical Object</option><option value='Object'>Object (Custom Limits)</option><option value='Effect'>Effect</option><option value='Point'>Point</option></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowTargetingEnd"+IDSuffix,"");
	nextRowIndex++;
	document.getElementById("rowTargetingEnd"+IDSuffix).setAttribute("hidden","");
}

function createPriorTargetsRows(tableID,callingType,tempIDSuffix){
	let IDSuffix = "";
	if (arguments.length > 2){
		IDSuffix = tempIDSuffix;
	}

	let nextRowIndex = document.getElementById("rowUse"+callingType+"Targets"+IDSuffix).rowIndex + 1;
	clearUnusedTable(tableID,"rowUse"+callingType+"Targets"+IDSuffix,"rowTargetingEnd"+IDSuffix);

	if(document.getElementById("Use"+callingType+"Targets"+IDSuffix).checked){
		addTableRow(tableID,nextRowIndex,"row"+callingType+"TargetNumber"+IDSuffix,"<th><label for='"+callingType+"TargetNumber"+IDSuffix+"'>Number of "+callingType+" Targets Affected:</label></th><td><input type='number' id='"+callingType+"TargetNumber"+IDSuffix+"' name='"+callingType+"TargetNumber"+IDSuffix+"' value=1 style='width:25px' disabled><input type='checkbox' id='"+callingType+"TargetAll"+IDSuffix+"' name='"+callingType+"TargetAll"+IDSuffix+"' checked onchange='toggleFieldEnabled("+'"'+callingType+'TargetNumber'+IDSuffix+'","'+callingType+'TargetAll'+IDSuffix+'"'+")'> Affects All</td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"row"+callingType+"TargetLimits"+IDSuffix,"<th><label for='"+callingType+"TargetLimits"+IDSuffix+"'>Different Limits on Targets Affected:</label></th><td><input type='checkbox' id='"+callingType+"TargetLimits"+IDSuffix+"' name='"+callingType+"TargetLimits"+IDSuffix+"' onchange='createPriorTargetsNewFilter("+'"'+tableID+'","'+callingType+'","'+IDSuffix+'"'+")'></td>");
		nextRowIndex++;
	}
	else{
		addTableRow(tableID,nextRowIndex,"rowUse"+callingType+"Origin"+IDSuffix,"<th><label for='Use"+callingType+"Origin"+IDSuffix+"'>New Subeffect Originates from Old Target:</label></th><td><input type='checkbox' id='Use"+callingType+"Origin"+IDSuffix+"' name='Use"+callingType+"Origin"+IDSuffix+"' onchange='create"+callingType+"OriginRows("+'"'+tableID+'","'+IDSuffix+'"'+")'></td>");
		nextRowIndex++;

		createTargetingRows(tableID,"rowTargetingEnd"+IDSuffix,"");
	}
}

function createPriorTargetsNewFilter(tableID,callingType,tempIDSuffix){
	let IDSuffix = "";
	if (arguments.length > 2){
		IDSuffix = tempIDSuffix;
	}

	if(document.getElementById(callingType+"TargetLimits"+IDSuffix).checked){
		let nextRowIndex = document.getElementById("row"+callingType+"TargetLimits"+IDSuffix).rowIndex + 1;

		//TODO: Should make this even more generalized, with options to either show all of the targeting options or prune them based on requirements (e.g. Creature options only if prior only targeted creatures)
		addTableRow(tableID,nextRowIndex,"row"+callingType+"TargetType"+IDSuffix,"<th><label for='"+callingType+"TargetType"+IDSuffix+"'>Target Type:</label></th><td><select id='"+callingType+"TargetType"+IDSuffix+"' name='"+callingType+"TargetType"+IDSuffix+"' onchange='createTargetTable("+'"'+tableID+'","row'+callingType+'TargetType'+IDSuffix+'","'+callingType+'TargetType'+IDSuffix+'","'+IDSuffix+'"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option><option value='CreatureObject'>Creature or Object</option><option value='AnyObject'>Any Object</option><option value='ObjectNotWorn'>Object Not Held or Worn</option><option value='ObjectWorn'>Object Held or Worn</option><option value='ObjectNonmagical'>Non-Magical Object</option><option value='ObjectMagical'>Magical Object</option><option value='Object'>Object (Custom Limits)</option><option value='Effect'>Effect</option><option value='Point'>Point</option></td>");
	}
	else{
		clearUnusedTable(tableID,"row"+callingType+"TargetLimits"+IDSuffix,"rowTargetingEnd"+IDSuffix);
	}
}

async function createRangeTable(tableID,IDSuffix){
	let nextRowIndex = document.getElementById("Range"+IDSuffix).rowIndex + 1;

	if(document.getElementById("RangeType"+IDSuffix).value == "SelfRanged" || document.getElementById("RangeType"+IDSuffix).value == "Ranged"){
		if(document.getElementById("rowRangeDistance"+IDSuffix) == null){
			addTableRow(tableID,nextRowIndex,"rowRangeDistance"+IDSuffix,"<th><label for='RangeValue"+IDSuffix+"'>Range:</label></th><td><input type='number' id='RangeValue"+IDSuffix+"' name='RangeValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='RangeUnits"+IDSuffix+"' name='RangeUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>");
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let RangeScalingAHLSelect = createAHLSelect("RangeScalingAHL"+IDSuffix);
				addTableRow(tableID,nextRowIndex,"rowRangeDistanceAHL"+IDSuffix,"<th>Range Increase AHL:</th><td><input type='number' id='RangeValueAHL"+IDSuffix+"' name='RangeValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+RangeScalingAHLSelect+"</td>");
				nextRowIndex++;              
			}
		}
	}
	else if(document.getElementById("rowRangeDistance"+IDSuffix) != null){
		//Will need to change when rows are deleted here
		clearUnusedTable(tableID,"Range"+IDSuffix,"AoE"+IDSuffix);
	}
}

async function createAoETable(tableID,whichShape,IDSuffix){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("AoE"+IDSuffix).rowIndex + 1;
	let shapesArray = ["Cone","Cube","Cylinder","Half Sphere","Line","Panels","Sphere","Wall"];
	let aoeShapeSelction = document.getElementById("aoeShape"+IDSuffix).value;
	if(aoeShapeSelction == "None"){
		clearUnusedTable(tableID,"AoE"+IDSuffix,"rowTargetNumber"+IDSuffix);

		if(document.getElementById("rowLightUseAoESize"+IDSuffix) != null){
			document.getElementById("lightDistanceValue"+IDSuffix).removeAttribute("disabled","");
			table.deleteRow(document.getElementById("rowLightUseAoESize"+IDSuffix).rowIndex);
		}
	}
	else{
		if(document.getElementById("rowAoENum"+IDSuffix) == null){
			let rowAoEHTML = "<th><label for='AoENum"+IDSuffix+"'>Number of AoEs:</label></th><td><input type='number' id='AoENum"+IDSuffix+"' name='AoENum"+IDSuffix+"' min=1 value=1 style='width:25px'>";
			if(checkEffectType()=="Spell"){
				let AoENumAHLScalingSelect = await createAHLSelect("AoENumAHLScaling"+IDSuffix);

				rowAoEHTML = rowAoEHTML + " + <input type='number' id='AoENumAHL"+IDSuffix+"' name='AoENumAHL"+IDSuffix+"' min=0 value=0 style='width:25px'>"+AoENumAHLScalingSelect;
			}
			rowAoEHTML = rowAoEHTML+"</td>";
			addTableRow(tableID,nextRowIndex,"rowAoENum"+IDSuffix,rowAoEHTML);
			nextRowIndex++;
		}

		if(document.getElementById("rowLightType"+IDSuffix) != null){
			if(document.getElementById("rowLightUseAoESize"+IDSuffix) == null && document.getElementById("lightType"+IDSuffix).value != "None"){
				let UseAoESizeIndex = document.getElementById("rowLightInfo"+IDSuffix).rowIndex+1;
				addTableRow(tableID,UseAoESizeIndex,"rowLightUseAoESize"+IDSuffix,"<th><label for='isLightUseAoESize"+IDSuffix+"'>Use AoE For Size:</label></th><td><input type='checkbox' id='isLightUseAoESize"+IDSuffix+"' name='isLightUseAoESize"+IDSuffix+"' onchange='toggleFieldEnabled("+'"lightDistanceValue'+IDSuffix+'","isLightUseAoESize'+IDSuffix+'"'+")'></td>");
				nextRowIndex++;
			}
		}

		if(aoeShapeSelction == "Choose"){
			if(whichShape==1){
				let rowMultiAOESelection = table.insertRow(nextRowIndex);
				rowMultiAOESelection.id = "rowMultiAOESelection"+IDSuffix;

				let multiAOESelectionText = "";
				for(let tempShape of shapesArray){
					let tempShapeNoSpace = tempShape.split(" ").join("");
					multiAOESelectionText = multiAOESelectionText + "<label><input type='checkbox' id='is"+tempShapeNoSpace+"AOEMulti"+IDSuffix+"' name='is"+tempShapeNoSpace+"AOEMulti"+IDSuffix+"' value=1 onchange='createAoETable("+'"'+tableID+'","'+tempShape+'","'+IDSuffix+"'"+")'><span>"+tempShape+"</span></label>";
				}

				rowMultiAOESelection.innerHTML = "<th>AoE Shape Options:</th><td><div class='check-multiple' style='width:100%'>"+multiAOESelectionText+"</div></td>";
				nextRowIndex++;

				for(let tempShape of shapesArray){
					tempShape = tempShape.split(" ").join("");
					if(document.getElementById("row"+tempShape+"Dimensions"+IDSuffix) != null){
						document.getElementById("is"+tempShape+"AOEMulti"+IDSuffix).setAttribute("checked",'');
					}
				}
			}
			else{
				if(document.getElementById("is"+whichShape.split(" ").join("")+"AOEMulti"+IDSuffix).checked){
					let earlierShapesArray = shapesArray.slice(0,shapesArray.indexOf(whichShape));
					nextRowIndex = document.getElementById("rowMultiAOESelection"+IDSuffix).rowIndex + 1;
					for(let tempShape of earlierShapesArray){
						//Required for Half Sphere or any other shapes with a space
						tempShape = tempShape.split(" ").join("");
						if(document.getElementById("row"+tempShape+"Dimensions"+IDSuffix) != null){
							nextRowIndex = document.getElementById("row"+tempShape+"Dimensions"+IDSuffix).rowIndex + 2;
						}
					}                          
				}
				else{
					let removalRow = document.getElementById("row"+whichShape.split(" ").join("")+"Dimensions"+IDSuffix).rowIndex;
					table.deleteRow(removalRow);
					table.deleteRow(removalRow);
					return;
				}
			}
		}
		else{
			whichShape = document.getElementById("aoeShape"+IDSuffix).value;
			if(document.getElementById("row"+whichShape+"Dimensions"+IDSuffix) != null){
				clearUnusedTable(tableID,"AoE","row"+whichShape+"Dimensions"+IDSuffix);
				
				if(checkEffectType()=="Spell"){
					clearUnusedTable(tableID,"row"+whichShape+"DimensionsAHL"+IDSuffix,"rowAoENum");                    
				}
				else{
					clearUnusedTable(tableID,"row"+whichShape+"Dimensions"+IDSuffix,"rowAoENum"+IDSuffix);
				}

				return;
			}
			else{
				clearUnusedTable(tableID,"AoE"+IDSuffix,"rowAoENum"+IDSuffix);
			}
		}

		if(whichShape == "Cone"){
			let rowConeDimensions = table.insertRow(nextRowIndex);
			rowConeDimensions.id = "rowConeDimensions"+IDSuffix;
			rowConeDimensions.innerHTML = "<th><label for='coneDimensionValue"+IDSuffix+"'>Cone Size:</label></th><td><input type='number' id='coneDimensionValue"+IDSuffix+"' name='coneDimensionValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='coneDimensionUnits"+IDSuffix+"' name='coneDimensionUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let coneSizeAHLScalingSelect = await createAHLSelect("coneSizeAHLScaling"+IDSuffix);

				let rowConeDimensionsAHL = table.insertRow(nextRowIndex);
				rowConeDimensionsAHL.id = "rowConeDimensionsAHL"+IDSuffix;
				rowConeDimensionsAHL.innerHTML = "<th><label for='coneDimensionValueAHL"+IDSuffix+"'>Increased Cone Size AHL:</label></th><td><input type='number' id='coneDimensionValueAHL"+IDSuffix+"' name='coneDimensionValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+coneSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Cube"){
			let rowCubeDimensions = table.insertRow(nextRowIndex);
			rowCubeDimensions.id = "rowCubeDimensions"+IDSuffix;
			rowCubeDimensions.innerHTML = "<th><label for='cubeDimensionValue"+IDSuffix+"'>Cube Side Length:</label></th><td><input type='number' id='cubeDimensionValue"+IDSuffix+"' name='cubeDimensionValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='cubeDimensionUnits"+IDSuffix+"' name='cubeDimensionUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let cubeSizeAHLScalingSelect = await createAHLSelect("cubeSizeAHLScaling"+IDSuffix);

				let rowCubeDimensionsAHL = table.insertRow(nextRowIndex);
				rowCubeDimensionsAHL.id = "rowCubeDimensionsAHL"+IDSuffix;
				rowCubeDimensionsAHL.innerHTML = "<th><label for='cubeDimensionValueAHL"+IDSuffix+"'>Increased Side Length AHL:</label></th><td><input type='number' id='cubeDimensionValueAHL"+IDSuffix+"' name='cubeDimensionValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+cubeSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Cylinder"){
			let rowCylinderDimensions = table.insertRow(nextRowIndex);
			rowCylinderDimensions.id = "rowCylinderDimensions"+IDSuffix;
			rowCylinderDimensions.innerHTML = "<th><label for='cylinderRadiusValue"+IDSuffix+"'>Cylinder Radius x Height:</label></th><td><input type='number' id='cylinderRadiusValue"+IDSuffix+"' name='cylinderRadiusValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='cylinderRadiusUnits"+IDSuffix+"' name='cylinderRadiusUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='cylinderHeightValue"+IDSuffix+"' name='cylinderHeightValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='cylinderHeightUnits"+IDSuffix+"' name='cylinderHeightUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let cylinderSizeAHLScalingSelect = await createAHLSelect("cylinderSizeAHLScaling"+IDSuffix);

				let rowCylinderDimensionsAHL = table.insertRow(nextRowIndex);
				rowCylinderDimensionsAHL.id = "rowCylinderDimensionsAHL"+IDSuffix;
				rowCylinderDimensionsAHL.innerHTML = "<th><label for='cylinderRadiusValueAHL"+IDSuffix+"'>Cylinder Dimensions AHL:</label></th><td><input type='number' id='cylinderRadiusValueAHL"+IDSuffix+"' name='cylinderRadiusValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0> x <input type='number' id='cylinderHeightValueAHL"+IDSuffix+"' name='cylinderHeightValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+cylinderSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Half Sphere"){
			let rowHalfSphereDimensions = table.insertRow(nextRowIndex);
			rowHalfSphereDimensions.id = "rowHalfSphereDimensions"+IDSuffix;
			rowHalfSphereDimensions.innerHTML = "<th><label for='halfSphereDimensionValue"+IDSuffix+"'>Half Sphere Radius:</label></th><td><input type='number' id='halfSphereDimensionValue"+IDSuffix+"' name='halfSphereDimensionValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='halfSphereDimensionUnits"+IDSuffix+"' name='halfSphereDimensionUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let halfSphereSizeAHLScalingSelect = await createAHLSelect("halfSphereSizeAHLScaling"+IDSuffix);

				let rowHalfSphereDimensionsAHL = table.insertRow(nextRowIndex);
				rowHalfSphereDimensionsAHL.id = "rowHalfSphereDimensionsAHL"+IDSuffix;
				rowHalfSphereDimensionsAHL.innerHTML = "<th><label for='halfSphereDimensionValueAHL"+IDSuffix+"'>Increased Radius AHL:</label></th><td><input type='number' id='halfSphereDimensionValueAHL"+IDSuffix+"' name='halfSphereDimensionValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+halfSphereSizeAHLScalingSelect+"</td>";
				nextRowIndex++;
			}

		}
		else if(whichShape == "Line"){
			let rowLineDimensions = table.insertRow(nextRowIndex);
			rowLineDimensions.id = "rowLineDimensions"+IDSuffix;
			rowLineDimensions.innerHTML = "<th><label for='lineLengthValue"+IDSuffix+"'>Line Length x Width:</label></th><td><input type='number' id='lineLengthValue"+IDSuffix+"' name='lineLengthValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='lineLengthUnits"+IDSuffix+"' name='lineLengthUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='lineWidthValue' name='lineWidthValue' min=0 style='width:25px' value=0><select id='lineWidthUnits' name='lineWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let lineSizeAHLScalingSelect = await createAHLSelect("lineSizeAHLScaling"+IDSuffix);

				let rowLineDimensionsAHL = table.insertRow(nextRowIndex);
				rowLineDimensionsAHL.id = "rowLineDimensionsAHL"+IDSuffix;
				rowLineDimensionsAHL.innerHTML = "<th><label for='lineLengthValueAHL"+IDSuffix+"'>Increased Dimensions AHL:</label></th><td><input type='number' id='lineLengthValueAHL"+IDSuffix+"' name='lineLengthValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0> x <input type='number' id='lineWidthValueAHL"+IDSuffix+"' name='lineWidthValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+lineSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Panels"){
			let rowPanelsDimensions = table.insertRow(nextRowIndex);
			rowPanelsDimensions.id = "rowPanelsDimensions"+IDSuffix;
			rowPanelsDimensions.innerHTML = "<th><label for='panelsNumber"+IDSuffix+"'>Panel Number and Side Length:</label></th><td><input type='number' id='panelsNumber"+IDSuffix+"' name='panelsNumber"+IDSuffix+"' min=0 style='width:25px' value=10> panels, <input type='number' id='panelsDimensionValue"+IDSuffix+"' name='panelsDimensionValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='panelsDimensionUnits"+IDSuffix+"' name='panelsDimensionUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let panelsNumberAHLScalingSelect = await createAHLSelect("panelsNumberAHLScaling"+IDSuffix);

				let rowPanelsDimensionsAHL = table.insertRow(nextRowIndex);
				rowPanelsDimensionsAHL.id = "rowPanelsDimensionsAHL"+IDSuffix;
				rowPanelsDimensionsAHL.innerHTML = "<th><label for='panelsNumberAHL"+IDSuffix+"'>Increased Panels AHL:</label></th><td><input type='number' id='panelsNumberAHL"+IDSuffix+"' name='panelsNumberAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+panelsNumberAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Sphere"){
			let rowSphereDimensions = table.insertRow(nextRowIndex);
			rowSphereDimensions.id = "rowSphereDimensions"+IDSuffix;
			rowSphereDimensions.innerHTML = "<th><label for='sphereDimensionValue"+IDSuffix+"'>Sphere Radius:</label></th><td><input type='number' id='sphereDimensionValue"+IDSuffix+"' name='sphereDimensionValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='sphereDimensionUnits"+IDSuffix+"' name='sphereDimensionUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let sphereSizeAHLScalingSelect = await createAHLSelect("sphereSizeAHLScaling"+IDSuffix);

				let rowSphereDimensionsAHL = table.insertRow(nextRowIndex);
				rowSphereDimensionsAHL.id = "rowSphereDimensionsAHL"+IDSuffix;
				rowSphereDimensionsAHL.innerHTML = "<th><label for='sphereDimensionValueAHL"+IDSuffix+"'>Increased Radius AHL:</label></th><td><input type='number' id='sphereDimensionValueAHL"+IDSuffix+"' name='sphereDimensionValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+sphereSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Wall"){
			let rowWallDimensions = table.insertRow(nextRowIndex);
			rowWallDimensions.id = "rowWallDimensions"+IDSuffix;
			rowWallDimensions.innerHTML = "<th><label for='wallLengthValue"+IDSuffix+"'>Wall Length x Width x Height:</label></th><td><input type='number' id='wallLengthValue"+IDSuffix+"' name='wallLengthValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='wallLengthUnits"+IDSuffix+"' name='wallLengthUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallWidthValue"+IDSuffix+"' name='wallWidthValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='wallWidthUnits"+IDSuffix+"' name='wallWidthUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallHeightValue"+IDSuffix+"' name='wallHeightValue"+IDSuffix+"' min=0 style='width:25px' value=0><select id='wallHeightUnits"+IDSuffix+"' name='wallHeightUnits"+IDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let wallSizeAHLScalingSelect = await createAHLSelect("wallSizeAHLScaling"+IDSuffix);

				let rowWallDimensionsAHL = table.insertRow(nextRowIndex);
				rowWallDimensionsAHL.id = "rowWallDimensionsAHL"+IDSuffix;
				rowWallDimensionsAHL.innerHTML = "<th><label for='wallLengthValueAHL"+IDSuffix+"'>Increased Dimensions AHL:</label></th><td><input type='number' id='wallLengthValueAHL"+IDSuffix+"' name='wallLengthValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0> x <input type='number' id='wallWidthValueAHL"+IDSuffix+"' name='wallWidthValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0> x <input type='number' id='wallHeightValueAHL"+IDSuffix+"' name='wallHeightValueAHL"+IDSuffix+"' min=0 style='width:25px' value=0>"+wallSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
	}

	if(typeof applyUseAOELightOption === "function"){
		applyUseAOELightOption(IDSuffix);
	}
}

async function createTargetNumberToggle(tableID,IDSuffix){
	let table = document.getElementById(tableID);

	if(document.getElementById("isTargetNumberUnlimited"+IDSuffix).checked){
		if(checkEffectType()=="Spell"){
			table.deleteRow(document.getElementById("rowTargetNumberAHL"+IDSuffix).rowIndex);            
		}

		document.getElementById("TargetNumber"+IDSuffix).setAttribute("disabled","");
	}
	else{
		if(checkEffectType()=="Spell"){
			let TargetNumberAHLScalingSelect = await createAHLSelect("TargetNumberAHLScaling"+IDSuffix);

			let rowTargetNumberAHL = table.insertRow(document.getElementById("rowTargetNumber"+IDSuffix).rowIndex + 1);
			rowTargetNumberAHL.id = "rowTargetNumberAHL"+IDSuffix;
			rowTargetNumberAHL.innerHTML = "<th><label for='TargetNumberAHL"+IDSuffix+"'>Increased Target Number AHL:</label></th><td><input type='number' id='TargetNumberAHL"+IDSuffix+"' name='TargetNumberAHL"+IDSuffix+"' value=0 min=0 style='width:25px'>"+TargetNumberAHLScalingSelect+"</td>";                
		}

		document.getElementById("TargetNumber"+IDSuffix).removeAttribute("disabled","");
	}
}

async function createMissilesRows(tableID,IDSuffix){
	if(document.getElementById("isMissiles"+IDSuffix).checked){
		let nextRowIndex = document.getElementById("rowMissiles"+IDSuffix).rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowMissileNumber"+IDSuffix,"<th><label for='MissileNumber"+IDSuffix+"'>Number of Missiles:</label></th><td><input type='number' id='MissileNumber"+IDSuffix+"' name='MissileNumber"+IDSuffix+"' value=1 min=1 style='width:25px'></td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			let MissilesAHLSelect = await createAHLSelect("MissilesAHLScaling"+IDSuffix);
			addTableRow(tableID,nextRowIndex,"rowMissilesAHL"+IDSuffix,"<th><label for='MissileNumberAHL"+IDSuffix+"'>Additional Missiles At Higher Levels:</label></th><td><input type='number' id='MissileNumberAHL"+IDSuffix+"' name='MissileNumberAHL"+IDSuffix+"' value=1 min=0 style='width:25px'>"+MissilesAHLSelect+"</td>");
			nextRowIndex++;
		}

		addTableRow(tableID,nextRowIndex,"rowMissileSameDamageRoll"+IDSuffix,"<th><label for='isMissileSameDamageRoll"+IDSuffix+"'>Same Damage Roll for Each Missile?</label></th><td><select id='isMissileSameDamageRoll"+IDSuffix+"' name='isMissileSameDamageRoll"+IDSuffix+"'><option value=''>Use Default Rules</option><option value='1'>Same Damage Roll</option><option value='0'>Different Damage Rolls</option></select></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowMissiles"+IDSuffix,"rowTargetCover"+IDSuffix);
	}
}

function createTargetTable(tableID,startRowID,selectionID,tempIDSuffix,tempNextAnchorRow){
	let IDSuffix = "";
	if (arguments.length > 3){
		IDSuffix = tempIDSuffix
	}
	let currentTargetTypeSelection = document.getElementById(selectionID).value;
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;
	
	let nextAnchorRow = "rowTargetingEnd"+IDSuffix;
	if (arguments.length > 4){
		nextAnchorRow = tempNextAnchorRow + IDSuffix;
	}
	clearUnusedTable(tableID,startRowID,nextAnchorRow);

	if(currentTargetTypeSelection == "Creature"){
		createCreatureTargetTable(tableID,startRowID,selectionID,IDSuffix,nextAnchorRow);
	}
	else if(currentTargetTypeSelection == "Object"){
		createObjectTargetTable(tableID,startRowID,selectionID,IDSuffix,nextAnchorRow);
	}
	else if(currentTargetTypeSelection == "CreatureObject"){
		addTableRow(tableID,nextRowIndex,"rowIsolatedCreatureTargetOptions"+IDSuffix,"<th><label for='CreatureTargetType"+IDSuffix+"'>Creature Targeting Limits:</label></th><td><select id='CreatureTargetType"+IDSuffix+"' name='CreatureTargetType"+IDSuffix+"' onchange='createTargetTable("+'"'+tableID+'","rowIsolatedCreatureTargetOptions'+IDSuffix+'","CreatureTargetType'+IDSuffix+'","'+IDSuffix+'","rowIsolatedObjectTargetOptions"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option></selected></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsolatedObjectTargetOptions"+IDSuffix,"<th><label for='ObjectTargetLimits"+IDSuffix+"'>Object Targeting Limits:</label></th><td><select id='ObjectTargetLimits"+IDSuffix+"' name='ObjectTargetLimits"+IDSuffix+"' onchange='createTargetTable("+'"'+tableID+'","rowIsolatedObjectTargetOptions'+IDSuffix+'","ObjectTargetLimits'+IDSuffix+'","'+IDSuffix+'","'+nextAnchorRow+'"'+")'><option value='AnyObject'>Any Object</option><option value='ObjectNotWorn' selected>Object Not Held or Worn</option><option value='ObjectWorn'>Object Held or Worn</option><option value='Object'>Object (Custom Limits)</option></selected></td>");
		nextRowIndex++;
	}
	else if(currentTargetTypeSelection == "Effect"){

	}
	else if(currentTargetTypeSelection == "Point"){
		addTableRow(tableID,nextRowIndex,"rowPointOnGround"+IDSuffix,"<th><label for='pointOnGround"+IDSuffix+"'>Point Must Be on the Ground:</label></th><td><input type='checkbox' id='pointOnGround"+IDSuffix+"' name='pointOnGround"+IDSuffix+"'></td>");
		nextRowIndex++;

		let secondaryTargetOptions = document.getElementById("TargetType"+IDSuffix).innerHTML;
		secondaryTargetOptions = "<option value='None'>None</option>" + secondaryTargetOptions;

		addTableRow(tableID,nextRowIndex,"rowSecondaryTarget"+IDSuffix,"<th><label for='secondaryTargetType"+IDSuffix+"'>Secondary Target Type:</label></th><td><select id='secondaryTargetType"+IDSuffix+"' name='secondaryTargetType"+IDSuffix+"' onchange='createTargetTable("+'"'+tableID+'","rowSecondaryTarget'+IDSuffix+'","secondaryTargetType'+IDSuffix+'","'+IDSuffix+'"'+")'></select></td>");
		nextRowIndex++;
		document.getElementById("secondaryTargetType"+IDSuffix).innerHTML = secondaryTargetOptions;
	
		//removes Point option
		let secondaryTargetSelection = document.getElementById("secondaryTargetType"+IDSuffix);
		secondaryTargetSelection.remove(document.getElementById("secondaryTargetType"+IDSuffix).options.length - 1);
	}
}

async function createCreatureTargetTable(tableID,startRowID,selectionID,IDSuffix,tempNextAnchorRow){
	let IDSuffixText = "";
	if(arguments.length > 3){
		IDSuffixText = IDSuffix;
	}
	let table = document.getElementById(tableID);
	let currentTargetTypeSelection = document.getElementById(selectionID).value;
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;
	
	let nextAnchorRow = "rowTargetingEnd"+IDSuffix;
	if (arguments.length > 4){
		nextAnchorRow = tempNextAnchorRow;
	}

	let rowAllegiance = table.insertRow(nextRowIndex);
	rowAllegiance.id = "rowAllegiance"+IDSuffixText;
	rowAllegiance.innerHTML = "<th><label for='targetAllegiance"+IDSuffixText+"'>Allegiance of Target:</label></th><td><select id='targetAllegiance"+IDSuffixText+"' name='targetAllegiance"+IDSuffixText+"'><option value='All'>Anyone</option><option value='Self'>Self Only</option><option value='Allies'>Allies</option><option value='AlliesNonself'>Allies Other Than Self</option><option value='NotSelf'>Anyone Other Than Self</option><option value='Enemies'>Enemies</option><option value='Nonhostile'>Nonhostile Creatures</option><option value='NonhostileNotself'>Nonhostile Creatures, Not Self</option></select></td>";
	nextRowIndex++;

	//Previously considered: function that disables/enables filtering options when 'Self' is the only viable target. Will not do because defaults are not limiting and it would allow for creation of spells only usable by certain creature types maybe? But also because nah.

	let rowCreatureTypes = table.insertRow(nextRowIndex);
	rowCreatureTypes.id = "rowCreatureTypes"+IDSuffixText;
	rowCreatureTypes.innerHTML = "<th><label for='targetCreatureTypes"+IDSuffixText+"'>Valid Creature Types:</label></th><td><select id='targetCreatureTypes"+IDSuffixText+"' name='targetCreatureTypes"+IDSuffixText+"' onchange='createCreatureTargetTypes("+'"'+tableID+'","'+IDSuffixText+'"'+")'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>";
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowTargetCreatureSizes"+IDSuffixText,"<th><label for='targetCreatureSizes"+IDSuffixText+"'>Valid Creature Sizes:</label></th><td><select id='targetCreatureSizes"+IDSuffixText+"' name='targetCreatureSizes"+IDSuffixText+"' onchange='createCreatureTargetSizes("+'"'+tableID+'","'+IDSuffixText+'"'+")'><option value='All'>All Sizes</option><option value='Inclusive'>Must Be Specific Size(s)</option><option value='Exclusive'>Cannot Be Specific Size(s)</option></select></td>");
	nextRowIndex++;

	let rowTargetSenses = table.insertRow(nextRowIndex);
	rowTargetSenses.id = "rowTargetSenses"+IDSuffixText;
	rowTargetSenses.innerHTML = "<th><label for='targetCanSee"+IDSuffixText+"'>Senses Required by Target:</th><td><input type='checkbox' name='targetCanSee"+IDSuffixText+"' id='targetCanSee"+IDSuffixText+"'><label for='targetCanSee"+IDSuffixText+"'>Target Must See Caster</label><br><input type='checkbox' name='targetCanHear"+IDSuffixText+"' id='targetCanHear"+IDSuffixText+"'><label for='targetCanHear"+IDSuffixText+"'>Target Must Hear Caster</label><br><input type='checkbox' name='targetCanUnderstand"+IDSuffixText+"' id='targetCanUnderstand"+IDSuffixText+"'><label for='targetCanUnderstand"+IDSuffixText+"'>Target Must Understand Caster</label></td>";
	nextRowIndex++;

	addTableRow(table.id,nextRowIndex,"rowTargetCreatureHP"+IDSuffixText,"<th><label for='targetCreatureHPType"+IDSuffixText+"'>Health Requirements on Target:</label></th><td><select id='targetCreatureHPType"+IDSuffixText+"' name='targetCreatureHPType"+IDSuffixText+"' onchange='createTargetHPTable("+'"'+IDSuffixText+'"'+")'><option value=''>No Requirement</option><option value='AtMaximumHP'>At Maximum HP</option><option value='Damaged'>Below Maximum HP</option><option value='OverHalfHP'>Over Half HP</option><option value='BelowHalfHP'>Below Half HP</option><option value='NoHP'>No HP Remaining</option><option value='HasHP'>Has at Least 1 HP</option><option value='Comparison'>Other Comparison</option></select></td>");
	nextRowIndex++;

	let rowTargetCondition = table.insertRow(nextRowIndex);
	rowTargetCondition.id = "rowTargetCondition"+IDSuffixText;
	rowTargetCondition.innerHTML = "<th><label for='isTargetCondition"+IDSuffixText+"'>Condition Requirements on Target:</th><td><select name='isTargetCondition"+IDSuffixText+"' id='isTargetCondition"+IDSuffixText+"' onchange='createTargetConditionTable("+'"'+tableID+'","'+IDSuffixText+'"'+")'><option value='None'>None</option><option value='Inclusive'>Must Have Certain Conditions</option><option value='Exclusive'>Cannot Have Certain Conditions</option><option value='Mixture'>Mixture of Both Above</option></select></td>";
	nextRowIndex++;
	
	let rowTargetAbilityScore = table.insertRow(nextRowIndex);
	rowTargetAbilityScore.id = "rowTargetAbilityScore"+IDSuffixText;
	rowTargetAbilityScore.innerHTML = "<th><label for='isAbilityScore"+IDSuffixText+"'>Limit Targeting By Target Ability Scores:</th><td><input type='checkbox' name='isAbilityScore"+IDSuffixText+"' id='isAbilityScore"+IDSuffixText+"' onchange='createTargetAbilityScoreTable("+'"'+tableID+'","'+IDSuffixText+'"'+")'></td>";
	nextRowIndex++;
	
	let rowTargetAlignment = table.insertRow(nextRowIndex);
	rowTargetAlignment.id = "rowTargetAlignment"+IDSuffixText;
	rowTargetAlignment.innerHTML = "<th><label for='isAlignment"+IDSuffixText+"'>Limit Targeting By Alignment:</th><td><input type='checkbox' name='isAlignment"+IDSuffixText+"' id='isAlignment"+IDSuffixText+"' onchange='createTargetAlignmentTable("+'"'+tableID+'","'+IDSuffixText+'","'+nextAnchorRow+'"'+")'></td>";
	nextRowIndex++;
}

async function createCreatureTargetTypes(tableID,IDSuffix){
	let table = document.getElementById(tableID);

	let currentTargetCreatureTypeSelection = document.getElementById("targetCreatureTypes"+IDSuffix).value;
	let nextRowIndex = document.getElementById("rowCreatureTypes"+IDSuffix).rowIndex+1;

	if(currentTargetCreatureTypeSelection == "All"){
		clearUnusedTable(tableID,"rowCreatureTypes"+IDSuffix,"rowTargetCreatureSizes"+IDSuffix);
	}
	else{
		let request = await fetch("macro:pm.GetCreatureTypes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let allCreatureTypes = await request.json();

		let creatureTypeIncludeOptions = "";
		let creatureTypeExcludeOptions = "";
		for(let tempType of allCreatureTypes){
			creatureTypeIncludeOptions = creatureTypeIncludeOptions + "<label><input type='checkbox' id='CreatureTypeTargetInclusive"+tempType.Name+IDSuffix+"' name='CreatureTypeTargetInclusive"+tempType.Name+IDSuffix+"' value=1><span>"+tempType.DisplayName+"</span></label>";

			creatureTypeExcludeOptions = creatureTypeExcludeOptions + "<label><input type='checkbox' id='CreatureTypeTargetExclusive"+tempType.Name+IDSuffix+"' name='CreatureTypeTargetExclusive"+tempType.Name+IDSuffix+"' value=1><span>"+tempType.DisplayName+"</span></label>";
		}

		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveCreatureTypes"+IDSuffix) != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveCreatureTypes"+IDSuffix) != null);

		if(currentTargetCreatureTypeSelection == "Inclusive" || currentTargetCreatureTypeSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				let rowInclusiveCreatureTypes = table.insertRow(nextRowIndex);
				rowInclusiveCreatureTypes.id = "rowInclusiveCreatureTypes"+IDSuffix;
				rowInclusiveCreatureTypes.innerHTML = "<th>Required Creature Types:</th><td><div class='check-multiple' style='width:100%'>"+creatureTypeIncludeOptions+"</div></td>";
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentTargetCreatureTypeSelection == "Inclusive"){
				clearUnusedTable(tableID,"rowInclusiveCreatureTypes"+IDSuffix,"rowTargetCreatureSizes"+IDSuffix);
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentTargetCreatureTypeSelection == "Exclusive" || currentTargetCreatureTypeSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				let rowExclusiveCreatureTypes = table.insertRow(nextRowIndex);
				rowExclusiveCreatureTypes.id = "rowExclusiveCreatureTypes"+IDSuffix;
				rowExclusiveCreatureTypes.innerHTML = "<th>Disallowed Creature Types:</th><td><div class='check-multiple' style='width:100%'>"+creatureTypeExcludeOptions+"</div></td>";
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentTargetCreatureTypeSelection == "Exclusive"){
				clearUnusedTable(tableID,"rowCreatureTypes"+IDSuffix,"rowExclusiveCreatureTypes"+IDSuffix);
			}
		}
	}
}

function createCreatureTargetSizes(tableID,IDSuffix){
	clearUnusedTable(tableID,"rowTargetCreatureSizes"+IDSuffix,"rowTargetSenses"+IDSuffix);
	let targetSizeSelection = document.getElementById("targetCreatureSizes"+IDSuffix).value;
	let nextRowIndex = document.getElementById("rowTargetCreatureSizes"+IDSuffix).rowIndex + 1;

	if(targetSizeSelection != "All"){
		let allSizes = ["Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"];
		let sizeOptions = "";
		for (let size of allSizes){
			sizeOptions = sizeOptions + "<label><input type='checkbox' id='targetCreatureSizes"+size+IDSuffix+"' name='targetCreatureSizes"+size+IDSuffix+"'><span>"+size+"</span></label>";
		}

		let sizeHeader;
		if(targetSizeSelection == "Inclusive"){
			sizeHeader = "Valid Sizes";
		}
		else{
			sizeHeader = "Invalid Sizes";
		}

		addTableRow(tableID,nextRowIndex,"rowTargetCreatureSizes"+targetSizeSelection+IDSuffix,"<th>"+sizeHeader+"</th><td><div class='check-multiple' style='width:100%'>"+sizeOptions+"</div></td>");
		nextRowIndex++;
	}
}

function createTargetHPTable(IDSuffix){
	let tableID = document.getElementById("rowTargetCreatureHP"+IDSuffix).closest("table").id;

	let HPRequirementChoice = document.getElementById("targetCreatureHPType"+IDSuffix).value;
	if(HPRequirementChoice != "Comparison"){
		let endRowID;
		if(document.getElementById("rowTargetCreatureHPComparison"+IDSuffix) == null){
			endRowID = document.getElementById("rowTargetCreatureHP"+IDSuffix).nextElementSibling.id;
		}
		else{
			endRowID = document.getElementById("rowTargetCreatureHPComparison"+IDSuffix).nextElementSibling.id;
		}

		clearUnusedTable(tableID,"rowTargetCreatureHP"+IDSuffix,endRowID);
	}
	else{
		let nextRowIndex = document.getElementById("rowTargetCreatureHP"+IDSuffix).rowIndex + 1;
		addTableRow(tableID,nextRowIndex,"rowTargetCreatureHPComparison"+IDSuffix,"<th><label for='targetCreatureHPComparitor"+IDSuffix+"'>HP Must Be:</label></th><td><select id='targetCreatureHPComparitor"+IDSuffix+"' name='targetCreatureHPComparitor"+IDSuffix+"'><option value='LessEqual'><=</option><option value='Less'><</option><option value='Equal'>=</option><option value='Greater'>></option><option value='GreaterEqual'>>=</option></select><select id='targetCreatureHPTargetType"+IDSuffix+"' name='targetCreatureHPTargetType"+IDSuffix+"' onchange='toggleTargetHPTargetType("+'"'+IDSuffix+'"'+")'><option value='Value'>A Fixed Value</option><option value='Token'>Another Token</option></select>: <span id='targetCreatureHPTargetBoundary"+IDSuffix+"'><input type='number' id='targetCreatureHPTarget"+IDSuffix+"' name='targetCreatureHPTarget"+IDSuffix+"' style='width:30px' value=100></span></td>");
	}
}

function toggleTargetHPTargetType(IDSuffix){
	let targetType = document.getElementById("targetCreatureHPTargetType"+IDSuffix).value;

	if(targetType == "Value"){
		document.getElementById("targetCreatureHPTargetBoundary"+IDSuffix).innerHTML = "<input type='number' id='targetCreatureHPTarget"+IDSuffix+"' name='targetCreatureHPTarget"+IDSuffix+"' width='30px' value=100>";
	}
	else if(targetType == "Token"){
		document.getElementById("targetCreatureHPTargetBoundary"+IDSuffix).innerHTML = "<select id='targetCreatureHPTarget"+IDSuffix+"' name='targetCreatureHPTarget"+IDSuffix+"'><option value='User'>User of Feature</option><option value='Targets'>Other Targets</option><option value=''>Other Token</option></select>";
	}
}

async function createTargetConditionTable(tableID,IDSuffix){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowTargetCondition"+IDSuffix).rowIndex+1;
	let conditionChoice = document.getElementById("isTargetCondition"+IDSuffix).value;

	if(conditionChoice == "None"){
		clearUnusedTable(tableID,"rowTargetCondition"+IDSuffix,"rowTargetAbilityScore"+IDSuffix);
	}
	else{
		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveConditions"+IDSuffix) != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveConditions"+IDSuffix) != null);

		if(conditionChoice == "Inclusive" || conditionChoice == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
				nextRowIndex++;
			}
			else{
				let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
				let baseConditions = await request.json();
				let conditionOptions = createHTMLMultiselectOptions(baseConditions,"InclusiveConditions"+IDSuffix);

				let rowInclusiveConditions = table.insertRow(nextRowIndex);
				rowInclusiveConditions.id = "rowInclusiveConditions"+IDSuffix;
				rowInclusiveConditions.innerHTML = "<th>Required Conditions:</th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
				nextRowIndex++;
				
				let rowInclusiveSetByCaster = table.insertRow(nextRowIndex);
				rowInclusiveSetByCaster.id = "rowInclusiveSetByCaster"+IDSuffix;
				rowInclusiveSetByCaster.innerHTML = "<th><label for='inclusiveSetBy"+IDSuffix+"'>Must Be Inflicted by User?</label></th><td><input type='checkbox' id='inclusiveSetBy"+IDSuffix+"' name='inclusiveSetBy"+IDSuffix+"' value=1></td>";
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && conditionChoice == "Inclusive"){
				clearUnusedTable(tableID,"rowInclusiveSetByCaster"+IDSuffix,"rowTargetAbilityScore"+IDSuffix);
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
			nextRowIndex++;
		}
		
		if(conditionChoice == "Exclusive" || conditionChoice == "Mixture"){
			if(!alreadyExclusiveTest){
				let request = await fetch("macro:pm.a5e.GetBaseConditions@lib:pm.a5e.Core", {method: "POST", body: ""});
				let baseConditions = await request.json();
				let conditionOptions = createHTMLMultiselectOptions(baseConditions,"ExclusiveConditions"+IDSuffix);

				let rowExclusiveConditions = table.insertRow(nextRowIndex);
				rowExclusiveConditions.id = "rowExclusiveConditions"+IDSuffix;
				rowExclusiveConditions.innerHTML = "<th>Disallowed Conditions:</th><td><div class='check-multiple' style='width:100%'>"+conditionOptions+"</div></td>";
				nextRowIndex++;
				
				let rowExclusiveSetByCaster = table.insertRow(nextRowIndex);
				rowExclusiveSetByCaster.id = "rowExclusiveSetByCaster"+IDSuffix;
				rowExclusiveSetByCaster.innerHTML = "<th><label for='exclusiveSetBy'>Must Be Inflicted by Caster?</label></th><td><input type='checkbox' id='exclusiveSetBy"+IDSuffix+"' name='exclusiveSetBy"+IDSuffix+"' value=1></td>";
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && conditionChoice == "Exclusive"){
				clearUnusedTable(tableID,"rowTargetCondition"+IDSuffix,"rowExclusiveConditions"+IDSuffix);
			}
		}
	}
}

async function createTargetAbilityScoreTable(tableID,IDSuffix){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowTargetAbilityScore"+IDSuffix).rowIndex + 1;

	if(document.getElementById("isAbilityScore"+IDSuffix).checked){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await request.json();

		for(let tempAttribute of attributeList){
			let abilityScoreName = tempAttribute.Name;
			let abilityScoreDisplayName = tempAttribute.DisplayName;

			let abilityScoreRow = table.insertRow(nextRowIndex);
			abilityScoreRow.id = "rowAttribute"+abilityScoreName+"Limits"+IDSuffix;
			abilityScoreRow.innerHTML = "<th><label for='is"+abilityScoreName+"Limit"+IDSuffix+"'>"+abilityScoreDisplayName+":</label></th><td><select id='is"+abilityScoreName+"Limit"+IDSuffix+"' name='is"+abilityScoreName+"Limit"+IDSuffix+"' onchange='enableAbilityScoreLimits("+'"'+abilityScoreName+'","'+IDSuffix+'"'+")'><option value='No'>No Limits</option><option value='Minimum'>Minimum Score</option><option value='Maximum'>Maximum Score</option><option value='Range'>Min-Max Range</option></select> <input type='number' id='min"+abilityScoreName+""+IDSuffix+"' name='min"+abilityScoreName+""+IDSuffix+"' min=0 value=0 style='width:25px' disabled> - <input type='number' id='max"+abilityScoreName+""+IDSuffix+"' name='max"+abilityScoreName+""+IDSuffix+"' min=0 value=30 style='width:25px' disabled></td>";
			nextRowIndex++;
		}
	}
	else{
		clearUnusedTable(tableID,"rowTargetAbilityScore"+IDSuffix,"rowTargetAlignment"+IDSuffix);
	}
	
}

async function enableAbilityScoreLimits(abilityScoreName,tempIDSuffix){
	let IDSuffix = "";
	if(arguments.length > 1){
		IDSuffix = tempIDSuffix;
	}
	let currentAbilityScoreSelection = document.getElementById("is"+abilityScoreName+"Limit"+IDSuffix).value;
	let minScoreID = "min"+abilityScoreName+IDSuffix;
	let maxScoreID = "max"+abilityScoreName+IDSuffix;


	if(currentAbilityScoreSelection == "No"){
		document.getElementById(minScoreID).setAttribute('disabled','');
		document.getElementById(maxScoreID).setAttribute('disabled','');
	}
	else if(currentAbilityScoreSelection == "Minimum"){
		document.getElementById(minScoreID).removeAttribute('disabled','');
		document.getElementById(maxScoreID).setAttribute('disabled','');
	}
	else if(currentAbilityScoreSelection == "Maximum"){
		document.getElementById(minScoreID).setAttribute('disabled','');
		document.getElementById(maxScoreID).removeAttribute('disabled','');
	}
	else if(currentAbilityScoreSelection == "Range"){
		document.getElementById(minScoreID).removeAttribute('disabled','');
		document.getElementById(maxScoreID).removeAttribute('disabled','');
	}
}

async function createTargetAlignmentTable(tableID,IDSuffix,nextAnchorRow){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowTargetAlignment"+IDSuffix).rowIndex;

	if(document.getElementById("isAlignment"+IDSuffix).checked){
		let rowAlignmentsGood = table.insertRow(nextRowIndex+1);
		rowAlignmentsGood.id = "rowAlignmentsGood"+IDSuffix;
		rowAlignmentsGood.innerHTML = "<td><input type='checkbox' id='alignmentLawfulGood"+IDSuffix+"' name='alignmentLawfulGood"+IDSuffix+"'><label for='alignmentLawfulGood"+IDSuffix+"'>Lawful Good</label></td><td><input type='checkbox' id='alignmentNeutralGood"+IDSuffix+"' name='alignmentNeutralGood"+IDSuffix+"'><label for='alignmentNeutralGood"+IDSuffix+"'>Neutral Good</label></td><td><input type='checkbox' id='alignmentChaoticGood"+IDSuffix+"' name='alignmentChaoticGood"+IDSuffix+"'><label for='alignmentChaoticGood"+IDSuffix+"'>Chaotic Good</label></td>";

		let rowAlignmentsNeutral = table.insertRow(nextRowIndex+2);
		rowAlignmentsNeutral.id = "rowAlignmentsNeutral"+IDSuffix+"";
		rowAlignmentsNeutral.innerHTML = "<td><input type='checkbox' id='alignmentLawfulNeutral"+IDSuffix+"' name='alignmentLawfulNeutral"+IDSuffix+"'><label for='alignmentLawfulNeutral"+IDSuffix+"'>Lawful Neutral</label></td><td><input type='checkbox' id='alignmentNeutralNeutral"+IDSuffix+"' name='alignmentNeutralNeutral"+IDSuffix+"'><label for='alignmentNeutralNeutral"+IDSuffix+"'>True Neutral</label></td><td><input type='checkbox' id='alignmentChaoticNeutral"+IDSuffix+"' name='alignmentChaoticNeutral"+IDSuffix+"'><label for='alignmentChaoticNeutral"+IDSuffix+"'>Chaotic Neutral</label></td>";

		let rowAlignmentsEvil = table.insertRow(nextRowIndex+3);
		rowAlignmentsEvil.id = "rowAlignmentsEvil"+IDSuffix+"";
		rowAlignmentsEvil.innerHTML = "<td><input type='checkbox' id='alignmentLawfulEvil"+IDSuffix+"' name='alignmentLawfulEvil"+IDSuffix+"'><label for='alignmentLawfulEvil"+IDSuffix+"'>Lawful Evil</label></td><td><input type='checkbox' id='alignmentNeutralEvil"+IDSuffix+"' name='alignmentNeutralEvil"+IDSuffix+"'><label for='alignmentNeutralEvil"+IDSuffix+"'>Neutral Evil</label></td><td><input type='checkbox' id='alignmentChaoticEvil"+IDSuffix+"' name='alignmentChaoticEvil"+IDSuffix+"'><label for='alignmentChaoticEvil"+IDSuffix+"'>Chaotic Evil</label></td>";

		let rowAlignmentsOther = table.insertRow(nextRowIndex+4);
		rowAlignmentsEvil.id = "rowAlignmentsOther"+IDSuffix+"";
		rowAlignmentsOther.innerHTML = "<td text-align='center' colspan='3'><input type='checkbox' id='alignmentUnaligned"+IDSuffix+"' name='alignmentUnaligned"+IDSuffix+"'><label for='alignmentUnaligned"+IDSuffix+"'>Unaligned</label></td>";
	}
	else{
		clearUnusedTable(tableID,"rowTargetAlignment"+IDSuffix,nextAnchorRow);
	}
}

async function createObjectTargetTable(tableID,startRowID,selectionID,IDSuffix){
	let currentTargetTypeSelection = document.getElementById(selectionID).value;
	
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;
	let optionLimits = "<option value=''>Not Relevant</option><option value='Inclusive'>Required</option><option value='Exclusive'>Invalid</option>";

	addTableRow(tableID,nextRowIndex,"rowObjectTargetWornCarried"+IDSuffix,"<th><label for='ObjectTargetWornCarried"+IDSuffix+"'>Object is Worn or Carried:</label></th><td><select id='ObjectTargetWornCarried"+IDSuffix+"' name='ObjectTargetWornCarried"+IDSuffix+"' onchange='createHeldObjectCreatureLimitRows("+'"'+tableID+'","'+IDSuffix+'"'+")'><option value='NotWorn'>Cannot Be Worn</option><option value='Worn'>Must be Worn</option><option value=''>Not Relevant</option></select></td>");
	nextRowIndex++;

	//TODO: Need a way to both do this and object subtype conveniently
	addTableRow(tableID,nextRowIndex,"rowObjectTargetType"+IDSuffix,"<th><label for='ObjectTargetType"+IDSuffix+"'>Limit by Object Type:</label></th><td><select id='ObjectTargetType"+IDSuffix+"' name='ObjectTargetType"+IDSuffix+"' onchange='createObjectTargetTypeRows("+'"'+tableID+'","'+IDSuffix+'"'+")'><option value='All'>All Types</option><option value='Inclusive'>Must Be Type(s)</option><option value='Exclusive'>Cannot Be Type(s)</option><option value='Mixture'>Mixture of Both</option></select><input type='checkbox' id='' name='' onchange=''>Use Subtypes?</td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetMagical"+IDSuffix,"<th><label for='ObjectTargetMagical"+IDSuffix+"'>Object is Magical:</label></th><td><select id='ObjectTargetMagical"+IDSuffix+"' name='ObjectTargetMagical"+IDSuffix+"'>"+optionLimits+"</select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetSize"+IDSuffix,"<th><label for='ObjectTargetSizeType"+IDSuffix+"'>Object Size Limits:</label></th><td><select id='ObjectTargetSizeType"+IDSuffix+"' name='ObjectTargetSizeType"+IDSuffix+"'><option value=''>Not Relevant</option><option value='Maximum'>Maximum</option><option value='Minimum'>Minimum</option></select><select id='ObjectTargetSize"+IDSuffix+"' name='ObjectTargetSize"+IDSuffix+"'><option value='Diminutive'>Diminutive</option><option value='Tiny'>Tiny</option><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option><option value='Huge'>Huge</option><option value='Gargantuan'>Gargantuan</option><option value='Colossal'>Colossal</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetWeight"+IDSuffix,"<th><label for='ObjectTargetWeightType"+IDSuffix+"'>Object Weight Limits:</label></th><td><select id='ObjectTargetWeightType"+IDSuffix+"' name='ObjectTargetWeightType"+IDSuffix+"'><option value=''>Not Relevant</option><option value='Maximum'>Maximum</option><option value='Minimum'>Minimum</option></select><input type='number' id='ObjectTargetWeight"+IDSuffix+"' name='ObjectTargetWeight"+IDSuffix+"' value=0 min=0 style='width:30px'></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetTags"+IDSuffix,"<th><label for='ObjectTargetTags"+IDSuffix+"'>Limit by Object Tags:</label></th><td><select id='ObjectTargetTags"+IDSuffix+"' name='ObjectTargetTags"+IDSuffix+"' onchange='createObjectTargetTagRows("+'"'+tableID+'","'+IDSuffix+'"'+")'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetFlammable"+IDSuffix,"<th><label for='ObjectTargetFlammable"+IDSuffix+"'>Object is Flammable:</label></th><td><select id='ObjectTargetFlammable"+IDSuffix+"' name='ObjectTargetFlammable"+IDSuffix+"'>"+optionLimits+"</select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetMagnetic"+IDSuffix,"<th><label for='ObjectTargetMagnetic"+IDSuffix+"'>Object is Magnetic:</label></th><td><select id='ObjectTargetMagnetic"+IDSuffix+"' name='ObjectTargetMagnetic"+IDSuffix+"'>"+optionLimits+"</select></td>");
	nextRowIndex++;
}

function createHeldObjectCreatureLimitRows(tableID,IDSuffix){
	let HeldSelection = document.getElementById("ObjectTargetWornCarried"+IDSuffix).value;

	if(HeldSelection == "NotWorn"){
		clearUnusedTable(tableID,"rowObjectTargetWornCarried"+IDSuffix,"rowObjectTargetType"+IDSuffix);
	}
	else if(document.getElementById("rowHoldingCreatureLimits"+IDSuffix) == null && document.getElementById("rowIsUseCreatureTargetingLimits"+IDSuffix) == null){
		let nextRowIndex = document.getElementById("rowObjectTargetWornCarried"+IDSuffix) + 1;
		let TargetTypeCreatureValues = ["AnyCreature","AnyOtherCreature","AlliedCreature","SelfOnly","EnemyCreature","HumanoidCreature","Creature","CreatureObject"];

		//Checking for any creature limits from primary, secondary, or CreatureObject targeting methods
		let NoCreatureLimits = document.getElementById("CreatureTargetType"+IDSuffix) == null;
		if(document.getElementById("secondaryTargetType"+IDSuffix) != null && NoCreatureLimits){
			NoCreatureLimits = !TargetTypeCreatureValues.includes(document.getElementById("secondaryTargetType"+IDSuffix).value);
		}
		if(NoCreatureLimits){
			NoCreatureLimits = !TargetTypeCreatureValues.includes(document.getElementById("TargetType"+IDSuffix).value);
		}

		if(NoCreatureLimits){
			createHoldingCreatureLimitRows(tableID,"rowObjectTargetWornCarried"+IDSuffix);
		}
		else{
			addTableRow(tableID,nextRowIndex,"rowIsUseCreatureTargetingLimits"+IDSuffix,"<th><label for='isUseCreatureTargetingLimits"+IDSuffix+"'>Same Creature Limits as Previous Entry:</label></th><td><input type='checkbox' id='isUseCreatureTargetingLimits"+IDSuffix+"' name='isUseCreatureTargetingLimits"+IDSuffix+"' onchange='createHoldingCreatureLimitRows("+'"'+tableID+'","rowIsUseCreatureTargetingLimits","'+IDSuffix+'"'+")' checked></td>");
			nextRowIndex++;
		}
	}
}

function createHoldingCreatureLimitRows(tableID,startRowID,IDSuffix){
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;
	let createRowsTest;

	if(document.getElementById("isUseCreatureTargetingLimits"+IDSuffix) == null){
		createRowsTest = true;
	}
	else{
		createRowsTest = document.getElementById("isUseCreatureTargetingLimits"+IDSuffix).checked;
	}

	if(createRowsTest){
		addTableRow(tableID,nextRowIndex,"rowHoldingCreatureLimits"+IDSuffix,"<th><label for='HoldingCreatureLimits"+IDSuffix+"'>Holding Creature Targeting Limits:</label></th><td><select id='HoldingCreatureLimits"+IDSuffix+"' name='HoldingCreatureLimits"+IDSuffix+"' onchange='createTargetTable("+'"'+tableID+'","rowHoldingCreatureLimits","HoldingCreatureLimits","HoldingObject","rowObjectTargetType","'+IDSuffix+'"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option></selected></td>");
		nextRowIndex++
	}
	else{
		clearUnusedTable(tableID,startRowID,"rowObjectTargetType"+IDSuffix);
	}
}

async function createObjectTargetTypeRows(tableID,IDSuffix){
	//TODO: Not complete at all, just copied from creature types
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowObjectTargetType"+IDSuffix).rowIndex + 1;
	let currentTargetObjectTypeSelection = document.getElementById("ObjectTargetType"+IDSuffix).value;

	if(currentTargetObjectTypeSelection == "All"){
		clearUnusedTable(tableID,"rowObjectTargetType"+IDSuffix,"rowObjectTargetMagical"+IDSuffix);
	}
	else{
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectTypes']"});
		let allObjectTypes = await request.json();

		let ObjectTypeIncludeOptions = "";
		let ObjectTypeExcludeOptions = "";
		for(let tempType of allObjectTypes){
			ObjectTypeIncludeOptions = ObjectTypeIncludeOptions + "<label><input type='checkbox' id='ObjectTypeTargetInclusive"+IDSuffix+tempType.Name+"' name='ObjectTypeTargetInclusive"+IDSuffix+tempType.Name+"' value=1><span>"+tempType.DisplayName+"</span></label>";

			ObjectTypeExcludeOptions = ObjectTypeExcludeOptions + "<label><input type='checkbox' id='ObjectTypeTargetExclusive"+IDSuffix+tempType.Name+"' name='ObjectTypeTargetExclusive"+IDSuffix+tempType.Name+"' value=1><span>"+tempType.DisplayName+"</span></label>";
		}

		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveObjectTypes"+IDSuffix) != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveObjectTypes"+IDSuffix) != null);

		if(currentTargetObjectTypeSelection == "Inclusive" || currentTargetObjectTypeSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				let rowInclusiveObjectTypes = table.insertRow(nextRowIndex);
				rowInclusiveObjectTypes.id = "rowInclusiveObjectTypes"+IDSuffix;
				rowInclusiveObjectTypes.innerHTML = "<th>Required Object Types:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeIncludeOptions+"</div></td>";
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentTargetObjectTypeSelection == "Inclusive"){
				clearUnusedTable(tableID,"rowInclusiveObjectTypes"+IDSuffix,"rowTargetSenses"+IDSuffix);
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentTargetObjectTypeSelection == "Exclusive" || currentTargetObjectTypeSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				let rowExclusiveObjectTypes = table.insertRow(nextRowIndex);
				rowExclusiveObjectTypes.id = "rowExclusiveObjectTypes"+IDSuffix;
				rowExclusiveObjectTypes.innerHTML = "<th>Disallowed Object Types:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeExcludeOptions+"</div></td>";
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentTargetObjectTypeSelection == "Exclusive"){
				clearUnusedTable(tableID,"rowObjectTypes"+IDSuffix,"rowExclusiveObjectTypes"+IDSuffix);
			}
		}
	}
}

async function createObjectTargetTagRows(tableID,IDSuffix){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowObjectTargetTags"+IDSuffix).rowIndex + 1;
	let currentTargetObjectTagSelection = document.getElementById("ObjectTargetTags"+IDSuffix).value;

	if(currentTargetObjectTagSelection == "All"){
		clearUnusedTable(tableID,"rowObjectTargetTags"+IDSuffix,"rowObjectTargetFlammable"+IDSuffix);
	}
	else{
		let requestMaterialTags = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.MaterialTags']"});
		let allMaterialTags = await requestMaterialTags.json();

		let requestObjectTags = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectTags']"});
		let allObjectTags = await requestObjectTags.json();

		let allTags = allMaterialTags.concat(allObjectTags);

		let ObjectTypeIncludeOptions = createHTMLMultiselectOptions(allTags,"ObjectTargetTagsInclusive"+IDSuffix);
		let ObjectTypeExcludeOptions = createHTMLMultiselectOptions(allTags,"ObjectTargetTagsExclusive"+IDSuffix);

		let alreadyInclusiveTest = (table.rows.namedItem("rowObjectTargetTagsInclusive"+IDSuffix) != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowObjectTargetTagsExclusive"+IDSuffix) != null);

		if(currentTargetObjectTagSelection == "Inclusive" || currentTargetObjectTagSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				addTableRow(tableID,nextRowIndex,"rowObjectTargetTagsInclusive"+IDSuffix,"<th>Required Object Tags:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeIncludeOptions+"</div></td>");
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentTargetObjectTagSelection == "Inclusive"){
				table.deleteRow(document.getElementById("rowObjectTargetTagsExclusive"+IDSuffix).rowIndex);
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentTargetObjectTagSelection == "Exclusive" || currentTargetObjectTagSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				addTableRow(tableID,nextRowIndex,"rowObjectTargetTagsExclusive"+IDSuffix,"<th>Disallowed Object Tags:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeExcludeOptions+"</div></td>");
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentTargetObjectTagSelection == "Exclusive"){
				table.deleteRow(document.getElementById("rowObjectTargetTagsInclusive"+IDSuffix).rowIndex);
			}
		}
	}
}