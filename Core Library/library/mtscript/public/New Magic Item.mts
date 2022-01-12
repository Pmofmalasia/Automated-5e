[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h: listDamageTypes="None,Slashing,Piercing,Bludgeoning,Acid,Cold,Fire,Force,Lightning,Necrotic,Poison,Psychic,Radiant,Thunder"]
[h: listDamageDieNumber="0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30"]
[h: listDamageDieSize="0,1,2,4,6,8,10,12"]
[h: listPrimaryStat="Strength,Dexterity,Constitution,Intelligence,Wisdom,Charisma"]
[h: listCharges="1,2,3,4,5"]
[h: listSpellLevel="0,1,2,3,4,5,6,7,8,9"]
[h: listStatBonus="-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10"]
[h: listRechargeTime="Short Rest,Long Rest"]
[h: listLegendary="No,Yes"]
[h: listButtonColor="maroon,black,gray,red,orange,yellow,green,blue,purple"]
[h: listFontColor="black,white,red,yellow,blue"]
[h: listCastTime="Action,BONUS,REACTION,1 MIN,10 MIN,1 HOUR,Custom"]
[h:ProfList = "No,Proficiency,Expertise,Proficiency (No Stacking)"]
[h:SaveDC="0"]
[h:ChargeTime=""]
[h:AbCharges="0"]
[h:SaveDC="0"]
[h:SaveType="None"]
[h:PrimeStat="None"]
[h:DmgType=""]
[h:DmgDieNumber="0"]
[h:DmgDieSize="0"]
[h:DmgType2=""]
[h:DmgDie2Number="0"]
[h:DmgDie2Size="0"]
[h:CastTime=""]

[h: ItemEffects=input(
	"iName | Name | Item Name || WIDTH=20",
	"AbilityActive | Constant,Activated | Are the effects always active or must be activated? | LIST | SELECT=0",
	"IsAttunement |  | Requires Attunement | Check ",
	"IsEquipment | Always Equipped,Weapon,Armor,Shield,Other | Equipment Type (Other for Hats, Cloaks, Etc.) | LIST ",
	"IsCastingFocus |  | Acts as a Spellcasting Focus | Check ",
	"IsCharges |  | Limited Number of Charges | Check ")]
	[h:abort(ItemEffects)]

	[h:EquipmentData=json.set("","Flavor",Flavor,"ParentToken",ParentToken,"ItemName",iName,"MagicItem",1)]

	[h,if(IsEquipment==1),CODE:{
		[MACRO("Add Weapon@Lib:pm.a5e.Core"):EquipmentData]
	};{}]
	
	[h,if(IsEquipment==2),CODE:{
		[MACRO("Add Armor@Lib:pm.a5e.Core"):EquipmentData]
	};{}]
	
	[h,if(IsEquipment==3),CODE:{
		[MACRO("Add Shield@Lib:pm.a5e.Core"):EquipmentData]
	};{}]

	[h:disIsEquipment=if(IsEquipment=="Weapon","junkVar|Only Enter Properties Not Covered by the Weapon Attack||LABEL|SPAN=TRUE","")]
	[h:disIsEquipmentBars=if(IsEquipment=="Weapon","junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE","")]

	<!-- Add preventing death at 0 HP (with HP to remain at and number of times to stay up), messages when taking damage, activation at certain HP threshholds, add vision types, add whether the weapon/spell must meet all conditions listed or only one of the conditions listed -->
	
	[h:ItemEffects2=input(
	""+disIsEquipment+"",
	""+disIsEquipmentBars+"",
	"IsAttribute |  | Grants Main Attribute Bonus | Check ",
	"IsSaveEffects |  | Affects Saves | Check ",
	"IsCheckEffects |  | Affects Checks | Check ",
	"IsInitEffects |  | Affects Initiative | Check ",
	"IsDeathEffects |  | Affects Death Saves | Check ",
	"IsConcEffects |  | Affects Concentration Saves | Check ",	"junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsVuln |  | Grants Damage Vulnerability | Check ",
	"IsRes |  | Grants Damage Resistance | Check ",
	"IsImmun |  | Grants Damage Immunity | Check ",
	"IsAbsorb |  | Grants Damage Absorption | Check ",
	"IsDR |  | Grants Damage Reduction | Check ",
	"IsCondImmun |  | Grants Immunity to a Condition | Check ",
	"IsMaxHP |  | Grants Maximum HP Bonus | Check ",
	"IsAC |  | Grants AC Bonus | Check ",
	"IsSpeed |  | Grants Speed Bonus | Check ",
	"IsSpeedSpec |  | Grants Special Movement Type or Speed Bonus | Check ",	"junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsCantrips |  | Affects Cantrips | Check ",
	"IsCantripsTypeDependent |  | If Yes, Is it Dependent on the Damage Type Done? | Check ",
	"IsCantripsSchoolDependent |  | If Yes to First, Is it Dependent on the Spell School? | Check ",	"junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsSpell |  | Affects Leveled Spells | Check ",
	"IsSpellTypeDependent |  | If Yes, Is it Dependent on the Damage Type Done? | Check ",
	"IsSpellSchoolDependent |  | If Yes to First, Is it Dependent on the Spell School? | Check ",
	"junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsWeaponEffect |  | Affects Weapon Attacks | Check ",	"junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsWeaponProf |  | Grants Weapon Proficiency | Check ",
	"IsArmorProf |  | Grants Armor Proficiency | Check ",	"junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsSpellCast |  | Casts a Spell | Check ",
	"IsClass |  | Grants Class Ability | Check ",
	"IsFeat |  | Grants Feat | Check ",
	"IsRacial |  | Grants Racial Feature | Check ",	"junkVar|------------------------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsAbility |  | Has an Independent Ability or Anything Not Covered by the Above |CHECK"
	)]
[h: abort(ItemEffects2)]

[h:AttunementData=json.set("","reqAttunement",IsAttunement,"slotAttunement",0)]
[h:ActivationData=json.set("","reqActive",AbilityActive,"isActive",0)]
[h:EquipData=json.set("","reqEquip",IsEquipment,"isEquipped",0,"CastingFocus",IsCastingFocus)]

[h:numCharges=0]
[h:rechargePeriod=""]
[h:rechargeHow=""]
[h:rechargeDays=1]

[h:disIsCharges=if(IsCharges,"junkVar|Information about Item Charges||LABEL|SPAN=TRUE","")]
[h:disnumCharges=if(IsCharges,"numCharges|"+listDamageDieNumber+"| Maximum Charges | LIST | SELECT=1","")]
[h:disrechargeHow=if(IsCharges,"rechargeHow| Fully Restored,Roll For Charges,Set Number | How are Charges Restored | LIST | SELECT=0 VALUE=STRING","")]
[h:disrechargePeriod=if(IsCharges,"rechargePeriod| After Combat,Short Rest,Long Rest,Multiple Days,Does Not Recharge | When Does it Recharge | LIST | SELECT=1","")]
[h:disrechargeDays=if(IsCharges,"rechargeDays|"+listDamageDieNumber+",31,32,33,34,35,36,37,38,39,40| How Many Days to Recharge | LIST | SELECT=1","")]

[h:ChargeChoice=input(
	""+disIsCharges+"",
	""+disnumCharges+"",
	""+disrechargePeriod+"",
	""+disrechargeHow+"",
	""+disrechargeDays+""
	)]
[h:abort(ChargeChoice)]

[h:rechargeNum=0]
[h:rechargeRollNum=0]
[h:rechargeRollSize=1]

[h:disIsrechargeRoll=if(or(rechargeHow=="Set Number",rechargeHow=="Roll For Charges"),"junkVar|Item Recharge Information||LABEL|SPAN=TRUE","")]
[h:disrechargeNum=if(or(rechargeHow=="Set Number",rechargeHow=="Roll For Charges"),"rechargeNum | 1,2,3,4,5,6,7,8,9,10 | Flat Number of Charges Restored | LIST | VALUE=STRING","")]
[h:disrechargeRollNum=if(rechargeHow=="Roll For Charges","rechargeRollNum | 1,2,3,4,5,6,7,8,9,10 | Recharge Roll Number of Dice | LIST | VALUE=STRING","")]
[h:disrechargeRollSize=if(rechargeHow=="Roll For Charges","rechargeRollSize | "+listDamageDieSize+" | Recharge Roll Die Size | LIST | Value=STRING","")]

[h:ChargeRollChoice=input(
	""+disIsrechargeRoll+"",
	""+disrechargeRollNum+"",
	""+disrechargeRollSize+"",
	""+disrechargeNum+""
	)]
[h:abort(ChargeRollChoice)]

[h:ChargesData=json.set("",
	"ReqCharge",IsCharges,
	"MaxCharge",numCharges,
	"WhenCharge",rechargePeriod,
	"HowCharge",rechargeHow,
	"DaysCharge",rechargeDays,
	"RechargeRollNum",rechargeRollNum,
	"RechargeRollSize",rechargeRollSize,
	"RechargeFlatGain",rechargeNum
	)]

[h:disIsAttributeBonus=if(IsAttribute,"junkVar|Information about Attributes||LABEL|SPAN=TRUE","")]

[h:disStrBonus=if(IsAttribute,"StrBonus| "+listStatBonus+" | Bonus to Strength Score | LIST | VALUE=STRING SELECT=10","")]
[h:disDexBonus=if(IsAttribute,"DexBonus| "+listStatBonus+" | Bonus to Dexterity Score | LIST | VALUE=STRING SELECT=10","")]
[h:disConBonus=if(IsAttribute,"ConBonus| "+listStatBonus+" | Bonus to Constitution Score | LIST | VALUE=STRING SELECT=10","")]
[h:disIntBonus=if(IsAttribute,"IntBonus| "+listStatBonus+" | Bonus to Intelligence Score | LIST | VALUE=STRING SELECT=10","")]
[h:disWisBonus=if(IsAttribute,"WisBonus| "+listStatBonus+" | Bonus to Wisdom Score | LIST | VALUE=STRING SELECT=10","")]
[h:disChaBonus=if(IsAttribute,"ChaBonus| "+listStatBonus+" | Bonus to Charisma Score | LIST | VALUE=STRING SELECT=10","")]

[h:disStrSet=if(IsAttribute,"StrSet| "+listDamageDieNumber+" | Sets Strength Score | LIST | VALUE=STRING","")]
[h:disDexSet=if(IsAttribute,"DexSet| "+listDamageDieNumber+" | Sets Dexterity Score | LIST | VALUE=STRING","")]
[h:disConSet=if(IsAttribute,"ConSet| "+listDamageDieNumber+" | Sets Constitution Score | LIST | VALUE=STRING","")]
[h:disIntSet=if(IsAttribute,"IntSet| "+listDamageDieNumber+" | Sets Intelligence Score | LIST | VALUE=STRING","")]
[h:disWisSet=if(IsAttribute,"WisSet| "+listDamageDieNumber+" | Sets Wisdom Score | LIST | VALUE=STRING","")]
[h:disChaSet=if(IsAttribute,"ChaSet| "+listDamageDieNumber+" | Sets Charisma Score | LIST | VALUE=STRING","")]

[h:disStrSetOverride=if(IsAttribute,"StrSetOverride| N/A,"+listDamageDieNumber+" | Sets Strength Score - Overrides Higher Scores | LIST | ","")]
[h:disDexSetOverride=if(IsAttribute,"DexSetOverride| N/A,"+listDamageDieNumber+" | Sets Dexterity Score - Overrides Higher Scores | LIST | ","")]
[h:disConSetOverride=if(IsAttribute,"ConSetOverride| N/A,"+listDamageDieNumber+" | Sets Constitution Score - Overrides Higher Scores | LIST | ","")]
[h:disIntSetOverride=if(IsAttribute,"IntSetOverride| N/A,"+listDamageDieNumber+" | Sets Intelligence Score - Overrides Higher Scores | LIST | ","")]
[h:disWisSetOverride=if(IsAttribute,"WisSetOverride| N/A,"+listDamageDieNumber+" | Sets Wisdom Score - Overrides Higher Scores | LIST | ","")]
[h:disChaSetOverride=if(IsAttribute,"ChaSetOverride| N/A,"+listDamageDieNumber+" | Sets Charisma Score - Overrides Higher Scores | LIST | ","")]

    [h:StrBonus=0]
    [h:DexBonus=0]
    [h:ConBonus=0]
    [h:IntBonus=0]
    [h:WisBonus=0]
    [h:ChaBonus=0]
    [h:StrSet=0]
    [h:DexSet=0]
    [h:ConSet=0]
    [h:IntSet=0]
    [h:WisSet=0]
    [h:ChaSet=0]
    [h:StrSetOverride=0]
    [h:DexSetOverride=0]
    [h:ConSetOverride=0]
    [h:IntSetOverride=0]
    [h:WisSetOverride=0]
    [h:ChaSetOverride=0]

[h: AttributeSelect=input(
	""+disIsAttributeBonus+"",
	""+disStrBonus+"",
	""+disDexBonus+"",
	""+disConBonus+"",
	""+disIntBonus+"",
	""+disWisBonus+"",
	""+disChaBonus+"",
	""+disStrSet+"",
	""+disDexSet+"",
	""+disConSet+"",
	""+disIntSet+"",
	""+disWisSet+"",
	""+disChaSet+"",
	""+disStrSetOverride+"",
	""+disDexSetOverride+"",
	""+disConSetOverride+"",
	""+disIntSetOverride+"",
	""+disWisSetOverride+"",
	""+disChaSetOverride+""
	)]
	[h:abort(AttributeSelect)]

    [h:StrSetOverride=StrSetOverride-1]
    [h:DexSetOverride=DexSetOverride-1]
    [h:ConSetOverride=ConSetOverride-1]
    [h:IntSetOverride=IntSetOverride-1]
    [h:WisSetOverride=WisSetOverride-1]
    [h:ChaSetOverride=ChaSetOverride-1]

[h:AttributeData=json.set("",
    "StrBonus",StrBonus,
    "DexBonus",DexBonus,
    "ConBonus",ConBonus,
    "IntBonus",IntBonus,
    "WisBonus",WisBonus,
    "ChaBonus",ChaBonus,
    "StrSet",StrSet,
    "DexSet",DexSet,
    "ConSet",ConSet,
    "IntSet",IntSet,
    "WisSet",WisSet,
    "ChaSet",ChaSet,
    "StrSetOverride",StrSetOverride,
    "DexSetOverride",DexSetOverride,
    "ConSetOverride",ConSetOverride,
    "IntSetOverride",IntSetOverride,
    "WisSetOverride",WisSetOverride,
    "ChaSetOverride",ChaSetOverride
    )]
    
[h:disIsSaveAdv=if(IsSaveEffects,"IsSaveAdv |  | Grants Advantage on Saves | Check ","")]
[h:disIsSaveDis=if(IsSaveEffects,"IsSaveDis |  | Grants Disadvantage on Saves | Check ","")]
[h:disIsSaveBonus=if(IsSaveEffects,"IsSaveBonus |  | Grants Numerical Bonus to Saves | Check ","")]
[h:disIsSaveProf=if(IsSaveEffects,"IsSaveProf |  | Grants Proficiency in Saves | Check ","")]
[h:disIsSaveMessage=if(IsSaveEffects,"IsSaveMessage |  | Message Occurs after Saves | Check ","")]
[h:IsSaveAdv=0]
[h:IsSaveDis=0]
[h:IsSaveBonus=0]
[h:IsSaveProf=0]
[h:IsSaveMessage=0]

[h:SaveInput=input(
	""+disIsSaveAdv+"",
	""+disIsSaveDis+"",
	""+disIsSaveBonus+"",
	""+disIsSaveProf+"",
	""+disIsSaveMessage+""
	)]
	[h:abort(SaveInput)]

[h:disIsSaveBonus=if(or(IsSaveAdv,IsSaveDis,IsSaveBonus,IsSaveProf,IsSaveMessage),"junkVar|Information about Saves||LABEL|SPAN=TRUE","")]

[h:disStrSaveAdv=if(IsSaveAdv,"StrSaveAdv| | Advantage on Strength Saves | CHECK","")]
[h:disDexSaveAdv=if(IsSaveAdv,"DexSaveAdv| | Advantage on Dexterity Saves | CHECK","")]
[h:disConSaveAdv=if(IsSaveAdv,"ConSaveAdv| | Advantage on Constitution Saves | CHECK","")]
[h:disIntSaveAdv=if(IsSaveAdv,"IntSaveAdv| | Advantage on Intelligence Saves | CHECK","")]
[h:disWisSaveAdv=if(IsSaveAdv,"WisSaveAdv| | Advantage on Wisdom Saves | CHECK","")]
[h:disChaSaveAdv=if(IsSaveAdv,"ChaSaveAdv| | Advantage on Charisma Saves | CHECK","")]

[h:disStrSaveDis=if(IsSaveDis,"StrSaveDis| | Disadvantage on Strength Saves | CHECK","")]
[h:disDexSaveDis=if(IsSaveDis,"DexSaveDis| | Disadvantage on Dexterity Saves | CHECK","")]
[h:disConSaveDis=if(IsSaveDis,"ConSaveDis| | Disadvantage on Constitution Saves | CHECK","")]
[h:disIntSaveDis=if(IsSaveDis,"IntSaveDis| | Disadvantage on Intelligence Saves | CHECK","")]
[h:disWisSaveDis=if(IsSaveDis,"WisSaveDis| | Disadvantage on Wisdom Saves | CHECK","")]
[h:disChaSaveDis=if(IsSaveDis,"ChaSaveDis| | Disadvantage on Charisma Saves | CHECK","")]

[h:disStrSaveBonus=if(IsSaveBonus,"StrSaveBonus| "+listStatBonus+" | Bonus to Strength Saves | LIST | VALUE=STRING SELECT=10","")]
[h:disDexSaveBonus=if(IsSaveBonus,"DexSaveBonus| "+listStatBonus+" | Bonus to Dexterity Saves | LIST | VALUE=STRING SELECT=10","")]
[h:disConSaveBonus=if(IsSaveBonus,"ConSaveBonus| "+listStatBonus+" | Bonus to Constitution Saves | LIST | VALUE=STRING SELECT=10","")]
[h:disIntSaveBonus=if(IsSaveBonus,"IntSaveBonus| "+listStatBonus+" | Bonus to Intelligence Saves | LIST | VALUE=STRING SELECT=10","")]
[h:disWisSaveBonus=if(IsSaveBonus,"WisSaveBonus| "+listStatBonus+" | Bonus to Wisdom Saves | LIST | VALUE=STRING SELECT=10","")]
[h:disChaSaveBonus=if(IsSaveBonus,"ChaSaveBonus| "+listStatBonus+" | Bonus to Charisma Saves | LIST | VALUE=STRING SELECT=10","")]

[h:disStrSaveProf=if(IsSaveProf,"StrSaveProf| "+ProfList+" | Proficiency in Strength Saves | LIST","")]
[h:disDexSaveProf=if(IsSaveProf,"DexSaveProf| "+ProfList+" | Proficiency in Dexterity Saves | LIST","")]
[h:disConSaveProf=if(IsSaveProf,"ConSaveProf| "+ProfList+" | Proficiency in Constitution Saves | LIST","")]
[h:disIntSaveProf=if(IsSaveProf,"IntSaveProf| "+ProfList+" | Proficiency in Intelligence Saves | LIST","")]
[h:disWisSaveProf=if(IsSaveProf,"WisSaveProf| "+ProfList+" | Proficiency in Wisdom Saves | LIST","")]
[h:disChaSaveProf=if(IsSaveProf,"ChaSaveProf| "+ProfList+" | Proficiency in Charisma Saves | LIST","")]

[h:disStrSaveMessage=if(IsSaveMessage,"StrSaveMessage| | Message Displayed After Strength Saves ","")]
[h:disDexSaveMessage=if(IsSaveMessage,"DexSaveMessage| | Message Displayed After Dexterity Saves ","")]
[h:disConSaveMessage=if(IsSaveMessage,"ConSaveMessage| | Message Displayed After Constitution Saves ","")]
[h:disIntSaveMessage=if(IsSaveMessage,"IntSaveMessage| | Message Displayed After Intelligence Saves ","")]
[h:disWisSaveMessage=if(IsSaveMessage,"WisSaveMessage| | Message Displayed After Wisdom Saves ","")]
[h:disChaSaveMessage=if(IsSaveMessage,"ChaSaveMessage| | Message Displayed After Charisma Saves ","")]

    [h:StrSaveAdv=0]
    [h:DexSaveAdv=0]
    [h:ConSaveAdv=0]
    [h:IntSaveAdv=0]
    [h:WisSaveAdv=0]
    [h:ChaSaveAdv=0]
    [h:StrSaveDis=0]
    [h:DexSaveDis=0]
    [h:ConSaveDis=0]
    [h:IntSaveDis=0]
    [h:WisSaveDis=0]
    [h:ChaSaveDis=0]
    [h:StrSaveBonus=0]
    [h:DexSaveBonus=0]
    [h:ConSaveBonus=0]
    [h:IntSaveBonus=0]
    [h:WisSaveBonus=0]
    [h:ChaSaveBonus=0]
    [h:StrSaveProf=0]
    [h:DexSaveProf=0]
    [h:ConSaveProf=0]
    [h:IntSaveProf=0]
    [h:WisSaveProf=0]
    [h:ChaSaveProf=0]
    [h:StrSaveMessage="0"]
    [h:DexSaveMessage="0"]
    [h:ConSaveMessage="0"]
    [h:IntSaveMessage="0"]
    [h:WisSaveMessage="0"]
    [h:ChaSaveMessage="0"]

[h: SavesSelect = input(
	""+disIsSaveBonus+"",
	""+disStrSaveAdv+"",
	""+disDexSaveAdv+"",
	""+disConSaveAdv+"",
	""+disIntSaveAdv+"",
	""+disWisSaveAdv+"",
	""+disChaSaveAdv+"",
	""+disStrSaveDis+"",
	""+disDexSaveDis+"",
	""+disConSaveDis+"",
	""+disIntSaveDis+"",
	""+disWisSaveDis+"",
	""+disChaSaveDis+"",
	""+disStrSaveBonus+"",
	""+disDexSaveBonus+"",
	""+disConSaveBonus+"",
	""+disIntSaveBonus+"",
	""+disWisSaveBonus+"",
	""+disChaSaveBonus+"",
	""+disStrSaveProf+"",
	""+disDexSaveProf+"",
	""+disConSaveProf+"",
	""+disIntSaveProf+"",
	""+disWisSaveProf+"",
	""+disChaSaveProf+"",
	""+disStrSaveMessage+"",
	""+disDexSaveMessage+"",
	""+disConSaveMessage+"",
	""+disIntSaveMessage+"",
	""+disWisSaveMessage+"",
	""+disChaSaveMessage+""
	)]
	[h:abort(SavesSelect)]

	[h:StrSaveMessage="<br>&#8226; <b>"+iName+":</b> "+StrSaveMessage]
	[h:DexSaveMessage="<br>&#8226; <b>"+iName+":</b> "+DexSaveMessage]
	[h:ConSaveMessage="<br>&#8226; <b>"+iName+":</b> "+ConSaveMessage]
	[h:IntSaveMessage="<br>&#8226; <b>"+iName+":</b> "+IntSaveMessage]
	[h:WisSaveMessage="<br>&#8226; <b>"+iName+":</b> "+WisSaveMessage]
	[h:ChaSaveMessage="<br>&#8226; <b>"+iName+":</b> "+ChaSaveMessage]
	
[h:SaveData=json.set("",
    "StrSaveAdv",StrSaveAdv,
    "DexSaveAdv",DexSaveAdv,
    "ConSaveAdv",ConSaveAdv,
    "IntSaveAdv",IntSaveAdv,
    "WisSaveAdv",WisSaveAdv,
    "ChaSaveAdv",ChaSaveAdv,
    "StrSaveDis",StrSaveDis,
    "DexSaveDis",DexSaveDis,
    "ConSaveDis",ConSaveDis,
    "IntSaveDis",IntSaveDis,
    "WisSaveDis",WisSaveDis,
    "ChaSaveDis",ChaSaveDis,
    "StrSaveBonus",StrSaveBonus,
    "DexSaveBonus",DexSaveBonus,
    "ConSaveBonus",ConSaveBonus,
    "IntSaveBonus",IntSaveBonus,
    "WisSaveBonus",WisSaveBonus,
    "ChaSaveBonus",ChaSaveBonus,
    "StrSaveProf",StrSaveProf,
    "DexSaveProf",DexSaveProf,
    "ConSaveProf",ConSaveProf,
    "IntSaveProf",IntSaveProf,
    "WisSaveProf",WisSaveProf,
    "ChaSaveProf",ChaSaveProf,
    "StrSaveMessage",StrSaveMessage,
    "DexSaveMessage",DexSaveMessage,
    "ConSaveMessage",ConSaveMessage,
    "IntSaveMessage",IntSaveMessage,
    "WisSaveMessage",WisSaveMessage,
    "ChaSaveMessage",ChaSaveMessage
    )]

[h:disIsCheckAdv=if(IsCheckEffects,"IsCheckAdv |  | Grants Advantage on Checks | Check ","")]
[h:disIsCheckDis=if(IsCheckEffects,"IsCheckDis |  | Grants Disadvantage on Checks | Check ","")]
[h:disIsCheckBonus=if(IsCheckEffects,"IsCheckBonus |  | Grants Numerical Bonus to Checks | Check ","")]
[h:disIsCheckProf=if(IsCheckEffects,"IsCheckProf |  | Grants Proficiency in Checks | Check ","")]
[h:disIsCheckMessage=if(IsCheckEffects,"IsCheckMessage |  | Message Occurs after Checks | Check ","")]
[h:IsCheckAdv=0]
[h:IsCheckDis=0]
[h:IsCheckBonus=0]
[h:IsCheckProf=0]
[h:IsCheckMessage=0]

[h:CheckInput=input(
	""+disIsCheckAdv+"",
	""+disIsCheckDis+"",
	""+disIsCheckBonus+"",
	""+disIsCheckProf+"",
	""+disIsCheckMessage+""
	)]
	[h:abort(CheckInput)]

[h:disIsCheckBonus=if(or(IsCheckAdv,IsCheckDis,IsCheckBonus,IsCheckProf,IsCheckMessage),"junkVar|Information about Checks||LABEL|SPAN=TRUE","")]

[h:disStrCheckAdv=if(IsCheckAdv,"StrCheckAdv| | Advantage on Strength Checks | CHECK","")]
[h:disDexCheckAdv=if(IsCheckAdv,"DexCheckAdv| | Advantage on Dexterity Checks | CHECK","")]
[h:disConCheckAdv=if(IsCheckAdv,"ConCheckAdv| | Advantage on Constitution Checks | CHECK","")]
[h:disIntCheckAdv=if(IsCheckAdv,"IntCheckAdv| | Advantage on Intelligence Checks | CHECK","")]
[h:disWisCheckAdv=if(IsCheckAdv,"WisCheckAdv| | Advantage on Wisdom Checks | CHECK","")]
[h:disChaCheckAdv=if(IsCheckAdv,"ChaCheckAdv| | Advantage on Charisma Checks | CHECK","")]
[h:disAcbCheckAdv=if(IsCheckAdv,"AcbCheckAdv| | Advantage on Acrobatics Checks | CHECK","")]
[h:disAnHCheckAdv=if(IsCheckAdv,"AnHCheckAdv| | Advantage on Animal Handling Checks | CHECK","")]
[h:disArcCheckAdv=if(IsCheckAdv,"ArcCheckAdv| | Advantage on Arcana Checks | CHECK","")]
[h:disAthCheckAdv=if(IsCheckAdv,"AthCheckAdv| | Advantage on Athletics Checks | CHECK","")]
[h:disDcpCheckAdv=if(IsCheckAdv,"DcpCheckAdv| | Advantage on Deception Checks | CHECK","")]
[h:disHstCheckAdv=if(IsCheckAdv,"HstCheckAdv| | Advantage on History Checks | CHECK","")]
[h:disInsCheckAdv=if(IsCheckAdv,"InsCheckAdv| | Advantage on Insight Checks | CHECK","")]
[h:disImdCheckAdv=if(IsCheckAdv,"ImdCheckAdv| | Advantage on Intimidation Checks | CHECK","")]
[h:disInvCheckAdv=if(IsCheckAdv,"InvCheckAdv| | Advantage on Investigation Checks | CHECK","")]
[h:disMedCheckAdv=if(IsCheckAdv,"MedCheckAdv| | Advantage on Medicine Checks | CHECK","")]
[h:disNtrCheckAdv=if(IsCheckAdv,"NtrCheckAdv| | Advantage on Nature Checks | CHECK","")]
[h:disPcpCheckAdv=if(IsCheckAdv,"PcpCheckAdv| | Advantage on Perception Checks | CHECK","")]
[h:disPfmCheckAdv=if(IsCheckAdv,"PfmCheckAdv| | Advantage on Performance Checks | CHECK","")]
[h:disPrsCheckAdv=if(IsCheckAdv,"PrsCheckAdv| | Advantage on Persuasion Checks | CHECK","")]
[h:disRlgCheckAdv=if(IsCheckAdv,"RlgCheckAdv| | Advantage on Religion Checks | CHECK","")]
[h:disSoHCheckAdv=if(IsCheckAdv,"SoHCheckAdv| | Advantage on Sleight of Hand Checks | CHECK","")]
[h:disStlCheckAdv=if(IsCheckAdv,"StlCheckAdv| | Advantage on Stealth Checks | CHECK","")]
[h:disSrvCheckAdv=if(IsCheckAdv,"SrvCheckAdv| | Advantage on Survival Checks | CHECK","")]

[h:disStrCheckDis=if(IsCheckDis,"StrCheckDis| | Disadvantage on Strength Checks | CHECK","")]
[h:disDexCheckDis=if(IsCheckDis,"DexCheckDis| | Disadvantage on Dexterity Checks | CHECK","")]
[h:disConCheckDis=if(IsCheckDis,"ConCheckDis| | Disadvantage on Constitution Checks | CHECK","")]
[h:disIntCheckDis=if(IsCheckDis,"IntCheckDis| | Disadvantage on Intelligence Checks | CHECK","")]
[h:disWisCheckDis=if(IsCheckDis,"WisCheckDis| | Disadvantage on Wisdom Checks | CHECK","")]
[h:disChaCheckDis=if(IsCheckDis,"ChaCheckDis| | Disadvantage on Charisma Checks | CHECK","")]
[h:disAcbCheckDis=if(IsCheckDis,"AcbCheckDis| | Disadvantage on Acrobatics Checks | CHECK","")]
[h:disAnHCheckDis=if(IsCheckDis,"AnHCheckDis| | Disadvantage on Animal Handling Checks | CHECK","")]
[h:disArcCheckDis=if(IsCheckDis,"ArcCheckDis| | Disadvantage on Arcana Checks | CHECK","")]
[h:disAthCheckDis=if(IsCheckDis,"AthCheckDis| | Disadvantage on Athletics Checks | CHECK","")]
[h:disDcpCheckDis=if(IsCheckDis,"DcpCheckDis| | Disadvantage on Deception Checks | CHECK","")]
[h:disHstCheckDis=if(IsCheckDis,"HstCheckDis| | Disadvantage on History Checks | CHECK","")]
[h:disInsCheckDis=if(IsCheckDis,"InsCheckDis| | Disadvantage on Insight Checks | CHECK","")]
[h:disImdCheckDis=if(IsCheckDis,"ImdCheckDis| | Disadvantage on Intimidation Checks | CHECK","")]
[h:disInvCheckDis=if(IsCheckDis,"InvCheckDis| | Disadvantage on Investigation Checks | CHECK","")]
[h:disMedCheckDis=if(IsCheckDis,"MedCheckDis| | Disadvantage on Medicine Checks | CHECK","")]
[h:disNtrCheckDis=if(IsCheckDis,"NtrCheckDis| | Disadvantage on Nature Checks | CHECK","")]
[h:disPcpCheckDis=if(IsCheckDis,"PcpCheckDis| | Disadvantage on Perception Checks | CHECK","")]
[h:disPfmCheckDis=if(IsCheckDis,"PfmCheckDis| | Disadvantage on Performance Checks | CHECK","")]
[h:disPrsCheckDis=if(IsCheckDis,"PrsCheckDis| | Disadvantage on Persuasion Checks | CHECK","")]
[h:disRlgCheckDis=if(IsCheckDis,"RlgCheckDis| | Disadvantage on Religion Checks | CHECK","")]
[h:disSoHCheckDis=if(IsCheckDis,"SoHCheckDis| | Disadvantage on Sleight of Hand Checks | CHECK","")]
[h:disStlCheckDis=if(IsCheckDis,"StlCheckDis| | Disadvantage on Stealth Checks | CHECK","")]
[h:disSrvCheckDis=if(IsCheckDis,"SrvCheckDis| | Disadvantage on Survival Checks | CHECK","")]

[h:disStrCheckBonus=if(IsCheckBonus,"StrCheckBonus| "+listStatBonus+" | Bonus to Strength Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disDexCheckBonus=if(IsCheckBonus,"DexCheckBonus| "+listStatBonus+" | Bonus to Dexterity Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disConCheckBonus=if(IsCheckBonus,"ConCheckBonus| "+listStatBonus+" | Bonus to Constitution Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disIntCheckBonus=if(IsCheckBonus,"IntCheckBonus| "+listStatBonus+" | Bonus to Intelligence Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disWisCheckBonus=if(IsCheckBonus,"WisCheckBonus| "+listStatBonus+" | Bonus to Wisdom Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disChaCheckBonus=if(IsCheckBonus,"ChaCheckBonus| "+listStatBonus+" | Bonus to Charisma Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disAcbCheckBonus=if(IsCheckBonus,"AcbCheckBonus| "+listStatBonus+" | Bonus to Acrobatics Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disAnHCheckBonus=if(IsCheckBonus,"AnHCheckBonus| "+listStatBonus+" | Bonus to Animal Handling Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disArcCheckBonus=if(IsCheckBonus,"ArcCheckBonus| "+listStatBonus+" | Bonus to Arcana Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disAthCheckBonus=if(IsCheckBonus,"AthCheckBonus| "+listStatBonus+" | Bonus to Athletics Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disDcpCheckBonus=if(IsCheckBonus,"DcpCheckBonus| "+listStatBonus+" | Bonus to Deception Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disHstCheckBonus=if(IsCheckBonus,"HstCheckBonus| "+listStatBonus+" | Bonus to History Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disInsCheckBonus=if(IsCheckBonus,"InsCheckBonus| "+listStatBonus+" | Bonus to Insight Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disImdCheckBonus=if(IsCheckBonus,"ImdCheckBonus| "+listStatBonus+" | Bonus to Intimidation Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disInvCheckBonus=if(IsCheckBonus,"InvCheckBonus| "+listStatBonus+" | Bonus to Investigation Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disMedCheckBonus=if(IsCheckBonus,"MedCheckBonus| "+listStatBonus+" | Bonus to Medicine Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disNtrCheckBonus=if(IsCheckBonus,"NtrCheckBonus| "+listStatBonus+" | Bonus to Nature Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disPcpCheckBonus=if(IsCheckBonus,"PcpCheckBonus| "+listStatBonus+" | Bonus to Perception Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disPfmCheckBonus=if(IsCheckBonus,"PfmCheckBonus| "+listStatBonus+" | Bonus to Performance Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disPrsCheckBonus=if(IsCheckBonus,"PrsCheckBonus| "+listStatBonus+" | Bonus to Persuasion Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disRlgCheckBonus=if(IsCheckBonus,"RlgCheckBonus| "+listStatBonus+" | Bonus to Religion Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disSoHCheckBonus=if(IsCheckBonus,"SoHCheckBonus| "+listStatBonus+" | Bonus to Sleight of Hand Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disStlCheckBonus=if(IsCheckBonus,"StlCheckBonus| "+listStatBonus+" | Bonus to Stealth Checks | LIST | VALUE=STRING SELECT=10","")]
[h:disSrvCheckBonus=if(IsCheckBonus,"SrvCheckBonus| "+listStatBonus+" | Bonus to Survival Checks | LIST | VALUE=STRING SELECT=10","")]

[h:disStrCheckProf=if(IsCheckProf,"StrCheckProf| "+ProfList+" | Proficiency in Strength Checks | LIST","")]
[h:disDexCheckProf=if(IsCheckProf,"DexCheckProf| "+ProfList+" | Proficiency in Dexterity Checks | LIST","")]
[h:disConCheckProf=if(IsCheckProf,"ConCheckProf| "+ProfList+" | Proficiency in Constitution Checks | LIST","")]
[h:disIntCheckProf=if(IsCheckProf,"IntCheckProf| "+ProfList+" | Proficiency in Intelligence Checks | LIST","")]
[h:disWisCheckProf=if(IsCheckProf,"WisCheckProf| "+ProfList+" | Proficiency in Wisdom Checks | LIST","")]
[h:disChaCheckProf=if(IsCheckProf,"ChaCheckProf| "+ProfList+" | Proficiency in Charisma Checks | LIST","")]
[h:disAcbCheckProf=if(IsCheckProf,"AcbCheckProf| "+ProfList+" | Proficiency in Acrobatics Checks | LIST","")]
[h:disAnHCheckProf=if(IsCheckProf,"AnHCheckProf| "+ProfList+" | Proficiency in Animal Handling Checks | LIST","")]
[h:disArcCheckProf=if(IsCheckProf,"ArcCheckProf| "+ProfList+" | Proficiency in Arcana Checks | LIST","")]
[h:disAthCheckProf=if(IsCheckProf,"AthCheckProf| "+ProfList+" | Proficiency in Athletics Checks | LIST","")]
[h:disDcpCheckProf=if(IsCheckProf,"DcpCheckProf| "+ProfList+" | Proficiency in Deception Checks | LIST","")]
[h:disHstCheckProf=if(IsCheckProf,"HstCheckProf| "+ProfList+" | Proficiency in History Checks | LIST","")]
[h:disInsCheckProf=if(IsCheckProf,"InsCheckProf| "+ProfList+" | Proficiency in Insight Checks | LIST","")]
[h:disImdCheckProf=if(IsCheckProf,"ImdCheckProf| "+ProfList+" | Proficiency in Intimidation Checks | LIST","")]
[h:disInvCheckProf=if(IsCheckProf,"InvCheckProf| "+ProfList+" | Proficiency in Investigation Checks | LIST","")]
[h:disMedCheckProf=if(IsCheckProf,"MedCheckProf| "+ProfList+" | Proficiency in Medicine Checks | LIST","")]
[h:disNtrCheckProf=if(IsCheckProf,"NtrCheckProf| "+ProfList+" | Proficiency in Nature Checks | LIST","")]
[h:disPcpCheckProf=if(IsCheckProf,"PcpCheckProf| "+ProfList+" | Proficiency in Perception Checks | LIST","")]
[h:disPfmCheckProf=if(IsCheckProf,"PfmCheckProf| "+ProfList+" | Proficiency in Performance Checks | LIST","")]
[h:disPrsCheckProf=if(IsCheckProf,"PrsCheckProf| "+ProfList+" | Proficiency in Persuasion Checks | LIST","")]
[h:disRlgCheckProf=if(IsCheckProf,"RlgCheckProf| "+ProfList+" | Proficiency in Religion Checks | LIST","")]
[h:disSoHCheckProf=if(IsCheckProf,"SoHCheckProf| "+ProfList+" | Proficiency in Sleight of Hand Checks | LIST","")]
[h:disStlCheckProf=if(IsCheckProf,"StlCheckProf| "+ProfList+" | Proficiency in Stealth Checks | LIST","")]
[h:disSrvCheckProf=if(IsCheckProf,"SrvCheckProf| "+ProfList+" | Proficiency in Survival Checks | LIST","")]

[h:disStrCheckMessage=if(IsCheckMessage,"StrCheckMessage| | Message Displayed After Strength Checks ","")]
[h:disDexCheckMessage=if(IsCheckMessage,"DexCheckMessage| | Message Displayed After Dexterity Checks ","")]
[h:disConCheckMessage=if(IsCheckMessage,"ConCheckMessage| | Message Displayed After Constitution Checks ","")]
[h:disIntCheckMessage=if(IsCheckMessage,"IntCheckMessage| | Message Displayed After Intelligence Checks ","")]
[h:disWisCheckMessage=if(IsCheckMessage,"WisCheckMessage| | Message Displayed After Wisdom Checks ","")]
[h:disChaCheckMessage=if(IsCheckMessage,"ChaCheckMessage| | Message Displayed After Charisma Checks ","")]
[h:disAcbCheckMessage=if(IsCheckMessage,"AcbCheckMessage| | Message Displayed After Acrobatics Checks ","")]
[h:disAnHCheckMessage=if(IsCheckMessage,"AnHCheckMessage| | Message Displayed After Animal Handling Checks ","")]
[h:disArcCheckMessage=if(IsCheckMessage,"ArcCheckMessage| | Message Displayed After Arcana Checks ","")]
[h:disAthCheckMessage=if(IsCheckMessage,"AthCheckMessage| | Message Displayed After Athletics Checks ","")]
[h:disDcpCheckMessage=if(IsCheckMessage,"DcpCheckMessage| | Message Displayed After Deception Checks ","")]
[h:disHstCheckMessage=if(IsCheckMessage,"HstCheckMessage| | Message Displayed After History Checks ","")]
[h:disInsCheckMessage=if(IsCheckMessage,"InsCheckMessage| | Message Displayed After Insight Checks ","")]
[h:disImdCheckMessage=if(IsCheckMessage,"ImdCheckMessage| | Message Displayed After Intimidation Checks ","")]
[h:disInvCheckMessage=if(IsCheckMessage,"InvCheckMessage| | Message Displayed After Investigation Checks ","")]
[h:disMedCheckMessage=if(IsCheckMessage,"MedCheckMessage| | Message Displayed After Medicine Checks ","")]
[h:disNtrCheckMessage=if(IsCheckMessage,"NtrCheckMessage| | Message Displayed After Nature Checks ","")]
[h:disPcpCheckMessage=if(IsCheckMessage,"PcpCheckMessage| | Message Displayed After Perception Checks ","")]
[h:disPfmCheckMessage=if(IsCheckMessage,"PfmCheckMessage| | Message Displayed After Performance Checks ","")]
[h:disPrsCheckMessage=if(IsCheckMessage,"PrsCheckMessage| | Message Displayed After Persuasion Checks ","")]
[h:disRlgCheckMessage=if(IsCheckMessage,"RlgCheckMessage| | Message Displayed After Religion Checks ","")]
[h:disSoHCheckMessage=if(IsCheckMessage,"SoHCheckMessage| | Message Displayed After Sleight of Hand Checks ","")]
[h:disStlCheckMessage=if(IsCheckMessage,"StlCheckMessage| | Message Displayed After Stealth Checks ","")]
[h:disSrvCheckMessage=if(IsCheckMessage,"SrvCheckMessage| | Message Displayed After Survival Checks ","")]

    [h:StrCheckAdv=0]
    [h:DexCheckAdv=0]
    [h:ConCheckAdv=0]
    [h:IntCheckAdv=0]
    [h:WisCheckAdv=0]
    [h:ChaCheckAdv=0]
    [h:AcbCheckAdv=0]
    [h:AnHCheckAdv=0]
    [h:ArcCheckAdv=0]
    [h:AthCheckAdv=0]
    [h:DcpCheckAdv=0]
    [h:HstCheckAdv=0]
    [h:InsCheckAdv=0]
    [h:ImdCheckAdv=0]
    [h:InvCheckAdv=0]
    [h:MedCheckAdv=0]
    [h:NtrCheckAdv=0]
    [h:PcpCheckAdv=0]
    [h:PfmCheckAdv=0]
    [h:PrsCheckAdv=0]
    [h:RlgCheckAdv=0]
    [h:SoHCheckAdv=0]
    [h:StlCheckAdv=0]
    [h:SrvCheckAdv=0]
    [h:StrCheckDis=0]
    [h:DexCheckDis=0]
    [h:ConCheckDis=0]
    [h:IntCheckDis=0]
    [h:WisCheckDis=0]
    [h:ChaCheckDis=0]
    [h:AcbCheckDis=0]
    [h:AnHCheckDis=0]
    [h:ArcCheckDis=0]
    [h:AthCheckDis=0]
    [h:DcpCheckDis=0]
    [h:HstCheckDis=0]
    [h:InsCheckDis=0]
    [h:ImdCheckDis=0]
    [h:InvCheckDis=0]
    [h:MedCheckDis=0]
    [h:NtrCheckDis=0]
    [h:PcpCheckDis=0]
    [h:PfmCheckDis=0]
    [h:PrsCheckDis=0]
    [h:RlgCheckDis=0]
    [h:SoHCheckDis=0]
    [h:StlCheckDis=0]
    [h:SrvCheckDis=0]
    [h:StrCheckBonus=0]
    [h:DexCheckBonus=0]
    [h:ConCheckBonus=0]
    [h:IntCheckBonus=0]
    [h:WisCheckBonus=0]
    [h:ChaCheckBonus=0]
    [h:AcbCheckBonus=0]
    [h:AnHCheckBonus=0]
    [h:ArcCheckBonus=0]
    [h:AthCheckBonus=0]
    [h:DcpCheckBonus=0]
    [h:HstCheckBonus=0]
    [h:InsCheckBonus=0]
    [h:ImdCheckBonus=0]
    [h:InvCheckBonus=0]
    [h:MedCheckBonus=0]
    [h:NtrCheckBonus=0]
    [h:PcpCheckBonus=0]
    [h:PfmCheckBonus=0]
    [h:PrsCheckBonus=0]
    [h:RlgCheckBonus=0]
    [h:SoHCheckBonus=0]
    [h:StlCheckBonus=0]
    [h:SrvCheckBonus=0]
    [h:StrCheckProf=0]
    [h:DexCheckProf=0]
    [h:ConCheckProf=0]
    [h:IntCheckProf=0]
    [h:WisCheckProf=0]
    [h:ChaCheckProf=0]
    [h:AcbCheckProf=0]
    [h:AnHCheckProf=0]
    [h:ArcCheckProf=0]
    [h:AthCheckProf=0]
    [h:DcpCheckProf=0]
    [h:HstCheckProf=0]
    [h:InsCheckProf=0]
    [h:ImdCheckProf=0]
    [h:InvCheckProf=0]
    [h:MedCheckProf=0]
    [h:NtrCheckProf=0]
    [h:PcpCheckProf=0]
    [h:PfmCheckProf=0]
    [h:PrsCheckProf=0]
    [h:RlgCheckProf=0]
    [h:SoHCheckProf=0]
    [h:StlCheckProf=0]
    [h:SrvCheckProf=0]
    [h:StrCheckMessage="0"]
    [h:DexCheckMessage="0"]
    [h:ConCheckMessage="0"]
    [h:IntCheckMessage="0"]
    [h:WisCheckMessage="0"]
    [h:ChaCheckMessage="0"]
    [h:AcbCheckMessage="0"]
    [h:AnHCheckMessage="0"]
    [h:ArcCheckMessage="0"]
    [h:AthCheckMessage="0"]
    [h:DcpCheckMessage="0"]
    [h:HstCheckMessage="0"]
    [h:InsCheckMessage="0"]
    [h:ImdCheckMessage="0"]
    [h:InvCheckMessage="0"]
    [h:MedCheckMessage="0"]
    [h:NtrCheckMessage="0"]
    [h:PcpCheckMessage="0"]
    [h:PfmCheckMessage="0"]
    [h:PrsCheckMessage="0"]
    [h:RlgCheckMessage="0"]
    [h:SoHCheckMessage="0"]
    [h:StlCheckMessage="0"]
    [h:SrvCheckMessage="0"]

[h:CheckSelect=input(
	""+disIsCheckBonus+"",
	""+disStrCheckAdv+"",
	""+disDexCheckAdv+"",
	""+disConCheckAdv+"",
	""+disIntCheckAdv+"",
	""+disWisCheckAdv+"",
	""+disChaCheckAdv+"",
	""+disAcbCheckAdv+"",
	""+disAnHCheckAdv+"",
	""+disArcCheckAdv+"",
	""+disAthCheckAdv+"",
	""+disDcpCheckAdv+"",
	""+disHstCheckAdv+"",
	""+disInsCheckAdv+"",
	""+disImdCheckAdv+"",
	""+disInvCheckAdv+"",
	""+disMedCheckAdv+"",
	""+disNtrCheckAdv+"",
	""+disPcpCheckAdv+"",
	""+disPfmCheckAdv+"",
	""+disPrsCheckAdv+"",
	""+disRlgCheckAdv+"",
	""+disSoHCheckAdv+"",
	""+disStlCheckAdv+"",
	""+disSrvCheckAdv+"",
	""+disStrCheckDis+"",
	""+disDexCheckDis+"",
	""+disConCheckDis+"",
	""+disIntCheckDis+"",
	""+disWisCheckDis+"",
	""+disChaCheckDis+"",
	""+disAcbCheckDis+"",
	""+disAnHCheckDis+"",
	""+disArcCheckDis+"",
	""+disAthCheckDis+"",
	""+disDcpCheckDis+"",
	""+disHstCheckDis+"",
	""+disInsCheckDis+"",
	""+disImdCheckDis+"",
	""+disInvCheckDis+"",
	""+disMedCheckDis+"",
	""+disNtrCheckDis+"",
	""+disPcpCheckDis+"",
	""+disPfmCheckDis+"",
	""+disPrsCheckDis+"",
	""+disRlgCheckDis+"",
	""+disSoHCheckDis+"",
	""+disStlCheckDis+"",
	""+disSrvCheckDis+"",
	""+disStrCheckBonus+"",
	""+disDexCheckBonus+"",
	""+disConCheckBonus+"",
	""+disIntCheckBonus+"",
	""+disWisCheckBonus+"",
	""+disChaCheckBonus+"",
	""+disAcbCheckBonus+"",
	""+disAnHCheckBonus+"",
	""+disArcCheckBonus+"",
	""+disAthCheckBonus+"",
	""+disDcpCheckBonus+"",
	""+disHstCheckBonus+"",
	""+disInsCheckBonus+"",
	""+disImdCheckBonus+"",
	""+disInvCheckBonus+"",
	""+disMedCheckBonus+"",
	""+disNtrCheckBonus+"",
	""+disPcpCheckBonus+"",
	""+disPfmCheckBonus+"",
	""+disPrsCheckBonus+"",
	""+disRlgCheckBonus+"",
	""+disSoHCheckBonus+"",
	""+disStlCheckBonus+"",
	""+disSrvCheckBonus+"",
	""+disStrCheckProf+"",
	""+disDexCheckProf+"",
	""+disConCheckProf+"",
	""+disIntCheckProf+"",
	""+disWisCheckProf+"",
	""+disChaCheckProf+"",
	""+disAcbCheckProf+"",
	""+disAnHCheckProf+"",
	""+disArcCheckProf+"",
	""+disAthCheckProf+"",
	""+disDcpCheckProf+"",
	""+disHstCheckProf+"",
	""+disInsCheckProf+"",
	""+disImdCheckProf+"",
	""+disInvCheckProf+"",
	""+disMedCheckProf+"",
	""+disNtrCheckProf+"",
	""+disPcpCheckProf+"",
	""+disPfmCheckProf+"",
	""+disPrsCheckProf+"",
	""+disRlgCheckProf+"",
	""+disSoHCheckProf+"",
	""+disStlCheckProf+"",
	""+disSrvCheckProf+"",
	""+disStrCheckMessage+"",
	""+disDexCheckMessage+"",
	""+disConCheckMessage+"",
	""+disIntCheckMessage+"",
	""+disWisCheckMessage+"",
	""+disChaCheckMessage+"",
	""+disAcbCheckMessage+"",
	""+disAnHCheckMessage+"",
	""+disArcCheckMessage+"",
	""+disAthCheckMessage+"",
	""+disDcpCheckMessage+"",
	""+disHstCheckMessage+"",
	""+disInsCheckMessage+"",
	""+disImdCheckMessage+"",
	""+disInvCheckMessage+"",
	""+disMedCheckMessage+"",
	""+disNtrCheckMessage+"",
	""+disPcpCheckMessage+"",
	""+disPfmCheckMessage+"",
	""+disPrsCheckMessage+"",
	""+disRlgCheckMessage+"",
	""+disSoHCheckMessage+"",
	""+disStlCheckMessage+"",
	""+disSrvCheckMessage+""
	)]
	[h:abort(CheckSelect)]

    [h:StrCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+StrCheckMessage+"</td></tr>"]
    [h:DexCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+DexCheckMessage+"</td></tr>"]
    [h:ConCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+ConCheckMessage+"</td></tr>"]
    [h:IntCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+IntCheckMessage+"</td></tr>"]
    [h:WisCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+WisCheckMessage+"</td></tr>"]
    [h:ChaCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+ChaCheckMessage+"</td></tr>"]
    [h:AcbCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+AcbCheckMessage+"</td></tr>"]
    [h:AnHCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+AnHCheckMessage+"</td></tr>"]
    [h:ArcCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+ArcCheckMessage+"</td></tr>"]
    [h:AthCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+AthCheckMessage+"</td></tr>"]
    [h:DcpCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+DcpCheckMessage+"</td></tr>"]
    [h:HstCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+HstCheckMessage+"</td></tr>"]
    [h:InsCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+InsCheckMessage+"</td></tr>"]
    [h:ImdCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+ImdCheckMessage+"</td></tr>"]
    [h:InvCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+InvCheckMessage+"</td></tr>"]
    [h:MedCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+MedCheckMessage+"</td></tr>"]
    [h:NtrCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+NtrCheckMessage+"</td></tr>"]
    [h:PcpCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+PcpCheckMessage+"</td></tr>"]
    [h:PfmCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+PfmCheckMessage+"</td></tr>"]
    [h:PrsCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+PrsCheckMessage+"</td></tr>"]
    [h:RlgCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+RlgCheckMessage+"</td></tr>"]
    [h:SoHCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+SoHCheckMessage+"</td></tr>"]
    [h:StlCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+StlCheckMessage+"</td></tr>"]
    [h:SrvCheckMessage="<tr><td>&#8226;</td><td> <b>"+iName+":</b> "+SrvCheckMessage+"</td></tr>"]

[h:CheckAdvData=json.set("",
    "StrCheckAdv",StrCheckAdv,
    "DexCheckAdv",DexCheckAdv,
    "ConCheckAdv",ConCheckAdv,
    "IntCheckAdv",IntCheckAdv,
    "WisCheckAdv",WisCheckAdv,
    "ChaCheckAdv",ChaCheckAdv,
    "AcbCheckAdv",AcbCheckAdv,
    "AnHCheckAdv",AnHCheckAdv,
    "ArcCheckAdv",ArcCheckAdv,
    "AthCheckAdv",AthCheckAdv,
    "DcpCheckAdv",DcpCheckAdv,
    "HstCheckAdv",HstCheckAdv,
    "InsCheckAdv",InsCheckAdv,
    "ImdCheckAdv",ImdCheckAdv,
    "InvCheckAdv",InvCheckAdv,
    "MedCheckAdv",MedCheckAdv,
    "NtrCheckAdv",NtrCheckAdv,
    "PcpCheckAdv",PcpCheckAdv,
    "PfmCheckAdv",PfmCheckAdv,
    "PrsCheckAdv",PrsCheckAdv,
    "RlgCheckAdv",RlgCheckAdv,
    "SoHCheckAdv",SoHCheckAdv,
    "StlCheckAdv",StlCheckAdv,
    "SrvCheckAdv",SrvCheckAdv)]
    
[h:CheckDisData=json.set("",
    "StrCheckDis",StrCheckDis,
    "DexCheckDis",DexCheckDis,
    "ConCheckDis",ConCheckDis,
    "IntCheckDis",IntCheckDis,
    "WisCheckDis",WisCheckDis,
    "ChaCheckDis",ChaCheckDis,
    "AcbCheckDis",AcbCheckDis,
    "AnHCheckDis",AnHCheckDis,
    "ArcCheckDis",ArcCheckDis,
    "AthCheckDis",AthCheckDis,
    "DcpCheckDis",DcpCheckDis,
    "HstCheckDis",HstCheckDis,
    "InsCheckDis",InsCheckDis,
    "ImdCheckDis",ImdCheckDis,
    "InvCheckDis",InvCheckDis,
    "MedCheckDis",MedCheckDis,
    "NtrCheckDis",NtrCheckDis,
    "PcpCheckDis",PcpCheckDis,
    "PfmCheckDis",PfmCheckDis,
    "PrsCheckDis",PrsCheckDis,
    "RlgCheckDis",RlgCheckDis,
    "SoHCheckDis",SoHCheckDis,
    "StlCheckDis",StlCheckDis,
    "SrvCheckDis",SrvCheckDis)]
    
[h:CheckBonusData=json.set("",
    "StrCheckBonus",StrCheckBonus,
    "DexCheckBonus",DexCheckBonus,
    "ConCheckBonus",ConCheckBonus,
    "IntCheckBonus",IntCheckBonus,
    "WisCheckBonus",WisCheckBonus,
    "ChaCheckBonus",ChaCheckBonus,
    "AcbCheckBonus",AcbCheckBonus,
    "AnHCheckBonus",AnHCheckBonus,
    "ArcCheckBonus",ArcCheckBonus,
    "AthCheckBonus",AthCheckBonus,
    "DcpCheckBonus",DcpCheckBonus,
    "HstCheckBonus",HstCheckBonus,
    "InsCheckBonus",InsCheckBonus,
    "ImdCheckBonus",ImdCheckBonus,
    "InvCheckBonus",InvCheckBonus,
    "MedCheckBonus",MedCheckBonus,
    "NtrCheckBonus",NtrCheckBonus,
    "PcpCheckBonus",PcpCheckBonus,
    "PfmCheckBonus",PfmCheckBonus,
    "PrsCheckBonus",PrsCheckBonus,
    "RlgCheckBonus",RlgCheckBonus,
    "SoHCheckBonus",SoHCheckBonus,
    "StlCheckBonus",StlCheckBonus,
    "SrvCheckBonus",SrvCheckBonus)]
    
[h:CheckProfData=json.set("",
    "StrCheckProf",StrCheckProf,
    "DexCheckProf",DexCheckProf,
    "ConCheckProf",ConCheckProf,
    "IntCheckProf",IntCheckProf,
    "WisCheckProf",WisCheckProf,
    "ChaCheckProf",ChaCheckProf,
    "AcbCheckProf",AcbCheckProf,
    "AnHCheckProf",AnHCheckProf,
    "ArcCheckProf",ArcCheckProf,
    "AthCheckProf",AthCheckProf,
    "DcpCheckProf",DcpCheckProf,
    "HstCheckProf",HstCheckProf,
    "InsCheckProf",InsCheckProf,
    "ImdCheckProf",ImdCheckProf,
    "InvCheckProf",InvCheckProf,
    "MedCheckProf",MedCheckProf,
    "NtrCheckProf",NtrCheckProf,
    "PcpCheckProf",PcpCheckProf,
    "PfmCheckProf",PfmCheckProf,
    "PrsCheckProf",PrsCheckProf,
    "RlgCheckProf",RlgCheckProf,
    "SoHCheckProf",SoHCheckProf,
    "StlCheckProf",StlCheckProf,
    "SrvCheckProf",SrvCheckProf)]
    
[h:CheckMessageData=json.set("",
    "StrCheckMessage",StrCheckMessage,
    "DexCheckMessage",DexCheckMessage,
    "ConCheckMessage",ConCheckMessage,
    "IntCheckMessage",IntCheckMessage,
    "WisCheckMessage",WisCheckMessage,
    "ChaCheckMessage",ChaCheckMessage,
    "AcbCheckMessage",AcbCheckMessage,
    "AnHCheckMessage",AnHCheckMessage,
    "ArcCheckMessage",ArcCheckMessage,
    "AthCheckMessage",AthCheckMessage,
    "DcpCheckMessage",DcpCheckMessage,
    "HstCheckMessage",HstCheckMessage,
    "InsCheckMessage",InsCheckMessage,
    "ImdCheckMessage",ImdCheckMessage,
    "InvCheckMessage",InvCheckMessage,
    "MedCheckMessage",MedCheckMessage,
    "NtrCheckMessage",NtrCheckMessage,
    "PcpCheckMessage",PcpCheckMessage,
    "PfmCheckMessage",PfmCheckMessage,
    "PrsCheckMessage",PrsCheckMessage,
    "RlgCheckMessage",RlgCheckMessage,
    "SoHCheckMessage",SoHCheckMessage,
    "StlCheckMessage",StlCheckMessage,
    "SrvCheckMessage",SrvCheckMessage)]
    
[h:disIsInitBonus=if(IsInitEffects,"junkVar|Information about Initiative Bonuses||LABEL|SPAN=TRUE","")]
[h:disInitAdv=if(IsInitEffects,"InitAdv| | Advantage on Initiative | CHECK","")]
[h:disInitDis=if(IsInitEffects,"InitDis| | Disadvantage on Initiative | CHECK","")]
[h:disInitBonus=if(IsInitEffects,"InitBonus| "+listStatBonus+" | Bonus to Initiative | LIST | VALUE=STRING SELECT=10","")]
[h:disInitProf=if(IsInitEffects,"InitProf| "+ProfList+" | Proficiency in Initiative | LIST","")]
[h:disInitMessage=if(IsInitEffects,"InitMessage| | Message Displayed After Initiative","")]

    [h:InitAdv=0]
    [h:InitDis=0]
    [h:InitBonus=0]
    [h:InitProf=0]
    [h:InitMessage="0"]

[h:InitiativeSelect=input(
	""+disIsInitBonus+"",
	""+disInitAdv+"",
	""+disInitDis+"",
	""+disInitBonus+"",
	""+disInitProf+"",
	""+disInitMessage+""
	)]
	[h:abort(InitiativeSelect)]

	[h:InitMessage="<br>&#8226; <b>"+iName+":</b> "+InitMessage]
    
[h:InitData=json.set("",
    "InitAdv",InitAdv,
    "InitDis",InitDis,
    "InitBonus",InitBonus,
    "InitProf",InitProf,
    "InitMessage",InitMessage)]

[h:disIsDeathBonus=if(IsDeathEffects,"junkVar|Information about Death Saves||LABEL|SPAN=TRUE","")]
[h:disDeathAdv=if(IsDeathEffects,"DeathAdv| | Advantage on Death Saves | CHECK","")]
[h:disDeathDis=if(IsDeathEffects,"DeathDis| | Disadvantage on Death Saves | CHECK","")]
[h:disDeathBonus=if(IsDeathEffects,"DeathBonus| "+listStatBonus+" | Bonus to Death Saves | LIST | VALUE=STRING SELECT=10","")]
[h:disDeathProf=if(IsDeathEffects,"DeathProf| "+ProfList+" | Proficiency in Death Saves | LIST","")]
[h:disDeathMessage=if(IsDeathEffects,"DeathMessage| | Message Displayed After Death Saves","")]

    [h:DeathAdv=0]
    [h:DeathDis=0]
    [h:DeathBonus=0]
    [h:DeathProf=0]
    [h:DeathMessage="0"]

[h:DeathSelect=input(
	""+disIsDeathBonus+"",
	""+disDeathAdv+"",
	""+disDeathDis+"",
	""+disDeathBonus+"",
	""+disDeathProf+"",
	""+disDeathMessage+""
	)]
	[h:abort(DeathSelect)]

	[h:DeathMessage="<br>&#8226; <b>"+iName+":</b> "+DeathMessage]
    
[h:DeathData=json.set("",
    "DeathAdv",DeathAdv,
    "DeathDis",DeathDis,
    "DeathBonus",DeathBonus,
    "DeathProf",DeathProf,
    "DeathMessage",DeathMessage)]

[h:disIsConcBonus=if(IsConcEffects,"junkVar|Information about Concentration Saves||LABEL|SPAN=TRUE","")]
[h:disConcAdv=if(IsConcEffects,"ConcAdv| | Advantage on Concentration Saves | CHECK","")]
[h:disConcDis=if(IsConcEffects,"ConcDis| | Disadvantage on Concentration Saves | CHECK","")]
[h:disConcBonus=if(IsConcEffects,"ConcBonus| "+listStatBonus+" | Bonus to Concentration Saves | LIST | VALUE=STRING SELECT=10","")]
[h:disConcProf=if(IsConcEffects,"ConcProf| "+ProfList+" | Proficiency in Concentration Saves | LIST","")]
[h:disConcMessage=if(IsConcEffects,"ConcMessage| | Message Displayed After Concentration Saves","")]

    [h:ConcAdv=0]
    [h:ConcDis=0]
    [h:ConcBonus=0]
    [h:ConcProf=0]
    [h:ConcMessage="0"]

[h:ConcentrationSelect=input(
	""+disIsConcBonus+"",
	""+disConcAdv+"",
	""+disConcDis+"",
	""+disConcBonus+"",
	""+disConcProf+"",
	""+disConcMessage+""
	)]
	[h:abort(ConcentrationSelect)]

	[h:ConcMessage="<br>&#8226; <b>"+iName+":</b> "+ConcMessage]
    
[h:ConcData=json.set("",
    "ConcAdv",ConcAdv,
    "ConcDis",ConcDis,
    "ConcBonus",ConcBonus,
    "ConcProf",ConcProf,
    "ConcMessage",ConcMessage)]

    [h:listTypeVuln="No,Physical,Magical,All"]
    [h:bludgVuln=0]
    [h:pierceVuln=0]
    [h:slashVuln=0]
    [h:acidVuln=0]
    [h:coldVuln=0]
    [h:fireVuln=0]
    [h:forceVuln=0]
    [h:lightVuln=0]
    [h:necroVuln=0]
    [h:poisVuln=0]
    [h:psychVuln=0]
    [h:radVuln=0]
    [h:thunVuln=0]
    [h:abjVuln=0]
    [h:conjVuln=0]
    [h:divVuln=0]
    [h:enchVuln=0]
    [h:evocVuln=0]
    [h:illVuln=0]
    [h:necVuln=0]
    [h:tranVuln=0]

[h:disIsVuln=if(IsVuln,"junkVar|Information about Damage Vulnerabilities||LABEL|SPAN=TRUE","")]
[h:disbludgVuln=if(IsVuln,"bludgVuln| "+listTypeVuln+" | Vulnerable to Bludgeoning Damage | LIST","")]
[h:dispierceVuln=if(IsVuln,"pierceVuln| "+listTypeVuln+" | Vulnerable to Piercing Damage | LIST","")]
[h:disslashVuln=if(IsVuln,"slashVuln| "+listTypeVuln+" | Vulnerable to Slashing Damage | LIST","")]
[h:disacidVuln=if(IsVuln,"acidVuln| "+listTypeVuln+" | Vulnerable to Acid Damage | LIST","")]
[h:discoldVuln=if(IsVuln,"coldVuln| "+listTypeVuln+" | Vulnerable to Cold Damage | LIST","")]
[h:disfireVuln=if(IsVuln,"fireVuln| "+listTypeVuln+" | Vulnerable to Fire Damage | LIST","")]
[h:disforceVuln=if(IsVuln,"forceVuln| "+listTypeVuln+" | Vulnerable to Force Damage | LIST","")]
[h:dislightVuln=if(IsVuln,"lightVuln| "+listTypeVuln+" | Vulnerable to Lightning Damage | LIST","")]
[h:disnecroVuln=if(IsVuln,"necroVuln| "+listTypeVuln+" | Vulnerable to Necrotic Damage | LIST","")]
[h:dispoisVuln=if(IsVuln,"poisVuln| "+listTypeVuln+" | Vulnerable to Poison Damage | LIST","")]
[h:dispsychVuln=if(IsVuln,"psychVuln| "+listTypeVuln+" | Vulnerable to Psychic Damage | LIST","")]
[h:disradVuln=if(IsVuln,"radVuln| "+listTypeVuln+" | Vulnerable to Radiant Damage | LIST","")]
[h:disthunVuln=if(IsVuln,"thunVuln| "+listTypeVuln+" | Vulnerable to Thunder Damage | LIST","")]
[h:disVulnBars=if(IsVuln,"junkVar|---------------------------------------------------------------||LABEL|SPAN=TRUE","")]
[h:disabjVuln=if(IsVuln,"abjVuln| "+listTypeVuln+" | Vulnerable to Abjuration Spell Damage | LIST","")]
[h:disconjVuln=if(IsVuln,"conjVuln| "+listTypeVuln+" | Vulnerable to Conjuration Spell Damage | LIST","")]
[h:disdivVuln=if(IsVuln,"divVuln| "+listTypeVuln+" | Vulnerable to Divination Spell Damage | LIST","")]
[h:disenchVuln=if(IsVuln,"enchVuln| "+listTypeVuln+" | Vulnerable to Enchantment Spell Damage | LIST","")]
[h:disevocVuln=if(IsVuln,"evocVuln| "+listTypeVuln+" | Vulnerable to Evocation Spell Damage | LIST","")]
[h:disillVuln=if(IsVuln,"illVuln| "+listTypeVuln+" | Vulnerable to Illusion Spell Damage | LIST","")]
[h:disnecVuln=if(IsVuln,"necVuln| "+listTypeVuln+" | Vulnerable to Necromancy Spell Damage | LIST","")]
[h:distranVuln=if(IsVuln,"tranVuln| "+listTypeVuln+" | Vulnerable to Transmutation Spell Damage | LIST","")]

[h:VulnChoice=input(
	""+disIsVuln+"",
	""+disbludgVuln+"",
	""+dispierceVuln+"",
	""+disslashVuln+"",
	""+disacidVuln+"",
	""+discoldVuln+"",
	""+disfireVuln+"",
	""+disforceVuln+"",
	""+dislightVuln+"",
	""+disnecroVuln+"",
	""+dispoisVuln+"",
	""+dispsychVuln+"",
	""+disradVuln+"",
	""+disthunVuln+"",
	""+disVulnBars+"",
	""+disabjVuln+"",
	""+disconjVuln+"",
	""+disdivVuln+"",
	""+disenchVuln+"",
	""+disevocVuln+"",
	""+disillVuln+"",
	""+disnecVuln+"",
	""+distranVuln+""
	)]
[h:abort(VulnChoice)]

[h:VulnData=json.set("",
    "bludgVuln",bludgVuln,
    "pierceVuln",pierceVuln,
    "slashVuln",slashVuln,
    "acidVuln",acidVuln,
    "coldVuln",coldVuln,
    "fireVuln",fireVuln,
    "forceVuln",forceVuln,
    "lightVuln",lightVuln,
    "necroVuln",necroVuln,
    "poisVuln",poisVuln,
    "psychVuln",psychVuln,
    "radVuln",radVuln,
    "thunVuln",thunVuln,
    "abjVuln",abjVuln,
    "conjVuln",conjVuln,
    "divVuln",divVuln,
    "enchVuln",enchVuln,
    "evocVuln",evocVuln,
    "illVuln",illVuln,
    "necVuln",necVuln,
    "tranVuln",tranVuln
	)]

    [h:listTypeRes="No,Physical,Magical,All"]
    [h:bludgRes=0]
    [h:pierceRes=0]
    [h:slashRes=0]
    [h:acidRes=0]
    [h:coldRes=0]
    [h:fireRes=0]
    [h:forceRes=0]
    [h:lightRes=0]
    [h:necroRes=0]
    [h:poisRes=0]
    [h:psychRes=0]
    [h:radRes=0]
    [h:thunRes=0]
    [h:abjRes=0]
    [h:conjRes=0]
    [h:divRes=0]
    [h:enchRes=0]
    [h:evocRes=0]
    [h:illRes=0]
    [h:necRes=0]
    [h:tranRes=0]

[h:disIsRes=if(IsRes,"junkVar|Information about Damage Resistances||LABEL|SPAN=TRUE","")]
[h:disbludgRes=if(IsRes,"bludgRes| "+listTypeRes+" | Resistance to Bludgeoning Damage | LIST","")]
[h:dispierceRes=if(IsRes,"pierceRes| "+listTypeRes+" | Resistance to Piercing Damage | LIST","")]
[h:disslashRes=if(IsRes,"slashRes| "+listTypeRes+" | Resistance to Slashing Damage | LIST","")]
[h:disacidRes=if(IsRes,"acidRes| "+listTypeRes+" | Resistance to Acid Damage | LIST","")]
[h:discoldRes=if(IsRes,"coldRes| "+listTypeRes+" | Resistance to Cold Damage | LIST","")]
[h:disfireRes=if(IsRes,"fireRes| "+listTypeRes+" | Resistance to Fire Damage | LIST","")]
[h:disforceRes=if(IsRes,"forceRes| "+listTypeRes+" | Resistance to Force Damage | LIST","")]
[h:dislightRes=if(IsRes,"lightRes| "+listTypeRes+" | Resistance to Lightning Damage | LIST","")]
[h:disnecroRes=if(IsRes,"necroRes| "+listTypeRes+" | Resistance to Necrotic Damage | LIST","")]
[h:dispoisRes=if(IsRes,"poisRes| "+listTypeRes+" | Resistance to Poison Damage | LIST","")]
[h:dispsychRes=if(IsRes,"psychRes| "+listTypeRes+" | Resistance to Psychic Damage | LIST","")]
[h:disradRes=if(IsRes,"radRes| "+listTypeRes+" | Resistance to Radiant Damage | LIST","")]
[h:disthunRes=if(IsRes,"thunRes| "+listTypeRes+" | Resistance to Thunder Damage | LIST","")]
[h:disResBars=if(IsRes,"junkVar|---------------------------------------------------------------||LABEL|SPAN=TRUE","")]
[h:disabjRes=if(IsRes,"abjRes| "+listTypeRes+" | Resistance to Abjuration Spell Damage | LIST","")]
[h:disconjRes=if(IsRes,"conjRes| "+listTypeRes+" | Resistance to Conjuration Spell Damage | LIST","")]
[h:disdivRes=if(IsRes,"divRes| "+listTypeRes+" | Resistance to Divination Spell Damage | LIST","")]
[h:disenchRes=if(IsRes,"enchRes| "+listTypeRes+" | Resistance to Enchantment Spell Damage | LIST","")]
[h:disevocRes=if(IsRes,"evocRes| "+listTypeRes+" | Resistance to Evocation Spell Damage | LIST","")]
[h:disillRes=if(IsRes,"illRes| "+listTypeRes+" | Resistance to Illusion Spell Damage | LIST","")]
[h:disnecRes=if(IsRes,"necRes| "+listTypeRes+" | Resistance to Necromancy Spell Damage | LIST","")]
[h:distranRes=if(IsRes,"tranRes| "+listTypeRes+" | Resistance to Transmutation Spell Damage | LIST","")]

[h:ResChoice=input(
    ""+disIsRes+"",
    ""+disbludgRes+"",
    ""+dispierceRes+"",
    ""+disslashRes+"",
    ""+disacidRes+"",
    ""+discoldRes+"",
    ""+disfireRes+"",
    ""+disforceRes+"",
    ""+dislightRes+"",
    ""+disnecroRes+"",
    ""+dispoisRes+"",
    ""+dispsychRes+"",
    ""+disradRes+"",
    ""+disthunRes+"",
    ""+disResBars+"",
    ""+disabjRes+"",
    ""+disconjRes+"",
    ""+disdivRes+"",
    ""+disenchRes+"",
    ""+disevocRes+"",
    ""+disillRes+"",
    ""+disnecRes+"",
    ""+distranRes+""
    )]
[h:abort(ResChoice)]

[h:ResData=json.set("",
    "bludgRes",bludgRes,
    "pierceRes",pierceRes,
    "slashRes",slashRes,
    "acidRes",acidRes,
    "coldRes",coldRes,
    "fireRes",fireRes,
    "forceRes",forceRes,
    "lightRes",lightRes,
    "necroRes",necroRes,
    "poisRes",poisRes,
    "psychRes",psychRes,
    "radRes",radRes,
    "thunRes",thunRes,
    "abjRes",abjRes,
    "conjRes",conjRes,
    "divRes",divRes,
    "enchRes",enchRes,
    "evocRes",evocRes,
    "illRes",illRes,
    "necRes",necRes,
    "tranRes",tranRes
    )]

    [h:listTypeImmun="No,Physical,Magical,All"]
    [h:bludgImmun=0]
    [h:pierceImmun=0]
    [h:slashImmun=0]
    [h:acidImmun=0]
    [h:coldImmun=0]
    [h:fireImmun=0]
    [h:forceImmun=0]
    [h:lightImmun=0]
    [h:necroImmun=0]
    [h:poisImmun=0]
    [h:psychImmun=0]
    [h:radImmun=0]
    [h:thunImmun=0]
    [h:abjImmun=0]
    [h:conjImmun=0]
    [h:divImmun=0]
    [h:enchImmun=0]
    [h:evocImmun=0]
    [h:illImmun=0]
    [h:necImmun=0]
    [h:tranImmun=0]

[h:disIsImmun=if(IsImmun,"junkVar|Information about Damage Immunities||LABEL|SPAN=TRUE","")]
[h:disbludgImmun=if(IsImmun,"bludgImmun| "+listTypeImmun+" | Immune to Bludgeoning Damage | LIST","")]
[h:dispierceImmun=if(IsImmun,"pierceImmun| "+listTypeImmun+" | Immune to Piercing Damage | LIST","")]
[h:disslashImmun=if(IsImmun,"slashImmun| "+listTypeImmun+" | Immune to Slashing Damage | LIST","")]
[h:disacidImmun=if(IsImmun,"acidImmun| "+listTypeImmun+" | Immune to Acid Damage | LIST","")]
[h:discoldImmun=if(IsImmun,"coldImmun| "+listTypeImmun+" | Immune to Cold Damage | LIST","")]
[h:disfireImmun=if(IsImmun,"fireImmun| "+listTypeImmun+" | Immune to Fire Damage | LIST","")]
[h:disforceImmun=if(IsImmun,"forceImmun| "+listTypeImmun+" | Immune to Force Damage | LIST","")]
[h:dislightImmun=if(IsImmun,"lightImmun| "+listTypeImmun+" | Immune to Lightning Damage | LIST","")]
[h:disnecroImmun=if(IsImmun,"necroImmun| "+listTypeImmun+" | Immune to Necrotic Damage | LIST","")]
[h:dispoisImmun=if(IsImmun,"poisImmun| "+listTypeImmun+" | Immune to Poison Damage | LIST","")]
[h:dispsychImmun=if(IsImmun,"psychImmun| "+listTypeImmun+" | Immune to Psychic Damage | LIST","")]
[h:disradImmun=if(IsImmun,"radImmun| "+listTypeImmun+" | Immune to Radiant Damage | LIST","")]
[h:disthunImmun=if(IsImmun,"thunImmun| "+listTypeImmun+" | Immune to Thunder Damage | LIST","")]
[h:disImmunBars=if(IsImmun,"junkVar|---------------------------------------------------------------||LABEL|SPAN=TRUE","")]
[h:disabjImmun=if(IsImmun,"abjImmun| "+listTypeImmun+" | Immune to Abjuration Spell Damage | LIST","")]
[h:disconjImmun=if(IsImmun,"conjImmun| "+listTypeImmun+" | Immune to Conjuration Spell Damage | LIST","")]
[h:disdivImmun=if(IsImmun,"divImmun| "+listTypeImmun+" | Immune to Divination Spell Damage | LIST","")]
[h:disenchImmun=if(IsImmun,"enchImmun| "+listTypeImmun+" | Immune to Enchantment Spell Damage | LIST","")]
[h:disevocImmun=if(IsImmun,"evocImmun| "+listTypeImmun+" | Immune to Evocation Spell Damage | LIST","")]
[h:disillImmun=if(IsImmun,"illImmun| "+listTypeImmun+" | Immune to Illusion Spell Damage | LIST","")]
[h:disnecImmun=if(IsImmun,"necImmun| "+listTypeImmun+" | Immune to Necromancy Spell Damage | LIST","")]
[h:distranImmun=if(IsImmun,"tranImmun| "+listTypeImmun+" | Immune to Transmutation Spell Damage | LIST","")]

[h:ImmunChoice=input(
    ""+disIsImmun+"",
    ""+disbludgImmun+"",
    ""+dispierceImmun+"",
    ""+disslashImmun+"",
    ""+disacidImmun+"",
    ""+discoldImmun+"",
    ""+disfireImmun+"",
    ""+disforceImmun+"",
    ""+dislightImmun+"",
    ""+disnecroImmun+"",
    ""+dispoisImmun+"",
    ""+dispsychImmun+"",
    ""+disradImmun+"",
    ""+disthunImmun+"",
    ""+disImmunBars+"",
    ""+disabjImmun+"",
    ""+disconjImmun+"",
    ""+disdivImmun+"",
    ""+disenchImmun+"",
    ""+disevocImmun+"",
    ""+disillImmun+"",
    ""+disnecImmun+"",
    ""+distranImmun+""
    )]
[h:abort(ImmunChoice)]

[h:ImmunData=json.set("",
    "bludgImmun",bludgImmun,
    "pierceImmun",pierceImmun,
    "slashImmun",slashImmun,
    "acidImmun",acidImmun,
    "coldImmun",coldImmun,
    "fireImmun",fireImmun,
    "forceImmun",forceImmun,
    "lightImmun",lightImmun,
    "necroImmun",necroImmun,
    "poisImmun",poisImmun,
    "psychImmun",psychImmun,
    "radImmun",radImmun,
    "thunImmun",thunImmun,
    "abjImmun",abjImmun,
    "conjImmun",conjImmun,
    "divImmun",divImmun,
    "enchImmun",enchImmun,
    "evocImmun",evocImmun,
    "illImmun",illImmun,
    "necImmun",necImmun,
    "tranImmun",tranImmun
    )]

    [h:listTypeAbsorb="No,Physical,Magical,All"]
    [h:bludgAbsorb=0]
    [h:pierceAbsorb=0]
    [h:slashAbsorb=0]
    [h:acidAbsorb=0]
    [h:coldAbsorb=0]
    [h:fireAbsorb=0]
    [h:forceAbsorb=0]
    [h:lightAbsorb=0]
    [h:necroAbsorb=0]
    [h:poisAbsorb=0]
    [h:psychAbsorb=0]
    [h:radAbsorb=0]
    [h:thunAbsorb=0]
    [h:abjAbsorb=0]
    [h:conjAbsorb=0]
    [h:divAbsorb=0]
    [h:enchAbsorb=0]
    [h:evocAbsorb=0]
    [h:illAbsorb=0]
    [h:necAbsorb=0]
    [h:tranAbsorb=0]

[h:disIsAbsorb=if(IsAbsorb,"junkVar|Information about Damage Absorption||LABEL|SPAN=TRUE","")]
[h:disbludgAbsorb=if(IsAbsorb,"bludgAbsorb| "+listTypeAbsorb+" | Absorbs Bludgeoning Damage | LIST","")]
[h:dispierceAbsorb=if(IsAbsorb,"pierceAbsorb| "+listTypeAbsorb+" | Absorbs Piercing Damage | LIST","")]
[h:disslashAbsorb=if(IsAbsorb,"slashAbsorb| "+listTypeAbsorb+" | Absorbs Slashing Damage | LIST","")]
[h:disacidAbsorb=if(IsAbsorb,"acidAbsorb| "+listTypeAbsorb+" | Absorbs Acid Damage | LIST","")]
[h:discoldAbsorb=if(IsAbsorb,"coldAbsorb| "+listTypeAbsorb+" | Absorbs Cold Damage | LIST","")]
[h:disfireAbsorb=if(IsAbsorb,"fireAbsorb| "+listTypeAbsorb+" | Absorbs Fire Damage | LIST","")]
[h:disforceAbsorb=if(IsAbsorb,"forceAbsorb| "+listTypeAbsorb+" | Absorbs Force Damage | LIST","")]
[h:dislightAbsorb=if(IsAbsorb,"lightAbsorb| "+listTypeAbsorb+" | Absorbs Lightning Damage | LIST","")]
[h:disnecroAbsorb=if(IsAbsorb,"necroAbsorb| "+listTypeAbsorb+" | Absorbs Necrotic Damage | LIST","")]
[h:dispoisAbsorb=if(IsAbsorb,"poisAbsorb| "+listTypeAbsorb+" | Absorbs Poison Damage | LIST","")]
[h:dispsychAbsorb=if(IsAbsorb,"psychAbsorb| "+listTypeAbsorb+" | Absorbs Psychic Damage | LIST","")]
[h:disradAbsorb=if(IsAbsorb,"radAbsorb| "+listTypeAbsorb+" | Absorbs Radiant Damage | LIST","")]
[h:disthunAbsorb=if(IsAbsorb,"thunAbsorb| "+listTypeAbsorb+" | Absorbs Thunder Damage | LIST","")]
[h:disAbsorbBars=if(IsAbsorb,"junkVar|---------------------------------------------------------------||LABEL|SPAN=TRUE","")]
[h:disabjAbsorb=if(IsAbsorb,"abjAbsorb| "+listTypeAbsorb+" | Absorbs Abjuration Spell Damage | LIST","")]
[h:disconjAbsorb=if(IsAbsorb,"conjAbsorb| "+listTypeAbsorb+" | Absorbs Conjuration Spell Damage | LIST","")]
[h:disdivAbsorb=if(IsAbsorb,"divAbsorb| "+listTypeAbsorb+" | Absorbs Divination Spell Damage | LIST","")]
[h:disenchAbsorb=if(IsAbsorb,"enchAbsorb| "+listTypeAbsorb+" | Absorbs Enchantment Spell Damage | LIST","")]
[h:disevocAbsorb=if(IsAbsorb,"evocAbsorb| "+listTypeAbsorb+" | Absorbs Evocation Spell Damage | LIST","")]
[h:disillAbsorb=if(IsAbsorb,"illAbsorb| "+listTypeAbsorb+" | Absorbs Illusion Spell Damage | LIST","")]
[h:disnecAbsorb=if(IsAbsorb,"necAbsorb| "+listTypeAbsorb+" | Absorbs Necromancy Spell Damage | LIST","")]
[h:distranAbsorb=if(IsAbsorb,"tranAbsorb| "+listTypeAbsorb+" | Absorbs Transmutation Spell Damage | LIST","")]

[h:AbsorbChoice=input(
    ""+disIsAbsorb+"",
    ""+disbludgAbsorb+"",
    ""+dispierceAbsorb+"",
    ""+disslashAbsorb+"",
    ""+disacidAbsorb+"",
    ""+discoldAbsorb+"",
    ""+disfireAbsorb+"",
    ""+disforceAbsorb+"",
    ""+dislightAbsorb+"",
    ""+disnecroAbsorb+"",
    ""+dispoisAbsorb+"",
    ""+dispsychAbsorb+"",
    ""+disradAbsorb+"",
    ""+disthunAbsorb+"",
    ""+disAbsorbBars+"",
    ""+disabjAbsorb+"",
    ""+disconjAbsorb+"",
    ""+disdivAbsorb+"",
    ""+disenchAbsorb+"",
    ""+disevocAbsorb+"",
    ""+disillAbsorb+"",
    ""+disnecAbsorb+"",
    ""+distranAbsorb+""
    )]
[h:abort(AbsorbChoice)]

[h:AbsorbData=json.set("",
    "bludgAbsorb",bludgAbsorb,
    "pierceAbsorb",pierceAbsorb,
    "slashAbsorb",slashAbsorb,
    "acidAbsorb",acidAbsorb,
    "coldAbsorb",coldAbsorb,
    "fireAbsorb",fireAbsorb,
    "forceAbsorb",forceAbsorb,
    "lightAbsorb",lightAbsorb,
    "necroAbsorb",necroAbsorb,
    "poisAbsorb",poisAbsorb,
    "psychAbsorb",psychAbsorb,
    "radAbsorb",radAbsorb,
    "thunAbsorb",thunAbsorb,
    "abjAbsorb",abjAbsorb,
    "conjAbsorb",conjAbsorb,
    "divAbsorb",divAbsorb,
    "enchAbsorb",enchAbsorb,
    "evocAbsorb",evocAbsorb,
    "illAbsorb",illAbsorb,
    "necAbsorb",necAbsorb,
    "tranAbsorb",tranAbsorb
    )]

    [h:listTypeDR="No,Physical,Magical,All"]
    [h:bludgDR=0]
    [h:pierceDR=0]
    [h:slashDR=0]
    [h:acidDR=0]
    [h:coldDR=0]
    [h:fireDR=0]
    [h:forceDR=0]
    [h:lightDR=0]
    [h:necroDR=0]
    [h:poisDR=0]
    [h:psychDR=0]
    [h:radDR=0]
    [h:thunDR=0]
    [h:abjDR=0]
    [h:conjDR=0]
    [h:divDR=0]
    [h:enchDR=0]
    [h:evocDR=0]
    [h:illDR=0]
    [h:necDR=0]
    [h:tranDR=0]

[h:disIsDR=if(IsDR,"junkVar|Information about Damage Reduction||LABEL|SPAN=TRUE","")]
[h:disbludgDR=if(IsDR,"bludgDR| "+listTypeDR+" | Damage Reduction for Bludgeoning Damage | LIST","")]
[h:dispierceDR=if(IsDR,"pierceDR| "+listTypeDR+" | Damage Reduction for Piercing Damage | LIST","")]
[h:disslashDR=if(IsDR,"slashDR| "+listTypeDR+" | Damage Reduction for Slashing Damage | LIST","")]
[h:disacidDR=if(IsDR,"acidDR| "+listTypeDR+" | Damage Reduction for Acid Damage | LIST","")]
[h:discoldDR=if(IsDR,"coldDR| "+listTypeDR+" | Damage Reduction for Cold Damage | LIST","")]
[h:disfireDR=if(IsDR,"fireDR| "+listTypeDR+" | Damage Reduction for Fire Damage | LIST","")]
[h:disforceDR=if(IsDR,"forceDR| "+listTypeDR+" | Damage Reduction for Force Damage | LIST","")]
[h:dislightDR=if(IsDR,"lightDR| "+listTypeDR+" | Damage Reduction for Lightning Damage | LIST","")]
[h:disnecroDR=if(IsDR,"necroDR| "+listTypeDR+" | Damage Reduction for Necrotic Damage | LIST","")]
[h:dispoisDR=if(IsDR,"poisDR| "+listTypeDR+" | Damage Reduction for Poison Damage | LIST","")]
[h:dispsychDR=if(IsDR,"psychDR| "+listTypeDR+" | Damage Reduction for Psychic Damage | LIST","")]
[h:disradDR=if(IsDR,"radDR| "+listTypeDR+" | Damage Reduction for Radiant Damage | LIST","")]
[h:disthunDR=if(IsDR,"thunDR| "+listTypeDR+" | Damage Reduction for Thunder Damage | LIST","")]
[h:disDRBars=if(IsDR,"junkVar|---------------------------------------------------------------||LABEL|SPAN=TRUE","")]
[h:disabjDR=if(IsDR,"abjDR| "+listTypeDR+" | Damage Reduction for Abjuration Spell Damage | LIST","")]
[h:disconjDR=if(IsDR,"conjDR| "+listTypeDR+" | Damage Reduction for Conjuration Spell Damage | LIST","")]
[h:disdivDR=if(IsDR,"divDR| "+listTypeDR+" | Damage Reduction for Divination Spell Damage | LIST","")]
[h:disenchDR=if(IsDR,"enchDR| "+listTypeDR+" | Damage Reduction for Enchantment Spell Damage | LIST","")]
[h:disevocDR=if(IsDR,"evocDR| "+listTypeDR+" | Damage Reduction for Evocation Spell Damage | LIST","")]
[h:disillDR=if(IsDR,"illDR| "+listTypeDR+" | Damage Reduction for Illusion Spell Damage | LIST","")]
[h:disnecDR=if(IsDR,"necDR| "+listTypeDR+" | Damage Reduction for Necromancy Spell Damage | LIST","")]
[h:distranDR=if(IsDR,"tranDR| "+listTypeDR+" | Damage Reduction for Transmutation Spell Damage | LIST","")]

[h:DRChoice=input(
    ""+disIsDR+"",
    ""+disbludgDR+"",
    ""+dispierceDR+"",
    ""+disslashDR+"",
    ""+disacidDR+"",
    ""+discoldDR+"",
    ""+disfireDR+"",
    ""+disforceDR+"",
    ""+dislightDR+"",
    ""+disnecroDR+"",
    ""+dispoisDR+"",
    ""+dispsychDR+"",
    ""+disradDR+"",
    ""+disthunDR+"",
    ""+disDRBars+"",
    ""+disabjDR+"",
    ""+disconjDR+"",
    ""+disdivDR+"",
    ""+disenchDR+"",
    ""+disevocDR+"",
    ""+disillDR+"",
    ""+disnecDR+"",
    ""+distranDR+""
    )]
[h:abort(DRChoice)]

[h:DRData=json.set("",
    "bludgDR",bludgDR,
    "pierceDR",pierceDR,
    "slashDR",slashDR,
    "acidDR",acidDR,
    "coldDR",coldDR,
    "fireDR",fireDR,
    "forceDR",forceDR,
    "lightDR",lightDR,
    "necroDR",necroDR,
    "poisDR",poisDR,
    "psychDR",psychDR,
    "radDR",radDR,
    "thunDR",thunDR,
    "abjDR",abjDR,
    "conjDR",conjDR,
    "divDR",divDR,
    "enchDR",enchDR,
    "evocDR",evocDR,
    "illDR",illDR,
    "necDR",necDR,
    "tranDR",tranDR
    )]

	[h:DRTest=0]
    [h,foreach(DamageType,DRData),CODE:{[h:DRTest=if(json.get(DRData,DamageType)==0,DRTest,DRTest+1)]}]

    [h:bludgDRamnt=0]
    [h:pierceDRamnt=0]
    [h:slashDRamnt=0]
    [h:acidDRamnt=0]
    [h:coldDRamnt=0]
    [h:fireDRamnt=0]
    [h:forceDRamnt=0]
    [h:lightDRamnt=0]
    [h:necroDRamnt=0]
    [h:poisDRamnt=0]
    [h:psychDRamnt=0]
    [h:radDRamnt=0]
    [h:thunDRamnt=0]
    [h:abjDRamnt=0]
    [h:conjDRamnt=0]
    [h:divDRamnt=0]
    [h:enchDRamnt=0]
    [h:evocDRamnt=0]
    [h:illDRamnt=0]
    [h:necDRamnt=0]
    [h:tranDRamnt=0]

[h:disIsDRamnt=if(DRTest>0,"junkVar|Information about Damage Reduction Amount||LABEL|SPAN=TRUE","")]
[h:disbludgDRamnt=if(bludgDR>0,"bludgDRamnt| "+listSpellLevel+",10 | Damage Reduction for Bludgeoning Damage | LIST | SELECT=1","")]
[h:dispierceDRamnt=if(pierceDR>0,"pierceDRamnt| "+listSpellLevel+",10 | Damage Reduction for Piercing Damage | LIST | SELECT=1","")]
[h:disslashDRamnt=if(slashDR>0,"slashDRamnt| "+listSpellLevel+",10 | Damage Reduction for Slashing Damage | LIST | SELECT=1","")]
[h:disacidDRamnt=if(acidDR>0,"acidDRamnt| "+listSpellLevel+",10 | Damage Reduction for Acid Damage | LIST | SELECT=1","")]
[h:discoldDRamnt=if(coldDR>0,"coldDRamnt| "+listSpellLevel+",10 | Damage Reduction for Cold Damage | LIST | SELECT=1","")]
[h:disfireDRamnt=if(fireDR>0,"fireDRamnt| "+listSpellLevel+",10 | Damage Reduction for Fire Damage | LIST | SELECT=1","")]
[h:disforceDRamnt=if(forceDR>0,"forceDRamnt| "+listSpellLevel+",10 | Damage Reduction for Force Damage | LIST | SELECT=1","")]
[h:dislightDRamnt=if(lightDR>0,"lightDRamnt| "+listSpellLevel+",10 | Damage Reduction for Lightning Damage | LIST | SELECT=1","")]
[h:disnecroDRamnt=if(necroDR>0,"necroDRamnt| "+listSpellLevel+",10 | Damage Reduction for Necrotic Damage | LIST | SELECT=1","")]
[h:dispoisDRamnt=if(poisDR>0,"poisDRamnt| "+listSpellLevel+",10 | Damage Reduction for Poison Damage | LIST | SELECT=1","")]
[h:dispsychDRamnt=if(psychDR>0,"psychDRamnt| "+listSpellLevel+",10 | Damage Reduction for Psychic Damage | LIST | SELECT=1","")]
[h:disradDRamnt=if(radDR>0,"radDRamnt| "+listSpellLevel+",10 | Damage Reduction for Radiant Damage | LIST | SELECT=1","")]
[h:disthunDRamnt=if(thunDR>0,"thunDRamnt| "+listSpellLevel+",10 | Damage Reduction for Thunder Damage | LIST | SELECT=1","")]
[h:disDRamntBars=if(DRTest>0,"junkVar|---------------------------------------------------------------||LABEL|SPAN=TRUE","")]
[h:disabjDRamnt=if(abjDR>0,"abjDRamnt| "+listSpellLevel+",10 | Damage Reduction for Abjuration Spell Damage | LIST | SELECT=1","")]
[h:disconjDRamnt=if(conjDR>0,"conjDRamnt| "+listSpellLevel+",10 | Damage Reduction for Conjuration Spell Damage | LIST | SELECT=1","")]
[h:disdivDRamnt=if(divDR>0,"divDRamnt| "+listSpellLevel+",10 | Damage Reduction for Divination Spell Damage | LIST | SELECT=1","")]
[h:disenchDRamnt=if(enchDR>0,"enchDRamnt| "+listSpellLevel+",10 | Damage Reduction for Enchantment Spell Damage | LIST | SELECT=1","")]
[h:disevocDRamnt=if(evocDR>0,"evocDRamnt| "+listSpellLevel+",10 | Damage Reduction for Evocation Spell Damage | LIST | SELECT=1","")]
[h:disillDRamnt=if(illDR>0,"illDRamnt| "+listSpellLevel+",10 | Damage Reduction for Illusion Spell Damage | LIST | SELECT=1","")]
[h:disnecDRamnt=if(necDR>0,"necDRamnt| "+listSpellLevel+",10 | Damage Reduction for Necromancy Spell Damage | LIST | SELECT=1","")]
[h:distranDRamnt=if(tranDR>0,"tranDRamnt| "+listSpellLevel+",10 | Damage Reduction for Transmutation Spell Damage | LIST | SELECT=1","")]

[h:DRamntChoice=input(
    ""+disIsDRamnt+"",
    ""+disbludgDRamnt+"",
    ""+dispierceDRamnt+"",
    ""+disslashDRamnt+"",
    ""+disacidDRamnt+"",
    ""+discoldDRamnt+"",
    ""+disfireDRamnt+"",
    ""+disforceDRamnt+"",
    ""+dislightDRamnt+"",
    ""+disnecroDRamnt+"",
    ""+dispoisDRamnt+"",
    ""+dispsychDRamnt+"",
    ""+disradDRamnt+"",
    ""+disthunDRamnt+"",
    ""+disDRamntBars+"",
    ""+disabjDRamnt+"",
    ""+disconjDRamnt+"",
    ""+disdivDRamnt+"",
    ""+disenchDRamnt+"",
    ""+disevocDRamnt+"",
    ""+disillDRamnt+"",
    ""+disnecDRamnt+"",
    ""+distranDRamnt+""
    )]
[h:abort(DRamntChoice)]

[h:DRamntData=json.set("",
    "bludgDRamnt",bludgDRamnt,
    "pierceDRamnt",pierceDRamnt,
    "slashDRamnt",slashDRamnt,
    "acidDRamnt",acidDRamnt,
    "coldDRamnt",coldDRamnt,
    "fireDRamnt",fireDRamnt,
    "forceDRamnt",forceDRamnt,
    "lightDRamnt",lightDRamnt,
    "necroDRamnt",necroDRamnt,
    "poisDRamnt",poisDRamnt,
    "psychDRamnt",psychDRamnt,
    "radDRamnt",radDRamnt,
    "thunDRamnt",thunDRamnt,
    "abjDRamnt",abjDRamnt,
    "conjDRamnt",conjDRamnt,
    "divDRamnt",divDRamnt,
    "enchDRamnt",enchDRamnt,
    "evocDRamnt",evocDRamnt,
    "illDRamnt",illDRamnt,
    "necDRamnt",necDRamnt,
    "tranDRamnt",tranDRamnt
    )]

    [h:blindCondImmun=0]
    [h:charmCondImmun=0]
    [h:confuseCondImmun=0]
    [h:deafCondImmun=0]
    [h:diseaseCondImmun=0]
    [h:frightCondImmun=0]
    [h:grappleCondImmun=0]
    [h:incapCondImmun=0]
    [h:paraCondImmun=0]
    [h:petrifyCondImmun=0]
    [h:poisCondImmun=0]
    [h:proneCondImmun=0]
    [h:restrCondImmun=0]
    [h:stunCondImmun=0]
    [h:surpCondImmun=0]
    [h:turnCondImmun=0]
    [h:unconcCondImmun=0]

[h:disIsCondImmun=if(IsCondImmun,"junkVar|Information about Condition Immunities||LABEL|SPAN=TRUE","")]
[h:disblindCondImmun=if(IsCondImmun,"blindCondImmun| | Immune to Blinded | CHECK","")]
[h:discharmCondImmun=if(IsCondImmun,"charmCondImmun| | Immune to Charmed | CHECK","")]
[h:disconfuseCondImmun=if(IsCondImmun,"confuseCondImmun| | Immune to Confused | CHECK","")]
[h:disdeafCondImmun=if(IsCondImmun,"deafCondImmun| | Immune to Deafened | CHECK","")]
[h:disdiseaseCondImmun=if(IsCondImmun,"diseaseCondImmun| | Immune to Diseased | CHECK","")]
[h:disfrightCondImmun=if(IsCondImmun,"frightCondImmun| | Immune to Frightened | CHECK","")]
[h:disgrappleCondImmun=if(IsCondImmun,"grappleCondImmun| | Immune to Grappled | CHECK","")]
[h:disincapCondImmun=if(IsCondImmun,"incapCondImmun| | Immune to Incapacitated | CHECK","")]
[h:disparaCondImmun=if(IsCondImmun,"paraCondImmun| | Immune to Paralyzed | CHECK","")]
[h:dispetrifyCondImmun=if(IsCondImmun,"petrifyCondImmun| | Immune to Petrified | CHECK","")]
[h:dispoisCondImmun=if(IsCondImmun,"poisCondImmun| | Immune to Poisoned | CHECK","")]
[h:disproneCondImmun=if(IsCondImmun,"proneCondImmun| | Immune to Prone | CHECK","")]
[h:disrestrCondImmun=if(IsCondImmun,"restrCondImmun| | Immune to Restrained | CHECK","")]
[h:disstunCondImmun=if(IsCondImmun,"stunCondImmun| | Immune to Stunned | CHECK","")]
[h:dissurpCondImmun=if(IsCondImmun,"surpCondImmun| | Immune to Surprised | CHECK","")]
[h:disturnCondImmun=if(IsCondImmun,"turnCondImmun| | Immune to Turned | CHECK","")]
[h:disunconcCondImmun=if(IsCondImmun,"unconcCondImmun| | Immune to Unconscious | CHECK","")]

[h:CondImmunChoice=input(
	""+disIsCondImmun+"",
	""+disblindCondImmun+"",
	""+discharmCondImmun+"",
	""+disconfuseCondImmun+"",
	""+disdeafCondImmun+"",
	""+disdiseaseCondImmun+"",
	""+disfrightCondImmun+"",
	""+disgrappleCondImmun+"",
	""+disincapCondImmun+"",
	""+disparaCondImmun+"",
	""+dispetrifyCondImmun+"",
	""+dispoisCondImmun+"",
	""+disproneCondImmun+"",
	""+disrestrCondImmun+"",
	""+disstunCondImmun+"",
	""+dissurpCondImmun+"",
	""+disturnCondImmun+"",
	""+disunconcCondImmun+""
	)]
[h:abort(CondImmunChoice)]

[h:CondImmunData=json.set("",
    "blindCondImmun",blindCondImmun,
    "charmCondImmun",charmCondImmun,
    "confuseCondImmun",confuseCondImmun,
    "deafCondImmun",deafCondImmun,
    "diseaseCondImmun",diseaseCondImmun,
    "frightCondImmun",frightCondImmun,
    "grappleCondImmun",grappleCondImmun,
    "incapCondImmun",incapCondImmun,
    "paraCondImmun",paraCondImmun,
    "petrifyCondImmun",petrifyCondImmun,
    "poisCondImmun",poisCondImmun,
    "proneCondImmun",proneCondImmun,
    "restrCondImmun",restrCondImmun,
    "stunCondImmun",stunCondImmun,
    "surpCondImmun",surpCondImmun,
    "turnCondImmun",turnCondImmun,
    "unconcCondImmun",unconcCondImmun
    )]

    [h:MaxHPBonus="0"]
    [h:MaxHPSet="0"]
    [h:MaxHPSetOverride="-1"]

[h:disMaxHPBonus=if(IsMaxHP,"MaxHPBonus |  | Maximum HP Bonus ","")]
[h:disMaxHPSet=if(IsMaxHP,"MaxHPSet | N/A | Set Maximum HP","")]
[h:disMaxHPOverride=if(IsMaxHP,"MaxHPSetOverride | N/A | Set Maximum HP - Overrides Higher Max HP","")]

[h:HPSelect=input(
	""+disMaxHPBonus+"",
	""+disMaxHPSet+"",
	""+disMaxHPOverride+""
	)]
	[h:abort(HPSelect)]

	[h:MaxHPBonus=number(MaxHPBonus)]
	[h:MaxHPSet=number(if(MaxHPSet=="N/A","0",MaxHPSet))]
	[h:MaxHPSetOverride=number(if(MaxHPSetOverride=="N/A","-1",MaxHPSetOverride))]

[h:HPData=json.set("",
    "MaxHPBonus",MaxHPBonus,
    "MaxHPSet",MaxHPSet,
    "MaxHPSetOverride",MaxHPSetOverride)]

    [h:ACBonus=0]
    [h:ACSet=0]
    [h:ACSetOverride=0]

[h:disACBonus=if(IsAC,"ACBonus | "+listStatBonus+" | AC Bonus | LIST | VALUE=STRING SELECT=10","")]
[h:disACSet=if(IsAC,"ACSet | N/A,"+listDamageDieNumber+" | Sets AC | LIST ","")]
[h:disACOverride=if(IsAC,"ACSetOverride | N/A,"+listDamageDieNumber+" | Sets AC - Overrides Higher ACs | LIST ","")]

[h:ACSelect=input(
	""+disACBonus+"",
	""+disACSet+"",
	""+disACOverride+""
	)]
	[h:abort(ACSelect)]

	[h:ACSet=max(0,(ACSet-1))]
	[h:ACSetOverride=ACSetOverride-1]

[h:ACData=json.set("",
    "ACBonus",ACBonus,
    "ACSet",ACSet,
    "ACSetOverride",ACSetOverride)]

[h:listSpeedBonus="-60,-55,-50,-45,-40,-35,-30,-25,-20,-15,-10,-5,0,5,10,15,20,25,30,35,40,45,50,55,60"]
[h:listSpeedMultiplier="Quartered,Halved,None,Doubled,Tripled,Quadrupled"]
[h:listSpeedSet="N/A,0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120"]

    [h:SpeedBonus="0"]
    [h:SpeedMultiplier="1"]
    [h:SpeedSet="0"]
    [h:SpeedSetOverride="-1"]
    [h:IsBurrow="0"]
    [h:BurrowBonus="0"]
    [h:BurrowMultiplier="1"]
    [h:BurrowSet="0"]
    [h:BurrowSetOverride="-1"]
    [h:IsClimb="0"]
    [h:ClimbBonus="0"]
    [h:ClimbMultiplier="1"]
    [h:ClimbSet="0"]
    [h:ClimbSetOverride="-1"]
    [h:IsFly="0"]
    [h:FlyBonus="0"]
    [h:FlyMultiplier="1"]
    [h:FlySet="0"]
    [h:FlySetOverride="-1"]
    [h:IsHover="0"]
    [h:IsSwim="0"]
    [h:SwimBonus="0"]
    [h:SwimMultiplier="1"]
    [h:SwimSet="0"]
    [h:SwimSetOverride="-1"]

[h:disSpeedBonus=if(IsSpeed,"SpeedBonus | "+listSpeedBonus+" | Speed Bonus | LIST | VALUE=STRING SELECT=12","")]
[h:disSpeedMultiplier=if(IsSpeed,"SpeedMultiplier | "+listSpeedMultiplier+" | Speed Multiplier from Base | LIST | VALUE=STRING SELECT=2","")]
[h:disSpeedSet=if(IsSpeed,"SpeedSet | "+listSpeedSet+" | Sets Speed | LIST | VALUE=STRING","")]
[h:disSpeedSetOverride=if(IsSpeed,"SpeedSetOverride | "+listSpeedSet+" | Sets Speed - Overrides Higher Distances | LIST | VALUE=STRING","")]

[h:disBurrowSpeed=if(IsSpeedSpec,"junkVar | -------------------------- | Data for Burrowing Speed | LABEL","")]
[h:disIsBurrowSpeed=if(IsSpeedSpec,"IsBurrow |  | Gives Burrow Speed Equal to Walking Speed | CHECK","")]
[h:disBurrowBonus=if(IsSpeedSpec,"BurrowBonus | "+listSpeedBonus+" | Burrow Bonus | LIST | VALUE=STRING SELECT=12","")]
[h:disBurrowMultiplier=if(IsSpeedSpec,"BurrowMultiplier | "+listSpeedMultiplier+" | Burrow Speed Multiplier | LIST | VALUE=STRING SELECT=2","")]
[h:disBurrowSet=if(IsSpeedSpec,"BurrowSet | "+listSpeedSet+" | Sets Burrow Speed | LIST | VALUE=STRING","")]
[h:disBurrowOverride=if(IsSpeedSpec,"BurrowSetOverride | "+listSpeedSet+" | Sets Burrow Speed - Overrides Higher Distances | LIST | VALUE=STRING","")]

[h:disClimbSpeed=if(IsSpeedSpec,"junkVar | -------------------------- | Data for Climbing Speed | LABEL","")]
[h:disIsClimbSpeed=if(IsSpeedSpec,"IsClimb |  | Gives Climb Speed Equal to Walking Speed | CHECK","")]
[h:disClimbBonus=if(IsSpeedSpec,"ClimbBonus | "+listSpeedBonus+" | Climb Bonus | LIST | VALUE=STRING SELECT=12","")]
[h:disClimbMultiplier=if(IsSpeedSpec,"ClimbMultiplier | "+listSpeedMultiplier+" | Climb Speed Multiplier | LIST | VALUE=STRING SELECT=2","")]
[h:disClimbSet=if(IsSpeedSpec,"ClimbSet | "+listSpeedSet+" | Sets Climb Speed | LIST | VALUE=STRING","")]
[h:disClimbOverride=if(IsSpeedSpec,"ClimbSetOverride | "+listSpeedSet+" | Sets Climb Speed - Overrides Higher Distances | LIST | VALUE=STRING","")]

[h:disFlySpeed=if(IsSpeedSpec,"junkVar | -------------------------- | Data for Flying Speed | LABEL","")]
[h:disIsFlySpeed=if(IsSpeedSpec,"IsFly |  | Gives Fly Speed Equal to Walking Speed | CHECK","")]
[h:disFlyBonus=if(IsSpeedSpec,"FlyBonus | "+listSpeedBonus+" | Fly Bonus | LIST | VALUE=STRING SELECT=12","")]
[h:disFlyMultiplier=if(IsSpeedSpec,"FlyMultiplier | "+listSpeedMultiplier+" | Fly Speed Multiplier | LIST | VALUE=STRING SELECT=2","")]
[h:disFlySet=if(IsSpeedSpec,"FlySet | "+listSpeedSet+" | Sets Fly Speed | LIST | VALUE=STRING","")]
[h:disFlyOverride=if(IsSpeedSpec,"FlySetOverride | "+listSpeedSet+" | Sets Fly Speed - Overrides Higher Distances | LIST | VALUE=STRING","")]
[h:disIsHover=if(IsSpeedSpec,"IsHover |  | Also Grants Hovering | CHECK","")]

[h:disSwimSpeed=if(IsSpeedSpec,"junkVar | -------------------------- | Data for Swimming Speed | LABEL","")]
[h:disIsSwimSpeed=if(IsSpeedSpec,"IsSwim |  | Gives Swim Speed Equal to Walking Speed | CHECK","")]
[h:disSwimBonus=if(IsSpeedSpec,"SwimBonus | "+listSpeedBonus+" | Swim Bonus | LIST | VALUE=STRING SELECT=12","")]
[h:disSwimMultiplier=if(IsSpeedSpec,"SwimMultiplier | "+listSpeedMultiplier+" | Swim Speed Multiplier | LIST | VALUE=STRING SELECT=2","")]
[h:disSwimSet=if(IsSpeedSpec,"SwimSet | "+listSpeedSet+" | Sets Swim Speed | LIST | VALUE=STRING","")]
[h:disSwimOverride=if(IsSpeedSpec,"SwimSetOverride | "+listSpeedSet+" | Sets Swim Speed - Overrides Higher Distances | LIST | VALUE=STRING","")]

[h: MovementSelect = input(
	""+disSpeedBonus+"",
	""+disSpeedMultiplier+"",
	""+disSpeedSet+"",
	""+disSpeedSetOverride+"",
	""+disBurrowSpeed+"",
	""+disIsBurrowSpeed+"",
	""+disBurrowBonus+"",
	""+disBurrowMultiplier+"",
	""+disBurrowSet+"",
	""+disBurrowOverride+"",
	""+disClimbSpeed+"",
	""+disIsClimbSpeed+"",
	""+disClimbBonus+"",
	""+disClimbMultiplier+"",
	""+disClimbSet+"",
	""+disClimbOverride+"",
	""+disFlySpeed+"",
	""+disIsFlySpeed+"",
	""+disFlyBonus+"",
	""+disFlyMultiplier+"",
	""+disFlySet+"",
	""+disFlyOverride+"",
	""+disIsHover+"",
	""+disSwimSpeed+"",
	""+disIsSwimSpeed+"",
	""+disSwimBonus+"",
	""+disSwimMultiplier+"",
	""+disSwimSet+"",
	""+disSwimOverride+""
	)]
	[h:abort(MovementSelect)]

	[h:SpeedBonus=number(SpeedBonus)]
	[h:SpeedSet=number(if(SpeedSet=="N/A","0",SpeedSet))]
	[h:SpeedSetOverride=number(if(SpeedSetOverride=="N/A","-1",SpeedSetOverride))]
	[h:SpeedMultiplier=if(SpeedMultiplier=="Quartered",(1/4),if(SpeedMultiplier=="Halved",(1/2),if(SpeedMultiplier=="None",1,if(SpeedMultiplier=="Doubled",2,if(SpeedMultiplier=="Tripled",3,if(SpeedMultiplier=="Quadrupled",4,1))))))]
    [h:BurrowBonus=number(BurrowBonus)]
    [h:BurrowSet=number(if(BurrowSet=="N/A","0",BurrowSet))]
    [h:BurrowSetOverride=number(if(BurrowSetOverride=="N/A","-1",BurrowSetOverride))]
    [h:BurrowMultiplier=if(BurrowMultiplier=="Quartered",(1/4),if(BurrowMultiplier=="Halved",(1/2),if(BurrowMultiplier=="None",1,if(BurrowMultiplier=="Doubled",2,if(BurrowMultiplier=="Tripled",3,if(BurrowMultiplier=="Quadrupled",4,1))))))]
    [h:ClimbBonus=number(ClimbBonus)]
    [h:ClimbSet=number(if(ClimbSet=="N/A","0",ClimbSet))]
    [h:ClimbSetOverride=number(if(ClimbSetOverride=="N/A","-1",ClimbSetOverride))]
    [h:ClimbMultiplier=if(ClimbMultiplier=="Quartered",(1/4),if(ClimbMultiplier=="Halved",(1/2),if(ClimbMultiplier=="None",1,if(ClimbMultiplier=="Doubled",2,if(ClimbMultiplier=="Tripled",3,if(ClimbMultiplier=="Quadrupled",4,1))))))]
    [h:FlyBonus=number(FlyBonus)]
    [h:FlySet=number(if(FlySet=="N/A","0",FlySet))]
    [h:FlySetOverride=number(if(FlySetOverride=="N/A","-1",FlySetOverride))]
    [h:FlyMultiplier=if(FlyMultiplier=="Quartered",(1/4),if(FlyMultiplier=="Halved",(1/2),if(FlyMultiplier=="None",1,if(FlyMultiplier=="Doubled",2,if(FlyMultiplier=="Tripled",3,if(FlyMultiplier=="Quadrupled",4,1))))))]
    [h:SwimBonus=number(SwimBonus)]
    [h:SwimSet=number(if(SwimSet=="N/A","0",SwimSet))]
    [h:SwimSetOverride=number(if(SwimSetOverride=="N/A","-1",SwimSetOverride))]
    [h:SwimMultiplier=if(SwimMultiplier=="Quartered",(1/4),if(SwimMultiplier=="Halved",(1/2),if(SwimMultiplier=="None",1,if(SwimMultiplier=="Doubled",2,if(SwimMultiplier=="Tripled",3,if(SwimMultiplier=="Quadrupled",4,1))))))]
	
[h:MoveData=json.set("",
    "SpeedBonus",SpeedBonus,
    "SpeedMultiplier",SpeedMultiplier,
    "SpeedSet",SpeedSet,
    "SpeedSetOverride",SpeedSetOverride,
    "IsBurrow",IsBurrow,
    "BurrowMultiplier",BurrowMultiplier,
    "BurrowBonus",BurrowBonus,
    "BurrowSet",BurrowSet,
    "BurrowSetOverride",BurrowSetOverride,
    "IsClimb",IsClimb,
    "ClimbMultiplier",ClimbMultiplier,
    "ClimbBonus",ClimbBonus,
    "ClimbSet",ClimbSet,
    "ClimbSetOverride",ClimbSetOverride,
    "IsFly",IsFly,
    "FlyMultiplier",FlyMultiplier,
    "FlyBonus",FlyBonus,
    "FlySet",FlySet,
    "FlySetOverride",FlySetOverride,
    "IsHover",IsHover,
    "IsSwim",IsSwim,
    "SwimMultiplier",SwimMultiplier,
    "SwimBonus",SwimBonus,
    "SwimSet",SwimSet,
    "SwimSetOverride",SwimSetOverride)]

        [h:CantripAtkBonus=0]
        [h:CantripAtkAdv=0]
        [h:CantripAtkDis=0]
        [h:CantripCritBonus=0]
        [h:CantripCritBonusDice=0]
        [h:CantripCritBonusStacking=0]
        [h:CantripCritEffect=0]
        [h:CantripDCBonus=0]
        [h:CantripDamageRollNum=0]
        [h:CantripDamageRollSize=0]
        [h:CantripDamageBonus=0]
        [h:CantripDamageBonusType=0]
        [h:CantripMessage=0]
        [h:allCantrips=1]
        [h:bludgCantrips=0]
        [h:pierceCantrips=0]
        [h:slashCantrips=0]
        [h:acidCantrips=0]
        [h:coldCantrips=0]
        [h:fireCantrips=0]
        [h:forceCantrips=0]
        [h:lightCantrips=0]
        [h:necroCantrips=0]
        [h:poisCantrips=0]
        [h:psychCantrips=0]
        [h:radCantrips=0]
        [h:thunCantrips=0]
        [h:allCantripSchool=1]
        [h:abjCantripSchool=0]
        [h:cnjrCantripSchool=0]
        [h:dvntCantripSchool=0]
        [h:enchCantripSchool=0]
        [h:evoCantripSchool=0]
        [h:illuCantripSchool=0]
        [h:necroCantripSchool=0]
        [h:transCantripSchool=0]
    
	
	[h:disIsCantrips=if(IsCantrips,"junkVar | -------------------------- | Data for Cantrip Bonuses | LABEL","")]
	[h:disIsCantripAtkBonus=if(IsCantrips,"CantripAtkBonus |"+listStatBonus+" | Grants Cantrip Attack Bonus | LIST | VALUE=STRING SELECT=10","")]
	[h:disIsCantripAtkAdv=if(IsCantrips,"CantripAtkAdv |  | Grants Cantrip Attack Advantage | Check ","")]
	[h:disIsCantripAtkDis=if(IsCantrips,"CantripAtkDis |  | Grants Cantrip Attack Disadvantage | Check ","")]
    [h:disIsCantripCritBonusDice=if(IsCantrips,"CantripCritBonusDice | 0,1,2,3,4,5 | Increases Number of Damage Dice Rolled on Crits | LIST ","")]
    [h:disIsCantripCritBonus=if(IsCantrips,"CantripCritBonus | 0,1,2,3,4,5 | Crit Chance Increased by | LIST  ","")]
    [h:disIsCantripCritBonusStacking=if(IsCantrips,"CantripCritBonusStacking | 0,1,2,3,4,5 | Crit Chance Increased by (Stacks with Other Effects) | LIST ","")]
	[h:disIsCantripCritEffect=if(IsCantrips,"CantripCritEffect |  | Other Message Occurs on Cantrip Attack Crits | ","")]
	[h:disIsCantripDCBonus=if(IsCantrips,"CantripDCBonus | "+listStatBonus+" | Grants Cantrip Save DC Bonus | LIST | VALUE=STRING SELECT=10 ","")]
	[h:disIsCantripDamageRollNum=if(IsCantrips,"CantripDamageRollNum | "+listDamageDieNumber+" | Bonus Cantrip Damage via Die Roll - Number of Dice | LIST | VALUE=STRING  ","")]
	[h:disIsCantripDamageRollSize=if(IsCantrips,"CantripDamageRollSize | "+listDamageDieSize+" | Bonus Cantrip Damage via Die Roll - Size of Dice | LIST | VALUE=STRING ","")]
	[h:disIsCantripDamageBonus=if(IsCantrips,"CantripDamageBonus |  | Grants Bonus Cantrip Damage via Flat Bonus | Check ","")]
	[h:disIsCantripDamageBonusType=if(IsCantrips,"CantripDamageBonusType | Same as Spell,Slashing,Piercing,Bludgeoning,Acid,Cold,Fire,Force,Healing,Lightning,Necrotic,Poison,Psychic,Radiant,Temp HP,Thunder | Damage Type of Bonus Damage or Healing | LIST | VALUE=STRING ","")]
	[h:disIsCantripMessage=if(IsCantrips,"CantripMessage |  | Other Message Occurs on Casting Cantrips | ","")]

	[h:disIsCantripsType=if(IsCantripsTypeDependent,"junkVar | -------------------------- | Data for Cantrip Bonuses Dependent on Damage Type | LABEL","")]
	[h:disIsCantripsTypeAll=if(IsCantripsTypeDependent,"allCantrips| | Applies to All Damage Types | CHECK","")]
	[h:disIsCantripsTypeBludg=if(IsCantripsTypeDependent,"bludgCantrips| | Applies to Bludgeoning Damage | CHECK","")]
	[h:disIsCantripsTypePierce=if(IsCantripsTypeDependent,"pierceCantrips| | Applies to Piercing Damage | CHECK","")]
	[h:disIsCantripsTypeSlash=if(IsCantripsTypeDependent,"slashCantrips| | Applies to Slashing Damage | CHECK","")]
	[h:disIsCantripsTypeAcid=if(IsCantripsTypeDependent,"acidCantrips| | Applies to Acid Damage | CHECK","")]
	[h:disIsCantripsTypeCold=if(IsCantripsTypeDependent,"coldCantrips| | Applies to Cold Damage | CHECK","")]
	[h:disIsCantripsTypeFire=if(IsCantripsTypeDependent,"fireCantrips| | Applies to Fire Damage | CHECK","")]
	[h:disIsCantripsTypeForce=if(IsCantripsTypeDependent,"forceCantrips| | Applies to Force Damage | CHECK","")]
	[h:disIsCantripsTypeLight=if(IsCantripsTypeDependent,"lightCantrips| | Applies to Lightning Damage | CHECK","")]
	[h:disIsCantripsTypeNecro=if(IsCantripsTypeDependent,"necroCantrips| | Applies to Necrotic Damage | CHECK","")]
	[h:disIsCantripsTypePois=if(IsCantripsTypeDependent,"poisCantrips| | Applies to Poison Damage | CHECK","")]
	[h:disIsCantripsTypePsych=if(IsCantripsTypeDependent,"psychCantrips| | Applies to Psychic Damage | CHECK","")]
	[h:disIsCantripsTypeRad=if(IsCantripsTypeDependent,"radCantrips| | Applies to Radiant Damage | CHECK","")]
	[h:disIsCantripsTypeThun=if(IsCantripsTypeDependent,"thunCantrips| | Applies to Thunder Damage | CHECK","")]

	[h:disIsCantripsSchool=if(IsCantripsSchoolDependent,"junkVar | -------------------------- | Data for Cantrip Bonuses Dependent on Spell School | LABEL","")]
	[h:disIsCantripsSchoolAll=if(IsCantripsSchoolDependent,"allCantripSchool| | Applies to All Spell Schools | CHECK","")]
	[h:disIsCantripsSchoolAbj=if(IsCantripsSchoolDependent,"abjCantripSchool| | Applies to Abjuration Cantrips | CHECK","")]
	[h:disIsCantripsSchoolCnjr=if(IsCantripsSchoolDependent,"cnjrCantripSchool| | Applies to Conjuration Cantrips | CHECK","")]
	[h:disIsCantripsSchoolDvnt=if(IsCantripsSchoolDependent,"dvntCantripSchool| | Applies to Divination Cantrips | CHECK","")]
	[h:disIsCantripsSchoolEnch=if(IsCantripsSchoolDependent,"enchCantripSchool| | Applies to Enchantment Cantrips | CHECK","")]
	[h:disIsCantripsSchoolEvo=if(IsCantripsSchoolDependent,"evoCantripSchool| | Applies to Evocation Cantrips | CHECK","")]
	[h:disIsCantripsSchoolIllu=if(IsCantripsSchoolDependent,"illuCantripSchool| | Applies to Illusion Cantrips | CHECK","")]
	[h:disIsCantripsSchoolNecro=if(IsCantripsSchoolDependent,"necroCantripSchool| | Applies to Necromancy Cantrips | CHECK","")]
	[h:disIsCantripsSchoolTrans=if(IsCantripsSchoolDependent,"transCantripSchool| | Applies to Transmutation Cantrips | CHECK","")]
	
	[h:CantripSelect=input(
		""+disIsCantrips+"",
		""+disIsCantripAtkBonus+"",
		""+disIsCantripAtkAdv+"",
		""+disIsCantripAtkDis+"",
		""+disIsCantripCritBonusDice+"",
		""+disIsCantripCritBonus+"",
		""+disIsCantripCritBonusStacking+"",
		""+disIsCantripCritEffect+"",
		""+disIsCantripDCBonus+"",
		""+disIsCantripDamageRollNum+"",
		""+disIsCantripDamageRollSize+"",
		""+disIsCantripDamageBonus+"",
		""+disIsCantripDamageBonusType+"",
		""+disIsCantripMessage+"",
		""+disIsCantripsType+"",
		""+disIsCantripsTypeAll+"",
		""+disIsCantripsTypeBludg+"",
		""+disIsCantripsTypePierce+"",
		""+disIsCantripsTypeSlash+"",
		""+disIsCantripsTypeAcid+"",
		""+disIsCantripsTypeCold+"",
		""+disIsCantripsTypeFire+"",
		""+disIsCantripsTypeForce+"",
		""+disIsCantripsTypeLight+"",
		""+disIsCantripsTypeNecro+"",
		""+disIsCantripsTypePois+"",
		""+disIsCantripsTypePsych+"",
		""+disIsCantripsTypeRad+"",
		""+disIsCantripsTypeThun+"",
		""+disIsCantripsSchool+"",
		""+disIsCantripsSchoolAll+"",
		""+disIsCantripsSchoolAbj+"",
		""+disIsCantripsSchoolCnjr+"",
		""+disIsCantripsSchoolDvnt+"",
		""+disIsCantripsSchoolEnch+"",
		""+disIsCantripsSchoolEvo+"",
		""+disIsCantripsSchoolIllu+"",
		""+disIsCantripsSchoolNecro+"",
		""+disIsCantripsSchoolTrans+""
		)]
	[h:abort(CantripSelect)]

[h:CantripData=json.set("",
        "CantripAtkBonus",CantripAtkBonus,
        "CantripAtkAdv",CantripAtkAdv,
        "CantripAtkDis",CantripAtkDis,
        "CantripCritBonusDice",CantripCritBonusDice,
        "CantripCritBonus",CantripCritBonus,
        "CantripCritBonusStacking",CantripCritBonusStacking,
        "CantripCritEffect",CantripCritEffect,
        "CantripDCBonus",CantripDCBonus,
        "CantripDamageRollNum",CantripDamageRollNum,
        "CantripDamageRollSize",CantripDamageRollSize,
        "CantripDamageBonus",CantripDamageBonus,
        "CantripDamageBonusType",CantripDamageBonusType,
        "CantripMessage",CantripMessage,
        "allCantrips",allCantrips,
        "BludgeoningCantrips",bludgCantrips,
        "PiercingCantrips",pierceCantrips,
        "SlashingCantrips",slashCantrips,
        "AcidCantrips",acidCantrips,
        "ColdCantrips",coldCantrips,
        "FireCantrips",fireCantrips,
        "ForceCantrips",forceCantrips,
        "LightningCantrips",lightCantrips,
        "NecroticCantrips",necroCantrips,
        "PoisonCantrips",poisCantrips,
        "PsychicCantrips",psychCantrips,
        "RadiantCantrips",radCantrips,
        "ThunderCantrips",thunCantrips,
        "NoneCantrip",0,
        "allCantripSchool",allCantripSchool,
        "abjurationCantripSchool",abjCantripSchool,
        "conjurationCantripSchool",cnjrCantripSchool,
        "divinationCantripSchool",dvntCantripSchool,
        "enchantmentCantripSchool",enchCantripSchool,
        "evocationCantripSchool",evoCantripSchool,
        "illusionCantripSchool",illuCantripSchool,
        "necromancyCantripSchool",necroCantripSchool,
        "transmutationCantripSchool",transCantripSchool)]
        
        [h:SpellAtkBonus=0]
        [h:SpellAtkAdv=0]
        [h:SpellAtkDis=0]
        [h:SpellCritBonusDice=0]
        [h:SpellCritBonus=0]
        [h:SpellCritBonusStacking=0]
        [h:SpellCritEffect=0]
        [h:SpellDCBonus=0]
        [h:SpellDamageRollNum=0]
        [h:SpellDamageRollSize=0]
        [h:SpellDamageBonus=0]
        [h:SpellDamageBonusType=0]
        [h:SpellMessage=0]
        [h:allSpell=1]
        [h:bludgSpell=0]
        [h:pierceSpell=0]
        [h:slashSpell=0]
        [h:acidSpell=0]
        [h:coldSpell=0]
        [h:fireSpell=0]
        [h:forceSpell=0]
        [h:lightSpell=0]
        [h:necroSpell=0]
        [h:poisSpell=0]
        [h:psychSpell=0]
        [h:radSpell=0]
        [h:thunSpell=0]
        [h:allSpellSchool=1]
        [h:abjSpellSchool=0]
        [h:cnjrSpellSchool=0]
        [h:dvntSpellSchool=0]
        [h:enchSpellSchool=0]
        [h:evoSpellSchool=0]
        [h:illuSpellSchool=0]
        [h:necroSpellSchool=0]
        [h:transSpellSchool=0]
        
	[h:disIsSpell=if(IsSpell,"junkVar | -------------------------- | Data for Spell Bonuses | LABEL","")]
	[h:disIsSpellAtkBonus=if(IsSpell,"SpellAtkBonus | "+listStatBonus+" | Grants Spell Attack Bonus | LIST | VALUE=STRING SELECT=10","")]
	[h:disIsSpellAtkAdv=if(IsSpell,"SpellAtkAdv |  | Grants Spell Attack Advantage | Check ","")]
	[h:disIsSpellAtkDis=if(IsSpell,"SpellAtkDis |  | Grants Spell Attack Disadvantage | Check ","")]
	[h:disIsSpellCritBonusDice=if(IsSpell,"SpellCritBonusDice | 0,1,2,3,4,5 | Increases Number of Damage Dice Rolled on Crits | LIST ","")]
	[h:disIsSpellCritBonus=if(IsSpell,"SpellCritBonus | 0,1,2,3,4,5 | Crit Chance Increased by | LIST  ","")]
	[h:disIsSpellCritBonusStacking=if(IsSpell,"SpellCritBonusStacking | 0,1,2,3,4,5 | Crit Chance Increased by (Stacks with Other Effects) | LIST ","")]
	[h:disIsSpellCritEffect=if(IsSpell,"SpellCritEffect |  | Other Message Occurs on Spell Attack Crits | ","")]
	[h:disIsSpellDCBonus=if(IsSpell,"SpellDCBonus | "+listStatBonus+" | Grants Spell Save DC Bonus | LIST | VALUE=STRING SELECT=10 ","")]
	[h:disIsSpellDamageRollNum=if(IsSpell,"SpellDamageRollNum | "+listDamageDieNumber+" | Bonus Spell Damage via Die Roll - Number of Dice | LIST | VALUE=STRING  ","")]
	[h:disIsSpellDamageRollSize=if(IsSpell,"SpellDamageRollSize | "+listDamageDieSize+" | Bonus Spell Damage via Die Roll - Size of Dice | LIST | VALUE=STRING ","")]
	[h:disIsSpellDamageBonus=if(IsSpell,"SpellDamageBonus | "+listStatBonus+" | Grants Bonus Spell Damage via Flat Bonus | LIST | VALUE=STRING SELECT=10 ","")]
	[h:disIsSpellDamageBonusType=if(IsSpell,"SpellDamageBonusType | Same as Spell,Slashing,Piercing,Bludgeoning,Acid,Cold,Fire,Force,Healing,Lightning,Necrotic,Poison,Psychic,Radiant,Temp HP,Thunder | Damage Type of Bonus Damage or Healing | LIST | VALUE=STRING","")]
	[h:disIsSpellMessage=if(IsSpell,"SpellMessage |  | Other Message Triggers on Casting Spells | ","")]

	[h:disIsSpellType=if(IsSpellTypeDependent,"junkVar | -------------------------- | Data for Spell Bonuses Dependent on Damage Type | LABEL","")]
	[h:disIsSpellTypeAll=if(IsSpellTypeDependent,"allSpell| | Applies to All Damage Types | CHECK","")]
	[h:disIsSpellTypeBludg=if(IsSpellTypeDependent,"bludgSpell| | Applies to Bludgeoning Damage | CHECK","")]
	[h:disIsSpellTypePierce=if(IsSpellTypeDependent,"pierceSpell| | Applies to Piercing Damage | CHECK","")]
	[h:disIsSpellTypeSlash=if(IsSpellTypeDependent,"slashSpell| | Applies to Slashing Damage | CHECK","")]
	[h:disIsSpellTypeAcid=if(IsSpellTypeDependent,"acidSpell| | Applies to Acid Damage | CHECK","")]
	[h:disIsSpellTypeCold=if(IsSpellTypeDependent,"coldSpell| | Applies to Cold Damage | CHECK","")]
	[h:disIsSpellTypeFire=if(IsSpellTypeDependent,"fireSpell| | Applies to Fire Damage | CHECK","")]
	[h:disIsSpellTypeForce=if(IsSpellTypeDependent,"forceSpell| | Applies to Force Damage | CHECK","")]
	[h:disIsSpellTypeLight=if(IsSpellTypeDependent,"lightSpell| | Applies to Lightning Damage | CHECK","")]
	[h:disIsSpellTypeNecro=if(IsSpellTypeDependent,"necroSpell| | Applies to Necrotic Damage | CHECK","")]
	[h:disIsSpellTypePois=if(IsSpellTypeDependent,"poisSpell| | Applies to Poison Damage | CHECK","")]
	[h:disIsSpellTypePsych=if(IsSpellTypeDependent,"psychSpell| | Applies to Psychic Damage | CHECK","")]
	[h:disIsSpellTypeRad=if(IsSpellTypeDependent,"radSpell| | Applies to Radiant Damage | CHECK","")]
	[h:disIsSpellTypeThun=if(IsSpellTypeDependent,"thunSpell| | Applies to Thunder Damage | CHECK","")]

	[h:disIsSpellSchool=if(IsSpellSchoolDependent,"junkVar | -------------------------- | Data for Spell Bonuses Dependent on Spell School | LABEL","")]
	[h:disIsSpellSchoolAll=if(IsSpellSchoolDependent,"allSpellSchool| | Applies to All Spell Schools | CHECK","")]
	[h:disIsSpellSchoolAbj=if(IsSpellSchoolDependent,"abjSpellSchool| | Applies to Abjuration Spells | CHECK","")]
	[h:disIsSpellSchoolCnjr=if(IsSpellSchoolDependent,"cnjrSpellSchool| | Applies to Conjuration Spells | CHECK","")]
	[h:disIsSpellSchoolDvnt=if(IsSpellSchoolDependent,"dvntSpellSchool| | Applies to Divination Spells | CHECK","")]
	[h:disIsSpellSchoolEnch=if(IsSpellSchoolDependent,"enchSpellSchool| | Applies to Enchantment Spells | CHECK","")]
	[h:disIsSpellSchoolEvo=if(IsSpellSchoolDependent,"evoSpellSchool| | Applies to Evocation Spells | CHECK","")]
	[h:disIsSpellSchoolIllu=if(IsSpellSchoolDependent,"illuSpellSchool| | Applies to Illusion Spells | CHECK","")]
	[h:disIsSpellSchoolNecro=if(IsSpellSchoolDependent,"necroSpellSchool| | Applies to Necromancy Spells | CHECK","")]
	[h:disIsSpellSchoolTrans=if(IsSpellSchoolDependent,"transSpellSchool| | Applies to Transmutation Spells | CHECK","")]
	
	[h:SpellSelect=input(
		""+disIsSpell+"",
		""+disIsSpellAtkBonus+"",
		""+disIsSpellAtkAdv+"",
		""+disIsSpellAtkDis+"",
		""+disIsSpellCritBonusDice+"",
		""+disIsSpellCritBonus+"",
		""+disIsSpellCritBonusStacking+"",
		""+disIsSpellCritEffect+"",
		""+disIsSpellDCBonus+"",
		""+disIsSpellDamageRollNum+"",
		""+disIsSpellDamageRollSize+"",
		""+disIsSpellDamageBonus+"",
		""+disIsSpellDamageBonusType+"",
		""+disIsSpellMessage+"",
		""+disIsSpellType+"",
		""+disIsSpellTypeAll+"",
		""+disIsSpellTypeBludg+"",
		""+disIsSpellTypePierce+"",
		""+disIsSpellTypeSlash+"",
		""+disIsSpellTypeAcid+"",
		""+disIsSpellTypeCold+"",
		""+disIsSpellTypeFire+"",
		""+disIsSpellTypeForce+"",
		""+disIsSpellTypeLight+"",
		""+disIsSpellTypeNecro+"",
		""+disIsSpellTypePois+"",
		""+disIsSpellTypePsych+"",
		""+disIsSpellTypeRad+"",
		""+disIsSpellTypeThun+"",
		""+disIsSpellSchool+"",
		""+disIsSpellSchoolAll+"",
		""+disIsSpellSchoolAbj+"",
		""+disIsSpellSchoolCnjr+"",
		""+disIsSpellSchoolDvnt+"",
		""+disIsSpellSchoolEnch+"",
		""+disIsSpellSchoolEvo+"",
		""+disIsSpellSchoolIllu+"",
		""+disIsSpellSchoolNecro+"",
		""+disIsSpellSchoolTrans+""
		)]
	[h:abort(SpellSelect)]
	
[h:SpellData=json.set("",
        "SpellAtkBonus",SpellAtkBonus,
        "SpellAtkAdv",SpellAtkAdv,
        "SpellAtkDis",SpellAtkDis,
        "SpellCritBonusDice",SpellCritBonusDice,
        "SpellCritBonus",SpellCritBonus,
        "SpellCritBonusStacking",SpellCritBonusStacking,
        "SpellCritEffect",SpellCritEffect,
        "SpellDCBonus",SpellDCBonus,
        "SpellDamageRollNum",SpellDamageRollNum,
        "SpellDamageRollSize",SpellDamageRollSize,
        "SpellDamageBonus",SpellDamageBonus,
        "SpellDamageBonusType",SpellDamageBonusType,
        "SpellMessage",SpellMessage,
        "allSpell",allSpell,
        "BludgeoningSpell",bludgSpell,
        "PiercingSpell",pierceSpell,
        "SlashingSpell",slashSpell,
        "AcidSpell",acidSpell,
        "ColdSpell",coldSpell,
        "FireSpell",fireSpell,
        "ForceSpell",forceSpell,
        "LightningSpell",lightSpell,
        "NecroticSpell",necroSpell,
        "PoisonSpell",poisSpell,
        "PsychicSpell",psychSpell,
        "RadiantSpell",radSpell,
        "ThunderSpell",thunSpell,
        "NoneSpell",0,
        "allSpellSchool",allSpellSchool,
        "abjurationSpellSchool",abjSpellSchool,
        "conjurationSpellSchool",cnjrSpellSchool,
        "divinationSpellSchool",dvntSpellSchool,
        "enchantmentSpellSchool",enchSpellSchool,
        "evocationSpellSchool",evoSpellSchool,
        "illusionSpellSchool",illuSpellSchool,
        "necromancySpellSchool",necroSpellSchool,
        "transmutationSpellSchool",transSpellSchool)]
        
        [h:WeaponAtkBonus=0]
        [h:WeaponAtkAdv=0]
        [h:WeaponAtkDis=0]
        [h:WeaponCritBonus=0]
        [h:WeaponCritEffect=""]
        [h:WeaponDamageRollNum=0]
        [h:WeaponDamageRollSize=0]
        [h:WeaponDamageBonus=0]
        [h:WeaponDamageBonusType=""]
    	[h:IsWeaponPropApply=0]
    	[h:IsWeaponPropIgnore=0]
    	[h:WeaponAdditionalAttacks=0]
    	[h:WeaponAdditionalAttacksStacking=0]
    	[h:WeaponCritBonus=0]
    	[h:WeaponCritBonusStacking=0]
    	[h:WeaponCritBonusDice=0]
        [h:WeaponMessage=""]
        [h:allWeapon=1]
        [h:bludgWeapon=0]
        [h:pierceWeapon=0]
        [h:slashWeapon=0]
        [h:acidWeapon=0]
        [h:coldWeapon=0]
        [h:fireWeapon=0]
        [h:forceWeapon=0]
        [h:lightWeapon=0]
        [h:necroWeapon=0]
        [h:poisWeapon=0]
        [h:psychWeapon=0]
        [h:radWeapon=0]
        [h:thunWeapon=0]
        [h:allWeaponType=1]
        [h:unarmedWeaponType=0]
        [h:clubWeaponType=0]
        [h:daggerWeaponType=0]
        [h:greatclubWeaponType=0]
        [h:handaxeWeaponType=0]
        [h:javelinWeaponType=0]
        [h:lighthammerWeaponType=0]
        [h:maceWeaponType=0]
        [h:quarterstaffWeaponType=0]
        [h:sickleWeaponType=0]
        [h:spearWeaponType=0]
        [h:lightcrossbowWeaponType=0]
        [h:dartWeaponType=0]
        [h:shortbowWeaponType=0]
        [h:slingWeaponType=0]
        [h:battleaxeWeaponType=0]
        [h:flailWeaponType=0]
        [h:glaiveWeaponType=0]
        [h:greataxeWeaponType=0]
        [h:greatswordWeaponType=0]
        [h:halberdWeaponType=0]
        [h:lanceWeaponType=0]
        [h:longswordWeaponType=0]
        [h:maulWeaponType=0]
        [h:morningstarWeaponType=0]
        [h:pikeWeaponType=0]
        [h:rapierWeaponType=0]
        [h:scimitarWeaponType=0]
        [h:shortswordWeaponType=0]
        [h:tridentWeaponType=0]
        [h:warpickWeaponType=0]
        [h:warhammerWeaponType=0]
        [h:whipWeaponType=0]
        [h:blowgunWeaponType=0]
        [h:handcrossbowWeaponType=0]
        [h:heavycrossbowWeaponType=0]
        [h:longbowWeaponType=0]
        [h:netWeaponType=0]
        [h:WeaponPropsAll=1]
        [h:WeaponPropsAmmo=0]
        [h:WeaponPropsFinesse=0]
        [h:WeaponPropsMonk=0]
        [h:WeaponPropsHeavy=0]
        [h:WeaponPropsLight=0]
        [h:WeaponPropsLoad=0]
        [h:WeaponPropsReach=0]
        [h:WeaponPropsThrown=0]
        [h:WeaponProps2h=0]
        [h:WeaponPropsVers=0]
        [h:WeaponPropsMagic=0]

    [h:IsWeaponTypeDependent=0]
    [h:WeaponRangeDependent=0]
    [h:IsWeaponSimpleMartialImp=0]
    [h:IsWeaponDependent=0]
    [h:IsWeaponPropsDependent=0]
    
	[h:disIsWeaponConditions=if(IsWeaponEffect,"junkVar | Data for Weapon Attacks - Conditions Which Must be Met to Apply Effects |  | LABEL | SPAN=TRUE ","")]
	[h:disIsWeaponConditionsBars=if(IsWeaponEffect,"junkVar | ---------------------------------------------------- |  | LABEL | SPAN=TRUE ","")]
	[h:disIsWeaponTypeDependent=if(IsWeaponEffect,"IsWeaponTypeDependent |  | Dependent on the Damage Type Done | Check ","")]
	[h:disWeaponRangeDependent=if(IsWeaponEffect,"WeaponRangeDependent | No,Ranged,Melee | Dependent on Ranged vs. Melee Attack | LIST | VALUE=STRING ","")]
	[h:disIsWeaponSimpleMartialImp=if(IsWeaponEffect,"IsWeaponSimpleMartialImp | All,Simple,Martial,Improvised,Simple+Martial,Simple+Improvised,Martial+Improvised | Applies to Simple, Martial, or Improvised Weapons | LIST | VALUE=STRING ","")]
	[h:disIsWeaponDependent=if(IsWeaponEffect,"IsWeaponDependent |  | Only Applies to Specific Weapons | Check ","")]
	[h:disIsWeaponPropsDependent=if(IsWeaponEffect,"IsWeaponPropsDependent |  | Dependent on the Weapon Properties | Check ","")]

	[h:WeaponConditions=input(
		""+disIsWeaponConditions+"",
		""+disIsWeaponConditionsBars+"",
		""+disIsWeaponTypeDependent+"",
		""+disWeaponRangeDependent+"",
		""+disIsWeaponSimpleMartialImp+"",
		""+disIsWeaponDependent+"",
		""+disIsWeaponPropsDependent+""
		)]
	[h:abort(WeaponConditions)]
	
	[h:disIsWeaponEffect=if(IsWeaponEffect,"junkVar | -------------------------- | Data for Weapon Attack Bonuses | LABEL","")]
	[h:disIsWeaponBars=if(IsWeaponEffect,"junkVar | ---------------------------------------------------------------------------------------------------------------- | | LABEL | SPAN=TRUE","")]
	[h:disIsWeaponAtkBonus=if(IsWeaponEffect,"WeaponAtkBonus | "+listStatBonus+"  | Weapon Attack Bonus | LIST | VALUE=STRING SELECT=10 ","")]
	[h:disWeaponAdditionalAttacks=if(IsWeaponEffect,"WeaponAdditionalAttacks | 0,1,2,3,4,5 | Additional Attacks | LIST ","")]
	[h:disWeaponAdditionalAttacksStacking=if(IsWeaponEffect,"WeaponAdditionalAttacksStacking | 0,1,2,3,4,5 | Additional Attacks (Stacks with Other Effects) | LIST ","")]
	[h:disIsWeaponAtkAdv=if(IsWeaponEffect,"WeaponAtkAdv |  | Grants Weapon Attack Advantage | Check ","")]
	[h:disIsWeaponAtkDis=if(IsWeaponEffect,"WeaponAtkDis |  | Grants Weapon Attack Disadvantage | Check ","")]
	[h:disIsWeaponDamageRollNum=if(IsWeaponEffect,"WeaponDamageRollNum | "+listDamageDieNumber+" | Bonus Spell Damage via Die Roll - Number of Dice | LIST | VALUE=STRING ","")]
	[h:disIsWeaponDamageRollSize=if(IsWeaponEffect,"WeaponDamageRollSize | "+listDamageDieSize+" | Bonus Weapon Damage via Die Roll - Size of Dice | LIST | VALUE=STRING ","")]
	[h:disIsWeaponDamageBonus=if(IsWeaponEffect,"WeaponDamageBonus | "+listStatBonus+" | Flat Weapon Damage Bonus | LIST | VALUE=STRING SELECT=10","")]
	[h:disIsWeaponDamageBonusType=if(IsWeaponEffect,"WeaponDamageBonusType | Same as Weapon,Slashing,Piercing,Bludgeoning,Acid,Cold,Fire,Force,Lightning,Necrotic,Poison,Psychic,Radiant,Thunder | Damage Type of Bonus Damage | LIST | VALUE=STRING ","")]
	[h:disIsWeaponCritBonusDice=if(IsWeaponEffect,"WeaponCritBonusDice | 0,1,2,3,4,5 | Increases Number of Weapon Damage Dice Rolled on Crits | LIST ","")]
	[h:disIsWeaponCritBonus=if(IsWeaponEffect,"WeaponCritBonus | 0,1,2,3,4,5 | Crit Chance Increased by | LIST ","")]
	[h:disIsWeaponCritBonusStacking=if(IsWeaponEffect,"WeaponCritBonusStacking | 0,1,2,3,4,5 | Crit Chance Increased by (Stacks with Other Effects) | LIST ","")]
	[h:disIsWeaponCritEffect=if(IsWeaponEffect,"WeaponCritEffect |  | Message Occurs on Crits ","")]
	[h:disIsWeaponMessage=if(IsWeaponEffect,"WeaponMessage |  | Message After Weapon Attacks ","")]
	[h:disIsWeaponPropIgnore=if(IsWeaponEffect,"IsWeaponPropIgnore |  | Allows You to Ignore Certain Properties of Weapons | Check ","")]
	[h:disIsWeaponPropAdd=if(IsWeaponEffect,"IsWeaponPropApply |  | Allows You to Apply Certain Properties of Weapons | Check ","")]

	[h:WeaponSelect=input(
		""+disIsWeaponEffect+"",
		""+disIsWeaponAtkBonus+"",
		""+disIsWeaponAtkAdv+"",
		""+disIsWeaponAtkDis+"",
		""+disIsWeaponBars+"",
		""+disWeaponAdditionalAttacks+"",
		""+disWeaponAdditionalAttacksStacking+"",
		""+disIsWeaponBars+"",
		""+disIsWeaponCritBonus+"",
		""+disIsWeaponCritBonusStacking+"",
		""+disIsWeaponCritEffect+"",
		""+disIsWeaponBars+"",
		""+disIsWeaponDamageRollNum+"",
		""+disIsWeaponDamageRollSize+"",
		""+disIsWeaponDamageBonus+"",
		""+disIsWeaponDamageBonusType+"",
		""+disIsWeaponBars+"",
		""+disIsWeaponMessage+"",
		""+disIsWeaponBars+"",
		""+disIsWeaponPropIgnore+"",
		""+disIsWeaponPropAdd+""
		)]
		[h:abort(WeaponSelect)]

	[h:disIsWeaponPropIgnoreBars=if(IsWeaponPropIgnore,"junkVar | -------------------------- | Data for Ignoring Properties of Weapons | LABEL","")]
	[h:disPropIgnoreAmmo=if(IsWeaponPropIgnore,"PropIgnoreAmmo |  | Ignore the Ammunition Property of Weapons | Check ","")]
	[h:disPropIgnoreFinesse=if(IsWeaponPropIgnore,"PropIgnoreFinesse |  | Ignore the Finesse Property of Weapons | Check ","")]
	[h:disPropIgnoreMonk=if(IsWeaponPropIgnore,"PropIgnoreMonk |  | Ignore the Monk Property of Weapons | Check ","")]
	[h:disPropIgnoreHeavy=if(IsWeaponPropIgnore,"PropIgnoreHeavy |  | Ignore the Heavy Property of Weapons | Check ","")]
	[h:disPropIgnoreLight=if(IsWeaponPropIgnore,"PropIgnoreLight |  | Ignore the Light Property of Weapons | Check ","")]
	[h:disPropIgnoreLoad=if(IsWeaponPropIgnore,"PropIgnoreLoad |  | Ignore the Loading Property of Weapons | Check ","")]
	[h:disPropIgnoreReach=if(IsWeaponPropIgnore,"PropIgnoreReach |  | Ignore the Reach Property of Weapons | Check ","")]
	[h:disPropIgnoreThrown=if(IsWeaponPropIgnore,"PropIgnoreThrown |  | Ignore the Thrown Property of Weapons | Check ","")]
	[h:disPropIgnore2h=if(IsWeaponPropIgnore,"PropIgnore2h |  | Ignore the Two-Handed Property of Weapons | Check ","")]
	[h:disPropIgnoreVers=if(IsWeaponPropIgnore,"PropIgnoreVers |  | Ignore the Versatile Property of Weapons | Check ","")]
	[h:disPropIgnoreMagic=if(IsWeaponPropIgnore,"PropIgnoreMagic |  | Ignore the Magical Property of Weapons | Check ","")]

	[h:disIsWeaponPropApplyBars=if(IsWeaponPropApply,"junkVar | -------------------------- | Data for Applying Properties of Weapons | LABEL","")]
    [h:disPropApplyAmmo=if(IsWeaponPropApply,"PropApplyAmmo |  | Apply the Ammunition Property to Weapons | Check ","")]
    [h:disPropApplyFinesse=if(IsWeaponPropApply,"PropApplyFinesse |  | Apply the Finesse Property to Weapons | Check ","")]
    [h:disPropApplyMonk=if(IsWeaponPropApply,"PropApplyMonk |  | Apply the Monk Property to Weapons | Check ","")]
    [h:disPropApplyHeavy=if(IsWeaponPropApply,"PropApplyHeavy |  | Apply the Heavy Property to Weapons | Check ","")]
    [h:disPropApplyLight=if(IsWeaponPropApply,"PropApplyLight |  | Apply the Light Property to Weapons | Check ","")]
    [h:disPropApplyLoad=if(IsWeaponPropApply,"PropApplyLoad |  | Apply the Loading Property to Weapons | Check ","")]
    [h:disPropApplyReach=if(IsWeaponPropApply,"PropApplyReach |  | Apply the Reach Property to Weapons | Check ","")]
    [h:disPropApplyThrown=if(IsWeaponPropApply,"PropApplyThrown |  | Apply the Thrown Property to Weapons | Check ","")]
    [h:disPropApply2h=if(IsWeaponPropApply,"PropApply2h |  | Apply the Two-Handed Property to Weapons | Check ","")]
    [h:disPropApplyVers=if(IsWeaponPropApply,"PropApplyVers |  | Apply the Versatile Property to Weapons | Check ","")]
    [h:disPropApplyMagic=if(IsWeaponPropApply,"PropApplyMagic |  | Apply the Magical Property to Weapons | Check ","")]

	[h:disIsWeaponType=if(IsWeaponTypeDependent,"junkVar | -------------------------- | Data for Weapon Bonuses Dependent on Damage Type | LABEL","")]
	[h:disIsWeaponTypeAll=if(IsWeaponTypeDependent,"allWeapon| | Applies to All Damage Types | CHECK","")]
	[h:disIsWeaponTypeBludg=if(IsWeaponTypeDependent,"bludgWeapon| | Applies to Bludgeoning Damage | CHECK","")]
	[h:disIsWeaponTypePierce=if(IsWeaponTypeDependent,"pierceWeapon| | Applies to Piercing Damage | CHECK","")]
	[h:disIsWeaponTypeSlash=if(IsWeaponTypeDependent,"slashWeapon| | Applies to Slashing Damage | CHECK","")]
	[h:disIsWeaponTypeAcid=if(IsWeaponTypeDependent,"acidWeapon| | Applies to Acid Damage | CHECK","")]
	[h:disIsWeaponTypeCold=if(IsWeaponTypeDependent,"coldWeapon| | Applies to Cold Damage | CHECK","")]
	[h:disIsWeaponTypeFire=if(IsWeaponTypeDependent,"fireWeapon| | Applies to Fire Damage | CHECK","")]
	[h:disIsWeaponTypeForce=if(IsWeaponTypeDependent,"forceWeapon| | Applies to Force Damage | CHECK","")]
	[h:disIsWeaponTypeLight=if(IsWeaponTypeDependent,"lightWeapon| | Applies to Lightning Damage | CHECK","")]
	[h:disIsWeaponTypeNecro=if(IsWeaponTypeDependent,"necroWeapon| | Applies to Necrotic Damage | CHECK","")]
	[h:disIsWeaponTypePois=if(IsWeaponTypeDependent,"poisWeapon| | Applies to Poison Damage | CHECK","")]
	[h:disIsWeaponTypePsych=if(IsWeaponTypeDependent,"psychWeapon| | Applies to Psychic Damage | CHECK","")]
	[h:disIsWeaponTypeRad=if(IsWeaponTypeDependent,"radWeapon| | Applies to Radiant Damage | CHECK","")]
	[h:disIsWeaponTypeThun=if(IsWeaponTypeDependent,"thunWeapon| | Applies to Thunder Damage | CHECK","")]

	[h:disIsWeaponDependent=if(IsWeaponDependent,"junkVar | -------------------------- | Data for Weapon Bonuses to Specific Weapons | LABEL","")]
	[h:disIsUnarmedWeaponType=if(IsWeaponDependent,"unarmedWeaponType| | Applies to Unarmed Strikes | CHECK","")]
	[h:disIsClubWeaponType=if(IsWeaponDependent,"clubWeaponType| | Applies to Clubs | CHECK","")]
	[h:disIsDaggerWeaponType=if(IsWeaponDependent,"daggerWeaponType| | Applies to Daggers | CHECK","")]
	[h:disIsGreatclubWeaponType=if(IsWeaponDependent,"greatclubWeaponType| | Applies to Greatclubs | CHECK","")]
	[h:disIsHandaxeWeaponType=if(IsWeaponDependent,"handaxeWeaponType| | Applies to Handaxes | CHECK","")]
	[h:disIsJavelinWeaponType=if(IsWeaponDependent,"javelinWeaponType| | Applies to Javelins | CHECK","")]
	[h:disIsLightHammerWeaponType=if(IsWeaponDependent,"lighthammerWeaponType| | Applies to Light Hammers | CHECK","")]
	[h:disIsMaceWeaponType=if(IsWeaponDependent,"maceWeaponType| | Applies to Maces | CHECK","")]
	[h:disIsQuarterstaffWeaponType=if(IsWeaponDependent,"quarterstaffWeaponType| | Applies to Quarterstaves | CHECK","")]
	[h:disIsSickleWeaponType=if(IsWeaponDependent,"sickleWeaponType| | Applies to Sickles | CHECK","")]
	[h:disIsSpearWeaponType=if(IsWeaponDependent,"spearWeaponType| | Applies to Spears | CHECK","")]
	[h:disIsLightCrossbowWeaponType=if(IsWeaponDependent,"lightcrossbowWeaponType| | Applies to Light Crossbows | CHECK","")]
	[h:disIsDartWeaponType=if(IsWeaponDependent,"dartWeaponType| | Applies to Darts | CHECK","")]
	[h:disIsShortbowWeaponType=if(IsWeaponDependent,"shortbowWeaponType| | Applies to Shortbows | CHECK","")]
	[h:disIsSlingWeaponType=if(IsWeaponDependent,"slingWeaponType| | Applies to Slings | CHECK","")]
	[h:disIsBattleaxeWeaponType=if(IsWeaponDependent,"battleaxeWeaponType| | Applies to Battleaxes | CHECK","")]
	[h:disIsFlailWeaponType=if(IsWeaponDependent,"flailWeaponType| | Applies to Flails | CHECK","")]
	[h:disIsGlaiveWeaponType=if(IsWeaponDependent,"glaiveWeaponType| | Applies to Glaives | CHECK","")]
	[h:disIsGreataxeWeaponType=if(IsWeaponDependent,"greataxeWeaponType| | Applies to Greataxes | CHECK","")]
	[h:disIsGreatswordWeaponType=if(IsWeaponDependent,"greatswordWeaponType| | Applies to Greatswords | CHECK","")]
	[h:disIsHalberdWeaponType=if(IsWeaponDependent,"halberdWeaponType| | Applies to Halberds | CHECK","")]
	[h:disIsLanceWeaponType=if(IsWeaponDependent,"lanceWeaponType| | Applies to Lances | CHECK","")]
	[h:disIsLongswordWeaponType=if(IsWeaponDependent,"longswordWeaponType| | Applies to Longswords | CHECK","")]
	[h:disIsMaulWeaponType=if(IsWeaponDependent,"maulWeaponType| | Applies to Mauls | CHECK","")]
	[h:disIsMorningstarWeaponType=if(IsWeaponDependent,"morningstarWeaponType| | Applies to Morningstars | CHECK","")]
	[h:disIsPikeWeaponType=if(IsWeaponDependent,"pikeWeaponType| | Applies to Pikes | CHECK","")]
	[h:disIsRapierWeaponType=if(IsWeaponDependent,"rapierWeaponType| | Applies to Rapiers | CHECK","")]
	[h:disIsScimitarWeaponType=if(IsWeaponDependent,"scimitarWeaponType| | Applies to Scimitars | CHECK","")]
	[h:disIsShortswordWeaponType=if(IsWeaponDependent,"shortswordWeaponType| | Applies to Shortswords | CHECK","")]
	[h:disIsTridentWeaponType=if(IsWeaponDependent,"tridentWeaponType| | Applies to Tridents | CHECK","")]
	[h:disIsWarPickWeaponType=if(IsWeaponDependent,"warpickWeaponType| | Applies to War Picks | CHECK","")]
	[h:disIsWarhammerWeaponType=if(IsWeaponDependent,"warhammerWeaponType| | Applies to Warhammers | CHECK","")]
	[h:disIsWhipWeaponType=if(IsWeaponDependent,"whipWeaponType| | Applies to Whips | CHECK","")]
	[h:disIsBlowgunWeaponType=if(IsWeaponDependent,"blowgunWeaponType| | Applies to Blowguns | CHECK","")]
	[h:disIsHandCrossbowWeaponType=if(IsWeaponDependent,"handcrossbowWeaponType| | Applies to Hand Crossbows | CHECK","")]
	[h:disIsHeavyCrossbowWeaponType=if(IsWeaponDependent,"heavycrossbowWeaponType| | Applies to Heavy Crossbows | CHECK","")]
	[h:disIsLongbowWeaponType=if(IsWeaponDependent,"longbowWeaponType| | Applies to Longbows | CHECK","")]
	[h:disIsNetWeaponType=if(IsWeaponDependent,"netWeaponType| | Applies to Nets | CHECK","")]

	[h:disIsWeaponProps=if(IsWeaponPropsDependent,"junkVar | -------------------------- | Data for Weapon Bonuses Dependent on Weapon Properties | LABEL","")]
	[h:disIsWeaponPropsAmmo=if(IsWeaponPropsDependent,"WeaponPropsAmmo| | Applies to Weapons that Use Ammunition | CHECK","")]
	[h:disIsWeaponPropsFinesse=if(IsWeaponPropsDependent,"WeaponPropsFinesse| | Applies to Finesse Weapons | CHECK","")]
	[h:disIsWeaponPropsMonk=if(IsWeaponPropsDependent,"WeaponPropsMonk| | Applies to Monk Weapons | CHECK","")]
	[h:disIsWeaponPropsHeavy=if(IsWeaponPropsDependent,"WeaponPropsHeavy| | Applies to Heavy Weapons | CHECK","")]
	[h:disIsWeaponPropsLight=if(IsWeaponPropsDependent,"WeaponPropsLight| | Applies to Light Weapons | CHECK","")]
	[h:disIsWeaponPropsLoad=if(IsWeaponPropsDependent,"WeaponPropsLoad| | Applies to Weapons that Require Loading | CHECK","")]
	[h:disIsWeaponPropsReach=if(IsWeaponPropsDependent,"WeaponPropsReach| | Applies to Reach Weapons | CHECK","")]
	[h:disIsWeaponPropsThrown=if(IsWeaponPropsDependent,"WeaponPropsThrown| | Applies to Thrown Weapons | CHECK","")]
	[h:disIsWeaponProps2h=if(IsWeaponPropsDependent,"WeaponProps2h| | Applies to Two-Handed Weapons | CHECK","")]
	[h:disIsWeaponPropsVers=if(IsWeaponPropsDependent,"WeaponPropsVers| | Applies to Versatile Weapons | CHECK","")]
	[h:disIsWeaponPropsMagic=if(IsWeaponPropsDependent,"WeaponPropsMagic| | Applies to Magic Weapons | CHECK","")]
	
        [h:PropIgnoreAmmo=0]
        [h:PropIgnoreFinesse=0]
        [h:PropIgnoreMonk=0]
        [h:PropIgnoreHeavy=0]
        [h:PropIgnoreLight=0]
        [h:PropIgnoreLoad=0]
        [h:PropIgnoreReach=0]
        [h:PropIgnoreThrown=0]
        [h:PropIgnore2h=0]
        [h:PropIgnoreVers=0]
        [h:PropIgnoreMagic=0]
        [h:PropApplyAmmo=0]
        [h:PropApplyFinesse=0]
        [h:PropApplyMonk=0]
        [h:PropApplyHeavy=0]
        [h:PropApplyLight=0]
        [h:PropApplyLoad=0]
        [h:PropApplyReach=0]
        [h:PropApplyThrown=0]
        [h:PropApply2h=0]
        [h:PropApplyVers=0]
        [h:PropApplyMagic=0]
        
	[h:WeaponSelectPropIgnore=input(
		""+disIsWeaponPropIgnoreBars+"",
		""+disPropIgnoreAmmo+"",
		""+disPropIgnoreFinesse+"",
		""+disPropIgnoreMonk+"",
		""+disPropIgnoreHeavy+"",
		""+disPropIgnoreLight+"",
		""+disPropIgnoreLoad+"",
		""+disPropIgnoreReach+"",
		""+disPropIgnoreThrown+"",
		""+disPropIgnore2h+"",
		""+disPropIgnoreVers+"",
		""+disPropIgnoreMagic+""
		)]
		[h:abort(WeaponSelectPropIgnore)]
		
    [h:WeaponSelectPropApply=input(
        ""+disIsWeaponPropApplyBars+"",
        ""+disPropApplyAmmo+"",
        ""+disPropApplyFinesse+"",
        ""+disPropApplyMonk+"",
        ""+disPropApplyHeavy+"",
        ""+disPropApplyLight+"",
        ""+disPropApplyLoad+"",
        ""+disPropApplyReach+"",
        ""+disPropApplyThrown+"",
        ""+disPropApply2h+"",
        ""+disPropApplyVers+"",
        ""+disPropApplyMagic+""
        )]
        [h:abort(WeaponSelectPropApply)]

	[h:WeaponSelectDmgType=input(
		""+disIsWeaponType+"",
		""+disIsWeaponTypeAll+"",
		""+disIsWeaponTypeBludg+"",
		""+disIsWeaponTypePierce+"",
		""+disIsWeaponTypeSlash+"",
		""+disIsWeaponTypeAcid+"",
		""+disIsWeaponTypeCold+"",
		""+disIsWeaponTypeFire+"",
		""+disIsWeaponTypeForce+"",
		""+disIsWeaponTypeLight+"",
		""+disIsWeaponTypeNecro+"",
		""+disIsWeaponTypePois+"",
		""+disIsWeaponTypePsych+"",
		""+disIsWeaponTypeRad+"",
		""+disIsWeaponTypeThun+""
		)]
		[h:abort(WeaponSelectDmgType)]
		
	[h:WeaponSelectType=input(
		""+disIsWeaponDependent+"",
		""+disIsUnarmedWeaponType+"",
		""+disIsClubWeaponType+"",
		""+disIsDaggerWeaponType+"",
		""+disIsGreatclubWeaponType+"",
		""+disIsHandaxeWeaponType+"",
		""+disIsJavelinWeaponType+"",
		""+disIsLightHammerWeaponType+"",
		""+disIsMaceWeaponType+"",
		""+disIsQuarterstaffWeaponType+"",
		""+disIsSickleWeaponType+"",
		""+disIsSpearWeaponType+"",
		""+disIsLightCrossbowWeaponType+"",
		""+disIsDartWeaponType+"",
		""+disIsShortbowWeaponType+"",
		""+disIsSlingWeaponType+"",
		""+disIsBattleaxeWeaponType+"",
		""+disIsFlailWeaponType+"",
		""+disIsGlaiveWeaponType+"",
		""+disIsGreataxeWeaponType+"",
		""+disIsGreatswordWeaponType+"",
		""+disIsHalberdWeaponType+"",
		""+disIsLanceWeaponType+"",
		""+disIsLongswordWeaponType+"",
		""+disIsMaulWeaponType+"",
		""+disIsMorningstarWeaponType+"",
		""+disIsPikeWeaponType+"",
		""+disIsRapierWeaponType+"",
		""+disIsScimitarWeaponType+"",
		""+disIsShortswordWeaponType+"",
		""+disIsTridentWeaponType+"",
		""+disIsWarPickWeaponType+"",
		""+disIsWarhammerWeaponType+"",
		""+disIsWhipWeaponType+"",
		""+disIsBlowgunWeaponType+"",
		""+disIsHandCrossbowWeaponType+"",
		""+disIsHeavyCrossbowWeaponType+"",
		""+disIsLongbowWeaponType+"",
		""+disIsNetWeaponType+""
		)]
		[h:abort(WeaponSelectType)]
	[h:WeaponSelectProps=input(
		""+disIsWeaponProps+"",
		""+disIsWeaponPropsMagic+"",
		""+disIsWeaponPropsFinesse+"",
		""+disIsWeaponPropsMonk+"",
		""+disIsWeaponPropsAmmo+"",
		""+disIsWeaponPropsHeavy+"",
		""+disIsWeaponPropsLight+"",
		""+disIsWeaponPropsLoad+"",
		""+disIsWeaponPropsReach+"",
		""+disIsWeaponPropsThrown+"",
		""+disIsWeaponProps2h+"",
		""+disIsWeaponPropsVers+""
		)]
	[h:abort(WeaponSelectProps)]

	[h:MultiConditionTestWeapon=bludgWeapon+pierceWeapon+slashWeapon+acidWeapon+coldWeapon+fireWeapon+forceWeapon+lightWeapon+necroWeapon+poisWeapon+psychWeapon+radWeapon+thunWeapon+unarmedWeaponType+clubWeaponType+daggerWeaponType+greatclubWeaponType+handaxeWeaponType+javelinWeaponType+lighthammerWeaponType+maceWeaponType+quarterstaffWeaponType+sickleWeaponType+spearWeaponType+lightcrossbowWeaponType+dartWeaponType+shortbowWeaponType+slingWeaponType+battleaxeWeaponType+flailWeaponType+glaiveWeaponType+greataxeWeaponType+greatswordWeaponType+halberdWeaponType+lanceWeaponType+longswordWeaponType+maulWeaponType+morningstarWeaponType+pikeWeaponType+rapierWeaponType+scimitarWeaponType+shortswordWeaponType+tridentWeaponType+warpickWeaponType+warhammerWeaponType+whipWeaponType+blowgunWeaponType+handcrossbowWeaponType+heavycrossbowWeaponType+longbowWeaponType+netWeaponType+WeaponPropsAmmo+WeaponPropsFinesse+WeaponPropsMonk+WeaponPropsHeavy+WeaponPropsLight+WeaponPropsLoad+WeaponPropsReach+WeaponPropsThrown+WeaponProps2h+WeaponPropsVers+WeaponPropsMagic]

	[h:WeaponConditionsAllorOne=1]
	[h:disWeaponConditionsAllorOneLabel=if(MultiConditionTestWeapon>1,"junkVar | Do the conditions required to gain weapon attack bonuses require ALL conditions to be met, or just one of them? | | LABEL | SPAN=TRUE","")]
	[h:disWeaponConditionsAllorOne=if(MultiConditionTestWeapon>1,"WeaponConditionsAllorOne | All,One | e.g. All = Must do fire damage AND be a shortsword, One = do fire damage OR be a shortsword | LIST ","")]

	[h:WeaponsAllorOne=input(
		""+disWeaponConditionsAllorOneLabel+"",
		""+disWeaponConditionsAllorOne+""
		)]

	[h:WeaponData=json.set("",
        "WeaponAtkBonus",WeaponAtkBonus,
        "WeaponAdditionalAttacks",WeaponAdditionalAttacks,
        "WeaponAdditionalAttacksStacking",WeaponAdditionalAttacksStacking,
        "WeaponAtkAdv",WeaponAtkAdv,
        "WeaponAtkDis",WeaponAtkDis,
        "WeaponCritBonusDice",WeaponCritBonusDice,
        "WeaponCritBonus",WeaponCritBonus,
        "WeaponCritBonusStacking",WeaponCritBonusStacking,
        "WeaponCritEffect",WeaponCritEffect,
        "WeaponDamageRollNum",WeaponDamageRollNum,
        "WeaponDamageRollSize",WeaponDamageRollSize,
        "WeaponDamageBonus",WeaponDamageBonus,
        "WeaponDamageBonusType",WeaponDamageBonusType,
        "WeaponMessage",WeaponMessage,
        "allWeapon",allWeapon,
        "BludgeoningWeapon",bludgWeapon,
        "PiercingWeapon",pierceWeapon,
        "SlashingWeapon",slashWeapon,
        "AcidWeapon",acidWeapon,
        "ColdWeapon",coldWeapon,
        "FireWeapon",fireWeapon,
        "ForceWeapon",forceWeapon,
        "LightningWeapon",lightWeapon,
        "NecroticWeapon",necroWeapon,
        "PoisonWeapon",poisWeapon,
        "PsychicWeapon",psychWeapon,
        "RadiantWeapon",radWeapon,
        "ThunderWeapon",thunWeapon,
        "NoneWeapon",0,
        "Unarmed",unarmedWeaponType,
        "Club",clubWeaponType,
        "Dagger",daggerWeaponType,
        "Greatclub",greatclubWeaponType,
        "Handaxe",handaxeWeaponType,
        "Javelin",javelinWeaponType,
        "Light hammer",lighthammerWeaponType,
        "Mace",maceWeaponType,
        "Quarterstaff",quarterstaffWeaponType,
        "Sickle",sickleWeaponType,
        "Spear",spearWeaponType,
        "Light Crossbow",lightcrossbowWeaponType,
        "Dart",dartWeaponType,
        "Shortbow",shortbowWeaponType,
        "Sling",slingWeaponType,
        "Battleaxe",battleaxeWeaponType,
        "Flail",flailWeaponType,
        "Glaive",glaiveWeaponType,
        "Greataxe",greataxeWeaponType,
        "Greatsword",greatswordWeaponType,
        "Halberd",halberdWeaponType,
        "Lance",lanceWeaponType,
        "Longsword",longswordWeaponType,
        "Maul",maulWeaponType,
        "Morningstar",morningstarWeaponType,
        "Pike",pikeWeaponType,
        "Rapier",rapierWeaponType,
        "Scimitar",scimitarWeaponType,
        "Shortsword",shortswordWeaponType,
        "Trident",tridentWeaponType,
        "War Pick",warpickWeaponType,
        "Warhammer",warhammerWeaponType,
        "Whip",whipWeaponType,
        "Blowgun",blowgunWeaponType,
        "Hand Crossbow",handcrossbowWeaponType,
        "Heavy Crossbow",heavycrossbowWeaponType,
        "Longbow",longbowWeaponType,
        "Net",netWeaponType,
        "Custom",0,
        "Magic",WeaponPropsMagic,
        "Finesse",WeaponPropsFinesse,
        "Monk",WeaponPropsMonk,
        "Ammo",WeaponPropsAmmo,
        "Heavy",WeaponPropsHeavy,
        "Light",WeaponPropsLight,
        "Loading",WeaponPropsLoad,
        "Reach",WeaponPropsReach,
        "Thrown",WeaponPropsThrown,
        "Two-Handed",WeaponProps2h,
        "Versatile",WeaponPropsVers,
        "IgnoreAmmo",PropIgnoreAmmo,
        "IgnoreFinesse",PropIgnoreFinesse,
        "IgnoreMonk",PropIgnoreMonk,
        "IgnoreHeavy",PropIgnoreHeavy,
        "IgnoreLight",PropIgnoreLight,
        "IgnoreLoad",PropIgnoreLoad,
        "IgnoreReach",PropIgnoreReach,
        "IgnoreThrown",PropIgnoreThrown,
        "Ignore2h",PropIgnore2h,
        "IgnoreVers",PropIgnoreVers,
        "IgnoreMagic",PropIgnoreMagic,
        "ApplyAmmo",PropApplyAmmo,
        "ApplyFinesse",PropApplyFinesse,
        "ApplyMonk",PropApplyMonk,
        "ApplyHeavy",PropApplyHeavy,
        "ApplyLight",PropApplyLight,
        "ApplyLoad",PropApplyLoad,
        "ApplyReach",PropApplyReach,
        "ApplyThrown",PropApplyThrown,
        "Apply2h",PropApply2h,
        "ApplyVers",PropApplyVers,
        "ApplyMagic",PropApplyMagic,
        "AllorOne",WeaponConditionsAllorOne
        )]

		[h:SimpleWeaponProf=0]
        [h:MartialWeaponProf=0]
        [h:ClubWeaponProf=0]
        [h:DaggerWeaponProf=0]
        [h:GreatclubWeaponProf=0]
        [h:HandaxeWeaponProf=0]
        [h:JavelinWeaponProf=0]
        [h:LightHammerWeaponProf=0]
        [h:MaceWeaponProf=0]
        [h:QuarterstaffWeaponProf=0]
        [h:SickleWeaponProf=0]
        [h:SpearWeaponProf=0]
        [h:LightCrossbowWeaponProf=0]
        [h:DartWeaponProf=0]
        [h:ShortbowWeaponProf=0]
        [h:SlingWeaponProf=0]
        [h:BattleaxeWeaponProf=0]
        [h:FlailWeaponProf=0]
        [h:GlaiveWeaponProf=0]
        [h:GreataxeWeaponProf=0]
        [h:GreatswordWeaponProf=0]
        [h:HalberdWeaponProf=0]
        [h:LanceWeaponProf=0]
        [h:LongswordWeaponProf=0]
        [h:MaulWeaponProf=0]
        [h:MorningstarWeaponProf=0]
        [h:PikeWeaponProf=0]
        [h:RapierWeaponProf=0]
        [h:ScimitarWeaponProf=0]
        [h:ShortswordWeaponProf=0]
        [h:TridentWeaponProf=0]
        [h:WarPickWeaponProf=0]
        [h:WarhammerWeaponProf=0]
        [h:WhipWeaponProf=0]
        [h:BlowgunWeaponProf=0]
        [h:HandCrossbowWeaponProf=0]
        [h:HeavyCrossbowWeaponProf=0]
        [h:LongbowWeaponProf=0]
        [h:NetWeaponProf=0]
        [h:LightArmorProf=0]
        [h:MediumArmorProf=0]
        [h:HeavyArmorProf=0]
        
	[h:disIsWeaponProf=if(IsWeaponProf,"junkVar | -------------------------- | Data for Weapon Proficiencies Granted | LABEL","")]
	[h:disIsSimpleProf=if(IsWeaponProf,"SimpleWeaponProf| | Grants Proficiency in All Simple Weapons | CHECK","")]
	[h:disIsMartialProf=if(IsWeaponProf,"MartialWeaponProf| | Grants Proficiency in All Martial Weapons | CHECK","")]
	[h:disIsClubWeaponProf=if(IsWeaponProf,"ClubWeaponProf| | Grants Proficiency in Clubs | CHECK","")]
    [h:disIsDaggerWeaponProf=if(IsWeaponProf,"DaggerWeaponProf| | Grants Proficiency in Daggers | CHECK","")]
    [h:disIsGreatclubWeaponProf=if(IsWeaponProf,"GreatclubWeaponProf| | Grants Proficiency in Greatclubs | CHECK","")]
    [h:disIsHandaxeWeaponProf=if(IsWeaponProf,"HandaxeWeaponProf| | Grants Proficiency in Handaxes | CHECK","")]
    [h:disIsJavelinWeaponProf=if(IsWeaponProf,"JavelinWeaponProf| | Grants Proficiency in Javelins | CHECK","")]
    [h:disIsLightHammerWeaponProf=if(IsWeaponProf,"LightHammerWeaponProf| | Grants Proficiency in Light Hammers | CHECK","")]
    [h:disIsMaceWeaponProf=if(IsWeaponProf,"MaceWeaponProf| | Grants Proficiency in Maces | CHECK","")]
    [h:disIsQuarterstaffWeaponProf=if(IsWeaponProf,"QuarterstaffWeaponProf| | Grants Proficiency in Quarterstaves | CHECK","")]
    [h:disIsSickleWeaponProf=if(IsWeaponProf,"SickleWeaponProf| | Grants Proficiency in Sickles | CHECK","")]
    [h:disIsSpearWeaponProf=if(IsWeaponProf,"SpearWeaponProf| | Grants Proficiency in Spears | CHECK","")]
    [h:disIsLightCrossbowWeaponProf=if(IsWeaponProf,"LightCrossbowWeaponProf| | Grants Proficiency in Light Crossbows | CHECK","")]
    [h:disIsDartWeaponProf=if(IsWeaponProf,"DartWeaponProf| | Grants Proficiency in Darts | CHECK","")]
    [h:disIsShortbowWeaponProf=if(IsWeaponProf,"ShortbowWeaponProf| | Grants Proficiency in Shortbows | CHECK","")]
    [h:disIsSlingWeaponProf=if(IsWeaponProf,"SlingWeaponProf| | Grants Proficiency in Slings | CHECK","")]
    [h:disIsBattleaxeWeaponProf=if(IsWeaponProf,"BattleaxeWeaponProf| | Grants Proficiency in Battleaxes | CHECK","")]
    [h:disIsFlailWeaponProf=if(IsWeaponProf,"FlailWeaponProf| | Grants Proficiency in Flails | CHECK","")]
    [h:disIsGlaiveWeaponProf=if(IsWeaponProf,"GlaiveWeaponProf| | Grants Proficiency in Glaives | CHECK","")]
    [h:disIsGreataxeWeaponProf=if(IsWeaponProf,"GreataxeWeaponProf| | Grants Proficiency in Greataxes | CHECK","")]
    [h:disIsGreatswordWeaponProf=if(IsWeaponProf,"GreatswordWeaponProf| | Grants Proficiency in Greatswords | CHECK","")]
    [h:disIsHalberdWeaponProf=if(IsWeaponProf,"HalberdWeaponProf| | Grants Proficiency in Halberds | CHECK","")]
    [h:disIsLanceWeaponProf=if(IsWeaponProf,"LanceWeaponProf| | Grants Proficiency in Lances | CHECK","")]
    [h:disIsLongswordWeaponProf=if(IsWeaponProf,"LongswordWeaponProf| | Grants Proficiency in Longswords | CHECK","")]
    [h:disIsMaulWeaponProf=if(IsWeaponProf,"MaulWeaponProf| | Grants Proficiency in Mauls | CHECK","")]
    [h:disIsMorningstarWeaponProf=if(IsWeaponProf,"MorningstarWeaponProf| | Grants Proficiency in Morningstars | CHECK","")]
    [h:disIsPikeWeaponProf=if(IsWeaponProf,"PikeWeaponProf| | Grants Proficiency in Pikes | CHECK","")]
    [h:disIsRapierWeaponProf=if(IsWeaponProf,"RapierWeaponProf| | Grants Proficiency in Rapiers | CHECK","")]
    [h:disIsScimitarWeaponProf=if(IsWeaponProf,"ScimitarWeaponProf| | Grants Proficiency in Scimitars | CHECK","")]
    [h:disIsShortswordWeaponProf=if(IsWeaponProf,"ShortswordWeaponProf| | Grants Proficiency in Shortswords | CHECK","")]
    [h:disIsTridentWeaponProf=if(IsWeaponProf,"TridentWeaponProf| | Grants Proficiency in Tridents | CHECK","")]
    [h:disIsWarPickWeaponProf=if(IsWeaponProf,"WarPickWeaponProf| | Grants Proficiency in War Picks | CHECK","")]
    [h:disIsWarhammerWeaponProf=if(IsWeaponProf,"WarhammerWeaponProf| | Grants Proficiency in Warhammers | CHECK","")]
    [h:disIsWhipWeaponProf=if(IsWeaponProf,"WhipWeaponProf| | Grants Proficiency in Whips | CHECK","")]
    [h:disIsBlowgunWeaponProf=if(IsWeaponProf,"BlowgunWeaponProf| | Grants Proficiency in Blowguns | CHECK","")]
    [h:disIsHandCrossbowWeaponProf=if(IsWeaponProf,"HandCrossbowWeaponProf| | Grants Proficiency in Hand Crossbows | CHECK","")]
    [h:disIsHeavyCrossbowWeaponProf=if(IsWeaponProf,"HeavyCrossbowWeaponProf| | Grants Proficiency in Heavy Crossbows | CHECK","")]
    [h:disIsLongbowWeaponProf=if(IsWeaponProf,"LongbowWeaponProf| | Grants Proficiency in Longbows | CHECK","")]
    [h:disIsNetWeaponProf=if(IsWeaponProf,"NetWeaponProf| | Grants Proficiency in Nets | CHECK","")]

	[h:disIsArmorProf=if(IsArmorProf,"junkVar | -------------------------- | Data for Armor Proficiencies Granted | LABEL","")]
	[h:disIsLightArmorProf=if(IsArmorProf,"LightArmorProf| | Grants Proficiency in Light Armor | CHECK","")]
	[h:disIsMediumArmorProf=if(IsArmorProf,"MediumArmorProf| | Grants Proficiency in Medium Armor | CHECK","")]
	[h:disIsHeavyArmorProf=if(IsArmorProf,"HeavyArmorProf| | Grants Proficiency in Heavy Armor | CHECK","")]
	
	[h:WeaponProfChoice=input(
		""+disIsWeaponProf+"",
		""+disIsSimpleProf+"",
		""+disIsMartialProf+"",
        ""+disIsClubWeaponProf+"",
        ""+disIsDaggerWeaponProf+"",
        ""+disIsGreatclubWeaponProf+"",
        ""+disIsHandaxeWeaponProf+"",
        ""+disIsJavelinWeaponProf+"",
        ""+disIsLightHammerWeaponProf+"",
        ""+disIsMaceWeaponProf+"",
        ""+disIsQuarterstaffWeaponProf+"",
        ""+disIsSickleWeaponProf+"",
        ""+disIsSpearWeaponProf+"",
        ""+disIsLightCrossbowWeaponProf+"",
        ""+disIsDartWeaponProf+"",
        ""+disIsShortbowWeaponProf+"",
        ""+disIsSlingWeaponProf+"",
        ""+disIsBattleaxeWeaponProf+"",
        ""+disIsFlailWeaponProf+"",
        ""+disIsGlaiveWeaponProf+"",
        ""+disIsGreataxeWeaponProf+"",
        ""+disIsGreatswordWeaponProf+"",
        ""+disIsHalberdWeaponProf+"",
        ""+disIsLanceWeaponProf+"",
        ""+disIsLongswordWeaponProf+"",
        ""+disIsMaulWeaponProf+"",
        ""+disIsMorningstarWeaponProf+"",
        ""+disIsPikeWeaponProf+"",
        ""+disIsRapierWeaponProf+"",
        ""+disIsScimitarWeaponProf+"",
        ""+disIsShortswordWeaponProf+"",
        ""+disIsTridentWeaponProf+"",
        ""+disIsWarPickWeaponProf+"",
        ""+disIsWarhammerWeaponProf+"",
        ""+disIsWhipWeaponProf+"",
        ""+disIsBlowgunWeaponProf+"",
        ""+disIsHandCrossbowWeaponProf+"",
        ""+disIsHeavyCrossbowWeaponProf+"",
        ""+disIsLongbowWeaponProf+"",
        ""+disIsNetWeaponProf+"",
        ""+disIsArmorProf+"",
        ""+disIsLightArmorProf+"",
        ""+disIsMediumArmorProf+"",
        ""+disIsHeavyArmorProf+""
		)]
	[h:abort(WeaponProfChoice)]

	[h:WeaponProfData=json.set("",
	    "SimpleWeaponProf",SimpleWeaponProf,
        "MartialWeaponProf",MartialWeaponProf,
        "ClubWeaponProf",ClubWeaponProf,
        "DaggerWeaponProf",DaggerWeaponProf,
        "GreatclubWeaponProf",GreatclubWeaponProf,
        "HandaxeWeaponProf",HandaxeWeaponProf,
        "JavelinWeaponProf",JavelinWeaponProf,
        "LightHammerWeaponProf",LightHammerWeaponProf,
        "MaceWeaponProf",MaceWeaponProf,
        "QuarterstaffWeaponProf",QuarterstaffWeaponProf,
        "SickleWeaponProf",SickleWeaponProf,
        "SpearWeaponProf",SpearWeaponProf,
        "LightCrossbowWeaponProf",LightCrossbowWeaponProf,
        "DartWeaponProf",DartWeaponProf,
        "ShortbowWeaponProf",ShortbowWeaponProf,
        "SlingWeaponProf",SlingWeaponProf,
        "BattleaxeWeaponProf",BattleaxeWeaponProf,
        "FlailWeaponProf",FlailWeaponProf,
        "GlaiveWeaponProf",GlaiveWeaponProf,
        "GreataxeWeaponProf",GreataxeWeaponProf,
        "GreatswordWeaponProf",GreatswordWeaponProf,
        "HalberdWeaponProf",HalberdWeaponProf,
        "LanceWeaponProf",LanceWeaponProf,
        "LongswordWeaponProf",LongswordWeaponProf,
        "MaulWeaponProf",MaulWeaponProf,
        "MorningstarWeaponProf",MorningstarWeaponProf,
        "PikeWeaponProf",PikeWeaponProf,
        "RapierWeaponProf",RapierWeaponProf,
        "ScimitarWeaponProf",ScimitarWeaponProf,
        "ShortswordWeaponProf",ShortswordWeaponProf,
        "TridentWeaponProf",TridentWeaponProf,
        "WarPickWeaponProf",WarPickWeaponProf,
        "WarhammerWeaponProf",WarhammerWeaponProf,
        "WhipWeaponProf",WhipWeaponProf,
        "BlowgunWeaponProf",BlowgunWeaponProf,
        "HandCrossbowWeaponProf",HandCrossbowWeaponProf,
        "HeavyCrossbowWeaponProf",HeavyCrossbowWeaponProf,
        "LongbowWeaponProf",LongbowWeaponProf,
        "NetWeaponProf",NetWeaponProf,
        "LightArmorProf",LightArmorProf,
        "MediumArmorProf",MediumArmorProf,
        "HeavyArmorProf",HeavyArmorProf)]

	[h:tempSpellName=""]
	[h:tempBaseSpellLevel=0]
	[h:tempSpellLevel=0]
	[h:tempSpellCharges=0]
	[h:stopSpells=0]
	
	[h:disIsSpellCast=if(IsSpellCast,"junkVar|Information about Spellcasting||LABEL|SPAN=TRUE","")]
	[h:disSpellCastName=if(IsSpellCast,"tempSpellName| |Name of Spell|","")]
	[h:disBaseSpellLevel=if(IsSpellCast,"tempBaseSpellLevel|"+listSpellLevel+"| Base Spell Level | LIST | SELECT=0","")]
	[h:disSpellCastLevel=if(IsSpellCast,"tempSpellLevel|"+listSpellLevel+"| Level to Cast At | LIST | SELECT=0","")]
	[h:disSpellCastCharges=if(IsSpellCast,"tempSpellCharges|"+listSpellLevel+"| Charges Used by Casting | LIST | SELECT=0","")]
	[h:disstopSpells=if(IsSpellCast,"stopSpells| | Done Adding Spells | CHECK","")]
	[h:CastSpellList=""]
	
	[h,while(stopSpells==0),CODE:{		
		[h:stopSpells=1]
		[h:SpellChoice=input(
			""+disIsSpellCast+"",
			""+disSpellCastName+"",
			""+disBaseSpellLevel+"",
			""+disSpellCastLevel+"",
			""+disSpellCastCharges+"",
			""+disstopSpells+"")]
		[h:abort(SpellChoice)]
		[h:tempCastSpell=json.set("","Spell Name",(tempSpellName+" ("+tempBaseSpellLevel+")"),"Spell Level",tempSpellLevel,"Charge Cost",tempSpellCharges)]
		[h:CastSpellList=json.append(CastSpellList,roll.count,tempCastSpell)]
	}]

	[h:disIsAbility=if(IsAbility,"junkVar| Information about Independent Item ||LABEL|SPAN=TRUE","")]
	[h:disIsAttack=if(IsAbility,"IsAttack |  | Makes an Attack Roll | Check ","")]
	[h:disIsSave=if(IsAbility,"IsSave |  | Forces a Save | Check ","")]
	[h:disIsDamage=if(IsAbility,"IsDamage |  | Deals Damage | Check ","")]
	[h:disIsBuff=if(IsAbility,"IsBuff |  | Grants A Buff | Check ","")]
	[h:disIsDebuff=if(IsAbility,"IsDebuff |  | Grants A Debuff | Check ","")]
	[h:disIsAura=if(IsAbility,"IsAura |  | Buff or Debuff Creates an Aura | Check ","")]
	[h:disIsSummon=if(IsAbility,"IsSummon |  | Summons Creatures | Check ","")]

	[h:AbilityChoice=input(
		""+disIsAbility+"",
		""+disIsAttack+"",
		""+disIsSave+"",
		""+disIsDamage+"",
		""+disIsBuff+"",
		""+disIsDebuff+"",
		""+disIsAura+"",
		""+disIsSummon+"")]
	[h:abort(AbilityChoice)]

[h:MagicItemNames=json.append(MagicItemNames,iName)]
[h:MagicItemAttuned=json.append(MagicItemAttuned,AttunementData)]
[h:MagicItemActivation=json.append(MagicItemActivation,ActivationData)]
[h:MagicItemEquipment=json.append(MagicItemEquipment,EquipData)]
[h:MagicItemVuln=json.append(MagicItemVuln,VulnData)]
[h:MagicItemImmun=json.append(MagicItemImmun,ImmunData)]
[h:MagicItemRes=json.append(MagicItemRes,ResData)]
[h:MagicItemAbsorb=json.append(MagicItemAbsorb,AbsorbData)]
[h:MagicItemDR=json.append(MagicItemDR,DRData)]
[h:MagicItemDRamnt=json.append(MagicItemDRamnt,DRamntData)]
[h:MagicItemCondImmun=json.append(MagicItemCondImmun,CondImmunData)]
[h:MagicItemAttributes=json.append(MagicItemAttributes,AttributeData)]
[h:MagicItemSaves=json.append(MagicItemSaves,SaveData)]
[h:MagicItemCheckAdv=json.append(MagicItemCheckAdv,CheckAdvData)]
[h:MagicItemCheckDis=json.append(MagicItemCheckDis,CheckDisData)]
[h:MagicItemCheckBonus=json.append(MagicItemCheckBonus,CheckBonusData)]
[h:MagicItemCheckProf=json.append(MagicItemCheckProf,CheckProfData)]
[h:MagicItemCheckMessage=json.append(MagicItemCheckMessage,CheckMessageData)]
[h:MagicItemInit=json.append(MagicItemInit,InitData)]
[h:MagicItemDeath=json.append(MagicItemDeath,DeathData)]
[h:MagicItemConc=json.append(MagicItemConc,ConcData)]
[h:MagicItemHP=json.append(MagicItemHP,HPData)]
[h:MagicItemAC=json.append(MagicItemAC,ACData)]
[h:MagicItemMovement=json.append(MagicItemMovement,MoveData)]
[h:MagicItemCantrips=json.append(MagicItemCantrips,CantripData)]
[h:MagicItemSpells=json.append(MagicItemSpells,SpellData)]
[h:MagicItemWeapons=json.append(MagicItemWeapons,WeaponData)]
[h:MagicItemWeaponProf=json.append(MagicItemWeaponProf,WeaponProfData)]

[h:NewItem=json.set("{}","Name",iName,"Activated",ActivationData,"Attunement",AttunementData,"Equipment",EquipData,"Vulnerabilities",VulnData,"Resistances",ResData,"Immunities",ImmunData,"Absorbs",AbsorbData,"DRs",DRData,"ConditionImmunities",CondImmunData,"Attributes",AttributeData,"Saves",SaveData,"Check Adv",CheckAdvData,"Check Dis",CheckDisData,"Check Bonus",CheckBonusData,"Check Prof",CheckProfData,"Check Message",CheckMessageData,"Initiative",InitData,"DeathSaves",DeathData,"Concentration",ConcData,"HP",HPData,"AC",ACData,"Movement",MoveData,"Cantrips",CantripData,"Spells",SpellData,"Weapons",WeaponData,"WeaponProficiencies",WeaponProfData)]

[h:MagicItems=json.append(MagicItemNames,NewItem)]

[h:DefaultItem=json.get(MagicItems,0)]
[h:StatsSend="[]"]
[h:StatsSend=json.append(StatsSend,(json.length(MagicItemNames)-1))]

[MACRO("Magic Item Stats@Lib:pm.a5e.Core"):StatsSend]

<div style="background-color: #f7ae27; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Magic Item</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		[r:token.name+" finds a"+if(or(substring(iName,0,0)=="a",substring(iName,0,0)=="A",substring(iName,0,0)=="E",substring(iName,0,0)=="e",substring(iName,0,0)=="I",substring(iName,0,0)=="i",substring(iName,0,0)=="O",substring(iName,0,0)=="o",substring(iName,0,0)=="U",substring(iName,0,0)=="u"),"n","")+" "+iName+"!"]
		<table>
		</table>
	</div>
</div>