[h:SaveOptions = json.get(arg(1),"Save")]
[h:SaveAdvantage = json.get(arg(1),"Advantage")]
[h:SavePreviousRoll = json.get(arg(1),"PreviousRoll")]
[h:SaveType = if(json.get(arg(1),"Type")=="","Save",json.get(arg(1),"Type"))]
[h:SaveBonus = json.get(arg(1),"Bonus")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:pm.AttributesList = pm.GetAttributes("Name","json")]

[h,if(IsTooltip),CODE:{
	[h,if(json.type(SaveOptions)=="UNKNOWN"),CODE:{
		
		[h,switch(SaveType):
			case "Save": SaveDisplayName = pm.GetDisplayName(SaveOptions,"sb.Attributes");
			case "Concentration": SaveDisplayName = "Concentration";
			case "Death": SaveDisplayName = "Death"
		]
		
		[h:pm.a5e.SaveBonusTotal(json.set("",
			"Save",SaveDisplayName,
			"Type",SaveType,
			"Bonus",SaveBonus
		))]

		[h:saveTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header",SaveDisplayName+" Save",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b>"+pm.PlusMinus(TotalBonus,1,0)+"</b> Total Bonus",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{
		[h:saveTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header","Save Options",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.a5e.CreateDisplayList(SaveOptions,"or"),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]
	
	[h:abilityTable = json.append(abilityTable,saveTable)]
};{
	[h,if(json.type(SaveOptions)=="UNKNOWN"),CODE:{
		[h:SaveSelection = SaveOptions]
	};{
		[h:abort(input(" SaveSelection | "+SaveOptions+" | Choose a Save | LIST | DELIMITER=JSON VALUE=STRING "))]
		[h:SaveSelection = pm.RemoveSpecial(SaveSelection)]
	}]

	[h:SaveData = json.set("",
		"Save",SaveSelection,
		"Type",SaveType,
		"Advantage",SaveAdvantage,
		"PreviousRoll",SavePreviousRoll,
		"ParentToken",ParentToken
	)]

	[h,MACRO("Modify Save Rerouting@Lib:pm.a5e.Core"): SaveData]
	[h:SaveReturnData = macro.return]
	
	[h:abilityTable = json.merge(abilityTable,json.get(SaveReturnData,"Table"))]
}]