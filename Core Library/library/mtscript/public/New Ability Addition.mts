[h:pm.NewAbilities = json.get(macro.args,"Abilities")]
[h:pm.NewButtons = json.get(macro.args,"Buttons")]

[h:pm.DisplayNewAbilities = ""]
[h,foreach(ability,pm.NewAbilities),CODE:{
	[h:allAbilities = json.append(allAbilities,json.set(ability,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None"))]
	[h:pm.DisplayNewAbilities = listAppend(pm.DisplayNewAbilities,json.get(ability,"DisplayName"),"<br>")]
}]

[h,if(json.isEmpty(allAbilities)): pm.NewResources = ""; pm.NewResources = json.path.read(allAbilities,"[*][?(@.MaxResource != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,pm.NewResources),CODE:{
	[h:allAbilities = json.path.put(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]","Resource",evalMacro(json.get(ability,"MaxResource")))]
}]

[h,MACRO("CreatePlayerClassMacro@Lib:pm.a5e.Core"): json.set("","AbilityList",pm.NewButtons,"ParentToken",ParentToken)]