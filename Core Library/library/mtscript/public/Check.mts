[h:d20Data = json.set(macro.args,"TestType","Check")]
[h:IsTooltip = 0]
[h:ParentToken = json.get(d20Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Check"]
[h:d20Type = json.get(d20Data,"Type")]
[h:d20ID = json.get(d20Data,"ID")]
[h:d20Data = json.set(d20Data,"OverallType","Check")]

[h:pm.a5e.CheckProperties(d20Data)]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:d20AutoFail = 0]
[h:d20AutoSuccess = 0]
[h:pm.PassiveFunction("CheckAutoResult")]

[h,if(or(d20AutoSuccess,d20AutoFail)),CODE:{
	[h:d20Data = json.set(d20Data,"Value",if(d20AutoSuccess,"AutoSuccess","AutoFailure"))]
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSkillDisplay,
		"FullContents",if(d20AutoSuccess,"<span style='color: "+HealingColor+"; font-size:1.25em'>Automatic Success</span>","<span style='color: "+DamageColor+"; font-size:1.25em'>Automatic Failure</span>"),
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:return(0,json.set(d20Data,"Table",abilityTable))]
};{}]

[h:pm.a5e.d20Roll(d20Data,"Check")]

[h:pm.a5e.CheckBonusTotal(d20Data)]

[h:rollFormula = if(PrimeStat=="None",""," + "+substring(PrimeStat,0,3))+if(ProfTypeStr=="",""," + "+ProfTypeStr)+MiscBonusFormula]
[h:rollString = pm.PlusMinus(AtrBonus,1)+pm.PlusMinus(ProfBonus,0)+MiscBonusStr]

[h,if(d20AdvantageBalance == 0),CODE:{
	[h:FinalRoll = json.get(d20AllRolls,0)]

	[h:d20Data = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"d20Rolls",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"AdvantageMessageArray",d20AdvantageMessageArray,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString,"PrimeStat",PrimeStat)]

	[h,SWITCH(d20Type),CODE:
		case "Initiative":{
			[h:d20AdvRerollLink = macroLinkText("Initiative Border@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",1,"Disadvantage",0,"ForcedAdvantage",1)),ParentToken)]
			[h:d20DisRerollLink = macroLinkText("Initiative Border@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"RerollData",json.set("","Advantage",0,"Disadvantage",1,"ForcedAdvantage",1)),ParentToken)]
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
		"Header",CurrentSkillDisplay,
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

	[h:d20Data = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"d20Rolls",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"AdvantageMessageArray",d20AdvantageMessageArray,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString,"PrimeStat",PrimeStat)]

	[h:extraRollsDisplay = ""]
	[h,foreach(tempRoll,d20AllRolls),CODE:{
		[h:d20ChooseDieLink = macroLinkText("Modifyd20TestBorder@Lib:pm.a5e.Core","self-gm",json.set(d20Data,"ForcedRoll",tempRoll),ParentToken)]
		[h:extraRollsDisplay = listAppend(extraRollsDisplay,"Roll <a href = '"+d20ChooseDieLink+"'><span style = 'color:"+LinkColor+"'; title = 'Use this roll'>#"+(roll.count+1)+"</span></a>: "+tempRoll," / ")]
	}]
	[h:extraRollsDisplay = "("+extraRollsDisplay+")"]
	
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSkillDisplay,
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

[h:pm.PassiveFunction("AfterCheck")]

[h:macro.return = json.set(d20Data,"Table",abilityTable)]