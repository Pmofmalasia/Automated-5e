[h:wa.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(wa.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Attack"]
[h:pm.a5e.EffectData = "[]"]

[h:Flavor = json.get(wa.Data,"Flavor")]
[h:Hand = json.get(wa.Data,"Hand")]
[h:OtherHand = if(Hand==0,1,0)]
[h:AttackNum = json.get(wa.Data,"AttackNum")]
[h:ThrowingWeapon = json.get(wa.Data,"ThrowWeapon")]
[h:DMOnly = json.get(wa.Data,"DMOnly")]
[h:DMOnly = 0]
[h:ShowFullRules = 1]
[h:wa.WeaponUsed = json.get(wa.Data,"WeaponData")]
[h:wa.EffectIDs = json.get(wa.Data,"ID")]
[h:wa.PresetTarget = json.get(wa.Data,"Target")]
[h,if(wa.EffectIDs == ""): wa.EffectIDs = "[]"]

[h:BorderColorOverride = json.get(wa.Data,"BorderColorOverride")]
[h:TitleFontColorOverride = json.get(wa.Data,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(wa.Data,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(wa.Data,"AccentTextOverride")]
[h:TitleFont = json.get(wa.Data,"TitleFont")]
[h:BodyFont = json.get(wa.Data,"BodyFont")]
[h:CritMessage = json.get(wa.Data,"CritMessage")]
[h:CritFailMessage = json.get(wa.Data,"CritFailMessage")]

[h:wa.Name = json.get(wa.WeaponUsed,"Name")]
[h:wa.MagicBonus = json.get(wa.WeaponUsed,"MagicBonus")]
[h:wa.WeaponType = json.get(wa.WeaponUsed,"Type")]
[h:wa.DmgDie = json.get(wa.WeaponUsed,"DamageDie")]
[h:wa.DmgType = json.get(wa.WeaponUsed,"DamageType")]
[h:wa.DmgDie2 = json.get(wa.WeaponUsed,"SecDamageDie")]
[h:wa.DmgType2 = json.get(wa.WeaponUsed,"SecDamageType")]
[h:wa.MeleeRanged = json.get(wa.WeaponUsed,"MeleeRanged")]
[h:wa.Class = json.get(wa.WeaponUsed,"Class")]
[h:wa.Reach = json.get(wa.WeaponUsed,"Reach")]
[h:wa.Range = json.get(wa.WeaponUsed,"Range")]
[h:attack.CritRange = json.get(wa.WeaponUsed,"CritRange")]
[h:wa.CritMultiplier = 1 + json.get(wa.WeaponUsed,"CritMultiplier")]
[h:wa.SpecialAbility = json.get(wa.WeaponUsed,"SpecialAbility")]
[h:wa.Props = json.get(wa.WeaponUsed,"Props")]
[h:wa.Magical = json.get(wa.WeaponUsed,"isMagical")]
[h:attack.ProfTest = if(json.get(getProperty("a5e.stat.WeaponProficiencies"),wa.WeaponType)==1,1,0)]
[h:attack.ToHitBonus = wa.MagicBonus]
[h:wa.ProfTest = 1]
[h:wa.TargetOrigin = ParentToken]

[h:pm.PassiveFunction("AttackProps")]
[h:pm.PassiveFunction("WeaponAttackProps")]

[h:VersatileTest = 0]
[h,if(VersatileTest==1),code:{
	[wa.DmgDie=substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d")+1)+(number(substring(wa.DmgDie,indexOf(wa.DmgDie,"d")+1))+2)]
};{}]

[h,if(ThrowingWeapon && json.get(wa.Props,"Thrown")==0),CODE:{
	[h:wa.DmgDie = "1d4"]
	[h:wa.Class = "Improvised"]
};{}]

[h:PrimeStat = if(and(json.get(wa.Props,"Finesse")>0,json.get(getProperty("a5e.stat.AtrMods"),"Dexterity")>json.get(getProperty("a5e.stat.AtrMods"),"Strength")),"Dexterity","Strength")]
[h:PrimeStat = if(wa.MeleeRanged=="Ranged","Dexterity",PrimeStat)]
[h:PrimeStat = if(json.get(wa.Props,"IntMod")>0,"Intelligence",PrimeStat)]
[h:PrimeStat = if(json.get(wa.Props,"WisMod")>0,"Wisdom",PrimeStat)]
[h:PrimeStat = if(json.get(wa.Props,"ChaMod")>0,"Charisma",PrimeStat)]
[h,if(json.get(wa.Props,"PrimeStat")!=""): PrimeStat = json.get(wa.Props,"PrimeStat")]

[h:pm.PassiveFunction("AttackStat")]
[h:pm.PassiveFunction("WeaponAttackStat")]

[h:attack.PrimeStatBonus = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
[h:PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]

[h:wa.DmgDieSize = number(substring(wa.DmgDie,indexOf(wa.DmgDie,"d")+1))]
[h:wa.DmgDie2Size = number(substring(wa.DmgDie2,indexOf(wa.DmgDie2,"d")+1))]

[h:wa.BrutalCrit = 0]
[h:CritDmgDie = (wa.CritMultiplier*number(substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d")))) + wa.BrutalCrit]
[h:wa.DmgDie2Placehold = if(wa.DmgDie2=="0","0d1",wa.DmgDie2)]
[h:CritSecDmgDie = (wa.CritMultiplier*number(substring(wa.DmgDie2Placehold,0,indexOf(wa.DmgDie2Placehold,"d"))))]

[h:wa.DmgDieNum = number(substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d")))]
[h:wa.DmgDie2Num = number(substring(wa.DmgDie2,0,1))]

[h,if(AttackNum<0),CODE:{
	[h:AttackCount = abs(AttackNum)]
};{
	[h:AttackCount = AttackNum]
	[h:pm.PassiveFunction("AttackNum")]
	[h:pm.PassiveFunction("WeaponAttackNum")]
}]

[h:"<!-- Note: Not using SelfOnlyTest here for targeting to avoid CODE block limits, but shouldn't need it since attacks don't generally only target self anyway. -->"]
[h,if(wa.PresetTarget == ""),CODE:{
	[h:wa.TargetOptionData = pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Number",1,"Allegiance",json.set("","NotSelf",1),"Origin",wa.TargetOrigin,"Range",json.set("","Value",if(wa.MeleeRanged=="Ranged",wa.Range,wa.Reach),"Units","Feet")),"{}")]
	
	[h:wa.TargetOptions = json.get(wa.TargetOptionData,"ValidTargets")]

	[h:wa.AllTargets = pm.a5e.TargetCreatureTargeting(wa.TargetOptions,1,AttackCount)]
	[h,if(AttackCount==1),CODE:{
		[h:wa.TargetList = wa.AllTargets]
	};{
		[h:wa.TargetList = "[]"]
		[h,count(AttackCount): wa.TargetList = json.merge(wa.TargetList,json.get(wa.AllTargets,roll.count))]
	}]	
};{
	[h:wa.TargetList = "[]"]
	[h,count(AttackCount): wa.TargetList = json.append(wa.TargetList,wa.PresetTarget)]
}]

[h:AllAttacksToHit = "[]"]
[h:AllAttacksDmg = "[]"]
[h:AllAttacksDmg2 = "[]"]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h,count(AttackCount),code:{
	[h,if(json.length(wa.EffectIDs)-1 < roll.count): wa.EffectIDs = json.append(wa.EffectIDs,pm.a5e.GenerateEffectID())]
	[h:thisAttackTarget = json.get(wa.TargetList,roll.count)]

	[h:AllAttacksToHit = json.append(AllAttacksToHit,pm.a5e.AttackRoll(wa.Data,json.append("","Attack","WeaponAttack"),thisAttackTarget))]

	[h:"<!-- An array is created with the size of the dice for regular damage, crits, and flat damage. Variables are created for passive functions to use. -->"]
	[h:"<!-- The array is created so that later passive functions that reroll dice have a reference for the original die size - since added dice may be of a different size. -->"]
	
	[h:wa.AllDmgDice = "[]"]
	[h,count(wa.DmgDieNum): wa.AllDmgDice = json.append(wa.AllDmgDice,wa.DmgDieSize)]
	[h:wa.DmgRules = wa.DmgDieNum+"d"+wa.DmgDieSize]

	[h:wa.AllCritDmgDice = "[]"]
	[h,count(CritDmgDie): wa.AllCritDmgDice = json.append(wa.AllCritDmgDice,wa.DmgDieSize)]
	[h:wa.CritDmgRules = CritDmgDie+"d"+wa.DmgDieSize]
	
	[h:flatBonusRules = substring(PrimeStat,0,3)+if(wa.MagicBonus==0,""," + Magic")]
	[h:flatDmgTotal = attack.PrimeStatBonus+wa.MagicBonus]
	
	[h:wa.AddedRolledDamageRules = ""]
	[h:wa.AddedFlatDamageRules = ""]
	[h:wa.AddedRolledDamageDice = "[]"]
	[h:wa.AddedFlatDamage = "[]"]
	
	[h:"<!-- Repeat all for 2nd damage type -->"]
	[h,if(wa.DmgDie2 == "0"),CODE:{};{
		[h:wa.AllDmgDice2 = "[]"]
		[h,count(wa.DmgDie2Num): wa.AllDmgDice2 = json.append(wa.AllDmgDice2,wa.DmgDie2Size)]
		[h:wa.DmgRules2 = wa.DmgDie2Num+"d"+wa.DmgDie2Size]
	
		[h:wa.AllCritDmgDice2 = "[]"]
		[h,count(CritSecDmgDie): wa.AllCritDmgDice2 = json.append(wa.AllCritDmgDice2,wa.DmgDie2Size)]
		[h:wa.CritDmgRules2 = CritSecDmgDie+"d"+wa.DmgDie2Size]
		
		[h:flatBonusRules2 = ""]
		[h:flatDmg2Total = 0]
		
		[h:wa.AddedRolledDamageRules2 = ""]
		[h:wa.AddedFlatDamageRules2 = ""]
		[h:wa.AddedRolledDamageDice2 = "[]"]
		[h:wa.AddedFlatDamage2 = "[]"]		
	}]
   
	[h:pm.PassiveFunction("WeaponDamage")]
	[h:pm.PassiveFunction("WeaponAttackDamage")]
	[h:pm.PassiveFunction("AttackDamageTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("WeaponAttackDamageTargeted",json.set("","ParentToken",thisAttackTarget))]
	
	[h:"<!-- Merge all of the arrays of dice into one, then roll them into a new array of rolled dice. -->"]
	[h:"<!-- New array is summed for total damage, and put into a list for display. -->"]
	[h:"<!-- Array of dice is summed for max possible damage. -->"]
	[h:wa.DmgRulesFinal = wa.DmgRules+if(wa.AddedRolledDamageRules=="",""," + "+wa.AddedRolledDamageRules)+" + "+flatBonusRules+if(wa.AddedFlatDamageRules=="",""," + "+wa.AddedFlatDamageRules)]
	[h:wa.CritDmgRulesFinal = wa.DmgRules+" + "+wa.CritDmgRules+if(wa.AddedRolledDamageRules=="",""," + "+wa.AddedRolledDamageRules+" + "+wa.AddedRolledDamageRules)+" + "+flatBonusRules+if(wa.AddedFlatDamageRules=="",""," + "+wa.AddedFlatDamageRules)]
	
	[h:wa.FinalDamageDice = json.merge(wa.AllDmgDice,wa.AddedRolledDamageDice)]
	[h:wa.DmgArray = "[]"]
	[h,foreach(die,wa.FinalDamageDice): wa.DmgArray = json.append(wa.DmgArray,eval("1d"+die))]
	[h,if(json.isEmpty(wa.AddedFlatDamage)): wa.TotalAddedFlatDamage = flatDmgTotal; wa.TotalAddedFlatDamage = math.arraySum(wa.AddedFlatDamage) + flatDmgTotal]

	[h:wa.Dmg = math.arraySum(wa.DmgArray) + wa.TotalAddedFlatDamage]
	[h:wa.DmgRolls = json.toList(wa.DmgArray," + ")+pm.PlusMinus(attack.PrimeStatBonus,1)+pm.PlusMinus(wa.MagicBonus,0)+if(json.isEmpty(wa.AddedFlatDamage),""," + "+json.toList(wa.AddedFlatDamage," + "))]
	[h:wa.DmgMax = math.arraySum(wa.FinalDamageDice) + wa.TotalAddedFlatDamage]
	
	[h:wa.FinalCritDamageDice = json.merge(wa.AllDmgDice,wa.AllCritDmgDice,wa.AddedRolledDamageDice,wa.AddedRolledDamageDice)]
	[h:wa.CritDmgArray = "[]"]
	[h,foreach(die,wa.FinalCritDamageDice): wa.CritDmgArray = json.append(wa.CritDmgArray,eval("1d"+die))]
	[h:wa.CritDmg = math.arraySum(wa.CritDmgArray) + wa.TotalAddedFlatDamage]
	[h:wa.CritDmgRolls = json.toList(wa.CritDmgArray," + ")+pm.PlusMinus(attack.PrimeStatBonus,1)+pm.PlusMinus(wa.MagicBonus,0)+if(json.isEmpty(wa.AddedFlatDamage),""," + "+json.toList(wa.AddedFlatDamage," + "))]
	[h:wa.CritDmgMax = math.arraySum(wa.FinalCritDamageDice) + wa.TotalAddedFlatDamage]

	[h:ThisAttackDmg = json.set("",
		"Array",wa.DmgArray,
		"Total",wa.Dmg,
		"String",wa.DmgRolls,
		"MaxTotal",wa.DmgMax,
		"Dice",wa.FinalDamageDice,
		"Bonus",wa.TotalAddedFlatDamage,
		"Formula",wa.DmgRulesFinal,
		"CritFormula",wa.CritDmgRulesFinal,
		"CritDice",wa.FinalCritDamageDice,
		"CritArray",wa.CritDmgArray,
		"CritString",wa.CritDmgRolls,
		"CritTotal",wa.CritDmg,
		"CritMaxTotal",wa.CritDmgMax,
		"DamageType",wa.DmgType,
		"NoModification",0,
		"IsWeapon",1,
		"IsSpell",0,
		"Modifier",1
	)]

	[h,if(wa.DmgDie2=="0"),CODE:{};{
		[h:wa.DmgRulesFinal2 = wa.DmgRules2+if(wa.AddedRolledDamageRules2=="",""," + "+wa.AddedRolledDamageRules2)+if(flatBonusRules2=="",""," + "+flatBonusRules2)]
		[h:wa.CritDmgRulesFinal2 = wa.DmgRules2+" + "+wa.CritDmgRules2+if(wa.AddedRolledDamageRules2=="",""," + "+wa.AddedRolledDamageRules2+" + "+wa.AddedRolledDamageRules2)+if(flatBonusRules2=="",""," + "+flatBonusRules2)+if(wa.AddedFlatDamageRules2=="",""," + "+wa.AddedFlatDamageRules2)]
		
		[h:wa.FinalDamageDice2 = json.merge(wa.AllDmgDice2,wa.AddedRolledDamageDice2)]
		[h:wa.DmgArray2 = "[]"]
		[h,foreach(die,wa.FinalDamageDice2): wa.DmgArray2 = json.append(wa.DmgArray2,eval("1d"+die))]
		[h,if(json.isEmpty(wa.AddedFlatDamage2)): wa.TotalAddedFlatDamage2 = flatDmg2Total; wa.TotalAddedFlatDamage2 = math.arraySum(wa.AddedFlatDamage2) + flatDmg2Total]
		[h:wa.Dmg2 = math.arraySum(wa.DmgArray2) + wa.TotalAddedFlatDamage2]
		[h:wa.DmgRolls2 = json.toList(wa.DmgArray2," + ")+if(json.isEmpty(wa.AddedFlatDamage2),""," + "+json.toList(wa.AddedFlatDamage2," + "))]
		[h:wa.DmgMax2 = math.arraySum(wa.FinalDamageDice2) + wa.TotalAddedFlatDamage2]
		
		[h:wa.FinalCritDamageDice2 = json.merge(wa.AllDmgDice2,wa.AllCritDmgDice2,wa.AddedRolledDamageDice2,wa.AddedRolledDamageDice2)]
		[h:wa.CritDmgArray2 = "[]"]
		[h,foreach(die,wa.FinalCritDamageDice2): wa.CritDmgArray2 = json.append(wa.CritDmgArray2,eval("1d"+die))]
		[h:wa.CritDmg2 = math.arraySum(wa.CritDmgArray2) + wa.TotalAddedFlatDamage2]
		[h:wa.CritDmgRolls2 = json.toList(wa.CritDmgArray2," + ")+if(json.isEmpty(wa.AddedFlatDamage2),""," + "+json.toList(wa.AddedFlatDamage2," + "))]
		[h:wa.CritDmgMax2 = math.arraySum(wa.FinalCritDamageDice2) + wa.TotalAddedFlatDamage2]

		[h:ThisAttackDmg = json.set(ThisAttackDmg,"DmgRules2",wa.DmgRulesFinal2,"DamageDice2",wa.FinalDamageDice2,"DmgArray2",wa.DmgArray2,"DmgRolls2",wa.DmgRolls2,"Dmg2",wa.Dmg2,"DmgMax2",wa.DmgMax2,"CritDmgRules2",wa.CritDmgRulesFinal2,"CritDamageDice2",wa.FinalCritDamageDice2,"CritDmgArray2",wa.CritDmgArray2,"CritDmgRolls2",wa.CritDmgRolls2,"CritDmg2",wa.CritDmg2,"CritDmgMax2",wa.CritDmgMax2)]

		[h:ThisAttackDmg2 = json.set("",
			"Array",wa.DmgArray2,
			"Total",wa.Dmg2,
			"String",wa.DmgRolls2,
			"MaxTotal",wa.DmgMax2,
			"Dice",wa.FinalDamageDice2,
			"Bonus",wa.TotalAddedFlatDamage2,
			"Formula",wa.DmgRulesFinal2,
			"CritFormula",wa.CritDmgRulesFinal2,
			"CritDice",wa.FinalCritDamageDice2,
			"CritArray",wa.CritDmgArray2,
			"CritString",wa.CritDmgRolls2,
			"CritTotal",wa.CritDmg2,
			"CritMaxTotal",wa.CritDmgMax2,
			"DamageType",wa.DmgType2,
			"NoModification",0,
			"IsWeapon",1,
			"IsSpell",0,
			"Modifier",1
		)]
	}]

	[h:pm.PassiveFunction("AttackRoll")]
	[h:pm.PassiveFunction("WeaponAttackRoll")]
	[h:pm.PassiveFunction("AttackRollTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("WeaponAttackRollTargeted",json.set("","ParentToken",thisAttackTarget))]

	[h:thisAttackWeaponDamage = json.append("",ThisAttackDmg)]
	[h,if(wa.DmgDie2!=0): json.append(thisAttackWeaponDamage,ThisAttackDmg2)]

	[h:AllAttacksDmg = json.append(AllAttacksDmg,thisAttackWeaponDamage)]
}]

[h:WhichAttack=0]

[h:"<!-- TODO: Perhaps set up separate loops for attack and damage rolls with different tables, which are assembled separately depending on the condensed vs. expanded approach -->"]
[h:abilityTable = ""]
[h,count(AttackCount),CODE:{
	[h:thisAttackTarget = json.get(wa.TargetList,roll.count)]
	[h:thisAttackd20Rolls = json.get(json.get(AllAttacksToHit,roll.count),"d20Rolls")]
	[h:thisAttackFinalRoll = json.get(json.get(AllAttacksToHit,roll.count),"FinalRoll")]
	[h:thisAttackAdvDis = json.get(json.get(AllAttacksToHit,roll.count),"Advantage")]
	[h:thisAttackToHit = json.get(json.get(AllAttacksToHit,roll.count),"TotalBonus")]
	[h:thisAttackToHitStr = json.get(json.get(AllAttacksToHit,roll.count),"RollString")]
	[h:thisAttackToHitRules = json.get(json.get(AllAttacksToHit,roll.count),"Formula")]
	[h:thisAttackCrit = json.get(json.get(AllAttacksToHit,roll.count),"CritTest")]
	[h:thisAttackCritFail = json.get(json.get(AllAttacksToHit,roll.count),"CritFailTest")]

	[h:thisAttackDamageInfo = json.get(thisAttackAllDamage,0)]
	[h:thisAttackDmg = json.get(thisAttackDamageInfo,"Total")]
	[h:thisAttackDmgStr = json.get(thisAttackDamageInfo,"String")]
	[h:thisAttackDmgRules = json.get(thisAttackDamageInfo,"Formula")]
	[h:thisAttackCritDmg = json.get(thisAttackDamageInfo,"CritTotal")]
	[h:thisAttackCritDmgStr = json.get(thisAttackDamageInfo,"CritString")]
	[h:thisAttackCritDmgRules = json.get(thisAttackDamageInfo,"CritFormula")]
	
	[h,if(wa.DmgDie2!=0):
		thisAttackDamageInfo2 = json.get(thisAttackAllDamage,1);
		thisAttackDamageInfo2 = "{}"
	]
	[h:thisAttackDmg2 = json.get(thisAttackDamageInfo2,"Total")]
	[h:thisAttackDmg2Str = json.get(thisAttackDamageInfo2,"String")]
	[h:thisAttackDmg2Rules = json.get(thisAttackDamageInfo2,"Formula")]
	[h:thisAttackCritDmg2 = json.get(thisAttackDamageInfo2,"CritTotal")]
	[h:thisAttackCritDmg2Str = json.get(thisAttackDamageInfo2,"CritString")]
	[h:thisAttackCritDmg2Rules = json.get(thisAttackDamageInfo2,"CritFormula")]
	
	[h:wa.AdvRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Advantage",1,"ForcedAdvantage",1,"d20Rolls",thisAttackd20Rolls,"PreviousDamage",thisAttackAllDamage,"Target",json.get(wa.TargetList,roll.count),"AttackNum",-1,"EffectID",json.get(wa.EffectIDs,roll.count)),ParentToken)]
	[h:wa.DisRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Advantage",-1,"ForcedAdvantage",1,"d20Rolls",thisAttackd20Rolls,"PreviousDamage",thisAttackAllDamage,"Target",json.get(wa.TargetList,roll.count),"AttackNum",-1,"EffectID",json.get(wa.EffectIDs,roll.count)),ParentToken)]
	
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
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",wa.DmgType+" Damage",
		"FalseHeader","",
		"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+if(thisAttackCrit,thisAttackCritDmg,thisAttackDmg)+"</span>",
		"RulesContents",if(thisAttackCrit,thisAttackCritDmgRules,thisAttackDmgRules)+" = ",
		"RollContents",if(thisAttackCrit,thisAttackCritDmgStr,thisAttackDmgStr)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"Value",if(thisAttackCrit,thisAttackCritDmg,thisAttackDmg)
		))]

	[h:abilityTable = if(wa.DmgDie2 == "0",
		abilityTable,
		json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",wa.DmgType2+" Damage",
			"FalseHeader","",
			"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+if(thisAttackCrit,thisAttackCritDmg2,thisAttackDmg2)+"</span>",
			"RulesContents",if(thisAttackCrit,thisAttackCritDmg2Rules,thisAttackDmg2Rules)+" = ",
			"RollContents",if(thisAttackCrit,thisAttackCritDmg2Str,thisAttackDmg2Str)+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"Value",if(thisAttackCrit,thisAttackCritDmg2,thisAttackDmg2)
	)))]
	
	[h:pm.PassiveFunction("AfterEachAttack")]
	[h:pm.PassiveFunction("AfterEachWeaponAttack")]
	[h:pm.PassiveFunction("AfterEachAttackTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("AfterEachWeaponAttackTargeted",json.set("","ParentToken",thisAttackTarget))]

	[h:pm.a5e.EffectData = json.append(pm.a5e.EffectData,json.set("",
		"Attack",json.set("",
			"d20Rolls",thisAttackd20Rolls,
			"FinalRoll",thisAttackFinalRoll,
			"TotalBonus",thisAttackToHit,
			"CritTest",thisAttackCrit,
			"CritFailTest",thisAttackCritFail),
		"Damage",thisAttackAllDamage,
		"Targets",json.append("",thisAttackTarget)
	))]

	[h:WhichAttack = WhichAttack + 1]
}]
[h:pm.PassiveFunction("AfterAttack")]
[h:pm.PassiveFunction("AfterWeaponAttack")]
[h:pm.PassiveFunction("AfterAttackTargeted",json.set("","ParentToken",thisAttackTarget))]
[h:pm.PassiveFunction("AfterWeaponAttackTargeted",json.set("","ParentToken",thisAttackTarget))]

[h:macro.return = json.set("","Table",abilityTable,"Effect",pm.a5e.EffectData)]