[h:ConditionID = macro.args]
[h:a5e.GatherAbilities()]
[h:abilityTable = "[]"]

[h:RemovedConditions = json.path.read(ConditionList,"[?(@.ConditionID=='"+ConditionID+"')]")]


[h:"<!-- Will need stuff here for calling passive effects that trigger on end of condition. Located here in case they prevent it. -->"]
[h:"<!-- Will need separate instances for passive effects that prevent a condition ending and effects that trigger when a condition ends, for purposes of order -->"]

[h:ConditionList = json.path.delete(ConditionList,"[?(@.ConditionID=='"+ConditionID+"')]")]
[h:ConditionGroups = json.path.delete(ConditionGroups,"[?(@.GroupID=='"+ConditionID+"')]")]

[h,foreach(condition,RemovedConditions),CODE:{
	[h:StateExistsTest = !json.isEmpty(json.path.read(getInfo("campaign"),"states.*.[?(@.name=='"+json.get(condition,"Name")+"')]"))]
	[h,if(StateExistsTest),CODE:{
		[h:InactiveTest = json.isEmpty(json.path.read(ConditionList,"[?(@.Name == '"+json.get(condition,"Name")+"')]"))]
		[h,if(InactiveTest): setState(json.get(condition,"Name"),0)]
	};{
		[h,if(json.get(condition,"BackupState")==""): RemoveBackupTest = 0; RemoveBackupTest = json.isEmpty(json.path.read(ConditionList,"[?(@.BackupState == '"+json.get(condition,"BackupState")+"')]"))]
		[h,if(RemoveBackupTest): setState(json.get(condition,"BackupState"),0)]
	}]
}]

[h:pm.PassiveFunction("CondEnd")]
	
[h:macro.return = json.set("","Table",abilityTable,"Removed",RemovedConditions)]