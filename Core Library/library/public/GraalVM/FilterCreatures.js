function filterCreatures(creatureList,filter,comparitorTokenID){
	if(typeof creatureList !== "object"){
		creatureList = JSON.parse(creatureList);	
	}

	let comparitorToken;
	if(comparitorTokenID !== undefined){
		comparitorToken = MapTool.tokens.getTokenByID(comparitorTokenID);
	}
	let allPrereqs = Object.keys(filter);

	let validCreatureList = [];
	for(let creature of creatureList){
		let creatureProps;
		if(creature.Properties !== undefined){
			creatureProps = creature.Properties;
		}
		else{
			creatureProps = creature;
		}

		let isValid = true;
		for(let prereq of allPrereqs){
			if(prereq === "CRMaximum"){
				let CRMaximum = filter[prereq];
				isValid = (CRMaximum >= creatureProps["a5e.stat.CR"]);
			}
			else if(prereq === "CRMinimum"){
				let CRMinimum = filter[prereq];
				isValid = (CRMinimum <= creatureProps["a5e.stat.CR"]);
			}
			else if(prereq === "Allegiance"){
				if(comparitorToken === undefined){
					isValid = false;
					break;
				}
				let allegianceInfo = filter[prereq];

				let allegianceTest = false;
				if(creatureProps.TokenID === comparitorToken.getProperty(TokenID)){
					if(allegianceInfo.Self == 1){
						allegianceTest = true;
					}
					else if(allegianceInfo.NotSelf == 1){
						allegianceTest = false;
					}
				}
				else{
					if(allegianceInfo.NotSelf == 1){
						allegianceTest = true;
					}
					else if(allegianceInfo.Neutral == 1){
						if(creatureProps["a5e.stat.whichTeam"] == 0){
							allegianceTest = true;
						}
					}
					else if(allegianceInfo.Ally == 1){
						if(creatureProps["a5e.stat.whichTeam"] == comparitorToken.getProperty("a5e.stat.whichTeam")){
							allegianceTest = true;
						}
					}
					else if(allegianceInfo.Foe == 1){
						if(creatureProps["a5e.stat.whichTeam"] != comparitorToken.getProperty("a5e.stat.whichTeam")){
							allegianceTest = true;
						}
					}
					 
					isValid = allegianceTest;
				}
			}
			else if(prereq === "Size" || prereq === "SizeInclusive"){
				let thisComparisonInfo = filter[prereq];

				let thisTokenSize = creatureProps["a5e.stat.CurrentSize"];
				if(thisTokenSize === undefined){
					thisTokenSize = creatureProps["a5e.stat.Size"];
				}

				if(typeof thisComparisonInfo === "string"){
					isValid = (thisTokenSize == thisComparisonInfo);
				}
				else{
					thisComparisonInfo = Array.from(thisComparisonInfo);
					isValid = thisComparisonInfo.includes(thisTokenSize);
				}
			}
			else if(prereq === "SizeExlcusive"){
				let thisComparisonInfo = filter[prereq];

				let thisTokenSize = creatureProps["a5e.stat.CurrentSize"];
				if(thisTokenSize === undefined){
					thisTokenSize = creatureProps["a5e.stat.Size"];
				}

				if(typeof thisComparisonInfo === "string"){
					isValid = (thisTokenSize == thisComparisonInfo);
				}
				else{
					thisComparisonInfo = Array.from(thisComparisonInfo);
					isValid = !thisComparisonInfo.includes(thisTokenSize);
				}
			}
			else if(prereq === "SizeMaximum" || prereq === "SizeMax"){
				let maximumSize = filter[prereq];

				if(typeof maximumSize === "number"){
					if(comparitorToken === undefined){
						isValid = false;
						break;
					}

					let sizeReference = MTScript.execMacro("[r:getSize("+comparitorTokenID+")]");
					maximumSize = getSizeChange(sizeReference,maximumSize);
				}

				let thisTokenSize = creatureProps["a5e.stat.CurrentSize"];
				if(thisTokenSize === undefined){
					thisTokenSize = creatureProps["a5e.stat.Size"];
				}

				let isValid = (compareSizes(maximumSize,tokenSize) >= 0);
			}
			else if(prereq === "SizeMinimum" || prereq === "SizeMin"){
				let minimumSize = filter[prereq];

				if(typeof minimumSize === "number"){
					if(comparitorToken === undefined){
						isValid = false;
						break;
					}

					let sizeReference = MTScript.execMacro("[r:getSize("+comparitorTokenID+")]");
					minimumSize = getSizeChange(sizeReference,minimumSize);
				}

				let thisTokenSize = creatureProps["a5e.stat.CurrentSize"];
				if(thisTokenSize === undefined){
					thisTokenSize = creatureProps["a5e.stat.Size"];
				}

				let isValid = (compareSizes(minimumSize,tokenSize) <= 0);
			}
			else if(prereq === "TypeInclusive"){
				//TODO: Need to implement CountsAs effects
				let thisComparisonInfo = filter[prereq];

				if(Array.isArray(thisComparisonInfo)){
					thisComparisonInfo = Array.from(thisComparisonInfo);
					isValid = thisComparisonInfo.includes(creatureProps["a5e.stat.CreatureType"]);
				}
				else{
					isValid = thisComparisonInfo == creatureProps["a5e.stat.CreatureType"]; 
				}
			}
			else if(prereq === "TypeExclusive"){
				let thisComparisonInfo = filter[prereq];

				if(Array.isArray(thisComparisonInfo)){
					thisComparisonInfo = Array.from(thisComparisonInfo);
					isValid = !thisComparisonInfo.includes(creatureProps["a5e.stat.CreatureType"]);
				}
				else{
					isValid = thisComparisonInfo != creatureProps["a5e.stat.CreatureType"]; 
				}
			}
			else if(prereq === "SubtypeInclusive"){
				let thisComparisonInfo = filter[prereq];

				if(Array.isArray(thisComparisonInfo)){
					thisComparisonInfo = Array.from(thisComparisonInfo);
					isValid = thisComparisonInfo.includes(creatureProps["a5e.stat.Race"]);
				}
				else{
					isValid = thisComparisonInfo == creatureProps["a5e.stat.Race"]; 
				}
			}
			else if(prereq === "SubtypeExclusive"){
				let thisComparisonInfo = filter[prereq];

				if(Array.isArray(thisComparisonInfo)){
					isValid = !thisComparisonInfo.includes(creatureProps["a5e.stat.Race"]);
				}
				else{
					isValid = thisComparisonInfo != creatureProps["a5e.stat.Race"]; 
				}
			}
			else if(prereq === "CreatureNameInclusive"){
				let thisComparisonInfo = filter[prereq];

				if(Array.isArray(thisComparisonInfo)){
					isValid = thisComparisonInfo.includes(creatureProps["a5e.stat.CreatureName"]);
				}
				else{
					isValid = thisComparisonInfo == creatureProps["a5e.stat.CreatureName"]; 
				}
			}
			else if(prereq === "CreatureNameExclusive"){
				let thisComparisonInfo = filter[prereq];

				if(Array.isArray(thisComparisonInfo)){
					isValid = !thisComparisonInfo.includes(creatureProps["a5e.stat.CreatureName"]);
				}
				else{
					isValid = thisComparisonInfo != creatureProps["a5e.stat.CreatureName"]; 
				}
			}
			else if(prereq === "HP"){
				let thisComparisonInfo = filter[prereq];
				let comparisonType = thisComparisonInfo.Type;

				if(comparisonType === "AtMaximumHP"){
					if(creatureProps["a5e.stat.HP"] < creatureProps["a5e.stat.MaxHP"]){
						isValid = false;
					}
				}
				else if(comparisonType === "Damaged"){
					if(creatureProps["a5e.stat.HP"] >= creatureProps["a5e.stat.MaxHP"]){
						isValid = false;
					}
				}
				else if(comparisonType === "OverHalfHP"){
					let HPPercent = (creatureProps["a5e.stat.HP"] / creatureProps["a5e.stat.MaxHP"]);
					if(HPPercent <= (1/2)){
						isValid = false;
					}
				}
				else if(comparisonType === "BelowHalfHP"){
					let HPPercent = (creatureProps["a5e.stat.HP"] / creatureProps["a5e.stat.MaxHP"]);
					if(HPPercent > (1/2)){
						isValid = false;
					}
				}
				else if(comparisonType === "NoHP"){
					if(creatureProps["a5e.stat.HP"] == 0){
						isValid = false;
					}
				}
				else if(comparisonType === "HasHP"){
					if(creatureProps["a5e.stat.HP"] >= 1){
						isValid = false;
					}
				}
				else if(comparisonType === "Comparison"){
					let thisCreatureHP = creatureProps["a5e.stat.HP"];
					let comparitorHP = comparitorToken.getProperty("a5e.stat.HP");
					let comparitor = thisComparisonInfo.Comparitor;
					if(comparitor == "LessEqual"){
						if(thisCreatureHP > comparitorHP){
							isValid = false;
						}
					}
					else if(comparitor == "Less"){
						if(thisCreatureHP >= comparitorHP){
							isValid = false;
						}
					}
					else if(comparitor == "Equal"){
						if(thisCreatureHP != comparitorHP){
							isValid = false;
						}
					}
					else if(comparitor == "Greater"){
						if(thisCreatureHP <= comparitorHP){
							isValid = false;
						}
					}
					else if(comparitor == "GreaterEqual"){
						if(thisCreatureHP < comparitorHP){
							isValid = false;
						}
					}
				}
			}
			else if(prereq === "IncludeCondition"){
				let thisComparisonInfo = filter[prereq];

				let hasConditions = hasConditions(thisComparisonInfo.Names,thisComparisonInfo.AllorOne,creatureProps["a5e.stat.ConditionsList"]);

				if(!hasConditions){
					isValid = false;
				}
			}
			else if(prereq === "ExcludeCondition"){
				let thisComparisonInfo = filter[prereq];

				let hasConditions = hasConditions(thisComparisonInfo.Names,thisComparisonInfo.AllorOne,creatureProps["a5e.stat.ConditionsList"]);

				if(hasConditions){
					isValid = false;
				}
			}
			else if(prereq === "IncludeToken"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "ExcludeToken"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Attribute"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Sight"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Hearing"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Understand"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Speed"){
				let thisComparisonInfo = filter[prereq];
				let speedPrereqTypes = Object.keys(thisComparisonInfo);
				for(let speedType of speedPrereqTypes){
					let thisTypePrereqs = thisComparisonInfo[speedType];
					let thisSpeedMax = thisTypePrereqs.Maximum;
					let thisSpeedMin = thisTypePrereqs.Minimum;

					if(thisSpeedMax === "relative"){
						thisSpeedMax = comparitorToken.getProperty("a5e.stat.AllSpeeds")[speedType];
					}
					if(thisSpeedMin === "relative"){
						thisSpeedMin = comparitorToken.getProperty("a5e.stat.AllSpeeds")[speedType];
					}

					if(speedType == "Any"){
						let allSpeedValues = Object.values(creatureProps["a5e.stat.AllSpeeds"]);
						
						if(thisSpeedMax != undefined){
							if(Math.min(...allSpeedValues) > thisSpeedMax){
								isValid = false;
								break;
							}
						}

						if(thisSpeedMin != undefined){
							if(Math.max(...allSpeedValues) < thisSpeedMin){
								isValid = false;
								break;
							}
						}
					}
					else if(speedType == "All"){
						let allSpeedValues = Object.values(creatureProps["a5e.stat.AllSpeeds"]);
						
						if(thisSpeedMax != undefined){
							if(Math.max(...allSpeedValues) > thisSpeedMax){
								isValid = false;
								break;
							}
						}

						if(thisSpeedMin != undefined){
							if(Math.min(...allSpeedValues) < thisSpeedMin){
								isValid = false;
								break;
							}
						}
					}
					else{
						if(thisSpeedMax != undefined){
							if(creatureProps["a5e.stat.AllSpeeds"][speedType] > thisSpeedMax){
								isValid = false;
								break;
							}
						}

						if(thisSpeedMin != undefined){
							if(creatureProps["a5e.stat.AllSpeeds"][speedType] < thisSpeedMin){
								isValid = false;
								break;
							}
						}
					}
				}
			}
			else if(prereq === "ExcludeSpeed"){
				//Pretty sure this can be fully covered by the above, temporarily here while I make sure
				let thisComparisonInfo = filter[prereq];
				let speedPrereqTypes = Object.keys(thisComparisonInfo);
				for(let speedType of speedPrereqTypes){
					let thisTypePrereqs = thisComparisonInfo[speedType];
					let thisSpeedMax = thisTypePrereqs.Maximum;
					let thisSpeedMin = thisTypePrereqs.Minimum;

					if(speedType == "Any"){
						let allSpeedValues = Object.values(creatureProps["a5e.stat.AllSpeeds"]);
						
						if(thisSpeedMax != undefined){
							if(Math.min(...allSpeedValues) <= thisSpeedMax){
								isValid = false;
								break;
							}
						}

						if(thisSpeedMin != undefined){
							if(Math.max(...allSpeedValues) >= thisSpeedMin){
								isValid = false;
								break;
							}
						}
					}
					else if(speedType == "All"){
						let allSpeedValues = Object.values(creatureProps["a5e.stat.AllSpeeds"]);
						
						if(thisSpeedMax != undefined){
							if(Math.max(...allSpeedValues) <= thisSpeedMax){
								isValid = false;
								break;
							}
						}

						if(thisSpeedMin != undefined){
							if(Math.min(...allSpeedValues) >= thisSpeedMin){
								isValid = false;
								break;
							}
						}
					}
					else{
						if(thisSpeedMax != undefined){
							if(creatureProps["a5e.stat.AllSpeeds"][speedType] <= thisSpeedMax){
								isValid = false;
								break;
							}
						}

						if(thisSpeedMin != undefined){
							if(creatureProps["a5e.stat.AllSpeeds"][speedType] >= thisSpeedMin){
								isValid = false;
								break;
							}
						}
					}
				}
			}
			else if(prereq === "Resource"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "HitDice"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "SpellSlots"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Class"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Subclass"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "IncludeProficiency"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "IncludeAlignment"){
				let thisComparisonInfo = filter[prereq];
				thisComparisonInfo = Array.from(thisComparisonInfo);

				let creaturePropsAlignment = creatureProps["a5e.stat.Alignment"];
				let finalAlignment = creaturePropsAlignment.Order+creaturePropsAlignment.Morality;
				if(!thisComparisonInfo.includes(finalAlignment)){
					isValid = false;
				}
			}
			else if(prereq === "ExcludeAlignment"){
				let thisComparisonInfo = filter[prereq];
				thisComparisonInfo = Array.from(thisComparisonInfo);

				let creaturePropsAlignment = creatureProps["a5e.stat.Alignment"];
				let finalAlignment = creaturePropsAlignment.Order+creaturePropsAlignment.Morality;
				if(thisComparisonInfo.includes(finalAlignment)){
					isValid = false;
				}
			}
			else if(prereq === "Vision"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Language"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "BaseNeeds"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "MaxCover"){
				let thisComparisonInfo = filter[prereq];
			}
			else{
				let thisComparisonInfo = filter[prereq];
			}

			if(!isValid){
				break;
			}
		}

		if(isValid){
			validCreatureList.push(creature);
		}
	}

	return validCreatureList;
}

function getSizeChange(startingSize,changeAmount){
	let sizeArray = ["Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"];

	let startingIndex = sizeArray.indexOf(startingSize);
	let newIndex = startingIndex + changeAmount;
	let finalSize;

	if(newIndex < 0){
		finalSize = "Fine";
	}
	else if(newIndex > sizeArray.length - 1){
		finalSize = "Colossal";
	}
	else{
		finalSize = sizeArray[newIndex];
	}

	return finalSize;
}

function compareSizes(size1,size2){
	let sizeArray = ["Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal"];
	let sizeDiff = sizeArray.indexOf(size1) - sizeArray.indexOf(size2);

	return sizeDiff;
}

function hasConditions(conditionNames,conditionNumber,currentConditions){
	let conditionNamesNumber = conditionNames.length;
	for(let condition of currentConditions){
		let conditionIndex = conditionNames.indexOf(condition.Name);
		if(conditionIndex !== -1){
			conditionNames.splice(conditionIndex,1);
		}
	}

	let hasConditions = false;
	if(conditionNumber === "All"){
		if(conditionNames.length === 0){
			hasConditions = true;
		}
	}
	else{
		let matchingConditionsNum = conditionNamesNumber - conditionNames.length;
		if(matchingConditionsNum >= conditionNumber){
			hasConditions = true;
		}
	}

	return hasConditions;
}

MTScript.registerMacro("a5e.FilterCreatures",filterCreatures);