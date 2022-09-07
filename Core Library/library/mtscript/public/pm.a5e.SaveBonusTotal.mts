[h:d20Data = arg(0)]

[h:CurrentSaveDisplay = json.get(d20Data,"Save")]
[h:CurrentSave = pm.RemoveSpecial(CurrentSaveDisplay)]

[h:d20Type = json.get(d20Data,"Type")]
[h,SWITCH(d20Type):
	case "Save": PrimeStat = CurrentSave;
	case "Concentration": PrimeStat = "Constitution";
	case "Death": PrimeStat = "None";
	default: PrimeStat = "None"
]

[h,SWITCH(d20Type):
	case "Save": ProfType = json.get(Saves,CurrentSave);
	case "Concentration": ProfType = json.get(Saves,"Constitution");
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
[h:MiscBonus = if(json.get(d20Data,"Bonus")=="",0,json.get(d20Data,"Bonus"))]
[h:MiscBonusStr = json.get(d20Data,"Bonus")]
[h:MiscBonusFormula = if(json.get(d20Data,"Bonus")=="","",pm.PlusMinus(json.get(d20Data,"Bonus"),0))]

[h:pm.PassiveFunction("SaveBonus")]

[h:TotalBonus = MiscBonus + ProfBonus + AtrBonus]