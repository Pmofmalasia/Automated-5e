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

[h:ConditionsAppliedInfo = macro.args]
[h:abilityTable = "[]"]
[h:FeatureDescription = json.get(ConditionsAppliedInfo,"ConditionDisplay")+" applied by the GM."]

[h:ClassFeatureData = json.set("",
	"Flavor","",
	"ParentToken",currentToken(),
	"DMOnly",0,
	"Class","zzChecksAndSaves",
	"Name","Apply Conditions",
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+FeatureDescription]
[h:output.GM = output.GM + json.get(macro.return,"GM")+FeatureDescription]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]