async function createTransformRows(){
	let referenceRow = document.getElementById("rowIsTransform");
	let TransformChoice = document.getElementById("isTransform").value;
	let hasPriorSelection = document.getElementById("rowTransformEnd") != null;

	if(TransformChoice == ""){
		deleteInterveningElements(referenceRow,document.getElementById("rowTransformEnd").nextElementSibling);
	}
	else{
		if(document.getElementById("rowTransformEnd") == null){
			endRow = createTableRow(referenceRow,"rowTransformEnd","<th colspan=2></th>");
			endRow.classList.add("section-end");
			
			document.getElementById("howMitigate").addEventListener("change",createPreventTransformRow)
		}

		if(TransformChoice === "Cosmetic"){
			deleteInterveningElements(referenceRow,document.getElementById("rowTransformEnd"));
			referenceRow = createTableRow(referenceRow,"rowCosmeticTransformType","<th><label for='CosmeticTransformType'>Cosmetic Transformation Type:</th><td><select id='CosmeticTransformType' name='CosmeticTransformType'><option value='Illusory'>Illusion</option><option value='Physical'>Physical Change</option></select></td>");

			referenceRow = createTableRow(referenceRow,"rowCosmeticTransformHow","<th><label for='CosmeticTransformHow'>Cosmetic Transformation Method:</th><td><select id='CosmeticTransformHow' name='CosmeticTransformHow'><option value='Target'>Use Targeted Creature</option><option value='SameLimbs'>Anything with Same Limbs</option><option value='Anything'>Transform Into Anything</option></select></td>");
		}
		else if(TransformChoice === "Unique"){
			deleteInterveningElements(referenceRow,document.getElementById("rowTransformEnd"));

			//TODO: Create the other creature afterwards and have a way to add it to this feature - for things like NPCs with multiple forms
		}
		else{
			if(hasPriorSelection){
				deleteInterveningElements(referenceRow,document.getElementById("rowTransformAttributes"));
			}

			if(TransformChoice == "Single"){
				//TODO: Add validation when bestiary is created
				referenceRow = createTableRow(referenceRow,"rowSingleTransform","<th><label for='singleTransform'>Transform into Which Creature:</th><td><input type='text' id='singleTransform' name='singleTransform'></td>");
			}
			else if(TransformChoice == "Options"){
				//TODO: Add validation when bestiary is created
				referenceRow = createTableRow(referenceRow,"rowTransformOptions","<th><label for='TransformOptions'>Transformation Options:<br>(One per Row)</th><td><textarea id='TransformOptions' name='TransformOptions' rows='5' style='width:100%'></textarea></td>");
			}
			else if(TransformChoice == "Criteria"){
				referenceRow = createTableRow(referenceRow,"rowIsTransformSeenList","<th><label for='IsTransformSeenList'>Options Must Have Been Seen:</th><td><input type='checkbox' id='isTransformSeenList' name='isTransformSeenList'></td>");

				referenceRow = createTableRow(referenceRow,"rowTransformCRMaxMethod","<th><label for='TransformCRMaxMethod'>How Maximum CR is Chosen:</th><td><select id='TransformCRMaxMethod' name='TransformCRMaxMethod'><option value='Level'>Level or CR-Based</option><option value='Fixed'>Fixed Value</option></select></td>");
				document.getElementById("TransformCRMaxMethod").addEventListener("change",function(){
					let CRMaxSpan = document.getElementById("TransformCRMaxMethodSpan");
					if(this.value === "Level"){
						CRMaxSpan.innerHTML = "Level or CR <select id='TransformCRMaxModifierHow' name='TransformCRMaxModifierHow'><option value='Add'>Plus</option><option value='Minus'>Minus</option><option value='Multiply' selected>Times</option><option value='Divide'>Divided By</option></select><input type='number' id='TransformCRMaxModifier' name='TransformCRMaxModifier' class='small-number' value=1 step='0.5'>";
					}
					else{
						CRMaxSpan.innerHTML = "<input type='number' id='TransformCRMax' name='TransformCRMax' min=0 value=2 class='small-number'><span id='TransformCRMaxAHLSpan'></span>";

						if(checkEffectType()=="Spell"){
							let TransformCRMaxAHLScalingSelect = createAHLSelect("TransformCRMaxAHLScaling");
							document.getElementById("TransformCRMaxAHLSpan").innerHTML = "<select id='TransformCRMaxAHLScaleHow' name='TransformCRMaxAHLScaleHow'><option value='Add'>Plus</option><option value='Multiply'>Times</option></select><input type='number' id='TransformCRMaxAHLNum' name='TransformCRMaxAHLNum' min=0 value=0 class='small-number'>"+TransformCRMaxAHLScalingSelect;
						}
					}
				});

				referenceRow = createTableRow(referenceRow,"rowTransformCRMax","<th><label for='TransformCRMax'>Maximum CR of Creature:</th><td><span id='TransformCRMaxMethodSpan'></span></td>");
				document.getElementById("TransformCRMaxMethod").dispatchEvent(new Event("change"));

				referenceRow = createTableRow(referenceRow,"rowIsCreatureTypeLimitsTransform","<th><label for='isCreatureTypeLimitsTransform'>Filter By Creature Type:</th><td><select id='isCreatureTypeLimitsTransform' name='isCreatureTypeLimitsTransform'><option value=''>No Filter</option><option value='Inclusive'>Include Choices</option><option value='Exclusive'>Exclude Choices</option></select></td>");
				document.getElementById("isCreatureTypeLimitsTransform").addEventListener("change",function(){
					createCreatureTypeRows("Transform");
				});

				referenceRow = createTableRow(referenceRow,"rowIsCreatureSubtypeLimitsTransform","<th><label for='isCreatureSubtypeLimitsTransform'>Filter By Creature Subtype:</th><td><select id='isCreatureSubtypeLimitsTransform' name='isCreatureSubtypeLimitsTransform'><option value=''>No Filter</option><option value='Inclusive'>Include Choices</option><option value='Exclusive'>Exclude Choices</option></select></td>");
				document.getElementById("isCreatureSubtypeLimitsTransform").addEventListener("change",function(){
					createCreatureSubtypeRows("Transform");
				});

				referenceRow = createTableRow(referenceRow,"rowSizePrereqsTransform","<th><label for='SizePrereqsTransform'>Filter By Creature Size:</th><td><select id='SizePrereqsTransform' name='SizePrereqsTransform'><option value=''>No Filter</option><option value='Range'>Min/Maximum Sizes</option><option value='RelativeMaximum'>Maximum Relative to User's Size</option><option value='RelativeMinimum'>Minimum Relative to User's Size</option><option value='Relative'>Min/Maximum Relative to User's Size</option><option value='Inclusive'>Include Specific Sizes</option><option value='Exclusive'>Exclude Specific Sizes</option></select></td>");
				document.getElementById("SizePrereqsTransform").addEventListener("change",function(){
					createSizePrereqRows("Transform");
				});

				referenceRow = createTableRow(referenceRow,"rowSpeedPrereqsTransform","<th><label for='SpeedPrereqsTransform'>Filter By Creature Speed:</th><td><select id='SpeedPrereqsTransform' name='SpeedPrereqsTransform'><option value=''>No Filter</option><option value='Inclusive'>Include Specific Speed Types</option><option value='Exclusive'>Exclude Specific Speed Types</option><option value='Range'>Min/Maximum Speeds</option><option value='Relative'>Relative to User's Speed</option></select></td>");
				document.getElementById("SpeedPrereqsTransform").addEventListener("change",function(){
					createSpeedPrereqRows("Transform");
				});
			}

			if(!hasPriorSelection){
				referenceRow = createTableRow(referenceRow,"rowTransformHP","<th><label for='TransformHP'>Use Transformation's HP:</label></th><td><select id='TransformHP' name='TransformHP'><option value='Regular'>Gain HP and Hit Dice</option><option value='TempHP'>Gain HP as Temp HP</option><option value='None'>Gain No HP</option></select></td>");
				document.getElementById("TransformHP").addEventListener("change",function(){
					let referenceRow = document.getElementById("rowTransformHP");
					let HPChoice = this.value;

					if(HPChoice === "TempHP"){
						referenceRow = createTableRow(referenceRow,"rowTransformTempHP","<th><label for='TransformTempHP'>Temporary HP Gained:</label></th><td><select id='TransformTempHP' name='TransformTempHP'></select></td>");
					}
					else{
						let transformTempHPRow = document.getElementById("rowTransformTempHP");
						if(transformTempHPRow !== null){
							transformTempHPRow.remove();
						}
					}
				});

				referenceRow = createTableRow(referenceRow,"rowTransformLoseHP","<th><label for='TransformLoseHP'>Effect On Losing Gained HP:</label></th><td><select id='TransformLoseHP' name='TransformLoseHP'><option value='CarryOver'>Revert and Take Remaining Damage</option><option value='Persist'>Transformation Persists</option></select></td>");

				referenceRow = createTableRow(referenceRow,"rowTransformAttributes","<th><label for='TransformAttributes'>Retain Which Ability Scores:</label></th><td><select id='TransformAttributes' name='TransformAttributes'><option value='All'>Retain All Ability Scores</option><option value='RetainMental'>Retain Mental Ability Scores</option><option value='RetainPhysical'>Retain Physical Ability Scores</option><option value='Include'>Include Specific Ability Scores</option><option value='Exclude'>Exclude Specific Ability Scores</option><option value='None'>Retain No Ability Scores</option></select></td>");
				document.getElementById("TransformAttributes").addEventListener("change",createTransformAttributesRows);

				referenceRow = createTableRow(referenceRow,"rowIsRetainAlignment","<th><label for='isRetainAlignment'>Retain Alignment and Personality:</label></th><td><input type='checkbox' id='isRetainAlignment' name='isRetainAlignment' checked></td>");

				referenceRow = createTableRow(referenceRow,"rowIsRetainConcentration","<th><label for='isRetainConcentration'>Can Continue Concentrating on Spells:</label></th><td><input type='checkbox' id='isRetainConcentration' name='isRetainConcentration' checked></td>");

				let featureTypes = [
					{Name:"Senses",DisplayName:"Senses"},
					{Name:"Proficiencies",DisplayName:"Proficiencies"},
					{Name:"Spellcasting",DisplayName:"Spellcasting"},
					{Name:"InnateSpellcasting",DisplayName:"Innate Spellcasting"},
					{Name:"LegendaryActions",DisplayName:"Legendary Actions"},
					{Name:"LegendaryResistances",DisplayName:"Legendary Resistances"},
					{Name:"LairActions",DisplayName:"Lair Actions"},
					{Name:"OtherFeatures",DisplayName:"All Other Features"}
				]
				let featureTypeOptionsNotGained = createHTMLMultiselectOptions(featureTypes,"TransformNewFeatureLimits");
				featureTypes.push({Name:"ReasonableFeatures",DisplayName:"Other Features if Reasonable"},{Name:"ThisFeature",DisplayName:"Keep This Feature"});
				let oldFeaturesNotUsed = createHTMLMultiselectOptions(featureTypes,"TransformOldFeatureLimits");

				referenceRow = createTableRow(referenceRow,"rowTransformFeatureLimitsTitle","<th style='text-align:center'>Old Form Features Kept</th><th style='text-align:center'>New Form Features Gained</th>");

				referenceRow = createTableRow(referenceRow,"rowTransformFeatureLimits","<td><div class='check-multiple' style='width:100%'>"+oldFeaturesNotUsed+"</div></td><td><div class='check-multiple' style='width:100%'>"+featureTypeOptionsNotGained+"</div></td>");

				referenceRow = createTableRow(referenceRow,"rowTransformItemLimits","<th><label for='TransformItemLimits'>Can Items Be Used While Transformed:</label></th><td><select id='TransformItemLimits' name='TransformItemLimits'><option value='None'>No Items Usable</option><option value='Reasonable'>If Reasonable for Form</option><option value='Passive'>Passive Effects Only</option><option value=''>No Limits</option></select></td>");

				referenceRow = createTableRow(referenceRow,"rowTransformItemDestination","<th><label for='TransformItemDestination'>What Happens to Unusable Items:</label></th><td><select id='TransformItemDestination' name='TransformItemDestination'><option value='Merged'>Merge With Form</option><option value='Drop'>Dropped on Ground</option><option value='Choice'>Per-Item Choice</option></select></td>");
			}
		}
	}
}

async function createTransformAttributesRows(){
	let referenceRow = document.getElementById("rowTransformAttributes");
	let attributesChoice = this.value;
	if(attributesChoice === "Include" || attributesChoice === "Exclude"){
		if(document.getElementById("rowTransformAttributesInclude") === null){
			let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
			let allAttributes = await request.json();
			let AttributeOptions = createHTMLMultiselectOptions(allAttributes,"TransfomAttributes");

			referenceRow = createTableRow(referenceRow,"rowTransformAttributesInclude","<th><span id='TransformAttributesIncludeTitle'></span> Attributes</th><td><span class='check-multiple' style='width:100%'>"+AttributeOptions+"</span></td>");
		}
		
		if(attributesChoice === "Include"){
			document.getElementById("TransformAttributesIncludeTitle").innerHTML = "Changed";
		}
		else{
			document.getElementById("TransformAttributesIncludeTitle").innerHTML = "Retained";
		}
	}
	else{
		if(referenceRow.nextElementSibling.id === "rowTransformAttributesInclude"){
			referenceRow.nextElementSibling.remove();
		}
	}
}

function createPreventTransformRow(){
	let howMitigate = document.getElementById("howMitigate").value;
	let referenceRow = document.getElementById("rowTransformEnd").previousElementSibling;
	let preventTransformRow = document.getElementById("rowPreventTransform");

	if((howMitigate === "None" || howMitigate === "Attack") && preventTransformRow === null){
		return;
	}
	else if(howMitigate === "None" || howMitigate === "Attack"){
		preventTransformRow.remove();
	}
	else if(preventTransformRow === null){
		if(howMitigate != "Attack"){
			referenceRow = createTableRow(referenceRow,"rowPreventTransform","<th><label for='PreventTransform'><span id='PreventTransformSpan'></span> Prevents Transformation:</label></th><td><input type='checkbox' id='PreventTransform' name='PreventTransform'></td>");

			if(howMitigate === "Save"){
				document.getElementById("PreventTransformSpan").innerHTML = "Save";
			}
			else{
				document.getElementById("PreventTransformSpan").innerHTML = "Check";
			}
		}

	}
	else{
		if(howMitigate === "Save"){
			document.getElementById("PreventTransformSpan").innerHTML = "Save";
		}
		else{
			document.getElementById("PreventTransformSpan").innerHTML = "Check";
		}
	}

}