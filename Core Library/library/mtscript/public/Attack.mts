[h:wa.Data = macro.args]
[h:Flavor=json.get(wa.Data,"Flavor")]
[h:ParentToken=json.get(wa.Data,"ParentToken")]
[h:Hand=json.get(wa.Data,"Hand")]
[h:OtherHand=if(Hand==0,1,0)]
[h:SingleAttack=json.get(wa.Data,"Single Attack")]
[h:ThrowingWeapon=json.get(wa.Data,"Throwing Weapon")]
[h:BorderColorOverride=json.get(wa.Data,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(wa.Data,"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(wa.Data,"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(wa.Data,"AccentTextOverride")]
[h:TitleFont=json.get(wa.Data,"TitleFont")]
[h:BodyFont=json.get(wa.Data,"BodyFont")]
[h:CritMessage=json.get(wa.Data,"CritMessage")]
[h:CritFailMessage=json.get(wa.Data,"CritFailMessage")]
[h:DMOnly=json.get(wa.Data,"DMOnly")]
[h:DMOnly=0]
[h:ShowFullRules=1]

[h:wa.WeaponUsed = json.get(Weapon,json.get(Weapon,Hand))]

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

[h:VersatileTest=if(json.get(wa.Props,"Versatile")>0,if(json.get(Weapon,OtherHand)==2,if(json.get(Shield,0)==1,1,0),0),0)]

[h,if(VersatileTest==1),code:{
	[wa.DmgDie=substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d")+1)+(number(substring(wa.DmgDie,indexOf(wa.DmgDie,"d")+1))+2)]
};{}]

[h:PrimeStat=if(and(json.get(wa.Props,"Finesse")>0,json.get(AtrMods,"Dexterity")>json.get(AtrMods,"Strength")),"Dexterity","Strength")]
[h:PrimeStat=if(wa.MeleeRanged=="Ranged","Dexterity",PrimeStat)]
[h:PrimeStat=if(json.get(wa.Props,"IntMod")>0,"Intelligence",PrimeStat)]
[h:PrimeStat=if(json.get(wa.Props,"WisMod")>0,"Wisdom",PrimeStat)]
[h:PrimeStat=if(json.get(wa.Props,"ChaMod")>0,"Charisma",PrimeStat)]

[h:wa.PrimeStatBonus = json.get(AtrMods,PrimeStat)]

[h:wa.DmgDie=if(and(ThrowingWeapon,json.get(wa.Props,"Thrown")==0),"1d4",wa.DmgDie)]
[h:wa.Class=if(and(ThrowingWeapon,json.get(wa.Props,"Thrown")==0),"Improvised",wa.Class)]

[h:wa.DmgDieSize=number(substring(wa.DmgDie,indexOf(wa.DmgDie,"d")+1))]
[h:wa.DmgDie2Size=number(substring(wa.DmgDie2,indexOf(wa.DmgDie2,"d")+1))]

[h:wa.FinalCritRange = 20 - wa.CritRange]
[h:wa.FinalCritMultiplier=CritMultiplier+wa.CritMultiplier]
[h:CritDmgDie=(wa.FinalCritMultiplier*number(substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d"))))+substring(wa.DmgDie,indexOf(wa.DmgDie,"d"))]
[h:wa.DmgDie2Placehold = if(wa.DmgDie2=="0","0d1",wa.DmgDie2)]
[h:CritSecDmgDie=(wa.FinalCritMultiplier*number(substring(wa.DmgDie2Placehold,0,indexOf(wa.DmgDie2Placehold,"d"))))+substring(wa.DmgDie2Placehold,indexOf(wa.DmgDie2Placehold,"d"))]

[h:wa.DmgDieNum = number(substring(wa.DmgDie,0,indexOf(wa.DmgDie,"d"))))]
[h:wa.DmgDie2Num = number(substring(wa.DmgDie2,0,1))]

[h:AttackCount=1]
[h:AttackCount=if(SingleAttack,1,AttackCount)]

[h:CritTest=0]
[h:AllAttacksToHit="[]"]
[h:AllAttacksDmg="[]"]
[h:AllAttacksDmg2="[]"]

[h,count(AttackCount),code:{
	[h:roll1=1d20]
	[h:roll2=1d20]
	[h:CritTest=if(Max(roll1,roll2)>=wa.FinalCritRange,CritTest+1,CritTest)]
	[h:CritTestEach=if(Max(roll1,roll2)>=wa.FinalCritRange,1,0)]
	[h:AllAttacksToHit=json.append(AllAttacksToHit,json.set("","Roll1",roll1,"Roll2",roll2,"CritTest",CritTestEach))]

	[h:getNewRolls()]
	[h:wa.Dmg = eval(wa.DmgDieNum+"d"+wa.DmgDieSize)]
	[h:wa.DmgArray = getNewRolls()]
	[h:wa.DmgString = json.toList(wa.DmgArray," + ")]
	
	[h:wa.CritDmg = eval(wa.DmgDieNum+"d"+wa.DmgDieSize)]
	[h:wa.CritDmgArray = getNewRolls()]
	[h:wa.CritDmgString = json.toList(wa.CritDmgArray," + ")]

	[h:AllAttacksDmg=json.append(AllAttacksDmg,json.set("","Dmg",wa.Dmg,"DmgStr",wa.DmgString,"DmgCrit",wa.CritDmg,"DmgCritStr",wa.CritDmgString))]

	[h:wa.Dmg2 = eval(wa.DmgDie2Num+"d"+wa.DmgDie2Size)]
	[h:wa.Dmg2Array = getNewRolls()]
	[h:wa.Dmg2String = json.toList(wa.Dmg2Array," + ")]
	
	[h:wa.CritDmg2 = eval(wa.DmgDie2Num+"d"+wa.DmgDie2Size)]
	[h:wa.CritDmg2Array = getNewRolls()]
	[h:wa.CritDmg2String = json.toList(wa.CritDmg2Array," + ")]
	
	[h:AllAttacksDmg2=json.append(AllAttacksDmg2,json.set("","Dmg",wa.Dmg2,"DmgStr",wa.Dmg2String,"DmgCrit",wa.CritDmg2,"DmgCritStr",wa.CritDmg2String))]
}]
[h:WhichAttack=0]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(wa.Data,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(wa.Data,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(wa.Data,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(wa.Data,"AccentTextOverride"),
	"TitleFont",json.get(wa.Data,"TitleFont"),
	"BodyFont",json.get(wa.Data,"BodyFont"),
	"Class","zzWeaponAttack",
	"Name",wa.Name+" Attack",
	"FalseName","Weapon Attack",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:abilityTable = ""]
[h,count(AttackCount,""),code:{
	[h:roll1 = json.get(json.get(AllAttacksToHit,roll.count),"Roll1")]
	[h:roll2 = json.get(json.get(AllAttacksToHit,roll.count),"Roll2")]
	[h:thisAttackCrit=If(roll1>=wa.FinalCritRange,1,0)]
	[h:thisAttackDmg = json.get(json.get(AllAttacksDmg,roll.count),"Dmg")]
	[h:thisAttackDmgStr = json.get(json.get(AllAttacksDmg,roll.count),"DmgStr")]
	[h:thisAttackCritDmg = json.get(json.get(AllAttacksDmg,roll.count),"DmgCrit")]
	[h:thisAttackCritDmgStr = json.get(json.get(AllAttacksDmg,roll.count),"DmgCritStr")]
	[h:thisAttackDmg2 = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2")]
	[h:thisAttackDmg2Str = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2Str")]
	[h:thisAttackCritDmg2 = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2Crit")]
	[h:thisAttackCritDmg2Str = json.get(json.get(AllAttacksDmg2,roll.count),"Dmg2CritStr")]

	[h:wa.RerollLink = macroLinkText("Attack@Lib:pm.a5e.Core","all",wa.Data,ParentToken)]
			
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Attack Roll",
		"FalseHeader","",
		"FullContents","<span style='"+if(roll1>=wa.FinalCritRange,"font-size:2em; color:"+CritColor,if(roll1==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(roll1+wa.PrimeStatBonus+if(wa.ProfTest,Proficiency,0))+"</span>",
		"RulesContents","1d20 + "+substring(PrimeStat,0,3)+if(wa.ProfTest," + "+Proficiency,"")+pm.PlusMinus(wa.MagicBonus,0)+" = ",
		"RollContents",roll1+pm.PlusMinus(wa.PrimeStatBonus,0)+if(wa.ProfTest,pm.PlusMinus(Proficiency,0),"")+pm.PlusMinus(wa.MagicBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1","Reroll: <a href = '"+wa.RerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+wa.RerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>",
		"BonusSectionStyling1","text-align:right",
		"Value",(roll1+wa.PrimeStatBonus+if(wa.ProfTest,Proficiency,0)+wa.MagicBonus)
		))]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",wa.DmgType+" Damage",
		"FalseHeader","",
		"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+(if(thisAttackCrit,(thisAttackDmg+wa.CritDmg),thisAttackDmg)+wa.PrimeStatBonus+wa.MagicBonus)+"</span>",
		"RulesContents",wa.DmgDieNum+"d"+wa.DmgDieSize+if(thisAttackCrit," + "+wa.DmgDieNum+"d"+wa.DmgDieSize,"")+" + "+substring(PrimeStat,0,3)+pm.PlusMinus(wa.MagicBonus,0)+" = ",
		"RollContents",thisAttackDmgStr+if(thisAttackCrit," + "+thisAttackCritDmgStr,"")+pm.PlusMinus(wa.PrimeStatBonus,0)+pm.PlusMinus(wa.MagicBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"Value",(if(thisAttackCrit,(thisAttackDmg+thisAttackCritDmg),thisAttackDmg)+wa.PrimeStatBonus+wa.MagicBonus)
		))]

	[h:abilityTable = if(wa.DmgDie2 == "0",
		abilityTable,
		json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",wa.DmgType2+" Damage",
			"FalseHeader","",
			"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:"+CritColor,"font-size:1.5em")+"'>"+if(thisAttackCrit,(thisAttackDmg2+thisAttackCritDmg2),thisAttackDmg2)+"</span>",
			"RulesContents",wa.DmgDie2Num+"d"+wa.DmgDie2Size+if(thisAttackCrit," + "+wa.DmgDie2Num+"d"+wa.DmgDie2Size,"")+" = ",
			"RollContents",thisAttackDmg2Str+if(thisAttackCrit," + "+thisAttackCritDmg2Str,"")+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"Value",if(thisAttackCrit,(thisAttackDmg2+thisAttackCritDmg2),thisAttackDmg2)
	)))]
	
	[h,foreach(ability,json.path.read(allAbilities,"[?(@.IsActive>0 && @.CallAfterEachAttack==1)]")): "[h:pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"('AfterEachAttack')]"]

	[h:WhichAttack=WhichAttack+1]
}]

[h:if(wa.Range==0,"","<tr><th style=''><b>Range</b>"+" "+wa.Range+"</td></tr>")]
[h:if(wa.SpecialAbility=="","","<tr><th style=''><b>Special Ability</b>"+""+wa.SpecialAbility+"</td></tr>")]

[h:pm.PassiveFunction("AfterAttack")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]