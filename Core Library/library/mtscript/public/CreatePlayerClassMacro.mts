[h:pm.AbilityList = json.get(arg(0),"AbilityList")][h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h,foreach(ability,pm.AbilityList),CODE:{
	[h:pm.CastTimeNote = if(or(json.get(ability,"CastTime")=="",lower(json.get(ability,"CastTime"))=="action"),""," <b>("+json.get(ability,"CastTime")+")</b>")]
	[h:pm.NewMacroLabel = json.get(ability,"DisplayName")+if(json.get(ability,"Marker")=="",""," "+json.get(ability,"Marker"))+pm.CastTimeNote]
	[h:pm.NewMacroCommand = '[MACRO("'+json.get(ability,"Name")+" ### "+json.get(ability,"Class")+if(json.get(ability,"Subclass")=="",""," ### "+json.get(ability,"Subclass"))+"@Lib:"+json.get(ability,"Library")+'"): json.set("","ParentToken",currentToken(),"IsTooltip",0)]']
	[h:pm.NewMacroTooltip = '[MACRO("'+json.get(ability,"Name")+" ### "+json.get(ability,"Class")+if(json.get(ability,"Subclass")=="",""," ### "+json.get(ability,"Subclass"))+"@Lib:"+json.get(ability,"Library")+'"): json.set("","ParentToken",currentToken(),"IsTooltip",1)]']
	[h:pm.NewMacroProps = json.set("",
		"applyToSelected",0,
		"autoExecute",1,
		"color",pm.BorderColor(json.get(ability,"Class")),
		"command",pm.NewMacroCommand,
		"fontColor",pm.TitleColor(json.get(ability,"Class")),
		"fontSize","1.00em",
		"includeLabel",0,
		"group"," New Macros",
		"sortBy","",
		"label",pm.NewMacroLabel,
		"maxWidth","",
		"minWidth",89,
		"playerEditable",0,
		"tooltip",pm.NewMacroTooltip,
		"delim","json"
	)]
	[h:createMacro(pm.NewMacroProps)]
}]