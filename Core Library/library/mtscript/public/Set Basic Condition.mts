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
	"GroupID",pm.a5e.GenerateEffectID()
)]

[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): applyConditionData]