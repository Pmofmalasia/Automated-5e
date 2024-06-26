[h:abort(input(
	" actionChoice | Throw Weapon,Dash,Disengage,Dodge,Grapple,Help,Hide,Shove | Choose an Action | RADIO | VALUE=STRING ",
	" addButton |  | Create a Button for This Action | CHECK "
))]

[h,if(actionChoice == "Throw Weapon"),CODE:{
	[h:CombatActionData = macro.args]
	[h:ParentToken = json.get(CombatActionData,"ParentToken")]
	[h:switchToken(ParentToken)]
	[h:UsableLimbs = pm.a5e.Limbs(ParentToken)]

	[h:UsableLimbOptions = json.path.read(UsableLimbs,"[*]['DisplayName']")]
	[h:abort(input(
		" HandChoice | "+UsableLimbOptions+" | Throw from Which Hand | LIST | DELIMITER=JSON "
	))]

	[macro("SingleAttack@Lib:pm.a5e.Core"): json.set("","Hand",HandChoice,"ParentToken",currentToken(),"Throw",1)]

	[h,if(addButton),CODE:{
		[h:pm.NewMacroLabel = "Throw "+json.get(UsableLimbOptions,HandChoice)+" Weapon"]
		[h:pm.NewMacroCommand = '[macro("SingleAttack@Lib:pm.a5e.Core"): json.set("","Hand",'+HandChoice+',"ParentToken",currentToken(),"Throw",1)]']
		[h:pm.NewMacroTooltip = '[macro("AttackMacroTooltip@Lib:pm.a5e.Core"): json.set("","Hand",'+HandChoice+',"ParentToken",currentToken(),"Throw",1)]']
		[h:pm.NewMacroProps = json.set("",
			"applyToSelected",0,
			"autoExecute",1,
			"color","black",
			"command",pm.NewMacroCommand,
			"fontColor","white",
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
	};{}]
};{
	[h:tempMacroName = actionChoice+" Border@Lib:pm.a5e.Core"]
	[h,MACRO(tempMacroName): json.set("","ParentToken",currentToken())]

	[h,if(addButton),CODE:{
		[h:pm.NewMacroLabel = actionChoice]
		[h:pm.NewMacroCommand = '[h,MACRO("'+tempMacroName+'"): json.set("","ParentToken",currentToken(),"IsTooltip",0)]']
		[h:pm.NewMacroTooltip = '[h,MACRO("'+tempMacroName+'"): json.set("","ParentToken",currentToken(),"IsTooltip",1)]']
		[h:pm.NewMacroProps = json.set("",
			"applyToSelected",0,
			"autoExecute",1,
			"color","black",
			"command",pm.NewMacroCommand,
			"fontColor","white",
			"fontSize","1.00em",
			"includeLabel",0,
			"group"," New Macros",
			"sortBy","",
			"label",pm.NewMacroLabel,
			"maxWidth","",
			"minWidth",89,
			"playerEditable",0,
			"tooltip","",
			"delim","json"
		)]
		[h:createMacro(pm.NewMacroProps)]
	};{}]
}]


