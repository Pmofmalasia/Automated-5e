[h:d20Data = json.set(macro.args,"TestType","Save")]
[h:IsTooltip = 0]
[h:ParentToken = json.get(d20Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Save"]
[h:d20Type = json.get(d20Data,"Type")]
[h:d20ID = json.get(d20Data,"ID")]
[h:d20Data = json.set(d20Data,"OverallType","Save")]

[h,if(d20ID != ""),CODE:{
	[h:d20ThisEffect = json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+d20ID+")]")]
	[h,if(json.isEmpty(d20ThisEffect)):
		d20ThisEffect = json.set("","ToResolve","{}");
		d20ThisEffect = json.get(d20ThisEffect,0)
	]
};{
	[h:d20ThisEffect = json.set("","ToResolve","{}")]
}]

[h:CurrentSave = json.get(d20Data,"Save")]
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

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:d20AutoFail = 0]
[h:d20AutoSuccess = 0]
[h:pm.PassiveFunction("SaveAutoResult")]

[h,if(or(d20AutoSuccess,d20AutoFail)),CODE:{
	[h:d20Data = json.set(d20Data,"Value",if(d20AutoSuccess,"AutoSuccess","AutoFailure"))]
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSaveDisplay,
		"FullContents",if(d20AutoSuccess,"<span style='color: "+HealingColor+"; font-size:1.25em'>Automatic Success</span>","<span style='color: "+DamageColor+"; font-size:1.25em'>Automatic Failure</span>"),
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:return(0,json.set(d20Data,"Table",abilityTable))]
};{}]

[h:pm.a5e.d20Roll(d20Data,"Save")]

[h:pm.a5e.SaveBonusTotal(d20Data)]

[h:rollFormula = if(PrimeStat=="None",""," + "+substring(PrimeStat,0,3))+if(ProfTypeStr=="",""," + "+ProfTypeStr)+MiscBonusFormula]
[h:rollString = pm.PlusMinus(AtrBonus,1)+pm.PlusMinus(ProfBonus,0)+MiscBonusStr]

[h,if(d20AdvantageBalance == 0),CODE:{
	[h:"<!-- Will need to add concentration to the list, once the updated macro is made -->"]
	[h:FinalRoll = json.get(d20AllRolls,0)]

	[h:d20Data = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"d20Rolls",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"AdvantageMessageArray",d20AdvantageMessageArray,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString,"PrimeStat",PrimeStat)]
	
	[h,SWITCH(d20Type),CODE:
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
		"Header",CurrentSaveDisplay,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(FinalRoll==20,"font-size:2em; color:"+CritColor,if(FinalRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(FinalRoll+TotalBonus)+"</span></b>",
		"RulesContents","<span "+if(!json.isEmpty(d20AdvantageMessageArray),"title='"+pm.a5e.CreateDisplayList(d20AdvantageMessageArray,"and")+"'","")+">"+d20TotalRolled+"d20"+if(d20TotalRolled>1," choose one ","")+rollFormula+"</span> = ",
		"RollContents",FinalRoll+rollString+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1",extraRollsDisplay,
		"BonusSectionStyling1",""
	))]
};{
	[h:FinalRoll = if(d20AdvantageBalance == 1,math.arrayMax(d20AllRolls),math.arrayMin(d20AllRolls))]

	[h:d20Data = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"d20Rolls",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString,"PrimeStat",PrimeStat)]

	[h:extraRollsDisplay = ""]
	[h,foreach(tempRoll,d20AllRolls),CODE:{
		[h:d20ChooseDieLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"ForcedRoll",tempRoll),ParentToken)]
		[h:extraRollsDisplay = listAppend(extraRollsDisplay,"Roll <a href = '"+d20ChooseDieLink+"'><span style = 'color:"+LinkColor+"'; title = 'Use this roll'>#"+(roll.count+1)+"</span></a>: "+tempRoll," / ")]
	}]
	[h:extraRollsDisplay = "("+extraRollsDisplay+")"]
	
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSaveDisplay,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(FinalRoll==20,"font-size:2em; color:"+CritColor,if(FinalRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(FinalRoll+TotalBonus)+"</span></b>",
		"RulesContents","1d20 <span"+if(!json.isEmpty(d20AdvantageMessageArray)," title='"+pm.a5e.CreateDisplayList(d20AdvantageMessageArray,"and")+"'","")+" style='color:"+if(d20AdvantageBalance==1,HealingColor+"'>with Adv",DamageColor+"'>with Dis")+"</span>"+rollFormula+" = ",
		"RollContents",FinalRoll+rollString+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1",extraRollsDisplay,
		"BonusSectionStyling1",""
	))]
}]

[h:pm.PassiveFunction("AfterSave")]

[h:macro.return = json.set(d20Data,"Table",abilityTable)]