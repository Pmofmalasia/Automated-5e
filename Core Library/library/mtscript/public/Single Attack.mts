[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:wName=json.get(json.get(Weapon,json.get(Weapon,0)),"Name")]
[h:wMagicBonus=json.get(json.get(Weapon,json.get(Weapon,0)),"MagicBonus")]
[h:wType=json.get(json.get(Weapon,json.get(Weapon,0)),"Type")]
[h:wDamageDie=json.get(json.get(Weapon,json.get(Weapon,0)),"DamageDie")]
[h:wDamageType=json.get(json.get(Weapon,json.get(Weapon,0)),"DamageType")]
[h:wSecDamageDie=json.get(json.get(Weapon,json.get(Weapon,0)),"SecDamageDie")]
[h:wSecDamageType=json.get(json.get(Weapon,json.get(Weapon,0)),"SecDamageType")]
[h:wRange=json.get(json.get(Weapon,json.get(Weapon,0)),"Range")]
[h:wCritRange=json.get(json.get(Weapon,json.get(Weapon,0)),"CritRange")]
[h:wCritMultiplier=json.get(json.get(Weapon,json.get(Weapon,0)),"CritMultiplier")]
[h:wSpecialAbility=json.get(json.get(Weapon,json.get(Weapon,0)),"SpecialAbility")]
[h:wProps=json.get(json.get(Weapon,json.get(Weapon,0)),"Props")]

[h:VersatileTest=if(listFind(wProps,"Versatile")>-1,if(json.get(Weapon,1)==2,if(json.get(Shield,0)==1,1,0),0),0)]

[h,if(VersatileTest==1),code:{
	[wDamageDie=substring(wDamageDie,0,indexOf(wDamageDie,"d")+1)+(number(substring(wDamageDie,indexOf(wDamageDie,"d")+1))+2)]
};{}]

[h:PrimeStat=if(listFind(wProps,"Finesse")>-1,max(json.get(AtrMods, "Dexterity"),json.get(AtrMods, "Strength")),json.get(AtrMods, "Strength"))]
[h:PrimeStat=if(listFind(wProps,"Ammunition")>-1,json.get(AtrMods, "Dexterity"),PrimeStat)]
[h:PrimeStat=if(listFind(wProps,"IntMod")>-1,json.get(AtrMods, "Intelligence"),PrimeStat)]
[h:PrimeStat=if(listFind(wProps,"WisMod")>-1,json.get(AtrMods, "Wisdom"),PrimeStat)]
[h:PrimeStat=if(listFind(wProps,"ChaMod")>-1,json.get(AtrMods, "Charisma"),PrimeStat)]

[h:wDamageDie=if(json.get(Feats,"TavernBrawler")==1,if(wType=="Unarmed","1d4",wDamageDie),wDamageDie)]

[h:MonkWeapons="Unarmed,Shortsword,Club,Dagger,Handaxe,Javelin,Light hammer,Mace,Quarterstaff,Sickle,Spear"]
[h:MonkTest=if(json.get(LClass,"LMnk")>0,if(json.get(json.get(Armor,json.get(Armor,0)),"Type")=="None",if(json.get(json.get(Shield,json.get(Shield,0)),"Name")=="None",if(listFind(MonkWeapons,wType)>-1,1,0),0),0),0)]
[h:wDamageDie=if(MonkTest==1,"1d"+((floor((json.get(LClass,"LMnk")+1)/6)*2)+4),wDamageDie)]
[h:mDieSize=2*floor((json.get(LClass,"LMnk")+1)/6)+if(json.get(LClass,"LMnk")==0,0,4)]
[h:PrimeStat=if(MonkTest==1,max((AtrMods, "Dexterity"),json.get(AtrMods, "Strength")),PrimeStat)]

[h:wDieSize=number(substring(wDamageDie,indexOf(wDamageDie,"d")+1))]
[h:wSecDieSize=number(substring(wSecDamageDie,indexOf(wSecDamageDie,"d")+1))]

[h:MiscAttackBonus=if(json.get(FightingStyle,"Achy")==1,if(or(listFind(wProps,"Thrown")>-1,listFind(wProps,"Ammunition")>-1),2,0),0)+if(SharpenTheBlade=="",0,SharpenTheBlade)]
[h:MiscDamageBonus=if(json.get(FightingStyle,"Duel")==1,if(and(listFind(wProps,"Thrown")==-1,listFind(wProps,"Ammunition")==-1),if(json.get(Weapon,1)==2,2,0),0),0)+if(and(json.get(LClass,"LBrb")>0,listFind(wProps,"Ammunition")==-1),RageDmg,0)+if(SharpenTheBlade=="",0,SharpenTheBlade)]

[h:BrutalCrit = 0]
[h:BrutalCrit = if(Race=="Half Orc",1,0)+if(json.get(LClass,"LBrb")>=9,1,0)+if(json.get(LClass,"LBrb")>=13,1,0)+if(json.get(LClass,"LBrb")>=17,1,0)]
[h:secBrutalCrit = if(wSecDamageDie=="0",0,BrutalCrit)]

[h:GWMTest=if(json.get(Feats,"GreatWeaponMaster")==1,if(listFind(wProps,"Heavy")>-1,if(listFind(wProps,"Ammunition")>-1,0,1),0),0)]
[h,if(GWMTest==1),code:{
	[GWMChoice=input(
		"GWMSelect|No,Yes|Power Attacks? (-5 attack, +10 dmg)|LIST"
	)]
	[h:abort(GWMChoice)]
	[MiscAttackBonus=if(GWMSelect==1,MiscAttackBonus-5,MiscAttackBonus)]
	[MiscDamageBonus=if(GWMSelect==1,MiscDamageBonus+10,MiscDamageBonus)]
};{}]

[h:SSTest=if(json.get(Feats,"Sharpshooter")==1,if(or(listFind(wProps,"Ammunition")>-1,listFind(wProps,"Thrown")>-1),1,0),0)]
[h,if(SSTest==1),code:{
	[SSChoice=input(
		"SSSelect|No,Yes|Sharpshooter? (-5 attack, +10 dmg)|LIST"
	)]
	[h:abort(SSChoice)]
	[MiscAttackBonus=if(SSSelect==1,MiscAttackBonus-5,MiscAttackBonus)]
	[MiscDamageBonus=if(SSSelect==1,MiscDamageBonus+10,MiscDamageBonus)]
};{}]

[h:GWFTest = if(and(json.get(FightingStyle,"GWFt")==1,json.get(Weapon,1)<3,or(listFind(wProps,"Two-handed")>-1,listFind(wProps,"Versatile")>-1)),1,0)]

[h:fCritRange=CritRange-wCritRange]
[h:fCritMultiplier=CritMultiplier+wCritMultiplier]
[h:CritDmgDie=(fCritMultiplier*number(substring(wDamageDie,0,indexOf(wDamageDie,"d"))))+substring(wDamageDie,indexOf(wDamageDie,"d"))]
[h:wSecDamageDiePlacehold = if(wSecDamageDie=="0","0d1",wSecDamageDie)]
[h:CritSecDmgDie=(fCritMultiplier*number(substring(wSecDamageDiePlacehold,0,indexOf(wSecDamageDiePlacehold,"d"))))+substring(wSecDamageDiePlacehold,indexOf(wSecDamageDiePlacehold,"d"))]

[h:wDamageDieNumber = number(substring(wDamageDie,0,1))]
[h:wSecDamageDieNumber = number(substring(wSecDamageDie,0,1))]

[h:AttackCount=1+if(or(and(json.get(LClass,"LArt")>=5,json.get(ArtSpecialist,"BaSm")==1),json.get(LClass,"LBrb")>=5,json.get(LClass,"LFtr")>=5,json.get(LClass,"LMnk")>=5,json.get(LClass,"LPdn")>=5,json.get(LClass,"LRgr")>=5,json.get(EInvocations,"TgB")>=5),1,0)+if(json.get(LClass,"LFtr")>=11,1,0)+if(json.get(LClass,"LFtr")>=20,1,0)]

<div style="background-color: #000000; color: #FFFFFF; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>{wName} Attack ({wDamageType})</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		[r:if(Flavor==(token.name+" FLAVOR TEXT HERE"),"",'<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">'+"<i>"+Flavor+"</i></div>")]

		[h:Roll1=1d20]
		[h:Roll2=1d20]
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
	[h:CritTest=0]
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

	[h:Enlarge=1d4]
	[h:EnlargeCrit=1d4]
	[h:Reduce=1d4]
	[h:ReduceCrit=1d4]

		<span style='font-size:1.5em;'>Attack: <b><span style='[r:if(roll1>=fCritRange,'font-size:2em; color:#AA2222;','')][r:if(roll1==1,'font-size:2em; color:#2222AA;','')]'>[r:roll1+Proficiency+PrimeStat+wMagicBonus+MiscAttackBonus]</span></b> ([r:Roll1])</span>

		<br>(Adv: <b><span style='[r:if(Max(roll1,roll2)>=fCritRange,'font-size:2em; color:#AA2222;','')][r:if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')]'>[r:Max(roll1,roll2)+Proficiency+PrimeStat+wMagicBonus+MiscAttackBonus]</span></b>

		 / Dis: <b><span style='[r:if(Min(roll1,roll2)>=fCritRange,'font-size:2em; color:#AA2222;','')][r:if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')]'>[r:Min(roll1,roll2)+Proficiency+PrimeStat+wMagicBonus+MiscAttackBonus]</span></b>)

		<br><span style='font-size:1.5em;'>Damage: [r:wDmgString] + [r:PrimeStat] [r:if(wMagicBonus==0,"","+ "+wMagicBonus+" ")][r:if(MiscDamageBonus==0,"","+ "+MiscDamageBonus+" ")][r:if(getState("Enlarge"),"+ "+Enlarge+" ","")][r:if(getState("Reduce"),"- "+Reduce+" ","")]= <b>[r:wDmg+PrimeStat+wMagicBonus+MiscDamageBonus+if(getState("Enlarge"),Enlarge,0)-if(getState("Reduce"),Reduce,0)]</b>
		
		<span style='color:AA2222;'>[r:If(Max(roll1,roll2)>=fCritRange,"Crit: + "+wCritDmgString+if(getState("Enlarge")," + "+EnlargeCrit,"")+if(getState("Reduce")," - "+ReduceCrit,"")+" = ",'')]<b>[r:If(Max(roll1,roll2)>=fCritRange,wDmg+wCritDmg+PrimeStat+wMagicBonus+MiscDamageBonus+if(getState("Enlarge"),EnlargeCrit,0)-if(getState("Reduce"),ReduceCrit,0),'')]</b></span></span>

		[r:if(getState("Bless"),"<br><b>Bless:</b> Add 1d4 to your attack roll:<span style='font-size:1.5em;'> "+1d4+"</span>","")]
		[r:if(getState("Bane"),"<br><b>Bane:</b> Subtract 1d4 from your attack roll:<span style='font-size:1.5em;'> "+1d4+"</span>","")]
		[r:if(getState("Squeezing"),"<br><b>Squeezing:</b> You have disadvantage on your attack roll.","")]
		[r:if(getState("Blinded"),"<br><b>Blinded:</b> You have disadvantage on your attack roll.","")]
		[r:if(getState("Poisoned"),"<br><b>Poisoned:</b> You have disadvantage on your attack roll.","")]
		[r:if(getState("Prone"),"<br><b>Prone:</b> You have disadvantage on your attack roll.","")]
		[r:if(getState("Frightened"),"<br><b>Frightened:</b> You have disadvantage on your attack roll if the source of your fear is within line of sight.","")]
		[r:if(getState("Restrained"),"<br><b>Restrained:</b> You have disadvantage on your attack roll.","")]
		[r:if(getState("Hidden"),"<br><b>Hidden:</b> You have advantage on your first attack roll.","")]
		[r:if(getState("Foresight"),"<br><b>Foresight:</b> You have advantage on your attack rolls.","")]
		[r:if(Exhaustion>=3,"<br><b>Exhausted:</b> You have disadvantage on your attack rolls.","")]
		[r:if(getState("Greater Invisibility"),"<br><b>Greater Invisibility:</b> You have advantage on your attack rolls.","")]
		[r:if(getState("Invisible"),"<br><b>Invisibility:</b> You have advantage on your first attack roll.","")]
		[h: setState("Invisible", 0)]
		[h: Visibility = if(getState("Greater Invisibility"),1,0)]
		[h: setOwnerOnlyVisible(Visibility)]

		[r:if(GWFTest==1,"<br><b>Great Weapon Fighting:</b> You rolled <b>"+if(Max(roll1,roll2)>=fCritRange,(GWFCritTrigger+GWFTrigger),GWFTrigger)+"</b> 1s or 2s on your d"+wDieSize+"s"+if(or(GWFTrigger>0,and(Max(roll1,roll2)>=fCritRange,GWFCritTrigger>0)),", which were rerolled.","."),"")]

        [if(wSecDamageDie=="0"),code:{};{
			<br><span style='font-size:1.5em;'>[r:wSecDamageType] Damage: <b>[r:wSecDmgString][r:if(wSecDamageDieNumber>1," = "+wSecDmg,"")]</b></br>

			<span style='color:AA2222;'>[r:If(Max(roll1,roll2)>=fCritRange," Crit: + "+wCritSecDmgString+" = ",'')]<b>[r:If(Max(roll1,roll2)>=fCritRange,(wSecDmg+wCritSecDmg),'')]</b></span></span>
		}]
		
			[r:if(and(wSecDamageDie!="0",GWFTest==1),"<br><b>Great Weapon Fighting:</b> You rolled <b>"+if(Max(roll1,roll2)>=fCritRange,(GWFSecTrigger+GWFCritSecTrigger),GWFSecTrigger)+"</b> 1s or 2s on your d"+wSecDieSize+"s"+if(or(GWFSecTrigger>0,and(Max(roll1,roll2)>=fCritRange,GWFCritSecTrigger>0)),", which were rerolled.","."),"")]

		[r:if(wRange==0,"","<br><b>Range:</b> "+wRange)]
		[r:if(wSpecialAbility=="","","<br>"+wSpecialAbility)]
			
		[h:ImprovedSmite = 1d8]
		[h:ImprovedSmiteCrit = 1d8]
		[h:GWFSmiteTrigger = if(ImprovedSmite<3,1,0)]
		[h:GWFSmiteCritTrigger = if(ImprovedSmiteCrit<3,1,0)]
		[h:ImprovedSmite = if(and(ImprovedSmite<3,GWFTest==1),1d8,ImprovedSmite)]
		[h:ImprovedSmiteCrit = if(and(ImprovedSmiteCrit<3,GWFTest==1),1d8,ImprovedSmiteCrit)]
		
		[r:if(and(json.get(LClass,"LPdn")>=11,listFind(wProps,"Ammunition")==-1),"<br><b>Improved Divine Smite</b>: You deal an extra 1d8 radiant damage: <span style='color:orange; font-size:1.5em;'>"+ImprovedSmite+"</span><span style='color:AA2222; font-size:1.5em;'>"+if(Max(roll1,roll2)>=fCritRange," Crit: + "+ImprovedSmiteCrit,"")+"</span>","")]
		[r:if(and(GWFTest==1,json.get(LClass,"LPdn")>=11,listFind(wProps,"Ammunition")==-1,or(GWFSmiteTrigger==1,and(Max(roll1,roll2)>=fCritRange,GWFSmiteCritTrigger==1))),"<br><b>Great Weapon Fighting</b>: You rolled <b>"+(GWFSmiteTrigger+if(Max(roll1,roll2)>=fCritRange,GWFSmiteCritTrigger,0))+"</b> 1s or 2s on your Smite, which were rerolled.","")]
		
		[h:DivineFury = 1d6]
		[h:DivineFuryCrit = 1d6]
		[h:GWFDFTrigger = if(DivineFury<3,1,0)]
		[h:GWFDFCritTrigger = if(DivineFuryCrit<3,1,0)]
		[h:DivineFury = if(and(DivineFury<3,GWFTest==1),1d6,DivineFury)]
		[h:DivineFuryCrit = if(and(DivineFuryCrit<3,GWFTest==1),1d6,DivineFuryCrit)]
		
		[r:if(and(getState("Rage"),json.get(LClass,"LBrb")>=3,json.get(BrbPath,"Zlot")==1),"<br><b>Divine Fury</b>: Extra radiant or necrotic damage to the first creature you hit this turn: "+DivineFury+" + "+floor(json.get(LClass,"LBrb")/2)+" = <span style='font-size:1.5em;'>"+(DivineFury+floor(json.get(LClass,"LBrb")/2))+"</span><span style='color:AA2222; font-size:1.5em;'>"+if(CritTest>0," Crit: + "+DivineFuryCrit,"")+"</span>","")]
		[r:if(and(getState("Rage"),GWFTest==1,json.get(LClass,"LBrb")>=3,json.get(BrbPath,"Zlot")==1,or(GWFDFTrigger==1,and(CritTest>0,GWFDFCritTrigger==1))),"<br><b>Great Weapon Fighting</b>: You rolled <b>"+(GWFDFTrigger+if(CritTest>0,GWFDFCritTrigger,0))+"</b> 1s or 2s on your Divine Fury dice, which were rerolled.","")]
		
		[h:ColossusSlayer = 1d8]
		[h:ColossusSlayerCrit = 1d8]
		[h:GWFCSTrigger = if(ColossusSlayer<3,1,0)]
		[h:GWFCSCritTrigger = if(ColossusSlayerCrit<3,1,0)]
		[h:ColossusSlayer = if(and(ColossusSlayer<3,GWFTest==1),1d8,ColossusSlayer)]
		[h:ColossusSlayerCrit = if(and(ColossusSlayerCrit<3,GWFTest==1),1d8,ColossusSlayerCrit)]
		
		[r:if(and(json.get(LClass,"LRgr")>=3,json.get(RgrArchetype,"Hntr")==1,json.get(HuntersPrey,"CSlr")==1),"<br><b>Colossus Slayer</b>: Once per turn, you deal an extra 1d8 damage to targets below their hit point maximum: <span style='font-size:1.5em;'>"+ColossusSlayer+"</span><span style='color:AA2222; font-size:1.5em;'>"+if(CritTest>0," Crit: + "+ColossusSlayerCrit,"")+"</span>","")]
		[r:if(and(GWFTest==1,json.get(LClass,"LRgr")>=3,json.get(RgrArchetype,"Hntr")==1,json.get(HuntersPrey,"CSlr")==1,or(GWFCSTrigger==1,and(CritTest>0,GWFCSCritTrigger==1))),"<br><b>Great Weapon Fighting</b>: You rolled <b>"+(GWFCSTrigger+if(CritTest>0,GWFCSCritTrigger,0))+"</b> 1s or 2s on your Colossus Slayer dice, which were rerolled.","")]
		
		[r:if(and(json.get(LClass,"LBrd")==3,json.get(BrdCollege,"Swds")==1),"<br><b>Blade Flourish</b>: If this attack was made as part of a full Attack action, your walking speed increases by 10 feet until the end of turn. If a weapon attack that you make as part of this action hits a creature, you can use a Blade Flourish option of your choice.","")]
			[r:if(or(wDamageType=="Lightning",wSecDamageType=="Lightning"),if(json.get(LClass,"LClc")>=6,if(json.get(ClcDomain,"Tmpt")==1,"<br><b>Thunderbolt Strike</b>: When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.",""),""),"")]
		[r:if(and(json.get(LClass,"LFtr")>=10,json.get(FtrArchetype,"ErKn")==1),"<br><b>Eldritch Strike</b>: When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.","")]
		[r:if(and(wType=="Unarmed",json.get(LClass,"LMnk")>=6),"<br><b>Ki-Empowered Strikes</b>: Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.","")]
		[r:if(and(json.get(LClass,"LRgr")>=3,json.get(RgrArchetype,"Hntr"),json.get(HuntersPrey,"HBrk")),"<br><b>Horde Breaker</b>: Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.","")]
		[r:if(and(json.get(LClass,"LRog")>=3,json.get(RogArchetype,"Swsh")==1),"<br><b>Fancy Footwork</b>: When you make a melee attack against a creature, you may slip away without reprisal. That creature cannot make opportunity attacks against you for the rest of your turn.","")]

		[r:if(json.get(Feats,"GreatWeaponMaster")==1,"<br><b>Great Weapons Master</b>: If you use a melee weapon to score a critical hit or reduce a creature to 0 hit points, you can make one melee weapon attack as a bonus action.","")]
		
		[r:if(and(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),or(roll1==1,roll2==1)),"<br><b>Halfling Luck</b>: You can reroll the 1 on your attack roll, and must use the new roll.","")]
		[r:if(and(Race=="Goblin",gFuryofSmall>0),"<br><b>Fury of the Small</b>: If the target is larger than you, you can deal <b>"+Level+"</b> extra damage.","")]

	</div>
</div>