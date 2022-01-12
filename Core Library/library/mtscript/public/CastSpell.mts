[h:slot=0]
[h:Rit=0]
[h:minSlotList=json.get(macro.args, "MinSlot")-1]
<!--example incoming macro args
	"SpellName", "Cure Wounds",
	"MinSlot", 1,
	"Type", "evocation",
	"Ritual", 0,
	"CastTime", "1 Action",
	"Range", "Touch",
	"Target", "1 Creature",
	"Components", "V, S",
	"Duration", "Instantaneous",
	"Concentration", 0,
	"VariableSlot", 1
-->

<!--input window-->
<!--to do: make the input window variable (remove spell selection if spell can't be variable, etc.)-->
[if(json.get(macro.args, "Concentration") == 1), code:{
	[h:ConcLabel="Yes"]
	};{[h:ConcLabel="No"]
}]

[if(json.get(macro.args, "VariableSlot") == 1), code:{
	[h:VarSlot=1][h:slot=(json.get(macro.args, "MinSlot"))]
	};{[h:VarSlot=0]
}]

[if(json.get(macro.args, "Ritual") == 1), code:{
	[h:RitualLabel="Yes"]
	};{[h:RitualLabel="No"]
}]

[if(VarSlot == 1), code:
{
[h:status = input(
	"junkVar|"+json.get(macro.args, "SpellName")+"|Spell Name|LABEL",
	"junkVar|"+json.get(macro.args, "MinSlot")+"|Spell Level|LABEL",
	"junkVar|"+json.get(macro.args, "Type")+"|Spell Type|LABEL",
	"junkVar|"+json.get(macro.args, "CastTime")+"|Casting Time|LABEL",
	"junkVar|"+json.get(macro.args, "Range")+"|Range|LABEL",
	"junkVar|"+json.get(macro.args, "Target")+"|Target(s)|LABEL",
	"junkVar|"+json.get(macro.args, "Components")+"|Component|LABEL",
	"junkVar|"+json.get(macro.args, "Duration")+"|Duration|LABEL",
	"junkVar|"+ConcLabel+"|Requires Concentration?|LABEL",
	"slot|1,2,3,4,5,6,7,8,9|Level spell slot used?|LIST|SELECT="+minSlotList
	)]
[h:slot=slot+1]
[h,if(slot < (minSlotList+1)): slot=(minSlotList+1);slot=slot]
[h:abort(status)]
};{
	[if(RitualLabel == "Yes"), code:
	{
	[h:status = input(
		"junkVar|"+json.get(macro.args, "SpellName")+"|Spell Name|LABEL",
		"junkVar|"+json.get(macro.args, "MinSlot")+"|Spell Level|LABEL",
		"junkVar|"+json.get(macro.args, "Type")+"|Spell Type|LABEL",
		"junkVar|"+json.get(macro.args, "CastTime")+"|Casting Time|LABEL",
		"junkVar|"+json.get(macro.args, "Range")+"|Range|LABEL",
		"junkVar|"+json.get(macro.args, "Target")+"|Target(s)|LABEL",
		"junkVar|"+json.get(macro.args, "Components")+"|Component|LABEL",
		"junkVar|"+json.get(macro.args, "Duration")+"|Duration|LABEL",
		"junkVar|"+ConcLabel+"|Requires Concentration?|LABEL",
		"Rit|no,yes|Are you casting as a ritual?|LIST|SELECT=0")]
	[h:Slot=(minSlotList+1)]
	[h,if(Rit == 1): Slot=0;Slot=Slot]
	[h:abort(status)]
	};{
	[h:status = input(
		"junkVar|"+json.get(macro.args, "SpellName")+"|Spell Name|LABEL",
		"junkVar|"+json.get(macro.args, "MinSlot")+"|Spell Level|LABEL",
		"junkVar|"+json.get(macro.args, "Type")+"|Spell Type|LABEL",
		"junkVar|"+json.get(macro.args, "CastTime")+"|Casting Time|LABEL",
		"junkVar|"+json.get(macro.args, "Range")+"|Range|LABEL",
		"junkVar|"+json.get(macro.args, "Target")+"|Target(s)|LABEL",
		"junkVar|"+json.get(macro.args, "Components")+"|Component|LABEL",
		"junkVar|"+json.get(macro.args, "Duration")+"|Duration|LABEL",
		"junkVar|"+ConcLabel+"|Requires Concentration?|LABEL")]
	[h:Slot=(minSlotList+1)]
	[h:abort(status)]
	}]
}]

<!--spell slot handling-->
[h:drained=0]
[h,switch(slot), code:
	case 0:{[h:null=0]};
	case 1:{[h,if(First > 0): First=(First-1); drained=1]};
	case 2:{[h,if(Second > 0): Second=(Second-1); drained=1]};
	case 3:{[h,if(Third > 0): Third=(Third-1); drained=1]};
	case 4:{[h,if(Fourth > 0): Fourth=(Fourth-1); drained=1]};
	case 5:{[h,if(Fifth > 0): Fifth=(Fifth-1); drained=1]};
	case 6:{[h,if(Sixth > 0): Sixth=(Sixth-1); drained=1]};
	case 7:{[h,if(Seventh > 0): Seventh=(Seventh-1); drained=1]};
	case 8:{[h,if(Eighth > 0): Eighth=(Eighth-1); drained=1]};
	case 9:{[h,if(Ninth > 0): Ninth=(Ninth-1); drained=1]};
	default:{[h:null=0]}]

<!--set concentration if spell is cast and requires it-->
[if(drained == 0), code:{
	[h, if(json.get(macro.args, "Concentration") == 1), CODE:
		{[h:state.Concentrating=1]};{
	}]};{
}]

[h:jsonReturnData = json.set("{}", "Slot", slot, "Drained", drained)]
[h:macro.return=jsonReturnData]