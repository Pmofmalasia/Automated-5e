[h:SubeffectData = arg(0)]
[h:NonSubeffectData = arg(1)]
[h:SubeffectFunctionPrefixes = json.get(NonSubeffectData,"InstancePrefixes")]
[h:MultiEffectModifier = number(json.get(NonSubeffectData,"MultiEffectModifier"))]

[h:thisEffectData = json.set("","ID",pm.a5e.GenerateEffectID())]

[h,if(json.get(SubeffectData,"ParentSubeffect")!=""),CODE:{
	[h:ParentSubeffectNum = json.get(SubeffectData,"ParentSubeffect") + MultiEffectModifier]
	[h:tempParentID = json.path.read(pm.a5e.EffectData,"[*][?(@.WhichIntrinsicSubeffect == '"+ParentSubeffectNum+"')]['ID']")]
	[h,if(!json.isEmpty(tempParentID)): thisEffectData = json.set(thisEffectData,
		"ParentSubeffect",json.get(tempParentID,0),
		"ParentSubeffectRequirements",json.get(SubeffectData,"ParentSubeffectRequirements")
	)]
};{}]

[h,if(json.contains(SubeffectData,"UseResource")),CODE:{
	[h:subeffect.ResourceData = pm.a5e.UseResource(json.get(SubeffectData,"UseResource"),IsTooltip)]

	[h:SubeffectData = json.set(SubeffectData,"Resource",json.get(subeffect.ResourceData,"Data"))]
	[h:abilityTable = json.merge(abilityTable,json.get(subeffect.ResourceData,"Table"))]
};{}]

[h:subeffect.RangeData = json.get(SubeffectData,"Range")]
[h:subeffect.RangeType = json.get(SubeffectData,"RangeType")]
[h,if(subeffect.RangeType == "SelfRanged" || subeffect.RangeType == "Ranged"),CODE:{
	[h,if(json.get(subeffect.RangeData,"AHLScaling")>0):
		subeffect.AHLRange = json.get(subeffect.RangeData,"AHLValue") * (AHLTier / json.get(subeffect.RangeData,"AHLScaling"));
		subeffect.AHLRange = 0
	]
	[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",json.get(subeffect.RangeData,"Value") + subeffect.AHLRange)]

	[h,if(subeffect.RangeType == "SelfRanged"):
		subeffect.RangeDisplay = "Self ("+json.get(subeffect.RangeData,"Value")+" "+json.get(subeffect.RangeData,"Units")+")";
		subeffect.RangeDisplay = "Range "+json.get(subeffect.RangeData,"Value")+" "+json.get(subeffect.RangeData,"Units")
	]
};{
	[h,if(subeffect.RangeType == "Touch"),CODE:{
		[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",5,"Units","Feet")]
		[h:subeffect.RangeDisplay = "Touch"]
	};{
		[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",0,"Units","Feet")]
		[h:subeffect.RangeDisplay = "Self"]
	}]
}]

[h:"<!-- TODO: Add AOE display to this line -->"]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Range",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",subeffect.RangeDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(json.contains(SubeffectData,"isTargetNumberUnlimited")),CODE:{
	[h:subeffect.TargetNumber = 99999999999]
};{
	[h:subeffect.TargetNumber = json.get(SubeffectData,"TargetNumber")]
	[h,if(json.get(SubeffectData,"TargetNumberAHLScaling") != 0 && AHLTier > 0),CODE:{
		[h:subeffect.TargetNumber = subeffect.TargetNumber + (json.get(SubeffectData,"TargetNumberAHL") * (AHLTier / json.get(SubeffectData,"TargetNumberAHLScaling")))]
	};{}]
}]

[h,if(json.contains(SubeffectData,"isMultitargetDistanceUnlimited")),CODE:{
	[h:subeffect.MultiTargetDistance = subeffect.RangeData]
};{
	[h:subeffect.MultiTargetDistance = json.set("","MultitargetDistanceValue",json.get(SubeffectData,"MultitargetDistance"),"MultitargetDistanceUnits",json.get(subeffect.RangeData,"Units"))]
}]

[h,if(json.contains(SubeffectData,"zAOE")),CODE:{
	[h:AoEScaling=if(sAoESizeScalingAHL=="Every Level",AHLTier,if(sAoESizeScalingAHL=="Every Other Level",floor(AHLTier/2),if(sAoESizeScalingAHL=="Every Three Levels",floor(AHLTier/3),0)))]
	[h:dAoESizeAHL = sAoESizeAHL*AoEScaling]
	[h:RangeScaling=if(sRangeScalingAHL=="Every Level",AHLTier,if(sRangeScalingAHL=="Every Other Level",floor(AHLTier/2),if(sRangeScalingAHL=="Every Three Levels",floor(AHLTier/3),0)))]
	[h:dRangeAHL = sRangeAHL*RangeScaling]
	[h:DamageScaling=if(AHLScaling=="Every Level",AHLTier,if(AHLScaling=="Every Other Level",floor(AHLTier/2),if(AHLScaling=="Every Three Levels",floor(AHLTier/3),0)))]
}]

[h,if(json.contains(SubeffectData,"TargetOrigin")),CODE:{

};{
	[h:subeffect.TargetOrigin = ParentToken]
}]

[h:"<!-- TODO: Need a 'Must affect all valid targets' option, likely trigger input based on whether 'unlimited' targets is checked -->"]
[h:MissileCount = 1]
[h:"<!-- TODO: Need better solution for missiles - missiles loop should create new effects, allow for target selection all in one step. Multiple AoEs should NOT be treated as missiles, since they use the same damage rolls. -->"]

[h:subeffect.TargetingData = json.get(SubeffectData,"TargetLimits")]
[h:subeffect.TargetTypes = json.fields(subeffect.TargetingData,"json")]
[h:subeffect.TargetTokens = "[]"]
[h,if(json.contains(subeffect.TargetTypes,"Creature")),CODE:{
	[h:subeffect.TargetCreatureLimits = json.get(subeffect.TargetingData,"Creature")]
	[h:subeffect.TargetOptionData = pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Origin",subeffect.TargetOrigin,"Range",subeffect.RangeData),subeffect.TargetCreatureLimits)]
	
	[h:subeffect.TargetOptions = json.get(subeffect.TargetOptionData,"ValidTargets")]
	[h:SelfOnlyTest = json.get(subeffect.TargetOptionData,"SelfOnly")]
	[h,if(SelfOnlyTest),CODE:{
		[h:subeffect.AllTargetTokens = subeffect.TargetOptions]
	};{
		[h:subeffect.AllTargetTokens = pm.a5e.TargetCreatureTargeting(subeffect.TargetOptions,subeffect.TargetNumber,MissileCount)]
	}]

	[h:subeffect.TargetTokens = json.merge(subeffect.TargetTokens,subeffect.AllTargetTokens)]
}]

[h,if(json.contains(subeffect.TargetTypes,"PriorTargets")),CODE:{
	[h:subeffect.TargetTokens = json.merge(subeffect.TargetTokens,json.append("",json.get(subeffect.TargetingData,"PriorTargets")))]
}]

[h,if(!json.isEmpty(subeffect.TargetTokens)): thisEffectData = json.set(thisEffectData,"Targets",subeffect.TargetTokens)]

[h,if(json.contains(SubeffectData,"Damage")),CODE:{
	[h:allDamageData = json.get(SubeffectData,"Damage")]
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

[h:subeffect.IsAttack = json.contains(SubeffectData,"Attack")]
[h,if(subeffect.IsAttack),CODE:{
	[h:attack.ProfTest = 1]
	[h:attack.ToHitBonus = 0]

	[h,if(json.get(SubeffectData,"CritThresh")!=""):
		attack.CritThresh = json.get(SubeffectData,"CritThresh");
		attack.CritThresh = 20
	]
	[h,if(json.get(SubeffectData,"CritThreshReduction")!=""):
		attack.CritThreshReduction = json.get(SubeffectData,"CritThreshReduction");
		attack.CritThreshReduction = 0
	]

	[h:subeffect.RerollData = json.get(NonSubeffectData,"RerollData")]
	[h,if(json.length(subeffect.AllTargets)>1):
		subeffect.AttackData = pm.a5e.AttackRoll(subeffect.RerollData,SubeffectFunctionPrefixes);
		subeffect.AttackData = pm.a5e.AttackRoll(subeffect.RerollData,SubeffectFunctionPrefixes,json.get(subeffect.AllTargets,0))		
	]
	[h:attack.CritTest = json.get(subeffect.AttackData,"CritTest")]
	[h:attack.CritFailTest = json.get(subeffect.AttackData,"CritFailTest")]

	[h:sp.AdvRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",subeffect.RerollData,ParentToken)]
	[h:sp.DisRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",subeffect.RerollData,ParentToken)]
[h:"<!-- TODO: Will need to reorganize reroll link positioning to collect all info -->"]

	[h:ToHitTableLine = json.set("",
		"ShowIfCondensed",1,
		"Header","Attack Roll",
		"FalseHeader","",
		"FullContents","<span style='"+if(attack.CritTest,"font-size:2em; color:"+CritColor,if(attack.CritFailTest,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+json.get(subeffect.AttackData,"ToHit")+"</span>",
		"RulesContents",json.get(subeffect.AttackData,"RulesStr")+" = ",
		"RollContents",json.get(subeffect.AttackData,"ToHitStr")+" = ",
		"DisplayOrder","['Rules','Roll','Full']"
	)]
	
	[h,if(json.get(subeffect.AttackData,"AdvantageBalance")==0):
		ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","Reroll: <a href = '"+sp.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+sp.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>");
		ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","(Roll #1: "+(roll1+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+" / Roll #2: "+(roll2+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+")")
	]
	
	[h:abilityTable = json.append(abilityTable,ToHitTableLine)]
	[h:thisEffectData = json.set(thisEffectData,"Attack",subeffect.AttackData)]
};{
	[h:attack.CritTest = 0]
}]

[h,if(json.contains(SubeffectData,"SaveData")),CODE:{
	[h:thisSubeffectSaveData = json.get(SubeffectData,"SaveData")]
	[h,switch(json.get(thisSubeffectSaveData,"DCMethod")),CODE:
		case "SpellSave":{

		};
		case "AbilityScore":{

		};
		case "SetValue":{

		};
		default:{
			[h:subeffect.SaveDC = 8 + getProperty("a5e.stat.Proficiency") + PrimeStatMod]

			[h:pm.PassiveFunction("SpellSaveDC")]
		}
	]

	[h:subeffect.SaveDCData = json.set(thisSubeffectSaveData,"DC",subeffect.SaveDC)]
	[h:thisEffectData = json.set(thisEffectData,"SaveDC",subeffect.SaveDCData)]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Saving Throw",
		"FalseHeader","",
		"FullContents",pm.GetDisplayName(json.get(thisSubeffectSaveData,"SaveType"),"sb.Attributes")+" Save",
		"RulesContents","DC "+subeffect.SaveDC+" ",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h:SubeffectNonDamageProperties = json.set("",
	"IsSpell",pm.a5e.OverarchingContext=="Spell",
	"IsWeapon",pm.a5e.OverarchingContext=="Attack",
	"IsAttack",subeffect.IsAttack,
	"Modifier",1,
	"ScalingBase",AHLTier
)]

[h:subeffect.DamageInfo = "[]"]
[h,foreach(tempDamageInstance,json.get(SubeffectData,"Damage")),CODE:{
	[h:thisDamageTypeInfo = pm.a5e.DamageRoll(tempDamageInstance,SubeffectNonDamageProperties,SubeffectFunctionPrefixes)]
	[h:"<!-- TODO: SubeffectFunctionPrefixes won't work here because spells don't know if they're a spell attack or not before they enter subeffects (technically they could, but meh). This would be solved by eliminating separate instances for Spell vs. Weapon vs. Attack damage, and just tracking these things better and using them to filter out things that don't apply. Requires a lot of work in making sure variables overlap enough for spells vs. attacks, though. -->"]

	[h:subeffect.DamageInfo = json.append(subeffect.DamageInfo,thisDamageTypeInfo)]

	[h:tempDamageType = json.get(thisDamageTypeInfo,"DamageType")]

	[h,switch(tempDamageType):
		case "Healing": DamageTypeDisplay = "Healing";
		case "TempHP": DamageTypeDisplay = "Temporary HP";
		default: DamageTypeDisplay = pm.GetDisplayName(tempDamageType,"sb.DamageTypes")
	]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",DamageTypeDisplay+if(or(tempDamageType=="Healing",tempDamageType=="TempHP"),""," Damage"),
		"FalseHeader","",
		"FullContents","<span style='"+if(attack.CritTest,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+if(attack.CritTest,json.get(thisDamageTypeInfo,"CritTotal"),json.get(thisDamageTypeInfo,"Total"))+"</span>",
		"RulesContents",if(attack.CritTest,json.get(thisDamageTypeInfo,"CritFormula"),json.get(thisDamageTypeInfo,"Formula"))+" = ",
		"RollContents",if(attack.CritTest,json.get(thisDamageTypeInfo,"CritString"),json.get(thisDamageTypeInfo,"String"))+" = ",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h,if(!json.isEmpty(subeffect.DamageInfo)): thisEffectData = json.set(thisEffectData,"Damage",subeffect.DamageInfo)]

[h,if(json.contains(SubeffectData,"ConditionInfo")),CODE:{
	[h:tempConditionInfo = json.get(SubeffectData,"ConditionInfo")]
	[h,if(json.contains(SubeffectData,"ConditionOptionsNumber")),CODE:{
		[h:subeffect.ConditionChoiceNumber = json.get(SubeffectData,"ConditionOptionsNumber")]
		[h,if(json.get(SubeffectData,"ConditionOptionsNumberAHLScaling") > 0): subeffect.ConditionChoiceNumber = subeffect.ConditionChoiceNumber + (json.contains(SubeffectData,"ConditionOptionsNumberAHL") * floor(AHLTier/json.get(SubeffectData,"ConditionOptionsNumberAHLScaling")))]
	};{
		[h:subeffect.ConditionChoiceNumber = 0]
	}]

	[h:subeffect.Conditions = pm.a5e.ChooseCondition(json.get(tempConditionInfo,"Conditions"),subeffect.ConditionChoiceNumber)]

	[h:subeffect.ConditionEndInfo = json.get(tempConditionInfo,"EndInfo")]
	[h,if(json.get(subeffect.ConditionEndInfo,"UseMainDuration") == 1): subeffect.ConditionEndInfo = json.set(subeffect.ConditionEndInfo,"Duration",DurationValue,"DurationUnits",lower(DurationUnits))]
	[h:subeffect.ConditionEndInfo = json.remove(subeffect.ConditionEndInfo,"UseMainDuration")]

	[h:"<!-- TODO: Should make sure that the following path is always null if there are no EndTriggers with a save - need to see if this is due to messy data or flaws in json.path -->"]
	[h:hasSaveDCTest = json.path.read(subeffect.ConditionEndInfo,"[*][?(@.EndTriggers.*.SaveType!=null && @.EndTriggers.*.SaveType!='')]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h:hasSaveDCTest = json.difference(hasSaveDCTest,json.append("","{}"))]
	[h:hasSaveDCTest = !json.isEmpty(hasSaveDCTest)]

	[h,if(hasSaveDCTest && !json.contains(SubeffectData,"SaveData")),CODE:{
		[h:subeffect.SaveDC = 8 + getProperty("a5e.stat.Proficiency") + PrimeStatMod]
		[h:pm.PassiveFunction("SpellSaveDC")]
	};{}]
	
	[h,if(hasSaveDCTest): subeffect.ConditionEndInfo = json.path.put(subeffect.ConditionEndInfo,"['EndTriggers'][*][?(@.SaveType!=null)]","DC",subeffect.SaveDC)]

	[h:"<!-- TODO: Fix to allow selection of AdvancePoint manually; Temporary solution for now -->"]
	[h,if(json.get(subeffect.ConditionEndInfo,"DurationUnits")=="round"):
		subeffect.ConditionEndInfo = json.set(subeffect.ConditionEndInfo,"AdvancePoint","StartofTurn");
		subeffect.ConditionEndInfo = json.set(subeffect.ConditionEndInfo,"AdvancePoint","EndofTurn")
	]

	[h:thisEffectData = json.set(thisEffectData,"ConditionInfo",json.set("","Conditions",subeffect.Conditions,"EndInfo",subeffect.ConditionEndInfo))]

	[h:subeffect.ConditionNames = pm.a5e.CreateDisplayList(json.path.read(subeffect.Conditions,"[*]['DisplayName']"),"and")]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Conditions Applied",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",subeffect.ConditionNames,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h,if(json.contains(subeffectData,"TargetConditionLimits")),CODE:{
	[h:TargetConditionLimitsData = json.get(subeffectData,"TargetConditionLimits")]

	[h:subeffect.TargetConditionOptions = pm.a5e.TargetConditionFiltering(subeffect.AllTargets,TargetConditionLimitsData)]
	
	[h,if(json.get(TargetConditionLimitsData,"Number")=="" && json.get(TargetConditionLimitsData,"MustTargetAll")==1):
		subeffect.ConditionTargets = subeffect.TargetConditionOptions;
		subeffect.ConditionTargets = pm.a5e.TargetConditionTargeting(subeffect.TargetConditionOptions,json.get(TargetConditionLimitsData,"Number"))
	]

	[h:thisEffectData = json.set(thisEffectData,"TargetedConditions",subeffect.ConditionTargets)]
};{}]

[h,if(json.contains(subeffectData,"ConditionModificationInfo")),CODE:{
	[h:thisEffectData = json.set(thisEffectData,"ConditionModificationInfo",json.get(subeffectData,"ConditionModificationInfo"))]
};{}]

[h,if(json.contains(SubeffectData,"Summon")),CODE:{
	[h:subeffect.SummonData = json.get(SubeffectData,"Summon")]
	
	[h:subeffect.SummonCRMax = json.get(subeffect.SummonData,"SummonCRMax")]
	[h:subeffect.SummonCRMaxAHLScaling = json.get(subeffect.SummonData,"SummonCRMaxAHLScaling")]
	[h,if(subeffect.SummonCRMaxAHLScaling==""): subeffect.SummonCRMaxAHLScaling = 0]

	[h,if(subeffect.SummonCRMaxAHLScaling > 0),CODE:{
		[h:subeffect.SummonCRMaxAHL = json.get(subeffect.SummonData,"SummonCRMaxAHL")]
		[h:subeffect.SummonCRMaxAHLScalingMethod = json.get(subeffect.SummonData,"SummonCRMaxAHLScalingMethod")]
		[h,if(subeffect.SummonCRMaxAHLScalingMethod=="Add"):
			subeffect.SummonCRMax = subeffect.SummonCRMax + (subeffect.SummonCRMaxAHL * floor(AHLTier/subeffect.SummonCRMaxAHLScaling));
			subeffect.SummonCRMax = subeffect.SummonCRMax * (subeffect.SummonCRMaxAHL + floor(AHLTier/subeffect.SummonCRMaxAHLScaling))
		]
	}]
	
	[h:subeffect.SummonNumber = json.get(subeffect.SummonData,"SummonNumber")]
	[h:subeffect.SummonNumberAHLScaling = json.get(subeffect.SummonData,"SummonNumberAHLScaling")]
	[h,if(subeffect.SummonNumberAHLScaling==""): subeffect.SummonNumberAHLScaling = 0]
	[h:subeffect.SummonNumberMultiplierAHL = 1]
	[h:subeffect.SummonNumberBonusAHL = 0]

	[h,if(subeffect.SummonNumberAHLScaling > 0),CODE:{
		[h:subeffect.SummonNumberAHL = json.get(subeffect.SummonData,"SummonNumberAHL")]
		[h:subeffect.SummonNumberAHLScalingMethod = json.get(subeffect.SummonData,"SummonNumberAHLScalingMethod")]

		[h,if(subeffect.SummonNumberAHLScalingMethod=="Add"):
			subeffect.SummonNumberBonusAHL = subeffect.SummonNumberAHL * floor(AHLTier/subeffect.SummonNumberAHLScaling);
			subeffect.SummonNumberMultiplierAHL = subeffect.SummonNumberAHL + floor(AHLTier/subeffect.SummonNumberAHLScaling)
		]
	}]

	[h:subeffect.SummonData = json.set("",
		"SummonName",json.get(subeffect.SummonData,"SummonName"),
		"SummonOptions",json.get(subeffect.SummonData,"SummonOptions"),
		"SummonCRMax",subeffect.SummonCRMax,
		"SummonNumberCRBased",json.get(subeffect.SummonData,"SummonNumberCRBased"),
		"SummonNumber",json.get(subeffect.SummonData,"SummonNumber"),
		"SummonNumberMultiplier",subeffect.SummonNumberMultiplierAHL,
		"SummonNumberBonus",subeffect.SummonNumberBonusAHL,
		"SummonCreatureType",json.get(subeffect.SummonData,"SummonCreatureType"),
		"ParentToken",ParentToken
	)]

	[h:SummonCustomization = json.set("",
		"ForcedName",ForcedSummonName,
		"ForcedImage",ForcedImage,
		"ForcedPortrait",ForcedPortrait,
		"ForcedHandout",ForcedHandout
	)]
	
	[h:pm.Summons(subeffect.SummonData,SummonCustomization)]
}]

[h:pm.a5e.EffectData = json.append(pm.a5e.EffectData,thisEffectData)]