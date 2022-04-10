[h:ch.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken=json.get(ch.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:ch.Type = json.get(ch.Data,"Type")]
[h:roll1=if(json.get(ch.Data,"PreviousRoll")=="",1d20,json.get(ch.Data,"PreviousRoll"))]
[h:roll2=1d20]

[h:CurrentSkillDisplay = json.get(ch.Data,"Skill")]
[h:CurrentSkill = pm.RemoveSpecial(CurrentSkillDisplay)]
[h,if(json.get(ch.Data,"Alternate")==""),CODE:{
	[h,SWITCH(ch.Type):
		case "Skill": PrimeStat = json.get(json.path.read(getLibProperty("sb.Skills","Lib:pm.a5e.Core"),"[?(@.Name=='"+CurrentSkill+"')]['Attribute']"),0);
		case "Tool": PrimeStat = json.get(json.path.read(getLibProperty("sb.Tools","Lib:pm.a5e.Core"),"[?(@.Name=='"+CurrentSkill+"')]['Attribute']"),0);
		case "Initiative": PrimeStat = "Dexterity";
		default: PrimeStat = "None"
	]
};{
	[h:PrimeStat = pm.RemoveSpecial(json.get(ch.Data,"Alternate"))]
}]

[h,if(CurrentSkill == "NoSkillSelected"),CODE:{
	[h:ProfType = 0]
	[h:ProfBonus = 0]
	[h:ProfTypeStr = ""]
};{
	[h,SWITCH(ch.Type):
		case "Skill": ProfType = json.get(Skills,CurrentSkill);
		case "Tool": ProfType = json.get(Tools,CurrentSkill);
		case "Initiative": ProfType = 0;
		default: ProfType = 0
	]
	[h:roundingMethod = "floor"]
	
	[h:pm.PassiveFunction("CheckProf")]
	
	[h:ProfBonus = eval(roundingMethod+"("+(ProfType*Proficiency)+")")]
	[h,SWITCH(ProfType+""):
		case "0.5": ProfTypeStr = "Half Prof";
		case "1": ProfTypeStr = "Prof";
		case "2": ProfTypeStr = "Exp";
		default: ProfTypeStr = ""
	]
}]

[h,if(PrimeStat=="None"): AtrBonus = 0; AtrBonus = json.get(AtrMods,PrimeStat)]
[h:MiscBonus = if(json.get(ch.Data,"Bonus")=="",0,json.get(ch.Data,"Bonus"))]
[h:MiscBonusStr = json.get(ch.Data,"Bonus")]
[h:pm.PassiveFunction("CheckBonus")]
[h:TotalBonus = MiscBonus + ProfBonus + AtrBonus]

[h,SWITCH(json.get(ch.Data,"Advantage")),CODE:
	case -1: {
		[h,if(json.get(ch.Data,"ForcedAdvantage")),CODE:{
			[h:ch.AdvDis = -1]
		};{
			[h:ch.Adv = 0]
			[h:ch.Dis = 1]
			[h:pm.PassiveFunction("CheckAdv")]
			[h:ch.AdvDis = if(or(and(ch.Dis == 0,ch.Adv == 0),and(ch.Dis !=0,ch.Adv != 0)),0,if(ch.Dis == 0,1,-1))]
		}]
	};
	case 0: {
		[h,if(json.get(ch.Data,"ForcedAdvantage")),CODE:{
			[h:ch.AdvDis = 0]
		};{
			[h:ch.Adv = 0]
			[h:ch.Dis = 0]
			[h:pm.PassiveFunction("CheckAdv")]
			[h:ch.AdvDis = if(or(and(ch.Dis == 0,ch.Adv == 0),and(ch.Dis !=0,ch.Adv != 0)),0,if(ch.Dis == 0,1,-1))]
		}]
	};
	case 1: {
		[h,if(json.get(ch.Data,"ForcedAdvantage")),CODE:{
			[h:ch.AdvDis = 1]
		};{
			[h:ch.Adv = 1]
			[h:ch.Dis = 0]
			[h:pm.PassiveFunction("CheckAdv")]
			[h:ch.AdvDis = if(or(and(ch.Dis == 0,ch.Adv == 0),and(ch.Dis !=0,ch.Adv != 0)),0,if(ch.Dis == 0,1,-1))]
		}]
	};
	default: {
		[h:ch.Adv = 0]
		[h:ch.Dis = 0]
		[h:pm.PassiveFunction("CheckAdv")]
		[h:ch.AdvDis = if(or(and(ch.Dis == 0,ch.Adv == 0),and(ch.Dis !=0,ch.Adv != 0)),0,if(ch.Dis == 0,1,-1))]
	}
]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h,if(ch.AdvDis == 0),CODE:{

	[h,SWITCH(ch.Type),CODE:
		case "Initiative":{
			[h:ch.AdvRerollLink = macroLinkText("Initiative Border@Lib:pm.a5e.Core","self-gm",json.set(ch.Data,"PreviousRoll",roll1,"Advantage",1,"ForcedAdvantage",1),ParentToken)]
			[h:ch.DisRerollLink = macroLinkText("Initiative Border@Lib:pm.a5e.Core","self-gm",json.set(ch.Data,"PreviousRoll",roll1,"Advantage",-1,"ForcedAdvantage",1),ParentToken)]
		};
		default:{
			[h:ch.AdvRerollLink = macroLinkText("Check Reroll@Lib:pm.a5e.Core","self-gm",json.set(ch.Data,"PreviousRoll",roll1,"Advantage",1,"ForcedAdvantage",1),ParentToken)]
			[h:ch.DisRerollLink = macroLinkText("Check Reroll@Lib:pm.a5e.Core","self-gm",json.set(ch.Data,"PreviousRoll",roll1,"Advantage",-1,"ForcedAdvantage",1),ParentToken)]
		}
	]
	
	[h:FinalRoll = roll1]
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSkillDisplay,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(roll1==20,"font-size:2em; color:"+CritColor,if(roll1==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(roll1+TotalBonus)+"</span></b>",
		"RulesContents","1d20"+if(PrimeStat=="None",""," + "+substring(PrimeStat,0,3))+if(ProfTypeStr=="",""," + "+ProfTypeStr)+pm.PlusMinus(MiscBonus,0)+" = ",
		"RollContents",roll1+pm.PlusMinus(AtrBonus,1)+pm.PlusMinus(ProfBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1","Reroll: <a href = '"+ch.AdvRerollLink+"'><span style = 'color:"+LinkColor+"'>Adv.</span></a> / <a href = '"+ch.DisRerollLink+"'><span style = 'color:"+LinkColor+"'>Dis.</span></a>",
		"BonusSectionStyling1",""
		))]
};{
	[h:FinalRoll = if(ch.AdvDis == 1,max(roll1,roll2),min(roll1,roll2))]
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",CurrentSkillDisplay,
		"FalseHeader","",
		"FullContents","<b><span style='"+if(FinalRoll==20,"font-size:2em; color:"+CritColor,if(FinalRoll==1,"font-size:2em; color:"+CritFailColor,"font-size:1.5em"))+"'>"+(FinalRoll+TotalBonus)+"</span></b>",
		"RulesContents","1d20 <span style='color:"+if(ch.AdvDis==1,HealingColor+"'>with Adv",DamageColor+"'>with Dis")+"</span>"+if(PrimeStat=="None",""," + "+substring(PrimeStat,0,3))+if(ProfTypeStr=="",""," + "+ProfTypeStr)+pm.PlusMinus(MiscBonus,0)+" = ",
		"RollContents",FinalRoll+pm.PlusMinus(AtrBonus,1)+pm.PlusMinus(ProfBonus,0)+" = ",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Rules",
		"BonusBody1","(Roll #1: <span style='font-size:1.25em'><b>"+(roll1+TotalBonus)+"</b></span> / Roll #2: <span style='font-size:1.25em'><b>"+(roll2+TotalBonus)+"</b></span>)",
		"BonusSectionStyling1",""
		))]
}]

[h:"<!-- May need to actually move this before the check for purposes of sending consumed resource/condition data to the reroll link -->"]
[h:pm.PassiveFunction("AfterCheck")]
	
[h:macro.return = json.set("","Table",abilityTable,"Value",FinalRoll+TotalBonus)]