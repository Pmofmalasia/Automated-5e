[h:SpellCoreData = macro.args]
[h:json.toVars(SpellCoreData)]

[h:durationInfo = "{}"]
[h,switch(spellDuration),CODE:
	case "Instantaneous":{
		[h:DurationString = "Instantaneous"]
	};
	case "1 Round":{
		[h:durationInfo = json.set("","Value",1,"Units","Round")]
	};
	case "1 Minute":{
		[h:durationInfo = json.set("","Value",1,"Units","Minute")]
	};
	case "10 Minutes":{
		[h:durationInfo = json.set("","Value",10,"Units","Minute")]
	};
	case "1 Hour":{
		[h:durationInfo = json.set("","Value",1,"Units","Hour")]
	};
	case "8 Hours":{
		[h:durationInfo = json.set("","Value",8,"Units","Hour")]
	};
	case "24 Hours":{
		[h:durationInfo = json.set("","Value",24,"Units","Hour")]
	};
	case "10 Days":{
		[h:durationInfo = json.set("","Value",10,"Units","Day")]
	};
	case "Until Dispelled":{
		[h:DurationString = "Until Dispelled"]
	};
	case "Custom":{
		[h:durationInfo = json.set("","Value",customCastTimeValue,"Units",customCastTimeUnits)]
	};
	default:{
		[h:durationInfo = json.set("","Value",previousCustomDurationValue,"Units",previousCustomDurationUnits)]
	}
]

[h:castTimeInfo = "{}"]
[h,switch(castTime),CODE:
	case "Action":{
		[h:castTimeInfo = json.set("","Value",1,"Units","Action")]
	};
	case "Bonus Action":{
		[h:castTimeInfo = json.set("","Value",1,"Units","Bonus Action")]
	};
	case "Reaction":{
		[h:castTimeInfo = json.set("","Value",1,"Units","Reaction")]
	};
	case "1 Minute":{
		[h:castTimeInfo = json.set("","Value",1,"Units","Minute")]
	};
	case "10 Minutes":{
		[h:castTimeInfo = json.set("","Value",10,"Units","Minute")]
	};
	case "1 Hour":{
		[h:castTimeInfo = json.set("","Value",1,"Units","Hour")]
	};
	case "8 Hours":{
		[h:castTimeInfo = json.set("","Value",8,"Units","Hour")]
	};
	case "12 Hours":{
		[h:castTimeInfo = json.set("","Value",12,"Units","Hour")]
	};
	case "24 Hours":{
		[h:castTimeInfo = json.set("","Value",24,"Units","Hour")]
	};
	case "Custom":{
		[h:abort(input(
			" throwaway | -------------- Custom Casting Time Info -------------- |  | LABEL | SPAN=TRUE",
			" castTimeValue |  | Casting Time ",
			" castTimeUnits | Action,Bonus Action,Reaction,Round,Minute,Hour,Day,Year | Casting Time Units | LIST "
		))]
		[h:castTimeInfo = json.set("","Value",durationValue,"Units",durationUnits)]
	};
	default:{
		[h:castTimeInfo = sDuration]
	}
]