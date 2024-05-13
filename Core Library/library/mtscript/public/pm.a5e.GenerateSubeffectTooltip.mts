[h:SubeffectData = arg(0)]
[h:IsTooltip = 1]
[h:abilityTable = "[]"]

[h,if(json.contains(SubeffectData,"UseResource")),CODE:{
	[h:subeffect.ResourceData = pm.a5e.UseResource(json.get(SubeffectData,"UseResource"),IsTooltip)]

	[h:abilityTable = json.merge(abilityTable,json.get(subeffect.ResourceData,"Table"))]
};{}]

[h:subeffect.RangeExecution = pm.a5e.ExecuteSubeffectRange(SubeffectData,0)]
[h:subeffect.RangeData = json.get(subeffect.RangeExecution,"Data")]
[h:rangeTableLine = json.get(subeffect.RangeExecution,"Table")]
[h,if(rangeTableLine != ""): abilityTable = json.append(abilityTable,rangeTableLine)]

[h:subeffect.TargetingData = json.get(SubeffectData,"TargetLimits")]
[h:finalTargetingDisplayArray = "[]"]
[h:subeffect.CreatureTargetingData = json.get(subeffect.TargetingData,"Creature")]
[h,if(!json.isEmpty(subeffect.CreatureTargetingData)),CODE:{
	[h:creatureTargetingData = subeffect.CreatureTargetingData]
	[h:creatureTargetingDisplay = pm.a5e.CreatureFilteringDisplay(creatureTargetingData)]
	[h:finalTargetingDisplayArray = json.append(finalTargetingDisplayArray,creatureTargetingDisplay)]
};{
	[h,if(subeffect.CreatureTargetingData != ""): finalTargetingDisplayArray = json.append(finalTargetingDisplayArray,"Any Creature")]
}]

[h:subeffect.ObjectTargetingData = json.get(subeffect.TargetingData,"Object")]
[h,if(!json.isEmpty(subeffect.ObjectTargetingData)),CODE:{
	[h:objectTargetingData = subeffect.ObjectTargetingData]
	[h:objectTargetingDisplay = pm.a5e.ObjectFilteringDisplay(objectTargetingData)]
	[h:finalTargetingDisplayArray = json.append(finalTargetingDisplayArray,objectTargetingDisplay)]
};{
	[h,if(subeffect.ObjectTargetingData != ""): finalTargetingDisplayArray = json.append(finalTargetingDisplayArray,"Any Object")]
}]

[h,if(!json.isEmpty(finalTargetingDisplayArray)),CODE:{
	[h:finalTargetingDisplay = pm.a5e.CreateDisplayList(finalTargetingDisplayArray,"and")]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Valid Targets",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",finalTargetingDisplay,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]

[h:MissileCount = number(json.get(SubeffectData,"MissileNumber"))]
[h,if(MissileCount > 1),CODE:{
	[h:attackTest = json.get(SubeffectData,"Attack") != ""]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Number of "+if(attackTest,"Attacks","Missiles"),
		"FalseHeader","",
		"FullContents","",
		"RulesContents",MissileCount,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]

[h,if(json.contains(SubeffectData,"Attack")),CODE:{
	
};{}]

[h,if(json.contains(SubeffectData,"SaveData")),CODE:{
	
};{}]

[h,foreach(damageInstance,json.get(SubeffectData,"Damage")),CODE:{
	[h,if(json.get(damageInstance,"DamageTypeOptions") != ""),CODE:{
		[h:damageOptionsDisplayNames = "[]"]
		[h,foreach(damageType,json.get(damageInstance,"DamageTypeOptions")): damageOptionsDisplayNames = json.append(damageOptionsDisplayNames,pm.GetDisplayName(damageType,"DamageTypes"))]
		[h:damageTypeOptionsDisplay = "; choice of "+pm.a5e.CreateDisplayList(damageOptionsDisplayNames,"or")+ "damage"]
		[h:damageLineHeader = "Damage"]
	};{
		[h:damageType = json.get(damageInstance,"DamageType")]
		[h:damageLineHeader = pm.GetDisplayName(damageType,"DamageTypes") + if(or(damageType == "Healing",damageType=="TempHP"),""," Damage")]
		[h:damageTypeOptionsDisplay = ""]
	}]

	[h,if(json.contains(damageInstance,"PriorDamagePercent")),CODE:{
		[h:damagePercent = json.get(damageInstance,"PriorDamagePercent")]
			
		[h,switch(damagePercent):
			case 1: damageFormula = "Equal to Prior Damage";
			case 0: damageFormula = "";
			case "0.5": damageFormula = "Half of Prior Damage";
			case "0.25": damageFormula = "Quarter of Prior Damage";
			default: damageFormula = (damagePercent * 100)+"% of Prior Damage"
		]
	};{
		[h:damageFormula = json.get(damageInstance,"DieNum") + "d" + json.get(damageInstance,"DieSize") + pm.PlusMinus(number(json.get(damageInstance,"FlatBonus")),0) + if(json.get(damageInstance,"IsModBonus") == 1," + Modifier","")]
	}]

	[h:damageDisplayFinal = damageFormula + damageTypeOptionsDisplay]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",damageLineHeader,
		"FalseHeader","",
		"FullContents","",
		"RulesContents",damageDisplayFinal,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h:return(0,abilityTable)]