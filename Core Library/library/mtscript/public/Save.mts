[h:sv.Data = macro.args]
[h:IsTooltip = 0]
[h:a5e.GatherAbilities()]
[h:sv.Type = json.get(sv.Data,"Type")]
[h:roll1=if(json.get(sv.Data,"PreviousRoll")=="",1d20,json.get(sv.Data,"PreviousRoll"))]
[h:roll2=1d20]

[h:CurrentSaveDisplay = json.get(sv.Data,"Save")]
[h:CurrentSave = pm.RemoveSpecial(CurrentSaveDisplay)]

[h,SWITCH(sv.Type):
	case "Save": PrimeStat = CurrentSave;
	case "Death": PrimeStat = "None";
	default: PrimeStat = "None"
]

[h,SWITCH(sv.Type):
	case "Save": ProfType = json.get(Saves,CurrentSave);
	case "Death": ProfType = 0;
	default: ProfType = 0
]

[h:pm.PassiveFunction("SaveProf")]

[h:ProfBonus = ProfType*Proficiency]
[h,SWITCH(ProfType+""):
	case "0.5": ProfTypeStr = "Half Prof";
	case "1": ProfTypeStr = "Prof";
	case "2": ProfTypeStr = "Exp";
	default: ProfTypeStr = ""
]

[h,if(PrimeStat=="None"): AtrBonus = 0; AtrBonus = json.get(AtrMods,PrimeStat)]
[h:MiscBonus = if(json.get(sv.Data,"Bonus")=="",0,json.get(sv.Data,"Bonus"))]
[h:MiscBonusStr = json.get(sv.Data,"Bonus")]
[h:pm.PassiveFunction("SaveBonus")]
[h:TotalBonus = MiscBonus + ProfBonus + AtrBonus]

[h,SWITCH(json.get(sv.Data,"Advantage")),CODE:
	case -1: {
		[h,if(json.get(sv.Data,"ForcedAdvantage")),CODE:{
			[h:sv.AdvDis = -1]
		};{
			[h:sv.Adv = 0]
			[h:sv.Dis = 1]
			[h:pm.PassiveFunction("SaveAdv")]
			[h:sv.AdvDis = if(or(and(sv.Dis == 0,sv.Adv == 0),and(sv.Dis !=0,sv.Adv != 0)),0,if(sv.Dis == 0,1,-1))]
		}]
	};
	case 0: {
		[h,if(json.get(sv.Data,"ForcedAdvantage")),CODE:{
			[h:sv.AdvDis = 0]
		};{
			[h:sv.Adv = 0]
			[h:sv.Dis = 0]
			[h:pm.PassiveFunction("SaveAdv")]
			[h:sv.AdvDis = if(or(and(sv.Dis == 0,sv.Adv == 0),and(sv.Dis !=0,sv.Adv != 0)),0,if(sv.Dis == 0,1,-1))]
		}]
	};
	case 1: {
		[h,if(json.get(sv.Data,"ForcedAdvantage")),CODE:{
			[h:sv.AdvDis = 1]
		};{
			[h:sv.Adv = 1]
			[h:sv.Dis = 0]
			[h:pm.PassiveFunction("SaveAdv")]
			[h:sv.AdvDis = if(or(and(sv.Dis == 0,sv.Adv == 0),and(sv.Dis !=0,sv.Adv != 0)),0,if(sv.Dis == 0,1,-1))]
		}]
	};
	default: {
		[h:sv.Adv = 0]
		[h:sv.Dis = 0]
		[h:pm.PassiveFunction("SaveAdv")]
		[h:sv.AdvDis = if(or(and(sv.Dis == 0,sv.Adv == 0),and(sv.Dis !=0,sv.Adv != 0)),0,if(sv.Dis == 0,1,-1))]
	}
]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h,if(sv.AdvDis == 0),CODE:{

	[h,SWITCH(sv.Type),CODE:
		case "Death":{
			[h:sv.AdvRerollLink = macroLinkText("Death Save@Lib:pm.a5e.Core","self-gm",json.set(sv.Data,"PreviousRoll",roll1,"Advantage",1,"ForcedAdvantage",1),json.get(sv.Data,"ParentToken"))]
			[h:sv.DisRerollLink = macroLinkText("Death Save@Lib:pm.a5e.Core","self-gm",json.set(sv.Data,"PreviousRoll",roll1,"Advantage",-1,"ForcedAdvantage",1),json.get(sv.Data,"ParentToken"))]
		};
		default:{
			[h:sv.AdvRerollLink = macroLinkText("Save Reroll@Lib:pm.a5e.Core","self-gm",json.set(sv.Data,"PreviousRoll",roll1,"Advantage",1,"ForcedAdvantage",1),json.get(sv.Data,"ParentToken"))]
			[h:sv.DisRerollLink = macroLinkText("Save Reroll@Lib:pm.a5e.Core","self-gm",json.set(sv.Data,"PreviousRoll",roll1,"Advantage",-1,"ForcedAdvantage",1),json.get(sv.Data,"ParentToken"))]
		}
	]
	
	[h:FinalRoll = roll1]
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSaveDisplay,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(roll1==20,"font-size:2em; color:"+CritColor,if(roll1==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(roll1+TotalBonus)+"</span></b>",
		"RulesContents","1d20"+if(PrimeStat=="None",""," + "+substring(PrimeStat,0,3))+if(ProfTypeStr=="",""," + "+ProfTypeStr)+pm.PlusMinus(MiscBonus,0)+" = ",
		"RollContents",roll1+pm.PlusMinus(AtrBonus,1)+pm.PlusMinus(ProfBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1","Reroll: <a href = '"+sv.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+sv.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>",
		"BonusSectionStyling1","text-align:center"
		))]
};{
	[h:FinalRoll = if(sv.AdvDis == 1,max(roll1,roll2),min(roll1,roll2))]
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSaveDisplay,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(FinalRoll==20,"font-size:2em; color:"+CritColor,if(FinalRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(FinalRoll+TotalBonus)+"</span></b>",
		"RulesContents","1d20 <span style='color:"+if(sv.AdvDis==1,HealingColor+"'>with Adv",DamageColor+"'>with Dis")+"</span>"+if(PrimeStat=="None",""," + "+substring(PrimeStat,0,3))+if(ProfTypeStr=="",""," + "+ProfTypeStr)+pm.PlusMinus(MiscBonus,0)+" = ",
		"RollContents",FinalRoll+pm.PlusMinus(AtrBonus,1)+pm.PlusMinus(ProfBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1","(Roll 1: <span style='font-size:1.25em'><b>"+(roll1+TotalBonus)+"</b></span> / Roll 2: <span style='font-size:1.25em'><b>"+(roll2+TotalBonus)+"</b></span>)",
		"BonusSectionStyling1","text-align:center"
		))]
}]

[h:"<!-- May need to actually move this before the check for purposes of sending consumed resource/condition data to the reroll link -->"]
[h:pm.PassiveFunction("AfterSave")]
	
[h:macro.return = json.set("","Table",abilityTable,"Value",FinalRoll+TotalBonus,"FinalRoll",FinalRoll)]