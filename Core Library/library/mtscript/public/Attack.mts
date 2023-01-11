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
[h:ThrowingWeapon = json.get(wa.Data,"Throw Weapon")]
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
[h:wa.Magical = json.get(wa.WeaponUsed,"MagicItem")]
[h:attack.ProfTest = if(or(json.get(getProperty("a5e.stat.WeaponProficiencies"),wa.WeaponType)==1,json.get(MagicItemStats,wa.WeaponType+"Prof")==1),1,0)]
[h:attack.ToHitBonus = wa.MagicBonus]
[h:wa.ProfTest = 1]
[h:wa.TargetOrigin = ParentToken]

[h:pm.PassiveFunction("AttackProps")]
[h:pm.PassiveFunction("WeaponAttackProps")]

[h:VersatileTest = if(json.get(wa.Props,"Versatile")>0,if(json.get(getProperty("a5e.stat.Weapon"),OtherHand)==2,if(json.get(getProperty("a5e.stat.Shield"),0)==1,1,0),0),0)]
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
[h:wa.DmgDie2Placehold = if(wa.DmgDie2=="0" || wa.DmgDie2=="","0d1",wa.DmgDie2)]
[h:CritSecDmgDie = (wa.CritMultiplier*number(substring(wa.DmgDie2Placehold,0,indexOf(wa.DmgDie2Placehold,"d"))))]

[h:wa.DmgDieNum = number(substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d")))]
[h,if(wa.DmgDie2==""):
	wa.DmgDie2Num = 0;
	wa.DmgDie2Num = number(substring(wa.DmgDie2,0,1))
]

[h,if(AttackNum<0),CODE:{
	[h:AttackCount = abs(AttackNum)]
};{
	[h:AttackCount = AttackNum]
	[h:pm.PassiveFunction("AttackNum")]
	[h:pm.PassiveFunction("WeaponAttackNum")]
}]

[h:wa.TargetOptions = pm.a5e.TargetCreatureFiltering(json.set("","ParentToken",ParentToken,"Number",1,"Origin",wa.TargetOrigin,"Range",json.set("","Value",if(wa.MeleeRanged=="Ranged",wa.Range,wa.Reach),"Units","Feet")),json.set("","Allegiance",json.set("","NotSelf",1)))]
[h:wa.AllTargets = pm.a5e.TargetCreatureTargeting(wa.TargetOptions,1,AttackCount)]
[h,if(AttackCount==1),CODE:{
	[h:wa.TargetList = wa.AllTargets]
};{
	[h:wa.TargetList = "[]"]
	[h,count(AttackCount): wa.TargetList = json.merge(wa.TargetList,json.get(wa.AllTargets,roll.count))]
}]

[h,if(json.get(wa.Props,"DmgMod")==""):
	preReworkUseDamageMod = 0;
	preReworkUseDamageMod = json.get(wa.Props,"DmgMod")
]
[h:preReworkDamageData = json.append("",json.set("",
	"DamageType",wa.DmgType,
	"DamageDieNumber",wa.DmgDieNum,
	"DamageDieSize",wa.DmgDieSize,
	"DamageFlatBonus",wa.MagicBonus,
	"IsModBonus",preReworkUseDamageMod
))]
[h,if(wa.DmgDie2 != "0"): preReworkDamageData = json.append(preReworkDamageData,json.set("",
	"DamageType",wa.DmgType2,
	"DamageDieNumber",wa.DmgDie2Num,
	"DamageDieSize",wa.DmgDie2Size,
	"DamageFlatBonus",0,
	"IsModBonus",0
))]

[h:AllAttacksToHit = "[]"]
[h:AllAttacksDmg = "[]"]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h,count(AttackCount),code:{
	[h,if(json.length(wa.EffectIDs)-1 < roll.count): wa.EffectIDs = json.append(wa.EffectIDs,pm.a5e.GenerateEffectID())]
	[h:thisAttackTarget = json.get(wa.TargetList,roll.count)]

	[h:AllAttacksToHit = json.append(AllAttacksToHit,pm.a5e.AttackRoll(wa.Data,json.append("","Attack","WeaponAttack"),thisAttackTarget))]

	[h:preReworkNonDamageData = json.set("",
		"IsSpell",0,
		"IsWeapon",1,
		"IsAttack",1,
		"Modifier",1,
		"ScalingBase",0,
		"Target",thisAttackTarget
	)]
	[h:thisAttackDamage = "[]"]
	[h,foreach(tempDamageInstance,preReworkDamageData): thisAttackDamage = json.append(thisAttackDamage,pm.a5e.DamageRoll(tempDamageInstance,preReworkNonDamageData,json.append("","Damage","AttackDamage","WeaponAttackDamage")))]

	[h:pm.PassiveFunction("AttackRoll")]
	[h:pm.PassiveFunction("WeaponAttackRoll")]
	[h:pm.PassiveFunction("AttackRollTargeted",json.set("","ParentToken",thisAttackTarget))]
	[h:pm.PassiveFunction("WeaponAttackRollTargeted",json.set("","ParentToken",thisAttackTarget))]


	[h:AllAttacksDmg = json.append(AllAttacksDmg,thisAttackDamage)]
}]

[h:WhichAttack=0]

[h:"<!-- TODO: Perhaps set up separate loops for attack and damage rolls with different tables, which are assembled separately depending on the condensed vs. expanded approach -->"]
[h:abilityTable = ""]
[h,count(AttackCount),CODE:{
	[h:thisAttackTarget = json.get(wa.TargetList,roll.count)]
	[h:thisAttackData = json.get(AllAttacksToHit,roll.count)]
	[h:thisAttackd20Rolls = json.get(thisAttackData,"d20Rolls")]
	[h:thisAttackFinalRoll = json.get(thisAttackData,"FinalRoll")]
	[h:thisAttackAdvDis = json.get(thisAttackData,"Advantage")]
	[h:thisAttackToHit = json.get(thisAttackData,"ToHit")]
	[h:thisAttackToHitStr = json.get(thisAttackData,"ToHitStr")]
	[h:thisAttackToHitRules = json.get(thisAttackData,"RulesStr")]
	[h:thisAttackCrit = json.get(thisAttackData,"CritTest")]
	[h:thisAttackCritFail = json.get(thisAttackData,"CritFailTest")]

	[h:thisAttackAllDamage = json.path.put(json.get(AllAttacksDmg,roll.count),"[*]","UseCrit",thisAttackCrit)]

	[h:wa.AdvRerollLink = macroLinkText("Modify Attack Border@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Advantage",1,"ForcedAdvantage",1,"d20Rolls",thisAttackd20Rolls,"PreviousDamage",thisAttackAllDamage,"Target",json.get(wa.TargetList,roll.count),"AttackNum",-1,"EffectID",json.get(wa.EffectIDs,roll.count)),ParentToken)]
	[h:wa.DisRerollLink = macroLinkText("Modify Attack Border@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Disadvantage",1,"ForcedAdvantage",1,"d20Rolls",thisAttackd20Rolls,"PreviousDamage",thisAttackAllDamage,"Target",thisAttackTarget,"AttackNum",-1,"EffectID",json.get(wa.EffectIDs,roll.count)),ParentToken)]
	
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
		"Targets",json.append("",thisAttackTarget)
	))]

	[h:AHLTier = 0]
	[h,foreach(tempSubeffect,json.get(wa.WeaponUsed,"Subeffects")): pm.a5e.ExecuteSubeffect(tempSubeffect)]

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