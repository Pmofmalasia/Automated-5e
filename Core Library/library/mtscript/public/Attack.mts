[h:wa.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(wa.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Attack"]
[h:pm.a5e.EffectData = "[]"]

[h:Flavor = json.get(wa.Data,"Flavor")]
[h:ActiveHand = json.get(wa.Data,"Hand")]
[h:OtherHands = "[]"]
[h:CurrentHeldItems = getProperty("a5e.stat.HeldItems")]
[h:TotalHands = json.length(CurrentHeldItems)]
[h,count(TotalHands): OtherHands = if(roll.count == ActiveHand,OtherHands,json.append(OtherHands,roll.count))]
[h:AttackNum = json.get(wa.Data,"AttackNum")]
[h:ThrowingWeapon = json.get(wa.Data,"ThrowWeapon")]
[h:TwoWeaponFighting = json.get(wa.Data,"TwoWeaponFighting")]
[h,if(TwoWeaponFighting == ""): TwoWeaponFighting = 0]
[h:DMOnly = json.get(wa.Data,"DMOnly")]
[h:DMOnly = 0]
[h:ShowFullRules = 1]
[h:wa.WeaponUsed = json.get(wa.Data,"WeaponData")]
[h:wa.EffectIDs = json.get(wa.Data,"ID")]
[h,if(wa.EffectIDs == ""): wa.EffectIDs = "[]"]

[h:BorderColorOverride = json.get(wa.Data,"BorderColorOverride")]
[h:TitleFontColorOverride = json.get(wa.Data,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(wa.Data,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(wa.Data,"AccentTextOverride")]
[h:TitleFont = json.get(wa.Data,"TitleFont")]
[h:BodyFont = json.get(wa.Data,"BodyFont")]
[h:CritMessage = json.get(wa.Data,"CritMessage")]
[h:CritFailMessage = json.get(wa.Data,"CritFailMessage")]

[h:"<!-- TODO: Switch out name with false name if needed -->"]
[h:wa.Name = json.get(wa.WeaponUsed,"DisplayName")]
[h:wa.MagicBonus = json.get(wa.WeaponUsed,"MagicBonus")]
[h:wa.WeaponType = json.get(wa.WeaponUsed,"WeaponType")]
[h:wa.Class = json.get(wa.WeaponUsed,"WeaponClass")]
[h:wa.MeleeRanged = json.get(wa.WeaponUsed,"WeaponMeleeRanged")]
[h:wa.DamageData = json.get(wa.WeaponUsed,"WeaponDamage")]
[h:wa.Reach = json.get(wa.WeaponUsed,"Reach")]
[h:wa.Range = json.get(wa.WeaponUsed,"Range")]
[h:wa.LongRange = json.get(wa.WeaponUsed,"LongRange")]

[h,if(json.get(wa.WeaponUsed,"CritThresh")!=""):
	attack.CritThresh = json.get(wa.WeaponUsed,"CritThresh");
	attack.CritThresh = 20
]
[h,if(json.get(wa.WeaponUsed,"CritThreshReduction")!=""):
	attack.CritThreshReduction = json.get(wa.WeaponUsed,"CritThreshReduction");
	attack.CritThreshReduction = 0
]

[h:"<!-- Note: number('') results in 0, so this will function without the key present -->"]
[h:wa.CritMultiplier = 1 + number(json.get(wa.WeaponUsed,"CritMultiplier"))]

[h:wa.Subeffects = json.get(wa.WeaponUsed,"Subeffects")]
[h,if(wa.Subeffects == ""): wa.Subeffects = "[]"]
[h:wa.Props = json.get(wa.WeaponUsed,"WeaponProperties")]
[h:wa.Magical = json.get(wa.WeaponUsed,"isMagical")]
[h:attack.ProfTest = if(json.get(getProperty("a5e.stat.WeaponProficiencies"),wa.WeaponType)==1,1,0)]
[h:attack.ToHitBonus = wa.MagicBonus]
[h:attack.ProfTest = 1]
[h:wa.TargetOrigin = ParentToken]

[h:wa.BrutalCrit = 0]
[h:"<!-- TODO: Add other primary stats as a property? Or otherwise? Probably just have a 'Primary Stat' option that isn't a property which defaults to Strength or Dex if ranged. -->"]
[h:PrimeStat = if(wa.MeleeRanged=="Ranged","Dexterity","Strength")]
[h,if(json.get(wa.Data,"PrimeStat")!=""): PrimeStat = json.get(wa.Data,"PrimeStat")]

[h:pm.PassiveFunction("AttackProps")]
[h:pm.PassiveFunction("WeaponAttackProps")]

[h,if(!json.isEmpty(wa.DamageData)): wa.DamageData = json.path.put(wa.DamageData,"[0]","BonusCritDice",wa.BrutalCrit)]

[h,if(json.contains(wa.Props,"Finesse")),CODE:{
	[h:"<!-- TODO: Currently takes the maximum without choice, in the future may want to add an option for choice via options #1: Always ask, #2 Ask if two are equal, #3 do not compare at all and set choice in an 'Advanced Attack Options' menu -->"]
	[h:MaxPrimeStat = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
	[h:PrimeStatOptions = json.append("",PrimeStat,"Dexterity")]
	[h,foreach(tempStat,PrimeStatOptions),CODE:{
		[h:changePrimeStatTest = json.get(getProperty("a5e.stat.AtrMods"),tempStat) > MaxPrimeStat]
		[h,if(changePrimeStatTest): PrimeStat = tempStat]
		[h,if(changePrimeStatTest): MaxPrimeStat = json.get(getProperty("a5e.stat.AtrMods"),tempStat)]
	}]
};{}]

[h,if(json.contains(wa.Props,"Heavy")),CODE:{
	[h:TooHeavyTest = pm.a5e.CompareSizes(getSize(ParentToken),"Small") <= 0]
	[h,if(TooHeavyTest): wa.Data = json.set(wa.Data,"Disadvantage",number(json.get(wa.Data,"Disadvantage"))+1)]
};{}]

[h:"<!-- TODO: May want to change this to an 'AttackNumMax' property in the future, should work nicer with weapons that can be loaded with X number of ammunition -->"]
[h,if(json.contains(wa.Props,"Loading")): AttackNum = -1]

[h,if(ThrowingWeapon && !json.contains(wa.Props,"Thrown")),CODE:{
	[h:"<!-- UDF? -->"]
	[h:AllInstanceDamageTypes = json.path.read(wa.DamageData,"[*]['Damage']['DamageType']")]
	[h:TempAllInstanceDamageTypeOptions = json.path.read(wa.DamageData,"[*]['Damage']['DamageTypeOptions']")]
	[h:AllInstanceDamageTypeOptions = "[]"]
	[h,foreach(instance,TempAllInstanceDamageTypeOptions): AllInstanceDamageTypeOptions = json.merge(AllInstanceDamageTypeOptions,instance)]
	[h:ImprovisedDamageTypes = json.unique(json.merge(AllInstanceDamageTypes,AllInstanceDamageTypeOptions))]

	[h:NewDamageInstance = json.set("",
		"DamageDieNumber",1,
		"DamageDieSize",6,
		"DamageFlatBonus",0,
		"IsModBonus",1
	)]

	[h,if(json.length(ImprovisedDamageTypes) > 1),CODE:{
		[h:NewDamageInstance = json.set(NewDamageInstance,"DamageTypeOptions",ImprovisedDamageTypes)]
	};{
		[h,if(json.length(ImprovisedDamageTypes) > 0): NewDamageInstance = json.set(NewDamageInstance,"DamageType",json.get(ImprovisedDamageTypes,0))]
	}]
	[h,if(!json.isEmpty(wa.DamageData)): wa.DamageData = json.append("",NewDamageInstance)]

	[h:wa.Range = 20]
	[h:wa.LongRange = 60]
};{}]

[h:"<!-- TODO: Current method is to remove TWF completely to get around the no damage modifier effect (e.g. for the fighting style). Issues are #1: It is still technically TWF, so any effects that would trigger on TWF would not be able to; solution could be adding a variable that bypasses removing the mod. #2: TWF still adds damage modifier if negative; solution could be changing IsDamageModifier -->"]
[h,if(TwoWeaponFighting),CODE:{
	[h:wa.DamageData = json.path.set(wa.DamageData,"[*]","IsModBonus",0)]
};{}]

[h:"<!-- TODO: Will need to ensure that the empty hand is allowed to make attacks in the future -->"]
[h:EmptyHandTest = 0]
[h,foreach(tempHand,OtherHands): EmptyHandTest = if(json.get(CurrentHeldItems,tempHand)=="",1,EmptyHandTest)]

[h,if(EmptyHandTest==0 && json.contains(wa.Props,"TwoHanded")),CODE:{
	[h:"<!-- TODO: Decide how to implement not being able to/cancelling attack -->"]
};{}]

[h,if(EmptyHandTest==1 && json.contains(wa.Props,"Versatile")),CODE:{
	[h:wa.DamageData = json.get(wa.WeaponUsed,"VersatileDamage")]
};{}]

[h:UsesAmmunitionTest = json.contains(wa.Props,"Ammunition")]
[h,if(UsesAmmunitionTest),CODE:{
	[h:wa.AmmunitionID = json.get(wa.WeaponUsed,"AmmunitionID")]
	[h,if(wa.AmmunitionID == ""),CODE:{
		[h:AmmunitionData = "{}"]
	};{
		[h:tempAmmunitionData = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == "+wa.AmmunitionID+")]")]
		[h,if(json.isEmpty(tempAmmunitionData)):
			AmmunitionData = "{}";
			AmmunitionData = json.get(tempAmmunitionData,0)
		]
	}]

	[h:CurrentAmmoCount = number(json.get(AmmunitionData,"Number"))]
};{
	[h:CurrentAmmoCount = 0]
}]

[h:pm.PassiveFunction("AttackStat")]
[h:pm.PassiveFunction("WeaponAttackStat")]

[h:attack.PrimeStatBonus = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
[h:PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]

[h,if(AttackNum < 0),CODE:{
	[h:AttackCount = abs(AttackNum)]
};{
	[h:AttackCount = AttackNum]
	[h:pm.PassiveFunction("AttackNum")]
	[h:pm.PassiveFunction("WeaponAttackNum")]
}]

[h:wa.TargetOptions = pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Number",1,"Origin",wa.TargetOrigin,"Range",json.set("","Value",if(wa.MeleeRanged=="Ranged",wa.LongRange,wa.Reach),"Units","Feet")),json.set("","Allegiance",json.set("","NotSelf",1)))]
[h:wa.AllTargets = pm.a5e.TargetCreatureTargeting(json.get(wa.TargetOptions,"ValidTargets"),1,AttackCount)]
[h,if(AttackCount==1),CODE:{
	[h:wa.TargetList = wa.AllTargets]
};{
	[h:wa.TargetList = "[]"]
	[h,count(AttackCount): wa.TargetList = json.merge(wa.TargetList,json.get(wa.AllTargets,roll.count))]
}]

[h:AllAttacksToHit = "[]"]
[h:AllAttacksDmg = "[]"]
[h:AllAttacksSubeffects = "[]"]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:SafeAttackCounter = 0]
[h,count(AttackCount),CODE:{
	[h:thisAttackData = wa.Data]
	[h:thisAttackSubeffects = wa.Subeffects]
	[h:thisAttackDamageData = wa.DamageData]
	[h,if(json.length(wa.EffectIDs)-1 < SafeAttackCounter): wa.EffectIDs = json.append(wa.EffectIDs,pm.a5e.GenerateEffectID())]

	[h:"<!-- TODO: Add setting to alert if you're out of ammunition, possibly if below a certain number that can be set? And setting to ignore this -->"]
	[h,if(UsesAmmunitionTest && CurrentAmmoCount > 0),CODE:{
		[h,if(json.get(AmmunitionData,"AmmunitionDamage")!=""): thisAttackDamageData = json.merge(thisAttackDamageData,json.get(AmmunitionData,"AmmunitionDamage"))]
		[h,if(json.get(AmmunitionData,"Subeffects")!=""): thisAttackSubeffects = json.merge(thisAttackSubeffects,json.get(AmmunitionData,"Subeffects"))]
		[h:CurrentAmmoCount = CurrentAmmoCount - 1]
		[h:setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == "+json.get(AmmunitionData,"ItemID")+")]['Number']",CurrentAmmoCount))]
	};{}]

	[h:thisAttackTarget = json.get(wa.TargetList,SafeAttackCounter)]
	[h,if(wa.MeleeRanged == "Ranged"),CODE:{
		[h:LongRangeTest = getDistance(thisAttackTarget) > wa.Range]
		[h:tempPriorDisadvantage = json.get(thisAttackData,"Disadvantage")]
		[h,if(tempPriorDisadvantage == ""): tempPriorDisadvantage = 0]
		[h,if(LongRangeTest): thisAttackData = json.set(thisAttackData,"Disadvantage",tempPriorDisadvantage + 1)]
	};{}]

	[h:AllAttacksToHit = json.append(AllAttacksToHit,pm.a5e.AttackRoll(thisAttackData,json.append("","Attack","WeaponAttack"),thisAttackTarget))]

	[h:wa.NonDamageData = json.set("",
		"IsSpell",0,
		"IsWeapon",1,
		"IsAttack",1,
		"Modifier",1,
		"ScalingBase",0,
		"Target",thisAttackTarget,
		"PrimeStat",PrimeStat
	)]
	[h:thisAttackDamage = "[]"]
	[h,foreach(tempDamageInstance,thisAttackDamageData): thisAttackDamage = json.append(thisAttackDamage,pm.a5e.DamageRoll(tempDamageInstance,wa.NonDamageData,json.append("","Attack","WeaponAttack")))]
	
	[h:ModifyDamageRollData = "[]"]

	[h:pm.PassiveFunction("AttackRoll")]
	[h:pm.PassiveFunction("WeaponAttackRoll")]
	[h:pm.PassiveFunction("AttackRollTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("WeaponAttackRollTargeted",json.set("","ParentToken",thisAttackTarget))]
	
	[h,if(!json.isEmpty(ModifyDamageRollData)),CODE:{
		[h,MACRO("ModifyDamageRoll@Lib:pm.a5e.Core"): json.append("",thisAttackDamage,ModifyDamageRollData)]

		[h:thisAttackDamage = macro.return]
	};{}]	

	[h:AllAttacksDmg = json.append(AllAttacksDmg,thisAttackDamage)]
	[h:AllAttacksSubeffects = json.append(AllAttacksSubeffects,thisAttackSubeffects)]
	[h:SafeAttackCounter = SafeAttackCounter + 1]
}]

[h:WhichAttack=0]

[h:"<!-- MAYDO: Perhaps set up separate loops for attack and damage rolls with different tables, which are assembled separately depending on the condensed vs. expanded approach -->"]
[h:abilityTable = ""]
[h,count(AttackCount),CODE:{
	[h:thisAttackTarget = json.get(wa.TargetList,roll.count)]
	[h:thisAttackData = json.get(AllAttacksToHit,roll.count)]
	[h:thisAttackEffectID = json.get(wa.EffectIDs,roll.count)]
	[h:thisAttackd20Rolls = json.get(thisAttackData,"d20Rolls")]
	[h:thisAttackFinalRoll = json.get(thisAttackData,"FinalRoll")]
	[h:thisAttackAdvDis = json.get(thisAttackData,"AdvantageBalance")]
	[h:thisAttackToHit = json.get(thisAttackData,"ToHit")]
	[h:thisAttackToHitStr = json.get(thisAttackData,"ToHitStr")]
	[h:thisAttackToHitRules = json.get(thisAttackData,"RulesStr")]
	[h:thisAttackCrit = json.get(thisAttackData,"CritTest")]
	[h:thisAttackCritFail = json.get(thisAttackData,"CritFailTest")]

	[h:thisAttackAllDamage = json.path.put(json.get(AllAttacksDmg,roll.count),"[*]","UseCrit",thisAttackCrit)]

	[h:wa.AdvRerollLink = macroLinkText("Modify Attack Border@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Advantage",1,"ForcedAdvantage",1,"d20Rolls",thisAttackd20Rolls,"PreviousDamage",thisAttackAllDamage,"Target",json.get(wa.TargetList,roll.count),"AttackNum",-1,"EffectID",thisAttackEffectID),ParentToken)]
	[h:wa.DisRerollLink = macroLinkText("Modify Attack Border@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Disadvantage",1,"ForcedAdvantage",1,"d20Rolls",thisAttackd20Rolls,"PreviousDamage",thisAttackAllDamage,"Target",thisAttackTarget,"AttackNum",-1,"EffectID",thisAttackEffectID),ParentToken)]
	
	[h:ToHitTableLine = json.set("",
		"ShowIfCondensed",1,
		"Header","Attack Roll",
		"FalseHeader","",
		"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:"+CritColor,if(thisAttackCritFail,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+thisAttackToHit+"</span>",
		"RulesContents",thisAttackToHitRules+" = ",
		"RollContents",thisAttackToHitStr+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusSectionStyling1","",
		"Value",thisAttackToHit
	)]
	
	[h,if(thisAttackAdvDis == 0),CODE:{
		[h:ToHitTableLine = json.set(ToHitTableLine,
			"BonusBody1","Reroll: <a href = '"+wa.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+wa.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>"
		)]
	};{
		[h:extraRollsDisplay = ""]
		[h,foreach(tempRoll,thisAttackd20Rolls): extraRollsDisplay = listAppend(extraRollsDisplay,"Roll #"+(roll.count+1)+": "+(tempRoll+thisAttackToHit-thisAttackFinalRoll)," / ")]
		[h:extraRollsDisplay = "("+extraRollsDisplay+")"]
		[h:ToHitTableLine = json.set(ToHitTableLine,
			"BonusBody1",extraRollsDisplay
		)]
	}]
	
	[h:abilityTable = json.append(abilityTable,ToHitTableLine)]

	[h,foreach(tempDamageInstance,thisAttackAllDamage),CODE:{
		[h:thisAttackDmg = json.get(tempDamageInstance,"Total")]
		[h:thisAttackDmgStr = json.get(tempDamageInstance,"String")]
		[h:thisAttackDmgRules = json.get(tempDamageInstance,"Formula")]
		[h:thisAttackCritDmg = json.get(tempDamageInstance,"CritTotal")]
		[h:thisAttackCritDmgStr = json.get(tempDamageInstance,"CritString")]
		[h:thisAttackCritDmgRules = json.get(tempDamageInstance,"CritFormula")]
				
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(tempDamageInstance,"DamageType")+" Damage",
			"FalseHeader","",
			"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+if(thisAttackCrit,thisAttackCritDmg,thisAttackDmg)+"</span>",
			"RulesContents",if(thisAttackCrit,thisAttackCritDmgRules,thisAttackDmgRules)+" = ",
			"RollContents",if(thisAttackCrit,thisAttackCritDmgStr,thisAttackDmgStr)+" = ",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]

	[h:pm.PassiveFunction("AfterEachAttack")]
	[h:pm.PassiveFunction("AfterEachWeaponAttack")]
	[h:pm.PassiveFunction("AfterEachAttackTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("AfterEachWeaponAttackTargeted",json.set("","ParentToken",thisAttackTarget))]
	
	[h:pm.a5e.EffectData = json.append(pm.a5e.EffectData,json.set("",
		"Attack",thisAttackData,
		"Damage",thisAttackAllDamage,
		"Targets",json.append("",thisAttackTarget),
		"ID",thisAttackEffectID,
		"WhichIntrinsicSubeffect",WhichAttack
	))]
	[h:"<!-- TODO: Major issue - WhichIntrinsicSubeffect always being 0 will cause errors with multiple attacks. This whole method is flawed in the case of multiple attacks: If wIS is incremented each time, then subeffects cannot target it correctly. If not incremented, then subeffects will target ALL attacks, not just one of them. This will apply for missiles also. Currently incrementing; better solution may be to give a separate EffectID and SubeffectID. -->"]

	[h:AHLTier = 0]
	[h:DataForSubeffect = json.set("",
		"InstancePrefixes",json.append("","Attack","WeaponAttack"),
		"RerollData",wa.Data
	)]
	[h,foreach(tempSubeffect,wa.Subeffects): pm.a5e.ExecuteSubeffect(tempSubeffect,json.set("","BaseData",wa.Data,"MultiEffectModifier",WhichAttack))]

	[h:WhichAttack = WhichAttack + 1]
}]

[h:pm.PassiveFunction("AfterAttack")]
[h:pm.PassiveFunction("AfterWeaponAttack")]
[h:pm.PassiveFunction("AfterAttackTargeted",json.set("","ParentToken",thisAttackTarget))]
[h:pm.PassiveFunction("AfterWeaponAttackTargeted",json.set("","ParentToken",thisAttackTarget))]

[h:RemovedConditionGroups = json.path.read(a5e.stat.ConditionGroups,"[*][?(@.EndTriggers.AfterAttack != null && @.EndTriggers.AfterAttack != 0)]['GroupID']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(!json.isEmpty(RemovedConditionGroups)),CODE:{
	[h,macro("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",RemovedConditionGroups,"ParentToken",ParentToken)]
	[h:pm.RemovedConditions = json.get(macro.return,"Removed")]
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
};{}]

[h:macro.return = json.set("","Table",abilityTable,"Effect",pm.a5e.EffectData)]