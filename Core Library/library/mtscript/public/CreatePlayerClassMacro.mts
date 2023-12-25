[h:pm.AbilityList = json.get(arg(0),"AbilityList")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:Effects = json.get(arg(0),"Effects")]
[h,if(Effects == ""): Effects = "[]"]
[h:switchToken(ParentToken)]

[h,foreach(ability,pm.AbilityList),CODE:{
	[h:pm.CastTimeNote = if(or(json.get(ability,"UseTime")=="",lower(json.get(ability,"UseTime"))=="action"),""," <b>("+json.get(ability,"UseTime")+")</b>")]
	[h:pm.NewMacroLabel = json.get(ability,"DisplayName")+if(json.get(ability,"Marker")=="",""," "+json.get(ability,"Marker"))+pm.CastTimeNote]

	[h,if(roll.count > json.length(Effects) - 1),CODE:{
		[h:pm.NewMacroCommand = '[MACRO("'+json.get(ability,"Name")+" ### "+json.get(ability,"Class")+if(json.get(ability,"Subclass")=="",""," ### "+json.get(ability,"Subclass"))+"@Lib:"+json.get(ability,"Library")+'"): json.set("","ParentToken",currentToken(),"IsTooltip",0)]']
		[h:pm.NewMacroTooltip = '[MACRO("'+json.get(ability,"Name")+" ### "+json.get(ability,"Class")+if(json.get(ability,"Subclass")=="",""," ### "+json.get(ability,"Subclass"))+"@Lib:"+json.get(ability,"Library")+'"): json.set("","ParentToken",currentToken(),"IsTooltip",1)]']		
	};{
		[h:pm.NewMacroCommand = '[h:FeatureData = json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name=='+"'"+json.get(ability,"Name")+"'"+' && @.Class=='+"'"+json.get(ability,"Class")+"'"+' && @.Subclass=='+"'"+json.get(ability,"Subclass")+"'"+')]['+"'Effects'"+']"),0)]
[h:FeatureEffect = json.get(FeatureData,'+roll.count+')]
[MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"IsTooltip",0,"Effect",FeatureEffect,"DisplayName","'+json.get(ability,"DisplayName")+'","Class","'+json.get(ability,"Class")+'")]']
		[h:pm.NewMacroTooltip = '']	
	}]

	
	[h:ButtonColorData = pm.a5e.BorderColors(json.get(ability,"Class"),"",ParentToken)]
	[h:pm.NewMacroProps = json.set("",
		"applyToSelected",0,
		"autoExecute",1,
		"color",json.get(ButtonColorData,"Border"),
		"command",pm.NewMacroCommand,
		"fontColor",json.get(ButtonColorData,"Title"),
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