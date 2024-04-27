[h:tempAbilityInfo = arg(0)]
[h:CodeToExecute = arg(1)]

[h,switch(json.get(tempAbilityInfo,"AbilityType")),CODE:
	case "Feature":{
		[h:pass.abilityName = json.get(tempAbilityInfo,"Name")]
		[h:pass.abilityDisplayName = json.get(tempAbilityInfo,"DisplayName")]
		[h:pass.abilityClass = json.get(tempAbilityInfo,"Class")]
		[h:pass.abilitySubclass = json.get(tempAbilityInfo,"Subclass")]
		[h:pass.abilityFalseName = "Class Feature"]
		[h:pass.FeatureFullDescription = ""]
		[h:pass.FeatureAbridgedDescription = ""]
		[h:pm.a5e.FeaturePassiveStdVars(base64.encode(tempAbilityInfo))]
	};
	case "Condition":{
		[h:cond.abilityName = json.get(tempAbilityInfo,"Name")]
		[h:cond.abilityDisplayName = json.get(tempAbilityInfo,"DisplayName")]
		[h:cond.abilityClass = json.get(tempAbilityInfo,"Class")]
		[h:cond.abilitySubclass = json.get(tempAbilityInfo,"Subclass")]
		[h:cond.abilityFalseName = "Class Feature"]
		[h:cond.FeatureFullDescription = ""]
		[h:cond.FeatureAbridgedDescription = ""]
		[h:pm.a5e.ConditionPassiveStdVars(base64.encode(tempAbilityInfo))]
	}
]

[h:evalMacro(CodeToExecute)]