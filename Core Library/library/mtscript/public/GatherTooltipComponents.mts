[h:TooltipData = macro.args]
[h:ParentToken = json.get(TooltipData,"ParentToken")]
[h:needsSplitGMOutput = json.get(TooltipData,"needsSplitGMOutput")]
[h:BorderData = json.get(TooltipData,"BorderData")]
[h:abilityTable = json.get(TooltipData,"Table")]
[h:Description = json.get(TooltipData,"Description")]
[h:AbridgedDescription = json.get(TooltipData,"AbridgedDescription")]
[h:ShowFullRules = 1]

[h:TooltipRules = json.set("","NoFullMacro",0,"NoRules",0,"NoRolls",0)]
[h:BorderOutput = pm.a5e.BuildChatBorder(BorderData,TooltipRules)]
[h:PlayerOutput = json.get(BorderOutput,"Player")]
[h:GMOutput = json.get(BorderOutput,"GM")]

[h:TableOutputs = pm.a5e.FullTableProcessing(abilityTable,TooltipRules,ShowFullRules)]
[h:PlayerOutput = PlayerOutput + json.get(TableOutputs,"Player")]
[h:GMOutput = GMOutput + json.get(TableOutputs,"GM")]

[h:"<!-- TODO: Add future option to show data of specific effects (for those with multiple, e.g. Cli Lyre) -->"]
[h:PlayerOutput = PlayerOutput + Description + "</div></div>"]
[h:GMOutput = GMOutput + Description + "</div></div>"]

[h:TooltipOutputData = json.set("",
	"Player",PlayerOutput,
	"GM",GMOutput,
	"MaxColNum",json.get(TableOutputs,"MaxColNum"),
	"ColorData",BorderData,
	"ParentToken",ParentToken
)]
[r,MACRO("TooltipOutput@Lib:pm.a5e.Core"): TooltipOutputData]