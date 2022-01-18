[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.Header=arg(1)]
[h:pm.Body=arg(2)]

[h:ReturnMessage = json.set("","ShowIfCondensed",1,"Header",pm.Header,"FalseHeader","","FullContents","","RulesContents",pm.Body,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value","","Units","")]
[h,if(pm.Tooltip),CODE:{};{
	[h,while((roll.count+3)<argCount()),CODE:{
		[h:ReturnMessage = json.set(ReturnMessage,
			"BonusSectionNum",(roll.count+1),
			"BonusSectionType"+(roll.count+1),json.get(arg((roll.count+3)),"Type"),
			"BonusBody"+(roll.count+1),json.get(arg((roll.count+3)),"Body"),
			"BonusSectionStyling"+(roll.count+1),json.get(arg((roll.count+3)),"Styling")
			)]
		[h:broadcast(ReturnMessage)]
	}]
}]
[h:macro.return = ReturnMessage]