[h:d20Data = arg(0)]
[h:d20Type = json.get(d20Data,"Type")]

[h:CurrentSkillDisplay = json.get(d20Data,"Skill")]
[h:CurrentSkill = pm.RemoveSpecial(CurrentSkillDisplay)]
[h,if(json.get(d20Data,"Alternate")==""),CODE:{
	[h,SWITCH(d20Type):
		case "Ability Score": PrimeStat = CurrentSkill;
		case "Skill": PrimeStat = json.get(json.path.read(getLibProperty("sb.Skills","Lib:pm.a5e.Core"),"[?(@.Name=='"+CurrentSkill+"')]['Attribute']"),0);
		case "Tool": PrimeStat = json.get(json.path.read(getLibProperty("sb.Tools","Lib:pm.a5e.Core"),"[?(@.Name=='"+CurrentSkill+"')]['Attribute']"),0);
		case "Initiative": PrimeStat = "Dexterity";
		default: PrimeStat = "None"
	]
};{
	[h:PrimeStat = pm.RemoveSpecial(json.get(d20Data,"Alternate"))]
}]

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