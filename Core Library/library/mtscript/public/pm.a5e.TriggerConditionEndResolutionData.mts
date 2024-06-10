[h,if(thisConditionSaveInfo != ""),CODE:{
	[h:thisConditionEndEffect = json.set(thisConditionEndEffect,"SaveDC",json.set("",
		"SaveType",thisConditionSaveInfo,
		"DC",json.get(thisConditionEndInfo,"DC"),
		"ConditionModification",json.set("","Success",1)
	))]

	[h,if(json.type(thisConditionSaveInfo) == "ARRAY"): thisConditionSaveInfo = json.append("",thisConditionSaveInfo)]
	[h:saveDisplayArray = "[]"]
	[h,foreach(saveType,thisConditionSaveInfo): saveDisplayArray = json.append(saveDisplayArray,pm.GetDisplayName(saveType,"sb.Attributes"))]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Saving Throw",
		"FalseHeader","",
		"FullContents",pm.a5e.CreateDisplayList(saveDisplayArray,"or")+" Save",
		"RulesContents","DC "+json.get(thisConditionEndInfo,"DC")+" ",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]

[h,if(thisConditionCheckInfo != ""),CODE:{
	[h:thisConditionEndEffect = json.set(thisConditionEndEffect,"CheckDC",json.set("",
		"CheckType",thisConditionCheckInfo,
		"DC",json.get(thisConditionEndInfo,"DC"),
		"ConditionModification",json.set("","Success",1)
	))]

	[h,if(json.type(thisConditionCheckInfo) == "ARRAY"): thisConditionCheckInfo = json.append("",thisConditionCheckInfo)]
	[h:checkDisplayArray = "[]"]
	[h:attributeNames = pm.GetAttributes("Name")]
	[h,foreach(checkType,thisConditionCheckInfo),CODE:{
		[h:isAttribute = json.contains(attributeNames,checkType)]
		[h,if(isAttribute):
			checkDisplayArray = json.append(checkDisplayArray,pm.GetDisplayName(checkType,"sb.Attributes"));
			checkDisplayArray = json.append(checkDisplayArray,pm.GetDisplayName(checkType,"sb.Skills"))
		]
	}]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Saving Throw",
		"FalseHeader","",
		"FullContents",pm.a5e.CreateDisplayList(checkDisplayArray,"or")+" Check",
		"RulesContents","DC "+json.get(thisConditionEndInfo,"DC")+" ",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]