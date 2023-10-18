//Note: This depends on some functions in CreateSubeffect.js

async function createTargetingRows(tableID,startRowID){
	let nextRowIndex = document.getElementById(startRowID).rowIndex;

	addTableRow(tableID,nextRowIndex,"Range","<th><label for='RangeType'>Range Type:</label></th><td><select id='RangeType' name='RangeType' onchange='createRangeTable("+'"'+tableID+'"'+")'><option value='Self'>Self</option><option value='SelfRanged'>Self with Range</option><option value='Touch'>Touch</option><option value='Ranged'>Ranged</option><option value='UnlimitedRange'>Unlimited Range</option></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"AoE","<th><label for='aoeShape'>Area of Effect Shape:</label></th><td><select id='aoeShape' name='aoeShape' onchange='createAoETable("+'"'+tableID+'"'+",1)'><option value='None'>None</option><option value='Cone'>Cone</option><option value='Cube'>Cube</option><option value='Cylinder'>Cylinder</option><option value='Half Sphere'>Half Sphere</option><option value='Line'>Line</option><option value='Panels'>Panels</option><option value='Sphere'>Sphere</option><option value='Wall'>Wall</option><option value='Choose'>Multiple Options</option></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowTargetNumber","<th><label for='TargetNumber'>Maximum Number of Targets:</label></th><td><input type='number' id='TargetNumber' name='TargetNumber' value=1 min=1 style='width:25px'><input type='checkbox' id='isTargetNumberUnlimited' name='isTargetNumberUnlimited' value=1 onchange='createTargetNumberToggle("+'"'+tableID+'"'+")'>Unlimited</td>");
	nextRowIndex++;

	if(checkEffectType()=="Spell"){
		let TargetNumberAHLScalingSelect = await createAHLSelect("TargetNumberAHLScaling");

		addTableRow(tableID,nextRowIndex,"rowTargetNumberAHL","<th><label for='TargetNumberAHL'>Increased Target Number AHL:</label></th><td><input type='number' id='TargetNumberAHL' name='TargetNumberAHL' value=0 min=0 style='width:25px'>"+TargetNumberAHLScalingSelect+"</td>");
		nextRowIndex++;		
	}

	addTableRow(tableID,nextRowIndex,"rowMustTargetAll","<th><label for='MustTargetAll'>Must Affect All Valid Targets:</label></th><td><input type='checkbox' id='MustTargetAll' name='MustTargetAll'></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowMultitargetDistance","<tr id='rowMultitargetDistance'><th><label for='MultitargetDistance'>Maximum Distance Between Targets:</label></th><td><input type='number' id='MultitargetDistance' name='MultitargetDistance' value=5 min=0 style='width:25px' disabled><input type='checkbox' id='isMultitargetDistanceUnlimited' name='isMultitargetDistanceUnlimited' value=1 checked onchange='toggleFieldEnabled("+'"MultitargetDistance","isMultitargetDistanceUnlimited"'+")'>Same as Overall Range</td></tr>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowMissiles","<th><label for='isMissiles'>Is it a Missile Effect?</label></th><td><input type='checkbox' id='isMissiles' name='isMissiles' onchange='createMissilesRows("+'"'+tableID+'"'+")'></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowTargetCover","<th><label for='MaxCover'>Most Cover Target Can Be Behind:</th><td><select name='MaxCover' id='MaxCover'><option value='None'>None</option><option value='Half'>Half</option><option value='ThreeQuarters' selected>Three-Quarters</option><option value='Full'>Full</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowIsSight","<th><label for='isSight'>Requires Sight on Target:</label></th><td><input type='checkbox' id='isSight' name='isSight' value=1></td>");
	nextRowIndex++;

	//Note: Free hand option will be moved to being a requirement for creating an object
	addTableRow(tableID,nextRowIndex,"Target","<th><label for='TargetType'>Target Type:</label></th><td><select id='TargetType' name='TargetType' onchange='createTargetTable("+'"'+tableID+'","Target","TargetType"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option><option value='CreatureObject'>Creature or Object</option><option value='AnyObject'>Any Object</option><option value='ObjectNotWorn'>Object Not Held or Worn</option><option value='ObjectWorn'>Object Held or Worn</option><option value='ObjectNonmagical'>Non-Magical Object</option><option value='ObjectMagical'>Magical Object</option><option value='Object'>Object (Custom Limits)</option><option value='Effect'>Effect</option><option value='Point'>Point</option></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowTargetingEnd","");
	nextRowIndex++;
	document.getElementById("rowTargetingEnd").setAttribute("hidden","");
}

function createPriorTargetsRows(tableID,callingType){
	let nextRowIndex = document.getElementById("rowUse"+callingType+"Targets").rowIndex + 1;
	clearUnusedTable(tableID,"rowUse"+callingType+"Targets","rowTargetingEnd");

	if(document.getElementById("Use"+callingType+"Targets").checked){
		addTableRow(tableID,nextRowIndex,"row"+callingType+"TargetNumber","<th><label for='"+callingType+"TargetNumber'>Number of "+callingType+" Targets Affected:</label></th><td><input type='number' id='"+callingType+"TargetNumber' name='"+callingType+"TargetNumber' value=1 style='width:25px' disabled><input type='checkbox' id='"+callingType+"TargetAll' name='"+callingType+"TargetAll' checked onchange='toggleFieldEnabled("+'"'+callingType+'TargetNumber","'+callingType+'TargetAll"'+")'> Affects All</td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"row"+callingType+"TargetLimits","<th><label for='"+callingType+"TargetLimits'>Different Limits on Targets Affected:</label></th><td><input type='checkbox' id='"+callingType+"TargetLimits' name='"+callingType+"TargetLimits' onchange='createPriorTargetsNewFilter("+'"'+tableID+'","'+callingType+'"'+")'></td>");
		nextRowIndex++;
	}
	else{
		addTableRow(tableID,nextRowIndex,"rowUse"+callingType+"Origin","<th><label for='Use"+callingType+"Origin'>New Subeffect Originates from Old Target:</label></th><td><input type='checkbox' id='Use"+callingType+"Origin' name='Use"+callingType+"Origin' onchange='create"+callingType+"OriginRows("+'"'+tableID+'"'+")'></td>");
		nextRowIndex++;

		createTargetingRows(tableID,"rowTargetingEnd");
	}
}

function createPriorTargetsNewFilter(tableID,callingType){
	if(document.getElementById(callingType+"TargetLimits").checked){
		let nextRowIndex = document.getElementById("row"+callingType+"TargetLimits").rowIndex + 1;

		//TODO: Should make this even more generalized, with options to either show all of the targeting options or prune them based on requirements (e.g. Creature options only if prior only targeted creatures)
		addTableRow(tableID,nextRowIndex,"row"+callingType+"TargetType","<th><label for='"+callingType+"TargetType'>Target Type:</label></th><td><select id='"+callingType+"TargetType' name='"+callingType+"TargetType' onchange='createTargetTable("+'"'+tableID+'","row'+callingType+'TargetType","'+callingType+'TargetType"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option><option value='CreatureObject'>Creature or Object</option><option value='AnyObject'>Any Object</option><option value='ObjectNotWorn'>Object Not Held or Worn</option><option value='ObjectWorn'>Object Held or Worn</option><option value='ObjectNonmagical'>Non-Magical Object</option><option value='ObjectMagical'>Magical Object</option><option value='Object'>Object (Custom Limits)</option><option value='Effect'>Effect</option><option value='Point'>Point</option></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"row"+callingType+"TargetLimits","rowTargetingEnd");
	}
}

async function createRangeTable(tableID){
	let nextRowIndex = document.getElementById("Range").rowIndex + 1;

	if(document.getElementById("RangeType").value == "SelfRanged" || document.getElementById("RangeType").value == "Ranged"){
		if(document.getElementById("rowRangeDistance") == null){
			addTableRow(tableID,nextRowIndex,"rowRangeDistance","<th><label for='RangeValue'>Range:</label></th><td><input type='number' id='RangeValue' name='RangeValue' min=0 style='width:25px' value=0><select id='RangeUnits' name='RangeUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>");
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let RangeScalingAHLSelect = await createAHLSelect("RangeScalingAHL");
				addTableRow(tableID,nextRowIndex,"rowRangeDistanceAHL","<th>Range Increase AHL:</th><td><input type='number' id='RangeValueAHL' name='RangeValueAHL' min=0 style='width:25px' value=0>"+RangeScalingAHLSelect+"</td>");
				nextRowIndex++;              
			}
		}
	}
	else if(document.getElementById("rowRangeDistance") != null){
		//Will need to change when rows are deleted here
		clearUnusedTable(tableID,"Range","AoE");
	}
}

async function createAoETable(tableID,whichShape){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("AoE").rowIndex + 1;
	let shapesArray = ["Cone","Cube","Cylinder","Half Sphere","Line","Panels","Sphere","Wall"];
	let aoeShapeSelction = document.getElementById("aoeShape").value;
	if(aoeShapeSelction == "None"){
		clearUnusedTable(tableID,"AoE","rowTargetNumber");

		if(document.getElementById("rowLightUseAoESize") != null){
			document.getElementById("lightDistanceValue").removeAttribute("disabled","");
			table.deleteRow(document.getElementById("rowLightUseAoESize").rowIndex);
		}
	}
	else{
		if(document.getElementById("rowAoENum") == null){
			let rowAoEHTML = "<th><label for='AoENum'>Number of AoEs:</label></th><td><input type='number' id='AoENum' name='AoENum' min=1 value=1 style='width:25px'>";
			if(checkEffectType()=="Spell"){
				let AoENumAHLScalingSelect = await createAHLSelect("AoENumAHLScaling");

				rowAoEHTML = rowAoEHTML + " + <input type='number' id='AoENumAHL' name='AoENumAHL' min=0 value=0 style='width:25px'>"+AoENumAHLScalingSelect;
			}
			rowAoEHTML = rowAoEHTML+"</td>";
			addTableRow(tableID,nextRowIndex,"rowAoENum",rowAoEHTML);
			nextRowIndex++;
		}

		if(document.getElementById("rowLightType") != null){
			if(document.getElementById("rowLightUseAoESize") == null && document.getElementById("lightType").value != "None"){
				let UseAoESizeIndex = document.getElementById("rowLightInfo").rowIndex+1;
				addTableRow(tableID,UseAoESizeIndex,"rowLightUseAoESize","<th><label for='isLightUseAoESize'>Use AoE For Size:</label></th><td><input type='checkbox' id='isLightUseAoESize' name='isLightUseAoESize' onchange='toggleFieldEnabled("+'"lightDistanceValue","isLightUseAoESize"'+")'></td>");
				nextRowIndex++;
			}
		}

		if(aoeShapeSelction == "Choose"){
			if(whichShape==1){
				let rowMultiAOESelection = table.insertRow(nextRowIndex);
				rowMultiAOESelection.id = "rowMultiAOESelection";

				let multiAOESelectionText = "";
				for(let tempShape of shapesArray){
					let tempShapeNoSpace = tempShape.split(" ").join("");
					multiAOESelectionText = multiAOESelectionText + "<label><input type='checkbox' id='is"+tempShapeNoSpace+"AOEMulti' name='is"+tempShapeNoSpace+"AOEMulti' value=1 onchange='createAoETable("+'"'+tempShape+'"'+")'><span>"+tempShape+"</span></label>";
				}

				rowMultiAOESelection.innerHTML = "<th>AoE Shape Options:</th><td><div class='check-multiple' style='width:100%'>"+multiAOESelectionText+"</div></td>";
				nextRowIndex++;

				for(let tempShape of shapesArray){
					tempShape = tempShape.split(" ").join("");
					if(document.getElementById("row"+tempShape+"Dimensions") != null){
						document.getElementById("is"+tempShape+"AOEMulti").setAttribute("checked",'');
					}
				}
			}
			else{
				if(document.getElementById("is"+whichShape.split(" ").join("")+"AOEMulti").checked){
					let earlierShapesArray = shapesArray.slice(0,shapesArray.indexOf(whichShape));
					nextRowIndex = document.getElementById("rowMultiAOESelection").rowIndex + 1;
					for(let tempShape of earlierShapesArray){
						//Required for Half Sphere or any other shapes with a space
						tempShape = tempShape.split(" ").join("");
						if(document.getElementById("row"+tempShape+"Dimensions") != null){
							nextRowIndex = document.getElementById("row"+tempShape+"Dimensions").rowIndex + 2;
						}
					}                          
				}
				else{
					let removalRow = document.getElementById("row"+whichShape.split(" ").join("")+"Dimensions").rowIndex;
					table.deleteRow(removalRow);
					table.deleteRow(removalRow);
					return;
				}
			}
		}
		else{
			whichShape = document.getElementById("aoeShape").value;
			if(document.getElementById("row"+whichShape+"Dimensions") != null){
				clearUnusedTable(tableID,"AoE","row"+whichShape+"Dimensions");
				
				if(checkEffectType()=="Spell"){
					clearUnusedTable(tableID,"row"+whichShape+"DimensionsAHL","rowAoENum");                    
				}
				else{
					clearUnusedTable(tableID,"row"+whichShape+"Dimensions","rowAoENum");
				}

				return;
			}
			else{
				clearUnusedTable(tableID,"AoE","rowAoENum");
			}
		}

		if(whichShape == "Cone"){
			let rowConeDimensions = table.insertRow(nextRowIndex);
			rowConeDimensions.id = "rowConeDimensions";
			rowConeDimensions.innerHTML = "<th><label for='coneDimensionValue'>Cone Size:</label></th><td><input type='number' id='coneDimensionValue' name='coneDimensionValue' min=0 style='width:25px' value=0><select id='coneDimensionUnits' name='coneDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let coneSizeAHLScalingSelect = await createAHLSelect("coneSizeAHLScaling");

				let rowConeDimensionsAHL = table.insertRow(nextRowIndex);
				rowConeDimensionsAHL.id = "rowConeDimensionsAHL";
				rowConeDimensionsAHL.innerHTML = "<th><label for='coneDimensionValueAHL'>Increased Cone Size AHL:</label></th><td><input type='number' id='coneDimensionValueAHL' name='coneDimensionValueAHL' min=0 style='width:25px' value=0>"+coneSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Cube"){
			let rowCubeDimensions = table.insertRow(nextRowIndex);
			rowCubeDimensions.id = "rowCubeDimensions";
			rowCubeDimensions.innerHTML = "<th><label for='cubeDimensionValue'>Cube Side Length:</label></th><td><input type='number' id='cubeDimensionValue' name='cubeDimensionValue' min=0 style='width:25px' value=0><select id='cubeDimensionUnits' name='cubeDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let cubeSizeAHLScalingSelect = await createAHLSelect("cubeSizeAHLScaling");

				let rowCubeDimensionsAHL = table.insertRow(nextRowIndex);
				rowCubeDimensionsAHL.id = "rowCubeDimensionsAHL";
				rowCubeDimensionsAHL.innerHTML = "<th><label for='cubeDimensionValueAHL'>Increased Side Length AHL:</label></th><td><input type='number' id='cubeDimensionValueAHL' name='cubeDimensionValueAHL' min=0 style='width:25px' value=0>"+cubeSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Cylinder"){
			let rowCylinderDimensions = table.insertRow(nextRowIndex);
			rowCylinderDimensions.id = "rowCylinderDimensions";
			rowCylinderDimensions.innerHTML = "<th><label for='cylinderRadiusValue'>Cylinder Radius x Height:</label></th><td><input type='number' id='cylinderRadiusValue' name='cylinderRadiusValue' min=0 style='width:25px' value=0><select id='cylinderRadiusUnits' name='cylinderRadiusUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='cylinderHeightValue' name='cylinderHeightValue' min=0 style='width:25px' value=0><select id='cylinderHeightUnits' name='cylinderHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let cylinderSizeAHLScalingSelect = await createAHLSelect("cylinderSizeAHLScaling");

				let rowCylinderDimensionsAHL = table.insertRow(nextRowIndex);
				rowCylinderDimensionsAHL.id = "rowCylinderDimensionsAHL";
				rowCylinderDimensionsAHL.innerHTML = "<th><label for='cylinderRadiusValueAHL'>Cylinder Dimensions AHL:</label></th><td><input type='number' id='cylinderRadiusValueAHL' name='cylinderRadiusValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='cylinderHeightValueAHL' name='cylinderHeightValueAHL' min=0 style='width:25px' value=0>"+cylinderSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Half Sphere"){
			let rowHalfSphereDimensions = table.insertRow(nextRowIndex);
			rowHalfSphereDimensions.id = "rowHalfSphereDimensions";
			rowHalfSphereDimensions.innerHTML = "<th><label for='halfSphereDimensionValue'>Half Sphere Radius:</label></th><td><input type='number' id='halfSphereDimensionValue' name='halfSphereDimensionValue' min=0 style='width:25px' value=0><select id='halfSphereDimensionUnits' name='halfSphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let halfSphereSizeAHLScalingSelect = await createAHLSelect("halfSphereSizeAHLScaling");

				let rowHalfSphereDimensionsAHL = table.insertRow(nextRowIndex);
				rowHalfSphereDimensionsAHL.id = "rowHalfSphereDimensionsAHL";
				rowHalfSphereDimensionsAHL.innerHTML = "<th><label for='halfSphereDimensionValueAHL'>Increased Radius AHL:</label></th><td><input type='number' id='halfSphereDimensionValueAHL' name='halfSphereDimensionValueAHL' min=0 style='width:25px' value=0>"+halfSphereSizeAHLScalingSelect+"</td>";
				nextRowIndex++;
			}

		}
		else if(whichShape == "Line"){
			let rowLineDimensions = table.insertRow(nextRowIndex);
			rowLineDimensions.id = "rowLineDimensions";
			rowLineDimensions.innerHTML = "<th><label for='lineLengthValue'>Line Length x Width:</label></th><td><input type='number' id='lineLengthValue' name='lineLengthValue' min=0 style='width:25px' value=0><select id='lineLengthUnits' name='lineLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='lineWidthValue' name='lineWidthValue' min=0 style='width:25px' value=0><select id='lineWidthUnits' name='lineWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let lineSizeAHLScalingSelect = await createAHLSelect("lineSizeAHLScaling");

				let rowLineDimensionsAHL = table.insertRow(nextRowIndex);
				rowLineDimensionsAHL.id = "rowLineDimensionsAHL";
				rowLineDimensionsAHL.innerHTML = "<th><label for='lineLengthValueAHL'>Increased Dimensions AHL:</label></th><td><input type='number' id='lineLengthValueAHL' name='lineLengthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='lineWidthValueAHL' name='lineWidthValueAHL' min=0 style='width:25px' value=0>"+lineSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Panels"){
			let rowPanelsDimensions = table.insertRow(nextRowIndex);
			rowPanelsDimensions.id = "rowPanelsDimensions";
			rowPanelsDimensions.innerHTML = "<th><label for='panelsNumber'>Panel Number and Side Length:</label></th><td><input type='number' id='panelsNumber' name='panelsNumber' min=0 style='width:25px' value=10> panels, <input type='number' id='panelsDimensionValue' name='panelsDimensionValue' min=0 style='width:25px' value=0><select id='panelsDimensionUnits' name='panelsDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let panelsNumberAHLScalingSelect = await createAHLSelect("panelsNumberAHLScaling");

				let rowPanelsDimensionsAHL = table.insertRow(nextRowIndex);
				rowPanelsDimensionsAHL.id = "rowPanelsDimensionsAHL";
				rowPanelsDimensionsAHL.innerHTML = "<th><label for='panelsNumberAHL'>Increased Panels AHL:</label></th><td><input type='number' id='panelsNumberAHL' name='panelsNumberAHL' min=0 style='width:25px' value=0>"+panelsNumberAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Sphere"){
			let rowSphereDimensions = table.insertRow(nextRowIndex);
			rowSphereDimensions.id = "rowSphereDimensions";
			rowSphereDimensions.innerHTML = "<th><label for='sphereDimensionValue'>Sphere Radius:</label></th><td><input type='number' id='sphereDimensionValue' name='sphereDimensionValue' min=0 style='width:25px' value=0><select id='sphereDimensionUnits' name='sphereDimensionUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let sphereSizeAHLScalingSelect = await createAHLSelect("sphereSizeAHLScaling");

				let rowSphereDimensionsAHL = table.insertRow(nextRowIndex);
				rowSphereDimensionsAHL.id = "rowSphereDimensionsAHL";
				rowSphereDimensionsAHL.innerHTML = "<th><label for='sphereDimensionValueAHL'>Increased Radius AHL:</label></th><td><input type='number' id='sphereDimensionValueAHL' name='sphereDimensionValueAHL' min=0 style='width:25px' value=0>"+sphereSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
		else if(whichShape == "Wall"){
			let rowWallDimensions = table.insertRow(nextRowIndex);
			rowWallDimensions.id = "rowWallDimensions";
			rowWallDimensions.innerHTML = "<th><label for='wallLengthValue'>Wall Length x Width x Height:</label></th><td><input type='number' id='wallLengthValue' name='wallLengthValue' min=0 style='width:25px' value=0><select id='wallLengthUnits' name='wallLengthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallWidthValue' name='wallWidthValue' min=0 style='width:25px' value=0><select id='wallWidthUnits' name='wallWidthUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> x <input type='number' id='wallHeightValue' name='wallHeightValue' min=0 style='width:25px' value=0><select id='wallHeightUnits' name='wallHeightUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>";
			nextRowIndex++;

			if(checkEffectType()=="Spell"){
				let wallSizeAHLScalingSelect = await createAHLSelect("wallSizeAHLScaling");

				let rowWallDimensionsAHL = table.insertRow(nextRowIndex);
				rowWallDimensionsAHL.id = "rowWallDimensionsAHL";
				rowWallDimensionsAHL.innerHTML = "<th><label for='wallLengthValueAHL'>Increased Dimensions AHL:</label></th><td><input type='number' id='wallLengthValueAHL' name='wallLengthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='wallWidthValueAHL' name='wallWidthValueAHL' min=0 style='width:25px' value=0> x <input type='number' id='wallHeightValueAHL' name='wallHeightValueAHL' min=0 style='width:25px' value=0>"+wallSizeAHLScalingSelect+"</td>";
				nextRowIndex++;                
			}
		}
	}
}

async function createTargetNumberToggle(tableID){
	let table = document.getElementById(tableID);

	if(document.getElementById("isTargetNumberUnlimited").checked){
		if(checkEffectType()=="Spell"){
			table.deleteRow(document.getElementById("rowTargetNumberAHL").rowIndex);            
		}

		document.getElementById("TargetNumber").setAttribute("disabled","");
	}
	else{
		if(checkEffectType()=="Spell"){
			let TargetNumberAHLScalingSelect = await createAHLSelect("TargetNumberAHLScaling");

			let rowTargetNumberAHL = table.insertRow(document.getElementById("rowTargetNumber").rowIndex + 1);
			rowTargetNumberAHL.id = "rowTargetNumberAHL";
			rowTargetNumberAHL.innerHTML = "<th><label for='TargetNumberAHL'>Increased Target Number AHL:</label></th><td><input type='number' id='TargetNumberAHL' name='TargetNumberAHL' value=0 min=0 style='width:25px'>"+TargetNumberAHLScalingSelect+"</td>";                
		}

		document.getElementById("TargetNumber").removeAttribute("disabled","");
	}
}

async function createMissilesRows(tableID){
	if(document.getElementById("isMissiles").checked){
		let nextRowIndex = document.getElementById("rowMissiles").rowIndex + 1;

		addTableRow(tableID,nextRowIndex,"rowMissileNumber","<th><label for='MissileNumber'>Number of Missiles:</label></th><td><input type='number' id='MissileNumber' name='MissileNumber' value=1 min=1 style='width:25px'></td>");
		nextRowIndex++;

		if(checkEffectType()=="Spell"){
			let MissilesAHLSelect = await createAHLSelect("MissilesAHLScaling");
			addTableRow(tableID,nextRowIndex,"rowMissilesAHL","<th><label for='MissileNumberAHL'>Additional Missiles At Higher Levels:</label></th><td><input type='number' id='MissileNumberAHL' name='MissileNumberAHL' value=1 min=0 style='width:25px'>"+MissilesAHLSelect+"</td>");
			nextRowIndex++;
		}

		addTableRow(tableID,nextRowIndex,"rowMissileSameDamageRoll","<th><label for='isMissileSameDamageRoll'>Same Damage Roll for Each Missile?</label></th><td><select id='isMissileSameDamageRoll' name='isMissileSameDamageRoll'><option value=''>Use Default Rules</option><option value='1'>Same Damage Roll</option><option value='0'>Different Damage Rolls</option></select></td>");
		nextRowIndex++;
	}
	else{
		clearUnusedTable(tableID,"rowMissiles","rowTargetCover");
	}
}

function createTargetTable(tableID,startRowID,selectionID,tempIDSuffix,tempNextAnchorRow){
	let currentTargetTypeSelection = document.getElementById(selectionID).value;
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;
	let IDSuffix = "";
	if (arguments.length > 3){
		IDSuffix = tempIDSuffix
	}
	
	let nextAnchorRow = "rowTargetingEnd";
	if (arguments.length > 4){
		nextAnchorRow = tempNextAnchorRow;
	}
	clearUnusedTable(tableID,startRowID,nextAnchorRow);

	if(currentTargetTypeSelection == "Creature"){
		createCreatureTargetTable(tableID,startRowID,selectionID,IDSuffix,nextAnchorRow);
	}
	else if(currentTargetTypeSelection == "Object"){
		createObjectTargetTable(tableID,startRowID,selectionID,nextAnchorRow);
	}
	else if(currentTargetTypeSelection == "CreatureObject"){
		addTableRow(tableID,nextRowIndex,"rowIsolatedCreatureTargetOptions","<th><label for='CreatureTargetType'>Creature Targeting Limits:</label></th><td><select id='CreatureTargetType' name='CreatureTargetType' onchange='createTargetTable("+'"'+tableID+'","rowIsolatedCreatureTargetOptions","CreatureTargetType","'+IDSuffix+'","rowIsolatedObjectTargetOptions"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option></selected></td>");
		nextRowIndex++;

		addTableRow(tableID,nextRowIndex,"rowIsolatedObjectTargetOptions","<th><label for='ObjectTargetLimits'>Object Targeting Limits:</label></th><td><select id='ObjectTargetLimits' name='ObjectTargetLimits' onchange='createTargetTable("+'"'+tableID+'","rowIsolatedObjectTargetOptions","ObjectTargetLimits","'+IDSuffix+'","'+nextAnchorRow+'"'+")'><option value='AnyObject'>Any Object</option><option value='ObjectNotWorn' selected>Object Not Held or Worn</option><option value='ObjectWorn'>Object Held or Worn</option><option value='Object'>Object (Custom Limits)</option></selected></td>");
		nextRowIndex++;
	}
	else if(currentTargetTypeSelection == "Effect"){

	}
	else if(currentTargetTypeSelection == "Point"){
		addTableRow(tableID,nextRowIndex,"rowPointOnGround","<th><label for='pointOnGround'>Point Must Be on the Ground:</label></th><td><input type='checkbox' id='pointOnGround' name='pointOnGround'></td>");
		nextRowIndex++;

		let secondaryTargetOptions = document.getElementById("TargetType").innerHTML;
		secondaryTargetOptions = "<option value='None'>None</option>" + secondaryTargetOptions;

		addTableRow(tableID,nextRowIndex,"rowSecondaryTarget","<th><label for='secondaryTargetType'>Secondary Target Type:</label></th><td><select id='secondaryTargetType' name='secondaryTargetType' onchange='createTargetTable("+'"'+tableID+'","rowSecondaryTarget","secondaryTargetType"'+")'></select></td>");
		nextRowIndex++;
		document.getElementById("secondaryTargetType").innerHTML = secondaryTargetOptions;
	
		//removes Point option
		let secondaryTargetSelection = document.getElementById("secondaryTargetType");
		secondaryTargetSelection = document.getElementById("secondaryTargetType").remove(document.getElementById("secondaryTargetType").options.length - 1);
	}
}

async function createCreatureTargetTable(tableID,startRowID,selectionID,IDSuffix,tempNextAnchorRow){
	let table = document.getElementById(tableID);
	let currentTargetTypeSelection = document.getElementById(selectionID).value;
	let nextRowIndex = document.getElementById(startRowID).rowIndex;
	let IDSuffixText = "";
	if(arguments.length > 3){
		IDSuffixText = IDSuffix;
	}
	
	let nextAnchorRow = "rowTargetingEnd";
	if (arguments.length > 4){
		nextAnchorRow = tempNextAnchorRow;
	}

	let rowAllegiance = table.insertRow(nextRowIndex+1);
	rowAllegiance.id = "rowAllegiance"+IDSuffixText;
	rowAllegiance.innerHTML = "<th><label for='targetAllegiance"+IDSuffixText+"'>Allegiance of Target:</label></th><td><select id='targetAllegiance"+IDSuffixText+"' name='targetAllegiance"+IDSuffixText+"'><option value='All'>Anyone</option><option value='Self'>Self Only</option><option value='Allies'>Allies</option><option value='AlliesNonself'>Allies Other Than Self</option><option value='NotSelf'>Anyone Other Than Self</option><option value='Enemies'>Enemies</option><option value='Nonhostile'>Nonhostile Creatures</option><option value='NonhostileNotself'>Nonhostile Creatures, Not Self</option></select></td>";

	//Previously considered: function that disables/enables filtering options when 'Self' is the only viable target. Will not do because defaults are not limiting and it would allow for creation of spells only usable by certain creature types maybe? But also because nah.

	let rowCreatureTypes = table.insertRow(nextRowIndex+2);
	rowCreatureTypes.id = "rowCreatureTypes"+IDSuffixText;
	rowCreatureTypes.innerHTML = "<th><label for='targetCreatureTypes"+IDSuffixText+"'>Valid Creature Types:</label></th><td><select id='targetCreatureTypes"+IDSuffixText+"' name='targetCreatureTypes"+IDSuffixText+"' onchange='createCreatureTargetTypes("+'"'+tableID+'","'+IDSuffixText+'"'+")'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>";

	let rowTargetSenses = table.insertRow(nextRowIndex+3);
	rowTargetSenses.id = "rowTargetSenses"+IDSuffixText;
	rowTargetSenses.innerHTML = "<th><label for='targetCanSee"+IDSuffixText+"'>Senses Required by Target:</th><td><input type='checkbox' name='targetCanSee"+IDSuffixText+"' id='targetCanSee"+IDSuffixText+"'><label for='targetCanSee"+IDSuffixText+"'>Target Must See Caster</label><br><input type='checkbox' name='targetCanHear"+IDSuffixText+"' id='targetCanHear"+IDSuffixText+"'><label for='targetCanHear"+IDSuffixText+"'>Target Must Hear Caster</label><br><input type='checkbox' name='targetCanUnderstand"+IDSuffixText+"' id='targetCanUnderstand"+IDSuffixText+"'><label for='targetCanUnderstand"+IDSuffixText+"'>Target Must Understand Caster</label></td>";

	let rowTargetCondition = table.insertRow(nextRowIndex+4);
	rowTargetCondition.id = "rowTargetCondition"+IDSuffixText;
	rowTargetCondition.innerHTML = "<th><label for='isTargetCondition"+IDSuffixText+"'>Condition Requirements on Target:</th><td><select name='isTargetCondition"+IDSuffixText+"' id='isTargetCondition"+IDSuffixText+"' onchange='createTargetConditionTable("+'"'+tableID+'","'+IDSuffixText+'"'+")'><option value='None'>None</option><option value='Inclusive'>Must Have Certain Conditions</option><option value='Exclusive'>Cannot Have Certain Conditions</option><option value='Mixture'>Mixture of Both Above</option></select></td>";
	
	let rowTargetAbilityScore = table.insertRow(nextRowIndex+5);
	rowTargetAbilityScore.id = "rowTargetAbilityScore"+IDSuffixText;
	rowTargetAbilityScore.innerHTML = "<th><label for='isAbilityScore"+IDSuffixText+"'>Limit Targeting By Target Ability Scores:</th><td><input type='checkbox' name='isAbilityScore"+IDSuffixText+"' id='isAbilityScore"+IDSuffixText+"' onchange='createTargetAbilityScoreTable("+'"'+tableID+'","'+IDSuffixText+'"'+")'></td>";
	
	let rowTargetAlignment = table.insertRow(nextRowIndex+6);
	rowTargetAlignment.id = "rowTargetAlignment"+IDSuffixText;
	rowTargetAlignment.innerHTML = "<th><label for='isAlignment"+IDSuffixText+"'>Limit Targeting By Alignment:</th><td><input type='checkbox' name='isAlignment"+IDSuffixText+"' id='isAlignment"+IDSuffixText+"' onchange='createTargetAlignmentTable("+'"'+tableID+'","'+IDSuffixText+'","'+nextAnchorRow+'"'+")'></td>";
}

async function createCreatureTargetTypes(tableID,IDSuffix){
	let table = document.getElementById(tableID);

	let currentTargetCreatureTypeSelection = document.getElementById("targetCreatureTypes"+IDSuffix).value;
	let nextRowIndex = document.getElementById("rowCreatureTypes"+IDSuffix).rowIndex+1;

	if(currentTargetCreatureTypeSelection == "All"){
		clearUnusedTable(tableID,"rowCreatureTypes"+IDSuffix,"rowTargetSenses"+IDSuffix);
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
				clearUnusedTable(tableID,"rowInclusiveCreatureTypes"+IDSuffix,"rowTargetSenses"+IDSuffix);
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
				rowInclusiveSetByCaster.innerHTML = "<th><label for='inclusiveSetBy"+IDSuffix+"'>Must Be Inflicted by Caster?</label></th><td><input type='checkbox' id='inclusiveSetBy"+IDSuffix+"' name='inclusiveSetBy"+IDSuffix+"' value=1></td>";
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

async function createObjectTargetTable(tableID,startRowID,selectionID){
	let currentTargetTypeSelection = document.getElementById(selectionID).value;
	
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;
	let optionLimits = "<option value=''>Not Relevant</option><option value='Inclusive'>Required</option><option value='Exclusive'>Invalid</option>";


	addTableRow(tableID,nextRowIndex,"rowObjectTargetWornCarried","<th><label for='ObjectTargetWornCarried'>Object is Worn or Carried:</label></th><td><select id='ObjectTargetWornCarried' name='ObjectTargetWornCarried' onchange='createHeldObjectCreatureLimitRows("+'"'+tableID+'"'+")'><option value='NotWorn'>Cannot Be Worn</option><option value='Worn'>Must be Worn</option><option value=''>Not Relevant</option></select></td>");
	nextRowIndex++;

	//TODO: Need a way to both do this and object subtype conveniently
	addTableRow(tableID,nextRowIndex,"rowObjectTargetType","<th><label for='ObjectTargetType'>Limit by Object Type:</label></th><td><select id='ObjectTargetType' name='ObjectTargetType' onchange='createObjectTargetTypeRows("+'"'+tableID+'"'+")'><option value='All'>All Types</option><option value='Inclusive'>Must Be Type(s)</option><option value='Exclusive'>Cannot Be Type(s)</option><option value='Mixture'>Mixture of Both</option></select><input type='checkbox' id='' name='' onchange=''>Use Subtypes?</td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetMagical","<th><label for='ObjectTargetMagical'>Object is Magical:</label></th><td><select id='ObjectTargetMagical' name='ObjectTargetMagical'>"+optionLimits+"</select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetSize","<th><label for='ObjectTargetSizeType'>Object Size Limits:</label></th><td><select id='ObjectTargetSizeType' name='ObjectTargetSizeType'><option value=''>Not Relevant</option><option value='Maximum'>Maximum</option><option value='Minimum'>Minimum</option></select><select id='ObjectTargetSize' name='ObjectTargetSize'><option value='Diminutive'>Diminutive</option><option value='Tiny'>Tiny</option><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option><option value='Huge'>Huge</option><option value='Gargantuan'>Gargantuan</option><option value='Colossal'>Colossal</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetWeight","<th><label for='ObjectTargetWeightType'>Object Weight Limits:</label></th><td><select id='ObjectTargetWeightType' name='ObjectTargetWeightType'><option value=''>Not Relevant</option><option value='Maximum'>Maximum</option><option value='Minimum'>Minimum</option></select><input type='number' id='ObjectTargetWeight' name='ObjectTargetWeight' value=0 min=0 style='width:30px'></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetTags","<th><label for='ObjectTargetTags'>Limit by Object Tags:</label></th><td><select id='ObjectTargetTags' name='ObjectTargetTags' onchange='createObjectTargetTagRows("+'"'+tableID+'"'+")'><option value='All'>All Types</option><option value='Inclusive'>Must Be Specific Type(s)</option><option value='Exclusive'>Cannot Be Specific Type(s)</option><option value='Mixture'>Mixture of Both Above</option></select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetFlammable","<th><label for='ObjectTargetFlammable'>Object is Flammable:</label></th><td><select id='ObjectTargetFlammable' name='ObjectTargetFlammable'>"+optionLimits+"</select></td>");
	nextRowIndex++;

	addTableRow(tableID,nextRowIndex,"rowObjectTargetMagnetic","<th><label for='ObjectTargetMagnetic'>Object is Magnetic:</label></th><td><select id='ObjectTargetMagnetic' name='ObjectTargetMagnetic'>"+optionLimits+"</select></td>");
	nextRowIndex++;
}

function createHeldObjectCreatureLimitRows(tableID){
	let HeldSelection = document.getElementById("ObjectTargetWornCarried").value;

	if(HeldSelection == "NotWorn"){
		clearUnusedTable(tableID,"rowObjectTargetWornCarried","rowObjectTargetType");
	}
	else if(document.getElementById("rowHoldingCreatureLimits") == null && document.getElementById("rowIsUseCreatureTargetingLimits") == null){
		let nextRowIndex = document.getElementById("rowObjectTargetWornCarried") + 1;
		let TargetTypeCreatureValues = ["AnyCreature","AnyOtherCreature","AlliedCreature","SelfOnly","EnemyCreature","HumanoidCreature","Creature","CreatureObject"];

		//Checking for any creature limits from primary, secondary, or CreatureObject targeting methods
		let NoCreatureLimits = document.getElementById("CreatureTargetType") == null;
		if(document.getElementById("secondaryTargetType") != null && NoCreatureLimits){
			NoCreatureLimits = !TargetTypeCreatureValues.includes(document.getElementById("secondaryTargetType").value);
		}
		if(NoCreatureLimits){
			NoCreatureLimits = !TargetTypeCreatureValues.includes(document.getElementById("TargetType").value);
		}

		if(NoCreatureLimits){
			createHoldingCreatureLimitRows(tableID,"rowObjectTargetWornCarried");
		}
		else{
			addTableRow(tableID,nextRowIndex,"rowIsUseCreatureTargetingLimits","<th><label for='isUseCreatureTargetingLimits'>Same Creature Limits as Previous Entry:</label></th><td><input type='checkbox' id='isUseCreatureTargetingLimits' name='isUseCreatureTargetingLimits' onchange='createHoldingCreatureLimitRows("+'"'+tableID+'","rowIsUseCreatureTargetingLimits"'+")' checked></td>");
			nextRowIndex++;
		}
	}
}

function createHoldingCreatureLimitRows(tableID,startRowID){
	let nextRowIndex = document.getElementById(startRowID).rowIndex + 1;
	let createRowsTest;

	if(document.getElementById("isUseCreatureTargetingLimits") == null){
		createRowsTest = true;
	}
	else{
		createRowsTest = document.getElementById("isUseCreatureTargetingLimits").checked;
	}

	if(createRowsTest){
		addTableRow(tableID,nextRowIndex,"rowHoldingCreatureLimits","<th><label for='HoldingCreatureLimits'>Holding Creature Targeting Limits:</label></th><td><select id='HoldingCreatureLimits' name='HoldingCreatureLimits' onchange='createTargetTable("+'"'+tableID+'","rowHoldingCreatureLimits","HoldingCreatureLimits","HoldingObject","rowObjectTargetType"'+")'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option></selected></td>");
		nextRowIndex++
	}
	else{
		clearUnusedTable(tableID,startRowID,"rowObjectTargetType");
	}
}

async function createObjectTargetTypeRows(tableID){
	//TODO: Not complete at all, just copied from creature types
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowObjectTargetType").rowIndex + 1;
	let currentTargetObjectTypeSelection = document.getElementById("ObjectTargetType").value;

	if(currentTargetObjectTypeSelection == "All"){
		clearUnusedTable(tableID,"rowObjectTargetType","rowObjectTargetMagical");
	}
	else{
		let request = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectTypes']"});
		let allObjectTypes = await request.json();

		let ObjectTypeIncludeOptions = "";
		let ObjectTypeExcludeOptions = "";
		for(let tempType of allObjectTypes){
			ObjectTypeIncludeOptions = ObjectTypeIncludeOptions + "<label><input type='checkbox' id='ObjectTypeTargetInclusive"+tempType.Name+"' name='ObjectTypeTargetInclusive"+tempType.Name+"' value=1><span>"+tempType.DisplayName+"</span></label>";

			ObjectTypeExcludeOptions = ObjectTypeExcludeOptions + "<label><input type='checkbox' id='ObjectTypeTargetExclusive"+tempType.Name+"' name='ObjectTypeTargetExclusive"+tempType.Name+"' value=1><span>"+tempType.DisplayName+"</span></label>";
		}

		let alreadyInclusiveTest = (table.rows.namedItem("rowInclusiveObjectTypes") != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowExclusiveObjectTypes") != null);

		if(currentTargetObjectTypeSelection == "Inclusive" || currentTargetObjectTypeSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				let rowInclusiveObjectTypes = table.insertRow(nextRowIndex);
				rowInclusiveObjectTypes.id = "rowInclusiveObjectTypes";
				rowInclusiveObjectTypes.innerHTML = "<th>Required Object Types:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeIncludeOptions+"</div></td>";
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentTargetObjectTypeSelection == "Inclusive"){
				clearUnusedTable(tableID,"rowInclusiveObjectTypes","rowTargetSenses");
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentTargetObjectTypeSelection == "Exclusive" || currentTargetObjectTypeSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				let rowExclusiveObjectTypes = table.insertRow(nextRowIndex);
				rowExclusiveObjectTypes.id = "rowExclusiveObjectTypes";
				rowExclusiveObjectTypes.innerHTML = "<th>Disallowed Object Types:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeExcludeOptions+"</div></td>";
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentTargetObjectTypeSelection == "Exclusive"){
				clearUnusedTable(tableID,"rowObjectTypes","rowExclusiveObjectTypes");
			}
		}
	}
}

async function createObjectTargetTagRows(tableID){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("rowObjectTargetTags").rowIndex + 1;
	let currentTargetObjectTagSelection = document.getElementById("ObjectTargetTags").value;

	if(currentTargetObjectTagSelection == "All"){
		clearUnusedTable(tableID,"rowObjectTargetTags","rowObjectTargetFlammable");
	}
	else{
		let requestMaterialTags = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.MaterialTags']"});
		let allMaterialTags = await requestMaterialTags.json();

		let requestObjectTags = await fetch("macro:pm.a5e.GetCoreData@lib:pm.a5e.Core", {method: "POST", body: "['sb.ObjectTags']"});
		let allObjectTags = await requestObjectTags.json();

		let allTags = allMaterialTags.concat(allObjectTags);

		let ObjectTypeIncludeOptions = createHTMLMultiselectOptions(allTags,"ObjectTargetTagsInclusive");
		let ObjectTypeExcludeOptions = createHTMLMultiselectOptions(allTags,"ObjectTargetTagsExclusive");

		let alreadyInclusiveTest = (table.rows.namedItem("rowObjectTargetTagsInclusive") != null);
		let alreadyExclusiveTest = (table.rows.namedItem("rowObjectTargetTagsExclusive") != null);

		if(currentTargetObjectTagSelection == "Inclusive" || currentTargetObjectTagSelection == "Mixture"){
			if(alreadyInclusiveTest){
				nextRowIndex++;
			}
			else{
				addTableRow(tableID,nextRowIndex,"rowObjectTargetTagsInclusive","<th>Required Object Tags:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeIncludeOptions+"</div></td>");
				nextRowIndex++;
			}
			if(alreadyExclusiveTest && currentTargetObjectTagSelection == "Inclusive"){
				table.deleteRow(document.getElementById("rowObjectTargetTagsExclusive").rowIndex);
			}
		}
		else if(alreadyInclusiveTest){
			nextRowIndex++;
		}
		
		if(currentTargetObjectTagSelection == "Exclusive" || currentTargetObjectTagSelection == "Mixture"){
			if(!alreadyExclusiveTest){
				addTableRow(tableID,nextRowIndex,"rowObjectTargetTagsExclusive","<th>Disallowed Object Tags:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeExcludeOptions+"</div></td>");
				nextRowIndex++;
			}
			else{
				nextRowIndex++;
			}
			if(alreadyInclusiveTest && currentTargetObjectTagSelection == "Exclusive"){
				table.deleteRow(document.getElementById("rowObjectTargetTagsInclusive").rowIndex);
			}
		}
	}
}