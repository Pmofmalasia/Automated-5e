[h:d20Data = arg(0)]

[h:CurrentSaveDisplay = json.get(d20Data,"Save")]
[h:CurrentSave = pm.RemoveSpecial(CurrentSaveDisplay)]

[h:d20Type = json.get(d20Data,"Type")]

[h,SWITCH(d20Type):
	case "Save": ProfType = json.get(getProperty("a5e.stat.Saves"),CurrentSave);
	case "Concentration": ProfType = json.get(getProperty("a5e.stat.Saves"),"Constitution");
	case "Death": ProfType = 0;
	default: ProfType = 0
]

[h:pm.PassiveFunction("SaveProf")]

[h:ProfBonus = ProfType*getProperty("a5e.stat.Proficiency")]
[h,SWITCH(ProfType+""):
	case "0.5": ProfTypeStr = "Half Prof";
	case "1": ProfTypeStr = "Prof";
	case "2": ProfTypeStr = "Exp";
	default: ProfTypeStr = ""
]

[h,if(PrimeStat=="None"): AtrBonus = 0; AtrBonus = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
[h:MiscBonus = if(json.get(d20Data,"Bonus")=="",0,json.get(d20Data,"Bonus"))]
[h:MiscBonusStr = json.get(d20Data,"Bonus")]
[h,if(json.get(d20Data,"Bonus")==""): 
	MiscBonusFormula = "";
	pm.PlusMinus(json.get(d20Data,"Bonus"),0)
]

[h:pm.PassiveFunction("SaveBonus")]

[h:TotalBonus = MiscBonus + ProfBonus + AtrBonus]