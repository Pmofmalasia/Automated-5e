[h:SpellData = json.get(macro.args,"SpellData")]
[h:NonSpellData = json.remove(macro.args,"SpellData")]

[h:IsTooltip = 0]
[h:Flavor = json.get(NonSpellData,"Flavor")]
[h:ParentToken = json.get(NonSpellData,"ParentToken")]
[h:ForcedClass = json.get(NonSpellData,"ForcedClass")]
[h:ForcedLevel = json.get(NonSpellData,"ForcedLevel")]
[h:FreeCasting = json.get(NonSpellData,"FreeCasting")]
[h:ForcedSummonName = json.get(NonSpellData,"ForcedSummonName")]
[h:ForcedImage = json.get(NonSpellData,"ForcedImage")]
[h:ForcedPortrait = json.get(NonSpellData,"ForcedPortrait")]
[h:ForcedHandout = json.get(NonSpellData,"ForcedHandout")]
[h,if(json.get(NonSpellData,"needsSplitGMOutput") == ""):
	needsSplitGMOutput = (getProperty("a5e.stat.Allegiance") == "Enemy");
	needsSplitGMOutput = json.get(NonSpellData,"needsSplitGMOutput")
]
[h:AuraColor = json.get(NonSpellData,"AuraColor")]
[h:BorderColorOverride = json.get(NonSpellData,"BorderColorOverride")]
[h:TitleFontColorOverride = json.get(NonSpellData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(NonSpellData,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(NonSpellData,"AccentTextOverride")]
[h:TitleFont = json.get(NonSpellData,"TitleFont")]
[h:BodyFont = json.get(NonSpellData,"BodyFont")]
[h:CritMessage = json.get(NonSpellData,"CritMessage")]
[h:CritFailMessage = json.get(NonSpellData,"CritFailMessage")]

[h:SpellName = json.get(SpellData,"Name")]
[h:SpellDisplayName = json.get(SpellData,"DisplayName")]
[h:SpellLevel = json.get(SpellData,"Level")]
[h:isRitual = json.get(SpellData,"isRitual")]
[h:School = json.get(SpellData,"School")]

[h:mCompConsumed = json.get(SpellData,"mCompConsumed")]
[h:vComp = json.get(SpellData,"vComp")]
[h:isConcentration = json.contains(SpellData,"isConcentration")]

[h:IsCantrip = if(SpellLevel==0,1,0)]

[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Spell"]

[h:allSpellEffects = json.get(SpellData,"Effects")]
[h:sSpellChoice = 0]
[h:MultiEffectChoiceTest = 0]
[h:SpellEffectOptions = ""]

[h,if(json.length(allSpellEffects)==1),CODE:{
	[h:FinalSpellData = allSpellEffects]
};{
	[h:RandomEffectTest = json.get(SpellData,"RandomEffect")]
	[h,if(RandomEffectTest==1),CODE:{
		[h:SpellEffectOptionsNum = (json.length(allSpellEffects)-1)]
		[h:sSpellChoice = eval("1d"+SpellEffectOptionsNum)-1]
	};{
		[h:MultiEffectChoiceTest = 1]
		[h,foreach(SpellEffect,allSpellEffects): SpellEffectOptions = listAppend(SpellEffectOptions,json.get(SpellEffect,"DisplayName"))]
	}]
}]

[h:BaseLink = "https://www.dndbeyond.com/spells/"]
[h:CompendiumLink = concat('<a href=',BaseLink,replace(SpellDisplayName,' ','-'),'>',SpellDisplayName,'</a>')]

[h:"<!--- Dialogue --->"]
[h:sClassSelect = ""]
[h:sLevelSelect = ""]
[h:classList = pm.GetClasses("Name","json")]

[h,if(ForcedClass==""),CODE:{
	[h:ClassOptionsArray = "[]"]
	[h:pm.PassiveFunction("SpellClass")]
	
	[h:ClassOptions = ""]
	[h,foreach(castingClass,ClassOptionsArray),CODE:{
		[h,if(json.contains(castingClass,"CastAsClass")):
			thisCastingClass = json.get(castingClass,"CastAsClass");
			thisCastingClass = json.get(castingClass,"Class")
		]
		
		[h:isClassTest = json.contains(classList,thisCastingClass)]
		[h,if(isClassTest):
			ClassOptions = json.append(ClassOptions,pm.GetDisplayName(thisCastingClass,"sb.Classes"));
			ClassOptions = if(thisCastingClass=="Monster",json.append(ClassOptions,"Monster"),json.append(ClassOptions,json.get(castingClass,"DisplayName")))
		]
	}]
	
	[h:ClassOptionsArray = json.append(ClassOptionsArray,"None")]
	[h:ClassOptions = json.append(ClassOptions,"None")]
};{
	[h:ClassOptionsArray = json.append("",ForcedClass)]
	[h,if(json.type(ForcedClass) == "UNKNOWN"),CODE:{
		[h:ClassOptions = json.append("",pm.GetDisplayName(ForcedClass,"sb.Classes"))]
	};{		
		[h:isClassTest = json.contains(classList,json.get(ForcedClass,"Class"))]
		[h,if(isClassTest):
			ClassOptions = json.append("",pm.GetDisplayName(json.get(ForcedClass,"Class"),"sb.Classes"));
			ClassOptions = if(json.get(ForcedClass,"Class")=="Monster",json.append("","Monster"),json.append("",json.get(ForcedClass,"DisplayName")))
		]
	}]
	[h:"<!-- Note: removed line here that set ClassOptionsArray equal to ForcedClass if ForcedClass != '' (always). Not sure what it did but come here if something breaks. -->"]
}]

[h,if(ForcedLevel==""),CODE:{
	[h:MaxSpellLevel = 9]
	[h,if(isRitual==1),CODE:{
		[h:LevelOptions = json.append("","Ritual")]
		[h:LevelOptionData = json.append("",json.set("","Name","Ritual","ResourceType","Ritual"))]
	};{
		[h:LevelOptions = "[]"]
		[h:LevelOptionData = "[]"]
	}]
	[h,count(MaxSpellLevel),CODE:{
		[h,if((1+roll.count)>=SpellLevel && json.get(a5e.stat.SpellSlots,roll.count+1)>0): LevelOptions = json.append(LevelOptions,if(roll.count==0,"1st",if(roll.count==1,"2nd",if(roll.count==2,"3rd",(roll.count+1)+"th")))+" Level")]
		[h,if((1+roll.count)>=SpellLevel && json.get(a5e.stat.SpellSlots,roll.count+1)>0): LevelOptionData = json.append(LevelOptionData,json.set("","Name",(roll.count+1),"ResourceType","Spell Slots"))]
	}]

	[h:featureSpellSlots = js.a5e.GetFeatureSpellSlots(a5e.UnifiedAbilities,ParentToken)]
	[h,foreach(resource,featureSpellSlots),if(json.get(resource,"CurrentResource") > 0 && json.get(resource,"SlotLevel") >= SpellLevel),CODE:{
		[h:LevelOptions = json.append(LevelOptions,json.get(resource,"DisplayName"))]
		[h:LevelOptionData = json.append(LevelOptionData,json.set(resource,"ResourceType"))]
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
	[h:"<!-- TODO: Allow forced spell slot usage to use resource spell slots, if they match -->"]
	[h,if(json.type(ForcedLevel)=="UNKNOWN"),CODE:{
		[h:LevelOptions = if(ForcedLevel==1,"1st",if(ForcedLevel==2,"2nd",if(ForcedLevel==3,"3rd",ForcedLevel+"th")))+" Level"]
		[h:LevelOptionData = json.append("",json.set("","Name",ForcedLevel,"ResourceType","Spell Slots"))]
	};{
		[h:ForcedLevelSearch = json.path.read(a5e.UnifiedAbilities,"\$[*][?("+pm.a5e.PathFeatureFilter(ForcedLevel)+")]")]
		[h,if(!json.isEmpty(ForcedLevelSearch)): ForcedLevel = json.get(ForcedLevelSearch,0)]
		[h:LevelOptions = json.get(ForcedLevel,"DisplayName")]
		[h:LevelOptionData = json.append("",json.set(ForcedLevel,"ResourceType","FeatureSpell"))]
	}]
	
	[h,if(IsCantrip),CODE:{
		[h:LevelOptions = json.append("","Cantrip")]
		[h:LevelOptionData = json.append("",json.set("","Name","Cantrip","ResourceType","Cantrip"))]
	};{}]
	[h:chosenLevel = 0]
}]

[h:dissConcentration = if(or(isConcentration==0,SpellLevel>=isConcentration),"",if(getProperty("a5e.stat.Concentration")=="","","junkVar|<html><span style='font-size:1.2em';>Casting <span style='color:#2222AA'><i>"+SpellName+"</i></span> will cancel concentration on <span style='color:#AA2222'><i>"+getProperty("a5e.stat.Concentration")+".</i></span></span></html>|<html><span style='color:#AA2222; font-size:1.2em'><b>WARNING</b></span></html>|LABEL"))]
[h:disIsSilenced = if(or(getState("Silence")==0,vComp==0),"","junkVar|<html><span style='font-size:1.2em';><span style='color:#AA2222'><i><b>NOTE: You are currently silenced and attempting to cast a spell with verbal components!</b></i></span></span></html>| |LABEL|SPAN=TRUE")]
[h:disCompConsumed = if(or(mCompConsumed=="0",mCompConsumed==""),"","junkVar|"+mCompConsumed+"|Consumed Components|LABEL")]
[h:disSpellEffectChoices = if(MultiEffectChoiceTest==1,"sSpellChoice | "+SpellEffectOptions+" | Choose an Effect | RADIO | ","")]

[h,if(json.length(ClassOptionsArray) < 3),CODE:{
	[h:chosenClass = 0]
	[h:disSpellClassSelect = " junkVar | "+json.get(ClassOptions,0)+" | Casting Class | LABEL "]
};{
	[h:disSpellClassSelect = " chosenClass | "+ClassOptions+" | Casting Class | LIST | DELIMITER=JSON "]
}]

[h:disSpellLevelSelect = if(ForcedLevel=="","chosenLevel | "+LevelOptions+" | Spell Level | LIST | DELIMITER=JSON ","junkVar | "+LevelOptions+" | Spell Level | LABEL ")]
[h:disPassiveChoices = ""]

[h:pm.PassiveFunction("SpellChoices")]

[h:disPassiveBars = if(disPassiveChoices=="","","junkvar | ----------------------------------------------------------- |  | LABEL | SPAN=TRUE ")]

[h,if(ForcedClass=="" || ForcedLevel=="" || MultiEffectChoiceTest==1),CODE:{
	[h,if(IsCantrip && json.length(ClassOptionsArray) < 3 && MultiEffectChoiceTest == 0 && disPassiveChoices == ""),CODE:{
		[h:sLevelSelect = "Cantrip"]
		[h:sRulesShow = data.getData("addon:","pm.a5e.core","FullSpellRules")]
	};{
		[h:abort(input(
			"junk|<-- Link to Compendium|<html>"+CompendiumLink+"</html>|LABEL",
			dissConcentration,
			disIsSilenced,
			"junkVar|"+SpellDisplayName+" ("+SpellLevel+") "+School+"|Spell|LABEL",
			disSpellClassSelect,
			disSpellLevelSelect,
			"sRulesShow| "+(data.getData("addon:","pm.a5e.core","FullSpellRules"))+" |Show Full Spell Rules|CHECK|",
			disCompConsumed,
			disSpellEffectChoices,
			disPassiveBars,
			disPassiveChoices
		))]
	}]
};{
	[h:sClassSelect = if(ForcedClass!="",ForcedClass,"")]
	[h:sLevelSelect = ForcedLevel]
	[h,if(IsCantrip): sLevelSelect = "Cantrip"]
	[h:sRulesShow = data.getData("addon:","pm.a5e.core","FullSpellRules")]
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

[h:CastAsRitual = 0]
[h:sLevelSelectData = json.get(LevelOptionData,chosenLevel)]
[h,if(IsCantrip),CODE:{
	[h:eLevel = 0+if(getProperty("a5e.stat.Level")>=5,1,0)+if(getProperty("a5e.stat.Level")>=11,1,0)+if(getProperty("a5e.stat.Level")>=17,1,0)]
};{
	[h,switch(json.get(sLevelSelectData,"ResourceType")),CODE:
		case "Spell Slots":{
			[h:eLevel = number(json.get(sLevelSelectData,"Name"))]
		};
		case "FeatureSpell":{
			[h:eLevel = json.get(sLevelSelectData,"SlotLevel")]
		};
		case "Ritual":{
			[h:eLevel = SpellLevel]
			[h:CastAsRitual = 1]
		};
		default:{
			[h:eLevel = SpellLevel]
		}
	]
}]

[h:AHLTier = eLevel - SpellLevel]

[h:FinalSpellData = json.merge(SpellData,json.get(allSpellEffects,sSpellChoice))]
[h:FinalSpellData = json.remove(FinalSpellData,"Effects")]
[h:"<!--- Dialogue --->"]

[h:"<!-- Setting values after the effect has been chosen -->"]
[h:vComp = json.contains(FinalSpellData,"vComp")]
[h:sComp = json.contains(FinalSpellData,"sComp")]
[h:mComp = json.contains(FinalSpellData,"mComp")]
[h:mComponents = base64.decode(json.get(FinalSpellData,"mComponents"))]
[h:mComponentsConsumed = base64.decode(json.get(FinalSpellData,"mComponentsConsumed"))]

[h:CastTime = json.get(FinalSpellData,"UseTime")]
[h:DurationData = json.get(FinalSpellData,"Duration")]
[h:SpellSubeffects = json.get(FinalSpellData,"Subeffects")]

[h:SpellDescription = base64.decode(json.get(FinalSpellData,"Description"))]
[h:SpellAHLDescription = base64.decode(json.get(FinalSpellData,"AHLDescription"))]
[h:CompleteSpellDescription = SpellDescription+if(SpellAHLDescription=="","","<br><br>"+if(IsCantrip,"","<b><i>At Higher Levels.</b></i> "))+SpellAHLDescription]

[h:isConcentration = json.get(FinalSpellData,"isConcentration")]
[h:ConcentrationLostLevel = json.get(FinalSpellData,"ConcentrationLostLevel")]

[h,if(json.isEmpty(DurationData)),CODE:{
	[h:DurationValue = 0]
	[h:DurationUnits = "Instantaneous"]
	[h:DurationString = "Instantaneous"]
};{
	[h:DurationValue = json.get(DurationData,"Value")]
	[h:DurationUnits = json.get(DurationData,"Units")]
	[h:DurationString = DurationValue+" "+DurationUnits+if(DurationValue==1,"","s")]
}]

[h,count(AHLTier),CODE:{
	[h:tempHasAHLDurationTest = json.contains(FinalSpellData,"AHLDurationLevel"+(SpellLevel+roll.count+1))]
	[h,if(tempHasAHLDurationTest),CODE:{
		[h:tempAHLDurationData = json.get(FinalSpellData,"AHLDurationLevel"+(SpellLevel+roll.count+1))]
		[h:DurationValue = json.get(tempAHLDurationData,"Value")]
		[h:DurationUnits = json.get(tempAHLDurationData,"Units")]
		[h:DurationString = DurationValue+" "+DurationUnits+if(DurationValue==1,"","s")+" (increased by upcasting)"]
	}]
}]

[h:CastTimeValue = json.get(CastTime,"Value")]
[h:CastTimeUnits = json.get(CastTime,"Units")]
[h:CastingTimeString = CastTimeValue+" "+CastTimeUnits+if(CastTimeValue==1,"","s")]
[h,if(CastTimeUnits=="Reaction"): CastingTimeString = CastingTimeString+", "+base64.decode(json.get(FinalSpellData,"ReactionDescription"))]
[h,if(CastAsRitual): CastingTimeString = CastingTimeString+" + 10 minutes (ritual)"]

[h:"<!-- TODO: Set up spell source types - should be in NonSpellData. Source temporarily set to always be Arcane -->"]
[h:sSource = "Arcane"]
[h,if(json.type(sClassSelectData)=="OBJECT"): sSource = if(json.get(sClassSelectData,"MagicSource")=="",sSource,json.get(sClassSelectData,"MagicSource"))]

[h:"<!--- TODO: Decide on what data to store for concentration --->"]
[h,if(ConcentrationLostLevel != ""): isConcentrationLost = (eLevel > ConcentrationLostLevel); isConcentrationLost = 0]
[h,if(getState("Concentrating") && isConcentration==1 && !isConcentrationLost),CODE:{
	[h:FlavorData = json.set("",
		"Flavor",Flavor,
		"ParentToken",ParentToken
	)]
	
	[MACRO("End Concentration@Lib:pm.a5e.Core"): FlavorData]
};{}]

[h:"<!--- Cancel Old Spell Notice --->"]

[h:"<!-- PrimeStat selection has multiple failsafes for selection. Currently, sClassSelectData should always be an object with either CastAsClass or PrimeStat present. The other paths serve as backups with possible future use. -->"]
[h,if(json.type(sClassSelectData)=="UNKNOWN"),CODE:{
	[h:PrimeStat = json.get(data.getData("addon:","pm.a5e.core","sb.CastingAbilities"),sClassSelect)]
	[h:PrimeStat = if(PrimeStat=="","None",PrimeStat)]
	[h,if(PrimeStat == "None"): PrimeStatMod = 0; PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
	[h:pm.PassiveFunction("SpellStat")]
};{
	[h,if(json.get(sClassSelectData,"CastAsClass")==""),CODE:{
		[h,if(json.get(sClassSelectData,"PrimeStat")==""):
			PrimeStat = json.get(data.getData("addon:","pm.a5e.core","sb.CastingAbilities"),json.get(sClassSelectData,"Class"));
			PrimeStat = json.get(sClassSelectData,"PrimeStat")
		]
	};{
		[h:PrimeStat = json.get(data.getData("addon:","pm.a5e.core","sb.CastingAbilities"),json.get(sClassSelectData,"CastAsClass"))]
	}]

	[h,if(json.get(sClassSelectData,"Class") == "Item" && json.get(sClassSelectData,"CastAsClass") == ""),CODE:{
		[h:ItemData = json.get(sClassSelectData,"ItemData")]
		[h:pm.a5e.ItemSpellcastingPrimeStat()]
	};{
		[h:PrimeStat = if(PrimeStat=="","None",PrimeStat)]
		[h,if(PrimeStat == "None"): PrimeStatMod = 0; PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
		[h:pm.PassiveFunction("SpellStat")]
	}]
}]

[h,if(and(!isConcentrationLost,isConcentration==1)): setState("Concentrating",1)]
[h,if(and(!isConcentrationLost,isConcentration==1)): setProperty("a5e.stat.Concentration",SpellName)]

[h:CompendiumLink=concat('<a style="color:%{LinkColor};" href=',BaseLink,replace(SpellDisplayName,' ','-'),'>',SpellDisplayName,'</a>')]

[h:abilityClass = sClassSelect]
[h:abilityDisplayName = "<b>"+CompendiumLink+"</b> ("+if(IsCantrip,"Cantrip",SpellLevel)+") <i>"+if(CastAsRitual," (ritual)","")+"</i>"]
[h:abilityFalseName = "Spellcasting"]
[h:abilityOnlyRules = 0]

[h:abilityTable = json.append("[]",json.set("",
	"ShowIfCondensed",0,
	"Header","Spell Class and Level",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(IsCantrip,sClassSelect+" Cantrip","Level "+eLevel+if(CastAsRitual," Ritual","")+" "+sClassSelect+" Spell"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]
	
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","School",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",upper(School,1),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Casting Time",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",CastingTimeString,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:componentsDisplay = if(vComp,"V","")]
[h:componentsDisplay = if(sComp,listAppend(componentsDisplay,"S",", "),componentsDisplay)]
[h:componentsDisplay = if(mComp,listAppend(componentsDisplay,"M"+if(mComponents=="",""," ("+mComponents+")"),", "),componentsDisplay)]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Components",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",componentsDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(mComponentsConsumed == ""),CODE:{};{
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",0,
		"Header","Consumed Components",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",mComponentsConsumed,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",0,
	"Header","Duration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",DurationString,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:pm.a5e.EffectData = "[]"]
[h:FinalSpellData = json.set(FinalSpellData,
	"Source",sSource,
	"PrimeStat",PrimeStat,
	"sClassSelect",sClassSelect,
	"SlotUsed",if(IsCantrip,0,eLevel)
)]
[h:FinalSpellData = json.remove(FinalSpellData,"Subeffects")]
[h:SpellDataWithSelections = json.set(FinalSpellData,
	"Class","Spell",
	"DisplayClass","zzSpell",
	"ColorSubtype",json.set("","Source",sSource,"Level",eLevel)
)]
[h,foreach(tempSubeffect,SpellSubeffects): pm.a5e.ExecuteSubeffect(tempSubeffect,json.set("","InstancePrefixes",json.append("","Spell"),"BaseData",SpellDataWithSelections))]

[h:pm.PassiveFunction("AfterSpell")]

[h,if(IsCantrip),CODE:{};{
	[h,switch(json.get(sLevelSelectData,"ResourceType")),CODE:
		case "Spell Slots":{
			[h,if(FreeCasting!=1): setProperty("a5e.stat.SpellSlots",json.set(getProperty("a5e.stat.SpellSlots"),eLevel,json.get(getProperty("a5e.stat.SpellSlots"),eLevel)-1))]
		};
		case "FeatureSpell":{
			[h:FeatureSpellIdentifier = json.get(sLevelSelectData,"Identifier")]
			[h:FeatureSourceData = pm.a5e.FeatureSourceData(json.get(FeatureSpellIdentifier,"AbilityType"),FeatureSpellIdentifier)]

			[h:"<!-- TODO: MaxResource - Need to fix how resources are used here, should use a UDF instead of doing it raw -->"]
			[h,if(FreeCasting!=1): setProperty(json.get(FeatureSourceData,"Property"),json.path.set(getProperty(json.get(FeatureSourceData,"Property")),json.get(FeatureSourceData,"Path")+"['Resource']",json.get(sLevelSelectData,"CurrentResource")-1))]
		};
		default:{}
	]
}]

[h:SpellDescriptionData = json.set("",
	"ParentToken",ParentToken,
	"DisplayClass","zzSpell",
	"ColorSubtype",json.set("","Level",if(IsCantrip,"0",string(eLevel)),"Source",sSource),
	"Description",CompleteSpellDescription,
	"needsSplitGMOutput",1
)]
[h:sDescriptionLink = macroLinkText("FullDescription@Lib:pm.a5e.Core",if(needsSplitGMOutput,"gm","all"),json.set(SpellDescriptionData,"OutputTargets","self"),ParentToken)]
[h:sDescriptionAllLink = macroLinkText("FullDescription@Lib:pm.a5e.Core",if(needsSplitGMOutput,"gm","all"),json.set(SpellDescriptionData,"OutputTargets","all"),ParentToken)]
[h:SpellDescriptionFinal = if(sRulesShow==0,"Show full spell text to: <a style='color:%{LinkTextColor};' href='"+sDescriptionLink+"'>Self</a> <a style='color:%{LinkTextColor};' href='"+sDescriptionAllLink+"'>Everyone</a>",CompleteSpellDescription)]

[h:ReturnData = json.set(NonSpellData,"SpellData",FinalSpellData,"Slot",if(IsCantrip,0,eLevel),"Source",sSource,"Class",sClassSelect,"Effect",pm.a5e.EffectData,"Table",abilityTable,"FullDescription",CompleteSpellDescription,"Description",SpellDescriptionFinal,"AbridgedDescription",SpellDescriptionFinal,"ShowFullRules",sRulesShow)]
[h:return(0,ReturnData)]