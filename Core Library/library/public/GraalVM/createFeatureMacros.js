function createFeatureMacros(features,ParentTokenID){
	if(typeof features === "string"){
		features = JSON.parse(features);
	}

	let baseMacroProps = {
		applyToSelected:0,
		autoExecute:1,
		fontSize:"1.00em",
		includeLabel:0,
		group:" New Macros",
		minWidth:89,
		playerEditable:0,
		delim:"json"
	};

	let newMacroIndices = [];
	for(let feature of features){
		if(feature.ButtonInfo !== undefined){
			for(let button of feature.ButtonInfo){
				let macroProps = baseMacroProps;
				let macroLabel = button.DisplayName;
	
				if(button.Marker !== undefined && button.Marker !== ""){
					macroLabel += " "+button.Marker;
				}
	
				if(button.UseTime !== undefined && button.UseTime !== "" && button.UseTime !== "action"){
					macroLabel += " <b>("+button.UseTime+")</b>";
				}
	
				macroProps.label = macroLabel;
	
				let borderColors = JSON.parse(MTScript.execMacro(`[r:pm.a5e.BorderColors("${button["Class"]}","","${ParentTokenID}")]`));
				macroProps.color = borderColors.Border;
				macroProps.fontColor = borderColors.Title;
	
				let subeffectCallingText = "";
				if(button.Subclass !== ""){
					subeffectCallingText = " ### "+button.Subclass;
				}
				macroProps.command = `[MACRO("${button.Name} ### ${button["Class"]}${subeffectCallingText}@Lib:${button.Library}"): json.set("","ParentToken",currentToken(),"IsTooltip",0)]`;
				macroProps.tooltip = `[MACRO("${button.Name} ### ${button["Class"]}${subeffectCallingText}@Lib:${button.Library}"): json.set("","ParentToken",currentToken(),"IsTooltip",1)]`;

				MTScript.setVariable("macroProps",JSON.stringify(macroProps));
				let thisNewMacroIndex = MTScript.evalMacro(`[r:newMacro = createMacro(macroProps,"${ParentTokenID}")]`);

				newMacroIndices.push(thisNewMacroIndex);
			}
		}

		if(feature.Effects !== undefined){
			let i = 0;
			for(let effect of feature.Effects){
				let macroProps = baseMacroProps;
				let macroLabel = effect.DisplayName;
				if(macroLabel === ""){
					macroLabel = feature.DisplayName;
				}
	
				if(effect.UseTime !== undefined){
					let UseTimeUnits = effect.UseTime.Units;
					if(UseTimeUnits !== undefined){
						let valueDisplay = "";
						if(UseTimeUnits !== "action" && UseTimeUnits === "reaction" && UseTimeUnits !== "bonus"){
							valueDisplay = effect.UseTime.Value+" ";
						}
						let unitsDisplay = "";
						if(UseTimeUnits !== "action" && UseTimeUnits !== ""){
							unitsDisplay = UseTimeUnits.toUpperCase();
						}

						if(unitsDisplay !== ""){
							macroLabel += " <b>("+valueDisplay+unitsDisplay+")</b>";
						}
					}
				}
	
				macroProps.label = macroLabel;
	
				let borderColors = JSON.parse(MTScript.execMacro(`[r:pm.a5e.BorderColors("${feature["Class"]}","","${ParentTokenID}")]`));
				macroProps.color = borderColors.Border;
				macroProps.fontColor = borderColors.Title;
	
				let subeffectCallingText = "";
				if(feature.Subclass !== ""){
					subeffectCallingText = " ### "+feature.Subclass;
				}
				macroProps.command = `[h:FeatureData = json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"\\\$[*][?(@.Name=='${feature.Name}' && @.Class=='${feature["Class"]}' && @.Subclass=='${feature.Subclass}')]"),0)]
[h:FeatureEffect = json.get(json.get(FeatureData,"Effects"),${i})]
[r,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): json.set(FeatureData,"ParentToken",currentToken(),"IsTooltip",0,"Effect",FeatureEffect)]`;
				macroProps.tooltip = `[h:FeatureData = json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"\\\$[*][?(@.Name=='${feature.Name}' && @.Class=='${feature["Class"]}' && @.Subclass=='${feature.Subclass}')]"),0)][h:FeatureEffect = json.get(json.get(FeatureData,"Effects"),${i})][r,MACRO("FeatureTooltipBorder@Lib:pm.a5e.Core"): json.set(FeatureData,"ParentToken",currentToken(),"IsTooltip",1,"Effect",FeatureEffect)]`;
				i++;

				MTScript.setVariable("macroProps",JSON.stringify(macroProps));
				let thisNewMacroIndex = MTScript.evalMacro(`[r:newMacro = createMacro(macroProps,"${ParentTokenID}")]`);

				newMacroIndices.push(thisNewMacroIndex);
			}
		}
	}

	return JSON.stringify(newMacroIndices);
}

MTScript.registerMacro("a5e.CreateFeatureMacros",createFeatureMacros);