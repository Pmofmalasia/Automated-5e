[h:pm.ConditionNames = arg(0)]
[h:pm.ChoiceMethod = arg(1)]

[h:pm.AllConditions = ""]
[h:pm.ConditionsFinal = ""]
[h,if(json.type(pm.ConditionNames)=="OBJECT"): pm.ConditionNames = json.append("",pm.ConditionNames)]
[h,foreach(condition,pm.ConditionNames): pm.AllConditions = json.append(pm.AllConditions,json.set(pm.a5e.GetSpecificCondition(json.get(condition,"Name"),json.get(condition,"Class"),json.get(condition,"Subclass")),"AlwaysAdded",json.get(condition,"AlwaysAdded")))]

[h,switch(pm.ChoiceMethod),CODE:
	case "All":{
		[h:pm.ConditionsFinal = json.path.delete(pm.AllConditions,"[*]['AlwaysAdded']")]
		};
	case "Multiple":{
		[h:pm.ConditionInput = " junkVar | -------- Choose Any Number of Conditions --------- |  | LABEL | SPAN=TRUE "]
		[h,foreach(condition,pm.AllConditions): pm.ConditionInput = listAppend(pm.ConditionInput,"choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")+" |  | "+json.get(condition,"DisplayName")+" | CHECK "," ## ")]
		[h:abort(input(pm.ConditionInput))]
		[h,foreach(condition,pm.AllConditions): pm.ConditionsFinal = if(eval("choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")),json.append(pm.ConditionsFinal,json.remove(condition,"AlwaysAdded")),pm.ConditionsFinal)]
		};
	case "One":{
		[h:pm.ConditionOptions = ""]
		[h,foreach(condition,pm.AllConditions): pm.ConditionOptions = json.append(pm.ConditionOptions,json.get(condition,"DisplayName"))]
		[h:abort(input(
			" pm.ConditionChoice | "+pm.ConditionOptions+" | Choose a Condition | RADIO | DELIMITER=JSON "))]
		[h:pm.ConditionsFinal = json.append("",json.remove(json.get(pm.AllConditions,pm.ConditionChoice),"AlwaysAdded"))]
		};
	case "MixedOne":{
		[h:pm.ConditionOptions = ""]
		[h:pm.ConditionOptionsFull = ""]
		[h,foreach(condition,pm.AllConditions),CODE:{
			[h:AlwaysAddedTest = if(json.get(condition,"AlwaysAdded")==1,1,0)]
			[h,if(AlwaysAddedTest):
				pm.ConditionsFinal = json.append(pm.ConditionsFinal,condition);
				pm.ConditionOptionsFull = json.append(pm.ConditionOptionsFull,condition)
			]
			[h,if(!AlwaysAddedTest): pm.ConditionOptions = json.append(pm.ConditionOptions,json.get(condition,"DisplayName"))]
		}]
		
		[h:abort(input(
			" pm.ConditionChoice | "+pm.ConditionOptions+" | Choose a Condition | RADIO | DELIMITER=JSON "
		))]
		
		[h:pm.ConditionsFinal = json.append(pm.ConditionsFinal,json.remove(json.get(pm.ConditionOptionsFull,pm.ConditionChoice),"AlwaysAdded"))]	
	};
	case "MixedMultiple":{
		[h:pm.ConditionInput = " junkVar | -------- Choose Any Number of Conditions --------- |  | LABEL | SPAN=TRUE "]
		[h:pm.ConditionOptions = ""]
		[h,foreach(condition,pm.AllConditions),CODE:{
			[h:AlwaysAddedTest = if(json.get(pm.AllConditions,"AlwaysAdded")==1,1,0)]
			[h,if(AlwaysAddedTest):
				pm.ConditionsFinal = json.append(pm.ConditionsFinal,condition);
				pm.ConditionOptions = json.append(pm.ConditionOptions,condition)
			]
			
			[h,if(!AlwaysAddedTest): pm.ConditionInput = listAppend(pm.ConditionInput,"choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")+" |  | "+json.get(condition,"DisplayName")+" | CHECK "," ## ")]
		}]
		
		[h:abort(input(pm.ConditionInput))]
		
		[h,foreach(condition,pm.ConditionOptions): pm.ConditionsFinal = if(eval("choice."+json.get(condition,"Name")+json.get(condition,"Class")+json.get(condition,"Subclass")),json.append(pm.ConditionsFinal,json.remove(condition,"AlwaysAdded")),pm.ConditionsFinal)]
	};
	default: {[h:pm.ConditionsFinal = json.path.delete(pm.AllConditions,"[*]['AlwaysAdded']")]}
]

[h:macro.return = pm.ConditionsFinal]