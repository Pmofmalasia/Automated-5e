[h:sv.Data = arg(0)]

[h:CurrentSaveDisplay = json.get(sv.Data,"Save")]
[h:CurrentSave = pm.RemoveSpecial(CurrentSaveDisplay)]

[h:sv.Type = json.get(sv.Data,"Type")]
[h,SWITCH(sv.Type):
	case "Save": PrimeStat = CurrentSave;
	case "Concentration": PrimeStat = "Constitution";
	case "Death": PrimeStat = "None";
	default: PrimeStat = "None"
]

[h,SWITCH(sv.Type):
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
[h:MiscBonus = if(json.get(sv.Data,"Bonus")=="",0,json.get(sv.Data,"Bonus"))]
[h:MiscBonusStr = json.get(sv.Data,"Bonus")]
[h:pm.PassiveFunction("SaveBonus")]
[h:TotalBonus = MiscBonus + ProfBonus + AtrBonus]