[h:pm.ConditionNames = arg(0)]
[h,if(argCount()>1): pm.ChoiceNumber = arg(1); pm.ChoiceNumber = 0]

[h:pm.AllConditions = ""]
[h:pm.ConditionsFinal = ""]
[h,if(json.type(pm.ConditionNames)=="OBJECT"): pm.ConditionNames = json.append("",pm.ConditionNames)]
[h,foreach(condition,pm.ConditionNames): pm.AllConditions = json.append(pm.AllConditions,json.set(pm.a5e.GetSpecificCondition(json.get(condition,"Name"),json.get(condition,"Class"),json.get(condition,"Subclass")),"AlwaysAdded",json.get(condition,"AlwaysAdded")))]

[h:conditionsAlwaysSetArray = json.path.read(pm.AllConditions,"[*][?(@.AlwaysSet==1 || @.AlwaysSet=='')]")]

[h:conditionOptionsArray = json.path.read(pm.AllConditions,"[*][?(@.AlwaysSet==0)]")]

[h,if(pm.ChoiceNumber > 1),CODE:{
	[h:conditionOptionsChosen = "[]"]

	[h:pm.ConditionInput = " junkVar | -------- Choose "+pm.ChoiceNumber+" Conditions --------- |  | LABEL | SPAN=TRUE "]
	[h,foreach(condition,conditionOptionsArray): pm.ConditionInput = listAppend(pm.ConditionInput,"choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")+" |  | "+json.get(condition,"DisplayName")+" | CHECK "," ## ")]

	[h:abort(input(pm.ConditionInput))]

	[h,foreach(condition,conditionOptionsArray): conditionOptionsChosen = if(eval("choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")),json.append(conditionOptionsChosen,json.remove(condition,"AlwaysAdded")),conditionOptionsChosen)]

	[h:pm.ConditionsFinal = json.merge(conditionsAlwaysSetArray,conditionOptionsChosen)]
};{
	[h,if(pm.ChoiceNumber == 1),CODE:{
		[h:conditionOptionsDisplay = ""]
		[h,foreach(condition,conditionOptionsArray): conditionOptionsDisplay = json.append(conditionOptionsDisplay,json.get(condition,"DisplayName"))]
		[h:abort(input(
			" pm.ConditionChoice | "+pm.ConditionOptions+" | Choose a Condition | RADIO | DELIMITER=JSON "))]
		[h:pm.ConditionsFinal = json.append(conditionsAlwaysSetArray,json.remove(json.get(conditionOptionsArray,pm.ConditionChoice),"AlwaysAdded"))]
	};{
		[h:pm.ConditionsFinal = json.path.delete(conditionsAlwaysSet,"[*]['AlwaysAdded']")]
	}]
}]

[h:macro.return = pm.ConditionsFinal]