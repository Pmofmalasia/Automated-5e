
[h:pm.Header=arg(0)]
[h:pm.Body=arg(1)]
[h,if(argCount()>2): pm.ExtraLines = arg(2); pm.ExtraLines = "[]"]

[h:ReturnMessage = json.set("","ShowIfCondensed",1,"Header",pm.Header,"FalseHeader","","FullContents","","RulesContents",pm.Body,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value","","Units","")]

[h,foreach(tempLine,pm.ExtraLines),CODE:{
	[h:ReturnMessage = json.set(ReturnMessage,
		"BonusSectionNum",(roll.count+1),
		"BonusSectionType"+(roll.count+1),json.get(tempLine,"Type"),
		"BonusBody"+(roll.count+1),json.get(tempLine,"Body"),
		"BonusSectionStyling"+(roll.count+1),json.get(tempLine,"Styling")
	)]
}]

[h:macro.return = ReturnMessage]