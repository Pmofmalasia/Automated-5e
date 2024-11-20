function revertTransformation(FormID,ParentTokenID){
	let ParentToken = MapTool.tokens.getTokenByID(ParentTokenID);
	let allOldForms = JSON.parse(ParentToken.getProperty("a5e.stat.PreviousForms"));

	let thisFormIndex;
	let OldForm;
	let i = 0;
	for(let form of allOldForms){
		if(form.AssociatedCondition == FormID){
			OldForm = form;
			thisFormIndex = i;
			break;
		}
		i++;
	}

	if(thisFormIndex === undefined){
		return JSON.stringify({
			Table:[],
			RevertedForms:""
		});
	}
let newMacros = [];
	let NewFormDisplayName = OldForm.NextFormName;
	if(thisFormIndex === 0){
		//Revert form now
		let inventory = JSON.parse(ParentToken.getProperty("a5e.stat.Inventory"));
		for(let i = inventory.length - 1; i >= 0; --i){
			if(inventory[i].AssociatedCondition === FormID){
				inventory.splice(i,1);
			}
		}

		let currentPropTypeProps = JSON.parse(MTScript.execMacro(`[r:getPropertyNamesRaw("json","${ParentTokenID}")]`));
		let OldFormProps = OldForm.Properties;
		let OldFormPropNames = OldForm.RawPropertyNames;
		inventory = inventory.concat(OldFormProps["a5e.stat.Inventory"]);
		for(let prop of currentPropTypeProps){
			MapTool.chat.broadcast(prop);
			let oldHasProp = OldFormPropNames.includes(prop);
			let newPropValue = ParentToken.getProperty(prop);
			let newHasProp = (newPropValue !== "null" && newPropValue !== null);
			if(oldHasProp){
				let oldPropValue = OldFormProps[prop];
				if(oldPropValue === undefined){
					oldPropValue = "";
				}
				if(typeof oldPropValue === "string"){
					ParentToken.setProperty(prop,oldPropValue);
				}
				else{
					ParentToken.setProperty(prop,JSON.stringify(oldPropValue));
				}
			}
			else{
				ParentToken.setProperty(prop,MTScript.execMacro("[h:switchToken('"+ParentTokenID+"')][r:getPropertyDefault('"+prop+"')]"));
			}
		}
		ParentToken.setProperty("a5e.stat.Inventory",JSON.stringify(inventory));

		let thisFormMacros = JSON.parse(MTScript.execMacro("[r:getMacros('json','"+ParentTokenID+"')]"));
		for(let macroName of thisFormMacros){
			let thisMacroIndex = JSON.parse(MTScript.execMacro("[r:getMacroIndexes("+'"'+macroName+'"'+",'json','"+ParentTokenID+"')]"));
			
			for(let index of thisMacroIndex){
				MTScript.execMacro("[r:removeMacro("+index+",'"+ParentTokenID+"')]");
			}
		}

		newMacros = OldForm.Macros;
		for(let macro of newMacros){
			ParentToken.setProperty("a5e.stat.js.tempMacroData",JSON.stringify(macro));
			MTScript.execMacro(`[r:createMacro(getProperty('a5e.stat.js.tempMacroData','`+ParentTokenID+`'),"`+ParentTokenID+`")]`);
		}
		MTScript.execMacro(`[r:resetProperty("a5e.stat.js.tempMacroData","`+ParentTokenID+`")]`);

		let OldFormMTProps = OldForm.MTProperties;
		MTScript.execMacro("[r:setTokenImage('"+OldFormMTProps.tokenImage+"','"+ParentTokenID+"')]");
		MTScript.execMacro("[r:setTokenPortrait('"+OldFormMTProps.tokenPortrait+"','"+ParentTokenID+"')]");
		MTScript.execMacro("[r:setTokenHandout('"+OldFormMTProps.tokenHandout+"','"+ParentTokenID+"')]");
		MTScript.execMacro("[r:setSightType('"+OldFormMTProps.Sight+"','"+ParentTokenID+"')]");
		MTScript.execMacro("[r:setSize('"+OldFormMTProps.size+"','"+ParentTokenID+"')]");
		
		allOldForms.splice(thisFormIndex,1);
	}
	else{
		//Does not actually revert as it's not the current form - merges this data and previous data

		let RemovedForm = allOldForms[thisFormIndex - 1];
		OldForm.NextFormName = RemovedForm.NextFormName;

		let OldFormProps = OldForm.Properties;
		let inventory = RemovedForm.Properties["a5e.stat.Inventory"];
		for(let i = inventory.length - 1; i >= 0; --i){
			if(inventory[i].AssociatedCondition === FormID){
				inventory.splice(i,1);
			}
		}
		inventory = inventory.concat(OldFormProps["a5e.stat.Inventory"]);

		OldForm.Properties["a5e.stat.Inventory"] = inventory;
		OldForm.AssociatedCondition = RemovedForm.AssociatedCondition;
		
		allOldForms[thisFormIndex] = OldForm;
		allOldForms.splice(thisFormIndex - 1,1);
	}

	ParentToken.setProperty("a5e.stat.PreviousForms",JSON.stringify(allOldForms));

	return JSON.stringify({
		"Table":[{
			"ShowIfCondensed":1,
			"Header":"Transformation Reverted",
			"FalseHeader":"",
			"FullContents":NewFormDisplayName,
			"RulesContents":"",
			"RollContents":"",
			"DisplayOrder":['Rules','Roll','Full']
		}],
		"RevertedForms":""
	});
}

MTScript.registerMacro("a5e.RevertTransformation",revertTransformation);