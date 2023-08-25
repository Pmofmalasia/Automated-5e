[h:ModifyConditionsData = macro.args]
[h:ModifyMethod = json.get(ModifyConditionsData,"Method")]

[h,switch(ModifyMethod),CODE:
	case "End":{
		[h:macro.return = json.set("",
			"Method","End"
		)]
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