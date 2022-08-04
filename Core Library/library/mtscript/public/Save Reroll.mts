[h:d20Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(d20Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Save"]
[h:d20Type = json.get(d20Data,"Type")]
[h:d20ID = json.get(d20Data,"ID")]
[h:CurrentSaveDisplay = json.get(d20Data,"Save")]

[h:pm.a5e.d20Roll(d20Data)]

[h:TotalBonus = json.get(d20Data,"TotalBonus")]

[h:rollFormula = json.get(d20Data,"Formula")]
[h:rollString = json.get(d20Data,"RollString")]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h,if(d20AdvantageBalance == 0),CODE:{
	[h:"<!-- Will need to add concentration to the list, once the updated macro is made -->"]
	[h:FinalRoll = json.get(d20AllRolls,0)]

	[h:rerollData = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"PreviousRoll",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString)]
	
	[h,SWITCH(d20Type),CODE:
		case "Death":{
			[h:d20AdvRerollLink = macroLinkText("Death Save Border@Lib:pm.a5e.Core","self-gm",json.set(rerollData,"Advantage",1,"Disadvantage",0,"ForcedAdvantage",1),ParentToken)]
			[h:d20DisRerollLink = macroLinkText("Death Save Border@Lib:pm.a5e.Core","self-gm",json.set(rerollData,"Advantage",0,"Disadvantage",1,"ForcedAdvantage",1),ParentToken)]
		};
		default:{
			[h:d20AdvRerollLink = macroLinkText("Save Reroll@Lib:pm.a5e.Core","self-gm",json.set(rerollData,"Advantage",1,"Disadvantage",0,"ForcedAdvantage",1),ParentToken)]
			[h:d20DisRerollLink = macroLinkText("Save Reroll@Lib:pm.a5e.Core","self-gm",json.set(rerollData,"Advantage",0,"Disadvantage",1,"ForcedAdvantage",1),ParentToken)]
		}
	]

	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSaveDisplay,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(FinalRoll==20,"font-size:2em; color:"+CritColor,if(FinalRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(FinalRoll+TotalBonus)+"</span></b>",
		"RulesContents",d20RolledNum+"d20"+if(d20RolledNum>1," choose one ","")+rollFormula+" = ",
		"RollContents",FinalRoll+rollString+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1","Reroll: <a href = '"+d20AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+d20DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>",
		"BonusSectionStyling1",""
	))]
};{
	[h:FinalRoll = if(d20AdvantageBalance == 1,math.arrayMax(d20AllRolls),math.arrayMin(d20AllRolls))]

	[h:rerollData = json.set(d20Data,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"PreviousRoll",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"TotalBonus",TotalBonus,"Formula",rollFormula,"RollString",rollString)]

	[h:extraRollsDisplay = ""]
	[h,foreach(tempRoll,d20AllRolls): extraRollsDisplay = listAppend(extraRollsDisplay,"Roll #"+(roll.count+1)+": "+tempRoll," / ")]
	[h:extraRollsDisplay = "("+extraRollsDisplay+")"]
	
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSaveDisplay,
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

[h:pm.PassiveFunction("AfterSave")]

[h:macro.return = json.set("","Table",abilityTable,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll,"PreviousRoll",d20AllRolls,"Advantage",d20Advantage,"Disadvantage",d20Disadvantage,"TotalBonus",TotalBonus,"ID",d20ID)]