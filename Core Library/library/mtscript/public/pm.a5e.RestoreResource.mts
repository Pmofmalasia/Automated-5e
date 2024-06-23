[h:FeatureToRestore = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]
[h,if(argCount() > 2): RestorationModifiers = arg(2); RestorationModifiers = "{}"]
[h:RestorationAmount = json.get(RestorationModifiers,"Amount")]
[h:ResourceKey = json.get(RestorationModifiers,"Key")]

[h:ResourceSourceData = pm.a5e.FeatureSourceData(json.get(FeatureToRestore,"ResourceSource"),FeatureToRestore)]
[h:sourceProperty = json.get(ResourceSourceData,"Property")]
[h:sourcePath = json.get(ResourceSourceData,"Path")]

[h:abilityTable = "[]"]
[h,if(RestorationAmount == ""),CODE:{
	[h,switch(json.get(FeatureToRestore,"RestoreMethod")),CODE:
		case "Fixed":{
			[h:RestorationAmount = json.get(FeatureToRestore,"RestoreAmount")]
		};
		case "Rolled":{
			[h:RestoreAmountDieNumber = json.get(FeatureToRestore,"RestoreAmountDieNumber")]
			[h:RestoreAmountDieSize = json.get(FeatureToRestore,"RestoreAmountDieSize")]
			[h:RestoreAmountBonus = json.get(FeatureToRestore,"RestoreAmountBonus")]
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
			[h:RestoreRules = json.get(FeatureToRestore,"RestoreChanceDieNumber")+"d"+json.get(FeatureToRestore,"RestoreChanceDieSize")+pm.PlusMinus(json.get(FeatureToRestore,"RestoreChanceBonus"),0)]
			[h:RestoreChanceTotal = eval(RestoreRules)]
			[h:RestoreChanceTarget = json.get(FeatureToRestore,"RestoreChanceTarget")]

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
			[h:RestorationAmount = floor(json.get(getProperty("a5e.stat.AtrMods"),json.get(FeatureToRestore,"RestoreChanceAttribute")) * json.get(FeatureToRestore,"RestoreChanceMultiplier"))]
		};
		case "Proficiency":{
			[h:RestorationAmount = getProperty("a5e.stat.Proficiency")]
		};
		default:{
			[h:"<!-- For full restoration -->"]
		}
	]
};{}]

[h:needsPutTest = json.isEmpty(json.path.read(getProperty(sourceProperty),sourcePath+"['Resource']"))]
[h,switch(RestorationAmount),CODE:
	case "":{
		[h:MaxResource = evalMacro(json.get(FeatureToRestore,"MaxResource"))]
		[h:CurrentResource = json.get(FeatureToRestore,"Resource")]

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
				"Header",json.get(FeatureToRestore,"DisplayName")+": "+json.get(json.get(FeatureToRestore,"ResourceDisplayName"),tempResource),
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(MaxResource,tempResource),
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
	default:{
		[h:CurrentResource = json.get(FeatureToRestore,"Resource")]
		[h:MaxResource = evalMacro(json.get(FeatureToRestore,"MaxResource"))]

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