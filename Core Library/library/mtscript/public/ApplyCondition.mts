[h:a5e.Conditions = json.get(macro.args,"Conditions")]
[h:a5e.Group = json.get(macro.args,"Group")]
[h:a5e.EndConditionInfo = json.get(macro.args,"EndInfo")]

[h,foreach(condition,a5e.Conditions),CODE:{
	[h:StateExistsTest = !json.isEmpty(json.path.read(getInfo("campaign"),"states.*.[?(@.name=='"+json.get(condition,"Name")+"')]"))]
	[h,if(StateExistsTest),CODE:{
		[h:setState(json.get(condition,"Name"),1)]
	};{
		[h,if(json.get(condition,"BackupState")!=""): setState(json.get(condition,"BackupState"),1)]
	}]
}]

[h:ConditionList = json.merge(ConditionList,a5e.Conditions)]
[h:ConditionGroups = json.set(ConditionGroups,a5e.Group,json.set("","Names",json.path.read(a5e.Conditions,"[*]['Name']"),"EndCondition",a5e.EndConditionInfo))]