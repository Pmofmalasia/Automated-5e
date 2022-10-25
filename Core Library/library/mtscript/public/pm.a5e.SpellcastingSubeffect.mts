[h:SpellSubeffectData = arg(0)]
[h:thisEffectData = json.set("","ID",pm.a5e.GenerateEffectID())]

[h:spell.RangeData = json.get(SpellSubeffectData,"Range")]
[h:spell.RangeType = json.get(SpellSubeffectData,"RangeType")]
[h,if(spell.RangeType == "SelfRanged" || spell.RangeType == "Ranged"),CODE:{
	[h,if(json.get(spell.RangeData,"AHLScaling")>0):
		spell.AHLRange = json.get(spell.RangeData,"AHLValue") * (spell.AHL / json.get(spell.RangeData,"AHLScaling"));
		spell.AHLRange = 0
	]
	[h:spell.RangeData = json.set(spell.RangeData,"Value",json.get(spell.RangeData,"Value") + spell.AHLRange)]

	[h,if(spell.RangeType == "SelfRanged"):
		spell.RangeDisplay = "Self ("+json.get(spell.RangeData,"Value")+" "+json.get(spell.RangeData,"Units")+")";
		spell.RangeDisplay = "Range "+json.get(spell.RangeData,"Value")+" "+json.get(spell.RangeData,"Units")
	]
};{
	[h,if(spell.RangeType == "Touch"),CODE:{
		[h:spell.RangeData = json.set(spell.RangeData,"Value",5,"Units","Feet")]
		[h:spell.RangeDisplay = "Touch"]
	};{
		[h:spell.RangeData = json.set(spell.RangeData,"Value",0,"Units","Feet")]
		[h:spell.RangeDisplay = "Self"]
	}]
}]

[h:"<!-- TODO: Add AOE display to this line -->"]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Range",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",spell.RangeDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
))]

[h,if(json.contains(SpellSubeffectData,"isTargetNumberUnlimited")),CODE:{
	[h:spell.TargetNumber = 99999999999]
};{
	[h:spell.TargetNumber = json.get(SpellSubeffectData,"TargetNumber")]
	[h,if(json.get(SpellSubeffectData,"TargetNumberAHLScaling") > 0 && spell.AHL > 0),CODE:{
		[h:spell.TargetNumber = spell.TargetNumber + (json.get(SpellSubeffectData,"TargetNumberAHL") * (spell.AHL / json.get(SpellSubeffectData,"TargetNumberAHLScaling")))]
	}]
}]

[h,if(json.contains(SpellSubeffectData,"isMultitargetDistanceUnlimited")),CODE:{
	[h:spell.MultiTargetDistance = spell.RangeData]
};{
	[h:spell.MultiTargetDistance = json.set("","MultitargetDistanceValue",json.get(SpellSubeffectData,"MultitargetDistance"),"MultitargetDistanceUnits",json.get(spell.RangeData,"Units"))]
}]

[h,if(json.contains(SpellSubeffectData,"zAOE")),CODE:{
	[h:AoEScaling=if(sAoESizeScalingAHL=="Every Level",spell.AHL,if(sAoESizeScalingAHL=="Every Other Level",floor(spell.AHL/2),if(sAoESizeScalingAHL=="Every Three Levels",floor(spell.AHL/3),0)))]
	[h:dAoESizeAHL = sAoESizeAHL*AoEScaling]
	[h:RangeScaling=if(sRangeScalingAHL=="Every Level",spell.AHL,if(sRangeScalingAHL=="Every Other Level",floor(spell.AHL/2),if(sRangeScalingAHL=="Every Three Levels",floor(spell.AHL/3),0)))]
	[h:dRangeAHL = sRangeAHL*RangeScaling]
	[h:DamageScaling=if(AHLScaling=="Every Level",spell.AHL,if(AHLScaling=="Every Other Level",floor(spell.AHL/2),if(AHLScaling=="Every Three Levels",floor(spell.AHL/3),0)))]
}]

[h,if(json.contains(SpellSubeffectData,"TargetOrigin")),CODE:{

};{
	[h:spell.TargetOrigin = ParentToken]
}]

[h:"<!-- TODO: Need a 'Must affect all valid targets' option, likely trigger input based on whether 'unlimited' targets is checked -->"]
[h:MissileCount = 1]
[h:"<!-- TODO: Need better solution for missiles - missiles loop should create new effects, allow for target selection all in one step. Multiple AoEs should NOT be treated as missiles, since they use the same damage rolls. -->"]

[h:spell.TargetingData = json.get(SpellSubeffectData,"TargetLimits")]
[h:spell.TargetTypes = json.fields(spell.TargetingData)]
[h,if(json.contains(spell.TargetTypes,"Creature")),CODE:{
	[h:spell.TargetCreatureLimits = json.get(spell.TargetingData,"Creature")]
	[h:spell.TargetOptions = pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Origin",spell.TargetOrigin,"Range",spell.RangeData),spell.TargetCreatureLimits)]
	[h:spell.AllTargets = pm.a5e.TargetCreatureTargeting(spell.TargetOptions,spell.TargetNumber,MissileCount)]
	[h:thisEffectData = json.set(thisEffectData,"Targets",spell.AllTargets)]
}]

[h,if(json.contains(SpellSubeffectData,"Damage")),CODE:{
	[h:allDamageData = json.get(SpellSubeffectData,"Damage")]
	[h:DamageTypeOptionNum = json.length(json.path.read(allDamageData,"[*][?(@.DamageTypeOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL"))]

	[h,if(DamageTypeOptionNum>1):
		DamageTypeSelectInput = "junkVar |  | --------------- Damage Type Options --------------- | LABEL | SPAN=TRUE ";
		DamageTypeSelectInput = ""
	]

	[h,foreach(tempDamageType,allDamageData),CODE:{
		[h:thisInstanceDamageOptions = "[]"]
		[h,foreach(tempDamageOption,json.get(tempDamageType,"DamageTypeOptions")): thisInstanceDamageOptions = json.append(thisInstanceDamageOptions,pm.GetDisplayName(tempDamageOption,"sb.DamageTypes"))]
		[h,if(!json.isEmpty(thisInstanceDamageOptions)): DamageTypeSelectInput = listAppend(DamageTypeSelectInput," DamageTypeSelection"+roll.count+" | Choose a Damage Type | "+thisInstanceDamageOptions+" | LIST | DELIMITER=JSON VALUE=STRING "," ## ")]
	}]

	[h:abort(input(DamageTypeSelectInput))]

	[h,foreach(tempDamageType,allDamageData),CODE:{
		[h:typeOptionTest = json.contains(json.get(allDamageData,roll.count),"DamageTypeOptions")]
		[h,if(typeOptionTest): allDamageData = json.path.set(allDamageData,"["+roll.count+"]['DamageType']",pm.RemoveSpecial(eval("DamageTypeSelection"+roll.count)))]
	}]
}]

[h:spell.IsAttack = json.contains(SpellSubeffectData,"Attack")]
[h,if(spell.IsAttack),CODE:{
	[h:attack.ProfTest = 1]
	[h:attack.ToHitBonus = 0]
	[h,if(json.length(spell.AllTargets)>1):
		spell.AttackData = pm.a5e.AttackRoll(NonSpellData,json.append("","Attack","SpellAttack"));
		spell.AttackData = pm.a5e.AttackRoll(NonSpellData,json.append("","Attack","SpellAttack"),json.get(spell.AllTargets,0))		
	]
	[h:attack.CritTest = json.get(spell.AttackData,"CritTest")]
	[h:attack.CritFailTest = json.get(spell.AttackData,"CritFailTest")]

	[h:spell.RerollNonSpellData = json.merge(NonSpellData,spell.AttackData)]
	[h:spell.RerollData = json.set(spell.RerollNonSpellData,"SpellData",json.append("",FinalSpellData))]

	[h:sp.AdvRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",spell.RerollData,ParentToken)]
	[h:sp.DisRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",spell.RerollData,ParentToken)]
[h:"<!-- TODO: Will need to reorganize reroll link positioning to collect all info -->"]

	[h:ToHitTableLine = json.set("",
		"ShowIfCondensed",1,
		"Header","Attack Roll",
		"FalseHeader","",
		"FullContents","<span style='"+if(attack.CritTest,"font-size:2em; color:"+CritColor,if(attack.CritFailTest,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+json.get(spell.AttackData,"ToHit")+"</span>",
		"RulesContents",json.get(spell.AttackData,"RulesStr")+" = ",
		"RollContents",json.get(spell.AttackData,"ToHitStr")+" = ",
		"DisplayOrder","['Rules','Roll','Full']"
	)]
	
	[h,if(json.get(spell.AttackData,"AdvantageBalance")==0):
		ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","Reroll: <a href = '"+sp.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+sp.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>");
		ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","(Roll #1: "+(roll1+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+" / Roll #2: "+(roll2+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+")")
	]
	
	[h:abilityTable = json.append(abilityTable,ToHitTableLine)]
	[h:thisEffectData = json.set(thisEffectData,"Attack",spell.AttackData)]
};{
	[h:attack.CritTest = 0]
}]

[h,if(json.contains(SpellSubeffectData,"Save")),CODE:{
	[h:spell.SaveDC = 8 + getProperty("Proficiency") + PrimeStatMod]

	[h:pm.PassiveFunction("SpellSaveDC")]

	[h:spell.SaveDCData = json.set(json.get(SpellSubeffectData,"Save"),"DC",spell.SaveDC)]
	[h:thisEffectData = json.set(thisEffectData,"SaveDC",spell.SaveDCData)]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Saving Throw",
		"FalseHeader","",
		"FullContents",pm.GetDisplayName("sb.Attributes",json.get(json.get(SpellSubeffectData,"Save"),"SaveType")),
		"RulesContents","DC "+spell.SaveDC+" ",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']",
		"LinkText","",
		"Link","",
		"Value",""
	))]
}]

[h:SpellDamageData = "[]"]
[h:SpellNonDamageProperties = json.set("",
	"IsSpell",1,
	"IsWeapon",0,
	"IsAttack",spell.IsAttack,
	"Modifier",1,
	"ScalingBase",spell.AHL
)]
[h:SpellDamagePassiveFunctions = json.append("","Damage","SpellDamage")]
[h,if(spell.IsAttack): SpellDamagePassiveFunctions = json.append(SpellDamagePassiveFunctions,"AttackDamage","SpellAttackDamage")]

[h:spell.DamageInfo = "[]"]
[h,foreach(tempDamageInstance,json.get(SpellSubeffectData,"Damage")),CODE:{
	[h:thisDamageTypeInfo = pm.a5e.DamageRoll(tempDamageInstance,SpellNonDamageProperties,SpellDamagePassiveFunctions)]

	[h:spell.DamageInfo = json.append(spell.DamageInfo,thisDamageTypeInfo)]

	[h:tempDamageType = json.get(thisDamageTypeInfo,"DamageType")]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",tempDamageType+if(or(tempDamageType=="Healing",tempDamageType=="Temp HP"),""," Damage"),
		"FalseHeader","",
		"FullContents","<span style='"+if(attack.CritTest,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+if(attack.CritTest,json.get(thisDamageTypeInfo,"CritTotal"),json.get(thisDamageTypeInfo,"Total"))+"</span>",
		"RulesContents",if(attack.CritTest,json.get(thisDamageTypeInfo,"CritFormula"),json.get(thisDamageTypeInfo,"Formula"))+" = ",
		"RollContents",if(attack.CritTest,json.get(thisDamageTypeInfo,"CritString"),json.get(thisDamageTypeInfo,"String"))+" = ",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h,if(!json.isEmpty(spell.DamageInfo)): thisEffectData = json.set(thisEffectData,"Damage",spell.DamageInfo)]

[h,if(json.contains(SpellSubeffectData,"Conditions")),CODE:{
	[h,if(json.contains(SpellSubeffectData,"ConditionOptionsNumber")),CODE:{
		[h:spell.ConditionChoiceNumber = json.get(SpellSubeffectData,"ConditionOptionsNumber")]
		[h,if(json.get(SpellSubeffectData,"ConditionOptionsNumberAHLScaling") > 0): spell.ConditionChoiceNumber = spell.ConditionChoiceNumber + (json.contains(SpellSubeffectData,"ConditionOptionsNumberAHL") * floor(spell.AHL/json.get(SpellSubeffectData,"ConditionOptionsNumberAHLScaling")))]
	};{
		[h:spell.ConditionChoiceNumber = 0]
	}]

	[h:spell.Conditions = pm.a5e.ChooseCondition(json.get(SpellSubeffectData,"Conditions"),spell.ConditionChoiceNumber)]
}]

[h,if(json.contains(SpellSubeffectData,"Summon")),CODE:{
	[h:spell.SummonData = json.get(SpellSubeffectData,"Summon")]
	
	[h:spell.SummonCRMax = json.get(spell.SummonData,"SummonCRMax")]
	[h:spell.SummonCRMaxAHLScaling = json.get(spell.SummonData,"SummonCRMaxAHLScaling")]

	[h,if(spell.SummonCRMaxAHLScaling > 0),CODE:{
		[h:spell.SummonCRMaxAHL = json.get(spell.SummonData,"SummonCRMaxAHL")]
		[h:spell.SummonCRMaxAHLScalingMethod = json.get(spell.SummonData,"SummonCRMaxAHLScalingMethod")]
		[h,if(spell.SummonCRMaxAHLScalingMethod=="Add"):
			spell.SummonCRMax = spell.SummonCRMax + (spell.SummonCRMaxAHL * floor(spell.AHL/spell.SummonCRMaxAHLScaling));
			spell.SummonCRMax = spell.SummonCRMax * (spell.SummonCRMaxAHL + floor(spell.AHL/spell.SummonCRMaxAHLScaling))
		]
	}]
	
	[h:spell.SummonNumber = json.get(spell.SummonData,"SummonNumber")]
	[h:spell.SummonNumberAHLScaling = json.get(spell.SummonData,"SummonNumberAHLScaling")]

	[h,if(spell.SummonNumberAHLScaling > 0),CODE:{
		[h:spell.SummonNumberAHL = json.get(spell.SummonData,"SummonNumberAHL")]
		[h:spell.SummonNumberAHLScalingMethod = json.get(spell.SummonData,"SummonNumberAHLScalingMethod")]

		[h:spell.SummonNumberMultiplierAHL = 1]
		[h:spell.SummonNumberBonusAHL = 0]

		[h,if(spell.SummonNumberAHLScalingMethod=="Add"):
			spell.SummonNumberBonusAHL = spell.SummonNumberAHL * floor(spell.AHL/spell.SummonNumberAHLScaling);
			spell.SummonNumberMultiplierAHL = spell.SummonNumberAHL + floor(spell.AHL/spell.SummonNumberAHLScaling)
		]
	}]

	[h:spell.SummonData = json.set("",
		"SummonName",json.get(spell.SummonData,"SummonName"),
		"SummonOptions",json.get(spell.SummonData,"SummonOptions"),
		"SummonCRMax",spell.SummonCRMax,
		"SummonNumberCRBased",json.get(spell.SummonData,"SummonNumberCRBased")
		"SummonNumber",json.get(spell.SummonData,"SummonNumber"),
		"SummonNumberMultiplier",spell.SummonNumberMultiplierAHL,
		"SummonNumberBonus",spell.SummonNumberBonusAHL,
		"SummonCreatureType",json.get(spell.SummonData,"SummonCreatureType"),
		"ParentToken",ParentToken
	)]

	[h:SummonCustomization = json.set("",
		"ForcedName",ForcedSummonName,
		"ForcedImage",ForcedImage,
		"ForcedPortrait",ForcedPortrait,
		"ForcedHandout",ForcedHandout
	)]
	
	[h:pm.Summons(spell.SummonData,SummonCustomization)]
}]

[h:pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffectData)]