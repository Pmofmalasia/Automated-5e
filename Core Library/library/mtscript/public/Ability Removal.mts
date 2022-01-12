[h:pm.RemovedAbilities = macro.args]
[h:pm.RemovedButtons = "[]"]
[h:pm.RemoveButtonTest = 0]
[h:pm.RemovedButtonsInput = "junkVar | The following buttons will be removed unless unchecked. The ability will still be removed. |  | LABEL | SPAN=TRUE ## junkVar | ------------------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE "]

[h,foreach(ability,pm.RemovedAbilities),CODE:{
	[h:allAbilities = json.path.delete(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]")]
}]

[h,if(json.isEmpty(pm.RemovedAbilities)): pm.ButtonsToDeleteTemp = ""; pm.ButtonsToDeleteTemp = json.path.read(pm.RemovedAbilities,"[*][?(@.ButtonInfo != null)]['ButtonInfo']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.ButtonsToDelete = "[]"]
[h,foreach(ability,pm.ButtonsToDeleteTemp): pm.ButtonsToDelete = json.merge(pm.ButtonsToDelete,ability)]

[h:pm.RemoveButtonTest = 0]
[h,foreach(button,pm.ButtonsToDelete),CODE:{
	[h:pm.RemoveButtonTest = 1]
	[h:pm.RemovedMacroLabel = json.get(button,"DisplayName")+if(json.get(button,"Marker")=="",""," "+json.get(button,"Marker"))]
	[h:pm.RemovedButtonsInput = listAppend(pm.RemovedButtonsInput,"choice."+json.get(button,"Name")+json.get(button,"Class")+" | 1 | "+pm.RemovedMacroLabel+" | CHECK ","##")]
}]

[h,if(pm.RemoveButtonTest): abort(input(pm.RemovedButtonsInput))]

[h,foreach(button,pm.ButtonsToDelete),CODE:{
	[h:pm.ButtonRemovalTest = eval("choice."+json.get(button,"Name")+json.get(button,"Class"))]
	[h,if(pm.ButtonRemovalTest),CODE:{
		[h:pm.CastTimeNote = if(or(json.get(button,"CastTime")=="",lower(json.get(button,"CastTime"))=="action"),""," <b>("+json.get(button,"CastTime")+")</b>")]
		[h:pm.RemovedMacroLabel = json.get(button,"DisplayName")+if(json.get(button,"Marker")=="",""," "+json.get(button,"Marker")+pm.CastTimeNote)]
		[h,if(getMacroIndexes(pm.RemovedMacroLabel)!=""): removeMacro(number(getMacroIndexes(pm.RemovedMacroLabel)))]
	};{}]
}]