function filterCreatures(creatureList,filter,comparitorToken){
	if(typeof creatureList === "string"){
		creatureList = [creatureList];
	}

	let allPrereqs = Object.keys(filter);

	for(let creature of creatureList){
		if(typeof creature === "object"){
			creature = creature.Properties;
		}
		let isValid = true;
		for(let prereq of allPrereqs){
			if(prereq === "CRMaximum"){
				let CRMaximum = filter[prereq];
				isValid = (CRMaximum >= MTScript.evalMacro("[h:getPropertyFlexible("+'"a5e.stat.CR",'+creature+")]"));
			}
			else if(prereq === "CRMinimum"){
				
			}
			else if(prereq === "Allegiance"){
				if(comparitorToken == ""){
					isValid = false;
					break;
				} 
				let allegianceInfo = filter[prereq];

				let allegianceTest = false;
				if(creature === comparitorToken){
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
						if(MTScript.evalMacro("[h:getPropertyFlexible("+'"a5e.stat.whichTeam",'+creature+")]") == 0){
							allegianceTest = true;
						}
					}
					else if(allegianceInfo.Ally == 1){
						if(MTScript.evalMacro("[h:getPropertyFlexible("+'"a5e.stat.whichTeam",'+creature+")]") == MTScript.evalMacro("[h:getPropertyFlexible("+'"a5e.stat.whichTeam",'+comparitorToken+")]")){
							allegianceTest = true;
						}
					}
					else if(allegianceInfo.Foe == 1){
						if(MTScript.evalMacro("[h:getPropertyFlexible("+'"a5e.stat.whichTeam",'+creature+")]") != MTScript.evalMacro("[h:getPropertyFlexible("+'"a5e.stat.whichTeam",'+comparitorToken+")]")){
							allegianceTest = true;
						}
					}
					 
					isValid = allegianceTest;
				}
			}
			else if(prereq === "Size" || prereq === "SizeInclusive"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "SizeExlcusive"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "SizeMaximum" || prereq === "SizeMax"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "SizeMinimum" || prereq === "SizeMin"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "HP"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "IncludeCondition"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "ExcludeCondition"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "TypeInclusive"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "TypeExclusive"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "SubtypeInclusive"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "SubtypeExclusive"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "CreatureNameInclusive"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "CreatureNameExclusive"){
				let thisComparisonInfo = filter[prereq];
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
			else if(prereq === "Vision"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Language"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "BaseNeeds"){
				let thisComparisonInfo = filter[prereq];
			}
			else if(prereq === "Alignment"){
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
	}
}