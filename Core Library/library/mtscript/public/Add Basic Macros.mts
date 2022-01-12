[h:GenericID=findToken("Generic Hero","z.0 Library")]
[h:BasicMacros=getMacros(",",GenericID,"z.0 Library")]

[h,count(listCount(BasicMacros)),code:{
	[CurrentMacro=listGet(BasicMacros,roll.count)]
	[CurrentMacroIndex=getMacroIndexes(CurrentMacro,",",GenericID,"z.0 Library")]
	[CurrentMacroProps=getMacroProps(CurrentMacroIndex,"json",GenericID,"z.0 Library")]
	[CurrentMacroTrimmedProps=json.set("","autoExecute",json.get(CurrentMacroProps,"autoExecute"),"color",json.get(CurrentMacroProps,"color"),"fontColor",json.get(CurrentMacroProps,"fontColor"),"fontSize",json.get(CurrentMacroProps,"fontSize"),"group",json.get(CurrentMacroProps,"group"),"sortBy",json.get(CurrentMacroProps,"sortBy"),"minWidth",json.get(CurrentMacroProps,"minWidth"),"tooltip",json.get(CurrentMacroProps,"tooltip"),"label",json.get(CurrentMacroProps,"label"),"command",json.get(CurrentMacroProps,"command"))]
	[createMacro(CurrentMacroTrimmedProps)]
}]