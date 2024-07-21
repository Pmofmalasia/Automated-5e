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
		[h:pass.a5e.Lights(execPassiveAbilityInfo)]
	};
	case "Vision":{
		[h:pass.a5e.VisionBonus(execPassiveAbilityInfo,json.get(execPassiveAbilityInfo,"CallVision"))]
	};
	case "Speed":{
		[h:pass.a5e.SpeedBonus(execPassiveAbilityInfo,json.get(execPassiveAbilityInfo,"CallSpeed"))]
	};
	case "Lifespan":{
		[h:pass.a5e.LifespanBonus(execPassiveAbilityInfo,json.get(execPassiveAbilityInfo,"CallLifespan"))]
	};
	case "DamageMod":{
		[h:pass.a5e.DamageModifiers(execPassiveAbilityInfo)]
	};
	case "CondImmun":{
		[h:pass.a5e.ConditionImmunities(execPassiveAbilityInfo)]
	};
	default:{}
]