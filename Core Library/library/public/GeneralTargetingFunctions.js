function createTargetingRows(tableID,startRowID){
	let nextRowIndex = document.getElementById(startRowID).rowIndex;
	
	addTableRow(tableID,nextRowIndex,"Range","<th><label for='RangeType'>Range Type:</label></th><td><select id='RangeType' name='RangeType' onchange='createRangeTable("+'"'+tableID+'"'+")'><option value='Self'>Self</option><option value='SelfRanged'>Self with Range</option><option value='Touch'>Touch</option><option value='Ranged'>Ranged</option><option value='UnlimitedRange'>Unlimited Range</option></td>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"AoE","<th><label for='aoeShape'>Area of Effect Shape:</label></th><td><select id='aoeShape' name='aoeShape' onchange='createAoETable("+'"'+tableID+'"'+",1)'><option value='None'>None</option><option value='Cone'>Cone</option><option value='Cube'>Cube</option><option value='Cylinder'>Cylinder</option><option value='Half Sphere'>Half Sphere</option><option value='Line'>Line</option><option value='Panels'>Panels</option><option value='Sphere'>Sphere</option><option value='Wall'>Wall</option><option value='Choose'>Multiple Options</option></td>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"rowTargetNumber","<th><label for='TargetNumber'>Maximum Number of Targets:</label></th><td><input type='number' id='TargetNumber' name='TargetNumber' value=1 min=1 style='width:25px'><input type='checkbox' id='isTargetNumberUnlimited' name='isTargetNumberUnlimited' value=1 onchange='createTargetNumberToggle()'>Unlimited</td>");
	nextRowIndex++;
	
	if(){
		addTableRow(tableID,nextRowIndex,"Range","<th><label for='RangeType'>Range Type:</label></th><td><select id='RangeType' name='RangeType' onchange='createRangeTable()'><option value='Self'>Self</option><option value='SelfRanged'>Self with Range</option><option value='Touch'>Touch</option><option value='Ranged'>Ranged</option><option value='UnlimitedRange'>Unlimited Range</option></td>");
		nextRowIndex++;		
	}

	
	addTableRow(tableID,nextRowIndex,"rowMustTargetAll","<th><label for='MustTargetAll'>Must Affect All Valid Targets:</label></th><td><input type='checkbox' id='MustTargetAll' name='MustTargetAll'></td>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"rowMultitargetDistance","<tr id='rowMultitargetDistance'><th><label for='MultitargetDistance'>Maximum Distance Between Targets:</label></th><td><input type='number' id='MultitargetDistance' name='MultitargetDistance' value=5 min=0 style='width:25px' disabled><input type='checkbox' id='isMultitargetDistanceUnlimited' name='isMultitargetDistanceUnlimited' value=1 checked onchange='toggleFieldEnabled("+'"MultitargetDistance","isMultitargetDistanceUnlimited"'+")'>Same as Overall Range</td></tr>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"Missiles","<th><label for='isMissiles'>Is it a Missile Effect?</label></th><td><input type='checkbox' id='isMissiles' name='isMissiles' value=1></td>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"rowTargetCover","<th><label for='MaxCover'>Most Cover Target Can Be Behind:</th><td><select name='MaxCover' id='MaxCover'><option value='None'>None</option><option value='Half'>Half</option><option value='ThreeQuarters' selected>Three-Quarters</option><option value='Full'>Full</option></select></td>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"rowIsSight","<th><label for='isSight'>Requires Sight on Target:</label></th><td><input type='checkbox' id='isSight' name='isSight' value=1></td>");
	nextRowIndex++;
	
	addTableRow(tableID,nextRowIndex,"Target","<th><label for='TargetType'>Target Type:</label></th><td><select id='TargetType' name='TargetType' onchange='createTargetTable("+'"'+tableID+'"'+",1)'><option value='AnyCreature'>Any Creature</option><option value='AnyOtherCreature'>Any Other Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option><option value='Object'>Object</option><option value='CreatureObject'>Creature or Object</option><option value='Point'>Point</option><option value='Effect'>Effect</option><option value='FreeHand'>Free Hand</option></td>");
	nextRowIndex++;
}

async function createRangeTable(tableID){
	let table = document.getElementById(tableID);
	let nextRowIndex = document.getElementById("Range").rowIndex + 1;

	if(document.getElementById("RangeType").value == "SelfRanged" || document.getElementById("RangeType").value == "Ranged"){
		if(document.getElementById("rowRangeDistance") == null){
			addTableRow(tableID,nextRowIndex,"rowRangeDistance","<th><label for='RangeValue'>Range:</label></th><td><input type='number' id='RangeValue' name='RangeValue' min=0 style='width:25px' value=0><select id='RangeUnits' name='RangeUnits'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>");
			nextRowIndex;

			if(checkEffectType()=="Spell"){
				let RangeScalingAHLSelect = await createAHLSelect("RangeScalingAHL");
				addTableRow(tableID,nextRowIndex,"rowRangeDistanceAHL","<th>Range Increase AHL:</th><td><input type='number' id='RangeValueAHL' name='RangeValueAHL' min=0 style='width:25px' value=0>"+RangeScalingAHLSelect+"</td>");
				nextRowIndex;              
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

async function createTargetNumberToggle(){
	let table = document.getElementById("CreateSubeffectTable");

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

async function createTargetTable(primarySecondary){
	let table = document.getElementById("CreateSubeffectTable");
	let currentTargetTypeSelection;
	let startRowIndex;

	if(primarySecondary == 1){
		currentTargetTypeSelection = document.getElementById("TargetType").value;
		startRowIndex = document.getElementById("Target").rowIndex;
	}
	else if(primarySecondary == 2){
		currentTargetTypeSelection = document.getElementById("secondaryTargetType").value;
		startRowIndex = document.getElementById("rowSecondaryTarget").rowIndex;
	}    

	if(currentTargetTypeSelection == "Creature"){
		createCreatureTargetTable(primarySecondary);
	}
	else if(currentTargetTypeSelection == "Object"){
		createObjectTargetTable(primarySecondary);
	}
	else if(currentTargetTypeSelection == "Effect"){

	}
	else if(currentTargetTypeSelection == "Point"){
		let rowPointOnGround = table.insertRow(startRowIndex+1);
		rowPointOnGround.id = "rowPointOnGround";
		rowPointOnGround.innerHTML = "<th><label for='pointOnGround'>Point Must Be on the Ground:</label></th><td><input type='checkbox' id='pointOnGround' name='pointOnGround'></td>";

		let rowSecondaryTarget = table.insertRow(startRowIndex+2);
		rowSecondaryTarget.id = "rowSecondaryTarget";
		let secondaryTargetOptions = document.getElementById("TargetType").innerHTML;
		secondaryTargetOptions = "<option value='None'>None</option>" + secondaryTargetOptions;
		rowSecondaryTarget.innerHTML = "<th><label for='secondaryTargetType'>Secondary Target Type:</label></th><td><select id='secondaryTargetType' name='secondaryTargetType' onchange='createTargetTable(2)'></select></td>";
		
		document.getElementById("secondaryTargetType").innerHTML = secondaryTargetOptions;
		let secondaryTargetSelection = document.getElementById("secondaryTargetType");
		//removes Point option
		secondaryTargetSelection = document.getElementById("secondaryTargetType").remove(9);
		//removes Free Hand option
		secondaryTargetSelection = document.getElementById("secondaryTargetType").remove(10);
	}
	else{
		clearUnusedTable("CreateSubeffectTable","Target","submitRow");
	}
}
