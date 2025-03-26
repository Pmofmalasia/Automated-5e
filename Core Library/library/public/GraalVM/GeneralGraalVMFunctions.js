function sortData(data,key){
	if(key === undefined){
		return data.sort(function(a,b){
			if ( a.Name < b.Name ){
				return -1;
			}
			if ( a.Name > b.Name ){
				return 1;
			}
				return 0;
		});		
	}
	else{
		return data.sort(function(a,b){
			if ( a[key] < b[key] ){
				return -1;
			}
			if ( a[key] > b[key] ){
				return 1;
			}
				return 0;
		});
	}
}

function createDisplayList(list,word,options){
	let isVariableDelimiter = false;
	if(options !== undefined){
		isVariableDelimiter = options.VariableDelimiter;
		if(isVariableDelimiter === undefined){
			isVariableDelimiter = false;
		}
	}

	if(list.length === 0){
		return "";
	}
	else if(list.length === 1){
		return list[0];
	}
	else if(list.length === 2){
		return list[0]+" "+word+" "+list[1];
	}
	else{
		let display = "";
		let delimiter = ",";
		if(isVariableDelimiter){
			delimiter = "%{VerticalListFormat}";
		}
		for(let i = 0; i < list.length; i++){
			display += delimiter+" ";
			if(i === list.length - 1){
				display += word+" ";
			}
			display += list[i];
		}

		return display;
	}
}

function jsonIsEmpty(json){
	if(typeof json !== "object"){
		return null;
	}
	else{
		if(Array.isArray(json)){
			return (json.length === 0);
		}
		else{
			for(let key in json){
				return false;
			}
			return true;
		}
	}
}

function jsonUnique(data,keys){
	let uniqueEntries = [];
	for(let entry of data){
		let finalEntry = entry;
		if(keys !== undefined){
			for(let key of keys){
				finalEntry = finalEntry[key];
				if(finalEntry === undefined){
					continue;
				}
			}
		}

		if(finalEntry !== undefined){
			uniqueEntries.push(entry);
		}
	}

	return uniqueEntries;
}

function jsonUniqueMTScript(data,keys){
	if(typeof data === "string"){
		data = JSON.parse(data);
	}

	if(typeof keys === "string"){
		keys = JSON.parse(keys);
	}

	let uniqueEntries = jsonUnique(data,keys);

	return JSON.stringify(uniqueEntries);
}

function getFeatureScalingLevel(feature){
	if(feature.OverallScaling === undefined){
		return feature.Level;
	}
	else{
		let tiers = feature.OverallScaling;
		for(let i = tiers.length - 1; i >= 0; --i){
			if(tiers[i] <= feature.Level){
				return i+1;
			}
		}
	}
}

function getFeatureProperty(identifier,ParentToken){
	let featureType = identifier.AbilityType;
	if(featureType === "Feature"){
		let features = JSON.parse(ParentToken.getProperty("a5e.stat.AllFeatures"));
		for(let feature of features){
			if(feature.Name === identifier.Name && feature["Class"] === identifier["Class"] && feature.Subclass === identifier.Subclass){
				feature.AbilityType = "Feature";
				return feature;
			}
		}
	}
	else if(featureType === "Condition"){
		let features = JSON.parse(ParentToken.getProperty("a5e.stat.ConditionList"));
		for(let feature of features){
			if(feature.Name === identifier.Name && feature["Class"] === identifier["Class"] && feature.Subclass === identifier.Subclass){
				feature.AbilityType = "Condition";
				return feature;
			}
		}
	}
	else if(featureType === "Item"){
		let items = JSON.parse(ParentToken.getProperty("a5e.stat.Inventory"));
		for(let item of items){
			if(item.ItemID === identifier.ItemID){
				item.AbilityType = "Item"
				return item;
			}
		}
	}
	else if(featureType === "ItemCondition"){
		let items = JSON.parse(ParentToken.getProperty("a5e.stat.Inventory"));
		for(let item of items){
			let thisItemConditions = item.ItemConditions;
			if(thisItemConditions === undefined){
				continue;
			}

			for(let condition of thisItemConditions){
				if(condition.Name === identifier.Name && condition["Class"] === identifier["Class"] && condition.Subclass === identifier.Subclass){
					feature.AbilityType = "ItemCondition";
					feature.ItemID = item.ItemID;
					return feature;
				}				
			}
		}
	}
}

function setFeatureProperty(newFeature,ParentToken,keys){
	let featureType = newFeature.AbilityType;
	let i=0;
	if(featureType === "Feature"){
		let features = JSON.parse(ParentToken.getProperty("a5e.stat.AllFeatures"));
		for(let feature of features){
			if(feature.Name === newFeature.Name && feature["Class"] === newFeature["Class"] && feature.Subclass === newFeature.Subclass){
				if(keys === undefined){
					delete newFeature.AbilityType;
					feature = newFeature;
				}
				else{
					for(let key of keys){
						feature[key] = newFeature[key];
					}
				}

				features[i] = feature;
				ParentToken.setProperty("a5e.stat.AllFeatures",JSON.stringify(features));
				return features;
			}
			i++;
		}
	}
	else if(featureType === "Condition"){
		let features = JSON.parse(ParentToken.getProperty("a5e.stat.ConditionList"));
		for(let feature of features){
			if(feature.Name === newFeature.Name && feature["Class"] === newFeature["Class"] && feature.Subclass === newFeature.Subclass){
				if(keys === undefined){
					delete newFeature.AbilityType;
					feature = newFeature;
				}
				else{
					for(let key of keys){
						feature[key] = newFeature[key];
					}
				}

				features[i] = feature;
				ParentToken.setProperty("a5e.stat.ConditionList",JSON.stringify(features));
				return features;
			}
			i++;
		}
	}
	else if(featureType === "Item"){
		let items = JSON.parse(ParentToken.getProperty("a5e.stat.Inventory"));
		for(let item of items){
			if(item.ItemID === newFeature.ItemID){
				if(keys === undefined){
					delete newFeature.AbilityType;
					item = newFeature;
				}
				else{
					for(let key of keys){
						item[key] = newFeature[key];
					}
				}

				items[i] = item;
				ParentToken.setProperty("a5e.stat.Inventory",JSON.stringify(items));
				return items;
			}
			i++;
		}
	}
	else if(featureType === "ItemCondition"){
		let items = JSON.parse(ParentToken.getProperty("a5e.stat.Inventory"));
		for(let item of items){
			let thisItemConditions = item.ItemConditions;
			if(thisItemConditions === undefined){
				continue;
			}

			if(newFeature.ItemID !== undefined){
				if(item.ItemID !== newFeature.ItemID){
					continue;
				}
			}

			let j = 0;
			for(let condition of thisItemConditions){
				if(condition.Name === newFeature.Name && condition["Class"] === newFeature["Class"] && condition.Subclass === newFeature.Subclass){
					if(keys === undefined){
						delete newFeature.AbilityType;
						delete newFeature.ItemID;
						condition = newFeature;
					}
					else{
						for(let key of keys){
							condition[key] = newFeature[key];
						}
					}

					thisItemConditions[j] = condition;
					items[i].ItemConditions = thisItemConditions;
					ParentToken.setProperty("a5e.stat.Inventory",JSON.stringify(items));
					return items;
				}
				j++;
			}
		}
		i++;
	}
}

function compareFeatureIdentifier(identifier,feature){
	let type = identifier.Type;
	if(type !== feature.AbilityType){
		return false;
	}

	if(type === "Feature"){
		return (identifier.Name === feature.Name && identifier["Class"] === feature["Class"] && identifier.Subclass === feature.Subclass);
	}
	else if(type === "Condition"){
		if(identifier.GroupID === undefined){
			return (identifier.Name === feature.Name && identifier["Class"] === feature["Class"] && identifier.Subclass === feature.Subclass);
		}
		else{
			return (identifier.GroupID === feature.GroupID);
		}
	}
	else if(type === "Item"){
		if(identifier.ItemID === undefined){
			if(identifier.ObjectID === undefined){
				return (identifier.Name === feature.Name && identifier["Class"] === feature["Class"] && identifier.Subclass === feature.Subclass);
			}
			else{
				return (identifier.ObjectID === feature.ObjectID);
			}
		}
		else{
			return (identifier.ItemID === feature.ItemID);
		}
	}
}

function timeInRounds(value,units){
	function convertSingleUnit(value,unit){
		unit = unit.toLowerCase();
		if(unit === "year"){
			return value * 5256000;
		}
		else if(unit === "day"){
			return value * 14400;
		}
		else if(unit === "hour"){
			return value * 600;
		}
		else if(unit === "minute"){
			return value * 10;
		}
		else{
			return value;
		}		
	}

	let finalTime = 0;
	if(arguments.length === 1){
		let allUnits = Object.keys(value);
		for(let unit of allUnits){
			let thisUnitInRounds = convertSingleUnit(value[unit],unit);
			finalTime += thisUnitInRounds;
		}
	}
	else{
		finalTime = convertSingleUnit(value,units);
	}

	return finalTime;
}

function roundsToTime(value){
	let time = {};
	if(value >= 5256000){
		let years = Math.floor(value / 5256000);
		value = value % 5256000;
		time.year = years;
	}
	
	if(value >= 14400){
		let days = Math.floor(value / 14400);
		value = value % 14400;
		time.day = days;
	}
	
	if(value >= 600){
		let hours = Math.floor(value / 600);
		value = value % 600;
		time.hour = hours;
	}
	
	if(value >= 10){
		let minutes = Math.floor(value / 10);
		value = value % 10;
		time.minute = minutes;
	}

	if(value > 0){
		time.round = value;
	}

	return time;
}

function removeSpecialCharacters(input){
	return input.replace(/[^a-zA-Z0-9]/g, '');
}

MTScript.registerMacro("a5e.json.unique",jsonUniqueMTScript);
MTScript.registerMacro("a5e.RemoveSpecial",removeSpecialCharacters);
MTScript.registerMacro("a5e.RoundsToTime",roundsToTime);