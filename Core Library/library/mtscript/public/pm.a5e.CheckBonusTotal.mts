[h:d20Data = arg(0)]
[h:d20Type = json.get(d20Data,"Type")]

[h,if(CurrentSkill == "NoSkillSelected"),CODE:{
	[h:ProfType = 0]
	[h:ProfBonus = 0]
	[h:ProfTypeStr = ""]
};{
	[h,SWITCH(d20Type):
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
[h:MiscBonus = if(json.get(d20Data,"Bonus")=="",0,json.get(d20Data,"Bonus"))]
[h:MiscBonusStr = json.get(d20Data,"Bonus")]
[h:MiscBonusFormula = if(json.get(d20Data,"Bonus")=="","",pm.PlusMinus(json.get(d20Data,"Bonus"),0))]

[h:pm.PassiveFunction("CheckBonus")]

[h:TotalBonus = MiscBonus + ProfBonus + AtrBonus]