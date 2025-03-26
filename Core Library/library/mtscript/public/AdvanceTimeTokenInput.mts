[h:assert(!json.isEmpty(getSelected("json")),"You must select tokens to advance the time of!")]
[h:abort(input(
	" AdvanceValue |  | Time to Advance ",
	" AdvanceUnits | Rounds,Minutes,Hours,Days,Years | Time Units | LIST | VALUE=STRING "
))]

[h:assert(isNumber(AdvanceValue),"Time to Advance must be a number!")]

[h,switch(AdvanceUnits):
	case "Rounds": AdvanceValueFinal = AdvanceValue;
	case "Minutes": AdvanceValueFinal = AdvanceValue * 10;
	case "Hours": AdvanceValueFinal = AdvanceValue * 600;
	case "Days": AdvanceValueFinal = AdvanceValue * 14400;
	case "Years": AdvanceValueFinal = AdvanceValue * 5256000;
]

[h:AdvanceTokens = getSelected("json")]
[h:AdvanceTimeReturnData = js.a5e.AdvanceTimeTokens(AdvanceTokens,AdvanceValueFinal)]

[h:AdvanceTokenNames = "[]"]
[h,foreach(tempToken,AdvanceTokens): AdvanceTokenNames = json.append(AdvanceTokenNames,getName(tempToken))]

[h:abilityTable = json.get(AdvanceTimeReturnData,"Table")]

[h:AdvanceUnits = substring(AdvanceUnits,0,length(AdvanceUnits) - 1)]
[h:AdvanceUnits = lower(AdvanceUnits)]
[h:TimeDescription = "Time advances " + AdvanceValue + " " + AdvanceUnits + if(AdvanceValue == 1,"","s") + " for " + pm.a5e.CreateDisplayList(AdvanceTokenNames,"and")+"."]

[h:BorderData = json.set("",
	"Flavor","",
	"Name","AdvanceTime",
	"DisplayName","Advance Time",
	"FalseName","",
	"DisplayClass","zzGeneral",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken","",
	"needsSplitGMOutput",0,
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","AdvanceTime"),
	"Description",TimeDescription,
	"AbridgedDescription",TimeDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]