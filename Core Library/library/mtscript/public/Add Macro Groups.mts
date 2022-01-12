[h:GroupSelect = json.get(macro.args,"Groups")]
[h:leveling.Class = json.get(macro.args,"Class")]

[h:ClassSelect=findToken(leveling.Class,"z.0 Library")]

[h,foreach(macroGroup,GroupSelect),CODE:{
	[h:LevelMacros=getMacroGroup(macroGroup,",",ClassSelect,"z.0 Library")]

	[h,count(listCount(LevelMacros)),code:{
		[CurrentMacro=listGet(LevelMacros,roll.count)]
		[IndexNum=number(CurrentMacro)]
		[CurrentMacroProps=getMacroProps(IndexNum,"json",ClassSelect,"z.0 Library")]
		[CurrentMacroTrimmedProps=json.set("","autoExecute",json.get(CurrentMacroProps,"autoExecute"),"color",json.get(CurrentMacroProps,"color"),"fontColor",json.get(CurrentMacroProps,"fontColor"),"fontSize",json.get(CurrentMacroProps,"fontSize"),"group",json.get(CurrentMacroProps,"group"),"sortBy",json.get(CurrentMacroProps,"sortBy"),"minWidth",json.get(CurrentMacroProps,"minWidth"),"tooltip",json.get(CurrentMacroProps,"tooltip"),"label",json.get(CurrentMacroProps,"label"),"command",json.get(CurrentMacroProps,"command"))]
		[CurrentMacroName=substring(listGet(CurrentMacroProps,7),6)]
		[CurrentMacroCommand=getMacroCommand(IndexNum,ClassSelect,"z.0 Library")]
		[createMacro(CurrentMacroTrimmedProps)]
	}]
}]