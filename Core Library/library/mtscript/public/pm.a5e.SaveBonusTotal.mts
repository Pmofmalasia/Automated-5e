[h:d20Data = arg(0)]

[h:d20Type = json.get(d20Data,"Type")]
[h:CurrentSave = json.get(d20Data,"Save")]
[h,SWITCH(d20Type),CODE:
	case "Save": {
		[h:CurrentSaveDisplay = pm.GetDisplayName(CurrentSave,"sb.Attributes")]
		[h:ProfType = json.get(getProperty("a5e.stat.Saves"),CurrentSave)]
	};
	case "Concentration": {
		[h:CurrentSaveDisplay = "Concentration"]
		[h:ProfType = json.get(getProperty("a5e.stat.Saves"),"Constitution")]
	};
	case "Death": {
		[h:CurrentSaveDisplay = "Death"]
		[h:ProfType = 0]
	};
	default: {
		[h:CurrentSaveDisplay = CurrentSave]
		[h:ProfType = 0]
	}
]
[h:roundingMethod = "floor"]

[h:pm.PassiveFunction("SaveProf")]

[h:ProfBonus = eval(roundingMethod+"("+(ProfType*getProperty("a5e.stat.Proficiency"))+")")]
[h,SWITCH(ProfType+""):
	case "0.5": ProfTypeStr = "Half Prof";
	case "1": ProfTypeStr = "Prof";
	case "2": ProfTypeStr = "Exp";
	default: ProfTypeStr = ""
]

[h,if(PrimeStat=="None"): AtrBonus = 0; AtrBonus = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
[h:MiscBonus = if(json.get(d20Data,"Bonus")=="",0,json.get(d20Data,"Bonus"))]
[h:MiscBonusStr = pm.PlusMinus(MiscBonus,0)]
[h:MiscBonusFormula = pm.PlusMinus(MiscBonus,0)]

[h:pm.PassiveFunction("SaveBonus")]

[h:TotalBonus = MiscBonus + ProfBonus + AtrBonus]