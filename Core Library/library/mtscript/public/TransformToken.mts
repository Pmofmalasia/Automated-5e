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
[h:TempHPGained = json.get(HPGainType,"TempHP")]
[h,if(TempHPGained == ""),CODE:{
	[h:newTempHP = getProperty("a5e.stat.TempHP")]
};{
	[h:HPEndInfo = "TempHP"]
	[h,if(json.type(TempHPGained) == "UNKNOWN"),CODE:{
		[h:newTempHP = TempHPGained]
	};{
		[h:newTempHPPercent = json.get(TempHPGained,"Percentage")]
		[h:newTempHP = newTempHPPercent * json.get(NewFormProperties,"a5e.stat.HP")]
	}]
}]

[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat.TempHP",newTempHP)]
[h:TokenFromJSON = json.path.delete(TokenFromJSON,"\$['Properties']['a5e.stat.TempHP']")]
[h,if(json.indexOf(NewFormRawPropertyNames,"a5e.stat.TempHP") != -1): json.remove(NewFormRawPropertyNames,json.indexOf(NewFormRawPropertyNames,"a5e.stat.TempHP"))]
[h,if(json.indexOf(OldFormRawPropertyNames,"a5e.stat.TempHP") != -1): json.remove(OldFormRawPropertyNames,json.indexOf(OldFormRawPropertyNames,"a5e.stat.TempHP"))]

[h:HPGained = json.get(HPGainType,"HP")]
[h,if(HPGained == ""),CODE:{
	[h:clearedProperties = json.append("","HP","RolledMaxHP","HitDice","MaxHitDice")]
	[h,foreach(prop,clearedProperties),CODE:{
		[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat."+prop,getProperty("a5e.stat."+prop))]
		[h,if(json.indexOf(NewFormRawPropertyNames,"a5e.stat."+prop) != -1): json.remove(NewFormRawPropertyNames,json.indexOf(NewFormRawPropertyNames,"a5e.stat."+prop))]
		[h:TokenFromJSON = json.path.delete(TokenFromJSON,"\$['Properties']['a5e.stat."+prop+"']")]
		[h,if(json.indexOf(OldFormRawPropertyNames,"a5e.stat."+prop) != -1): json.remove(OldFormRawPropertyNames,json.indexOf(OldFormRawPropertyNames,"a5e.stat."+prop))]
	}]
};{
	[h:HPEndInfo = "HP"]
	[h,if(json.type(HPGained) == "UNKNOWN"),CODE:{
		[h:newHP = HPGained]
	};{
		[h:newHPPercent = json.get(HPGained,"Percentage")]
		[h:newHP = newHPPercent * json.get(NewFormProperties,"a5e.stat.HP")]
	}]
	[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat.HP",newHP)]
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

[h:"<!-- TODO: Transformation: See below. -->"]
[h:"<!-- TODO: BUGFIX: Retained features that have and use resources while transformed will currently regain the resources used while transformed. Will need to have a method of having these persist. -->"]
[h:retainedFeatureTypes = json.get(TransformationData,"RetainedFeatures")]
[h,MACRO("TransformFilterFeatures@Lib:pm.a5e.Core"): json.set("","NewOrOld","Old","Features",oldFormFeatures,"Filter",retainedFeatureTypes,"Form",json.get(NewForm,"Name"))]
[h:oldFormFeaturesFinal = macro.return]

[h:newFormFeatures = json.get(NewFormProperties,"a5e.stat.AllFeatures")]
[h:gainedFeatureTypes = json.get(TransformationData,"GainedFeatures")]
[h,MACRO("TransformFilterFeatures@Lib:pm.a5e.Core"): json.set("","NewOrOld","New","Features",newFormFeatures,"Filter",gainedFeatureTypes,"Form",json.get(NewForm,"Name"))]
[h:newFormFeatures = macro.return]
[h:newFormFeaturesFinal = json.merge(oldFormFeaturesFinal,newFormFeatures)]
[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat.AllFeatures",newFormFeaturesFinal)]

[h:NewInventory = json.path.put(json.get(NewFormProperties,"a5e.stat.Inventory"),"\$[*]","AssociatedCondition",GroupID)]
[h:CurrentInventory = getProperty("a5e.stat.Inventory",ParentToken)]
[h:RetainedItems = "[]"]
[h:UnusedItems = "[]"]
[h,switch(json.get(TransformationData,"isItemUsable")),CODE:
	case "None":{
		[h:UnusedItems = CurrentInventory]
	};
	case "":{
		[h:RetainedItems = CurrentInventory]
	};
	case "Passive":{
		[h:RetainedItems = json.path.read(CurrentInventory,"\$[*][?(@.isPassiveFeature == 1)]")]
		[h:UnusedItems = json.difference(CurrentInventory,RetainedItems)]
	};
	case "Reasonable":{
		[h:UniqueItems = js.a5e.json.unique(CurrentInventory,json.append("","ObjectID"))]
		[h:itemChoiceInput = ""]
		[h:allTransformationSettings = data.getData("addon:","pm.a5e.core","a5e.settings.ReasonableTransformations")]
		[h:thisFormSettings = json.get(allTransformationSettings,json.get(NewForm,"Name"))]
		[h,if(thisFormSettings == ""),CODE:{
			[h:allowedItems = "[]"]
			[h:prohibitedItems = "[]"]	
		};{
			[h:allowedItems = json.get(thisFormSettings,"AllowedItems")]
			[h:prohibitedItems = json.get(thisFormSettings,"ProhibitedItems")]			
		}]
		[h:allItemSettings = json.union(allowedItems,prohibitedItems)]

		[h:i = 0]
		[h:itemsToChoose = ""]
		[h,foreach(object,UniqueItems),CODE:{
			[h:hasSetting = json.contains(allItemSettings,json.get(object,"ObjectID"))]
			[h,if(!hasSetting): itemChoiceInput = listAppend(itemChoiceInput," itemChoice"+i+" |  | "+json.get(object,"DisplayName")+" is Usable: | CHECK "," ## ")]
			[h,if(!hasSetting): itemsToChoose = json.append(itemsToChoose,json.get(object,"ObjectID"))]
			[h,if(!hasSetting): i = i + 1]
		}]
		[h,if(itemChoiceInput != ""): itemChoiceInput = " junkVar | ------------ Choose Feasible Items ------------ |  | LABEL | SPAN=TRUE ##" + itemChoiceInput]

		[h:abort(input(itemChoiceInput))]

		[h,if(!json.isEmpty(itemsToChoose)),foreach(object,itemsToChoose),CODE:{
			[h,if(eval("itemChoice"+roll.count)):
				allowedItems = json.append(allowedItems,object);
				prohibitedItems = json.append(prohibitedItems,object)
			]
		}]

		[h:thisFormSettings = json.set(thisFormSettings,
			"AllowedItems",allowedItems,
			"ProhibitedItems",prohibitedItems
		)]
		[h:allTransformationSettings = json.set(allTransformationSettings,json.get(NewForm,"Name"),thisFormSettings)]
		[h:data.setData("addon:","pm.a5e.core","a5e.settings.ReasonableTransformations",allTransformationSettings)]

		[h:RetainedItems = json.path.read(CurrentInventory,"\$[*][?(@.ObjectID in "+allowedItems+")]")]
		[h:UnusedItems = json.difference(CurrentInventory,RetainedItems)]
	}
]

[h:NewInventory = json.merge(RetainedItems,NewInventory)]
[h:NewFormProperties = json.set(NewFormProperties,"a5e.stat.Inventory",NewInventory)]

[h:dropTest = 0]
[h,if(!json.isEmpty(UnusedItems)),CODE:{
	[h,switch(json.get(TransformationData,"ItemDestination")),CODE:
		case "Merged":{
			[h:"<!-- UnusedItems is unchanged as all are merged -->"]
		};
		case "Drop":{
			[h:droppedItems = UnusedItems]
			[h:UnusedItems = "[]"]
			[h:dropTest = 1]
		};
		case "Choice":{
			[h:droppedItemsInput = " junkVar | ------------ Choose Items to Drop ------------ |  | LABEL | SPAN=TRUE "]
			[h,foreach(item,UnusedItems): droppedItemsInput = listAppend(droppedItemsInput," dropChoice"+roll.count+" |  | "+if(json.get(item,"Number") > 1,json.get(item,"Number")+" "+json.get(item,"DisplayName")+"s",json.get(item,"DisplayName"))+" | CHECK "," ## ")]

			[h:abort(input(droppedItemsInput))]

			[h:droppedItems = ""]
			[h,foreach(item,UnusedItems),if(eval("dropChoice"+roll.count)): droppedItems = json.append(droppedItems,item)]
			[h:UnusedItems = json.difference(UnusedItems,droppedItems)]

			[h:dropTest = !json.isEmpty(droppedItems)]
		}
	]
};{}]
[h:TokenFromJSON = json.path.set(TokenFromJSON,"\$['Properties']['a5e.stat.Inventory']",UnusedItems)]

[h,if(dropTest),CODE:{
	[h:droppedItems = json.path.read(droppedItems,"\$[*][?(@.StoredIn == null || @.StoredIn == '')]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h:droppedItemData = json.set("",
		"Items",droppedItems,
		"Location",json.set("","Token",ParentToken),
		"LeaveToken",1,
		"ParentToken",ParentToken
	)]
	[h,MACRO("DropMultipleItems@Lib:pm.a5e.Core"): droppedItemData]
	[h:dropItemReturnData = macro.return]
	
	[h:dropOutput = json.get(dropItemReturnData,"Table")]
};{
	[h:dropOutput = "[]"]
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
[h:js.a5e.CreateFeatureMacros(oldFormFeaturesFinal,ParentToken)]

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

[h:abilityTable = json.merge(abilityTable,dropOutput)]

[h:return(0,json.set("","Table",abilityTable,"Transformation",NewForm))]