[h:wa.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(wa.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Attack"]
[h:pm.a5e.EffectData = "[]"]
[h:pm.a5e.LinkedEffectData = "[]"]

[h:ActiveHand = json.get(wa.Data,"Hand")]
[h:OtherHands = "[]"]
[h:CurrentHeldItems = getProperty("a5e.stat.HeldItems")]
[h:TotalHands = json.length(CurrentHeldItems)]
[h,if(ActiveHand >= 0),CODE:{
	[h,count(TotalHands): OtherHands = if(roll.count == ActiveHand,OtherHands,json.append(OtherHands,roll.count))]
	[h:OtherHandsIDs = json.remove(CurrentHeldItems,ActiveHand)]
};{
	[h:"<!-- Note: ActiveHand -1 indicates natural weapon not using a hand -->"]
	[h,count(TotalHands): OtherHands = json.append(OtherHands,roll.count)]
	[h:OtherHandsIDs = CurrentHeldItems]
}]
[h:OtherHeldItems = json.path.read(getProperty("a5e.stat.Inventory",ParentToken),"\$[*][?(@.ItemID in "+OtherHandsIDs+")]")]

[h:Flavor = json.get(wa.Data,"Flavor")]
[h:AttackNum = json.get(wa.Data,"AttackNum")]
[h:ThrowingWeapon = json.get(wa.Data,"ThrowWeapon")]
[h:TwoWeaponFighting = json.get(wa.Data,"TwoWeaponFighting")]
[h,if(TwoWeaponFighting == ""): TwoWeaponFighting = 0]
[h:needsSplitGMOutput = json.get(wa.Data,"needsSplitGMOutput")]
[h,if(needsSplitGMOutput == ""): needsSplitGMOutput = (getProperty("a5e.stat.Allegiance") == "Enemy")]
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
[h:wa.ItemID = json.get(wa.WeaponUsed,"ItemID")]
[h:wa.MagicBonus = json.get(wa.WeaponUsed,"MagicBonus")]
[h:wa.WeaponType = json.get(wa.WeaponUsed,"WeaponType")]
[h:wa.Class = json.get(wa.WeaponUsed,"WeaponClass")]
[h:wa.DamageData = json.get(wa.WeaponUsed,"WeaponDamage")]
[h:wa.Reach = json.get(wa.WeaponUsed,"Reach")]
[h:wa.Range = json.get(wa.WeaponUsed,"Range")]
[h:wa.LongRange = json.get(wa.WeaponUsed,"LongRange")]
[h:wa.WeaponMeleeRanged = json.get(wa.WeaponUsed,"WeaponMeleeRanged")]
[h:wa.MeleeRanged = wa.WeaponMeleeRanged]
[h:"<!-- Note: wa.WeaponMeleeRanged is whether the weapon itself is a melee/ranged weapon, while wa.MeleeRanged is whether the attack is a melee/ranged attack. Distinction mostly for throwing weapons. -->"]

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

[h:wa.IsActiveTest = or(
	json.get(wa.WeaponUsed,"isActivatable") == 0,
	json.get(wa.WeaponUsed,"isActivatable") == "",
	and(
		json.get(wa.WeaponUsed,"isActivatable") == 1,
		json.get(wa.WeaponUsed,"IsActive") == 1)
)]
[h,if(wa.IsActiveTest):
	wa.WeaponEffects = json.get(wa.WeaponUsed,"WeaponEffects");
	wa.WeaponEffects = "[]"
]
[h,if(wa.WeaponEffects == ""): wa.WeaponEffects = "[]"]

[h:wa.Props = json.get(wa.WeaponUsed,"WeaponProperties")]
[h:wa.Magical = json.get(wa.WeaponUsed,"isMagical")]
[h:allWeaponProficiencies = stat.a5e.WeaponProficiency(ParentToken,a5e.UnifiedAbilities)]
[h:attack.WeaponProfType = number(json.get(allWeaponProficiencies,wa.WeaponType)) > 0]
[h:attack.WeaponProfClass = number(json.get(allWeaponProficiencies,wa.Class)) > 0]
[h:attack.WeaponProfNatural = and(wa.Class == "NaturalWeapon",json.get(wa.WeaponUsed,"isWeaponNotProficient") != 1)]
[h:tempMonsterProfTest = getProperty("a5e.stat.CreatureName") != "Adventurer"]
[h:attack.ProfTest = or(attack.WeaponProfType,attack.WeaponProfClass,attack.WeaponProfNatural,tempMonsterProfTest)]
[h:wa.TargetOrigin = ParentToken]

[h:wa.BrutalCrit = 0]
[h:"<!-- TODO: Add other primary stats as a property? Or otherwise? Probably just have a 'Primary Stat' option that isn't a property which defaults to Strength or Dex if ranged. -->"]
[h:PrimeStat = if(wa.MeleeRanged=="Ranged","Dexterity","Strength")]
[h,if(json.get(wa.WeaponUsed,"PrimeStat")!=""): PrimeStat = json.get(wa.WeaponUsed,"PrimeStat")]

[h:WeaponAttackPropertiesData = json.set(wa.WeaponUsed,
	"Hand",ActiveHand,
	"ThrowWeapon",ThrowingWeapon,
	"TwoWeaponFighting",TwoWeaponFighting
)]

[h:pm.PassiveFunction("AttackProps")]
[h:pm.PassiveFunction("WeaponAttackProps")]

[h:attack.ToHitBonus = wa.MagicBonus]
[h,if(!json.isEmpty(wa.DamageData)),CODE:{
	[h:FirstInstance = json.get(wa.DamageData,0)]
	[h:FirstInstance = json.set(FirstInstance,"DamageFlatBonus",json.get(FirstInstance,"DamageFlatBonus") + wa.MagicBonus)]
	[h:wa.DamageData = json.set(wa.DamageData,0,FirstInstance)]
};{}]

[h,if(!json.isEmpty(wa.DamageData)): wa.DamageData = json.path.put(wa.DamageData,"\$[0]","BonusCritDice",wa.BrutalCrit)]

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
	[h:AllInstanceDamageTypes = json.path.read(wa.DamageData,"\$[*]['Damage']['DamageType']")]
	[h:TempAllInstanceDamageTypeOptions = json.path.read(wa.DamageData,"\$[*]['Damage']['DamageTypeOptions']")]
	[h:AllInstanceDamageTypeOptions = "[]"]
	[h,foreach(instance,TempAllInstanceDamageTypeOptions): AllInstanceDamageTypeOptions = json.merge(AllInstanceDamageTypeOptions,instance)]
	[h:ImprovisedDamageTypes = json.unique(json.merge(AllInstanceDamageTypes,AllInstanceDamageTypeOptions))]

	[h:NewDamageInstance = json.set("",
		"DamageDieNumber",1,
		"DamageDieSize",4,
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
	[h:wa.MeleeRanged = "Ranged"]
};{
	[h,if(ThrowingWeapon): wa.MeleeRanged = "Ranged"]
}]

[h:"<!-- TODO: Current method is to remove TWF completely to get around the no damage modifier effect (e.g. for the fighting style). Issues are #1: It is still technically TWF, so any effects that would trigger on TWF would not be able to; solution could be adding a variable that bypasses removing the mod. #2: TWF still adds damage modifier if negative; solution could be changing IsDamageModifier -->"]
[h,if(TwoWeaponFighting),CODE:{
	[h:"<!-- TODO: Needs to only do this if modifier isn't negative -->"]
	[h:wa.DamageData = json.path.set(wa.DamageData,"\$[*]['IsModBonus']",0)]
};{}]

[h:"<!-- TODO: Will need to ensure that the empty hand is allowed to make attacks in the future -->"]
[h:NonEmptyHandIDs = json.difference(OtherHandsIDs,json.append("",""))]
[h:AllHandsEmpty = json.isEmpty(NonEmptyHandIDs)]
[h:EmptyHandTest = !json.isEmpty(json.difference(OtherHandsIDs,NonEmptyHandIDs))]

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
		[h:tempAmmunitionData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+wa.AmmunitionID+"')]")]
		[h,if(json.isEmpty(tempAmmunitionData)):
			AmmunitionData = "{}";
			AmmunitionData = json.get(tempAmmunitionData,0)
		]
	}]

	[h:CurrentAmmoCount = number(json.get(AmmunitionData,"Number"))]

	[h:WeaponAttackPropertiesData = json.set(WeaponAttackPropertiesData,"AmmunitionData",AmmunitionData)]
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
[h:wa.AllTargets = pm.a5e.TargetCreatureTargeting(json.set("",
	"ValidTargets",json.get(wa.TargetOptions,"ValidTargets"),
	"TargetNumber",1,
	"ParentToken",ParentToken,
	"Origin",wa.TargetOrigin
),AttackCount)]
[h,if(AttackCount==1),CODE:{
	[h:wa.TargetList = wa.AllTargets]
};{
	[h:wa.TargetList = "[]"]
	[h,count(AttackCount): wa.TargetList = json.merge(wa.TargetList,json.get(wa.AllTargets,roll.count))]
}]

[h:WeaponAttackPropertiesData = json.set(WeaponAttackPropertiesData,"MeleeRangedAttack",wa.MeleeRanged)]

[h:AllAttacksToHit = "[]"]
[h:AllAttacksDmg = "[]"]
[h:AllAttacksSubeffects = "[]"]

[h:SafeAttackCounter = 0]
[h,count(AttackCount),CODE:{
	[h:thisAttackData = wa.Data]
	[h:thisAttackDamageData = wa.DamageData]
	[h,if(json.length(wa.EffectIDs)-1 < SafeAttackCounter): wa.EffectIDs = json.append(wa.EffectIDs,pm.a5e.GenerateEffectID())]
	
	[h,if(json.length(wa.WeaponEffects) > 1),CODE:{
		[h:"<!-- TODO: Implement an input for which effect to use, or randomization -->"]
	};{
		[h,if(json.length(wa.WeaponEffects) == 1):
			thisAttackSubeffects = json.get(json.get(wa.WeaponEffects,0),"Subeffects");
			thisAttackSubeffects = "[]"
		]
	}]

	[h:"<!-- TODO: Add setting to alert if you're out of ammunition, possibly also a warning if nearing empty if below a certain number that can be set? And setting to ignore this -->"]
	[h:"<!-- TODO: Need to update Ammo subeffects to new data format -->"]
	[h,if(UsesAmmunitionTest && CurrentAmmoCount > 0),CODE:{
		[h,if(json.get(AmmunitionData,"AmmunitionDamage")!=""): thisAttackDamageData = json.merge(thisAttackDamageData,json.get(AmmunitionData,"AmmunitionDamage"))]
		[h,if(json.get(AmmunitionData,"Subeffects")!=""): thisAttackSubeffects = json.merge(thisAttackSubeffects,json.get(AmmunitionData,"Subeffects"))]
		[h:CurrentAmmoCount = CurrentAmmoCount - 1]
		[h:setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+json.get(AmmunitionData,"ItemID")+"')]['Number']",CurrentAmmoCount))]
	};{}]

	[h:thisAttackTarget = json.get(json.get(wa.TargetList,SafeAttackCounter),0)]
	[h,if(wa.MeleeRanged == "Ranged"),CODE:{
		[h:LongRangeTest = getDistance(thisAttackTarget) > wa.Range]
		[h:tempPriorDisadvantage = json.get(thisAttackData,"Disadvantage")]
		[h,if(tempPriorDisadvantage == ""): tempPriorDisadvantage = 0]
		[h,if(LongRangeTest): thisAttackData = json.set(thisAttackData,"Disadvantage",tempPriorDisadvantage + 1)]
		[h,if(getDistance(thisAttackTarget) <= 5): thisAttackData = json.set(thisAttackData,"Disadvantage",tempPriorDisadvantage + 1)]

		[h:"<!-- TODO: These should be set as variables so that effects (e.g. cbow expert) can specifically remove the disadvantage from this instance. -->"]
	};{}]

	[h:thisAttackToHitData = pm.a5e.AttackRoll(thisAttackData,json.append("","Attack","WeaponAttack"),thisAttackTarget)]
	[h:thisAttackToHitData = json.set(thisAttackToHitData,"Subeffects",thisAttackSubeffects)]
	[h:AllAttacksToHit = json.append(AllAttacksToHit,thisAttackToHitData)]

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

	[h:pm.PassiveFunction("AttackDamageRoll")]
	[h:pm.PassiveFunction("WeaponAttackDamageRoll")]
	[h:pm.PassiveFunction("AttackDamageRollTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("WeaponAttackDamageRollTargeted",json.set("","ParentToken",thisAttackTarget))]
	
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
	[h:thisAttackTarget = json.get(json.get(wa.TargetList,roll.count),0)]
	[h:thisAttackData = json.get(AllAttacksToHit,roll.count)]
	[h:thisAttackEffectID = json.get(wa.EffectIDs,roll.count)]
	[h:thisAttackAllDamage = json.get(AllAttacksDmg,roll.count)]
	[h:thisAttackd20Rolls = json.get(thisAttackData,"d20Rolls")]
	[h:thisAttackFinalRoll = json.get(thisAttackData,"FinalRoll")]
	[h:thisAttackAdvDis = json.get(thisAttackData,"AdvantageBalance")]
	[h:thisAttackAdvantageMessages = json.get(thisAttackData,"AdvantageMessageArray")]
	[h:thisAttackToHit = json.get(thisAttackData,"Value")]
	[h:thisAttackToHitStr = json.get(thisAttackData,"RollString")]
	[h:thisAttackToHitRules = json.get(thisAttackData,"Formula")]
	[h:thisAttackCrit = json.get(thisAttackData,"CritTest")]
	[h:thisAttackCritFail = json.get(thisAttackData,"CritFailTest")]
	
	[h:thisAttackSubeffects = json.get(thisAttackData,"Subeffects")]

	[h:d20Data = json.merge(wa.Data,json.set(thisAttackData,"TestType","Attack"))]
	[h:d20Data = json.set(d20Data,"PreviousDamage",thisAttackAllDamage,"Target",thisAttackTarget,"ID",thisAttackEffectID)]
	[h:rerollLinkBase = d20Data]
	[h:wa.AdvRerollLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(rerollLinkBase,"PreviousDamage",thisAttackAllDamage,"Target",thisAttackTarget,"AttackNum",-1,"ID",thisAttackEffectID,"RerollData",json.set("","Advantage",1,"Disadvantage",0,"ForcedAdvantage",1)),ParentToken)]
	[h:wa.DisRerollLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(rerollLinkBase,"PreviousDamage",thisAttackAllDamage,"Target",thisAttackTarget,"AttackNum",-1,"ID",thisAttackEffectID,"RerollData",json.set("","Advantage",0,"Disadvantage",1,"ForcedAdvantage",1)),ParentToken)]

	[h:ToHitTableLine = "{}"]

	[h,if(thisAttackAdvDis == 0),CODE:{
		[h:ToHitTableLine = json.set(ToHitTableLine,
			"BonusBody1","Reroll: <a href = '"+wa.AdvRerollLink+"'><span style = 'color:%{LinkTextColor}'>Adv.</span></a> / <a href = '"+wa.DisRerollLink+"'><span style = 'color:%{LinkTextColor}'>Dis.</span></a>"
		)]
	};{
		[h:extraRollsDisplay = ""]
		[h,foreach(tempRoll,thisAttackd20Rolls): extraRollsDisplay = listAppend(extraRollsDisplay,"Roll <a href = '"+macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"ForcedRoll",tempRoll),ParentToken)+"'><span style = 'color:%{LinkTextColor}'; title = 'Use this roll'>#"+(roll.count+1)+"</span></a>: "+(tempRoll+thisAttackToHit-thisAttackFinalRoll)," / ")]
		[h:extraRollsDisplay = "("+extraRollsDisplay+")"]
		[h:ToHitTableLine = json.set(ToHitTableLine,
			"BonusBody1",extraRollsDisplay
		)]
	}]
	
	[h:ToHitTableLine = json.set(ToHitTableLine,
		"ShowIfCondensed",1,
		"Header","Attack Roll",
		"FalseHeader","",
		"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:%{CritTextColor}",if(thisAttackCritFail,"font-size:2em; color:%{CritFailTextColor}","font-size:1.5em"))+"'>"+thisAttackToHit+"</span>",
		"RulesContents","<span "+if(!json.isEmpty(thisAttackAdvantageMessages),"title='"+pm.a5e.CreateDisplayList(thisAttackAdvantageMessages,"and")+"'","")+">"+json.get(thisAttackData,"FormulaPrefix")+thisAttackToHitRules+"</span> = ",
		"RollContents",thisAttackFinalRoll+thisAttackToHitStr+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusSectionStyling1","",
		"TableLineName","AttackRoll"+roll.count
	)]

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
			"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:%{CritTextColor}","font-size:1.5em")+"'>"+if(thisAttackCrit,thisAttackCritDmg,thisAttackDmg)+"</span>",
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
		"WeaponData",WeaponAttackPropertiesData,
		"WhichIntrinsicSubeffect",WhichAttack
	))]
	[h:"<!-- TODO: Major issue - WhichIntrinsicSubeffect always being 0 will cause errors with multiple attacks. This whole method is flawed in the case of multiple attacks: If wIS is incremented each time, then subeffects cannot target it correctly. If not incremented, then subeffects will target ALL attacks, not just one of them. This will apply for missiles also. Currently incrementing; better solution may be to give a separate EffectID and SubeffectID. -->"]

	[h:AHLTier = 0]
	[h:DataForSubeffect = json.set("",
		"InstancePrefixes",json.append("","Attack","WeaponAttack"),
		"RerollData",wa.Data
	)]
	[h,foreach(tempSubeffect,thisAttackSubeffects): pm.a5e.ExecuteSubeffect(tempSubeffect,json.set("","BaseData",wa.Data,"MultiEffectModifier",WhichAttack,"InstancePrefixes",json.append("","Weapon")))]

	[h:AHLTier = 0]
	[h:DataForSubeffect = json.set("",
		"InstancePrefixes",json.append("","Attack","WeaponAttack"),
		"RerollData",wa.Data
	)]

	[h,foreach(tempSubeffect,json.get(wa.WeaponUsed,"Subeffects")): pm.a5e.ExecuteSubeffect(tempSubeffect,json.set("","BaseData",wa.Data))]

	[h:WhichAttack = WhichAttack + 1]
}]

[h,if(ThrowingWeapon && !json.contains(wa.Props,"Returning")),CODE:{
	[h:"<!-- TODO: Need a test to see if the weapon is still in the attacker's hands (for thrown weapons with multiattack). Also likely move this back into the loop. -->"]
	[h,MACRO("DropItem@Lib:pm.a5e.Core"): json.set("",
		"ItemID",json.get(wa.WeaponUsed,"ItemID"),
		"Number",1,
		"Location",json.set("","Token",thisAttackTarget),
		"ParentToken",ParentToken,
		"LeaveToken",1
	)]
};{}]

[h,if(!TwoWeaponFighting && json.contains(wa.Props,"Light")),CODE:{
	[h:TwoHandedLinks = ""]
	[h,foreach(weapon,OtherHeldItems),CODE:{
		[h:thisWeaponHand = -1]
		[h,foreach(hand,CurrentHeldItems): thisWeaponHand = if(json.get(weapon,"ItemID") == hand,roll.count,thisWeaponHand)]
		[h:thisWeaponIsLight = json.contains(json.get(weapon,"WeaponProperties"),"Light")]
		[h,if(thisWeaponIsLight): thisWeaponLink = macroLinkText("SingleAttack@Lib:pm.a5e.Core","self-gm",json.set("","Hand",thisWeaponHand,"ParentToken",ParentToken,"AttackNum",-1,"IsTooltip",0,"TwoWeaponFighting",1),ParentToken)]
		[h,if(thisWeaponIsLight): TwoHandedLinks = listAppend(TwoHandedLinks,"<a href = '"+thisWeaponLink+"'><span style = 'color:%{LinkTextColor}'>"+json.get(weapon,"DisplayName")+"</span></a>", " / ")]
	}]

	[h,if(TwoHandedLinks != ""): abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Two Weapon Fighting",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",TwoHandedLinks,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]

[h:pm.PassiveFunction("AfterAttack")]
[h:pm.PassiveFunction("AfterWeaponAttack")]
[h:pm.PassiveFunction("AfterAttackTargeted",json.set("","ParentToken",thisAttackTarget))]
[h:pm.PassiveFunction("AfterWeaponAttackTargeted",json.set("","ParentToken",thisAttackTarget))]

[h:EndConditionAfterAttack = pm.a5e.TriggerConditionEnd("AfterAttack",ParentToken)]
[h:ConditionsRemovedAfterAttack = json.get(EndConditionAfterAttack,"Removed")]
[h:abilityTable = json.merge(abilityTable,json.get(EndConditionAfterAttack,"Table"))]
[h:conditionEndEffects = json.get(EndConditionAfterAttack,"Effects")]
[h:pm.a5e.EffectData = json.merge(pm.a5e.EffectData,conditionEndEffects)]

[h:macro.return = json.set("","Table",abilityTable,"Effect",pm.a5e.EffectData)]