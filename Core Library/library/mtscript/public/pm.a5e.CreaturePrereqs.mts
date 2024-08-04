[h:TokenToCheck = arg(0)]
[h:ActivationPrerequisites = arg(1)]
[h,if(argCount() > 2): ComparisonToken = arg(2); ComparisonToken = ""]
[h,if(json.type(TokenToCheck) == "OBJECT"): TokenToCheck = json.get(TokenToCheck,"Properties")]

[h:MeetsPrereqTest = 1]
[h:prereqsToCheck = json.fields(ActivationPrerequisites,"json")]
[h,foreach(prereq,prereqsToCheck),switch(prereq),CODE:
	case "Allegiance":{
		[h,if(ComparisonToken == ""): return(0,0)]
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]

		[h:allegianceTest = 0]
		[h,if(TokenToCheck == ComparisonToken),CODE:{
			[h,if(json.get(thisComparisonInfo,"Self")==1): allegianceTest = 1]
			[h,if(json.get(thisComparisonInfo,"NotSelf")==1): allegianceTest = 0]					
		};{
			[h,if(json.get(thisComparisonInfo,"Neutral")==1): allegianceTest = if(getPropertyFlexible("a5e.stat.whichTeam",TokenToCheck) == 0,1,allegianceTest)]
			[h,if(json.get(thisComparisonInfo,"Ally")==1): allegianceTest = if(getPropertyFlexible("a5e.stat.whichTeam",TokenToCheck) == getProperty("a5e.stat.whichTeam",ComparisonToken),1,allegianceTest)]
			[h,if(json.get(thisComparisonInfo,"Foe")==1): allegianceTest = if(and(getPropertyFlexible("a5e.stat.whichTeam",TokenToCheck) != getProperty("a5e.stat.whichTeam",ComparisonToken),getPropertyFlexible("a5e.stat.whichTeam",TokenToCheck) != 0),1,allegianceTest)]
			[h,if(json.get(thisComparisonInfo,"NotSelf")==1): allegianceTest = 1]
		}]
		
		[h:return(allegianceTest,0)]
	};
	case "TypeInclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			MeetsPrereqTest = or(thisComparisonInfo==getPropertyFlexible("a5e.stat.CreatureType",TokenToCheck),thisComparisonInfo=="Any");
			MeetsPrereqTest = json.contains(thisComparisonInfo,getPropertyFlexible("a5e.stat.CreatureType",TokenToCheck))
		]
		[h:return(MeetsPrereqTest,0)]
	};
	case "TypeExclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			MeetsPrereqTest = thisComparisonInfo != getPropertyFlexible("a5e.stat.CreatureType",TokenToCheck);
			MeetsPrereqTest = !json.contains(thisComparisonInfo,getPropertyFlexible("a5e.stat.CreatureType",TokenToCheck))
		]
		[h:return(MeetsPrereqTest,0)]
	};
	case "SubtypeInclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			MeetsPrereqTest = or(thisComparisonInfo==getPropertyFlexible("a5e.stat.Race",TokenToCheck),thisComparisonInfo=="Any");
			MeetsPrereqTest = json.contains(thisComparisonInfo,getPropertyFlexible("a5e.stat.Race",TokenToCheck))
		]
		[h:return(MeetsPrereqTest,0)]
	};
	case "SubtypeExclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			MeetsPrereqTest = thisComparisonInfo != getPropertyFlexible("a5e.stat.Race",TokenToCheck);
			MeetsPrereqTest = !json.contains(thisComparisonInfo,getPropertyFlexible("a5e.stat.Race",TokenToCheck))
		]
		[h:return(MeetsPrereqTest,0)]
	};
	case "CreatureNameInclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			MeetsPrereqTest = or(thisComparisonInfo==getPropertyFlexible("a5e.stat.CreatureName",TokenToCheck),thisComparisonInfo=="Any");
			MeetsPrereqTest = json.contains(thisComparisonInfo,getPropertyFlexible("a5e.stat.CreatureName",TokenToCheck))
		]
		[h:return(MeetsPrereqTest,0)]
	};
	case "CreatureNameExclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			MeetsPrereqTest = thisComparisonInfo != getPropertyFlexible("a5e.stat.CreatureName");
			MeetsPrereqTest = !json.contains(thisComparisonInfo,getPropertyFlexible("a5e.stat.CreatureName"))
		]
		[h:return(MeetsPrereqTest,0)]
	};
	case "IncludeToken":{
		[h:requiredTokens = json.get(ActivationPrerequisites,prereq)]
		[h:requiredTokenTest = json.contains(requiredTokens,TokenToCheck)]
		[h:return(requiredTokenTest,0)]
	};
	case "ExcludeToken":{
		[h:excludedTokens = json.get(ActivationPrerequisites,prereq)]
		[h:excludedTokenTest = !json.contains(excludedTokens,TokenToCheck)]
		[h:return(excludedTokenTest,0)]
	};
	case "Resource":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "HitDice":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "SpellSlots":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Class":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Subclass":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "IncludeProficiency":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Vision":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Language":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "BaseNeeds":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Sight":{
		[h:"<!-- Note: Sight/Hearing/Understand are distinct from Vision/Language in that they test ability to see/hear/understand a specific token rather than presence of a specific vision/language. -->"]
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Hearing":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Understand":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
	};
	case "Alignment":{
		[h:"<!-- Note: There is no included/excluded for alignment, might be good to add -->"]
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h:thisTokenAlignment = getPropertyFlexible("a5e.stat.Alignment",TokenToCheck)]
		[h:alignmentFinal = json.get(thisTokenAlignment,"Order")+json.get(thisTokenAlignment,"Morality")]

		[h:alignmentTest = json.get(thisComparisonInfo,alignmentFinal) == 1]
		[h:return(alignmentTest,0)]
	};
	case "Size":{
		[h:"<!-- Legacy code for when SizeInclusive was just Size -->"]
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(TokenToCheck) == "UNKNOWN"):
			tokenSize = getSize();
			tokenSize = getPropertyFlexible("a5e.stat.Size",TokenToCheck)	
		]
	
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			sizeTest = thisComparisonInfo == tokenSize;
			sizeTest = json.contains(thisComparisonInfo,tokenSize)
		]

		[h:return(sizeTest,0)]
	};
	case "SizeInclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(TokenToCheck) == "UNKNOWN"):
			tokenSize = getSize();
			tokenSize = getPropertyFlexible("a5e.stat.Size",TokenToCheck)	
		]
	
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			sizeTest = thisComparisonInfo == tokenSize;
			sizeTest = json.contains(thisComparisonInfo,tokenSize)
		]

		[h:return(sizeTest,0)]
	};
	case "SizeExclusive":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h,if(json.type(TokenToCheck) == "UNKNOWN"):
			tokenSize = getSize();
			tokenSize = getPropertyFlexible("a5e.stat.Size",TokenToCheck)	
		]
	
		[h,if(json.type(thisComparisonInfo) == "UNKNOWN"):
			sizeTest = thisComparisonInfo != tokenSize;
			sizeTest = !json.contains(thisComparisonInfo,tokenSize)
		]

		[h:return(sizeTest,0)]
	};
	case "SizeMaximum":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]

		[h,if(isNumber(thisComparisonInfo)),CODE:{
			[h,if(ComparisonToken == ""): return(0,0)]
			[h:maximumSize = pm.a5e.GetSizeChange(getSize(ComparisonToken),thisComparisonInfo)]
		};{
			[h:maximumSize = thisComparisonInfo]
		}]

		[h,if(json.type(TokenToCheck) == "UNKNOWN"):
			tokenSize = getSize();
			tokenSize = getPropertyFlexible("a5e.stat.Size",TokenToCheck)	
		]
		[h:sizeTest = pm.a5e.CompareSizes(maximumSize,tokenSize) >= 0]

		[h:return(sizeTest,0)]
	};
	case "SizeMinimum":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]

		[h,if(isNumber(thisComparisonInfo)),CODE:{
			[h,if(ComparisonToken == ""): return(0,0)]
			[h:minimumSize = pm.a5e.GetSizeChange(getSize(ComparisonToken),thisComparisonInfo)]
		};{
			[h:minimumSize = thisComparisonInfo]
		}]

		[h,if(json.type(TokenToCheck) == "UNKNOWN"):
			tokenSize = getSize();
			tokenSize = getPropertyFlexible("a5e.stat.Size",TokenToCheck)	
		]
		[h:sizeTest = pm.a5e.CompareSizes(minimumSize,tokenSize) <= 0]

		[h:return(sizeTest,0)]
	};
	case "SizeMax":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]

		[h,if(isNumber(thisComparisonInfo)),CODE:{
			[h,if(ComparisonToken == ""): return(0,0)]
			[h:maximumSize = pm.a5e.GetSizeChange(getSize(ComparisonToken),thisComparisonInfo)]
		};{
			[h:maximumSize = thisComparisonInfo]
		}]

		[h,if(json.type(TokenToCheck) == "UNKNOWN"):
			tokenSize = getSize();
			tokenSize = getPropertyFlexible("a5e.stat.Size",TokenToCheck)	
		]
		[h:sizeTest = pm.a5e.CompareSizes(maximumSize,tokenSize) >= 0]

		[h:return(sizeTest,0)]
	};
	case "SizeMin":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]

		[h,if(isNumber(thisComparisonInfo)),CODE:{
			[h,if(ComparisonToken == ""): return(0,0)]
			[h:minimumSize = pm.a5e.GetSizeChange(getSize(ComparisonToken),thisComparisonInfo)]
		};{
			[h:minimumSize = thisComparisonInfo]
		}]

		[h,if(json.type(TokenToCheck) == "UNKNOWN"):
			tokenSize = getSize();
			tokenSize = getPropertyFlexible("a5e.stat.Size",TokenToCheck)	
		]
		[h:sizeTest = pm.a5e.CompareSizes(minimumSize,tokenSize) <= 0]

		[h:return(sizeTest,0)]
	};
	case "HP":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h:PrerequisiteType = json.get(thisComparisonInfo,"Type")]

		[h,switch(PrerequisiteType),CODE:
			case "AtMaximumHP":{
				[h:MeetsPrereqTest = getPropertyFlexible("a5e.stat.HP",TokenToCheck) == getPropertyFlexible("a5e.stat.MaxHP",TokenToCheck)]
			};
			case "Damaged":{
				[h:MeetsPrereqTest = getPropertyFlexible("a5e.stat.HP",TokenToCheck) < getPropertyFlexible("a5e.stat.MaxHP",TokenToCheck)]
			};
			case "OverHalfHP":{
				[h:"<!-- TODO: Could put further option here to include/exclude exactly half as being valid -->"]
				[h:MeetsPrereqTest = getPropertyFlexible("a5e.stat.HP",TokenToCheck)/getPropertyFlexible("a5e.stat.MaxHP",TokenToCheck) > (1/2)]
			};
			case "BelowHalfHP":{
				[h:"<!-- TODO: Could put further option here to include/exclude exactly half as being valid -->"]
				[h:MeetsPrereqTest = getPropertyFlexible("a5e.stat.HP",TokenToCheck)/getPropertyFlexible("a5e.stat.MaxHP",TokenToCheck) < (1/2)]
			};
			case "NoHP":{
				[h:MeetsPrereqTest = getPropertyFlexible("a5e.stat.HP",TokenToCheck) == 0]
			};
			case "HasHP":{
				[h:MeetsPrereqTest = getPropertyFlexible("a5e.stat.HP",TokenToCheck) >= 1]
			};
			case "Comparison":{
				[h:Comparitor = json.get(thisComparisonInfo,"Comparitor")]
				[h:Comparitor = pm.a5e.ComparitorForEval(Comparitor)]

				[h:"<!-- Possible different method: switch(HPTarget), where HPTarget is either one of many strings corresponding to some token (user, all other targets (lowest HP target?), etc.) OR is just a number (default)-->"]
				[h:HPTarget = json.get(thisComparisonInfo,"Target")]
				[h:targetIsTokenTest = json.contains(getTokens("json"),HPTarget)]
				[h,if(targetIsTokenTest): HPTarget = getPropertyFlexible("a5e.stat.HP",HPTarget)]
				[h:MeetsPrereqTest = eval(getPropertyFlexible("a5e.stat.HP",TokenToCheck)+Comparitor+HPTarget)]
			}
		]

		[h:return(MeetsPrereqTest,0)]
	};
	case "IncludeCondition":{
		[h:"<!-- Note: neededConditions is an object with key 'Names' (array of condition names) and 'AllorOne' ('All' for needs all, 'One' for needs at least one)-->"]
		[h:neededConditions = json.get(ActivationPrerequisites,prereq)]
		[h:MeetsPrereqTest = pm.a5e.HasConditions(json.set(neededConditions,"ParentToken",TokenToCheck))]

		[h:return(MeetsPrereqTest,0)]
	};
	case "ExcludeCondition":{
		[h:excludedConditions = json.get(ActivationPrerequisites,prereq)]
		[h:MeetsPrereqTest = !pm.a5e.HasConditions(json.set("","Names",excludedConditions,"AllorOne",1,"ParentToken",TokenToCheck))]

		[h:return(MeetsPrereqTest,0)]
	};
	case "Attribute":{
		[h:"<!-- BUGFIX: CRITICAL: Any attempt to use Int as a parameter for auras (or, in the future, other properties calculated via UnifiedAbilities) will cause crashes on ALL tokens if that aura is active. Only solution I can think of currently is swapping getPropertyFlexible() for a5e.AttributeCalc(target,pm.a5e.GatherThisTokenFeatures(target,0)) - but this would outright prevent intelligence calculations from taking auras into account for ALL targeting (not just aura targeting). -->"]
	
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h:attributeMaximum = json.get(thisComparisonInfo,"Maximum")]
		[h:attributeMinimum = json.get(thisComparisonInfo,"Minimum")]
		[h:whichAttribute = json.get(thisComparisonInfo,"Attribute")]

		[h:tokenStat = json.get(getPropertyFlexible("a5e.stat.Attributes",TokenToCheck),whichAttribute)]
		[h:"<!-- Setting min/max to a tokenID compares against the stat of that token -->"]
		[h,if(json.contains(getTokens("json"),attributeMaximum)): attributeMaximum = json.get(getProperty("a5e.stat.Attribute",attributeMaximum),whichAttribute)]
		[h,if(json.contains(getTokens("json"),attributeMinimum)): attributeMinimum = json.get(getProperty("a5e.stat.Attribute",attributeMinimum),whichAttribute)]

		[h:MeetsPrereqTest = 1]
		[h,if(attributeMaximum != ""): MeetsPrereqTest = (attributeMaximum < tokenStat)]
		[h,if(attributeMinimum != ""): MeetsPrereqTest = min(MeetsPrereqTest,(attributeMinimum > tokenStat))]

		[h:return(MeetsPrereqTest,0)]
	};
	case "MaxCover":{
		
	};
	case "CRMaximum":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]

		[h:CRTest = thisComparisonInfo >= getPropertyFlexible("a5e.stat.CR",TokenToCheck)]

		[h:return(CRTest,0)]
	};
	case "CRMinimum":{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]

		[h:CRTest = thisComparisonInfo <= getPropertyFlexible("a5e.stat.CR",TokenToCheck)]

		[h:return(CRTest,0)]
	};
	default:{
		[h:thisComparisonInfo = json.get(ActivationPrerequisites,prereq)]
		[h:Comparitor = json.get(thisComparisonInfo,"Comparitor")]
		[h:StatTarget = json.get(thisComparisonInfo,"Target")]
		[h:tokenStat = getPropertyFlexible("a5e.stat."+prereq,TokenToCheck)]
		[h,if(json.type(tokenStat) == "UNKNOWN"),CODE:{
			[h,if(json.contains(getTokens("json"),StatTarget)): StatTarget = getPropertyFlexible("a5e.stat."+prereq,StatTarget)]
		};{
			[h:StatKey = json.get(thisComparisonInfo,"Key")]
			[h:tokenStat = json.get(tokenStat,StatKey)]
			[h,if(json.contains(getTokens("json"),StatTarget)): StatTarget = json.get(getPropertyFlexible("a5e.stat."+prereq,StatTarget),StatKey)]
		}]

		[h:MeetsPrereqTest = eval(tokenStat+Comparitor+StatTarget)]

		[h:return(MeetsPrereqTest,0)]
	}
]

[h:return(0,1)]