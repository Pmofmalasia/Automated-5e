[h:initialPassiveAbilityInfo = arg(0)]

[h,switch(json.get(initialPassiveAbilityInfo,"AbilityType")),CODE:
	case "Feature":{
		[h:pass.abilityName = json.get(initialPassiveAbilityInfo,"Name")]
		[h:pass.abilityDisplayName = json.get(initialPassiveAbilityInfo,"DisplayName")]
		[h:pass.abilityClass = json.get(initialPassiveAbilityInfo,"Class")]
		[h:pass.abilitySubclass = json.get(initialPassiveAbilityInfo,"Subclass")]
		[h:pass.abilityFalseName = "Class Feature"]
		[h:pass.FeatureFullDescription = ""]
		[h:pass.FeatureAbridgedDescription = ""]
		[h:pm.a5e.FeaturePassiveStdVars(base64.encode(initialPassiveAbilityInfo))]
	};
	case "Condition":{
		[h:cond.abilityName = json.get(initialPassiveAbilityInfo,"Name")]
		[h:cond.abilityDisplayName = json.get(initialPassiveAbilityInfo,"DisplayName")]
		[h:cond.abilityClass = json.get(initialPassiveAbilityInfo,"Class")]
		[h:cond.abilitySubclass = json.get(initialPassiveAbilityInfo,"Subclass")]
		[h:cond.abilityFalseName = "Class Feature"]
		[h:cond.FeatureFullDescription = ""]
		[h:cond.FeatureAbridgedDescription = ""]
		[h:pm.a5e.ConditionPassiveStdVars(base64.encode(initialPassiveAbilityInfo))]
	}
]

[h:"<!-- Potential issue here for a standardized function - cond. vs. pass. prefix -->"]

[h,switch(pass.Context),CODE:
	case "Lights":{
		[h:pass.a5e.ExecutePassiveLights(json.get(initialPassiveAbilityInfo,"Effects"))]
	};
	default:{}
]