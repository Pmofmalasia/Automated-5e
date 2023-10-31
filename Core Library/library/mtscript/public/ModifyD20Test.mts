[h:d20Data = macro.args]
[h:IsTooltip = number(json.get(d20Data,"IsTooltip"))]
[h:ParentToken = json.get(d20Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:d20Type = json.get(d20Data,"Type")]
[h:d20TestType = json.get(d20Data,"TestType")]
[h:pm.a5e.OverarchingContext = d20TestType]
[h:PrimeStat = json.get(d20Data,"PrimeStat")]
[h:d20ID = json.get(d20Data,"ID")]

[h,switch(d20TestType),CODE:
	case "Check":{
		[h:pm.a5e.CheckProperties(d20Data)]
		[h:d20RollHeader = CurrentSkillDisplay]
	};
	case "Save":{
		[h,SWITCH(d20Type),CODE:
			case "Save": {
				[h:CurrentSaveDisplay = pm.GetDisplayName(CurrentSave,"sb.Attributes")]
				[h:PrimeStat = CurrentSave]
			};
			case "Concentration": {
				[h:CurrentSaveDisplay = "Concentration"]
				[h:PrimeStat = "Constitution"]
			};
			case "Death": {
				[h:CurrentSaveDisplay = "Death"]
				[h:PrimeStat = "None"]
			};
			default: {
				[h:CurrentSaveDisplay = CurrentSave]
				[h:PrimeStat = "None"]
			}
		]
		[h:d20RollHeader = CurrentSaveDisplay]
	};
	case "Attack":{
		[h:d20RollHeader = "Attack Roll"]
	}
]

[h:RerollData = json.get(d20Data,"RerollData")]
[h:isNewBonus = json.get(d20Data,"NewBonus")]
[h:ForcedRoll = json.get(d20Data,"ForcedRoll")]
[h:rollFormula = json.get(d20Data,"Formula")]
[h:rollString = json.get(d20Data,"RollString")]

[h,if(ForcedRoll == ""),CODE:{
    [h,if(RerollData == ""),CODE:{
		[h:d20AllRolls = json.get(d20Data,"d20Rolls")]
		[h:d20TotalRolled = json.length(d20AllRolls)]
		[h:d20Advantage = json.get(d20Data,"Advantage")]
		[h:d20Disadvantage = json.get(d20Data,"Disadvantage")]
		[h:d20AdvantageBalance = if(or(and(d20Disadvantage == 0,d20Advantage == 0),and(d20Disadvantage !=0,d20Advantage != 0)),0,if(d20Disadvantage == 0,1,-1))]
    };{
		[h:d20Data = pm.a5e.d20TestRerollDataProcessing(d20Data,RerollData)]
        [h:pm.a5e.d20Roll(d20Data)]
    }]
};{
    [h:d20AllRolls = json.append("",ForcedRoll)]
    [h:d20TotalRolled = 1]
    [h:d20Advantage = 0]
    [h:d20Disadvantage = 0]
    [h:d20AdvantageBalance = 0]
}]

[h,if(isNewBonus == ""),CODE:{
	[h:TotalBonus = json.get(d20Data,"TotalBonus")]
};{
    [h,if(json.type(isNewBonus)=="UNKNOWN"),CODE:{
		[h,if(isNumber(isNewBonus)):
			newBonus = isNewBonus;
			newBonus = json.get(getProperty("a5e.stat.AtrMods"),isNewBonus)
		]
        [h,if(isNumber(isNewBonus)):
			rollFormula = json.get(d20Data,"Formula") + pm.PlusMinus(newBonus,1);
			rollFormula = json.get(d20Data,"Formula") + " + " + substring(isNewBonus,0,3)
		]
    };{
        [h:newBonus = json.get(isNewBonus,"Value")]
        [h:rollFormula = json.get(d20Data,"Formula")+" + "+json.get(isNewBonus,"Formula")]
    }]
	[h:rollString = json.get(d20Data,"RollString") + pm.PlusMinus(newBonus,1)]
	[h:TotalBonus = json.get(d20Data,"TotalBonus") + newBonus]
}]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h,if(d20AdvantageBalance == 0),CODE:{
	[h:FinalRoll = json.get(d20AllRolls,0)]

	[h:d20Data = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"d20Rolls",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString)]
	
	[h,SWITCH(d20Type),CODE:
		case "Initiative":{
			[h:d20AdvRerollLink = macroLinkText("Initiative Border@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",1,"Disadvantage",0,"ForcedAdvantage",1)),ParentToken)]
			[h:d20DisRerollLink = macroLinkText("Initiative Border@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",0,"Disadvantage",1,"ForcedAdvantage",1)),ParentToken)]
		};
		case "Death":{
			[h:d20AdvRerollLink = macroLinkText("Death Save Border@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",1,"Disadvantage",0,"ForcedAdvantage",1)),ParentToken)]
			[h:d20DisRerollLink = macroLinkText("Death Save Border@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",0,"Disadvantage",1,"ForcedAdvantage",1)),ParentToken)]
		};
		default:{
			[h:d20AdvRerollLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",1,"Disadvantage",0,"ForcedAdvantage",1)),ParentToken)]
			[h:d20DisRerollLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",0,"Disadvantage",1,"ForcedAdvantage",1)),ParentToken)]
		}
	]

	[h:extraRollsDisplay = ""]
	[h,foreach(tempRoll,d20AllRolls),CODE:{
		[h:d20ChooseDieLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"ForcedRoll",tempRoll),ParentToken)]
		[h,if(d20TotalRolled == 1):
			extraRollsDisplay = "Reroll: <a href = '"+d20AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+d20DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>";
			extraRollsDisplay = listAppend(extraRollsDisplay,"Roll <a href = '"+d20ChooseDieLink+"'><span style = 'color:"+LinkColor+"'; title = 'Use this roll'>#"+(roll.count+1)+"</span></a>: "+tempRoll," / ")
		]
	}]

	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",d20RollHeader,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(FinalRoll==20,"font-size:2em; color:"+CritColor,if(FinalRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(FinalRoll+TotalBonus)+"</span></b>",
		"RulesContents",d20TotalRolled+"d20"+if(d20TotalRolled>1," choose one ","")+rollFormula+" = ",
		"RollContents",FinalRoll+rollString+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1",extraRollsDisplay,
		"BonusSectionStyling1",""
	))]
};{
	[h:FinalRoll = if(d20AdvantageBalance == 1,math.arrayMax(d20AllRolls),math.arrayMin(d20AllRolls))]

	[h:d20Data = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"d20Rolls",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"AdvantageMessageArray",d20AdvantageMessageArray,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString,"PrimeStat",PrimeStat)]

	[h:extraRollsDisplay = ""]
	[h,foreach(tempRoll,d20AllRolls),CODE:{
		[h:d20ChooseDieLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"ForcedRoll",tempRoll),ParentToken)]
		[h:extraRollsDisplay = listAppend(extraRollsDisplay,"Roll <a href = '"+d20ChooseDieLink+"'><span style = 'color:"+LinkColor+"'; title = 'Use this roll'>#"+(roll.count+1)+"</span></a>: "+tempRoll," / ")]
	}]
	[h:extraRollsDisplay = "("+extraRollsDisplay+")"]
	
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",d20RollHeader,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(FinalRoll==20,"font-size:2em; color:"+CritColor,if(FinalRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(FinalRoll+TotalBonus)+"</span></b>",
		"RulesContents","1d20 <span style='color:"+if(d20AdvantageBalance==1,HealingColor+"'>with Adv",DamageColor+"'>with Dis")+"</span>"+rollFormula+" = ",
		"RollContents",FinalRoll+rollString+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1",extraRollsDisplay,
		"BonusSectionStyling1",""
	))]
}]

[h:pm.PassiveFunction("After"+d20TestType)]
[h,if(d20TestType == "Attack"),CODE:{
	[h,if(json.contains(d20Data,"WeaponData")): pm.PassiveFunction("After"+d20TestType)]
};{}]

[h:macro.return = json.set(d20Data,"Table",abilityTable)]