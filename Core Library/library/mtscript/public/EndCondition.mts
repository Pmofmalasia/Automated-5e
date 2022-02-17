[h:ParentToken = json.get(macro.args,"ParentToken")]
[h,if(ParentToken!=""): switchToken(ParentToken)]
[h:MultiConditionTest = json.type(json.get(macro.args,"ConditionID"))]
[h,if(MultiConditionTest=="UNKNOWN"): ConditionID = json.append("",json.get(macro.args,"ConditionID")); ConditionID = json.get(macro.args,"ConditionID")]
[h:ConditionFilters = ""]
[h:GroupFilters = ""]
[h,foreach(UniqueID,json.unique(ConditionID)): ConditionFilters = listAppend(ConditionFilters,"@.ConditionID=='"+UniqueID+"'"," || ")]
[h,foreach(UniqueID,json.unique(ConditionID)): GroupFilters = listAppend(GroupFilters,"@.GroupID=='"+UniqueID+"'"," || ")]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities()]

[h:IsTooltip = 0]
[h:abilityTable = "[]"]

[h:RemovedConditions = json.path.read(ConditionList,"[?("+ConditionFilters+")]")]

[h:"<!-- Will need stuff here for calling passive effects that trigger on end of condition. Located here in case they prevent it. -->"]
[h:"<!-- Will need separate instances for passive effects that prevent a condition ending and effects that trigger when a condition ends, for purposes of order -->"]

[h:ConditionList = json.path.delete(ConditionList,"[?("+ConditionFilters+")]")]
[h:ConditionGroups = json.path.delete(ConditionGroups,"[?("+GroupFilters+")]")]

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