[h:SpellData = macro.args]
[h:IsTooltip = 0]
[h:ParentToken=json.get(json.get(SpellData,0),"ParentToken")]
[h:ForcedClass=json.get(json.get(SpellData,0),"ForcedClass")]
[h:ForcedLevel=json.get(json.get(SpellData,0),"ForcedLevel")]
[h:FreeCasting=json.get(json.get(SpellData,0),"FreeCasting")]
[h:SpellName=json.get(json.get(SpellData,0),"SpellName")]
[h:SpellSource=json.get(json.get(SpellData,0),"SpellSource")]
[h:sList=json.get(json.get(SpellData,0),"sList")]
[h:sLevel=json.get(json.get(SpellData,0),"sLevel")]
[h:Ritual=json.get(json.get(SpellData,0),"Ritual")]
[h:sSchool=json.get(json.get(SpellData,0),"sSchool")]
[h:IsSight=json.get(json.get(SpellData,0),"IsSight")]
[h:mCompConsumed=json.get(json.get(SpellData,0),"mCompConsumed")]
[h:vComp=json.get(json.get(SpellData,0),"vComp")]
[h:sConcentration=json.get(json.get(SpellData,0),"sConcentration")]
[h:sConcentrationLost=json.get(json.get(SpellData,0),"sConcentrationLost")]
[h:InnateCast=json.get(json.get(SpellData,0),"InnateCast")]
[h:MonsterCast=json.get(json.get(SpellData,0),"MonsterCast")]
[h:IsCantrip = if(sLevel==0,1,0)]
[h:NeedsBorder = if(json.get(json.get(SpellData,0),"NeedsBorder")=="",1,json.get(json.get(SpellData,0),"NeedsBorder"))]

[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Spell"]

[h:sSpellChoice=0]
[h:MultiEffectChoiceTest=0]
[h:SpellEffectOptions=""]

[h,if(json.length(SpellData)==1),CODE:{
	[h:FinalSpellData=json.get(SpellData,0)]
};{
	[h:RandomEffectTest=json.get(json.get(SpellData,0),"RandomEffect")]
	[h,if(RandomEffectTest==1),CODE:{
		[h:SpellEffectOptions=(json.length(SpellData)-1)]
		[h:SpellEffectChoice=(eval("1d"+SpellEffectOptions)+1)]
	};{
		[h:MultiEffectChoiceTest=1]
		[h,foreach(SpellEffect,SpellData): SpellEffectOptions=listAppend(SpellEffectOptions,json.get(SpellEffect,"EffectName"))]
	}]
}]

[h:BaseLink="https://www.dndbeyond.com/spells/"]
[h:CompendiumLink=concat('<a href=',BaseLink,replace(SpellName,' ','-'),'>',SpellName,'</a>')]

[h:"<!--- Dialogue --->"]
[h:sClassSelect=""]
[h:sLevelSelect=""]
[h:classList = pm.GetClasses("Name","json")]

[h,if(ForcedClass=="" && InnateCast==0),CODE:{
	[h:ClassOptionsArray = "[]"]
	[h:pm.PassiveFunction("SpellClass")]
	
	[h:ClassOptions = ""]
	[h,foreach(castingClass,ClassOptionsArray),CODE:{
		[h:isClassTest = json.contains(classList,json.get(castingClass,"Class"))]
		[h,if(isClassTest):
			ClassOptions = json.append(ClassOptions,pm.GetDisplayName(json.get(castingClass,"Class"),"sb.Classes"));
			ClassOptions = json.append(ClassOptions,json.get(castingClass,"DisplayName"))
		]
	}]
	[h:ClassOptionsArray = json.append(ClassOptionsArray,"None")]
};{
	[h:ClassOptionsArray = json.append("",ForcedClass)]
	[h,if(ForcedClass!=""): ClassOptionsArray = ForcedClass]
	[h,if(InnateCast==1): ClassOptions=if(MonsterCast==0,Race,"Monster")]
}]

[h,if(ForcedLevel==""),CODE:{
	[h:MaxSpellLevel = 9]
	[h,if(Ritual==1),CODE:{
		[h:LevelOptions = json.append("","Ritual")]
		[h:LevelOptionData = json.append("",json.set("","Name","Ritual","ResourceType","Ritual"))]
	};{
		[h:LevelOptions = "[]"]
		[h:LevelOptionData = "[]"]
	}]
	[h,count(MaxSpellLevel),CODE:{
		[h,if((1+roll.count)>=sLevel && json.get(SpellSlots,roll.count+1)>0): LevelOptions = json.append(LevelOptions,if(roll.count==0,"1st",if(roll.count==1,"2nd",if(roll.count==2,"3rd",(roll.count+1)+"th")))+" Level")]
		[h,if(roll.count<sLevel && json.get(SpellSlots,roll.count+1)>0): json.append(LevelOptionData,json.set("","Name",(roll.count+1),"ResourceType","Spell Slots"))]
	}]
	
	[h:resourcesAsSpellSlot = json.path.read(allAbilities,"[*][?(@.ResourceAsSpellSlot==1)]")]
	[h,foreach(resource,resourcesAsSpellSlot),CODE:{
		[h,if(json.get(resource,"Resource")>0): LevelOptions = json.append(LevelOptions,json.get(resource,"DisplayName"))]
		[h,if(json.get(resource,"Resource")>0): LevelOptionData = json.append(LevelOptionData,json.set(resource,"ResourceType","FeatureSpell"))]
	}]
	
	[h:LevelOptions = json.append(LevelOptions,"Free")]
	[h:LevelOptionData = json.append(LevelOptionData,json.set("","Name","FreeCasting","ResourceType","None"))]
	
	[h,if(IsCantrip),CODE:{
		[h:LevelOptions = json.append("","Cantrip")]
		[h:LevelOptionData = json.append("",json.set("","Name","Cantrip","ResourceType","None"))]
		[h:chosenLevel = 0]
	};{
		[h:chosenLevel = -1]
	}]
};{
	[h,if(json.type(ForcedLevel)=="UNKNOWN"),CODE:{
		[h:LevelOptions = if(ForcedLevel==1,"1st",if(ForcedLevel==2,"2nd",if(ForcedLevel==3,"3rd",ForcedLevel+"th")))+" Level"]
		[h:LevelOptionData = json.append("",json.set("","Name",ForcedLevel,"ResourceType","Spell Slots"))]
	};{
		[h:LevelOptions = json.get(ForcedLevel,"DisplayName")]
		[h:LevelOptionData = json.append("",json.set(ForcedLevel,"ResourceType","FeatureSpell"))]
	}]
	
	[h,if(IsCantrip),CODE:{
		[h:LevelOptions = json.append("","Cantrip")]
		[h:LevelOptionData = json.append("",json.set("","Name","Cantrip","ResourceType","Cantrip"))]
	};{}]
	[h:chosenLevel = 0]
}]

[h:dissConcentration=if(or(sConcentration==0,sLevel>=sConcentrationLost),"",if(Concentration=="","","junkVar|<html><span style='font-size:1.2em';>Casting <span style='color:#2222AA'><i>"+SpellName+"</i></span> will cancel concentration on <span style='color:#AA2222'><i>"+Concentration+".</i></span></span></html>|<html><span style='color:#AA2222; font-size:1.2em'><b>sp.NING</b></span></html>|LABEL"))]
[h:disIsSilenced=if(or(getState("Silence")==0,vComp==0),"","junkVar|<html><span style='font-size:1.2em';><span style='color:#AA2222'><i><b>NOTE: You are currently silenced and attempting to cast a spell with verbal components!</b></i></span></span></html>| |LABEL|SPAN=TRUE")]
[h:disIsBlinded=if(or(getState("Blinded")==0,IsSight==0),"","junkVar|<html><span style='font-size:1.2em';><span style='color:#AA2222'><i><b>NOTE: You are currently blinded and this spell requires sight!</b></i></span></span></html>| |LABEL|SPAN=TRUE")]
[h:disCompConsumed=if(or(mCompConsumed=="0",mCompConsumed==""),"","junkVar|"+mCompConsumed+"|Consumed Components|LABEL")]
[h:disSpellEffectChoices=if(MultiEffectChoiceTest==1,"sSpellChoice | "+SpellEffectOptions+" | Choose an Effect | RADIO | ","")]

[h,if(json.length(ClassOptionsArray) < 3),CODE:{
	[h:chosenClass = 0]
	[h:tempClassSelect = json.get(ClassOptionsArray,0)]
	[h:infoTypeTest = json.type(tempClassSelect)]
	[h,if(infoTypeTest == "UNKNOWN"),CODE:{
		[h:disSpellClassSelect = " junkVar | "+pm.GetDisplayName(tempClassSelect,"sb.Classes")+" | Casting Class | LABEL "]
	};{
		[h:tempClassTest = json.contains(classList,json.get(tempClassSelect,"Class"))]
		[h,if(tempClassTest):
			disSpellClassSelect = " junkVar | "+pm.GetDisplayName(json.get(tempClassSelect,"Class"),"sb.Classes")+" | Casting Class | LABEL ";
			disSpellClassSelect = " junkVar | "+json.get(tempClassSelect,"DisplayName")+" | Casting Class | LABEL "			
		]
	}]
};{
	[h:disSpellClassSelect = " chosenClass | "+ClassOptions+" | Casting Class | LIST | DELIMITER=JSON "]
}]

[h:disSpellLevelSelect = if(ForcedLevel=="","chosenLevel | "+LevelOptions+" | Spell Level | LIST | DELIMITER=JSON ","junkVar | "+LevelOptions+" | Spell Level | LABEL ")]
[h:disPassiveChoices = ""]

[h:pm.PassiveFunction("SpellChoices")]

[h:disPassiveBars = if(disPassiveChoices=="","","junkvar | ----------------------------------------------------------- |  | LABEL | SPAN=TRUE ")]

[h,if(and(ForcedClass=="",InnateCast==0)||ForcedLevel==""||MultiEffectChoiceTest==1),CODE:{
	[h:abort(input(
		"junk|<-- Link to Compendium|<html>"+CompendiumLink+"</html>|LABEL",
		dissConcentration,
		disIsSilenced,
		disIsBlinded,
		"junkVar|"+SpellName+" ("+sLevel+") "+sSchool+"|Spell|LABEL",
		disSpellClassSelect,
		disSpellLevelSelect,
		"sRulesShow| "+(getLibProperty("FullSpellRules","Lib:pm.a5e.Core"))+" |Show Full Spell Rules|CHECK|",
		disCompConsumed,
		disSpellEffectChoices,
		disPassiveBars,
		disPassiveChoices
	))]
	[h,if(IsCantrip): sLevelSelect = "Cantrip"]
};{
	[h:sClassSelect=if(ForcedClass!="",ForcedClass,if(InnateCast,Race,""))]
	[h:sLevelSelect=ForcedLevel]
	[h,if(IsCantrip): sLevelSelect = "Cantrip"]
	[h:sRulesShow=getLibProperty("FullSpellRules","Lib:pm.a5e.Core")]
	[h:abort(input(
		disPassiveBars,
		disPassiveChoices
	))]
}]

[h:sClassSelectData = json.get(ClassOptionsArray,chosenClass)]
[h,if(json.type(sClassSelectData)=="UNKNOWN"):
	sClassSelect = sClassSelectData;
	sClassSelect = json.get(sClassSelectData,"Class")
]

[h:RitualTest = 0]
[h:sLevelSelectData = json.get(LevelOptionData,chosenLevel)]
[h,switch(json.get(sLevelSelectData,"ResourceType")),CODE:
	case "Spell Slots":{
		[h:eLevel = number(json.get(sLevelSelectData,"Name"))]
		[h,if(FreeCasting!=1): SpellSlots = json.set(SpellSlots,eLevel,json.get(SpellSlots,eLevel)-1)]
	};
	case "FeatureSpell":{
		[h:eLevel = evalMacro(json.get(sLevelSelectData,"ResourceSpellLevel"))]
		[h,if(FreeCasting!=1): allAbilities = json.path.set(allAbilities,"[*][?(@.Name=='"+json.get(sLevelSelectData,"Name")+"' && @.Class=='"+json.get(sLevelSelectData,"Class")+"' && @.Subclass=='"+json.get(sLevelSelectData,"Subclass")+"')]['Resource']",json.get(sLevelSelectData,"Resource")-1)]
	};
	case "Ritual":{
		[h:eLevel = sLevel]
		[h:RitualTest = 1]
	};
	case "Cantrip":{
		[h:eLevel=0+if(Level>=5,1,0)+if(Level>=11,1,0)+if(Level>=17,1,0]
	};
	default:{
		[h:eLevel = sLevel]
	}
]

[h:FinalSpellData=json.get(SpellData,sSpellChoice)]
[h:"<!--- Dialogue --->"]

[h:"<!-- Setting values after the effect has been chosen -->"]

[h:Flavor=json.get(FinalSpellData,"Flavor")]
[h:ParentToken=json.get(FinalSpellData,"ParentToken")]
[h:FreeCasting=json.get(FinalSpellData,"FreeCasting")]
[h:ForcedClass=json.get(FinalSpellData,"ForcedClass")]
[h:ForcedLevel=json.get(FinalSpellData,"ForcedLevel")]
[h:ForcedSummonName=json.get(FinalSpellData,"ForcedSummonName")]
[h:ForcedImage=json.get(FinalSpellData,"ForcedImage")]
[h:ForcedPortrait=json.get(FinalSpellData,"ForcedPortrait")]
[h:ForcedHandout=json.get(FinalSpellData,"ForcedHandout")]
[h:DMOnly=json.get(FinalSpellData,"DMOnly")]
[h:InnateCast=json.get(FinalSpellData,"InnateCast")]
[h:MonsterCast=json.get(FinalSpellData,"MonsterCast")]
[h:AuraColor=json.get(FinalSpellData,"AuraColor")]
[h:BorderColorOverride=json.get(FinalSpellData,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(FinalSpellData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(FinalSpellData,"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(FinalSpellData,"AccentTextOverride")]
[h:TitleFont=json.get(FinalSpellData,"TitleFont")]
[h:BodyFont=json.get(FinalSpellData,"BodyFont")]
[h:CritMessage=json.get(FinalSpellData,"CritMessage")]
[h:CritFailMessage=json.get(FinalSpellData,"CritFailMessage")]
[h:SpellName=json.get(FinalSpellData,"SpellName")]
[h:sList=json.get(FinalSpellData,"sList")]
[h:sLevel=json.get(FinalSpellData,"sLevel")]
[h:Ritual=json.get(FinalSpellData,"Ritual")]
[h:sSchool=json.get(FinalSpellData,"sSchool")]
[h:CastTime=json.get(FinalSpellData,"CastTime")]
[h:RangeType=json.get(FinalSpellData,"RangeType")]
[h:Range=json.get(FinalSpellData,"sRange")]
[h:sRangeUnits=json.get(FinalSpellData,"sRangeUnits")]
[h:sRangeScalingAHL=json.get(FinalSpellData,"sRangeScalingAHL")]
[h:sRangeAHL=json.get(FinalSpellData,"sRangeAHL")]
[h:AoEShape=json.get(FinalSpellData,"AoEShape")]
[h:sAoENumber=json.get(FinalSpellData,"sAoENumber")]
[h:sAoESizeScalingAHL=json.get(FinalSpellData,"sAoESizeScalingAHL")]
[h:sAoESizeAHL=json.get(FinalSpellData,"sAoESizeAHL")]
[h:AoESize=json.get(FinalSpellData,"AoESize")]
[h:AoESize2=json.get(FinalSpellData,"AoESize2")]
[h:vComp=json.get(FinalSpellData,"vComp")]
[h:sComp=json.get(FinalSpellData,"sComp")]
[h:mComp=json.get(FinalSpellData,"mComp")]
[h:mCompItems=json.get(FinalSpellData,"mCompItems")]
[h:mCompConsumed=json.get(FinalSpellData,"mCompConsumed")]
[h:sSaveType=json.get(FinalSpellData,"sSaveType")]
[h:DmgHalved=json.get(FinalSpellData,"DmgHalved")]
[h:IsMissiles=json.get(FinalSpellData,"IsMissiles")]
[h:sBaseMissiles=json.get(FinalSpellData,"sBaseMissiles")]
[h:sAHLMissiles=json.get(FinalSpellData,"sAHLMissiles")]
[h:DmgType=json.get(FinalSpellData,"DmgType")]
[h:isRandomType=json.get(FinalSpellData,"isRandomType")]
[h:DmgTypeOptions=json.get(FinalSpellData,"DmgTypeOptions")]
[h:DmgDieNum=json.get(FinalSpellData,"DmgDieNum")]
[h:DmgDieSize=json.get(FinalSpellData,"DmgDieSize")]
[h:DmgDieFlatBonus=json.get(FinalSpellData,"DmgDieFlatBonus")]
[h:DmgDieMODBonus=json.get(FinalSpellData,"DmgDieMODBonus")]
[h:isRandomType2=json.get(FinalSpellData,"isRandomType2")]
[h:DmgType2Options=json.get(FinalSpellData,"DmgType2Options")]
[h:DmgType2=json.get(FinalSpellData,"DmgType2")]
[h:DmgDie2Num=json.get(FinalSpellData,"DmgDie2Num")]
[h:DmgDie2Size=json.get(FinalSpellData,"DmgDie2Size")]
[h:DmgDie2FlatBonus=json.get(FinalSpellData,"DmgDie2FlatBonus")]
[h:DmgDie2MODBonus=json.get(FinalSpellData,"DmgDie2MODBonus")]
[h:AHLScaling=json.get(FinalSpellData,"AHLScaling")]
[h:AHLDmgType=json.get(FinalSpellData,"AHLDmgType")]
[h:AHLDamageNumber=json.get(FinalSpellData,"AHLDamageNumber")]
[h:AHLDmgDieSize=json.get(FinalSpellData,"AHLDmgDieSize")]
[h:AHLFlatBonus=json.get(FinalSpellData,"AHLFlatBonus")]
[h:AHLDmgType2=json.get(FinalSpellData,"AHLDmgType2")]
[h:AHLDmgDie2Num=json.get(FinalSpellData,"AHLDmgDie2Num")]
[h:AHLDmgDie2Size=json.get(FinalSpellData,"AHLDmgDie2Size")]
[h:AHL2FlatBonus=json.get(FinalSpellData,"AHL2FlatBonus")]
[h:sMultiTarget=json.get(FinalSpellData,"sMultiTarget")]
[h:IsTargetsAHL=json.get(FinalSpellData,"IsTargetsAHL")]
[h:AHLTargetScaling=json.get(FinalSpellData,"AHLTargetScaling")]
[h:AHL2Duration=json.get(FinalSpellData,"AHL2Duration")]
[h:AHL3Duration=json.get(FinalSpellData,"AHL3Duration")]
[h:AHL4Duration=json.get(FinalSpellData,"AHL4Duration")]
[h:AHL5Duration=json.get(FinalSpellData,"AHL5Duration")]
[h:AHL6Duration=json.get(FinalSpellData,"AHL6Duration")]
[h:AHL7Duration=json.get(FinalSpellData,"AHL7Duration")]
[h:AHL8Duration=json.get(FinalSpellData,"AHL8Duration")]
[h:AHL9Duration=json.get(FinalSpellData,"AHL9Duration")]
[h:AuraSize=json.get(FinalSpellData,"AuraSize")]
[h:sStatusName=json.get(FinalSpellData,"sStatusName")]
[h:sStatus=json.get(FinalSpellData,"sStatus")]
[h:sBlind=json.get(FinalSpellData,"sBlind")]
[h:sCharmed=json.get(FinalSpellData,"sCharmed")]
[h:sConfused=json.get(FinalSpellData,"sConfused")]
[h:sDeafened=json.get(FinalSpellData,"sDeafened")]
[h:sFrightened=json.get(FinalSpellData,"sFrightened")]
[h:sGrappled=json.get(FinalSpellData,"sGrappled")]
[h:sIncapacitated=json.get(FinalSpellData,"sIncapacitated")]
[h:sParalyzed=json.get(FinalSpellData,"sParalyzed")]
[h:sPetrified=json.get(FinalSpellData,"sPetrified")]
[h:sPoisoned=json.get(FinalSpellData,"sPoisoned")]
[h:sProne=json.get(FinalSpellData,"sProne")]
[h:sRestrained=json.get(FinalSpellData,"sRestrained")]
[h:sStunned=json.get(FinalSpellData,"sStunned")]
[h:sUnconscious=json.get(FinalSpellData,"sUnconscious")]
[h:sReactionUsed=json.get(FinalSpellData,"sReactionUsed")]
[h:DebuffsList=json.get(FinalSpellData,"DebuffsList")]
[h:BuffsList=json.get(FinalSpellData,"BuffsList")]
[h:sDescription=json.get(FinalSpellData,"sDescription")]
[h:IsBuff=json.get(FinalSpellData,"IsBuff")]
[h:IsDebuff=json.get(FinalSpellData,"IsDebuff")]
[h:sSpellSave=json.get(FinalSpellData,"sSpellSave")]
[h:Duration=json.get(FinalSpellData,"sDuration")]
[h:IsSummon=json.get(FinalSpellData,"IsSummon")]
[h:IsAHLSummon=json.get(FinalSpellData,"IsAHLSummon")]
[h:sSummonType=json.get(FinalSpellData,"sSummonType")]
[h:sSummonList=json.get(FinalSpellData,"sSummonList")]
[h:AHLSummonCRScaling=json.get(FinalSpellData,"AHLSummonCRScaling")]
[h:AHLSummonCRMultiplier=json.get(FinalSpellData,"AHLSummonCRMultiplier")]
[h:AHLSummonCRAdditive=json.get(FinalSpellData,"AHLSummonCRAdditive")]
[h:AHLSummonNumScaling=json.get(FinalSpellData,"AHLSummonNumScaling")]
[h:AHLSummonNumMultiplier=json.get(FinalSpellData,"AHLSummonNumMultiplier")]
[h:AHLSummonNumAdditive=json.get(FinalSpellData,"AHLSummonNumAdditive")]
[h:sSummonCR=json.get(FinalSpellData,"sSummonCR")]
[h:sSummonNumber=json.get(FinalSpellData,"sSummonNumber")]
[h:sSpellAttack=json.get(FinalSpellData,"sSpellAttack")]
[h:sCritThresh=json.get(FinalSpellData,"sCritThresh")]
[h:IsDamage=json.get(FinalSpellData,"IsDamage")]
[h:IsAHL=json.get(FinalSpellData,"IsAHL")]
[h:IsAura=json.get(FinalSpellData,"IsAura")]
[h:IsOngoing=json.get(FinalSpellData,"IsOngoing")]
[h:IsCheck=json.get(FinalSpellData,"IsCheck")]
[h:IsSight=json.get(FinalSpellData,"IsSight")]
[h:sConcentration=json.get(FinalSpellData,"sConcentration")]
[h:sConcentrationLost=json.get(FinalSpellData,"sConcentrationLost")]

[h:CastTime=if(CastTime=="Action","Action",CastTime)]
[h:CastTime=if(CastTime=="BONUS","Bonus Action",CastTime)]
[h:CastTime=if(CastTime=="REACTION","Reaction",CastTime)]
[h:CastTime=if(CastTime=="1 MIN","1 Minute",CastTime)]
[h:CastTime=if(CastTime=="10 MIN","10 Minutes",CastTime)]
[h:CastTime=if(CastTime=="1 HOUR","1 Hour",CastTime)]
[h:CastTime=if(CastTime=="8 HOURS","8 Hours",CastTime)]
[h:CastTime=if(CastTime=="12 HOURS","12 Hours",CastTime)]
[h:CastTime=if(CastTime=="24 HOURS","12 Hours",CastTime)]

[h:"<!-- Temporarily setting the type of spell to Arcane always since it has yet to be implemented (will probably happen in full spell rework) -->"]
[h:sSource = "Arcane"]

[h:DefaultDisplayData = pm.SpellColors(json.set("","Level",if(IsCantrip,"0",string(eLevel)),"Source",sSource))]
[h:BorderColor = json.get(DefaultDisplayData,"Border")]
[h:TextColor = json.get(DefaultDisplayData,"Title")]

[h:"<!--- Cancel Old Spell Notice --->"]
[h,if(getState("Concentrating") && sConcentration==1 && eLevel<sConcentrationLost),CODE:{

	[h:FlavorData = json.set("",
		"Flavor",Flavor,
		"ParentToken",ParentToken)]
	
	[MACRO("End Concentration@Lib:Spellbook"):FlavorData]
};{}]

[h:"<!--- Cancel Old Spell Notice --->"]

[h,if(DmgType2Options=="" && DmgTypeOptions==""),CODE:{};{
	
	[h:disDmgTypeOptions=""]
	[h:disDmgType2Options=""]
	
	[h,if(isRandomType),CODE:{
		[h:DmgTypeOptions=if(DmgTypeOptions=="",DmgType,DmgTypeOptions)]
		[h:dmgTypeRoll=eval("1d"+listCount(DmgTypeOptions))]
		[h:DmgType=listGet(DmgTypeOptions,dmgTypeRoll)]
		[h:AHLDmgType=listGet(DmgTypeOptions,dmgTypeRoll)]
	};{
		[h:disDmgTypeOptions=if(DmgTypeOptions=="","","DmgType | "+DmgTypeOptions+" | Choose a Damage Type | LIST | VALUE=STRING ")]
	}]
	
	[h,if(isRandomType2),CODE:{
		[h:DmgType2Options=if(DmgType2Options=="",DmgType2,DmgType2Options)]
		[h:dmgType2Roll=eval("1d"+listCount(DmgType2Options))]
		[h:DmgType2=listGet(DmgType2Options,dmgType2Roll)]
		[h:AHLDmgType2=listGet(DmgType2Options,dmgType2Roll)]
	};{
		[h:disDmgType2Options=if(DmgType2Options=="","","DmgType2 | "+DmgType2Options+" | Choose a Secondary Damage Type | LIST | VALUE=STRING ")]
	}]

	[h:SelectDamageTypes=0]
	[h:DamageCancelCheck=0]
	[h,while(SelectDamageTypes==0),CODE:{
		[h:disCancelCheck=if(DamageCancelCheck,"junkVar | You need to make a choice or else errors will occur! | Warning | LABEL ","")]
		[h:SelectDamageTypes=input(
			""+disCancelCheck+"",
			""+disDmgTypeOptions+"",
			""+disDmgType2Options+""
			)]
		[h:DamageCancelCheck=1]
		[h:AHLDmgType=if(disDmgTypeOptions=="",AHLDmgType,DmgType)]
		[h:AHLDmgType2=if(disDmgType2Options=="",AHLDmgType2,DmgType2)]
	}]
	
}]

[h:CastTime=if(RitualTest,CastTime+" + 10 minutes (ritual)",CastTime)]
[h:AHL=eLevel-sLevel]

[h,if(json.type(sClassSelectData)=="UNKNOWN"): 
	PrimeStat = json.get(getLibProperty("sb.CastingAbilities","Lib:pm.a5e.Core"),sClassSelect);
	PrimeStat = json.get(sClassSelectData,"PrimeStat")
]
[h:PrimeStat = if(PrimeStat=="","None",PrimeStat)]
[h,if(PrimeStat == "None"): PrimeStatMod = 0; PrimeStatMod = json.get(AtrMods,PrimeStat)]
[h:pm.PassiveFunction("SpellStat")]

[h:MissileCount=sBaseMissiles+(AHL*sAHLMissiles)]

[h:setState("Concentrating",if(and(eLevel<sConcentrationLost,sConcentration==1),1,getState("Concentrating")))]
[h:Concentration=if(and(eLevel<sConcentrationLost,sConcentration==1),SpellName,Concentration)]

[h:CompendiumLink=concat('<a style="color:'+TextColor+';" href=',BaseLink,replace(SpellName,' ','-'),'>',SpellName,'</a>')]

[h:"<!--Note: need a better way to apply brutal crit effects, currently only applies to dmgtype1 (secBrutalCrit does nothing atm) but should be able to choose which one. Same for dmg MOD. Could go into untyped category I guess. -->"]

[h:SaveDC = 8+Proficiency+PrimeStatMod]
[h:AttackMod = Proficiency+PrimeStatMod]
[h:sp.CritRange = 0]
[h:BrutalCrit = 0]
[h:BrutalCrit2 = if(DmgDie2Num==0,0,BrutalCrit)]
[h:CritTest=0]
[h:AllAttacksToHit="[]"]
[h:AllAttacksDmg="[]"]
[h:AllAttacksSecDmg="[]"]

[h:sp.FinalCritRange = 20 - sp.CritRange]

[h:dDuration = if(and(AHL2Duration!="",eLevel==2),AHL2Duration+" (increased by upcasting)",Duration)]
[h:dDuration = if(and(AHL3Duration!="",eLevel==3),AHL3Duration+" (increased by upcasting)",dDuration)]
[h:dDuration = if(and(AHL4Duration!="",eLevel==4),AHL4Duration+" (increased by upcasting)",dDuration)]
[h:dDuration = if(and(AHL5Duration!="",eLevel==5),AHL5Duration+" (increased by upcasting)",dDuration)]
[h:dDuration = if(and(AHL6Duration!="",eLevel==6),AHL6Duration+" (increased by upcasting)",dDuration)]
[h:dDuration = if(and(AHL7Duration!="",eLevel==7),AHL7Duration+" (increased by upcasting)",dDuration)]
[h:dDuration = if(and(AHL8Duration!="",eLevel==8),AHL8Duration+" (increased by upcasting)",dDuration)]
[h:dDuration = if(and(AHL9Duration!="",eLevel==9),AHL9Duration+" (increased by upcasting)",dDuration)]

[h:AoEScaling=if(sAoESizeScalingAHL=="Every Level",AHL,if(sAoESizeScalingAHL=="Every Other Level",floor(AHL/2),if(sAoESizeScalingAHL=="Every Three Levels",floor(AHL/3),0)))]
[h:dAoESizeAHL = sAoESizeAHL*AoEScaling]
[h:RangeScaling=if(sRangeScalingAHL=="Every Level",AHL,if(sRangeScalingAHL=="Every Other Level",floor(AHL/2),if(sRangeScalingAHL=="Every Three Levels",floor(AHL/3),0)))]
[h:dRangeAHL = sRangeAHL*RangeScaling]
[h:DamageScaling=if(AHLScaling=="Every Level",AHL,if(AHLScaling=="Every Other Level",floor(AHL/2),if(AHLScaling=="Every Three Levels",floor(AHL/3),0)))]

[h:RerollSpellData=json.append("",json.set(FinalSpellData,"ForcedClass",sClassSelect,"ForcedLevel",if(IsCantrip,"Cantrip",eLevel),"FreeCasting",1))]
[h:sRerollLink=macroLinkText("SpellCasting@Lib:pm.a5e.Core","gm-self",RerollSpellData,ParentToken)]

[h:abilityClass = sClassSelect]
[h:abilityDisplayName = "<b>"+CompendiumLink+"</b> ("+sLevel+") <i>"+if(RitualTest," (ritual)","")+"</i>"]
[h:abilityFalseName = "Spellcasting"]
[h:abilityOnlyRules = 0]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]
[h:abilityTable = ""]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Spell Class and Level",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(IsCantrip,sClassSelect+" Cantrip","Level "+eLevel+if(RitualTest," Ritual","")+" "+sClassSelect+" Spell"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]
	
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","School",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",upper(sSchool,1),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Casting Time",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",CastTime,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Range",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(RangeType=="Ranged","Range "+(Range+dRangeAHL)+" "+sRangeUnits,RangeType)+if(AoEShape=="None","",", "+(AoESize+dAoESizeAHL)+" "+AoEShape),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Components",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(or(vComp,SComp,MComp),if(vComp,"V","")+if(and(vComp,sComp),", ","")+if(sComp,"S","")+if(or(and(sComp,mComp),and(vComp,mComp,sComp==0)),", ","")+if(mComp,"M ("+mCompItems+")",""),""),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h,if(mCompConsumed == ""),CODE:{};{
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",0,
		"Header","Consumed Components",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",mCompConsumed,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']",
		"LinkText","",
		"Link","",
		"Value",""
		))]
}]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Duration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",dDuration,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h,if(sSpellSave!=0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Saving Throw",
	"FalseHeader","",
	"FullContents",sSaveType,
	"RulesContents","DC "+SaveDC+" ",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:CurrentMissile=0]
[h:sp.AllMissileData = ""]
[h,count(MissileCount),code:{
	[h:sp.ThisMissileData = "{}"]
   
	[h,SWITCH(sSpellAttack+""+json.get(FinalSpellData,"Advantage")+json.get(FinalSpellData,"ForcedAdvantage")),CODE:
		case "1-11": {
			[h:sp.AdvDis = -1]
			};
		case "1-10": {
			[h:sp.Adv = 0]
			[h:sp.Dis = 1]
			[h:pm.PassiveFunction("SpellAdv")]
			[h:sp.AdvDis = if(or(and(sp.Dis == 0,sp.Adv == 0),and(sp.Dis !=0,sp.Adv != 0)),0,if(sp.Dis == 0,1,-1))]
			};
		case "101": {
			[h:sp.AdvDis = 0]
			};
		case "100": {
			[h:sp.Adv = 0]
			[h:sp.Dis = 0]
			[h:pm.PassiveFunction("SpellAdv")]
			[h:sp.AdvDis = if(or(and(sp.Dis == 0,sp.Adv == 0),and(sp.Dis !=0,sp.Adv != 0)),0,if(sp.Dis == 0,1,-1))]
			};
		case "111": {
			[h:sp.AdvDis = 1]
			};
		case "110": {
			[h:sp.Adv = 1]
			[h:sp.Dis = 0]
			[h:pm.PassiveFunction("SpellAdv")]
			[h:sp.AdvDis = if(or(and(sp.Dis == 0,sp.Adv == 0),and(sp.Dis !=0,sp.Adv != 0)),0,if(sp.Dis == 0,1,-1))]
			};
		default: {[h:sp.AdvDis=0]}
	]
   
	[h:"<!-- Attack Roll Info -->"]
	[h,if(sSpellAttack == 1),CODE:{
		[h:roll1=1d20]
		[h:roll2=1d20]
      
		[h,switch(sp.AdvDis):
			case -1: effectiveRoll = min(roll1,roll2);
			case 0: effectiveRoll = roll1;
			case 1: effectiveRoll = max(roll1,roll2)
		]
      
		[h,switch(sp.AdvDis):
			case -1: sp.ToHitRulesStr = "1d20 <span style='color:"+DamageColor+"'>with Dis</span>";
			case 0: sp.ToHitRulesStr = "1d20";
			case 1: sp.ToHitRulesStr = "1d20 <span style='color:"+HealingColor+"'>with Adv</span>"
		]
      
		[h:CritTest=if(effectiveRoll>=sp.FinalCritRange,CritTest+1,CritTest)]
		[h:CritTestEach=if(effectiveRoll>=sp.FinalCritRange,1,0)]
		[h:CritFailTest=if(effectiveRoll==1,1,0)]
         
		[h:sp.ToHit = effectiveRoll+PrimeStatMod+Proficiency]
		[h:sp.ToHitStr = effectiveRoll+" + "+PrimeStatMod+" + "+Proficiency]
		[h:sp.ToHitRulesStr = sp.ToHitRulesStr+" + "+substring(PrimeStat,0,3)+" + Prof"]
      
		[h:pm.PassiveFunction("SpellBonus")]
      
		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"Roll1",roll1,"Roll2",roll2,"Advantage",sp.AdvDis,"ToHit",sp.ToHit,"ToHitStr",sp.ToHitStr,"RulesStr",sp.ToHitRulesStr,"CritTest",CritTestEach,"CritFailTest",CritFailTest)]
	};{
		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"CritTest",0)]
	}]
   
	[h:"<!-- An array is created with the size of the dice for regular damage and AHL damage, crits for each, and flat damage. Variables are created for passive functions to use. -->"]
	[h:"<!-- The array is created so that later passive functions that reroll dice have a reference for the original die size - since added dice may be of a different size. -->"]
	[h:"<!-- AHL damage and regular damage are calculated separately for similar reasons - AHL dice may be of a different size than the base dice (e.g. Chaos Bolt) -->"]
	
	[h,if(DmgDieNum == 0),CODE:{};{
		[h:sp.AllDmgDice = "[]"]
		[h,count(DmgDieNum): sp.AllDmgDice = json.append(sp.AllDmgDice,DmgDieSize)]
		[h:sp.DmgRules = DmgDieNum+"d"+DmgDieSize]
	
		[h:sp.AllCritDmgDice = "[]"]
		[h,count((DmgDieNum+BrutalCrit)): sp.AllCritDmgDice = json.append(sp.AllCritDmgDice,DmgDieSize)]
		[h:sp.CritDmgRules = (DmgDieNum+BrutalCrit)+"d"+DmgDieSize]
		
		[h:sp.AllAHLDmgDice = "[]"]
		[h:AHLNumDie = (DamageScaling*AHLDamageNumber)]
		[h,count(AHLNumDie): sp.AllAHLDmgDice = json.append(sp.AllAHLDmgDice,AHLDmgDieSize)]
		[h:sp.AHLDmgRules = AHLNumDie+"d"+AHLDmgDieSize]
		
		[h:sp.AllCritAHLDmgDice = "[]"]
		[h,count(AHLNumDie): sp.AllCritAHLDmgDice = json.append(sp.AllCritAHLDmgDice,AHLDmgDieSize)]
		[h:sp.CritAHLDmgRules = AHLNumDie+"d"+AHLDmgDieSize]
		
		[h:flatBonus = number(DmgDieFlatBonus) + number(AHLFlatBonus)*DamageScaling]
		[h:ModDamageBonus = if(DmgDieMODBonus,PrimeStatMod,0)]
		[h:flatBonusRules = if(number(DmgDieFlatBonus)==0,"",flatBonus)]
		[h:flatBonusRules = if(DmgDieMODBonus,listAppend(flatBonusRules,substring(PrimeStat,0,3)," + "),flatBonusRules)]
		[h:flatDmgTotal = ModDamageBonus+flatBonus]
		
		[h:sp.AddedRolledDamageRules = ""]
		[h:sp.AddedFlatDamageRules = ""]
		[h:sp.AddedRolledDamageDice = "[]"]
		[h:sp.AddedFlatDamage = "[]"]
	}]
	
	[h:"<!-- Repeat all for 2nd damage type -->"]
	[h,if(DmgDie2Num == 0),CODE:{};{
		[h:sp.AllDmgDice2 = "[]"]
		[h,count(DmgDie2Num): sp.AllDmgDice2 = json.append(sp.AllDmgDice2,DmgDie2Size)]
		[h:sp.DmgRules2 = DmgDie2Num+"d"+DmgDie2Size]
	
		[h:sp.AllCritDmgDice2 = "[]"]
		[h,count((DmgDie2Num+BrutalCrit2)): sp.AllCritDmgDice2 = json.append(sp.AllCritDmgDice2,DmgDie2Size)]
		[h:sp.CritDmgRules2 = (DmgDie2Num+BrutalCrit)+"d"+DmgDie2Size]
		
		[h:sp.AllAHLDmgDice2 = "[]"]
		[h:AHLNumDie2 = (DamageScaling*AHLDmgDie2Num)]
		[h,count(AHLNumDie2): sp.AllAHLDmgDice2 = json.append(sp.AllAHLDmgDice2,AHLDmgDie2Size)]
		[h:sp.AHLDmgRules2 = AHLNumDie2+"d"+AHLDmgDie2Size]
		
		[h:sp.AllCritAHLDmgDice2 = "[]"]
		[h,count(AHLNumDie2): sp.AllCritAHLDmgDice2 = json.append(sp.AllCritAHLDmgDice2,AHLDmgDie2Size)]
		[h:sp.CritAHLDmgRules2 = AHLNumDie2+"d"+AHLDmgDie2Size]
		
		[h:flatBonus2 = number(DmgDie2FlatBonus) + number(AHL2FlatBonus)*DamageScaling]
		[h:ModDamageBonus2 = if(DmgDie2MODBonus,PrimeStatMod,0)]
		[h:flatBonusRules2 = if(number(DmgDie2FlatBonus)==0,"",flatBonus2)]
		[h:flatBonusRules2 = if(DmgDie2MODBonus,listAppend(flatBonusRules2,substring(PrimeStat,0,3)," + "),flatBonusRules2)]
		[h:flatDmg2Total = ModDamageBonus2+flatBonus2]
		
		[h:sp.AddedRolledDamageRules2 = ""]
		[h:sp.AddedFlatDamageRules2 = ""]
		[h:sp.AddedRolledDamageDice2 = "[]"]
		[h:sp.AddedFlatDamage2 = "[]"]		
	}]
   
	[h,if(and(DmgDie2Num==0,DmgDieNum==0)),CODE:{};{
		[h:pm.PassiveFunction("SpellDamage")]
	}]
   
	[h:"<!-- Merge all of the arrays of dice into one, then roll them into a new array of rolled dice. -->"]
	[h:"<!-- New array is summed for total damage, and put into a list for display. -->"]
	[h:"<!-- Array of dice is summed for max possible damage. -->"]
	[h,if(DmgDieNum==0),CODE:{};{
		[h:sp.DmgRulesFinal = sp.DmgRules+if(AHLNumDie>0," + "+sp.AHLDmgRules,"")+if(sp.AddedRolledDamageRules=="",""," + "+sp.AddedRolledDamageRules)+if(flatBonusRules=="",""," + "+flatBonusRules)+if(sp.AddedFlatDamageRules=="",""," + "+sp.AddedFlatDamageRules)]
		[h:sp.CritDmgRulesFinal = sp.DmgRules+" + "+sp.CritDmgRules+if(AHLNumDie>0," + "+sp.AHLDmgRules+" + "+sp.CritAHLDmgRules,"")+if(sp.AddedRolledDamageRules=="",""," + "+sp.AddedRolledDamageRules+" + "+sp.AddedRolledDamageRules)+if(flatBonusRules=="",""," + "+flatBonusRules)+if(sp.AddedFlatDamageRules=="",""," + "+sp.AddedFlatDamageRules)]
		
		[h:sp.FinalDamageDice = json.merge(sp.AllDmgDice,sp.AllAHLDmgDice,sp.AddedRolledDamageDice)]
		[h:sp.DmgArray = "[]"]
		[h,foreach(die,sp.FinalDamageDice): sp.DmgArray = json.append(sp.DmgArray,eval("1d"+die))]
		[h,if(json.isEmpty(sp.AddedFlatDamage)): sp.TotalAddedFlatDamage = 0; sp.TotalAddedFlatDamage = math.arraySum(sp.AddedFlatDamage)]
		[h:sp.Dmg = math.arraySum(sp.DmgArray) + flatDmgTotal + sp.TotalAddedFlatDamage]
		[h:sp.DmgRolls = json.toList(sp.DmgArray," + ")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus,0)+if(json.isEmpty(sp.AddedFlatDamage),""," + "+json.toList(sp.AddedFlatDamage," + "))]
		[h:sp.DmgMax = math.arraySum(sp.FinalDamageDice) + flatDmgTotal + sp.TotalAddedFlatDamage]
		
		[h:sp.FinalCritDamageDice = json.merge(sp.AllDmgDice,sp.AllCritDmgDice,sp.AllAHLDmgDice,sp.AllCritAHLDmgDice,sp.AddedRolledDamageDice,sp.AddedRolledDamageDice)]
		[h:sp.CritDmgArray = "[]"]
		[h,foreach(die,sp.FinalCritDamageDice): sp.CritDmgArray = json.append(sp.CritDmgArray,eval("1d"+die))]
		[h:sp.CritDmg = math.arraySum(sp.CritDmgArray) + flatDmgTotal + sp.TotalAddedFlatDamage]
		[h:sp.CritDmgRolls = json.toList(sp.CritDmgArray," + ")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus,0)+if(json.isEmpty(sp.AddedFlatDamage),""," + "+json.toList(sp.AddedFlatDamage," + "))]
		[h:sp.CritDmgMax = math.arraySum(sp.FinalCritDamageDice) + flatDmgTotal + sp.TotalAddedFlatDamage]

		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"DmgRules",sp.DmgRulesFinal,"DamageDice",sp.FinalDamageDice,"DmgArray",sp.DmgArray,"DmgRolls",sp.DmgRolls,"Dmg",sp.Dmg,"DmgMax",sp.DmgMax,"CritDmgRules",sp.CritDmgRulesFinal,"CritDamageDice",sp.FinalCritDamageDice,"CritDmgArray",sp.CritDmgArray,"CritDmgRolls",sp.CritDmgRolls,"CritDmg",sp.CritDmg,"CritDmgMax",sp.CritDmgMax)]
	}]
   
	[h,if(DmgDie2Num==0),CODE:{};{
		[h:sp.DmgRulesFinal2 = sp.DmgRules2+if(AHLNumDie2>0," + "+sp.AHLDmgRules2,"")+if(sp.AddedRolledDamageRules2=="",""," + "+sp.AddedRolledDamageRules2)+if(flatBonusRules2=="",""," + "+flatBonusRules2)+if(sp.AddedFlatDamageRules2=="",""," + "+sp.AddedFlatDamageRules2)]
		[h:sp.CritDmgRulesFinal2 = sp.DmgRules2+" + "+sp.CritDmgRules2+if(AHLNumDie2>0," + "+sp.AHLDmgRules2+" + "+sp.CritAHLDmgRules2,"")+if(sp.AddedRolledDamageRules2=="",""," + "+sp.AddedRolledDamageRules2+" + "+sp.AddedRolledDamageRules2)+if(flatBonusRules2=="",""," + "+flatBonusRules2)+if(sp.AddedFlatDamageRules2=="",""," + "+sp.AddedFlatDamageRules2)]
		
		[h:sp.FinalDamageDice2 = json.merge(sp.AllDmgDice2,sp.AllAHLDmgDice2,sp.AddedRolledDamageDice2)]
		[h:sp.DmgArray2 = "[]"]
		[h,foreach(die,sp.FinalDamageDice2): sp.DmgArray2 = json.append(sp.DmgArray2,eval("1d"+die))]
		[h,if(json.isEmpty(sp.AddedFlatDamage2)): sp.TotalAddedFlatDamage2 = 0; sp.TotalAddedFlatDamage2 = math.arraySum(sp.AddedFlatDamage2)]
		[h:sp.Dmg2 = math.arraySum(sp.DmgArray2) + flatDmg2Total + sp.TotalAddedFlatDamage2]
		[h:sp.DmgRolls2 = json.toList(sp.DmgArray2," + ")+pm.PlusMinus(flatBonus2,0)+pm.PlusMinus(ModDamageBonus2,0)+if(json.isEmpty(sp.AddedFlatDamage2),""," + "+json.toList(sp.AddedFlatDamage2," + "))]
		[h:sp.DmgMax2 = math.arraySum(sp.FinalDamageDice2) + flatDmg2Total + sp.TotalAddedFlatDamage2]
		
		[h:sp.FinalCritDamageDice2 = json.merge(sp.AllDmgDice2,sp.AllCritDmgDice2,sp.AllAHLDmgDice2,sp.AllCritAHLDmgDice2,sp.AddedRolledDamageDice2,sp.AddedRolledDamageDice2)]
		[h:sp.CritDmgArray2 = "[]"]
		[h,foreach(die,sp.FinalCritDamageDice2): sp.CritDmgArray2 = json.append(sp.CritDmgArray2,eval("1d"+die))]
		[h:sp.CritDmg2 = math.arraySum(sp.CritDmgArray2) + flatDmg2Total + sp.TotalAddedFlatDamage2]
		[h:sp.CritDmgRolls2 = json.toList(sp.CritDmgArray2," + ")+pm.PlusMinus(flatBonus2,0)+pm.PlusMinus(ModDamageBonus2,0)+if(json.isEmpty(sp.AddedFlatDamage2),""," + "+json.toList(sp.AddedFlatDamage2," + "))]
		[h:sp.CritDmgMax2 = math.arraySum(sp.FinalCritDamageDice2) + flatDmg2Total + sp.TotalAddedFlatDamage2]

		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"DmgRules2",sp.DmgRulesFinal2,"DamageDice2",sp.FinalDamageDice2,"DmgArray2",sp.DmgArray2,"DmgRolls2",sp.DmgRolls2,"Dmg2",sp.Dmg2,"DmgMax2",sp.DmgMax2,"CritDmgRules2",sp.CritDmgRulesFinal2,"CritDamageDice2",sp.FinalCritDamageDice2,"CritDmgArray2",sp.CritDmgArray2,"CritDmgRolls2",sp.CritDmgRolls2,"CritDmg2",sp.CritDmg2,"CritDmgMax2",sp.CritDmgMax2)]
	}]
	
	[h:sp.AllMissileData = json.append(sp.AllMissileData,sp.ThisMissileData)]
}]

[h:MissileNum = 0]
[h,count(MissileCount),code:{
	[h:roll1 = json.get(json.get(sp.AllMissileData,roll.count),"Roll1")]
	[h:roll2 = json.get(json.get(sp.AllMissileData,roll.count),"Roll2")]
	[h:thisAttackAdvDis = json.get(json.get(sp.AllMissileData,roll.count),"Advantage")]
	[h:thisAttackToHit = json.get(json.get(sp.AllMissileData,roll.count),"ToHit")]
	[h:thisAttackToHitStr = json.get(json.get(sp.AllMissileData,roll.count),"ToHitStr")]
	[h:thisAttackToHitRules = json.get(json.get(sp.AllMissileData,roll.count),"RulesStr")]
	[h:thisAttackCrit = if(sSpellAttack==0,0,json.get(json.get(sp.AllMissileData,roll.count),"CritTest"))]
	[h:thisAttackCritFail = if(sSpellAttack==0,0,json.get(json.get(sp.AllMissileData,roll.count),"CritFailTest"))]
	
	[h:thisAttackDmg = json.get(json.get(sp.AllMissileData,roll.count),"Dmg")]
	[h:thisAttackDmgStr = json.get(json.get(sp.AllMissileData,roll.count),"DmgRolls")]
	[h:thisAttackDmgRules = json.get(json.get(sp.AllMissileData,roll.count),"DmgRules")]
	[h:thisAttackCritDmg = json.get(json.get(sp.AllMissileData,roll.count),"CritDmg")]
	[h:thisAttackCritDmgStr = json.get(json.get(sp.AllMissileData,roll.count),"CritDmgRolls")]
	[h:thisAttackCritDmgRules = json.get(json.get(sp.AllMissileData,roll.count),"CritDmgRules")]
	
	[h:thisAttackDmg2 = json.get(json.get(sp.AllMissileData,roll.count),"Dmg2")]
	[h:thisAttackDmg2Str = json.get(json.get(sp.AllMissileData,roll.count),"DmgRolls2")]
	[h:thisAttackDmg2Rules = json.get(json.get(sp.AllMissileData,roll.count),"DmgRules2")]
	[h:thisAttackCritDmg2 = json.get(json.get(sp.AllMissileData,roll.count),"CritDmg2")]
	[h:thisAttackCritDmg2Str = json.get(json.get(sp.AllMissileData,roll.count),"CritDmgRolls2")]
	[h:thisAttackCritDmg2Rules = json.get(json.get(sp.AllMissileData,roll.count),"CritDmgRules2")]

	[h:sp.AdvRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",json.set(FinalSpellData,"Advantage",1,"ForcedAdvantage",1,"PreviousRoll",roll1),ParentToken)]
	[h:sp.DisRerollLink = macroLinkText("AttackReroll@Lib:pm.a5e.Core","self-gm",json.set(FinalSpellData,"Advantage",-1,"ForcedAdvantage",1,"PreviousRoll",roll1),ParentToken)]
	
	[h,if(sSpellAttack == 1),CODE:{
		[h:ToHitTableLine = json.set("",
			"ShowIfCondensed",1,
			"Header","Attack Roll",
			"FalseHeader","",
			"FullContents","<span style='"+if(thisAttackCrit,"font-size:2em; color:"+CritColor,if(thisAttackCritFail,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+thisAttackToHit+"</span>",
			"RulesContents",thisAttackToHitRules+" = ",
			"RollContents",thisAttackToHitStr+" = ",
			"DisplayOrder","['Rules','Roll','Full']"
		)]
		
		[h,if(thisAttackAdvDis==0):
			ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","Reroll: <a href = '"+sp.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+sp.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>");
			ToHitTableLine = json.set(ToHitTableLine,"BonusBody1","(Roll #1: "+(roll1+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+" / Roll #2: "+(roll2+thisAttackToHit-if(thisAttackAdvDis==1,max(roll1,roll2),min(roll1,roll2)))+")")
		]
		
		[h:abilityTable = json.append(abilityTable,ToHitTableLine)]			
	};{}]
	
	[h,if(DmgDieNum == 0),CODE:{};{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",DmgType+if(or(DmgType=="Healing",DmgType=="Temp HP",DmgType=="Special"),""," Damage"),
			"FalseHeader","",
			"FullContents","<span style='color:"+if(or(DmgType=="Healing",DmgType=="Temp HP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+if(thisAttackCrit,thisAttackCritDmg,thisAttackDmg)+"</span>"+if(DmgHalved==1," (If halved:<b> "+floor(if(thisAttackCrit,thisAttackCritDmg,thisAttackDmg)/2)+"</b>)",""),
			"RulesContents",if(thisAttackCrit,thisAttackCritDmgRules,thisAttackDmgRules)+" = ",
			"RollContents",if(thisAttackCrit,thisAttackCritDmgStr,thisAttackDmgStr)+" = ",
			"DisplayOrder","['Rules','Roll','Full']"
			))]
	}]
		
	[h,if(DmgDie2Num == 0),CODE:{};{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",DmgType2+if(or(DmgType2=="Healing",DmgType2=="Temp HP",DmgType2=="Special"),""," Damage"),
			"FalseHeader","",
			"FullContents","<span style='color:"+if(or(DmgType2=="Healing",DmgType2=="Temp HP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+if(thisAttackCrit,thisAttackCritDmg2,thisAttackDmg2)+"</span>"+if(DmgHalved==1," (If halved:<b> "+floor(if(thisAttackCrit,thisAttackCritDmg2,thisAttackDmg2)/2)+"</b>)",""),
			"RulesContents",if(thisAttackCrit,thisAttackCritDmg2Rules,thisAttackDmg2Rules)+" = ",
			"RollContents",if(thisAttackCrit,thisAttackCritDmg2Str,thisAttackDmg2Str)+" = ",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]
	[h:MissileNum = MissileNum + 1]
}]

[h,if(IsBuff=="Self" || IsBuff=="Both"),CODE:{
	[h,if(BuffsList==""),CODE:{
		[h:setState(SpellName,1)]
	};{
		[h:BuffSelect=input("ChosenBuff|"+BuffsList+"|Select Your Buff|LIST|VALUE=STRING")]
		[h:setState(ChosenBuff,1)]
	}]
};{}]

[h,if(IsAura),CODE:{
	[h:setLight("Basic Aura",AuraColor+" "+AuraSize,1)]
};{}]

[h:AHLSummonNumAdditive=if(AHLSummonNumAdditive=="No",0,AHLSummonNumAdditive)]

[h:summonCRscaling=if(AHLSummonCRScaling=="Every Level",AHL,if(AHLSummonCRScaling=="Every Other Level",floor(AHL/2),if(AHLSummonCRScaling=="Every Three Levels",floor(AHL/3),0)))]
[h:summonCRmax=sSummonCR+if(and(AHL>0,IsAHLSummon=="Yes"),summonCRscaling,0)]

[h:summonNumScaling=if(AHLSummonNumScaling=="Every Level",AHL,if(AHLSummonNumScaling=="Every Other Level",floor(AHL/2),if(AHLSummonNumScaling=="Every Three Levels",floor(AHL/3),0)))]
[h:summonNumAddedAHL=(summonNumScaling*number(AHLSummonNumAdditive))]
[h:summonNumMultiplier=if(AHLSummonNumMultiplier=="Doubled",1,if(AHLSummonNumMultiplier=="Tripled",2,if(AHLSummonNumMultiplier=="Quadrupled",3,0)))]
[h:summonNumMultiplierAHL=max(1,summonNumScaling+summonNumMultiplier)]

[h:sSummonNumber = if(IsSummon=="Single",1,sSummonNumber)]

[h:SummonData = json.set("",
	"Type",sSummonType,
	"Number",sSummonNumber,
	"CR",summonCRmax,
	"List",sSummonList,
	"Multiplier",summonNumMultiplierAHL,
	"Bonus",summonNumAddedAHL,
	"ParentToken",ParentToken
	)]

[h:SummonCustomization = json.set("",
	"Name",ForcedSummonName,
	"Image",ForcedImage,
	"Portrait",ForcedPortrait,
	"Handout",ForcedHandout
	)]
[h,if(IsSummon=="No"),CODE:{};{
	[h:pm.Summons(json.set("","Name",SpellName,"Class",sClassSelect),SummonData,SummonCustomization)]
}]

[h:pm.PassiveFunction("AfterSpell")]

[h,if(NeedsBorder),CODE:{
	[h:ClassFeatureData = json.set("",
		"Flavor",Flavor,
		"ParentToken",ParentToken,
		"DMOnly",DMOnly,
		"BorderColorOverride",if(BorderColorOverride=="",BorderColor,BorderColorOverride),
		"TitleFontColorOverride",if(TitleFontColorOverride=="",TextColor,TitleFontColorOverride),
		"AccentBackgroundOverride",AccentBackgroundOverride,
		"AccentTextOverride",AccentTextOverride,
		"TitleFont",TitleFont,
		"BodyFont",BodyFont,
		"Class","zzSpell",
		"Name",abilityDisplayName,
		"FalseName",abilityFalseName,
		"OnlyRules",abilityOnlyRules
		)]

	[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
	[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
	[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

	[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,sRulesShow)]
	[h:output.PC = output.PC + json.get(output.Temp,"Player")]
	[h:output.GM = output.GM + json.get(output.Temp,"GM")]

	[h:sDescriptionLink = macroLinkText("spellDescription@Lib:pm.a5e.Core",if(DMOnly,"gm","all"),RerollSpellData,ParentToken)]
	[h:SpellDescriptionFinal = if(sRulesShow==0,"<a style='color:"+LinkColor+";' href='"+sDescriptionLink+"'>Click to show full spell text</a>",sDescription)]

	[h:output.PC = output.PC + if(DMOnly,"",SpellDescriptionFinal)+"</div></div>"]
	[h:output.GM = output.GM + SpellDescriptionFinal+"</div></div>"]

	[h:broadcastAsToken(output.GM,"gm")]
	[h:broadcastAsToken(output.PC,"not-gm")]
};{
	[h:sDescriptionLink = macroLinkText("spellDescription@Lib:pm.a5e.Core",if(DMOnly,"gm","all"),RerollSpellData,ParentToken)]
	[h:SpellDescriptionFinal = if(sRulesShow==0,"<a style='color:"+LinkColor+";' href='"+sDescriptionLink+"'>Click to show full spell text</a>",sDescription)]
}]

[h:ReturnData = json.set("{}","Slot",if(IsCantrip,"Cantrip",eLevel),"Class",sClassSelect,"DmgType",DmgType,"DmgType2",DmgType2,"Table",abilityTable,"Effect",SpellDescriptionFinal,"ChaosTest",SpellName=="Chaos Bolt")]
[h:macro.return = ReturnData]