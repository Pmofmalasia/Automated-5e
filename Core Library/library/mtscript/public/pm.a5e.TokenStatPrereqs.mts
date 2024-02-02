[h:TokenToCheck = arg(0)]
[h:ActivationPrerequisites = arg(1)]

[h:MeetsAllPrereqs = 1]

[h:switchToken(TokenToCheck)]
[h:statsToCheck = json.fields(ActivationPrerequisites,"json")]
[h,foreach(stat,statsToCheck),switch,CODE:
	case "Resource":{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
		[h:whichAbilityScore = json.get(thisComparisonInfo,"AbilityScore")]
		[h:Comparitor = json.get(thisComparisonInfo,"Comparitor")]
		[h:StatTarget = json.get(thisComparisonInfo,"Target")]
		[h,if(json.contains(getTokens("json"),StatTarget)): StatTarget = json.get(getProperty("a5e.stat.Attributes",StatTarget),whichAbilityScore)]
		[h:MeetsPrereqTest = eval(json.get(getProperty("a5e.stat.Attributes"),whichAbilityScore)+Comparitor+StatTarget)]

		[h:return(MeetsPrereqTest,0)]
	};
	case "HitDice":{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
	};
	case "SpellSlots":{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
	};
	case "Subclass":{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
	};
	case "Alignment":{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
	};
	case "Size":{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
		[h:tokenSize = getSize()]
	};
	case "HP":{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
		[h:PrerequisiteType = json.get(statsToCheck,"Type")]
		[h,switch(PrerequisiteType),CODE:
			case "Maximum":{
				[h:MeetsPrereqTest = getProperty("a5e.stat.HP") == getProperty("a5e.stat.MaxHP")]
			};
			case "Damaged":{
				[h:MeetsPrereqTest = getProperty("a5e.stat.HP") < getProperty("a5e.stat.MaxHP")]
			};
			case "OverHalfHP":{
				[h:"<!-- TODO: Could put further option here to include/exclude exactly half as being valid -->"]
				[h:MeetsPrereqTest = getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP") > (1/2)]
			};
			case "BelowHalfHP":{
				[h:"<!-- TODO: Could put further option here to include/exclude exactly half as being valid -->"]
				[h:MeetsPrereqTest = getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP") < (1/2)]
			};
			case "NoHP":{
				[h:MeetsPrereqTest = getProperty("a5e.stat.HP") == 0]
			};
			case "HasHP":{
				[h:MeetsPrereqTest = getProperty("a5e.stat.HP") != 0]
			};
			case "Comparison":{
				[h:Comparitor = json.get(thisComparisonInfo,"Comparitor")]
				[h:HPTarget = json.get(thisComparisonInfo,"Target")]
				[h,if(json.contains(getTokens("json"),HPTarget)): HPTarget = getProperty("a5e.stat.HP",HPTarget)]
				[h:MeetsPrereqTest = eval(getProperty("a5e.stat.HP")+Comparitor+HPTarget)]
			}
		]

		[h:return(MeetsPrereqTest,0)]
	};
	default:{
		[h:thisComparisonInfo = json.get(statsToCheck,stat)]
		[h:Comparitor = json.get(thisComparisonInfo,"Comparitor")]
		[h:StatTarget = json.get(thisComparisonInfo,"Target")]
		[h:tokenStat = getProperty("a5e.stat."+stat)]
		[h,if(json.type(tokenStat) == "UNKNOWN"),CODE:{
			[h,if(json.contains(getTokens("json"),StatTarget)): StatTarget = getProperty("a5e.stat."+stat,StatTarget)]
		};{
			[h:StatKey = json.get(thisComparisonInfo,"Key")]
			[h:tokenStat = json.get(tokenStat,StatKey)]
			[h,if(json.contains(getTokens("json"),StatTarget)): StatTarget = json.get(getProperty("a5e.stat."+stat,StatTarget),StatKey)]
		}]

		[h:MeetsPrereqTest = eval(tokenStat+Comparitor+StatTarget)]

		[h:return(MeetsPrereqTest,0)]
	}
]

[h:return(0,MeetsPrereqTest)]