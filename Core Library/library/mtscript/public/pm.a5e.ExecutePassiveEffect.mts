[h:initialPassiveAbilityInfo = arg(0)]
[h:execPassiveContext = arg(1)]

[h,if(json.get(initialPassiveAbilityInfo,"AbilityType") == "Feature" || json.get(initialPassiveAbilityInfo,"AbilityType") == "Item"),CODE:{
	[h:pass.abilityName = json.get(initialPassiveAbilityInfo,"Name")]
	[h:pass.abilityDisplayName = json.get(initialPassiveAbilityInfo,"DisplayName")]
	[h:pass.abilityClass = json.get(initialPassiveAbilityInfo,"Class")]
	[h:pass.abilitySubclass = json.get(initialPassiveAbilityInfo,"Subclass")]
	[h:pass.abilityFalseName = "Class Feature"]
	[h:pass.FeatureFullDescription = ""]
	[h:pass.FeatureAbridgedDescription = ""]
	[h:pm.a5e.FeaturePassiveStdVars(base64.encode(initialPassiveAbilityInfo))]
	[h:execPassiveAbilityInfo = pass.abilityInfo]
};{
	[h:cond.abilityName = json.get(initialPassiveAbilityInfo,"Name")]
	[h:cond.abilityDisplayName = json.get(initialPassiveAbilityInfo,"DisplayName")]
	[h:cond.abilityClass = json.get(initialPassiveAbilityInfo,"Class")]
	[h:cond.abilitySubclass = json.get(initialPassiveAbilityInfo,"Subclass")]
	[h:cond.abilityFalseName = "Class Feature"]
	[h:cond.FeatureFullDescription = ""]
	[h:cond.FeatureAbridgedDescription = ""]
	[h:pm.a5e.ConditionPassiveStdVars(base64.encode(initialPassiveAbilityInfo))]
	[h:execPassiveAbilityInfo = cond.abilityInfo]
}]

[h,switch(execPassiveContext),CODE:
	case "Lights":{
		[h:allAddableLights = json.path.read(initialPassiveAbilityInfo,"\$.PassiveEffects.Effects")]
		[h:pass.a5e.ExecutePassiveLights(execPassiveAbilityInfo,allAddableLights)]
	};
	default:{}
]