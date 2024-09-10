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

[h:"<!-- TODO: MaxResource fix -->"]
[h:CalculateResourceDataOptions = "{}"]
[h,if(ResourceKey != ""): json.set(CalculateResourceDataOptions,"resource",ResourceKey)]
[h:ResourceData = js.a5e.CalculateResourceData(FeatureToRestore,ParentToken,CalculateResourceDataOptions)]
[h:broadcast(ResourceData)]
[h:MaxResource = json.get(ResourceData,"MaxResource")]
[h:broadcast(MaxResource)]
[h:CurrentResource = json.get(FeatureToRestore,"Resource")]
[h:needsPutTest = json.isEmpty(json.path.read(getProperty(sourceProperty),sourcePath+"['Resource']"))]
[h,switch(RestorationAmount),CODE:
	case "":{
		[h,if(json.type(MaxResource) == "OBJECT" && ResourceKey == ""),CODE:{
			[h,foreach(tempResource,json.fields(MaxResource,"json")): abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(FeatureToRestore,"DisplayName")+": "+json.get(json.get(FeatureToRestore,"ResourceDisplayName"),tempResource),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(MaxResource,tempResource),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]

			[h:ResourceRestoredFinal = MaxResource]
		};{
			[h,if(json.type(MaxResource) == "OBJECT"): abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(FeatureToRestore,"DisplayName")+": "+json.get(json.get(FeatureToRestore,"ResourceDisplayName"),ResourceKey),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(MaxResource,ResourceKey),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"));
			abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",if(json.get(FeatureToRestore,"ResourceDisplayName") == "",json.get(FeatureToRestore,"DisplayName"),json.get(FeatureToRestore,"ResourceDisplayName")),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",MaxResource,
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]

			[h,if(json.type(MaxResource) == "OBJECT"):
				ResourceRestoredFinal = json.set(CurrentResource,ResourceKey,json.get(MaxResource,ResourceKey));
				ResourceRestoredFinal = MaxResource
			]
		}]
	};
	case 0:{

	};
	case "UpTo":{
		[h,if(json.type(MaxResource) == "OBJECT" && ResourceKey == ""),CODE:{
			[h:AllResourceKeys = json.fields(CurrentResource,"json")]
			[h,foreach(resource,AllResourceKeys): CurrentResource = json.set(CurrentResource,resource,max(json.get(CurrentResource,resource),UpToAmount))]
			[h,foreach(resource,AllResourceKeys): abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(FeatureToRestore,"DisplayName")+": "+json.get(json.get(FeatureToRestore,"ResourceDisplayName"),resource),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(CurrentResource,resource)+"/"+json.get(MaxResource,resource),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};{
			[h,if(json.type(MaxResource) == "OBJECT"):
				CurrentResource = json.set(CurrentResource,ResourceKey,max(json.get(CurrentResource,ResourceKey),UpToAmount));
				CurrentResource = max(CurrentResource,UpToAmount)
			]
			[h,if(json.type(MaxResource) == "OBJECT"):
				abilityTable = json.append(abilityTable,json.set("",
					"ShowIfCondensed",1,
					"Header",json.get(FeatureToRestore,"DisplayName")+": "+json.get(json.get(FeatureToRestore,"ResourceDisplayName"),ResourceKey),
					"FalseHeader","",
					"FullContents","",
					"RulesContents",json.get(CurrentResource,ResourceKey)+"/"+json.get(MaxResource,ResourceKey),
					"RollContents","",
					"DisplayOrder","['Rules','Roll','Full']"));
				abilityTable = json.append(abilityTable,json.set("",
					"ShowIfCondensed",1,
					"Header",if(json.get(FeatureToRestore,"ResourceDisplayName") == "",json.get(FeatureToRestore,"DisplayName"),json.get(FeatureToRestore,"ResourceDisplayName")),
					"FalseHeader","",
					"FullContents","",
					"RulesContents",CurrentResource+"/"+MaxResource,
					"RollContents","",
					"DisplayOrder","['Rules','Roll','Full']"))
			]
		}]

		[h:ResourceRestoredFinal = CurrentResource]
	};
	default:{
		[h,if(json.type(MaxResource) == "OBJECT" && ResourceKey == ""),CODE:{
			[h:AllResourceKeys = json.fields(CurrentResource,"json")]
			[h,foreach(resource,AllResourceKeys): CurrentResource = json.set(CurrentResource,resource,min(json.get(CurrentResource,resource) + RestorationAmount,json.get(MaxResource,resource)))]
			[h,foreach(resource,AllResourceKeys): abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(FeatureToRestore,"DisplayName")+": "+json.get(json.get(FeatureToRestore,"ResourceDisplayName"),resource),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(CurrentResource,resource)+"/"+json.get(MaxResource,resource),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};{
			[h,if(json.type(MaxResource) == "OBJECT"):
				CurrentResource = json.set(CurrentResource,ResourceKey,min(json.get(CurrentResource,ResourceKey) + RestorationAmount,json.get(MaxResource,ResourceKey)));
				CurrentResource = min(CurrentResource + RestorationAmount,MaxResource)
			]
			[h,if(json.type(MaxResource) == "OBJECT"):
				abilityTable = json.append(abilityTable,json.set("",
					"ShowIfCondensed",1,
					"Header",json.get(FeatureToRestore,"DisplayName")+": "+json.get(json.get(FeatureToRestore,"ResourceDisplayName"),ResourceKey),
					"FalseHeader","",
					"FullContents","",
					"RulesContents",json.get(CurrentResource,ResourceKey)+"/"+json.get(MaxResource,ResourceKey),
					"RollContents","",
					"DisplayOrder","['Rules','Roll','Full']"));
				abilityTable = json.append(abilityTable,json.set("",
					"ShowIfCondensed",1,
					"Header",if(json.get(FeatureToRestore,"ResourceDisplayName") == "",json.get(FeatureToRestore,"DisplayName"),json.get(FeatureToRestore,"ResourceDisplayName")),
					"FalseHeader","",
					"FullContents","",
					"RulesContents",CurrentResource+"/"+MaxResource,
					"RollContents","",
					"DisplayOrder","['Rules','Roll','Full']"))
			]
		}]

		[h:ResourceRestoredFinal = CurrentResource]
	}
]

[h,if(needsPutTest):
	setProperty(sourceProperty,json.path.put(getProperty(sourceProperty),sourcePath,"Resource",ResourceRestoredFinal));
	setProperty(sourceProperty,json.path.set(getProperty(sourceProperty),sourcePath+"['Resource']",ResourceRestoredFinal))
]

[h:return(0,json.set("","Table",abilityTable))]