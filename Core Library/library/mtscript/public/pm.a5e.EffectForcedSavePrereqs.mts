[h:EffectToCheck = arg(0)]
[h:ForcedSavePrerequisites = arg(1)]

[h:"<!-- TODO: If something should NOT have a particular type of save to be valid, can replace the following two statement's return statements with a check for that there -->"]
[h:EffectToResolve = json.get(EffectToCheck,"ToResolve")]
[h,if(EffectToResolve == ""): return(0,0)]

[h:EffectForcedSaveData = json.get(EffectToResolve,"SaveDC")]
[h,if(EffectForcedSaveData == ""): return(0,0)]

[h,if(json.contains(ForcedSavePrerequisites,"SaveTypeInclusive")),CODE:{
	[h:SaveTypeInclusive = json.get(ForcedSavePrerequisites,"SaveTypeInclusive")]
	[h,if(json.type(SaveTypeInclusive) == "UNKNOWN"): SaveTypeInclusive = json.append("",SaveTypeInclusive)]
	[h:ValidSaveTypeTest = !json.isEmpty(json.intersection(json.get(EffectForcedSaveData,SaveTypeInclusive)))]

	[h:return(ValidSaveTypeTest,0)]
};{}]

[h,if(json.contains(ForcedSavePrerequisites,"SaveTypeExclusive")),CODE:{
	[h:SaveTypeExclusive = json.get(ForcedSavePrerequisites,"SaveTypeExclusive")]
	[h,if(json.type(SaveTypeExclusive) == "UNKNOWN"): SaveTypeExclusive = json.append("",SaveTypeExclusive)]
	[h:ValidSaveTypeTest = json.isEmpty(json.intersection(json.get(EffectForcedSaveData,SaveTypeExclusive)))]

	[h:return(ValidSaveTypeTest,0)]
};{}]

[h,if(json.contains(EffectToResolve,"ConditionInfo")),CODE:{
	[h:SaveConditionsResisted = json.get(EffectForcedSaveData,"ConditionsResisted")]
	[h,if(SaveConditionsResisted == ""): return(0,0)]
	[h:SaveConditionsResistedInclusive = json.get(SaveConditionsResisted,"Inclusive")]
	[h:SaveConditionsResistedExclusive = json.get(SaveConditionsResisted,"Exclusive")]
	[h:tempEffectConditionsApplied = json.path.read(json.get(EffectToResolve,"ConditionInfo"),"\$[*]['Conditions']")]
	[h:EffectConditionsApplied = "[]"]
	[h,foreach(conditionGroup,tempEffectConditionsApplied): EffectConditionsApplied = json.merge(EffectConditionsApplied,conditionGroup)]

	[h:SaveConditionsResisted = "[]"]

	[h,if(SaveConditionsResistedInclusive != ""),CODE:{
		[h,if(SaveConditionsResistedInclusive == "All"):
			SaveConditionsResisted = EffectConditionsApplied;
			SaveConditionsResisted = SaveConditionsResistedInclusive
		]
	};{}]

	[h:"<!-- Note: Doesn't make sense for ConditionsResistedExclusive to be 'All' -->"]
	[h,if(SaveConditionsResistedExclusive != ""): SaveConditionsResisted = json.difference(SaveConditionsResisted,SaveConditionsResistedExclusive)]
};{
	[h:SaveConditionsResisted = "[]"]
}]

[h,if(json.contains(ForcedSavePrerequisites,"ConditionNames")),CODE:{
	[h:ConditionPrereqMet = 0]

	[h:ConditionNamePrereq = json.get(ForcedSavePrerequisites,"ConditionNames")]
	[h,if(ConditionNamePrereq != ""),CODE:{
		[h,if(json.type(ConditionNamePrereq) == "UNKNOWN"): ConditionNamePrereq = json.append("",ConditionNamePrereq)]
		[h:ConditionPrereqMet = !json.isEmpty(json.path.read(SaveConditionsResisted,"\$[*][?(@.Name in "+ConditionNamePrereq+")]"))]
	};{}]

	[h:return(ConditionPrereqMet,0)]
};{}]

[h,if(json.contains(ForcedSavePrerequisites,"ConditionTypes")),CODE:{
	[h:"<!-- TODO: json.path bugfix: update type json.path -->"]
	[h:ConditionTypePrereq = json.get(ForcedSavePrerequisites,"ConditionTypes")]
	[h,if(ConditionTypePrereq != "" && !ConditionPrereqMet),CODE:{
		[h,if(json.type(ConditionTypePrereq) == "UNKNOWN"): ConditionTypePrereq = json.append("",ConditionTypePrereq)]
		[h:ConditionPrereqMet = !json.isEmpty(json.path.read(SaveConditionsResisted,"\$[*]['ConditionTags'][?(@ in "+ConditionTypePrereq+")]"))]
	};{}]

	[h:return(ConditionPrereqMet,0)]
};{}]

[h,if(json.contains(ForcedSavePrerequisites,"DamageModified")),CODE:{
	[h:SaveDamageModified = json.get(EffectForcedSaveData,"DamageModifier")]
	[h:return(SaveDamageModified != "",0)]
	[h:EffectDamageDealt = json.get(EffectToResolve,"Damage")]
	[h:DamageModifiedPrereqs = json.get(ForcedSavePrerequisites,"DamageModified")]

	[h:DamageHalvedPrereqs = json.get(DamageModifiedPrereqs,"DamageHalved")]
	[h,if(DamageHalvedPrereqs != ""): return(DamageHalvedPrereqs == json.get(SaveDamageModified,"DamageHalved"),0)]

	[h:DamageDealtTypePrereqs = json.get(DamageModifiedPrereqs,"DamageType")]

	[h:SaveDamageTypesModified = "[]"]
	[h:SaveDamageTypesInclusive = json.get(SaveDamageModified,"TypesInclusive")]
	[h,if(SaveDamageTypesInclusive != ""),CODE:{
		[h,if(SaveDamageTypesInclusive == "All"):
			SaveDamageTypesModified = json.unique(json.path.read(EffectDamageDealt,"\$[*]['DamageType']"));
			SaveDamageTypesModified = SaveDamageTypesInclusive
		]
	};{}]

	[h:SaveDamageTypesExclusive = json.get(SaveDamageModified,"TypesExclusive")]
	[h,if(SaveDamageTypesExclusive != ""): SaveDamageTypesModified = json.difference(SaveDamageTypesModified,SaveDamageTypesExclusive)]

	[h,if(DamageDealtTypePrereqs != ""),CODE:{
		[h,if(json.type(DamageDealtTypePrereqs) == "UNKNOWN"): DamageDealtTypePrereqs = json.append("",DamageDealtTypePrereqs)]
		[h:DamageTypePrereqMet = !json.isEmpty(json.intersection(SaveDamageTypesModified,DamageDealtTypePrereqs))]
	};{}]
};{}]

[h:return(0,1)]