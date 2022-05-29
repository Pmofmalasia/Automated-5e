[h,if(argCount()>0),CODE:{
	[h:ab.InputTitle = json.get(arg(0),"InputTitle")]
	[h:ab.PresetType = json.get(arg(0),"Type")]
	[h:ab.PresetClass = json.get(arg(0),"Class")]
	[h:ab.PresetSubclass = json.get(arg(0),"Subclass")]
	[h:askToAddAnotherTest = if(json.get(arg(0),"AddAnother")=="",0,json.get(arg(0),"AddAnother"))]
};{
	[h:ab.InputTitle = ""]
	[h:ab.PresetType = ""]
	[h:ab.PresetClass = ""]
	[h:ab.PresetSubclass = ""]
	[h:askToAddAnotherTest = 0]
}]

[h,if(ab.PresetType==""),CODE:{
	[h:abort(input(
		ab.InputTitle,
		" ab.ConditionType | Base Condition,Background,Class,Feat,Race,Spell,Movement | Choose Condition Type | RADIO | VALUE=STRING "
		))]
};{
	[h:ab.ConditionType = ab.PresetType]
}]

[h,if(ab.PresetClass==""),CODE:{
	[h,switch(ab.ConditionType):
		case "Class": 
			abort(input(
			ab.InputTitle,
			" ab.ConditionClass | "+pm.GetClasses("DisplayName")+" | Choose Class Associated with Condition | RADIO | VALUE=STRING "
			));
		case "Race":
			abort(input(
			ab.InputTitle,
			" ab.ConditionClass | "+pm.GetRaces("DisplayName")+" | Choose Race Associated with Condition | RADIO | VALUE=STRING "
			));
		case "Base Condition": ab.ConditionClass = "Condition";
		default: ab.ConditionClass = ab.ConditionType
	]
	[h:ab.ConditionClass = pm.RemoveSpecial(ab.ConditionClass)]
};{
	[h:ab.ConditionClass = ab.PresetClass]
}]

[h,if(ab.PresetSubclass==""),CODE:{
	[h,switch(ab.ConditionType):
		case "Class": 
			abort(input(
			ab.InputTitle,
			" ab.ConditionSubclass | None,"+pm.GetSubclasses(ab.ConditionClass,"DisplayName")+" | Choose Subclass Associated with Condition | RADIO | VALUE=STRING "
			));
		case "Race":
			abort(input(
			ab.InputTitle,
			" ab.ConditionSubclass | None,"+pm.GetSubraces(ab.ConditionClass,"DisplayName")+" | Choose Subrace Associated with Condition | RADIO | VALUE=STRING "
			));
		case "Background":
			abort(input(
			ab.InputTitle,
			" ab.ConditionSubclass | "+pm.GetBackgrounds(ab.ConditionClass,"DisplayName")+" | Choose Background Associated with Condition | RADIO | VALUE=STRING "
			));
		default: ab.ConditionSubclass = ""
	]
	[h:ab.ConditionSubclass = if(ab.ConditionSubclass=="None","",pm.RemoveSpecial(ab.ConditionSubclass))]
};{
	[h:ab.ConditionSubclass = if(ab.PresetSubclass=="None","",ab.PresetSubclass)]
}]

[h:goAgane = 0]
[h:disGoAgain = if(askToAddAnotherTest," goAgane | No,Yes,Yes - Use Same Filter | Choose Another Condition? | RADIO ","")]

[h:abort(input(
	ab.InputTitle,
	"ab.ConditionName | "+json.toList(json.path.read(getLibProperty("sb.Conditions","Lib:pm.a5e.Core"),"[*][?(@.Class=='"+ab.ConditionClass+"' && @.Subclass=='"+ab.ConditionSubclass+"')]['DisplayName']"))+" | Choose a Condition | RADIO | VALUE=STRING "
))]

[h:macro.return = json.set("","Name",pm.RemoveSpecial(ab.ConditionName),"DisplayName",ab.ConditionName,"Type",ab.ConditionType,"Class",ab.ConditionClass,"Subclass",ab.ConditionSubclass,"AddAnother",goAgane)]