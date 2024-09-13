[h:FeatureToRestore = arg(0)]
[h:restorationData = arg(1)]
[h:ParentToken = arg(2)]
[h:switchToken(ParentToken)]
[h,if(argCount() > 3): RestorationModifiers = arg(3); RestorationModifiers = "{}"]

[h,if(json.type(restorationData) == "UNKNOWN"),CODE:{
	[h:"<!-- Legacy code: restorationData == 1 means full restoration of all resources; equivalent to 'Full' restoration -->"]
	[h:restorationData = json.set("","Method","Full")]
};{}]
[h:abilityTable = "[]"]

[h:ResourceSourceData = pm.a5e.FeatureSourceData(json.get(FeatureToRestore,"ResourceSource"),FeatureToRestore)]
[h:sourceProperty = json.get(ResourceSourceData,"Property")]
[h:sourcePath = json.get(ResourceSourceData,"Path")]

[h:RestorationAmount = ""]
[h:ResourceKey = json.get(restorationData,"Name")]

[h,switch(json.get(restorationData,"Method")),CODE:
	case "Fixed":{
		[h:RestorationAmount = json.get(restorationData,"Amount")]
	};
	case "Rolled":{
		[h:RestoreAmountDieNumber = json.get(restorationData,"DieNumber")]
		[h:RestoreAmountDieSize = json.get(restorationData,"DieSize")]
		[h:RestoreAmountBonus = json.get(restorationData,"Bonus")]
		[h:RestoreRules = RestoreAmountDieNumber+"d"+RestoreAmountDieSize+pm.PlusMinus(RestoreAmountBonus,0)+" = "]

		[h:getNewRolls()]
		[h:RestorationAmount = eval("d"+RestoreAmountDieSize) + RestoreAmountBonus]
		[h:RestoreAmountArray = getNewRolls()]
		[h,if(json.length(RestoreAmountArray) > 1 || RestoreAmountBonus != 0):
			RestoreAmountString = json.toList(RestoreAmountArray," + ")+pm.PlusMinus(RestoreAmountBonus,0)+" = ";
			RestoreAmountString = ""
		]

		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(FeatureToRestore,"DisplayName")+" Restored",
			"FalseHeader","",
			"FullContents",RestorationAmount,
			"RulesContents",RestoreRules,
			"RollContents",RestoreAmountString,
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};
	case "Chance":{
		[h:RestoreRules = json.get(restorationData,"DieNumber")+"d"+json.get(restorationData,"DieSize")+pm.PlusMinus(json.get(restorationData,"Bonus"),0)]
		[h:RestoreChanceTotal = eval(RestoreRules)]
		[h:RestoreChanceTarget = json.get(restorationData,"Target")]

		[h,if(RestoreChanceTotal < RestoreChanceTarget): RestorationAmount = 0]

		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(FeatureToRestore,"DisplayName")+" Recharge Roll",
			"FalseHeader","",
			"FullContents",if(RestorationAmount == 0,"Recharge Failed","Recharged"),
			"RulesContents",RestoreRules+" = ",
			"RollContents",RestoreChanceTotal+" -> ",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};
	case "Attribute":{
		[h:RestorationAmount = floor(json.get(getProperty("a5e.stat.AtrMods"),json.get(restorationData,"Attribute")) * json.get(restorationData,"Multiplier")) + json.get(restorationData,"Bonus")]
	};
	case "Proficiency":{
		[h:RestorationAmount = floor(getProperty("a5e.stat.Proficiency") * json.get(restorationData,"Multiplier")) + json.get(restorationData,"Bonus")]
	};
	case "UpTo":{
		[h:RestorationAmount = "UpTo"]
		[h:UpToAmount = json.get(restorationData,"Amount")]
	};
	case "Full":{
		[h:RestorationAmount = ""]
	};
	default:{
		[h:"<!-- Default to full restoration -->"]
	}
]

[h:CalculateResourceDataOptions = "{}"]
[h,if(ResourceKey != ""): json.set(CalculateResourceDataOptions,"resource",ResourceKey)]
[h:allResourceData = js.a5e.CalculateResourceData(FeatureToRestore,ParentToken,CalculateResourceDataOptions)]
[h:CurrentResource = json.get(FeatureToRestore,"Resource")]

[h:"<!-- Temporary need: Used to permanently convert tokens using the legacy resource format to the new one -->"]
[h,if(json.type(CurrentResource) == "UNKNOWN"): CurrentResource = "{}"]

[h,if(ResourceKey == ""):
	restoredResources = json.fields(allResourceData,"json");
	restoredResources = json.append("",ResourceKey)
]
[h:needsPutTest = json.isEmpty(json.path.read(getProperty(sourceProperty),sourcePath+"['Resource']"))]
[h,switch(RestorationAmount),CODE:
	case "":{
		[h,foreach(tempResource,restoredResources),CODE:{
			[h:CurrentResource = json.set(CurrentResource,tempResource,json.get(json.get(allResourceData,tempResource),"MaxResource"))]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(json.get(allResourceData,tempResource),"DisplayName"),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(CurrentResource,tempResource)+"/"+json.get(json.get(allResourceData,tempResource),"MaxResource"),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		}]
	};
	case 0:{

	};
	case "UpTo":{
		[h,foreach(tempResource,restoredResources),CODE:{
			[h:CurrentResource = json.set(CurrentResource,tempResource,max(json.get(CurrentResource,tempResource),UpToAmount))]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(json.get(allResourceData,tempResource),"DisplayName"),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(CurrentResource,tempResource)+"/"+json.get(json.get(allResourceData,tempResource),"MaxResource"),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		}]
	};
	default:{
		[h,foreach(tempResource,restoredResources),CODE:{
			[h:CurrentResource = json.set(CurrentResource,tempResource,min(json.get(CurrentResource,tempResource) + RestorationAmount,json.get(json.get(allResourceData,tempResource),"MaxResource")))]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(json.get(allResourceData,tempResource),"DisplayName"),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(CurrentResource,tempResource)+"/"+json.get(json.get(allResourceData,tempResource),"MaxResource"),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		}]
	}
]

[h,if(needsPutTest):
	setProperty(sourceProperty,json.path.put(getProperty(sourceProperty),sourcePath,"Resource",CurrentResource));
	setProperty(sourceProperty,json.path.set(getProperty(sourceProperty),sourcePath+"['Resource']",CurrentResource))
]

[h:return(0,json.set("","Table",abilityTable))]