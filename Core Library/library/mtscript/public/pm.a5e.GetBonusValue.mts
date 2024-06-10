[h:BonusInfo = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h,switch(json.type(BonusInfo)),CODE:
	case "UNKNOWN":{
		[h,switch(BonusInfo),CODE:
			case "Proficiency":{
				[h:FinalBonus = getProperty("a5e.stat.Proficiency")]
				[h:FinalBonusRules = "Prof"]
			};
			case "Level":{
				[h:FinalBonus = getProperty("a5e.stat.Level")]
				[h:FinalBonusRules = "Level"]
			};
			default:{
				[h:isBonusNumber = isNumber(BonusInfo)]
				[h,if(isBonusNumber):
					FinalBonus = BonusInfo;
					FinalBonus = json.get(getProperty("a5e.stat.AtrMods"),BonusInfo)
				]
				[h,if(isBonusNumber):
					FinalBonusRules = BonusInfo;
					FinalBonusRules = substring(BonusInfo,0,3)
				]
			}
		]

		[h:FinalBonusArray = json.append("",FinalBonus)]
		[h:FinalBonusString = FinalBonus]
	};
	case "OBJECT":{
		[h:FinalBonusArray = "[]"]
		[h:FinalBonusString = ""]
	
		[h:BonusType = json.get(BonusInfo,"Type")]
		[h,switch(BonusType),CODE:
			case "Attribute":{
				[h:whichAttribute = json.get(BonusInfo,"Attribute")]
				[h:FinalBonus = json.get(getProperty("a5e.stat.Attributes"),whichAttribute)]
				[h:FinalBonusRules = whichAttribute]
			};
			case "AtrMod":{
				[h:whichAttribute = json.get(BonusInfo,"Attribute")]
				[h:FinalBonus = json.get(getProperty("a5e.stat.AtrMods"),whichAttribute)]
				[h:FinalBonusRules = substring(whichAttribute,0,3)]
			};
			case "Proficiency":{
				[h:FinalBonus = getProperty("a5e.stat.Proficiency")]
				[h:FinalBonusRules = "Prof"]
			};
			case "Level":{
				[h:whichClass = json.get(BonusInfo,"Class")]
				[h:FinalBonus = 0]
				[h,switch(whichClass):
					case "": FinalBonus = getProperty("a5e.stat.Level");
					case "Monster": allHitDice = getProperty("a5e.stat.MaxHitDice");
					default: FinalBonus = json.get(getProperty("a5e.stat.Classes"),whichClass)
				]
				[h,if(whichClass == "Monster"),foreach(dieSize,json.fields(allHitDice,"json")): FinalBonus = FinalBonus + json.get(allHitDice,dieSize)]

				[h,switch(whichClass):
					case "": FinalBonusRules = "Level";
					case "Monster": FinalBonusRules = "Max Hit Dice";
					default: FinalBonusRules = pm.GetDisplayName(whichClass,"sb.Classes")+" Level"
				]
			};
			case "SpellModifier":{
				
			};
			case "Rolled":{
				[h:diceRolled = pm.DieRoller(json.get(BonusInfo,"DieNumber"),json.get(BonusInfo,"DieSize"),json.get(BonusInfo,"Bonus"))]
				[h:FinalBonus = json.get(diceRolled,"Total")]
				[h:FinalBonusRules = json.get(diceRolled,"Formula")]
				[h:FinalBonusString = json.get(diceRolled,"String")]
				[h:FinalBonusArray = json.get(diceRolled,"Array")]
			}
		]

		[h:Modifier = json.get(BonusInfo,"Modifier")]
		[h,if(Modifier != "" && Modifier != 1),CODE:{
			[h:Modifier = number(Modifier)]
			[h:FinalBonus = FinalBonus * Modifier]

			[h:isDividingTest = (Modifier < 0)]
			[h,if(isDividingTest): Modifier = (1/Modifier)]
			[h:FinalBonusRules = FinalBonusRules + if(isDividingTest,"/","x") + Modifier]
		};{}]

		[h:maxBonus = json.get(BonusInfo,"Maximum")]
		[h,if(maxBonus != ""): FinalBonus = min(maxBonus,FinalBonus)]
		
		[h:minBonus = json.get(BonusInfo,"Minimum")]
		[h,if(minBonus != ""): FinalBonus = max(minBonus,FinalBonus)]

		[h,if(json.isEmpty(FinalBonusArray)): FinalBonusArray = json.append("",FinalBonus)]
		[h,if(FinalBonusString == ""): FinalBonusString = FinalBonus]
	};
	case "ARRAY":{
		[h:FinalBonus = 0]
		[h:FinalBonusRules = ""]
		[h:FinalBonusArray = "[]"]
		[h:FinalBonusString = ""]
		[h,foreach(bonus,BonusInfo),CODE:{
			[h:thisBonusInfo = pm.a5e.GetBonusValue(bonus,ParentToken)]
			[h:FinalBonus = FinalBonus + json.get(thisBonusInfo,"Value")]
			[h:FinalBonusRules = listAppend(FinalBonusRules,json.get(thisBonusInfo,"Rules")," + ")]
			[h:FinalBonusArray = json.merge(FinalBonusArray,json.get(thisBonusInfo,"Value"))]
			[h:FinalBonusString = listAppend(FinalBonusRules,json.get(thisBonusInfo,"Value")," + ")]
		}]
	}
]

[h:FinalBonusInfo = json.set("",
	"Value",FinalBonus,
	"Rules",FinalBonusRules,
	"Array",FinalBonusArray,
	"String",FinalBonusString
)]
[h:return(0,FinalBonusInfo)]