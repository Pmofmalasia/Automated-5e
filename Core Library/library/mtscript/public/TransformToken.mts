[h:TransformationData = macro.args]
[h:ParentToken = json.get(TransformationData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:effectData = json.get(TransformationData,"SourceEffect")]
[h:BaseConditionInfo = json.get(TransformationData,"Condition")]
[h:GroupID = json.get(TransformationData,"GroupID")]
[h:SetBy = json.get(TransformationData,"SetBy")]

[h:NewForm = json.get(TransformationData,"Transformations")]
[h:NewFormProperties = json.get(NewForm,"Properties")]
[h:NewFormRawPropertyNames = json.get(NewForm,"RawPropertyNames")]
[h:NewFormMacros = json.get(NewForm,"Macros")]
[h:NewFormMTProperties = json.get(NewForm,"MTProperties")]
[h:NewFormDisplayName = base64.decode(json.get(NewFormMTProperties,"name"))]

[h,MACRO("TokenToJSON@Lib:pm.a5e.Core"): json.append("",ParentToken)]
[h:TokenFromJSON = json.get(macro.return,0)]
[h:OldFormProperties = json.get(TokenFromJSON,"Properties")]
[h:OldFormRawPropertyNames = json.get(TokenFromJSON,"RawPropertyNames")]

[h:HPEndInfo = ""]
[h:HPGainType = json.get(TransformationData,"HPGain")]
[h,if(json.get(HPGainType,"TempHP") == ""),CODE:{
	[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat.TempHP",getProperty("a5e.stat.TempHP"))]
	[h:TokenFromJSON = json.path.delete(TokenFromJSON,"\$['Properties']['a5e.stat.TempHP']")]
	[h,if(json.indexOf(NewFormRawPropertyNames,"a5e.stat.TempHP") != -1): json.remove(NewFormRawPropertyNames,json.indexOf(NewFormRawPropertyNames,"a5e.stat.TempHP"))]
	[h,if(json.indexOf(OldFormRawPropertyNames,"a5e.stat.TempHP") != -1): json.remove(OldFormRawPropertyNames,json.indexOf(OldFormRawPropertyNames,"a5e.stat.TempHP"))]
};{
	[h:"<!-- Add temp HP gained to monster props here -->"]
	[h:HPEndInfo = "TempHP"]
}]

[h,if(json.get(HPGainType,"HP") == ""),CODE:{
	[h:clearedProperties = json.append("","HP","RolledMaxHP","HitDice","MaxHitDice")]
	[h,foreach(prop,clearedProperties),CODE:{
		[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat."+prop,getProperty("a5e.stat."+prop))]
		[h,if(json.indexOf(NewFormRawPropertyNames,"a5e.stat."+prop) != -1): json.remove(NewFormRawPropertyNames,json.indexOf(NewFormRawPropertyNames,"a5e.stat."+prop))]
		[h:TokenFromJSON = json.path.delete(TokenFromJSON,"\$['Properties']['a5e.stat."+prop+"']")]
		[h,if(json.indexOf(OldFormRawPropertyNames,"a5e.stat."+prop) != -1): json.remove(OldFormRawPropertyNames,json.indexOf(OldFormRawPropertyNames,"a5e.stat."+prop))]
	}]
};{
	[h:HPEndInfo = "HP"]
}]

[h,if(json.get(HPGainType,"HPLoss") == "CarryOver"),CODE:{
	[h:TokenFromJSON = json.set(TokenFromJSON,"FormEndHPType",HPEndInfo)]
};{}]

[h:ConditionData = json.set(BaseConditionInfo,
	"DisplayName",json.get(BaseConditionInfo,"DisplayName")+": "+NewFormDisplayName,
	"Type","Condition",
	"ConditionType",json.append("","Transformation"),
	"Level",1,
	"MultiFeature",0,
	"CondEndThis",json.set("","RevertTransformation",GroupID)
)]
[h:endInfo = json.set("",
	"Duration",json.get(TransformationData,"Duration"),
	"AdvancePoint","EndofSetByTurn"
)]
[h:transformationConditionInfo = json.set("",
	"Conditions",json.append("",ConditionData),
	"EndInfo",endInfo,
	"GroupID",GroupID,
	"Target",ParentToken,
	"SetBy",SetBy,
	"SourceID",json.get(effectData,"ID")
)]

[h:TransformAttributesData = json.get(TransformationData,"Attributes")]
[h,if(json.get(TransformAttributesData,"All") == 1),CODE:{
	[h:retainedAttributes = pm.GetAttributes("Name","json")]
};{
	[h,if(json.isEmpty(TransformAttributesData)),CODE:{
		[h:retainedAttributes = "[]"]
	};{
		[h:gainedAttributes = pm.GetAttributes()]
		[h:allAttributes = json.path.read(gainedAttributes,"\$[*]['Name']")]
		[h,if(json.get(TransformAttributesData,"TypesInclusive") != ""): gainedAttributes = json.path.read(gainedAttributes,"\$[*][?(@.Type in "+json.get(TransformAttributesData,"TypesInclusive")+")]")]
		[h,if(json.get(TransformAttributesData,"Inclusive") != ""): gainedAttributes = json.path.read(gainedAttributes,"\$[*][?(@.Name in "+json.get(TransformAttributesData,"Inclusive")+")]")]

		[h,if(json.get(TransformAttributesData,"TypesExclusive") != ""): gainedAttributes = json.path.read(gainedAttributes,"\$[*][?(@.Type nin "+json.get(TransformAttributesData,"TypesExclusive")+")]")]
		[h,if(json.get(TransformAttributesData,"Exclusive") != ""): gainedAttributes = json.path.read(gainedAttributes,"\$[*][?(@.Name nin "+json.get(TransformAttributesData,"Exclusive")+")]")]

		[h:gainedAttributes = json.path.read(gainedAttributes,"\$[*]['Name']")]
		[h:retainedAttributes = json.difference(allAttributes,gainedAttributes)]
	}]
}]

[h:oldFormAttributes = getProperty("a5e.stat.BaseAttributes")]
[h:oldFormFeatures = getProperty("a5e.stat.AllFeatures")]
[h:asiFeatures = json.path.read(oldFormFeatures,"\$[*][?(@.Name == 'AbilityScoreIncrease')]")]
[h,if(!json.isEmpty(asiFeatures) && json.get(TransformAttributesData,"All") != 1),CODE:{
	[h:oldFormFeatures = json.path.delete(oldFormFeatures,"\$[*][?(@.Name == 'AbilityScoreIncrease')]")]

	[h,if(json.isEmpty(TransformAttributesData)): asiFeatures = "[]"]
	[h,foreach(asi,asiFeatures),CODE:{
		[h:attributes = json.fields(asi)]
		[h,foreach(attribute,attributes): oldFormAttributes = json.set(oldFormAttributes,attribute,json.get(oldFormAttributes,attribute) + json.get(asi,attribute))]
	}]
};{}]

[h:newFormAttributes = json.get(NewFormProperties,"a5e.stat.BaseAttributes")]
[h,foreach(attribute,retainedAttributes): newFormAttributes = json.set(newFormAttributes,attribute,json.get(oldFormAttributes,attribute))]

[h,if(json.get(TransformationData,"isRetainAlignment")): NewFormProperties = json.remove(NewFormProperties,"a5e.stat.Alignment")]

[h,if(!json.get(TransformationData,"isRetainConcentration")),CODE:{
	[h,MACRO("End Concentration@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken)]
};{}]

[h:"<!-- TODO: BUGFIX: Retained features that have and use resources while transformed will currently regain the resources used while transformed. Will need to have a method of having these persist. -->"]
[h:retainedFeatureTypes = json.get(TransformationData,"RetainedFeatures")]
[h,MACRO("TransformFilterFeatures@Lib:pm.a5e.Core"): json.set("","NewOrOld","Old","Features",oldFormFeatures,"Filter",retainedFeatureTypes)]
[h:oldFormFeaturesFinal = macro.return]

[h:newFormFeatures = json.get(NewFormProperties,"a5e.stat.AllFeatures")]
[h:gainedFeatureTypes = json.get(TransformationData,"GainedFeatures")]
[h,MACRO("TransformFilterFeatures@Lib:pm.a5e.Core"): json.set("","NewOrOld","New","Features",newFormFeatures,"Filter",gainedFeatureTypes)]
[h:newFormFeatures = macro.return]
[h:newFormFeaturesFinal = json.merge(oldFormFeaturesFinal,newFormFeatures)]
[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat.AllFeatures",newFormFeaturesFinal)]

[h:NewInventory = json.path.put(json.get(NewFormProperties,"a5e.stat.Inventory"),"\$[*]","AssociatedForm",GroupID)]
[h,switch(json.get(TransformationData,"isItemUsable")),CODE:
	case "None":{

	};
	case "":{
		[h:TokenFromJSON = json.path.delete(TokenFromJSON,"\$['Properties']['a5e.stat.Inventory']")]
	};
	case "Passive":{
		[h:"bleh"]
	};
	case "Reasonable":{
		[h:"bleh"]
	}
]

[h,if(json.get(TransformationData,"isItemUsable") != "" && json.get(TransformationData,"ItemDestination") == "Drop"),CODE:{
	[h:"drop da itemz"]
}]

[h:settingsProperties = json.append("","TargetingStyle","FullAbilityRules","FullSpellRules","DisplaySize","BorderColors","TitleColors")]
[h:conditionsProperties = json.append("","ConditionList","ConditionGroups","ConditionsSet")]
[h:alwaysRetainedProps = json.merge(settingsProperties,conditionsProperties)]
[h,foreach(prop,alwaysRetainedProps),CODE:{
	[h,if(json.indexOf(NewFormRawPropertyNames,"a5e.stat."+prop) != -1): NewFormRawPropertyNames = json.remove(NewFormRawPropertyNames,json.indexOf(NewFormRawPropertyNames,"a5e.stat."+prop))]
	[h,if(json.indexOf(OldFormRawPropertyNames,"a5e.stat."+prop) != -1): OldFormRawPropertyNames = json.remove(OldFormRawPropertyNames,json.indexOf(OldFormRawPropertyNames,"a5e.stat."+prop))]
}]

[h:TokenFromJSON = json.set(TokenFromJSON,"AssociatedCondition",GroupID,"RawPropertyNames",OldFormRawPropertyNames,"NextFormName",NewFormDisplayName)]
[h:PreviousForms = getProperty("a5e.stat.PreviousForms")]
[h:PreviousForms = json.merge(json.append("",TokenFromJSON),PreviousForms)]

[h,foreach(macro,json.get(TokenFromJSON,"Macros")),CODE:{
	[h:thisMacroIndex = getMacroIndexes(json.get(macro,"label"),"json")]
	[h,foreach(index,thisMacroIndex): removeMacro(index)]
}]

[h:setTokenImage(json.get(NewFormMTProperties,"tokenImage"))]
[h:setTokenPortrait(json.get(NewFormMTProperties,"tokenPortrait"))]
[h:setTokenHandout(json.get(NewFormMTProperties,"tokenHandout"))]
[h:setSightType(json.get(NewFormMTProperties,"Sight"))]
[h:setSize(json.get(NewFormMTProperties,"size"))]

[h:finalNewFormProps = json.unique(json.merge(NewFormRawPropertyNames,json.get(TokenFromJSON,"RawPropertyNames")))]
[h,foreach(prop,finalNewFormProps),CODE:{
	[h,if(json.contains(NewFormProperties,prop)):
		setProperty(prop,json.get(NewFormProperties,prop));
		setProperty(prop,getPropertyDefault(prop))
	]
}]

[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): transformationConditionInfo]
[h,foreach(macro,NewFormMacros): createMacro(macro)]

[h:setProperty("a5e.stat.PreviousForms",PreviousForms)]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Transformation",
	"FalseHeader","",
	"FullContents",NewFormDisplayName,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:return(0,json.set("","Table",abilityTable,"Transformation",NewForm))]