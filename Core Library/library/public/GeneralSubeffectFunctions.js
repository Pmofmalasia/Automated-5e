function createLightTable(endRowID,idSuffix,isModifyRows){
	let finalIDSuffix = "";
	if(arguments.length > 1){
		finalIDSuffix = idSuffix;
	}
	let tableID = document.getElementById("rowLightType"+finalIDSuffix).closest("table").id;

	let nextRowIndex = document.getElementById("rowLightType"+finalIDSuffix).rowIndex+1;
	let lightSelection = document.getElementById("lightType"+finalIDSuffix).value;

	clearUnusedTable(tableID,"rowLightType"+finalIDSuffix,endRowID);

	if(lightSelection == ""){

	}
	else{
		if(lightSelection == "Darkness"){
			addTableRow(tableID,nextRowIndex,"rowLightInfo"+finalIDSuffix,"<th><label for='lightDistanceValue"+finalIDSuffix+"'>Size of Darkness:</label></th><td><input type='number' id='lightDistanceValue"+finalIDSuffix+"' name='lightDistanceValue"+finalIDSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+finalIDSuffix+"' name='lightDistanceUnits"+finalIDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>");
			nextRowIndex++;
		}
		else if(lightSelection == "BrightDim"){
			addTableRow(tableID,nextRowIndex,"rowLightInfo"+finalIDSuffix,"<th><label for='lightDistanceValue"+finalIDSuffix+"'>Size of Light/Dim Light:</label></th><td><input type='number' id='lightDistanceValue"+finalIDSuffix+"' name='lightDistanceValue"+finalIDSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+finalIDSuffix+"' name='lightDistanceUnits"+finalIDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select> bright <b>+</b> <input type='number' id='secondaryLightDistanceValue"+finalIDSuffix+"' name='secondaryLightDistanceValue"+finalIDSuffix+"' min=0 value=30 style='width:25px'> dim</td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowIsSunlight"+finalIDSuffix,"<th><label for='isSunlight"+finalIDSuffix+"'>Counts as Sunlight:</label></th><td><input type='checkbox' id='isSunlight"+finalIDSuffix+"' name='isSunlight"+finalIDSuffix+"' value=1></td>");
			nextRowIndex++;
		}
		else if(lightSelection == "Obscure"){
			addTableRow(tableID,nextRowIndex,"rowLightInfo"+finalIDSuffix,"<th><label for='lightDistanceValue"+finalIDSuffix+"'>Size of Obscured Area:</label></th><td><input type='number' id='lightDistanceValue"+finalIDSuffix+"' name='lightDistanceValue"+finalIDSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+finalIDSuffix+"' name='lightDistanceUnits"+finalIDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>");
			nextRowIndex++;
		}
		else{
			addTableRow(tableID,nextRowIndex,"rowLightInfo"+finalIDSuffix,"<th><label for='lightDistanceValue"+finalIDSuffix+"'>Size of Light:</label></th><td><input type='number' id='lightDistanceValue"+finalIDSuffix+"' name='lightDistanceValue"+finalIDSuffix+"' min=0 value=30 style='width:25px'><select id='lightDistanceUnits"+finalIDSuffix+"' name='lightDistanceUnits"+finalIDSuffix+"'><option value='Feet'>Feet</option><option value='Miles'>Miles</option></select></td>");
			nextRowIndex++;

			addTableRow(tableID,nextRowIndex,"rowIsSunlight"+finalIDSuffix,"<th><label for='isSunlight"+finalIDSuffix+"'>Counts as Sunlight:</label></th><td><input type='checkbox' id='isSunlight"+finalIDSuffix+"' name='isSunlight"+finalIDSuffix+"' value=1></td>");
			nextRowIndex++;
		}

		addTableRow(tableID,nextRowIndex,"rowIsLightCone"+finalIDSuffix,"<th><label for='isLightCone"+finalIDSuffix+"'>Cone-Shaped Light:</label></th><td><input type='checkbox' id='isLightCone"+finalIDSuffix+"' name='isLightCone"+finalIDSuffix+"'></td>");
		nextRowIndex++;

		if(isModifyRows != null){
			addTableRow(tableID,nextRowIndex,"rowLightCanModify"+finalIDSuffix,"<th><label for='lightCanModify"+finalIDSuffix+"'>Modifiable Light:</label></th><td><select id='lightCanModify"+finalIDSuffix+"' name='lightCanModify"+finalIDSuffix+"' onchange=''><option value='createModifyLightTable("+'"'+idSuffix+'"'+")'>No</option><option value='Block'>Block Light</option><option value='Change'>Change Characteristics</option></select></td>");
			nextRowIndex++;

			if(document.getElementById("aoeShape") != null){
				if(document.getElementById("aoeShape").value != "None"){
					let UseAoESizeIndex = document.getElementById("rowLightInfo"+finalIDSuffix).rowIndex+1;
					addTableRow(tableID,UseAoESizeIndex,"rowLightUseAoESize"+finalIDSuffix,"<th><label for='isLightUseAoESize"+finalIDSuffix+"'>Use AoE For Size:</label></th><td><input type='checkbox' id='isLightUseAoESize"+finalIDSuffix+"' name='isLightUseAoESize"+finalIDSuffix+"' onchange='toggleFieldEnabled("+'"lightDistanceValue'+finalIDSuffix+'","isLightUseAoESize'+finalIDSuffix+'"'+")'></td>");
				}		
			}			
		}
	}
}

function createModifyLightTable(idSuffix,addRemoveLast){
	let tableID = document.getElementById("rowLightType"+idSuffix).closest("table").id;

	if(addRemoveLast == null){
		let nextRowIndex = document.getElementById("rowLightCanModify"+idSuffix).rowIndex + 1;
		
		addTableRow(tableID,nextRowIndex,"rowLightType","<th><label for='lightType'>Creates a Light or Darkness?</label></th><td><select id='lightType' name='lightType' onchange='createLightTable("+'"rowIsMoveTarget"'+")'><option value=''>No Light</option><option value='Dim'>Dim Light</option><option value='Bright'>Bright Light</option><option value='BrightDim'>Bright + Dim Light</option><option value='Darkness'>Darkness</option><option value='Obscure'>Heavily Obscure</option></select></td>");
		nextRowIndex++;
	}
}