[h,if(argCount()>0),CODE:{
	[h:SpecificStat = arg(0)]
	[h:"<!-- TODO: Add a function here for toggling on/off certain stats to be seen by players (or in general) -->"]
};{
	[h:ShowSpecificStatTest = 1]
}]

[h,if(isOwner() || isGM()): return(0,1)]

[h,switch(getProperty("a5e.stat.Allegiance")),CODE:
	case "PC":{
		[h:return(0,1)]
	};
	case "Ally":{
		[h:return(0,1)]
	};
	case "Enemy":{
		[h:return(0,0)]
	};
	case "Neutral":{
		[h:return(0,0)]
	}
]