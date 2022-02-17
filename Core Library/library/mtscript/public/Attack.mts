[h:wa.Data = macro.args]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities()]

[h:Flavor=json.get(wa.Data,"Flavor")]
[h:ParentToken=json.get(wa.Data,"ParentToken")]
[h:Hand=json.get(wa.Data,"Hand")]
[h:OtherHand=if(Hand==0,1,0)]
[h:AttackNum=json.get(wa.Data,"AttackNum")]
[h:ThrowingWeapon=json.get(wa.Data,"Throw Weapon")]
[h:DMOnly=json.get(wa.Data,"DMOnly")]
[h:DMOnly=0]
[h:ShowFullRules=1]
[h:wa.WeaponUsed = json.get(wa.Data,"WeaponData")]

[h:BorderColorOverride=json.get(wa.Data,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(wa.Data,"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(wa.Data,"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(wa.Data,"AccentTextOverride")]
[h:TitleFont=json.get(wa.Data,"TitleFont")]
[h:BodyFont=json.get(wa.Data,"BodyFont")]
[h:CritMessage=json.get(wa.Data,"CritMessage")]
[h:CritFailMessage=json.get(wa.Data,"CritFailMessage")]

[h:wa.Name=json.get(wa.WeaponUsed,"Name")]
[h:wa.MagicBonus=json.get(wa.WeaponUsed,"MagicBonus")]
[h:wa.WeaponType=json.get(wa.WeaponUsed,"Type")]
[h:wa.DmgDie=json.get(wa.WeaponUsed,"DamageDie")]
[h:wa.DmgType=json.get(wa.WeaponUsed,"DamageType")]
[h:wa.DmgDie2=json.get(wa.WeaponUsed,"SecDamageDie")]
[h:wa.DmgType2=json.get(wa.WeaponUsed,"SecDamageType")]
[h:wa.MeleeRanged=json.get(wa.WeaponUsed,"MeleeRanged")]
[h:wa.Class=json.get(wa.WeaponUsed,"Class")]
[h:wa.Range=json.get(wa.WeaponUsed,"Range")]
[h:wa.CritRange=json.get(wa.WeaponUsed,"CritRange")]
[h:wa.CritMultiplier=json.get(wa.WeaponUsed,"CritMultiplier")]
[h:wa.SpecialAbility=json.get(wa.WeaponUsed,"SpecialAbility")]
[h:wa.Props=json.get(wa.WeaponUsed,"Props")]
[h:wa.Magical=json.get(wa.WeaponUsed,"MagicItem")]
[h:wa.ProfTest=if(or(json.get(WeaponProficiencies,wa.WeaponType)==1,json.get(MagicItemStats,wa.WeaponType+"Prof")==1),1,0)]
[h:wa.ProfTest=1]

[h:pm.PassiveFunction("AttackProps")]

[h:VersatileTest=if(json.get(wa.Props,"Versatile")>0,if(json.get(Weapon,OtherHand)==2,if(json.get(Shield,0)==1,1,0),0),0)]

[h,if(VersatileTest==1),code:{
	[wa.DmgDie=substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d")+1)+(number(substring(wa.DmgDie,indexOf(wa.DmgDie,"d")+1))+2)]
};{}]

[h:PrimeStat=if(and(json.get(wa.Props,"Finesse")>0,json.get(AtrMods,"Dexterity")>json.get(AtrMods,"Strength")),"Dexterity","Strength")]
[h:PrimeStat=if(wa.MeleeRanged=="Ranged","Dexterity",PrimeStat)]
[h:PrimeStat=if(json.get(wa.Props,"IntMod")>0,"Intelligence",PrimeStat)]
[h:PrimeStat=if(json.get(wa.Props,"WisMod")>0,"Wisdom",PrimeStat)]
[h:PrimeStat=if(json.get(wa.Props,"ChaMod")>0,"Charisma",PrimeStat)]

[h:pm.PassiveFunction("AttackStat")]

[h:wa.PrimeStatBonus = json.get(AtrMods,PrimeStat)]

[h:wa.DmgDie=if(and(ThrowingWeapon,json.get(wa.Props,"Thrown")==0),"1d4",wa.DmgDie)]
[h:wa.Class=if(and(ThrowingWeapon,json.get(wa.Props,"Thrown")==0),"Improvised",wa.Class)]

[h:wa.DmgDieSize=number(substring(wa.DmgDie,indexOf(wa.DmgDie,"d")+1))]
[h:wa.DmgDie2Size=number(substring(wa.DmgDie2,indexOf(wa.DmgDie2,"d")+1))]

[h:pm.PassiveFunction("AttackCritThresh")]

[h:wa.FinalCritRange = 20 - wa.CritRange]
[h:wa.FinalCritMultiplier=CritMultiplier+wa.CritMultiplier]
[h:CritDmgDie=(wa.FinalCritMultiplier*number(substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d"))))+substring(wa.DmgDie,indexOf(wa.DmgDie,"d"))]
[h:wa.DmgDie2Placehold = if(wa.DmgDie2=="0","0d1",wa.DmgDie2)]
[h:CritSecDmgDie=(wa.FinalCritMultiplier*number(substring(wa.DmgDie2Placehold,0,indexOf(wa.DmgDie2Placehold,"d"))))+substring(wa.DmgDie2Placehold,indexOf(wa.DmgDie2Placehold,"d"))]

[h:wa.DmgDieNum = number(substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d"))))]
[h:wa.DmgDie2Num = number(substring(wa.DmgDie2,0,1))]

[h,if(AttackNum<0),CODE:{
	[h:AttackCount = abs(AttackNum)]
};{
	[h:AttackCount = AttackNum]
	[h:pm.PassiveFunction("AttackNum")]
}]

[h:CritTest=0]
[h:AllAttacksToHit="[]"]
[h:AllAttacksDmg="[]"]
[h:AllAttacksDmg2="[]"]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h,count(AttackCount),code:{
	[h:roll1=if(json.get(wa.Data,"PreviousRoll")=="",1d20,json.get(wa.Data,"PreviousRoll"))]
	[h:roll2=1d20]
		
	[h,SWITCH(json.get(wa.Data,"Advantage")+""+json.get(wa.Data,"ForcedAdvantage")),CODE:
		case "-11": {
			[h:wa.AdvDis = -1]
			};
		case "-10": {
			[h:wa.Adv = 0]
			[h:wa.Dis = 1]
			[h:pm.PassiveFunction("AttackAdv")]
			[h:wa.AdvDis = if(or(and(wa.Dis == 0,wa.Adv == 0),and(wa.Dis !=0,wa.Adv != 0)),0,if(wa.Dis == 0,1,-1))]
			};
		case "01": {
			[h:wa.AdvDis = 0]
			};
		case "00": {
			[h:wa.Adv = 0]
			[h:wa.Dis = 0]
			[h:pm.PassiveFunction("AttackAdv")]
			[h:wa.AdvDis = if(or(and(wa.Dis == 0,wa.Adv == 0),and(wa.Dis !=0,wa.Adv != 0)),0,if(wa.Dis == 0,1,-1))]
			};
		case "11": {
			[h:wa.AdvDis = 1]
			};
		case "10": {
			[h:wa.Adv = 1]
			[h:wa.Dis = 0]
			[h:pm.PassiveFunction("AttackAdv")]
			[h:wa.AdvDis = if(or(and(wa.Dis == 0,wa.Adv == 0),and(wa.Dis !=0,wa.Adv != 0)),0,if(wa.Dis == 0,1,-1))]
			};
		default: {
			[h:wa.Adv = 0]
			[h:wa.Dis = 0]
			[h:pm.PassiveFunction("AttackAdv")]
			[h:wa.AdvDis = if(or(and(wa.Dis == 0,wa.Adv == 0),and(wa.Dis !=0,wa.Adv != 0)),0,if(wa.Dis == 0,1,-1))]
		}
	]

	[h,switch(wa.AdvDis),CODE:
		case -1:{
			[h:effectiveRoll = min(roll1,roll2)]
			[h:wa.ToHitRulesStr = "1d20 <span style='color:"+DamageColor+"'>with Dis</span>"]
		};
		case 0:{
			[h:effectiveRoll = roll1]
			[h:wa.ToHitRulesStr = "1d20"]
		};
		case 1:{
			[h:effectiveRoll = max(roll1,roll2)]
			[h:wa.ToHitRulesStr = "1d20 <span style='color:"+HealingColor+"'>with Adv</span>"]
		}
	]
	
	[h:CritTest=if(effectiveRoll>=wa.FinalCritRange,CritTest+1,CritTest)]
	[h:CritTestEach=if(effectiveRoll>=wa.FinalCritRange,1,0)]
	[h:CritFailTest=if(effectiveRoll==1,1,0)]
	
	[h:wa.ToHit = effectiveRoll+wa.PrimeStatBonus+if(wa.ProfTest,Proficiency,0)+wa.MagicBonus]
	[h:wa.ToHitStr = effectiveRoll+" + "+wa.PrimeStatBonus+if(wa.ProfTest," + "+Proficiency,"")+pm.PlusMinus(wa.MagicBonus,0)]
	[h:wa.ToHitRulesStr = wa.ToHitRulesStr+" + "+substring(PrimeStat,0,3)+if(wa.ProfTest," + Prof","")+if(wa.MagicBonus==0,""," + Magic")]
	
	[h:pm.PassiveFunction("AttackBonus")]
	
	[h:AllAttacksToHit=json.append(AllAttacksToHit,json.set("","Roll1",roll1,"Roll2",roll2,"ToHit",wa.ToHit,"ToHitStr",wa.ToHitStr,"RulesStr",wa.ToHitRulesStr,"CritTest",CritTestEach,"CritFailTest",CritFailTest))]

	[h:getNewRolls()]
	[h:wa.Dmg = eval(wa.DmgDieNum+"d"+wa.DmgDieSize)]
	[h:wa.DmgRulesStr = wa.DmgDieNum+"d"+wa.DmgDieSize]
	[h:wa.DmgArray = getNewRolls()]
	
	[h:wa.CritDmg = eval(wa.DmgDieNum+"d"+wa.DmgDieSize)]
	[h:wa.CritDmgRulesStr = wa.DmgDieNum+"d"+wa.DmgDieSize]
	[h:wa.CritDmgArray = getNewRolls()]

	[h:wa.Dmg2 = eval(wa.DmgDie2Num+"d"+wa.DmgDie2Size)]
	[h:wa.Dmg2RulesStr = wa.DmgDie2Num+"d"+wa.DmgDie2Size]
	[h:wa.Dmg2Array = getNewRolls()]
	
	[h:wa.CritDmg2 = eval(wa.DmgDie2Num+"d"+wa.DmgDie2Size)]
	[h:wa.CritDmg2RulesStr = wa.DmgDie2Num+"d"+wa.DmgDie2Size]
	[h:wa.CritDmg2Array = getNewRolls()]
	
	[h:pm.PassiveFunction("AttackDamage")]
	
	[h:wa.Dmg = wa.Dmg + wa.PrimeStatBonus + wa.MagicBonus]
	[h:wa.CritDmg = wa.Dmg + wa.CritDmg]
	[h:wa.DmgRulesStr = wa.DmgRulesStr+" + "+substring(PrimeStat,0,3)+pm.PlusMinus(wa.MagicBonus,0)]
	[h:wa.CritDmgRulesStr = wa.CritDmgRulesStr+" + "+wa.DmgRulesStr]
	[h:wa.DmgString = json.toList(wa.DmgArray," + ")+pm.PlusMinus(wa.PrimeStatBonus,0)+pm.PlusMinus(wa.MagicBonus,0)]
	[h:wa.CritDmgString = json.toList(wa.CritDmgArray," + ")+wa.DmgString]
	[h:AllAttacksDmg=json.append(AllAttacksDmg,json.set("","Dmg",wa.Dmg,"DmgStr",wa.DmgString,"DmgCrit",wa.CritDmg,"DmgCritStr",wa.CritDmgString,"DmgRules",wa.DmgRulesStr,"CritDmgRules",wa.CritDmgRulesStr))]
	
	[h:wa.Dmg2 = wa.Dmg2]
	[h:wa.CritDmg2 = wa.Dmg2 + wa.CritDmg2]
	[h:wa.Dmg2RulesStr = wa.Dmg2RulesStr]
	[h:wa.CritDmg2RulesStr = wa.CritDmg2RulesStr+" + "+wa.Dmg2RulesStr]
	[h:wa.Dmg2String = json.toList(wa.Dmg2Array," + ")]
	[h:wa.CritDmg2String = json.toList(wa.CritDmg2Array," + ")+" + "+wa.Dmg2String]
	[h:AllAttacksDmg2=json.append(AllAttacksDmg2,json.set("","Dmg",wa.Dmg2,"DmgStr",wa.Dmg2String,"DmgCrit",wa.CritDmg2,"DmgCritStr",wa.CritDmg2String,"DmgRules",wa.Dmg2RulesStr,"CritDmgRules",wa.CritDmg2RulesStr))]
}]
[h:pm.PassiveFunction("AttackRoll")]

[h:WhichAttack=0]

[h:"<!-- Perhaps set up separate loops for attack and damage rolls with different tables, which are assembled separately depending on the condensed vs. expanded approach -->"]
[h:abilityTable = ""]
[h,count(AttackCount,""),code:{
	[h:roll1 = json.get(json.get(AllAttacksToHit,roll.count),"Roll1")]
	[h:roll2 = json.get(json.get(AllAttacksToHit,roll.count),"Roll2")]
	[h:thisAttackToHit = json.get(json.get(AllAttacksToHit,roll.count),"ToHit")]
	[h:thisAttackToHitStr = json.get(json.get(AllAttacksToHit,roll.count),"ToHitStr")]
	[h:thisAttackToHitRules = json.get(json.get(AllAttacksToHit,roll.count),"RulesStr")]
	[h:thisAttackCrit = json.get(json.get(AllAttacksToHit,roll.count),"CritTest")]
	[h:thisAttackCritFail = json.get(json.get(AllAttacksToHit,roll.count),"CritFailTest")]
	
	[h:thisAttackDmg = json.get(json.get(AllAttacksDmg,roll.count),"Dmg")]
	[h:thisAttackDmgStr = json.get(json.get(AllAttacksDmg,roll.count),"DmgStr")]
	[h:thisAttackDmgRules = json.get(json.get(AllAttacksDmg,roll.count),"DmgRules")]
	[h:thisAttackCritDmg = json.get(json.get(AllAttacksDmg,roll.count),"DmgCrit")]
	[h:thisAttackCritDmgStr = json.get(json.get(AllAttacksDmg,roll.count),"DmgCritStr")]
	[h:thisAttackCritDmgRules = json.get(json.get(AllAttacksDmg,roll.count),"CritDmgRules")]
	
	[h:thisAttackDmg2 = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2")]
	[h:thisAttackDmg2Str = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2Str")]
	[h:thisAttackDmg2Rules = json.get(json.get(AllAttacksDmg,roll.count),"Dmg2Rules")]
	[h:thisAttackCritDmg2 = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2Crit")]
	[h:thisAttackCritDmg2Str = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2CritStr")]
	[h:thisAttackCritDmg2Rules = json.get(json.get(AllAttacksDmg,roll.count),"CritDmg2Rules")]

	[h:wa.AdvRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Advantage",1,"ForcedAdvantage",1,"PreviousRoll",roll1,"AttackNum",-1),ParentToken)]
	[h:wa.DisRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",json.set(wa.Data,"Advantage",-1,"ForcedAdvantage",1,"PreviousRoll",roll1,"AttackNum",-1),ParentToken)]
	
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
		"BonusSectionStyling1","text-align:center",
		"Value",thisAttackToHit
	)]
	
	[h,if(wa.AdvDis == 0),CODE:{
		[h:ToHitTableLine = json.set(ToHitTableLine,
			"BonusBody1","Reroll: <a href = '"+wa.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+wa.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>"
		)]
	};{
		[h:ToHitTableLine = json.set(ToHitTableLine,
			"BonusBody1","(Roll #1: "+(roll1+thisAttackToHit-if(wa.AdvDis==1,max(roll1,roll2),min(roll1,roll2)))+" / Roll #2: "+(roll2+thisAttackToHit-if(wa.AdvDis==1,max(roll1,roll2),min(roll1,roll2)))+")"
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

	[h:WhichAttack=WhichAttack+1]
}]

[h:if(wa.Range==0,"","<tr><th style=''><b>Range</b>"+" "+wa.Range+"</td></tr>")]
[h:if(wa.SpecialAbility=="","","<tr><th style=''><b>Special Ability</b>"+""+wa.SpecialAbility+"</td></tr>")]

[h:pm.PassiveFunction("AfterAttack")]

[h:pm.RemovedConditions = "[]"]
[h,foreach(group,json.path.read(ConditionGroups,"[*][?(@.AfterAttack != null)]","DEFAULT_PATH_LEAF_TO_NULL")),CODE:{
	[h,macro("EndCondition@Lib:pm.a5e.Core"): json.get(group,"GroupID")]
	[h:pm.RemovedConditions = json.merge(pm.RemovedConditions,macro.return)]
}]

[h,if(!json.isEmpty(pm.RemovedConditions)): 
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Conditions Removed",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",json.toList(json.path.read(pm.RemovedConditions,"[*]['DisplayName']"),", "),
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']")
	)
]

[h:macro.return = abilityTable]