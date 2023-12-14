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

[h:ClassFeatureData = json.set("",
	"Flavor","",
	"ParentToken","",
	"needsSplitGMOutput",0,
	"Class","zzChecksAndSaves",
	"Name","Advance Time",
	"FalseName","",
	"OnlyRules",1
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(output.Temp,"Player")+TimeDescription+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+TimeDescription+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]