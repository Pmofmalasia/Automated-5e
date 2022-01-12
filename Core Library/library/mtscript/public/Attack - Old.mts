[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:Hand=json.get(macro.args,"Hand")]
[h:OtherHand=if(Hand==0,1,0)]
[h:SingleAttack=json.get(macro.args,"Single Attack")]
[h:ThrowingWeapon=json.get(macro.args,"Throwing Weapon")]
[h:BorderColorOverride=json.get(macro.args,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(macro.args,"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(macro.args,"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(macro.args,"AccentTextOverride")]
[h:TitleFont=json.get(macro.args,"TitleFont")]
[h:BodyFont=json.get(macro.args,"BodyFont")]
[h:CritMessage=json.get(macro.args,"CritMessage")]
[h:CritFailMessage=json.get(macro.args,"CritFailMessage")]
[h:DMOnly=json.get(macro.args,"DMOnly")]
[h:DMOnly=0]
[h:ShowFullRules=1]

[h:wName=json.get(json.get(Weapon,json.get(Weapon,Hand)),"Name")]
[h:wMagicBonus=json.get(json.get(Weapon,json.get(Weapon,Hand)),"MagicBonus")]
[h:wType=json.get(json.get(Weapon,json.get(Weapon,Hand)),"Type")]
[h:wDamageDie=json.get(json.get(Weapon,json.get(Weapon,Hand)),"DamageDie")]
[h:wDamageType=json.get(json.get(Weapon,json.get(Weapon,Hand)),"DamageType")]
[h:wSecDamageDie=json.get(json.get(Weapon,json.get(Weapon,Hand)),"SecDamageDie")]
[h:wSecDamageType=json.get(json.get(Weapon,json.get(Weapon,Hand)),"SecDamageType")]
[h:wMeleeRanged=json.get(json.get(Weapon,json.get(Weapon,Hand)),"MeleeRanged")]
[h:wClass=json.get(json.get(Weapon,json.get(Weapon,Hand)),"Class")]
[h:wRange=json.get(json.get(Weapon,json.get(Weapon,Hand)),"Range")]
[h:wCritRange=json.get(json.get(Weapon,json.get(Weapon,Hand)),"CritRange")]
[h:wCritMultiplier=json.get(json.get(Weapon,json.get(Weapon,Hand)),"CritMultiplier")]
[h:wSpecialAbility=json.get(json.get(Weapon,json.get(Weapon,Hand)),"SpecialAbility")]
[h:wProps=json.get(json.get(Weapon,json.get(Weapon,Hand)),"Props")]
[h:wMagical=json.get(json.get(Weapon,json.get(Weapon,Hand)),"MagicItem")]
[h:ProfTest=if(or(json.get(WeaponProficiencies,wType)==1,json.get(MagicItemStats,wType+"Prof")==1),1,0)]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",DMOnly,
	"BorderColorOverride",if(BorderColorOverride=="","#000000",BorderColorOverride),
	"TitleFontColorOverride",if(TitleFontColorOverride=="","#FFFFFF",TitleFontColorOverride),
	"AccentBackgroundOverride",AccentBackgroundOverride,
	"AccentTextOverride",AccentTextOverride,
	"TitleFont",TitleFont,
	"BodyFont",BodyFont,
	"Class","",
	"Name",wName+" Attack",
	"FalseName","Weapon Attack",
	"OnlyRules",0
	)]

[h:AttackData = pm.MacroFormat(ClassFeatureData)]

[h:AccentFormat = json.get(AttackData,"AccentFormat")]
[h:VerticalFormat = json.get(AttackData,"VerticalFormat")]
[h:VerticalFormatLinks = json.get(AttackData,"VerticalFormatLinks")]
[h:TableFormat = json.get(AttackData,"TableFormat")]
[h:outputTest.NoFullMacro = json.get(AttackData,"NoFullMacro")]
[h:outputTest.NoRolls = json.get(AttackData,"NoRolls")]
[h:outputTest.NoRules = json.get(AttackData,"NoRules")]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]
[h:CritColor=pm.CritColor()]
[h:CritFailColor=pm.CritFailColor()]
[h:LinkColor=pm.LinkColor()]

<!--Need to add Custom to the magic item list to prevent weapon type check from messing up -->

[h:iMagicAtkBonus=0]
[h:iMagicAddedAtk=0]
[h:iMagicAddedAtkStacking=0]
[h:iMagicAtkBonusStr=""]
[h:iMagicAllDmgBonusArray="[]"]
[h:iMagicAdv=""]
[h:iMagicDis=""]
[h:iMagicCritBonus=0]
[h:iMagicCritBonusDice=0]
[h:iMagicCritBonusStacking=0]
[h:iMagicCritMessage=""]
[h:iMagicMessage=""]

[h,count(json.length(MagicItemNames)),CODE:{
	<!--Used to skip checking through the list if it doesnt have any effect, to speed up calculations -->
	[h:MagicItemBypassTest=json.equals(json.get(MagicItemWeapons,roll.count),json.get(MagicItemWeapons,0))]
		[h,if(MagicItemBypassTest),CODE:{};{
		[h:GivesBonusTest=if(and(or(json.path.read(MagicItemActivation,"["+roll.count+"].reqActive")==0,json.path.read(MagicItemActivation,"["+roll.count+"].isActive")==1),or(json.path.read(MagicItemAttuned,"["+roll.count+"].reqAttunement")==0,and(json.path.read(MagicItemAttuned,"["+roll.count+"].reqAttunement")==1,json.path.read(MagicItemAttuned,"["+roll.count+"].slotAttunement")>=1)),or(json.path.read(MagicItemEquipment,"["+roll.count+"].reqEquip")==0,json.path.read(MagicItemEquipment,"["+roll.count+"].isEquipped")==1),or(json.path.read(MagicItemWeapons,"["+roll.count+"].allWeapon")==1,json.path.read(MagicItemWeapons,"["+roll.count+"]."+wType)==1,json.path.read(MagicItemWeapons,"["+roll.count+"]."+wDamageType+"Weapon")==1,json.path.read(MagicItemWeapons,"["+roll.count+"]."+wSecDamageType+"Weapon")==1)),1,0)]
		[h:iMagicAtkBonus=if(GivesBonusTest,json.get(json.get(MagicItemWeapons,roll.count),"WeaponAtkBonus")+iMagicAtkBonus,iMagicAtkBonus)]
		[h:iMagicAtkBonusStr=if(and(GivesBonusTest,json.get(json.get(MagicItemWeapons,roll.count),"WeaponAtkBonus")!=0),listAppend(iMagicAtkBonusStr,json.get(json.get(MagicItemWeapons,roll.count),"WeaponAtkBonus")," +"),iMagicAtkBonusStr)]
		[h:iMagicAllDmgBonusArray=if(and(GivesBonusTest,or(json.get(json.get(MagicItemWeapons,roll.count),"WeaponDamageBonus")!=0,json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponDamageRollNum")>0)),json.append(iMagicAllDmgBonusArray,json.set("","Name",json.get(MagicItemNames,roll.count),"Type",json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponDamageBonusType"),"Bonus",json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponDamageBonus"),"DieNum",json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponDamageRollNum"),"DieSize",json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponDamageRollSize"))),iMagicAllDmgBonusArray)]
		[h:iMagicAdv=if(and(GivesBonusTest,json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponAtkAdv")==1),listAppend(iMagicAdv,json.get(MagicItemNames,roll.count)),iMagicAdv)]
		[h:iMagicDis=if(and(GivesBonusTest,json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponAtkDis")==1),listAppend(iMagicDis,json.get(MagicItemNames,roll.count)),iMagicDis)]
		[h:iMagicCritMessage=if(or(GivesBonusTest==0,json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponCritEffect")=="0"),iMagicCritMessage,listAppend(iMagicCritMessage,"<tr><th style='"+AccentFormat+"'><b>"+json.get(MagicItemNames,roll.count)+"</b>"+VerticalFormat+" "+json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponCritEffect")+"</td></tr>","#"))]
		[h:iMagicMessage=if(or(GivesBonusTest==0,json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponMessage")=="0"),iMagicCritMessage,listAppend(iMagicMessage,"<tr><th style='"+AccentFormat+"'><b>"+json.get(MagicItemNames,roll.count)+"</b>"+VerticalFormat+" "+json.path.read(MagicItemWeapons,"["+roll.count+"].WeaponMessage")+"</td></tr>","##"))]
		[h:iMagicAddedAtk=if(GivesBonusTest,max(json.get(json.get(MagicItemWeapons,roll.count),"WeaponAdditionalAttacks"),iMagicAddedAtk),iMagicAddedAtk)]
		[h:iMagicAddedAtkStacking=if(GivesBonusTest,json.get(json.get(MagicItemWeapons,roll.count),"WeaponAdditionalAttacksStacking")+iMagicAddedAtkStacking,iMagicAddedAtkStacking)]
		[h:iMagicCritBonus=if(GivesBonusTest,max(json.get(json.get(MagicItemWeapons,roll.count),"WeaponCritBonus"),iMagicCritBonus),iMagicCritBonus)]
		[h:iMagicCritBonusStacking=if(GivesBonusTest,json.get(json.get(MagicItemWeapons,roll.count),"WeaponCritBonusStacking")+iMagicCritBonusStacking,iMagicCritBonusStacking)]
		[h:iMagicCritBonusDice=if(GivesBonusTest,json.get(json.get(MagicItemWeapons,roll.count),"WeaponCritBonusDice")+iMagicCritBonusDice,iMagicCritBonusDice)]
	}]
}]

[h:VersatileTest=if(json.get(wProps,"Versatile")>0,if(json.get(Weapon,OtherHand)==2,if(json.get(Shield,0)==1,1,0),0),0)]

[h,if(VersatileTest==1),code:{
	[wDamageDie=substring(wDamageDie,0,indexOf(wDamageDie,"d")+1)+(number(substring(wDamageDie,indexOf(wDamageDie,"d")+1))+2)]
};{}]

[h:PrimeStat=if(json.get(wProps,"Finesse")>0,max(json.get(AtrMods, "Dexterity"),json.get(AtrMods, "Strength")),json.get(AtrMods, "Strength"))]
[h:PrimeStat=if(wMeleeRanged=="Ranged",json.get(AtrMods, "Dexterity"),PrimeStat)]
[h:PrimeStat=if(or(json.get(wProps,"IntMod")>0,and(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0)]['Name']"),"Battle Ready")==1,wMagical==1)),json.get(AtrMods, "Intelligence"),PrimeStat)]
[h:PrimeStat=if(json.get(wProps,"WisMod")>0,json.get(AtrMods, "Wisdom"),PrimeStat)]
[h:PrimeStat=if(json.get(wProps,"ChaMod")>0,json.get(AtrMods, "Charisma"),PrimeStat)]

[h:wDamageDie=if(json.get(Feats,"TavernBrawler")==1,if(wType=="Unarmed","1d4",wDamageDie),wDamageDie)]
[h:wDamageDie=if(and(ThrowingWeapon,json.get(wProps,"Thrown")==0),"1d4",wDamageDie)]
[h:wClass=if(and(ThrowingWeapon,json.get(wProps,"Thrown")==0),"Improvised",wClass)]

[h:MonkWeapons="Unarmed,Shortsword,Club,Dagger,Handaxe,Javelin,Light hammer,Mace,Quarterstaff,Sickle,Spear"]
[h:MonkTest=if(and(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0)]['Name']"),"Martial Arts")==1,json.get(json.get(Armor,json.get(Armor,0)),"Type")=="None",json.get(json.get(Shield,json.get(Shield,0)),"Name")=="None",listFind(MonkWeapons,wType)>-1),1,0)]
[h,if(MonkTest): wDamageDie="1d"+((floor((number(json.get(json.path.read(allAbilities,".[?(@.Name=='MartialArts')]['Level']"),0))+1)/6)*2)+4)]
[h:PrimeStat=if(MonkTest==1,max(json.get(AtrMods, "Dexterity"),json.get(AtrMods, "Strength")),PrimeStat)]

[h:wDieSize=number(substring(wDamageDie,indexOf(wDamageDie,"d")+1))]
[h:wSecDieSize=number(substring(wSecDamageDie,indexOf(wSecDamageDie,"d")+1))]

[h:MiscAttackBonus=if(json.get(FightingStyle,"Achy")==1,if(or(ThrowingWeapon==1,wMeleeRanged=="Ranged"),2,0),0)]
[h:MiscDamageBonus=if(json.get(FightingStyle,"Duel")==1,if(and(ThrowingWeapon==0,wMeleeRanged=="Melee"),if(json.get(Weapon,1)==2,2,0),0),0)+if(and(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0)]['Name']"),"Rage"),wMeleeRanged=="Melee",getState("Rage")),RageDmg,0)]

[h:GWMTest=if(json.get(Feats,"GreatWeaponMaster")==1,if(json.get(wProps,"Heavy")>0,if(wMeleeRanged=="Ranged",0,1),0),0)]

[h,if(GWMTest==1),code:{
	[GWMChoice=input(
		"GWMSelect|No,Yes|Power Attacks? (-5 attack, +10 dmg)|LIST"
	)]
	[h:abort(GWMChoice)]
	[MiscAttackBonus=if(GWMSelect==1,MiscAttackBonus-5,MiscAttackBonus)]
	[MiscDamageBonus=if(GWMSelect==1,MiscDamageBonus+10,MiscDamageBonus)]
};{}]

[h:SSTest=if(json.get(Feats,"Sharpshooter")==1,if(or(wMeleeRanged=="Ranged",ThrowingWeapon==1),1,0),0)]
[h,if(SSTest==1),code:{
	[SSChoice=input(
		"SSSelect|No,Yes|Sharpshooter? (-5 attack, +10 dmg)|LIST"
	)]
	[h:abort(SSChoice)]
	[MiscAttackBonus=if(SSSelect==1,MiscAttackBonus-5,MiscAttackBonus)]
	[MiscDamageBonus=if(SSSelect==1,MiscDamageBonus+10,MiscDamageBonus)]
};{}]

[h:GWFTest = if(and(json.get(FightingStyle,"GWFt")==1,json.get(Weapon,OtherHand)<3,or(json.get(wProps,"Two-Handed")>0,json.get(wProps,"Versatile")>0)),1,0)]

[h:fCritRange=CritRange-max((wCritRange-iMagicCritBonusStacking),iMagicCritBonus)]
[h:fCritMultiplier=CritMultiplier+wCritMultiplier]
[h:CritDmgDie=(fCritMultiplier*number(substring(wDamageDie,0,indexOf(wDamageDie,"d"))))+substring(wDamageDie,indexOf(wDamageDie,"d"))]
[h:wSecDamageDiePlacehold = if(wSecDamageDie=="0","0d1",wSecDamageDie)]
[h:CritSecDmgDie=(fCritMultiplier*number(substring(wSecDamageDiePlacehold,0,indexOf(wSecDamageDiePlacehold,"d"))))+substring(wSecDamageDiePlacehold,indexOf(wSecDamageDiePlacehold,"d"))]

[h:BrutalCrit = 0]
[h:BrutalCrit = if(Race=="Half Orc",1,0)+if(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0 && @.Level>=9)]['Name']"),"Brutal Critical - Barbarian"),1,0)+if(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0 && @.Level>=13)]['Name']"),"Brutal Critical - Barbarian"),1,0)+if(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0 && @.Level>=17)]['Name']"),"Brutal Critical - Barbarian"),1,0)+iMagicCritBonusDice]
[h:secBrutalCrit = if(wSecDamageDie=="0",0,BrutalCrit)]

[h:wDamageDieNumber = number(substring(wDamageDie,0,indexOf(wDamageDie,"d"))))]
[h:wSecDamageDieNumber = number(substring(wSecDamageDie,0,1))]

[h:AttackCount=1+max(if(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0 && @.Level>=5)]['Name']"),"Extra Attack"),1,0)+if(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0 && @.Level>=11)]['Name']"),"Extra Attack"),1,0)+if(json.contains(json.path.read(allAbilities,".[?(@.IsActive>0 && @.Level>=20)]['Name']"),"Extra Attack"),1,0),iMagicAddedAtk)+iMagicAddedAtkStacking]
[h:AttackCount=if(SingleAttack,1,AttackCount)]

	[h:CritTest=0]
	[h:AllAttacksToHit="[]"]
	[h:AllAttacksDmg="[]"]
	[h:AllAttacksSecDmg="[]"]
	[h:AllAttacksiMagicDmg="[]"]
	
[h,count(AttackCount),code:{

	[h:roll1=1d20]
	[h:roll2=1d20]
	[h:ThisAttackiMagicDmg="[]"]
	[h:CritTest=if(Max(roll1,roll2)>=fCritRange,CritTest+1,CritTest)]
	[h:CritTestEach=if(Max(roll1,roll2)>=fCritRange,1,0)]
	[h:AllAttacksToHit=json.append(AllAttacksToHit,json.set("","Roll1",roll1,"Roll2",roll2,"CritTest",CritTestEach))]
	[h:wDmg = 0]
	[h:wDmgString = ""]
	[h:wDmgArray = ""]
	[h:wDmgCount = 0]
	[h:GWFTrigger = 0]
	[h:wCritDmg = 0]
	[h:wCritDmgString = ""]
	[h:wCritDmgArray = ""]
	[h:GWFCritTrigger = 0]
	[h:wSecDmg=0]
	[h:wSecDmgString = ""]
	[h:wSecDmgArray = ""]
	[h:wDmgCount = 0]
	[h:GWFSecTrigger = 0]
	[h:wCritSecDmg=0]
	[h:wCritSecDmgString = ""]
	[h:wCritSecDmgArray = ""]
	[h:wCritDmgCount = 0]
	[h:GWFCritSecTrigger = 0]
	
[h,foreach(Item,iMagicAllDmgBonusArray),CODE:{
	[h:junkVar=getNewRolls()]
	[h:iRolledDamageDisplay=if(json.get(Item,"DieNum")==0,"",json.get(Item,"DieNum")+"d"+json.get(Item,"DieSize"))]
	[h:iRolledDamage=eval(iRolledDamageDisplay)]
	[h:iFlatBonus=json.get(Item,"Bonus")]
	[h:iRolledDamageDisplay=if(iFlatBonus==0,iRolledDamageDisplay,listAppend(iRolledDamageDisplay,iFlatBonus," + "))]
	[h:iRolledDamageArray=getNewRolls()]
	[h:iRolledDamageStr=json.toList(iRolledDamageArray," + ")]
	[h:iRolledDamageStr=if(iFlatBonus==0,iRolledDamageStr,listAppend(iRolledDamageStr,iFlatBonus," + "))]
	[h:iRolledCritDamage=eval(iRolledDamageDisplay)]
	[h:iRolledCritDamageArray=getNewRolls()]
	[h:iRolledCritDamageStr=json.toList(iRolledCritDamageArray," + ")]
	[h:ThisAttackiMagicDmg=json.append(ThisAttackiMagicDmg,json.set("","Name",json.get(Item,"Name"),"Type",json.get(Item,"Type"),"Damage",(iRolledDamage+iFlatBonus),"DamageString",iRolledDamageStr,"Display",iRolledDamageDisplay,"CritDamageString",iRolledCritDamageStr,"CritDamage",(iRolledCritDamage+iRolledDamage)))]
}]

	[h:AllAttacksiMagicDmg=json.append(AllAttacksiMagicDmg,ThisAttackiMagicDmg)]
	
<!-- If you would like to manually reroll your Great Weapons Fighting 1s and 2s remove the second temproll equals line from all count functions. Then change the text lower down to reflect that they were not rerolled. -->

	[h,count(wDamageDieNumber),CODE:{
		[h:tempRoll = eval("1d"+wDieSize)]
		[h:GWFTrigger = if(and(GWFTest==1,tempRoll<3),GWFTrigger+1,GWFTrigger)]
		[h:tempRoll = if(and(GWFTest==1,tempRoll<3),eval("1d"+wDieSize),tempRoll)]
		[h:wDmg = wDmg + tempRoll]
		[h:wDmgArray = json.append(wDmgArray,tempRoll)]
		[h:wDmgString = wDmgString+" + "+json.get(wDmgArray,wDmgCount)]
		[h:wDmgCount = wDmgCount+1]
	}]

	[h:wDmgString = substring(wDmgString,3)]
	[h:wDmgCount = 0]

	[h,count(wDamageDieNumber+BrutalCrit),CODE:{
		[h:tempRoll = eval("1d"+wDieSize)]
		[h:GWFCritTrigger = if(and(GWFTest==1,tempRoll<3),GWFCritTrigger+1,GWFCritTrigger)]
		[h:tempRoll = if(and(GWFTest==1,tempRoll<3),eval("1d"+wDieSize),tempRoll)]
		[h:wCritDmg = wCritDmg + tempRoll]
		[h:wCritDmgArray = json.append(wCritDmgArray,tempRoll)]
		[h:wCritDmgString = wCritDmgString+" + "+json.get(wCritDmgArray,wDmgCount)]
		[h:wDmgCount = wDmgCount+1]
	}]
	[h:wCritDmgString = substring(wCritDmgString,3)]

	[h:AllAttacksDmg=json.append(AllAttacksDmg,json.set("","RolledDamage",wDmg,"RolledDamageStr",wDmgString,"RolledDamageCrit",wCritDmg,"RolledDamageCritStr",wCritDmgString))]

	[h,count(wSecDamageDieNumber),CODE:{
		[h:tempRoll = eval("1d"+wSecDieSize)]
		[h:GWFSecTrigger = if(and(GWFTest==1,tempRoll<3),GWFSecTrigger+1,GWFSecTrigger)]
		[h:tempRoll = if(and(GWFTest==1,tempRoll<3),eval("1d"+wDieSize),tempRoll)]
		[h:wSecDmg = wSecDmg + tempRoll]
		[h:wSecDmgArray = json.append(wSecDmgArray,tempRoll)]
		[h:wSecDmgString = wSecDmgString+" + "+json.get(wSecDmgArray,roll.count)]
		[h:wSecDmgString = if(roll.count==(wSecDamageDieNumber-1),substring(wSecDmgString,3),wSecDmgString)]
	}]

	[h,count(wSecDamageDieNumber),CODE:{
		[h:tempRoll = eval("1d"+wSecDieSize)]
		[h:GWFCritSecTrigger = if(and(GWFTest==1,tempRoll<3),GWFCritSecTrigger+1,GWFCritSecTrigger)]
		[h:tempRoll = if(and(GWFTest==1,tempRoll<3),eval("1d"+wDieSize),tempRoll)]
		[h:wCritSecDmg = wCritSecDmg + tempRoll]
		[h:wCritSecDmgArray = json.append(wCritSecDmgArray,tempRoll)]
		[h:wCritSecDmgString = wCritSecDmgString+" + "+json.get(wCritSecDmgArray,roll.count)]
		[h:wCritSecDmgString = if(roll.count==(wSecDamageDieNumber-1),substring(wCritSecDmgString,3),wCritSecDmgString)]
	}]
	
	[h:AllAttacksSecDmg=json.append(AllAttacksSecDmg,json.set("","RolledDamage",wSecDmg,"RolledDamageStr",wSecDmgString,"RolledDamageCrit",wCritSecDmg,"RolledDamageCritStr",wCritSecDmgString))]

	[h:Enlarge=1d4]
	[h:EnlargeCrit=1d4]
	[h:Reduce=1d4]
	[h:ReduceCrit=1d4]
}]

<!-- These loops are separated to prevent stack overflow. Possible problem with roll.count setting incorrectly after if code blocks? So WhichAttack is used instead. -->
[h:WhichAttack=0]
[r:"<table style='"+TableFormat+"'>"]
[r,count(AttackCount,"<tr></tr>"),code:{
		[h:thisattackCrit=If(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))>=fCritRange,1,0)]	
		
		[r:"<tr><th style='"+AccentFormat+"'>Attack"+VerticalFormat+" "+json.get(json.get(AllAttacksToHit,roll.count),"Roll1")+" + "+(if(ProfTest,Proficiency,0)+PrimeStat)+if(iMagicAtkBonus==0,""," + "+iMagicAtkBonusStr)+if(wMagicBonus==0,""," + "+wMagicBonus)+if(MiscAttackBonus==0,""," + "+MiscAttackBonus)+" = <span style='font-size:1.5em;'><b><span style='"+if(json.get(json.get(AllAttacksToHit,roll.count),"Roll1")>=fCritRange,'font-size:2em; color:#AA2222;','')+if(json.get(json.get(AllAttacksToHit,roll.count),"Roll1")==1,'font-size:2em; color:#2222AA;','')+"'>"+(json.get(json.get(AllAttacksToHit,roll.count),"Roll1")+if(ProfTest,Proficiency,0)+PrimeStat+wMagicBonus+MiscAttackBonus+iMagicAtkBonus)+"</span></b></span><br>(Adv: <b><span style='"+if(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))>=fCritRange,'font-size:2em; color:#AA2222;','')+if(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))==1,'font-size:2em; color:#2222AA;','')+"'>"+(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))+if(ProfTest,Proficiency,0)+PrimeStat+wMagicBonus+MiscAttackBonus+iMagicAtkBonus)+"</span></b> / Dis: <b><span style='"+if(Min(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))>=fCritRange,'font-size:2em; color:#AA2222;','')+if(Min(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))==1,'font-size:2em; color:#2222AA;','')+"'>"+(Min(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))+if(ProfTest==1,Proficiency,0)+PrimeStat+wMagicBonus+MiscAttackBonus+iMagicAtkBonus)+"</span></b>)</td></tr>"]
		
		[r:if(getState("Bless"),"<tr><th style='"+AccentFormat+"'><b>Blessed</b>"+VerticalFormat+" Add 1d4 to your attack roll:<span style='font-size:1.5em;'> "+1d4+"</span></td></tr>","")]
		[r:if(getState("Bane"),"<tr><th style='"+AccentFormat+"'><b>Bane</b>"+VerticalFormat+" Subtract 1d4 from your attack roll:<span style='font-size:1.5em;'> "+1d4+"</span></td></tr>","")]

		[r:"<tr><th style='"+AccentFormat+"'>"+wDamageType+" Weapon Damage"+VerticalFormat+" "+wDamageDieNumber+"d"+wDieSize+if(json.get(wProps,"DmgMod")==1," + "+PrimeStat,"")+if(wMagicBonus==0,""," + "+wMagicBonus)+if(MiscDamageBonus==0,""," + "+MiscDamageBonus)+" = "+json.get(json.get(AllAttacksDmg,roll.count),"RolledDamageStr")+if(json.get(wProps,"DmgMod")==1," + "+PrimeStat,"")+if(wMagicBonus==0,""," + "+wMagicBonus)+if(MiscDamageBonus==0,""," + "+MiscDamageBonus)+if(getState("Enlarge")," + "+Enlarge,"")+if(getState("Reduce")," - "+Reduce,"")+" = <b><span style='font-size:1.5em;'>"+(json.get(json.get(AllAttacksDmg,roll.count),"RolledDamage")+if(json.get(wProps,"DmgMod")==1,PrimeStat,0)+wMagicBonus+MiscDamageBonus+if(getState("Enlarge"),Enlarge,0)-if(getState("Reduce"),Reduce,0))+"</b><span style='font-size:1.5em; color:AA2222;'>"+If(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))>=fCritRange,"<br>Crit: <span style='font-size:1em;'>+ "+json.get(json.get(AllAttacksDmg,roll.count),"RolledDamageCritStr")+if(getState("Enlarge")," + "+EnlargeCrit,"")+if(getState("Reduce")," - "+ReduceCrit,"")+" = ",'')+"</span><b>"+If(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))>=fCritRange,json.get(json.get(AllAttacksDmg,roll.count),"RolledDamage")+json.get(json.get(AllAttacksDmg,roll.count),"RolledDamageCrit")+if(json.get(wProps,"DmgMod")==1,PrimeStat,0)+wMagicBonus+MiscDamageBonus+if(getState("Enlarge"),EnlargeCrit,0)-if(getState("Reduce"),ReduceCrit,0),'')+"</b></span></span></td></tr>"]

		[r:if(GWFTest==1,"<tr><th style='"+AccentFormat+"'><b>Great Weapon Fighting</b>"+VerticalFormat+" You rolled <b>"+if(Max(roll1,roll2)>=fCritRange,(GWFCritTrigger+GWFTrigger),GWFTrigger)+"</b> 1s or 2s on your d"+wDieSize+"s"+if(or(GWFTrigger>0,and(Max(roll1,roll2)>=fCritRange,GWFCritTrigger>0)),", which were rerolled.</td></tr>",".</td></tr>"),"")]

        [r,if(wSecDamageDie=="0"),code:{};{
			[r:"<tr><th style='"+AccentFormat+"'>"+wSecDamageType+" Weapon Damage"+VerticalFormat+" "+wSecDamageDieNumber+"d"+wSecDieSize+" = "+json.get(json.get(AllAttacksSecDmg,roll.count),"RolledDamageStr")+" = <b><span style='font-size:1.5em;'>"+json.get(json.get(AllAttacksSecDmg,roll.count),"RolledDamage")+"</b><span style='font-size:1.5em; color:AA2222;'>"+If(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))>=fCritRange,"<br>Crit: <span style='font-size:1em;'>+ "+json.get(json.get(AllAttacksSecDmg,roll.count),"RolledDamageCritStr")+" = ",'')+"</span><b>"+If(Max(json.get(json.get(AllAttacksToHit,roll.count),"Roll1"),json.get(json.get(AllAttacksToHit,roll.count),"Roll2"))>=fCritRange,json.get(json.get(AllAttacksSecDmg,roll.count),"RolledDamage")+json.get(json.get(AllAttacksSecDmg,roll.count),"RolledDamageCrit"),'')+"</b></span></span></td></tr>"]
		}]
		
			[r:if(and(wSecDamageDie!="0",GWFTest==1),"<tr><th style='"+AccentFormat+"'><b>Great Weapon Fighting</b>"+VerticalFormat+" You rolled <b>"+if(Max(roll1,roll2)>=fCritRange,(GWFSecTrigger+GWFCritSecTrigger),GWFSecTrigger)+"</b> 1s or 2s on your d"+wSecDieSize+"s"+if(or(GWFSecTrigger>0,and(Max(roll1,roll2)>=fCritRange,GWFCritSecTrigger>0)),", which were rerolled.</td></tr>",".</td></tr>"),"")]	
		
		[r,foreach(Item,json.get(AllAttacksiMagicDmg,WhichAttack),""),CODE:{
			[r:"<tr><th style='"+AccentFormat+"'>"+json.get(Item,"Name")+": "+if(json.get(Item,"Type")=="Same as Weapon",wDamageType+if(wSecDamageType=="None",""," or "+wSecDamageType),json.get(Item,"Type"))+" Damage"+VerticalFormat+" "+json.get(Item,"Display")+" = "+json.get(Item,"DamageString")+" = <b><span style='font-size:1.5em;'>"+json.get(Item,"Damage")+"</b><span style='font-size:1.5em; color:AA2222;'>"+If(Max(json.get(json.get(AllAttacksToHit,WhichAttack),"Roll1"),json.get(json.get(AllAttacksToHit,WhichAttack),"Roll2"))>=fCritRange,"<br>Crit: <span style='font-size:1em;'>+ "+json.get(Item,"CritDamageString")+" = ",'')+"</span><b>"+If(Max(json.get(json.get(AllAttacksToHit,WhichAttack),"Roll1"),json.get(json.get(AllAttacksToHit,WhichAttack),"Roll2"))>=fCritRange,json.get(Item,"CritDamage"),'')+"</b></span></span></td></tr>"]
		}]
		
		[r,foreach(ability,json.path.read(allAbilities,"[?(@.IsActive>0 && @.CallAfterEachAttack==1)]")): evalMacro("[r:pm."+json.get(ability,"Name")+json.get(ability,"Class")+"('AfterEachAttack')]")]

		[r:if(and(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),or(roll1==1,roll2==1)),"<tr><th style='"+AccentFormat+"'><b>Halfling Luck</b>"+VerticalFormat+" You can reroll the 1 on your attack roll, and must use the new roll.</td></tr>","")]

[h:WhichAttack=WhichAttack+1]
}]











		[r:if(wRange==0,"","<tr><th style='"+AccentFormat+"'><b>Range</b>"+VerticalFormat+" "+wRange+"</td></tr>")]
		[r:if(wSpecialAbility=="","","<tr><th style='"+AccentFormat+"'><b>Special Ability</b>"+VerticalFormat+""+wSpecialAbility+"</td></tr>")]
		
		[r:if(getState("Squeezing"),"<tr><th style='"+AccentFormat+"'><b>Squeezing</b>"+VerticalFormat+" You have disadvantage on your attack rolls.</td></tr>","")]
		[r:if(getState("Blinded"),"<tr><th style='"+AccentFormat+"'><b>Blinded</b>"+VerticalFormat+" You have disadvantage on your attack rolls.</td></tr>","")]
		[r:if(getState("Poisoned"),"<tr><th style='"+AccentFormat+"'><b>Poisoned</b>"+VerticalFormat+" You have disadvantage on your attack rolls.</td></tr>","")]
		[r:if(getState("Prone"),"<tr><th style='"+AccentFormat+"'><b>Prone</b>"+VerticalFormat+" You have disadvantage on your attack rolls.</td></tr>","")]
		[r:if(getState("Frightened"),"<tr><th style='"+AccentFormat+"'><b>Frightened</b>"+VerticalFormat+" You have disadvantage on your attack rolls if the source of your fear is within line of sight.</td></tr>","")]
		[r:if(getState("Restrained"),"<tr><th style='"+AccentFormat+"'><b>Restrained</b>"+VerticalFormat+" You have disadvantage on your attack rolls.</td></tr>","")]
		[r:if(getState("Hidden"),"<tr><th style='"+AccentFormat+"'><b>Hidden</b>"+VerticalFormat+" You have advantage on your first attack roll.</td></tr>","")]
		[r:if(getState("Foresight"),"<tr><th style='"+AccentFormat+"'><b>Foresight</b>"+VerticalFormat+" You have advantage on your attack rolls.</td></tr>","")]
		[r:if(Exhaustion>=3,"<tr><th style='"+AccentFormat+"'><b>Exhausted</b>"+VerticalFormat+" You have disadvantage on your attack rolls.</td></tr>","")]
		[r:if(getState("Greater Invisibility"),"<tr><th style='"+AccentFormat+"'><b>Greater Invisibility</b>"+VerticalFormat+" You have advantage on your attack rolls.</td></tr>","")]
		[r:if(getState("Invisible"),"<tr><th style='"+AccentFormat+"'><b>Invisibility</b>"+VerticalFormat+" You have advantage on your first attack roll.</td></tr>","")]
		[h: setState("Invisible", 0)]
		[h: Visibility = if(getState("Greater Invisibility"),1,0)]
		[h: setOwnerOnlyVisible(Visibility)]
		
		[r,foreach(ability,json.path.read(allAbilities,"[?(@.IsActive>0 && @.CallAfterAttack==1)]"),""): evalMacro("[r:pm."+json.get(ability,"Name")+json.get(ability,"Class")+"('AfterAttack')]")]



		
		[r:if(json.get(Feats,"GreatWeaponMaster")==1,"<tr><th style='"+AccentFormat+"'><b>Great Weapons Master</b>"+VerticalFormat+" If you use a melee weapon to score a critical hit or reduce a creature to 0 hit points, you can make one melee weapon attack as a bonus action.</td></tr>","")]
		
		
		[r,foreach(item,iMagicAdv):"<tr><th style='"+AccentFormat+"'><b>"+item+"</b>"+VerticalFormat+" Your "+item+" grants you advantage on "+if(AttackCount==1,"this attack.</td></tr>","these attacks.</td></tr>")]
		[r,foreach(item,iMagicDis):"<tr><th style='"+AccentFormat+"'><b>"+item+"</b>"+VerticalFormat+" Your "+item+" inflicts disadvantage on "+if(AttackCount==1,"this attack.</td></tr>","these attacks.</td></tr>")]
		[r,foreach(item,iMagicMessage):item]
		[r,if(CritTest>0),CODE:{
			[r,foreach(item,iMagicCritMessage):item]
		};{}]
		
	</div>
</div>