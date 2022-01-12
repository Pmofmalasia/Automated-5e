[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:wName=json.get(json.get(Weapon,json.get(Weapon,1)),"Name")]
[h:wMagicBonus=json.get(json.get(Weapon,json.get(Weapon,1)),"MagicBonus")]
[h:wType=json.get(json.get(Weapon,json.get(Weapon,1)),"Type")]
[h:wDamageDie=json.get(json.get(Weapon,json.get(Weapon,1)),"DamageDie")]
[h:wDamageType=json.get(json.get(Weapon,json.get(Weapon,1)),"DamageType")]
[h:wSecDamageDie=json.get(json.get(Weapon,json.get(Weapon,1)),"SecDamageDie")]
[h:wSecDamageType=json.get(json.get(Weapon,json.get(Weapon,1)),"SecDamageType")]
[h:wRange=json.get(json.get(Weapon,json.get(Weapon,1)),"Range")]
[h:wCritRange=json.get(json.get(Weapon,json.get(Weapon,1)),"CritRange")]
[h:wCritMultiplier=json.get(json.get(Weapon,json.get(Weapon,1)),"CritMultiplier")]
[h:wSpecialAbility=json.get(json.get(Weapon,json.get(Weapon,1)),"SpecialAbility")]
[h:wProps=json.get(json.get(Weapon,json.get(Weapon,1)),"Props")]

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
[h:PrimeStat=if(MonkTest==1,max(json.get(AtrMods, "Dexterity"),json.get(AtrMods, "Strength")),PrimeStat)]

[h:wDieSize=number(substring(wDamageDie,indexOf(wDamageDie,"d")+1))]
[h:wSecDieSize=number(substring(wSecDamageDie,indexOf(wSecDamageDie,"d")+1))]

[h:MiscAttackBonus=if(json.get(FightingStyle,"Achy")==1,if(or(listFind(wProps,"Thrown")>-1,listFind(wProps,"Ammunition")>-1),2,0),0)]
[h:MiscDamageBonus=if(json.get(FightingStyle,"Duel")==1,if(and(listFind(wProps,"Thrown")==-1,listFind(wProps,"Ammunition")==-1),if(json.get(Weapon,1)==2,2,0),0),0)+if(and(json.get(LClass,"LBrb")>0,listFind(wProps,"Ammunition")==-1),RageDmg,0)]

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

<!-- no GWF test because it cant happen with an offhand weapon -->

[h:fCritRange=CritRange-wCritRange]
[h:fCritMultiplier=CritMultiplier+wCritMultiplier]
[h:CritDmgDie=(fCritMultiplier*number(substring(wDamageDie,0,indexOf(wDamageDie,"d"))))+substring(wDamageDie,indexOf(wDamageDie,"d"))]
[h:wSecDamageDiePlacehold = if(wSecDamageDie=="0","0d1",wSecDamageDie)]
[h:CritSecDmgDie=(fCritMultiplier*number(substring(wSecDamageDiePlacehold,0,indexOf(wSecDamageDiePlacehold,"d"))))+substring(wSecDamageDiePlacehold,indexOf(wSecDamageDiePlacehold,"d"))]

[h:wDamageDieNumber = number(substring(wDamageDie,0,1))]
[h:wSecDamageDieNumber = number(substring(wSecDamageDie,0,1))]

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
	[h:wCritDmg = 0]
	[h:wCritDmgString = ""]
	[h:wCritDmgArray = ""]
	[h:wSecDmg=0]
	[h:wSecDmgString = ""]
	[h:wSecDmgArray = ""]
	[h:wDmgCount = 0]
	[h:wCritSecDmg=0]
	[h:wCritSecDmgString = ""]
	[h:wCritSecDmgArray = ""]
	[h:wCritDmgCount = 0]
	[h:CritTest=0]
	<!-- If you would like to manually reroll your Great Weapons Fighting 1s and 2s remove the second temproll equals line from all count functions. Then change the text lower down to reflect that they were not rerolled. -->

	[h,count(wDamageDieNumber),CODE:{
		[h:tempRoll = eval("1d"+wDieSize)]
		[h:wDmg = wDmg + tempRoll]
		[h:wDmgArray = json.append(wDmgArray,tempRoll)]
		[h:wDmgString = wDmgString+" + "+json.get(wDmgArray,wDmgCount)]
		[h:wDmgCount = wDmgCount+1]
	}]

	[h:wDmgString = substring(wDmgString,3)]
	[h:wDmgCount = 0]

	[h,count(wDamageDieNumber+BrutalCrit),CODE:{
		[h:tempRoll = eval("1d"+wDieSize)]
		[h:wCritDmg = wCritDmg + tempRoll]
		[h:wCritDmgArray = json.append(wCritDmgArray,tempRoll)]
		[h:wCritDmgString = wCritDmgString+" + "+json.get(wCritDmgArray,wDmgCount)]
		[h:wDmgCount = wDmgCount+1]
	}]
	[h:wCritDmgString = substring(wCritDmgString,3)]

	[h,count(wSecDamageDieNumber),CODE:{
		[h:tempRoll = eval("1d"+wSecDieSize)]
		[h:wSecDmg = wSecDmg + tempRoll]
		[h:wSecDmgArray = json.append(wSecDmgArray,tempRoll)]
		[h:wSecDmgString = wSecDmgString+" + "+json.get(wSecDmgArray,roll.count)]
		[h:wSecDmgString = if(roll.count==(wSecDamageDieNumber-1),substring(wSecDmgString,3),wSecDmgString)]
	}]

	[h,count(wSecDamageDieNumber),CODE:{
		[h:tempRoll = eval("1d"+wSecDieSize)]
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

		<br><span style='font-size:1.5em;'>Damage: [r:wDmgString][r:if(or(json.get(FightingStyle,"2WFt")==1,and(json.get(LClass,"LMnk")>=1,wType=="Unarmed"))," + "+PrimeStat,"")][r:if(wMagicBonus==0,""," + "+wMagicBonus)][r:if(MiscDamageBonus==0,""," + "+MiscDamageBonus)][r:if(getState("Enlarge")," + "+Enlarge,"")][r:if(getState("Reduce")," - "+Reduce,"")] = <b>[r:if(or(json.get(FightingStyle,"2WFt")==1,and(json.get(LClass,"LMnk")>=1,wType=="Unarmed")),(wDmg+wMagicBonus+MiscDamageBonus+PrimeStat+if(getState("Enlarge"),Enlarge,0)-if(getState("Reduce"),Reduce,0)),(wDmg+wMagicBonus+MiscDamageBonus+if(getState("Enlarge"),Enlarge,0)-if(getState("Reduce"),Reduce,0)))]</b></br>

		<span style='color:AA2222;'>[r:If(Max(roll1,roll2)>=fCritRange," Crit: + "+wCritDmgString+if(getState("Enlarge")," + "+EnlargeCrit,"")+if(getState("Reduce")," - "+ReduceCrit,"")+" = ",'')]<b>[r:If(Max(roll1,roll2)>=fCritRange,if(or(json.get(FightingStyle,"2WFt")==1,and(json.get(LClass,"LMnk")>=1,wType=="Unarmed")),(wDmg+wCritDmg+wMagicBonus+MiscDamageBonus+PrimeStat+if(getState("Enlarge"),EnlargeCrit,0)-if(getState("Reduce"),ReduceCrit,0)),(wDmg+wCritDmg+wMagicBonus+MiscDamageBonus+if(getState("Enlarge"),EnlargeCrit,0)-if(getState("Reduce"),ReduceCrit,0))),'')]</b></span></span>
		
		[if(wSecDamageDie==0),code:{};{
			<br><span style='font-size:1.5em;'>{wSecDamageType} Damage: <b>[r:wSecDmgString][r:if(wSecDamageDieNumber>1," = "+wSecDmg,"")]</b></br>

			<span style='color:AA2222;'>[r:If(Max(roll1,roll2)>=fCritRange,' Crit: + ','')]<b>[r:If(Max(roll1,roll2)>=fCritRange,wCritSecDmgString,'')]</b></span></span><br>
		}]
		[r:if(wRange==0,"","<br><b>Range:</b> "+wRange+"")]
		[r:if(wSpecialAbility=="","","<br>"+wSpecialAbility)]
		[r:if(or(json.get(FightingStyle,"2WFt")==1,and(json.get(LClass,"LMnk")>=1,wType=="Unarmed")),"","<br>If you only attacked with your off-hand and not your main hand, add <b>"+PrimeStat+"</b> damage.")]
		
		[r:if(getState("Bless"),"<br><b>Blessed:</b> Add 1d4 to your attack roll:<span style='font-size:1.5em;'> "+1d4+"</span>","")]
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
		
		[h:DivineFury = 1d6]
		[h:DivineFuryCrit = 1d6]
		
		[r:if(and(getState("Rage"),json.get(LClass,"LBrb")>=3,json.get(BrbPath,"Zlot")==1),"<br><b>Divine Fury</b>: Extra radiant or necrotic damage to the first creature you hit this turn: "+DivineFury+" + "+floor(json.get(LClass,"LBrb")/2)+" = <span style='font-size:1.5em;'>"+(DivineFury+floor(json.get(LClass,"LBrb")/2))+"</span><span style='color:AA2222; font-size:1.5em;'>"+if(CritTest>0," Crit: + "+DivineFuryCrit,"")+"</span>","")]
		
		[h:ColossusSlayer = 1d8]
		[h:ColossusSlayerCrit = 1d8]
		
		[r:if(and(json.get(LClass,"LRgr")>=3,json.get(RgrArchetype,"Hntr")==1,json.get(HuntersPrey,"CSlr")==1),"<br><b>Colossus Slayer</b>: Once per turn, you deal an extra 1d8 damage to targets below their hit point maximum: <span style='font-size:1.5em;'>"+ColossusSlayer+"</span><span style='color:AA2222; font-size:1.5em;'>"+if(CritTest>0," Crit: + "+ColossusSlayerCrit,"")+"</span>","")]

		[h:ImprovedSmite = 1d8]
		[h:ImprovedSmiteCrit = 1d8]
		
		[r:if(and(json.get(LClass,"LPdn")>=11,listFind(wProps,"Ammunition")==-1),"<br><b>Improved Divine Smite</b>: You deal an extra 1d8 radiant damage: <span style='color:orange; font-size:1.5em;'>"+ImprovedSmite+"</span><span style='color:AA2222; font-size:1.5em;'>"+if(Max(roll1,roll2)>=fCritRange," Crit: + "+ImprovedSmiteCrit,"")+"</span>","")]
		
		[r:if(and(json.get(LClass,"LBrd")==3,json.get(BrdCollege,"Swds")==1),"<br><b>Blade Flourish</b>: If this attack was made as part of a full Attack action, your walking speed increases by 10 feet until the end of turn. If a weapon attack that you make as part of this action hits a creature, you can use a Blade Flourish option of your choice.","")]
			[r:if(or(wDamageType=="Lightning",wSecDamageType=="Lightning"),if(json.get(LClass,"LClc")>=6,if(json.get(ClcDomain,"Tmpt")==1,"<br><b>Thunderbolt Strike</b>: When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.",""),""),"")]
		[r:if(and(json.get(LClass,"LFtr")>=10,json.get(FtrArchetype,"ErKn")==1),"<br><b>Eldritch Strike</b>: When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.","")]
		[r:if(and(wType=="Unarmed",json.get(LClass,"LMnk")>=6),"<br><b>Ki-Empowered Strikes</b>: Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.","")]
		[r:if(and(json.get(LClass,"LRgr")>=3,json.get(RgrArchetype,"Hntr"),json.get(HuntersPrey,"HBrk")),"<br><b>Horde Breaker</b>: Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.","")]	
		[r:if(and(json.get(LClass,"LRog")>=3,json.get(RogArchetype,"Swsh")==1),"<br><b>Fancy Footwork</b>: When you make a melee attack against a creature, you may slip away without reprisal. That creature cannot make opportunity attacks against you for the rest of your turn.<br>","")]

		[r:if(json.get(Feats,"GreatWeaponMaster")==1,"<br><b>Great Weapons Master</b>: If you use a melee weapon to score a critical hit or reduce a creature to 0 hit points, you can make one melee weapon attack as a bonus action.","")]
		
		[r:if(and(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),or(roll1==1,roll2==1)),"<br><b>Halfling Luck</b>: You can reroll the 1 on your attack roll, and must use the new roll.","")]
		[r:if(and(Race=="Goblin",gFuryofSmall>0),"<b>Fury of the Small</b>: If the target is larger than you, you can deal <b>"+Level+"</b> extra damage.","")]
		
	</div>
</div>