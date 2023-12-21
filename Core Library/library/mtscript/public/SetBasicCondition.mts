[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:basicConditionsList = pm.a5e.GetBaseConditions()]

[h:conditionDisplay = "junkVar | ------------------ Choose a Condition to Set ------------------ |  | LABEL | SPAN=TRUE "]
[h,foreach(condition,basicConditionsList): conditionDisplay = listAppend(conditionDisplay,json.get(condition,"Name")+"choice |  | "+json.get(condition,"DisplayName")+" | CHECK "," ## ")]

[h:abort(input(conditionDisplay))]

[h:conditionsChosen = "[]"]
[h,foreach(condition,basicConditionsList),CODE:{
	[h:selectedTest = eval(json.get(condition,"Name")+"choice")]
	[h,if(selectedTest): conditionsChosen = json.append(conditionsChosen,condition)]
}]

[h:applyConditionData = json.set("",
	"Conditions",conditionsChosen,
	"EndInfo","{}",
	"GroupID",pm.a5e.GenerateEffectID(),
	"Target",ParentToken
)]

[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): applyConditionData]

[h:ConditionsAppliedInfo = macro.return]
[h:abilityTable = "[]"]
[h:FeatureDescription = json.get(ConditionsAppliedInfo,"ConditionDisplay")+" applied by the GM."]

[h:BorderData = json.set("",
	"Name","ApplyConditions",
	"DisplayName","Apply Conditions",
	"FalseName","",
	"DisplayClass","zzGeneral",
	"ColorSubtype",""
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Condition"),
	"OutputTargets","",
	"Description",FeatureDescription,
	"AbridgedDescription",FeatureDescription
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]