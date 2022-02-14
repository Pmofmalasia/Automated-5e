[h:SpellData = macro.args]
[h:IsTooltip = 0]
[h:a5e.GatherAbilities()]
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

[h,if(ForcedClass=="" && InnateCast==0),CODE:{

	[h:ClassOptionsObj = "{}"]
	[h:pm.PassiveFunction("SpellClass")]

	[h:ClassOptions=json.fields(ClassOptionsObj)]
	[h:ClassOptions=listAppend(ClassOptions,"None",",")]

};{
	[h,if(ForcedClass!=""): ClassOptions=ForcedClass]
	[h,if(InnateCast==1): ClassOptions=if(MonsterCast==0,Race,"Monster")]
}]

[h,if(ForcedLevel==""),CODE:{

[h:LevelOptions=
	if(Ritual==1,"Ritual,","")
	+if(and(sLevel<=1,json.get(SpellSlots,"1")>0),"1,","")
	+if(and(sLevel<=2,json.get(SpellSlots,"2")>0),"2,","")
	+if(and(sLevel<=3,json.get(SpellSlots,"3")>0),"3,","")
	+if(and(sLevel<=4,json.get(SpellSlots,"4")>0),"4,","")
	+if(and(sLevel<=5,json.get(SpellSlots,"5")>0),"5,","")
	+if(and(sLevel<=6,json.get(SpellSlots,"6")>0),"6,","")
	+if(and(sLevel<=7,json.get(SpellSlots,"7")>0),"7,","")
	+if(and(sLevel<=8,json.get(SpellSlots,"8")>0),"8,","")
	+if(and(sLevel<=9,json.get(SpellSlots,"9")>0),"9,","")
	+if(and(json.get(SpellSlots,"W")>0,WSpellLevel>=sLevel),"W,","")
	+"Free"
]
[h:ForcedLevelTest=1]
};{
	[h:ForcedLevelTest=if(or(json.get(SpellSlots,""+ForcedLevel+"")>0,FreeCasting==1),1,0)]
	[h:eLevel.Forced = if(ForcedLevel=="W",WSpellLevel,ForcedLevel)]
	[h:assert(if(eLevel.Forced>=sLevel,1,0),"<br>Your chosen spell level is lower than the base level of the spell!",0)]
	[h:LevelOptions=ForcedLevel]
}]
[h:dissConcentration=if(or(sConcentration==0,sLevel>=sConcentrationLost),"",if(Concentration=="","","junkVar|<html><span style='font-size:1.2em';>Casting <span style='color:#2222AA'><i>"+SpellName+"</i></span> will cancel concentration on <span style='color:#AA2222'><i>"+Concentration+".</i></span></span></html>|<html><span style='color:#AA2222; font-size:1.2em'><b>WARNING</b></span></html>|LABEL"))]
[h:disIsSilenced=if(or(getState("Silence")==0,vComp==0),"","junkVar|<html><span style='font-size:1.2em';><span style='color:#AA2222'><i><b>NOTE: You are currently silenced and attempting to cast a spell with verbal components!</b></i></span></span></html>| |LABEL|SPAN=TRUE")]
[h:disIsBlinded=if(or(getState("Blinded")==0,IsSight==0),"","junkVar|<html><span style='font-size:1.2em';><span style='color:#AA2222'><i><b>NOTE: You are currently blinded and this spell requires sight!</b></i></span></span></html>| |LABEL|SPAN=TRUE")]
[h:disCompConsumed=if(or(mCompConsumed=="0",mCompConsumed==""),"","junkVar|"+mCompConsumed+"|Consumed Components|LABEL")]
[h:disSpellEffectChoices=if(MultiEffectChoiceTest==1,"sSpellChoice | "+SpellEffectOptions+" | Choose an Effect | RADIO | ","")]

[h,if(and(ForcedClass=="",InnateCast==0)||ForcedLevel==""||MultiEffectChoiceTest==1),CODE:{
[h:SpellOptions=input(
	"junk|<-- Link to Compendium|<html>"+CompendiumLink+"</html>|LABEL",
	""+dissConcentration+"",
	""+disIsSilenced+"",
	""+disIsBlinded+"",
	"junkVar|"+SpellName+" ("+sLevel+") "+sSchool+"|Spell|LABEL",
	"sClassSelect|"+ClassOptions+"|Choose Class to cast|LIST| VALUE=STRING",
	"sLevelSelect|"+LevelOptions+"|Choose Spell Slot|LIST| VALUE=STRING",
	"sRulesShow| "+(getLibProperty("FullSpellRules","Lib:pm.a5e.Core"))+" |Show Full Spell Rules|CHECK|",
	""+disCompConsumed+"",
	""+disSpellEffectChoices+""
)]
[h:abort(SpellOptions)]
};{
	[h:sClassSelect=if(ForcedClass!="",ForcedClass,if(InnateCast,Race,""))]
	[h:sLevelSelect=ForcedLevel]
	[h:sRulesShow=0]
}]

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

[h,if(ForcedLevelTest==0),CODE:{[h:pm.ErrorFormat()]}]

[h:CastTime=if(CastTime=="Action","Action",CastTime)]
[h:CastTime=if(CastTime=="BONUS","Bonus Action",CastTime)]
[h:CastTime=if(CastTime=="REACTION","Reaction",CastTime)]
[h:CastTime=if(CastTime=="1 MIN","1 minute",CastTime)]
[h:CastTime=if(CastTime=="10 MIN","10 Minutes",CastTime)]
[h:CastTime=if(CastTime=="1 HOUR","1 Hour",CastTime)]
[h:CastTime=if(CastTime=="8 HOURS","8 Hours",CastTime)]
[h:CastTime=if(CastTime=="12 HOURS","12 Hours",CastTime)]
[h:CastTime=if(CastTime=="24 HOURS","12 Hours",CastTime)]

[h:"<!-- Temporarily setting the type of spell to Arcane always since it has yet to be implemented (will probably happen in full spell rework) -->"]
[h:sSource = "Arcane"]

[h,if(FreeCasting==1),CODE:{
	[h,switch(sLevelSelect),code:
		case "Ritual": {[eLevel=0]};
		case "1": {[eLevel=1]};
		case "2": {[eLevel=2]};
		case "3": {[eLevel=3]};
		case "4": {[eLevel=4]};
		case "5": {[eLevel=5]};
		case "6": {[eLevel=6]};
		case "7": {[eLevel=7]};
		case "8": {[eLevel=8]};
		case "9": {[eLevel=9]};
		case "W": {[eLevel=WSpellLevel]};
		case "MA": {[eLevel=sLevel]};
		case "Free": {[eLevel=sLevel]}
		]
};{

[h,switch(sLevelSelect),code:
	case "Ritual": {[eLevel=0]};
	case "1": {[eLevel=1][SpellSlots=json.set(SpellSlots,"1",json.get(SpellSlots,"1")-1)]};
	case "2": {[eLevel=2][SpellSlots=json.set(SpellSlots,"2",json.get(SpellSlots,"2")-1)]};
	case "3": {[eLevel=3][SpellSlots=json.set(SpellSlots,"3",json.get(SpellSlots,"3")-1)]};
	case "4": {[eLevel=4][SpellSlots=json.set(SpellSlots,"4",json.get(SpellSlots,"4")-1)]};
	case "5": {[eLevel=5][SpellSlots=json.set(SpellSlots,"5",json.get(SpellSlots,"5")-1)]};
	case "6": {[eLevel=6][SpellSlots=json.set(SpellSlots,"6",json.get(SpellSlots,"6")-1)]};
	case "7": {[eLevel=7][SpellSlots=json.set(SpellSlots,"7",json.get(SpellSlots,"7")-1)]};
	case "8": {[eLevel=8][SpellSlots=json.set(SpellSlots,"8",json.get(SpellSlots,"8")-1)]};
	case "9": {[eLevel=9][SpellSlots=json.set(SpellSlots,"9",json.get(SpellSlots,"9")-1)]};
	case "W": {[eLevel=WSpellLevel][SpellSlots=json.set(SpellSlots,"W",json.get(SpellSlots,"W")-1)]};
	case "Free": {[eLevel=sLevel]}
]

[h:DefaultDisplayData = pm.SpellColors(json.set("","Level",string(eLevel),"Source",sSource))]
[h:BorderColor = json.get(DefaultDisplayData,"Border")]
[h:TextColor = json.get(DefaultDisplayData,"Title")]
}]

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

[h:CastTime=if(sLevelSelect=="Ritual",CastTime+" + 10 minutes (ritual)",CastTime)]
[h:AHL=eLevel-sLevel]

[h:PrimeStat=if(sClassSelect=="Barbarian",json.get(AtrMods, "Constitution"),0)+if(or(sClassSelect=="Bard",sClassSelect=="Paladin",sClassSelect=="Sorcerer",sClassSelect=="Warlock",sClassSelect=="Tiefling"),json.get(AtrMods, "Charisma"),0)+if(or(sClassSelect=="Cleric",sClassSelect=="Druid",sClassSelect=="Monk",sClassSelect=="Ranger"),json.get(AtrMods, "Wisdom"),0)+if(or(sClassSelect=="Fighter",sClassSelect=="Rogue",sClassSelect=="Wizard",sClassSelect=="Artificer"),json.get(AtrMods, "Intelligence"),0)]

[h:PrimeStatStr=if(sClassSelect=="Barbarian","Con","")+if(or(sClassSelect=="Bard",sClassSelect=="Paladin",sClassSelect=="Sorcerer",sClassSelect=="Warlock",sClassSelect=="Tiefling"),"Cha","")+if(or(sClassSelect=="Cleric",sClassSelect=="Druid",sClassSelect=="Monk",sClassSelect=="Ranger"),"Wis","")+if(or(sClassSelect=="Fighter",sClassSelect=="Rogue",sClassSelect=="Wizard",sClassSelect=="Artificer"),"Int","")]

[h:MissileCount=sBaseMissiles+(AHL*sAHLMissiles)]

[h:setState("Concentrating",if(and(eLevel<sConcentrationLost,sConcentration==1),1,getState("Concentrating")))]
[h:Concentration=if(and(eLevel<sConcentrationLost,sConcentration==1),SpellName,Concentration)]

[h:CompendiumLink=concat('<a style="color:'+TextColor+';" href=',BaseLink,replace(SpellName,' ','-'),'>',SpellName,'</a>')]

[h:"<!--Note: need a better way to apply brutal crit effects, currently only applies to dmgtype1 (secBrutalCrit does nothing atm) but should be able to choose which one. Same for dmg MOD. Could go into untyped category I guess. -->"]

[h:SaveDC = 8+Proficiency+PrimeStat]
[h:AttackMod = Proficiency+PrimeStat]
[h:minCrit = 20]
[h:BrutalCrit = 0]
[h:secBrutalCrit = if(DmgDie2Num==0,0,BrutalCrit)]
[h:CritTest=0]
[h:AllAttacksToHit="[]"]
[h:AllAttacksDmg="[]"]
[h:AllAttacksSecDmg="[]"]

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

[h:RerollSpellData=json.append("",json.set(FinalSpellData,"ForcedClass",sClassSelect,"ForcedLevel",sLevelSelect,"FreeCasting",1))]
[h:sRerollLink=macroLinkText("SpellCasting@Lib:pm.a5e.Core","all",RerollSpellData,ParentToken)]

[h:abilityClass = sClassSelect]
[h:abilityName = "<b>"+CompendiumLink+"</b> ("+sLevel+") <i>"+if(sLevelSelect=="Ritual"," (ritual)","")+"</i>"]
[h:abilityFalseName = "Spellcasting"]
[h:abilityOnlyRules = 0]

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
	"Name",abilityName,
	"FalseName",abilityFalseName,
	"OnlyRules",abilityOnlyRules
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

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Spell Class and Level",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(eLevel>0,"Level ","")+if(eLevel<=0,if(eLevel==0,"Ritual","FREE "),eLevel)+" "+sClassSelect+" Spell",
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

[h:"<!-- Note: This loop is nearing its limit in terms of stack overflow. If more features are added the damage rolls can be separated out similar to how it was done in the attack macro. -->"]
[h:CurrentMissile=0]
[h:sp.AllMissileData = ""]
[h,count(MissileCount),code:{
	[h:sp.ThisMissileData = ""]
	[h:"<!-- Rolling First Damage Type Dice -->"]
	[h,if(DmgDieNum == 0),CODE:{};{
		[h:junkVar=getNewRolls()]
		[h:sp.Dmg=eval(DmgDieNum+"d"+DmgDieSize)]
		[h:sp.DmgArray = getNewRolls()]
		[h:sp.DmgMax = DmgDieSize*DmgDieNum]
		
		[h:"<!--- Same as above but for AHL dice. These are separate in case of instances where the damage type or die size AHL is different than the base type. (e.g. Chaos Bolt) --->"]
		
		[h:AHLNumDie = (DamageScaling*AHLDamageNumber)]
		[h:junkVar=getNewRolls()]
		[h:sp.AHLDmg=eval(AHLNumDie+"d"+AHLDmgDieSize)]
		[h:sp.DmgArray = json.merge(sp.DmgArray,getNewRolls())]
		[h:sp.AHLDmgMax = AHLDmgDieSize*AHLNumDie]
		
		[h:"<!-- Same again but for crit dice -->"]
		
		[h:junkVar=getNewRolls()]
		[h:sp.CritDmg=eval((DmgDieNum+BrutalCrit)+"d"+DmgDieSize)]
		[h:sp.CritDmgArray = json.merge(sp.DmgArray,getNewRolls())]
		[h:sp.CritDmgMax = DmgDieSize*(DmgDieNum+BrutalCrit)]
		
		[h:"<!-- Still same but AHL damage crits -->"]
		
		[h:junkVar=getNewRolls()]
		[h:sp.CritAHLDmg=eval(AHLNumDie+"d"+AHLDmgDieSize)]
		[h:sp.CritDmgArray = json.merge(sp.CritDmgArray,getNewRolls())]
		[h:sp.CritAHLDmgMax = AHLDmgDieSize*AHLNumDie]
	
		[h:"<!-- Add info for flat numbers that aren't rolled -->"]
		[h:flatBonus = number(DmgDieFlatBonus) + number(AHLFlatBonus)*DamageScaling]
		[h:ModDamageBonus = if(DmgDieMODBonus,PrimeStat,0)]
		[h:flatDmgTotal = ModDamageBonus+flatBonus]
			
		[h:"<!-- Build all strings and damage totals last, so that passive abilities only need to trigger once. -->"]
		
		[h:sp.DmgFormula = DmgDieNum+"d"+DmgDieSize+if(AHLNumDie>0," + "+AHLNumDie+"d"+AHLDmgDieSize,"")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus,0)]
		[h:sp.DmgStrFinal = json.toList(sp.DmgArray," + ")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus,0)]
		
		[h:sp.CritDmgFormula = DmgDieNum+"d"+DmgDieSize+" + "+(DmgDieNum+BrutalCrit)+"d"+DmgDieSize+if(AHLNumDie>0," + "+AHLNumDie+"d"+AHLDmgDieSize+" + "+AHLNumDie+"d"+AHLDmgDieSize,"")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus,0)]
		[h:sp.CritDmgStrFinal = json.toList(sp.CritDmgArray," + ")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus,0)]
		
		[h:sp.DmgFinal = math.arraySum(sp.DmgArray)+flatDmgTotal]
		[h:sp.CritDmgFinal = math.arraySum(sp.CritDmgArray)+flatDmgTotal]
		[h:sp.DmgMaxFinal = sp.DmgMax+sp.AHLDmgMax+flatDmgTotal]
		[h:sp.CritDmgMaxFinal = sp.DmgMax+sp.AHLDmgMax+sp.CritDmgMax+sp.CritAHLDmgMax+flatDmgTotal]

		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"DmgFormula",sp.DmgFormula,"DmgStr",sp.DmgStrFinal,"Dmg",sp.DmgFinal,"DmgMax",sp.DmgMaxFinal,"CritDmgFormula",sp.CritDmgFormula,"CritDmgStr",sp.CritDmgStrFinal,"CritDmg",sp.CritDmgFinal,"CritDmgMax",sp.CritDmgMaxFinal)]
	}]
	
	[h:"<!-- Repeat all for 2nd damage type -->"]
	[h,if(DmgDie2Num == 0),CODE:{};{		
		[h:junkVar=getNewRolls()]
		[h:sp.Dmg2=eval(DmgDie2Num+"d"+DmgDie2Size)]
		[h:sp.Dmg2Array = getNewRolls()]
		[h:sp.Dmg2Max = DmgDie2Size*DmgDie2Num]

		[h:"<!-- AHL 2 -->"]
		
		[h:AHLNumDie2 = (DamageScaling*AHLDmgDie2Num)]
		[h:junkVar=getNewRolls()]
		[h:sp.AHLDmg2=eval(AHLNumDie2+"d"+AHLDmgDie2Size)]
		[h:sp.Dmg2Array = json.merge(sp.Dmg2Array,getNewRolls())]
		[h:sp.AHLDmg2Max = AHLDmgDie2Size*AHLNumDie2]
		
		[h:"<!-- Crit 2 -->"]
		
		[h:junkVar=getNewRolls()]
		[h:sp.CritDmg2 = eval(DmgDie2Num+"d"+DmgDie2Size)]
		[h:sp.CritDmg2Array = getNewRolls()]
		[h:sp.CritDmg2Max = DmgDie2Size*(DmgDie2Num+BrutalCrit)]
		
		[h:"<!-- Crit AHL 2 -->"]
		
		[h:junkVar=getNewRolls()]
		[h:sp.CritAHLDmg2=eval(AHLNumDie2+"d"+AHLDmgDie2Size)]
		[h:sp.CritDmg2Array = json.merge(sp.CritDmg2Array,getNewRolls())]
		[h:sp.CritAHLDmg2Max = AHLDmgDie2Size*AHLNumDie2]

		[h:"<!-- Flat Bonuses 2 -->"]
		[h:flatBonus2 = number(DmgDie2FlatBonus) + number(AHL2FlatBonus)*DamageScaling]
		[h:ModDamageBonus2 = if(DmgDie2MODBonus,PrimeStat,0)]
		[h:flatDmg2Total = ModDamageBonus2+flatBonus2]
		
		[h:"<!-- String Building -->"]
	
		[h:sp.Dmg2Formula = DmgDie2Num+"d"+DmgDie2Size+if(AHLNumDie2>0," + "+AHLNumDie2+"d"+AHLDmgDie2Size,"")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus2,0)]
		[h:sp.Dmg2StrFinal = json.toList(sp.Dmg2Array," + ")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus2,0)]
		
		[h:sp.CritDmg2Formula = DmgDie2Num+"d"+DmgDie2Size+" + "+DmgDie2Num+"d"+DmgDie2Size+if(AHLNumDie2>0," + "+AHLNumDie2+"d"+AHLDmgDie2Size+" + "+AHLNumDie2+"d"+AHLDmgDie2Size,"")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus2,0)]
		[h:sp.CritDmg2StrFinal = json.toList(sp.CritDmg2Array," + ")+pm.PlusMinus(flatBonus,0)+pm.PlusMinus(ModDamageBonus2,0)]
		
		[h:sp.Dmg2Final = math.arraySum(sp.Dmg2Array)+flatDmg2Total]
		[h:sp.CritDmg2Final = math.arraySum(sp.Crit2DmgArray)+flatDmg2Total]
		[h:sp.Dmg2MaxFinal = sp.Dmg2Max+sp.AHLDmg2Max+flatDmg2Total]
		[h:sp.CritDmg2MaxFinal = sp.Dmg2Max+sp.AHLDmg2Max+sp.CritDmg2Max+sp.CritAHLDmg2Max+flatDmg2Total]

		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"Dmg2Formula",sp.Dmg2Formula,"Dmg2Str",sp.Dmg2StrFinal,"Dmg2",sp.Dmg2Final,"Dmg2Max",sp.Dmg2MaxFinal,"CritDmg2Formula",sp.CritDmg2Formula,"CritDmg2Str",sp.CritDmg2StrFinal,"CritDmg2",sp.CritDmg2Final,"CritDmg2Max",sp.CritDmg2MaxFinal)]
	}]
	
	[h:"<!-- Attack Roll Info -->"]
	[h,if(sSpellAttack == 1),CODE:{
		[h:roll1=1d20]
		[h:roll2=1d20]
		[h:CritTest=if(or(and(getLibProperty("AlwaysAdvDis","Lib:pm.a5e.Core"),max(roll1,roll2)>=minCrit),and(getLibProperty("AlwaysAdvDis","Lib:pm.a5e.Core")==0,roll1>=minCrit)),CritTest+1,CritTest)]
		
		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"Roll1",roll1,"Roll2",roll2,"CritTest",CritTest)]
	};{
		[h:sp.ThisMissileData = json.set(sp.ThisMissileData,"CritTest",0)]
	}]
	[h:sp.AllMissileData = json.append(sp.AllMissileData,sp.ThisMissileData)]
}]

[h:MissileNum = 0]
[h,count(MissileCount),code:{

	[h,if(sSpellAttack == 1),CODE:{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Attack Roll",
			"FalseHeader","",
			"FullContents","<span style='"+if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),"font-size:2em; color:"+CritColor,if(roll1==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(json.get(json.get(sp.AllMissileData,MissileNum),"Roll1")+AttackMod)+"</span>",
			"RulesContents","1d20 + "+substring(PrimeStat,0,3)+" + "+Proficiency+" = ",
			"RollContents",json.get(json.get(sp.AllMissileData,MissileNum),"Roll1")+pm.PlusMinus(AttackMod,0)+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","Reroll",
			"Link",macroLinkText("SpellCasting@Lib:pm.a5e.Core","all",sp.Data,ParentToken),
			"Value",(json.get(json.get(sp.AllMissileData,MissileNum),"Roll1")+AttackMod)
			))]
	};{}]
	
	[h,if(DmgDieNum == 0),CODE:{};{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",DmgType+if(or(DmgType=="Healing",DmgType=="Temp HP",DmgType=="Special"),""," Damage"),
			"FalseHeader","",
			"FullContents","<span style='color:"+if(or(DmgType=="Healing",DmgType=="Temp HP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg"))+"</span>"+if(DmgHalved==1," (If halved:<b> "+floor(if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg"))/2)+"</b>)",""),
			"RulesContents",if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmgFormula"),json.get(json.get(sp.AllMissileData,MissileNum),"DmgFormula"))+" = ",
			"RollContents",if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmgStr"),json.get(json.get(sp.AllMissileData,MissileNum),"DmgStr"))+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","",
			"Link","",
			"Value",if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg"))
			))]
	}]
		
	[h,if(DmgDie2Num == 0),CODE:{};{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",DmgType2+if(or(DmgType2=="Healing",DmgType2=="Temp HP",DmgType2=="Special"),""," Damage"),
			"FalseHeader","",
			"FullContents","<span style='color:"+if(or(DmgType2=="Healing",DmgType2=="Temp HP"),HealingColor,DamageColor)+"; font-size:1.5em'>"+if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg2"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg2"))+"</span>"+if(DmgHalved==1," (If halved:<b> "+floor(if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg2"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg2"))/2)+"</b>)",""),
			"RulesContents",if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg2Formula"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg2Formula"))+" = ",
			"RollContents",if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg2Str"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg2Str"))+" = ",
			"DisplayOrder","['Rules','Roll','Full']",
			"LinkText","",
			"Link","",
			"Value",if(json.get(json.get(sp.AllMissileData,MissileNum),"CritTest"),json.get(json.get(sp.AllMissileData,MissileNum),"CritDmg2"),json.get(json.get(sp.AllMissileData,MissileNum),"Dmg2"))
			))]
	}]
	[h:MissileNum = MissileNum + 1]
}]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,sRulesShow)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")]
[h:output.GM = output.GM + json.get(output.Temp,"GM")]

[h:sDescriptionLink = macroLinkText("spellDescription@Lib:pm.a5e.Core",if(DMOnly,"gm","all"),RerollSpellData,ParentToken)]
[h:output.Temp = if(sRulesShow==0,"<a style='color:"+LinkColor+";' href='"+sDescriptionLink+"'>Click to show full spell text</a>",sDescription)]

[h:output.PC = output.PC + if(DMOnly,"",output.Temp)+"</div></div>"]
[h:output.GM = output.GM + output.Temp+"</div></div>"]

[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]

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

[h:ReturnData = json.set("{}","Slot",sLevelSelect,"Class",sClassSelect,"DmgType",DmgType,"DmgType2",DmgType2)]
[h:macro.return=ReturnData]