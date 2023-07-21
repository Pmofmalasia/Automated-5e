[h:ModifyConditionsData = macro.args]
[h:ConditionGroupsToModify = json.get(ModifyConditionsData,"Conditions")]
[h:TargetData = json.get(macro.args,"Target")]
[h,if(json.type(TargetData) == "OBJECT"),CODE:{
	[h:ParentToken = json.get(TargetData,"HeldBy")]
	[h:TargetType = "Item"]
	[h:TargetID = json.get(TargetData,"ItemID")]
};{
	[h:ParentToken = if(TargetData=="",currentToken(),TargetData)]
	[h:TargetType = "Token"]
	[h:TargetID = ParentToken]
}]
[h:switchToken(ParentToken)]
[h:ModifyMethod = json.get(ModifyConditionsData,"Method")]

[h:"<!-- TODO: Implement more than just ending conditions -->"]
[h,switch(ModifyMethod),CODE:
	case "End":{
		[h:tempEndConditionData = json.set("",
			"Target",TargetData,
			"GroupID",ConditionGroupsToModify
		)]
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): tempEndConditionData]
	};
	case "Suppress":{
		[h,if(json.get(ModifyConditionsData,"SuppressionDurationValue")==""):
			macro.return = json.set("",
				"Method","Suppress");
			macro.return = json.set("",
				"Method","Suppress",
				"Duration",json.get(ModifyConditionsData,"SuppressionDurationValue"),
				"DurationUnits",json.get(ModifyConditionsData,"SuppressionDurationUnits"))
		]
	};
	case "Prolong":{
		[h,if(json.get(ModifyConditionsData,"DurationMultiplier")==""): 
			DurationMultiplier = 1;
			DurationMultiplier = json.get(ModifyConditionsData,"DurationMultiplier")
		]
		[h,if(json.get(ModifyConditionsData,"DurationAdditionValue")==""): 
			DurationAdditionValue = 0;
			DurationAdditionValue = json.get(ModifyConditionsData,"DurationAdditionValue")
		]
		[h:DurationAdditionUnits = json.get(ModifyConditionsData,"DurationAdditionUnits")]

		[h:macro.return = json.set("",
			"Method","Prolong",
			"DurationMultiplier",DurationMultiplier,
			"DurationAdditionValue",DurationAdditionValue,
			"DurationAdditionUnits",DurationAdditionUnits
		)]
	};
	case "Shorten":{
		[h,if(json.get(ModifyConditionsData,"DurationMultiplier")==""): 
			DurationMultiplier = 1;
			DurationMultiplier = json.get(ModifyConditionsData,"DurationMultiplier")
		]
		[h,if(json.get(ModifyConditionsData,"DurationAdditionValue")==""): 
			DurationAdditionValue = 0;
			DurationAdditionValue = json.get(ModifyConditionsData,"DurationAdditionValue")
		]
		[h:DurationAdditionUnits = json.get(ModifyConditionsData,"DurationAdditionUnits")]

		[h:macro.return = json.set("",
			"Method","Shorten",
			"DurationMultiplier",DurationMultiplier,
			"DurationAdditionValue",DurationAdditionValue,
			"DurationAdditionUnits",DurationAdditionUnits
		)]
	}
]