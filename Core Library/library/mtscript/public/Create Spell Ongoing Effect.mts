[h:FirstPassTest = json.get(macro.args,"FirstPass")]
[h:sMultiEffects = json.get(macro.args,"EffectNumber")]
[h:IsRandomEffect = json.get(macro.args,"IsRandomEffect")]
[h:sDescription = json.get(macro.args,"sDescription")]
[h:sDescriptionTT = json.get(macro.args,"sDescriptionTT")]
[h:sName = json.get(macro.args,"sName")]
[h:RangeType = json.get(macro.args,"RangeType")]
[h:AoEShape = json.get(macro.args,"AoEShape")]
[h:sDuration = json.get(macro.args,"sDuration")]
[h:sSchool = json.get(macro.args,"sSchool")]
[h:IsSummon = json.get(macro.args,"IsSummon")]
[h:IsAHLSummon = json.get(macro.args,"IsAHLSummon")]
[h:IsOngoing = json.get(macro.args,"IsOngoing")]
[h:IsOngoingRandom = json.get(macro.args,"IsOngoingRandom")]
[h:sList = json.get(macro.args,"sList")]
[h:sLevel = json.get(macro.args,"sLevel")]
[h:DmgType = json.get(macro.args,"DmgType")]
[h:DmgType2 = json.get(macro.args,"DmgType2")]

[h: listDamageTypes="Slashing,Piercing,Bludgeoning,Acid,Cold,Fire,Force,Healing,Lightning,Necrotic,Poison,Psychic,Radiant,Thunder,Temp HP,Special,Choose From Multiple"]
[h: listDamageTypesAHL="Slashing,Piercing,Bludgeoning,Acid,Cold,Fire,Force,Healing,Lightning,Necrotic,Poison,Psychic,Radiant,Thunder,Temp HP,Special,Same As Chosen"]
[h: listDamageDieNumber="0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30"]
[h: listDamageDieSize="0,1,2,4,6,8,10,12"]
[h: listPrimaryStat="Strength,Dexterity,Constitution,Intelligence,Wisdom,Charisma"]
[h: listsLevel="1,2,3,4,5,6,7,8,9"]
[h: listCastTime="Action,BONUS,REACTION,1 MIN,10 MIN,1 HOUR,8 HOURS,12 HOURS,24 HOURS,Custom"]
[h:SaveType="None"]
[h:DmgType=""]
[h:DmgDieNumber="0"]
[h:DmgDieSize="0"]
[h:DmgDie2Number="0"]
[h:DmgDie2Size="0"]
[h:CastTime=""]
[h:EffectName=""]
[h:disMultiEffectsName=if(IsOngoing<2,"","EffectName | Name | Effect Name")]

[h: SpellStats=input(
	"sName | "+sName+" | Spell Name ",
	"sLevel | "+listsLevel+" | Spell Level | LIST | VALUE=STRING SELECT="+(number(sLevel)-1)+"",
	""+disMultiEffectsName+"",
	"CastTime | Passive,"+listCastTime+" | Casting Time |LIST|VALUE=STRING",
	"Ritual |  | Ritual Spell | Check",
	"RangeType | Self,Touch,Ranged | Range |LIST| VALUE=STRING SELECT="+if(RangeType=="Self",0,if(RangeType=="Touch",1,2))+"",
	"AoEShape | None,Cone,Cube,Cylinder,Line,Sphere | Area of Effect |LIST| VALUE=STRING SELECT="+if(AoEShape=="None",0,if(AoEShape=="Cone",1,if(AoEShape=="Cube",2,if(AoEShape=="Cylinder",3,if(AoEShape=="Line",4,5)))))+"",
	"junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"vComp |  | Verbal Components | Check",
	"sComp |  | Somatic Components | Check",
	"mComp |  | Material Components | Check",
	"IsSight |  | Requires Line of Sight | Check ",
	"junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"sDuration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Duration | LIST | VALUE=STRING SELECT="+if(sDuration=="Instantaneous",0,if(sDuration=="1 Round",1,if(sDuration=="1 Minute",2,if(sDuration=="10 Minutes",3,if(sDuration=="1 Hour",4,if(sDuration=="8 Hours",5,if(sDuration=="24 Hours",6,if(sDuration=="10 Days",7,8))))))))+"",
	"IsAHLDuration |  | Increased Duration at Higher levels | Check ",
	"sConcentration |  | Concentration | Check",
	"sIsConcentrationLost |  | Concentration Not Required at Higher Level | CHECK ",
	"sSchool | abjuration,conjuration,divination,enchantment,evocation,illusion,necromancy,transmutation | School | LIST | VALUE=STRING SELECT="+if(sSchool=="abjuration",0,if(sSchool=="conjuration",1,if(sSchool=="divination",2,if(sSchool=="enchantment",3,if(sSchool=="evocation",4,if(sSchool=="illusion",5,if(sSchool=="necromancy",6,7)))))))+"",
	"junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsAttack |  | Attack Roll | Check ",
	"IsSave |  | Save Required | Check ",
	"IsDamage |  | Heals or Deals Damage | Check ",
	"IsAHL |  | Increased Healing or Damage at Higher Levels | Check ",
	"IsMissiles | |<html><a href='(Magic Missiles, Scorching Ray)'>Is it a Missile Attack</a></html> | Check",
	"junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsBuffDebuff |  | Sets a Buff or Debuff | Check ",
	"IsCheck | No,Spellcasting Ability,Strength,Dexterity,Constitution,Intelligence,Wisdom,Charisma,Acrobatics,Animal Handling,Arcana,Athletics,Deception,History,Insight,Intimidation,Investigation,Medicine,Nature,Perception,Performance,Persuasion,Religion,Sleight of Hand,Stealth,Survival | Makes an Ability Check When Cast | LIST | VALUE=STRING ",
	"IsSummon | No,Single,Multiple | Summons Tokens | LIST | VALUE=STRING ",
	"IsAHLSummon | No Change,Increase Number,Increase CR,Both | If Yes, How Do the Summons Change at Higher Levels | LIST "
	)]
[h: abort(SpellStats)]

[h:sLevel=number(sLevel)]
[h,switch(sDuration),CODE:
	case "Instantaneous":{[h:AHLDurationPlacehold="0"]};
	case "1 Round":{[h:AHLDurationPlacehold="1"]};
	case "1 Minute":{[h:AHLDurationPlacehold="2"]};
	case "10 Minutes":{[h:AHLDurationPlacehold="3"]};
	case "1 Hour":{[h:AHLDurationPlacehold="4"]};
	case "8 Hours":{[h:AHLDurationPlacehold="5"]};
	case "24 Hours":{[h:AHLDurationPlacehold="6"]};
	case "10 Days":{[h:AHLDurationPlacehold="7"]};
	case "Until Dispelled":{[h:AHLDurationPlacehold="8"]}
	]

[h:useSelectedDmgType=0]
[h:useSelectedDmgType2=0]
[h:disUseSelectedDmgType=if(DmgType=="Choose From List","useSelectedDmgType | 1 | Use Type Selected When Cast? This Will Override the Selection Below | CHECK ","")]
[h:disUseSelectedDmgType2=if(DmgType2=="Choose From List","useSelectedDmgType2 | 1 | Use Type Selected When Cast? This Will Override the Selection Below | CHECK ","")]
	
[h:SaveType=""]
[h:sBaseMissiles=1]
[h:sAHLMissiles=0]
[h:DmgType=""]
[h:DmgDieNumber=0]
[h:DmgDieSize=0]
[h:DmgDieFlatBonus=0]
[h:DmgDieMODBonus=0]
[h:DmgType2=""]
[h:DmgDie2Number=0]
[h:DmgDie2Size=0]
[h:DmgDie2FlatBonus=0]
[h:DmgDie2MODBonus=0]
[h:DmgHalved=0]
[h:sCritThresh=0]

[h:disIsSave = if(IsSave==0,"","throwaway|---------------------------------- Data for Saving Throws ----------------------------------| |LABEL|SPAN=TRUE")]
[h:disSaveType = if(IsSave==0,"","SaveType | "+listPrimaryStat+" | Ability Save Type |LIST|VALUE=STRING")]
[h:disDmgHalved = if(or(IsDamage==0,IsSave==0),"","DmgHalved |  | Is Damage Halved on a Success |CHECK")]

[h:disIsAttack = if(IsAttack==0,"","throwaway|--------------------------------------- Data for Attacks ---------------------------------------| |LABEL|SPAN=TRUE")]
[h:dissCritThresh = if(IsAttack==0,"","sCritThresh | 20,19,18,17,16,15 | Critical Hit Threshhold |LIST")]
[h:dissBaseMissiles = if(IsMissiles==0,"","sBaseMissiles | "+listsLevel+" | Choose Base Number of Missiles | LIST | VALUE=STRING SELECT=0")]
[h:dissAHLMissiles = if(IsMissiles==0,"","sAHLMissiles | "+listsLevel+" | How Many More Missiles per Level | LIST | VALUE=STRING SELECT=0")]

[h:disIsDamage = if(IsDamage==0,"","throwaway|-------------------------------------- Data for Damage ---------------------------------------| |LABEL|SPAN=TRUE")]
[h:disDmgType = if(IsDamage==0,"","DmgType | "+listDamageTypes+" | Damage Type | LIST | VALUE=STRING SELECT=3")]
[h:disDmgDieNumber = if(IsDamage==0,"","DmgDieNumber | "+listDamageDieNumber+" | Number of Damage Dice | LIST | VALUE=STRING SELECT=1")]
[h:disDmgDieSize = if(IsDamage==0,"","DmgDieSize | "+listDamageDieSize+" | Damage Die Size (d4, d6, d8, etc.) | LIST | VALUE=STRING SELECT=1")]
[h:disDmgDieFlatBonus = if(IsDamage==0,"","DmgDieFlatBonus |   | Flat Damage Bonus")]
[h:disDmgDieMODBonus = if(IsDamage==0,"","DmgDieMODBonus |   | Add Spellcasting Modifier to Damage | CHECK")]
[h:disDmgSpaces = if(IsDamage==0,"","throwaway|-------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE")]
[h:disDmgType2 = if(IsDamage==0,"","DmgType2 | "+listDamageTypes+" | Second Damage Type | LIST | VALUE=STRING SELECT=3")]
[h:disDmgDie2Number = if(IsDamage==0,"","DmgDie2Number | "+listDamageDieNumber+" | Number of Second Damage Dice | LIST | VALUE=STRING SELECT=0")]
[h:disDmgDie2Size = if(IsDamage==0,"","DmgDie2Size | "+listDamageDieSize+" | Second Damage Die Size (d4, d6, d8, etc.) | LIST | VALUE=STRING SELECT=1")]
[h:disDmgDie2FlatBonus = if(IsDamage==0,"","DmgDie2FlatBonus |   | Second Flat Damage Bonus")]
[h:disDmgDie2MODBonus = if(IsDamage==0,"","DmgDie2MODBonus |   | Add Spellcasting Modifier to Damage | CHECK")]

[h: SpellDamage=input(
	""+disIsSave+"",
	""+disSaveType+"",
	""+disDmgHalved+"",
	""+disIsAttack+"",
	""+dissCritThresh+"",
	""+dissBaseMissiles+"",
	""+dissAHLMissiles+"",
	""+disIsDamage+"",
	""+disDmgType+"",
	""+disDmgDieNumber+"",
	""+disDmgDieSize+"",
	""+disDmgDieMODBonus+"",
	""+disDmgDieFlatBonus+"",
	""+disUseSelectedDmgType+"",
	""+disDmgSpaces+"",
	""+disDmgType2+"",
	""+disDmgDie2Number+"",
	""+disDmgDie2Size+"",
	""+disDmgDie2MODBonus+"",
	""+disDmgDie2FlatBonus+"",
	""+disUseSelectedDmgType2+""
	)]
[h: abort(SpellDamage)]

[h:isRandomType=0]
[h:DmgTypeListBludgeoning=0]
[h:DmgTypeListPiercing=0]
[h:DmgTypeListSlashing=0]
[h:DmgTypeListAcid=0]
[h:DmgTypeListCold=0]
[h:DmgTypeListFire=0]
[h:DmgTypeListForce=0]
[h:DmgTypeListLightning=0]
[h:DmgTypeListNecrotic=0]
[h:DmgTypeListPoison=0]
[h:DmgTypeListPsychic=0]
[h:DmgTypeListRadiant=0]
[h:DmgTypeListThunder=0]
[h:isRandomType2=0]
[h:DmgType2ListBludgeoning=0]
[h:DmgType2ListPiercing=0]
[h:DmgType2ListSlashing=0]
[h:DmgType2ListAcid=0]
[h:DmgType2ListCold=0]
[h:DmgType2ListFire=0]
[h:DmgType2ListForce=0]
[h:DmgType2ListLightning=0]
[h:DmgType2ListNecrotic=0]
[h:DmgType2ListPoison=0]
[h:DmgType2ListPsychic=0]
[h:DmgType2ListRadiant=0]
[h:DmgType2ListThunder=0]

[h:disDamageTypeChoices=if(DmgType=="Choose From Multiple","junkVar | Check the Damage Types You Can Choose From | | LABEL | SPAN=TRUE","")]
[h:disDamageTypeChoicesRandom=if(DmgType=="Choose From Multiple","isRandomType |  | Randomly Choose From the Options | CHECK ","")]
[h:disDamageTypeChoiceBludgeoning=if(DmgType=="Choose From Multiple","DmgTypeListBludgeoning | | Bludgeoning | CHECK","")]
[h:disDamageTypeChoicePiercing=if(DmgType=="Choose From Multiple","DmgTypeListPiercing | | Piercing | CHECK","")]
[h:disDamageTypeChoiceSlashing=if(DmgType=="Choose From Multiple","DmgTypeListSlashing | | Slashing | CHECK","")]
[h:disDamageTypeChoiceAcid=if(DmgType=="Choose From Multiple","DmgTypeListAcid | | Acid | CHECK","")]
[h:disDamageTypeChoiceCold=if(DmgType=="Choose From Multiple","DmgTypeListCold | | Cold | CHECK","")]
[h:disDamageTypeChoiceFire=if(DmgType=="Choose From Multiple","DmgTypeListFire | | Fire | CHECK","")]
[h:disDamageTypeChoiceForce=if(DmgType=="Choose From Multiple","DmgTypeListForce | | Force | CHECK","")]
[h:disDamageTypeChoiceLightning=if(DmgType=="Choose From Multiple","DmgTypeListLightning | | Lightning | CHECK","")]
[h:disDamageTypeChoiceNecrotic=if(DmgType=="Choose From Multiple","DmgTypeListNecrotic | | Necrotic | CHECK","")]
[h:disDamageTypeChoicePoison=if(DmgType=="Choose From Multiple","DmgTypeListPoison | | Poison | CHECK","")]
[h:disDamageTypeChoicePsychic=if(DmgType=="Choose From Multiple","DmgTypeListPsychic | | Psychic | CHECK","")]
[h:disDamageTypeChoiceRadiant=if(DmgType=="Choose From Multiple","DmgTypeListRadiant | | Radiant | CHECK","")]
[h:disDamageTypeChoiceThunder=if(DmgType=="Choose From Multiple","DmgTypeListThunder | | Thunder | CHECK","")]

[h:disDamageType2Choices=if(DmgType2=="Choose From Multiple","junkVar | "+if(DmgType=="Choose From Multiple","Repeat for Second Damage Type","Check the Damage Types You Can Choose From")+" | | LABEL | SPAN=TRUE","")]
[h:disDamageType2ChoicesRandom=if(DmgType2=="Choose From Multiple","isRandomType2 |  | Randomly Choose From the Options | CHECK ","")]
[h:disDamageType2ChoiceBludgeoning=if(DmgType2=="Choose From Multiple","DmgType2ListBludgeoning | | Bludgeoning | CHECK","")]
[h:disDamageType2ChoicePiercing=if(DmgType2=="Choose From Multiple","DmgType2ListPiercing | | Piercing | CHECK","")]
[h:disDamageType2ChoiceSlashing=if(DmgType2=="Choose From Multiple","DmgType2ListSlashing | | Slashing | CHECK","")]
[h:disDamageType2ChoiceAcid=if(DmgType2=="Choose From Multiple","DmgType2ListAcid | | Acid | CHECK","")]
[h:disDamageType2ChoiceCold=if(DmgType2=="Choose From Multiple","DmgType2ListCold | | Cold | CHECK","")]
[h:disDamageType2ChoiceFire=if(DmgType2=="Choose From Multiple","DmgType2ListFire | | Fire | CHECK","")]
[h:disDamageType2ChoiceForce=if(DmgType2=="Choose From Multiple","DmgType2ListForce | | Force | CHECK","")]
[h:disDamageType2ChoiceLightning=if(DmgType2=="Choose From Multiple","DmgType2ListLightning | | Lightning | CHECK","")]
[h:disDamageType2ChoiceNecrotic=if(DmgType2=="Choose From Multiple","DmgType2ListNecrotic | | Necrotic | CHECK","")]
[h:disDamageType2ChoicePoison=if(DmgType2=="Choose From Multiple","DmgType2ListPoison | | Poison | CHECK","")]
[h:disDamageType2ChoicePsychic=if(DmgType2=="Choose From Multiple","DmgType2ListPsychic | | Psychic | CHECK","")]
[h:disDamageType2ChoiceRadiant=if(DmgType2=="Choose From Multiple","DmgType2ListRadiant | | Radiant | CHECK","")]
[h:disDamageType2ChoiceThunder=if(DmgType2=="Choose From Multiple","DmgType2ListThunder | | Thunder | CHECK","")]

[h:ChooseDamageTypeOptions=input(
	""+disDamageTypeChoices+"",
	""+disDamageTypeChoicesRandom+"",
	""+disDamageTypeChoiceBludgeoning+"",
	""+disDamageTypeChoicePiercing+"",
	""+disDamageTypeChoiceSlashing+"",
	""+disDamageTypeChoiceAcid+"",
	""+disDamageTypeChoiceCold+"",
	""+disDamageTypeChoiceFire+"",
	""+disDamageTypeChoiceForce+"",
	""+disDamageTypeChoiceLightning+"",
	""+disDamageTypeChoiceNecrotic+"",
	""+disDamageTypeChoicePoison+"",
	""+disDamageTypeChoicePsychic+"",
	""+disDamageTypeChoiceRadiant+"",
	""+disDamageTypeChoiceThunder+"",
	""+disDamageType2Choices+"",
	""+disDamageType2ChoicesRandom+"",
	""+disDamageType2ChoiceBludgeoning+"",
	""+disDamageType2ChoicePiercing+"",
	""+disDamageType2ChoiceSlashing+"",
	""+disDamageType2ChoiceAcid+"",
	""+disDamageType2ChoiceCold+"",
	""+disDamageType2ChoiceFire+"",
	""+disDamageType2ChoiceForce+"",
	""+disDamageType2ChoiceLightning+"",
	""+disDamageType2ChoiceNecrotic+"",
	""+disDamageType2ChoicePoison+"",
	""+disDamageType2ChoicePsychic+"",
	""+disDamageType2ChoiceRadiant+"",
	""+disDamageType2ChoiceThunder+""
	)]

	[h:DmgTypeOptions=""]
	[h:DmgTypeOptions=if(DmgTypeListBludgeoning,listAppend(DmgTypeOptions,"Bludgeoning"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListPiercing,listAppend(DmgTypeOptions,"Piercing"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListSlashing,listAppend(DmgTypeOptions,"Slashing"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListAcid,listAppend(DmgTypeOptions,"Acid"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListCold,listAppend(DmgTypeOptions,"Cold"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListFire,listAppend(DmgTypeOptions,"Fire"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListForce,listAppend(DmgTypeOptions,"Force"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListLightning,listAppend(DmgTypeOptions,"Lightning"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListNecrotic,listAppend(DmgTypeOptions,"Necrotic"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListPoison,listAppend(DmgTypeOptions,"Poison"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListPsychic,listAppend(DmgTypeOptions,"Psychic"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListRadiant,listAppend(DmgTypeOptions,"Radiant"),DmgTypeOptions)]
	[h:DmgTypeOptions=if(DmgTypeListThunder,listAppend(DmgTypeOptions,"Thunder"),DmgTypeOptions)]
	[h:DmgType2Options=""]
	[h:DmgType2Options=if(DmgType2ListBludgeoning,listAppend(DmgType2Options,"Bludgeoning"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListPiercing,listAppend(DmgType2Options,"Piercing"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListSlashing,listAppend(DmgType2Options,"Slashing"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListAcid,listAppend(DmgType2Options,"Acid"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListCold,listAppend(DmgType2Options,"Cold"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListFire,listAppend(DmgType2Options,"Fire"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListForce,listAppend(DmgType2Options,"Force"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListLightning,listAppend(DmgType2Options,"Lightning"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListNecrotic,listAppend(DmgType2Options,"Necrotic"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListPoison,listAppend(DmgType2Options,"Poison"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListPsychic,listAppend(DmgType2Options,"Psychic"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListRadiant,listAppend(DmgType2Options,"Radiant"),DmgType2Options)]
	[h:DmgType2Options=if(DmgType2ListThunder,listAppend(DmgType2Options,"Thunder"),DmgType2Options)]

[h:DmgTypePlacehold="0"]
[h:DmgType2Placehold="0"]

[h,switch(DmgDieSize),CODE:
	case "0":{[h:DmgDieSizePlacehold="0"]};
	case "1":{[h:DmgDieSizePlacehold="1"]};
	case "2":{[h:DmgDieSizePlacehold="2"]};
	case "4":{[h:DmgDieSizePlacehold="3"]};
	case "6":{[h:DmgDieSizePlacehold="4"]};
	case "8":{[h:DmgDieSizePlacehold="5"]};
	case "10":{[h:DmgDieSizePlacehold="6"]};
	case "12":{[h:DmgDieSizePlacehold="7"]}
	]
	
[h,switch(DmgDie2Size),CODE:
	case "0":{[h:DmgDie2SizePlacehold="0"]};
	case "1":{[h:DmgDie2SizePlacehold="1"]};
	case "2":{[h:DmgDie2SizePlacehold="2"]};
	case "4":{[h:DmgDie2SizePlacehold="3"]};
	case "6":{[h:DmgDie2SizePlacehold="4"]};
	case "8":{[h:DmgDie2SizePlacehold="5"]};
	case "10":{[h:DmgDie2SizePlacehold="6"]};
	case "12":{[h:DmgDie2SizePlacehold="7"]}
	]
	
[h,switch(DmgType),CODE:
	case "":{};
	case "Slashing":{[h:DmgTypePlacehold="0"]};
	case "Piercing":{[h:DmgTypePlacehold="1"]};
	case "Bludgeoning":{[h:DmgTypePlacehold="2"]};
	case "Acid":{[h:DmgTypePlacehold="3"]};
	case "Cold":{[h:DmgTypePlacehold="4"]};
	case "Fire":{[h:DmgTypePlacehold="5"]};
	case "Force":{[h:DmgTypePlacehold="6"]};
	case "Healing":{[h:DmgTypePlacehold="7"]};
	case "Lightning":{[h:DmgTypePlacehold="8"]};
	case "Necrotic":{[h:DmgTypePlacehold="9"]};
	case "Poison":{[h:DmgTypePlacehold="10"]};
	case "Psychic":{[h:DmgTypePlacehold="11"]};
	case "Radiant":{[h:DmgTypePlacehold="12"]};
	case "Thunder":{[h:DmgTypePlacehold="13"]};
	case "Temp HP":{[h:DmgTypePlacehold="14"]};
	case "Special":{[h:DmgTypePlacehold="15"]};
	case "Choose From Multiple":{[h:DmgTypePlacehold="16"]}
	]

[h,switch(DmgType2),CODE:
	case "":{};
	case "Slashing":{[h:DmgType2Placehold="1"]};
	case "Piercing":{[h:DmgType2Placehold="2"]};
	case "Bludgeoning":{[h:DmgType2Placehold="3"]};
	case "Acid":{[h:DmgType2Placehold="4"]};
	case "Cold":{[h:DmgType2Placehold="5"]};
	case "Fire":{[h:DmgType2Placehold="6"]};
	case "Force":{[h:DmgType2Placehold="7"]};
	case "Healing":{[h:DmgType2Placehold="8"]};
	case "Lightning":{[h:DmgType2Placehold="9"]};
	case "Necrotic":{[h:DmgType2Placehold="10"]};
	case "Poison":{[h:DmgType2Placehold="11"]};
	case "Psychic":{[h:DmgType2Placehold="12"]};
	case "Radiant":{[h:DmgType2Placehold="13"]};
	case "Thunder":{[h:DmgType2Placehold="14"]};
	case "Temp HP":{[h:DmgType2Placehold="15"]};
	case "Special":{[h:DmgTypePlacehold="16"]};
	case "Choose From Multiple":{[h:DmgTypePlacehold="17"]}
	]

[h:AHLScaling=""]
[h:AHLDmgType=""]
[h:AHLDamageNumber=0]
[h:AHLDmgDieSize=0]
[h:AHLFlatBonus=0]
[h:AHLDmgType2=""]
[h:AHLDmgDie2Number=0]
[h:AHLDmgDie2Size=0]
[h:AHL2FlatBonus=0]

[h:disIsAHL = if(IsAHL==0,"","throwaway|<html><b>KEEP TYPES CONSISTENT WITH 1 OR 2</b></html>|Data for damage at higher levels|LABEL")]
[h:disAHLScaling = if(IsAHL==0,"","AHLScaling | Every Level,Every Other Level,Every Three Levels,Other | How Often Does AHL Damage Increase? | LIST | VALUE=STRING SELECT=0")]
[h:disAHLDmgType = if(IsAHL==0,"","AHLDmgType | "+listDamageTypesAHL+" | AHL Damage Type | LIST | VALUE=STRING SELECT="+DmgTypePlacehold+"")]
[h:disAHLDamageNumber = if(IsAHL==0,"","AHLDamageNumber | "+listDamageDieNumber+" | AHL Damage Number | LIST | VALUE=STRING SELECT=1")]
[h:disAHLDieSize = if(IsAHL==0,"","AHLDmgDieSize | "+listDamageDieSize+" | Damage Die Size (d4, d6, d8, etc.) | LIST | VALUE=STRING SELECT="+DmgDieSizePlacehold+"")]
[h:disAHLFlatBonus = if(IsAHL==0,"","AHLFlatBonus |   | Flat Damage Bonus")]
[h:disAHLSpaces = if(IsAHL==0,"","throwaway|------------------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE")]
[h:disAHLType2 = if(IsAHL==0,"","AHLDmgType2 | None,"+listDamageTypes+" | Second Damage Type AHL | LIST | VALUE=STRING SELECT="+DmgType2Placehold+"")]
[h:disAHLDie2Number = if(IsAHL==0,"","AHLDmgDie2Number | "+listDamageDieNumber+" | Number of Second Damage Dice AHL | LIST | VALUE=STRING SELECT=0")]
[h:disAHLDie2Size = if(IsAHL==0,"","AHLDmgDie2Size | "+listDamageDieSize+" | Second Damage Die Size (d4, d6, d8, etc.) | LIST | VALUE=STRING SELECT="+DmgDie2SizePlacehold+"")]
[h:disAHL2FlatBonus = if(IsAHL==0,"","AHL2FlatBonus |   | Second Flat Damage Bonus")]

[h: SpellAHLDamage=input(
	""+disIsAHL+"",
	""+disAHLScaling+"",
	""+disAHLDmgType+"",
	""+disAHLDamageNumber+"",
	""+disAHLDieSize+"",
	""+disAHLFlatBonus+"",
	""+disAHLSpaces+"",
	""+disAHLType2+"",
	""+disAHLDie2Number+"",
	""+disAHLDie2Size+"",
	""+disAHL2FlatBonus+""
	)]
[h: abort(SpellAHLDamage)]

[h:sRange=0]
[h:sRangeUnits=""]
[h:sRangeScalingAHL="No Change"]
[h:sRangeAHL=0]
[h:sConeSize=0]
[h:sCubeSize=0]
[h:sCylinderRadius=0]
[h:sCylinderHeight=0]
[h:sLineLength=0]
[h:sLineWidth=0]
[h:sSphereSize=0]
[h:sAoEUnits=""]
[h:sAoESizeScalingAHL="No Change"]
[h:sAoESizeAHL=0]
[h:sAoENumber=0]
[h:sMultiTarget=0]
[h:sMultiTargetRange="0"]
[h:IsTargetsAHL=0]
[h:AHLTargetScaling=""]
[h:AHL2Duration=""]
[h:AHL3Duration=""]
[h:AHL4Duration=""]
[h:AHL5Duration=""]
[h:AHL6Duration=""]
[h:AHL7Duration=""]
[h:AHL8Duration=""]
[h:AHL9Duration=""]
[h:sConcentrationLost=50]

[h:disDmgSpaces = if(IsDamage==0,"","throwaway|-------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE")]

[h:disssssRanged= if(and(or(RangeType=="Self",RangeType=="Touch"),AoEShape=="None"),"","throwaway|---------------------------------------------- Data for Spell Range ---------------------------------------------||LABEL|SPAN=TRUE")]
[h:dissRange = if(RangeType=="Ranged","sRange | 0 | Numeric Range of Spell ","")]
[h:dissRangeUnits = if(RangeType=="Ranged","sRangeUnits | Feet,Miles | Measured in Feet or Miles | LIST | VALUE=STRING","")]
[h:dissRangeScalingAHL = if(RangeType=="Ranged","sRangeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Does the Range Increase At Higher Levels | LIST | VALUE=STRING","")]
[h:dissRangeAHL = if(RangeType=="Ranged","sRangeAHL |  | How Much the Range Increases When it Changes ","")]
[h:disRangedSpaces = if(RangeType=="Ranged","throwaway|------------------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE","")]
[h:dissConeSize = if(AoEShape=="Cone","sConeSize | 0 | Cone Size ","")]
[h:dissCubeSize = if(AoEShape=="Cube","sCubeSize | 0 | Cube Size ","")]
[h:dissCylinderRadius = if(AoEShape=="Cylinder","sCylinderRadius | 0 | Cylinder Radius ","")]
[h:dissCylinderHeight = if(AoEShape=="Cylinder","sCylinderHeight | 0 | Cylinder Height ","")]
[h:dissLineLength = if(AoEShape=="Line","sLineLength | 0 | Line Length ","")]
[h:dissLineWidth = if(AoEShape=="Line","sLineWidth | 5 | Line Width ","")]
[h:dissSphereSize = if(AoEShape=="Sphere","sSphereSize | 0 | Sphere Radius ","")]
[h:dissAoEUnits = if(AoEShape=="None","","sAoEUnits | Feet,Miles | Measured in Feet or Miles | LIST | VALUE=STRING")]
[h:disAoESpaces = if(AoEShape=="None","","throwaway|------------------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE")]
[h:dissAoESizeScalingAHL = if(AoEShape=="None","","sAoESizeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Does the AoE Size Increase At Higher Levels | LIST | VALUE=STRING")]
[h:dissAoESizeAHL = if(AoEShape=="None","","sAoESizeAHL |  | How Much the AoE Size Increases When it Changes | ")]
[h:dissAoENumber = if(AoEShape=="None","","sAoENumber | "+listsLevel+" | Number of Areas of Effect | LIST ")]
[h:disRangedAoESpaces = if(and(RangeType=="Ranged",AoEShape!="None"),"throwaway|------------------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE","")]

[h:disMultiTarget=if(or(AoEShape!="None",RangeType=="Self",IsMissiles==1),"","sMultiTarget | "+listsLevel+" | Maximum Number of Targets |LIST| VALUE=STRING")]
[h:disIsTargetsAHL=if(or(AoEShape!="None",RangeType=="Self",IsMissiles==1),"","IsTargetsAHL |  | Targets More At Higher Levels? | Check")]
[h:disAHLTargetScaling = if(or(AoEShape!="None",RangeType=="Self",IsMissiles==1),"","AHLTargetScaling | Every Level,Every Other Level,Every Three Levels,Other | If Yes, How Often do Targets Increase? | LIST | VALUE=STRING SELECT=0")]
[h:dissMultiTargetRange = if(or(AoEShape!="None",RangeType=="Self",IsMissiles==1),"","sMultiTargetRange |  | <html><a href='Use 0 if Not Indicated in Spell Text'>If Yes, How Close do Additional Targets Need to Be?</a></html> | ")]

[h:disAHLDuration=if(or(IsAHLDuration==1,sIsConcentrationLost),"throwaway|-------------------------------- Data for Spell Duration at Higher Levels --------------------------------|  |LABEL|SPAN=TRUE","")]
[h:disl2Duration=if(and(IsAHLDuration==1,sLevel<2),"AHL2Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 2 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:disl3Duration=if(and(IsAHLDuration==1,sLevel<3),"AHL3Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 3 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:disl4Duration=if(and(IsAHLDuration==1,sLevel<4),"AHL4Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 4 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:disl5Duration=if(and(IsAHLDuration==1,sLevel<5),"AHL5Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 5 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:disl6Duration=if(and(IsAHLDuration==1,sLevel<6),"AHL6Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 6 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:disl7Duration=if(and(IsAHLDuration==1,sLevel<7),"AHL7Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 7 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:disl8Duration=if(and(IsAHLDuration==1,sLevel<8),"AHL8Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 8 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:disl9Duration=if(and(IsAHLDuration==1,sLevel<9),"AHL9Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled | Level 9 Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold+"","")]
[h:dissIsConcentrationLost=if(sIsConcentrationLost,"sConcentrationLost | "+listsLevel+" | Concentration Not Required at Level | LIST | VALUE=STRING SELECT="+sLevel+"","")]
	
[h:mCompItems=""]
[h:mCompConsumed=""]

[h:disIsmComp = if(mComp==0,"","throwaway|-------------------------------------- Data for Material Components ---------------------------------------| |LABEL|SPAN=TRUE")]
[h:dismCompItems = if(mComp==0,"","mCompItems |  | Material Components")]
[h:dismCompConsumed = if(mComp==0,"","mCompConsumed |  | Consumed Material Components")]

[h: SpellRange=input(
	""+disIsmComp+"",
	""+dismCompItems+"",
	""+dismCompConsumed+"",
	""+disAHLDuration+"",
	""+disl2Duration+"",
	""+disl3Duration+"",
	""+disl4Duration+"",
	""+disl5Duration+"",
	""+disl6Duration+"",
	""+disl7Duration+"",
	""+disl8Duration+"",
	""+disl9Duration+"",
	""+dissIsConcentrationLost+"",
	""+disssssRanged+"",
	""+dissRange+"",
	""+dissRangeUnits+"",
	""+dissRangeScalingAHL+"",
	""+dissRangeAHL+"",
	""+disRangedSpaces+"",
	""+dissConeSize+"",
	""+dissCubeSize+"",
	""+dissCylinderRadius+"",
	""+dissCylinderHeight+"",
	""+dissLineLength+"",
	""+dissLineWidth+"",
	""+dissSphereSize+"",
	""+dissAoEUnits+"",
	""+disAoESpaces+"",
	""+dissAoESizeScalingAHL+"",
	""+dissAoESizeAHL+"",
	""+dissAoENumber+"",
	""+disRangedAoESpaces+"",
	""+disMultiTarget+"",
	""+disIsTargetsAHL+"",
	""+disAHLTargetScaling+"",
	""+dissMultiTargetRange+""
	)]
[h: abort(SpellRange)]

[h:mCompItemsTT=replace(mCompItems,"'","")]
[h:mCompConsumedTT=replace(mCompConsumed,"'","")]

[h:IsBuff="None"]
[h:IsDebuff="None"]
[h:IsBuffDebuffChoices=0]
[h:IsAura=0]

[h:disBuffBars = if(IsBuffDebuff==0,"","throwaway|------------------------- Data for Buffs and Debuffs ---------------------------| |LABEL|SPAN=TRUE")]
[h:disIsBuff = if(IsBuffDebuff==0,"","IsBuff | None,Self,Target,Both | Sets a Buff On (Self for Auras) | LIST | VALUE=STRING ")]
[h:disIsDebuff = if(IsBuffDebuff==0,"","IsDebuff | None,Self,Target,Both | Sets a Debuff On | LIST | VALUE=STRING ")]
[h:disIsBuffDebuffChoices = if(IsBuffDebuff==0,"","IsBuffDebuffChoices |  | <html><a href='e.g. Enhance Ability, Contagion, etc.'>Multiple Choices of Buffs or Debuffs to Choose From</a></html> | Check ")]
[h:disIsAura = if(IsBuffDebuff==0,"","IsAura |  | Creates an Aura | Check ")]

[h: BuffDebuffInfo=input(
	""+disBuffBars+"",
	""+disIsBuff+"",
	""+disIsDebuff+"",
	""+disIsBuffDebuffChoices+"",
	""+disIsAura+""
	)]
[h: abort(BuffDebuffInfo)]

[h:AuraSize=""]
[h:sStatusName=""]
[h:BuffsList=""]
[h:DebuffsList=""]
[h:BuffScaling=0]
[h:DebuffScaling=0]
[h:sStatus=0]
[h:sBlind=0]
[h:sCharmed=0]
[h:sConfused=0]
[h:sDeafened=0]
[h:sFrightened=0]
[h:sGrappled=0]
[h:sIncapacitated=0]
[h:sParalyzed=0]
[h:sPetrified=0]
[h:sPoisoned=0]
[h:sProne=0]
[h:sRestrained=0]
[h:sStunned=0]
[h:sUnconscious=0]
[h:sReactionUsed=0]

[h:listAuraSize="5,10,15,20,25,30,35,40,45,50,55,60"]
[h:disIsState = if(and(IsBuff=="None",IsAura==0),"",if(IsBuffDebuffChoices==0,"throwaway|--------- Data for Buffs ---------| |LABEL|SPAN=TRUE","throwaway|------------------------------------------- Data for Buffs -------------------------------------------| |LABEL|SPAN=TRUE"))]
[h:disIsBuffNoAura = if(and(IsBuff!="None",IsAura==0,IsBuffDebuffChoices==0),"throwaway| The buff will have the same name as the spell. You must create a new state in the campaign properties with the same name. |  |LABEL|SPAN=TRUE","")]
[h:disisBuffScaling = if(and(IsBuff!="None",IsBuffDebuffChoices==0),"BuffScaling|  | Does the buff change at higher levels |CHECK","")]
[h:disAuraSize = if(IsAura==1,"AuraSize | "+listAuraSize+" | Aura Radius | LIST | VALUE=STRING SELECT=1","")]
[h:disisBuffChoices = if(or(IsBuff=="None",IsBuffDebuffChoices==0),"","BuffsList| | <html><a href='You must create a new state with the spells name in campaign properties.'>List Buff Choices, Separated by a Comma.</a></html>")]
[h:disisBuffScalingMulti = if(or(IsBuff=="None",IsBuffDebuffChoices==0),"","BuffScaling| | <html><a href='1 for Yes, 0 for No. e.g. 1,1,0.'>List Whether Each Choice Scales AHL, Separated by a Comma.</a></html>")]
[h:disisDebuff = if(IsDebuff=="None","",if(IsBuffDebuffChoices==0,"throwaway|--------- Data for Debuffs ---------| |LABEL|SPAN=TRUE","throwaway|------------------------------------------ Data for Debuffs -----------------------------------------| |LABEL|SPAN=TRUE"))]
[h:dissStatus = if(IsDebuff=="None","","sStatus |  | <html><a href='You must create a new state with the spells name in campaign properties.'>Unique to Spell.</a></html> | Check")]
[h:disisDebuffScaling = if(and(IsDebuff!="None",IsBuffDebuffChoices==0),"DebuffScaling|  | Does the debuff change at higher levels |CHECK","")]
[h:disisDebuffChoices = if(or(IsDebuff=="None",IsBuffDebuffChoices==0),"","DebuffsList| | <html><a href='You must create a new state with the spells name in campaign properties.'>List Debuff Choices, Separated by a Comma.</a></html>")]
[h:disisDebuffScalingMulti = if(or(IsDebuff=="None",IsBuffDebuffChoices==0),"","DebuffScaling| | <html><a href='1 for Yes, 0 for No. e.g. 1,1,0.'>List Whether Each Choice Scales AHL, Separated by a Comma.</a></html>")]

[h:dissBlind = if(isDebuff=="None","","sBlind |  | Blinded | Check")]
[h:dissCharmed = if(isDebuff=="None","","sCharmed |  | Charmed | Check")]
[h:dissConfused = if(isDebuff=="None","","sConfused |  | Confused | Check")]
[h:dissDeafened = if(isDebuff=="None","","sDeafened |  | Deafened | Check")]
[h:dissFrightened = if(isDebuff=="None","","sFrightened |  | Frightened | Check")]
[h:dissGrappled = if(isDebuff=="None","","sGrappled |  | Grappled | Check")]
[h:dissIncapacitated = if(isDebuff=="None","","sIncapacitated |  | Incapacitated | Check")]
[h:dissParalyzed = if(isDebuff=="None","","sParalyzed |  | Paralyzed | Check")]
[h:dissPetrified = if(isDebuff=="None","","sPetrified |  | Petrified | Check")]
[h:dissPoisoned = if(isDebuff=="None","","sPoisoned |  | Poisoned | Check")]
[h:dissProne = if(isDebuff=="None","","sProne |  | Prone | Check")]
[h:dissRestrained = if(isDebuff=="None","","sRestrained |  | Restrained | Check")]
[h:dissStunned = if(isDebuff=="None","","sStunned |  | Stunned | Check")]
[h:dissUnconscious = if(isDebuff=="None","","sUnconscious |  | Unconscious | Check")]
[h:dissReactionUsed = if(isDebuff=="None","","sReactionUsed |  | Unable to use Reactions | Check")]

[h: SpellStates=input(
	""+disIsState+"",
	""+disIsBuffNoAura+"",
	""+disisBuffScaling+"",
	""+disAuraSize+"",
	""+disisBuffChoices+"",
	""+disisBuffScalingMulti+"",
	""+disisDebuff+"",
	""+dissStatus+"",
	""+disisDebuffScaling+"",
	""+disisDebuffChoices+"",
	""+disisDebuffScalingMulti+"",
	""+dissBlind+"",
	""+dissCharmed+"",
	""+dissConfused+"",
	""+dissDeafened+"",
	""+dissFrightened+"",
	""+dissGrappled+"",
	""+dissIncapacitated+"",
	""+dissParalyzed+"",
	""+dissPetrified+"",
	""+dissPoisoned+"",
	""+dissProne+"",
	""+dissRestrained+"",
	""+dissStunned+"",
	""+dissUnconscious+"",
	""+dissReactionUsed+""
	)]
[h: abort(SpellStates)]

[h:sSummonType=""]
[h:sSummonList=""]
[h:sSummonCR=2]
[h:AHLSummonNumScaling=""]
[h:AHLSummonNumAdditive=""]
[h:AHLSummonNumMultiplier=""]
[h:AHLSummonCRScaling=""]
[h:AHLSummonCRAdditive=""]
[h:AHLSummonCRMultiplier=""]
[h:sSummonNumber=0]

[h:disIsSummon=if(IsSummon=="No","","throwaway|--------------------------------------------------- Data for Summons ---------------------------------------------------| |LABEL|SPAN=TRUE")]
[h:dissSummonType=if(IsSummon=="No","","sSummonType | Spell Effect,Abberation,Beast,Celestial,Construct,Demon,Devil,Dragon,Elemental,Fey,Fiend,Giant,Monstrosity,Ooze,Plant,Undead,Special List | Type of Creature Summoned |LIST| VALUE=STRING")]
[h:dissSummonCR=if(IsSummon=="Single","sSummonCR | "+listsLevel+" | Max CR of Summon |LIST| VALUE=STRING","")]
[h:dissSummonNumber=if(IsSummon=="Multiple","sSummonNumber | Standard Table,"+listsLevel+" | <html><a href='Standard Table = Table Used for Conjure Animals, etc.'>Number of Creatures Summoned</a></html> |LIST","")]
[h:disAHLSummonSpaces = if(and(IsSummon!="No",IsAHLSummon!=0),"throwaway|----------------------------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE","")]
[h:disAHLSummonNumScaling = if(and(IsSummon!="No",or(IsAHLSummon==1,IsAHLSummon==3)),"AHLSummonNumScaling | Every Level,Every Other Level,Every Three Levels,Other | How Often Does the Number of Creatures Increase At Higher Levels? | LIST | VALUE=STRING SELECT=1","")]
[h:disAHLSummonNumAdditive = if(and(IsSummon!="No",or(IsAHLSummon==1,IsAHLSummon==3)),"AHLSummonNumAdditive | No,"+listsLevel+" | Does the Number of Creatures Increase By a Set Amount Each Level? | LIST | VALUE=STRING SELECT=0","")]
[h:disAHLSummonNumMultiplier = if(and(IsSummon!="No",or(IsAHLSummon==1,IsAHLSummon==3)),"AHLSummonNumMultiplier | No,Doubled,Tripled,Quadrupled,Quintupled | <html><a href='From Base Value, e.g. Doubled = 2x then 3x, Tripled = 3x then 6x, etc.'>Does the Number of Creatures Increase Multiplicatively?</a></html> | LIST | VALUE=STRING SELECT=0","")]
[h:disAHLSummonCRScaling = if(and(IsSummon!="No",or(IsAHLSummon==2,IsAHLSummon==3)),"AHLSummonCRScaling | Every Level,Every Other Level,Every Three Levels,Other | How Often Does CR Increase At Higher Levels? | LIST | VALUE=STRING SELECT=1","")]
[h:disAHLSummonCRAdditive = if(and(IsSummon!="No",or(IsAHLSummon==2,IsAHLSummon==3)),"AHLSummonCRAdditive | No"+listsLevel+" | Does CR Increase By a Set Amount Each Level? | LIST | VALUE=STRING SELECT=0","")]
[h:disAHLSummonCRMultiplier = if(and(IsSummon!="No",or(IsAHLSummon==2,IsAHLSummon==3)),"AHLSummonCRMultiplier | No,Doubled,Tripled,Quadrupled,Quintupled | <html><a href='From Base Value, e.g. Doubled = 2x then 3x, Tripled = 3x then 6x, etc.'>Does CR Increase Multiplicatively?</a></html> | LIST | VALUE=STRING SELECT=0","")]

[h: SpellSummons=input(
	""+disIsSummon+"",
	""+dissSummonType+"",
	""+dissSummonCR+"",
	""+dissSummonNumber+"",
	""+disAHLSummonSpaces+"",
	""+disAHLSummonNumScaling+"",
	""+disAHLSummonNumAdditive+"",
	""+disAHLSummonNumMultiplier+"",
	""+disAHLSummonCRScaling+"",
	""+disAHLSummonCRAdditive+"",
	""+disAHLSummonCRMultiplier+""
	)]
[h: abort(SpellSummons)]

[h:sSummonCR=if(or(sSummonType=="Spell Effect",sSummonType=="Special List"),999,if(sSummonNumber==0,2,sSummonCR))]

[h:sSummonList=if(sSummonType=="Spell Effect",sName,sSummonList)]

[h:dissSummonList=if(sSummonType=="Special List","sSummonList|Be sure to spell correctly, and case sensitive!|Input the name of each creature you can summon, separated by commas.","")]

[h: SpellSummonList=input(
	""+dissSummonList+""
	)]
[h: abort(SpellSummonList)]

[h:CommandText=encode('
[h:placeholdforInputs=""]
[h:SpellName="'+sName+'"]
[h:EffectName="'+EffectName+'"]
[h:RandomEffect='+IsRandomEffect+']
[h:sList='+"'"+sList+"'"+']
[h:sLevel='+sLevel+']
[h:Ritual='+Ritual+']
[h:sSchool="'+sSchool+'"]
[h:CastTime="'+CastTime+'"]
[h:sDuration="'+sDuration+'"]
[h:RangeType="'+RangeType+'"]
[h:AoEShape="'+AoEShape+'"]
[h:sAoENumber='+sAoENumber+']
[h:sRange='+sRange+']
[h:sRangeUnits="'+sRangeUnits+'"]
[h:sRangeScalingAHL="'+sRangeScalingAHL+'"]
[h:sRangeAHL='+sRangeAHL+']
[h:AoESize='+(sConeSize+sCubeSize+sCylinderRadius+sLineLength+sSphereSize)+']
[h:AoESize2='+(sCylinderHeight+sLineWidth)+']
[h:sAoEUnits="'+sAoEUnits+'"]
[h:sAoESizeScalingAHL="'+sAoESizeScalingAHL+'"]
[h:sAoESizeAHL='+sAoESizeAHL+']
[h:vComp='+vComp+']
[h:sComp='+sComp+']
[h:mComp='+mComp+']
[h:mCompItems="'+mCompItems+'"]
[h:mCompConsumed="'+mCompConsumed+'"]
[h:IsSight='+IsSight+']
[h:sConcentration='+sConcentration+']
[h:sConcentrationLost='+sConcentrationLost+']
[h:sSpellSave='+IsSave+']
[h:IsAHL='+IsAHL+']
[h:IsOngoing='+IsOngoing+']
[h:IsOngoingRandom='+IsOngoingRandom+']
[h:DmgHalved='+DmgHalved+']
[h:sSaveType="'+SaveType+'"]
[h:sSpellAttack='+IsAttack+']
[h:sCritThresh='+sCritThresh+']
[h:IsCheck="'+IsCheck+'"]
[h:IsMissiles='+IsMissiles+']
[h:sBaseMissiles='+sBaseMissiles+']
[h:sAHLMissiles='+sAHLMissiles+']
[h:IsDamage='+IsDamage+']
[h:DmgTypeOptions="'+DmgTypeOptions+'"]
[h:isRandomType='+isRandomType+']
[h:DmgType="'+DmgType+'"]
[h:DmgDieNumber='+DmgDieNumber+']
[h:DmgDieSize='+DmgDieSize+']
[h:DmgDieFlatBonus="'+DmgDieFlatBonus+'"]
[h:DmgDieMODBonus="'+DmgDieMODBonus+'"]
[h:DmgType2Options="'+DmgType2Options+'"]
[h:isRandomType2='+isRandomType2+']
[h:DmgType2="'+DmgType2+'"]
[h:DmgDie2Number='+DmgDie2Number+']
[h:DmgDie2Size='+DmgDie2Size+']
[h:DmgDie2FlatBonus="'+DmgDie2FlatBonus+'"]
[h:DmgDie2MODBonus="'+DmgDie2MODBonus+'"]
[h:AHLScaling="'+AHLScaling+'"]
[h:AHLDmgType="'+AHLDmgType+'"]
[h:AHLDamageNumber='+AHLDamageNumber+']
[h:AHLDmgDieSize='+AHLDmgDieSize+']
[h:AHLFlatBonus="'+AHLFlatBonus+'"]
[h:AHLDmgType2="'+AHLDmgType2+'"]
[h:AHLDmgDie2Number='+AHLDmgDie2Number+']
[h:AHLDmgDie2Size='+AHLDmgDie2Size+']
[h:AHL2FlatBonus="'+AHL2FlatBonus+'"]
[h:sMultiTarget='+sMultiTarget+']
[h:IsTargetsAHL='+IsTargetsAHL+']
[h:sMultiTargetRange="'+sMultiTargetRange+'"]
[h:AHLTargetScaling="'+AHLTargetScaling+'"]
[h:AHL2Duration="'+AHL2Duration+'"]
[h:AHL3Duration="'+AHL3Duration+'"]
[h:AHL4Duration="'+AHL4Duration+'"]
[h:AHL5Duration="'+AHL5Duration+'"]
[h:AHL6Duration="'+AHL6Duration+'"]
[h:AHL7Duration="'+AHL7Duration+'"]
[h:AHL8Duration="'+AHL8Duration+'"]
[h:AHL9Duration="'+AHL9Duration+'"]
[h:IsAura='+IsAura+']
[h:AuraSize="'+AuraSize+'"]
[h:sStatusName="'+sStatusName+'"]
[h:sStatus='+sStatus+']
[h:sBlind='+sBlind+']
[h:sCharmed='+sCharmed+']
[h:sConfused='+sConfused+']
[h:sDeafened='+sDeafened+']
[h:sFrightened='+sFrightened+']
[h:sGrappled='+sGrappled+']
[h:sIncapacitated='+sIncapacitated+']
[h:sParalyzed='+sParalyzed+']
[h:sPetrified='+sPetrified+']
[h:sPoisoned='+sPoisoned+']
[h:sProne='+sProne+']
[h:sRestrained='+sRestrained+']
[h:sStunned='+sStunned+']
[h:sUnconscious='+sUnconscious+']
[h:sReactionUsed='+sReactionUsed+']
[h:IsBuff="'+IsBuff+'"]
[h:BuffsList="'+BuffsList+'"]
[h:BuffScaling="'+BuffScaling+'"]
[h:IsDebuff="'+IsDebuff+'"]
[h:DebuffsList="'+DebuffsList+'"]
[h:DebuffScaling="'+DebuffScaling+'"]
[h:IsSummon="'+IsSummon+'"]
[h:IsAHLSummon="'+IsAHLSummon+'"]
[h:sSummonType="'+sSummonType+'"]
[h:sSummonList="'+sSummonList+'"]
[h:sSummonNumber='+sSummonNumber+']
[h:sSummonCR='+sSummonCR+']
[h:AHLSummonCRScaling="'+AHLSummonCRScaling+'"]
[h:AHLSummonCRMultiplier="'+AHLSummonCRMultiplier+'"]
[h:AHLSummonCRAdditive="'+AHLSummonCRAdditive+'"]
[h:AHLSummonNumMultiplier="'+AHLSummonNumMultiplier+'"]
[h:AHLSummonNumAdditive="'+AHLSummonNumAdditive+'"]
[h:AHLSummonNumScaling="'+AHLSummonNumScaling+'"]
[h:sDescription="'+sDescription+'"]
[h:sDescriptionTT="'+sDescriptionTT+'"]
[h:placeholdToAdd=""]
	
[h:pm.OngSpellDataSet()]')]

[h:CommandText=CommandText+if(useSelectedDmgType,'
	[h:OngoingSpellData=json.set(OngoingSpellData,"DmgType",json.get(macro.return,"DmgType"))]','')+if(useSelectedDmgType2,'
	[h:OngoingSpellData=json.set(OngoingSpellData,"DmgType2",json.get(macro.return,"DmgType2"))]','')+'
	[h,foreach(SpellVariable,OngoingModArrayVars),CODE:{[h:OngoingSpellData=json.set(OngoingSpellData,SpellVariable,listGet(OngoingModArrayValues,roll.count))]}]']

[h:CommandText=CommandText+if(IsOngoingRandom,'
	[h:FinalOngoingSpellData=json.append(FinalOngoingSpellData,OngoingSpellData)]','
	[h:ActiveSpells=json.append(ActiveSpells,OngoingSpellData)]')]

[h:macro.return=json.set("","CommandText",CommandText,"EffectNumber",sMultiEffects,"IsRandomEffect",IsRandomEffect,"sName",sName,"sLevel",sLevel,"CastTime",CastTime,"IsOngoing",IsOngoing,"sList",sList,"IsOngoingRandom",IsOngoingRandom,"sDescription",sDescription,"sDescriptionTT",sDescription,"IsAHLSummon",IsAHLSummon,"IsSummon",IsSummon,"sSchool",sSchool,"sDuration",sDuration,"AoEShape",AoEShape,"RangeType",RangeType)]