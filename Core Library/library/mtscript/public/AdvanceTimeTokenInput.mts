[h:assert(!json.isEmpty(getSelected("json")),"You must select tokens to advance the time of!")]
[h:abort(input(
	" AdvanceValue |  | Time to Advance ",
	" AdvanceUnits | Rounds,Minutes,Hours,Days,Years | Time Units | LIST | VALUE=STRING "
))]

[h:assert(isNumber(AdvanceValue),"Time to Advance must be a number!")]

[h:AdvanceUnits = substring(AdvanceUnits,0,length(AdvanceUnits) - 1)]
[h:AdvanceUnits = lower(AdvanceUnits)]
[h:AdvanceTokens = getSelected("json")]

[h:AdvanceData = json.set("",
	"Tokens",AdvanceTokens,
	"TimeAdvanced",json.set("",
		"Time",AdvanceValue,
		"TimeUnits",AdvanceUnits)
)]
[h,MACRO("AdvanceTimeToken@Lib:pm.a5e.Core"): AdvanceData]
[h:AdvanceTimeReturnData = macro.return]

[h:AdvanceTokenNames = "[]"]
[h,foreach(tempToken,AdvanceTokens): AdvanceTokenNames = json.append(AdvanceTokenNames,getName(tempToken))]

[h:abilityTable = json.get(AdvanceTimeReturnData,"Table")]
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