[h:ChatOutputData = macro.args]
[h:ParentToken = json.get(ChatOutputData,"ParentToken")]
[h:needsSplitGMOutput = json.get(ChatOutputData,"needsSplitGMOutput")]
[h:BorderData = json.get(ChatOutputData,"BorderData")]
[h:abilityTable = json.get(ChatOutputData,"Table")]
[h:Description = json.get(ChatOutputData,"Description")]
[h:AbridgedDescription = json.get(ChatOutputData,"AbridgedDescription")]
[h:ShowFullRulesType = json.get(ChatOutputData,"ShowFullRulesType")]

[h:OutputRulesData = json.set("",
	"needsSplitGMOutput",needsSplitGMOutput,
	"Table",abilityTable,
	"ParentToken",ParentToken
)]
[h:ShowFullRules = pm.a5e.ShowFullRules(ShowFullRulesType)]

[h:OutputRules = pm.a5e.PlayerOutputRules(OutputRulesData)]
[h:BorderOutputs = pm.a5e.BuildChatBorder(BorderData,OutputRules)]
[h:TableOutputs = pm.a5e.FullTableProcessing(abilityTable,OutputRules,ShowFullRules)]
[h:DescriptionOutputs = pm.a5e.DescriptionOutputs(OutputRules,ShowFullRules,Description,AbridgedDescription)]

[h:NoFullMacro = json.get(OutputRules,"NoFullMacro")]
[h:GMOutput = json.get(BorderOutputs,"GM") + json.get(TableOutputs,"GM") + json.get(DescriptionOutputs,"GM") + "</div></div>"]
[h:PlayerOutput = json.get(BorderOutputs,"Player") + json.get(TableOutputs,"Player") + json.get(DescriptionOutputs,"Player") + if(NoFullMacro,"","</div></div>")]
[h:ChatOutputData = json.set(ChatOutputData,
	"GM",GMOutput,
	"Player",PlayerOutput,
	"MaxColNum",json.get(TableOutputs,"MaxColNum")
)]

[h,MACRO("ChatOutput@Lib:pm.a5e.Core"): ChatOutputData]