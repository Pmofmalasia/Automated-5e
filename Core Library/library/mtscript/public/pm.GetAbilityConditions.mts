[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.ConditionNames = json.get(arg(1),"Conditions")]
[h:pm.ChoiceMethod = if(json.get(arg(1),"Choice")=="","All",json.get(arg(1),"Choice"))]
[h:pm.Duration=json.get(arg(2),"Duration")]
[h:pm.DurationUnits=json.get(arg(2),"DurationUnits")]
[h:pm.AuraRange=if(json.get(arg(2),"AuraRange")=="",0,json.get(arg(2),"AuraRange"))]
[h:pm.AuraUnits=json.get(arg(2),"AuraUnits")]

[h:pm.AllConditions = ""]
[h:pm.ConditionsFinal = ""]
[h,if(json.type(pm.ConditionNames)=="OBJECT"): pm.ConditionNames = json.append("",pm.ConditionNames)]
[h,foreach(condition,pm.ConditionNames): pm.AllConditions = json.append(pm.AllConditions,json.get(json.path.read(getLibProperty("sb.Conditions","Lib:pm.a5e.Core"),"[?(@.Name=='"+json.get(condition,"Name")+"' && @.Class=='"+json.get(condition,"Class")+"' && @.Subclass=='"+json.get(condition,"Subclass")+"')]"),0))]

[h,switch(pm.ChoiceMethod),CODE:
	case "All":{
		[h:pm.ConditionsFinal = pm.AllConditions]
		};
	case "Multiple":{
		[h:pm.ConditionInput = " junkVar | -------- Choose Any Number of Conditions --------- |  | LABEL | SPAN=TRUE "]
		[h,foreach(condition,pm.AllConditions): pm.ConditionInput = listAppend(pm.ConditionInput,"choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")+" |  | "+json.get(condition,"DisplayName")+" | CHECK "," ## ")]
		[h:abort(input(pm.ConditionInput))]
		[h,foreach(condition,pm.AllConditions): pm.ConditionsFinal = if(eval("choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")),json.append(pm.ConditionsFinal,condition),pm.ConditionsFinal)]
		};
	case "One":{
		[h:pm.ConditionOptions = ""]
		[h,foreach(condition,pm.AllConditions): pm.ConditionOptions = listAppend(pm.ConditionOptions,json.get(condition,"DisplayName"))]
		[h:abort(input(
			" pm.ConditionChoice | "+pm.ConditionOptions+" | Choose a Condition | RADIO "))]
		[h:pm.ConditionsFinal = json.append("",json.get(pm.AllConditions,pm.ConditionChoice))]
		};
	default: {[h:pm.ConditionsFinal = pm.AllConditions]}
]

[h:"<!-- Put eventual Magic Item buff to aura range, etc. here. Need to decide whether to include duration or have it be separated into its own function. -->"]

[h:pm.ConditionIDTest = json.path.read(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"' && @.ConditionID != null)]['ConditionID']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(json.isEmpty(pm.ConditionIDTest)),CODE:{
	[h:UniqueIDTest = 1]
	[h,while(UniqueIDTest),CODE:{
		[h:pm.ConditionID = eval("1d1000000000")]
		[h:UniqueIDTest = !json.isEmpty(json.path.read(allAbilities,"[*][?(@.ConditionID == "+pm.ConditionID+")]"))]
		[h,if(roll.count>0): broadcast("You've hit a one in a billion chance! Well, less, actually. You win nothing, I just wanted to know if it would ever happen.")]
	}]	
	[h:allAbilities = json.path.put(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"')]","ConditionID",pm.ConditionID)]
};{
	[h:pm.ConditionID = json.get(pm.ConditionIDTest,0)]
}]

[h:pm.ConditionsFinal = json.path.put(pm.ConditionsFinal,"[*]","Duration",json.set("",pm.DurationUnits,pm.Duration))]
[h:pm.ConditionsFinal = json.path.put(pm.ConditionsFinal,"[*]","SetBy",currentToken())]
[h:pm.ConditionsFinal = json.path.put(pm.ConditionsFinal,"[*]","ConditionID",pm.ConditionID)]
[h:macro.return = json.set("","Conditions",pm.ConditionsFinal,"ConditionID",pm.ConditionID)]