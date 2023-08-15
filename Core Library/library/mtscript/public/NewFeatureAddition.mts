[h:pm.NewAbilities = json.get(macro.args,"Abilities")]
[h:pm.NewButtons = json.get(macro.args,"Buttons")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:switchToken(ParentToken)]

[h:pm.DisplayNewAbilities = ""]
[h,foreach(ability,pm.NewAbilities),CODE:{
	[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),json.set(ability,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")))]
	[h:pm.DisplayNewAbilities = listAppend(pm.DisplayNewAbilities,json.get(ability,"DisplayName"),"<br>")]
}]

[h,if(json.isEmpty(a5e.stat.AllFeatures)): pm.NewResources = ""; pm.NewResources = json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?(@.MaxResource != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,pm.NewResources),CODE:{
	[h:setProperty("a5e.stat.AllFeatures",json.path.putcarefully(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]","Resource",evalMacro(json.get(ability,"MaxResource"))))]
}]

[h,MACRO("CreatePlayerClassMacro@Lib:pm.a5e.Core"): json.set("","AbilityList",pm.NewButtons,"ParentToken",ParentToken)]