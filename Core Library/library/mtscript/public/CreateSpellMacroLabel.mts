[h:Spell = macro.args]

[h:SpellData = pm.a5e.GetSpecificSpell(Spell)]
[h:FirstEffect = json.get(json.get(SpellData,"Effects"),0)]
[h:CastTimeUnits = json.get(json.get(FirstEffect,"UseTime"),"Units")]
[h:CastTimeValue = json.get(json.get(FirstEffect,"UseTime"),"Value")]
[h,switch(lower(CastTimeUnits)):
	case "": CastTimeNote = "";
	case "action": CastTimeNote = "";
	case "bonus action": CastTimeNote = "BONUS";
	case "reaction": CastTimeNote = "REACTION";
	case "minute": CastTimeNote = CastTimeValue+" MIN";
	case "hour": CastTimeNote = CastTimeValue+" HOUR";
	case "day": CastTimeNote = CastTimeValue+" DAY";
	default: CastTimeNote = CastTimeValue+" "+CastTimeUnits
]

[h,if(CastTimeNote != ""): CastTimeNote = " <b>("+CastTimeNote+")</b>"]

[h:macro.return = json.get(SpellData,"DisplayName")+" ("+json.get(SpellData,"Level")+")"+CastTimeNote]