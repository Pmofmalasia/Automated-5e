[h:pm.AddAbilityData = arg(0)]
[h:pm.Ability=json.get(pm.AddAbilityData,"Name")]
[h:pm.Class=json.get(pm.AddAbilityData,"Class")]
[h:pm.Subclass=json.get(pm.AddAbilityData,"Subclass")]
[h:IsTooltip=json.get(pm.AddAbilityData,"Tooltip")]
[h:ParentToken=json.get(pm.AddAbilityData,"ParentToken")]
[h:pm.AbilityDisplay=json.get(pm.AddAbilityData,"DisplayName")]
[h:pm.ChoiceNum = json.get(arg(1),"Number")]
[h:pm.ActivateNew = json.get(arg(1),"Active")]
[h:pm.FromCharacter = json.get(arg(1),"Character")]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:pm.PassiveFunction("FeatureChoiceNum")]

[h:pm.LevelPrereq = pm.GetAbilityLevel(pm.AddAbilityData)]
[h:pm.CurrentAbilitiesTemp = json.path.read(allAbilities,"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.IsActive > 0)]")]
[h:"<!-- Must grab the Library versions of each ability - since ability objects go through processing before put on the token, they will not be considered 'equal' for comparison later. -->"]
[h:pm.CurrentAbilities = "[]"]
[h,foreach(ability,pm.CurrentAbilitiesTemp),CODE:{
	[h:pm.CurrentAbilities = json.merge(pm.CurrentAbilities,json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"' && @.Master.Name=='"+json.get(json.get(ability,"Master"),"Name")+"' && @.Master.Class=='"+json.get(json.get(ability,"Master"),"Class")+"' && @.Master.Subclass=='"+json.get(json.get(ability,"Master"),"Subclass")+"')]"))]
}]

[h:"<!-- From character means that the abilities to choose from are a limited list on the character (e.g. Alchemist Infusions have a BIG list, they know X amount from that list, and have Y active at one time). -->"]
[h,if(pm.FromCharacter == 1),CODE:{
	[h:pm.TempAbilitiesList = json.path.read(allAbilities,"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"')]")]
	[h:pm.AbilitiesList = "[]"]
	[h,foreach(ability,pm.TempAbilitiesList): pm.AbilitiesList = json.merge(pm.AbilitiesList,json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"' && @.Master.Name=='"+json.get(json.get(ability,"Master"),"Name")+"' && @.Master.Class=='"+json.get(json.get(ability,"Master"),"Class")+"' && @.Master.Subclass=='"+json.get(json.get(ability,"Master"),"Subclass")+"')]"))]
};{
	[h:pm.AbilitiesList = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.Level<="+pm.LevelPrereq+")]")]
	
	[h:tempAbilitiesWithPrereqs = json.path.read(pm.AbilitiesList,"[*][?(@.Prereqs!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,foreach(feature,tempAbilitiesWithPrereqs),CODE:{
		[h:pm.a5e.CheckFeaturePrereqs(json.get(feature,"Prereqs"))]
		[h,if(!macro.return): pm.AbilitiesList = json.path.delete(pm.AbilitiesList,"[*][?(@.Name=='"+json.get(feature,"Name")+"' && @.Class=='"+json.get(feature,"Class")+"' && @.Subclass=='"+json.get(feature,"Subclass")+"')]")]
	}]
}]

[h:pm.AbilitiesList = json.sort(pm.AbilitiesList,"a","Name")]

[h,if(IsTooltip),CODE:{
	[h:pm.AbilitiesChosenStr = json.toList(json.path.read(allAbilities,"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.IsActive > 0)]['DisplayName']"),if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName())=="",if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),"Default")==1,"<br>",", "),if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName())==1,"<br>",", ")))]
};{
	[h:pm.SelectionInput = "junkVar | Choose "+pm.ChoiceNum+" of the following "+pm.AbilityDisplay+" "+if(substring(pm.AbilityDisplay,length(pm.AbilityDisplay)-1)=="s","abilities","")+" |  | LABEL | SPAN=TRUE "]
	[h,foreach(ability,pm.AbilitiesList),CODE:{
		[h:set("pm.Choose"+json.get(ability,"Name"),if(json.isEmpty(json.path.read(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"' && @.IsActive > 0)]")),0,1))]
		[h:pm.SelectionInput = listAppend(pm.SelectionInput," pm.Choose"+json.get(ability,"Name")+" | "+eval("pm.Choose"+json.get(ability,"Name"))+" | "+json.get(ability,"DisplayName")+" | CHECK ","##")]
	}]
	
	[h:abort(input(pm.SelectionInput))]
	
	[h:pm.ChosenAbilities = ""]
	[h,foreach(ability,pm.AbilitiesList),CODE:{
		[h:pm.AbilityChosenTest = eval("pm.Choose"+json.get(ability,"Name"))]
		[h,if(pm.AbilityChosenTest): pm.ChosenAbilities = json.append(pm.ChosenAbilities,ability)]
	}]
	
	[h:pm.NewAbilities = json.difference(pm.ChosenAbilities,pm.CurrentAbilities)]
	[h:pm.RemovedAbilities = json.difference(pm.CurrentAbilities,pm.ChosenAbilities)]
	[h,MACRO("New Ability Processing@Lib:pm.a5e.Core"): json.set("","Abilities",pm.NewAbilities)]
	[h,MACRO("New Ability Addition@Lib:pm.a5e.Core"): macro.return]
	[h,MACRO("Ability Removal@Lib:pm.a5e.Core"): pm.RemovedAbilities]
	
	[h:pm.AbilitiesChosenStr = json.toList(json.path.read(allAbilities,"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.IsActive > 0)]['DisplayName']"),if(getLibProperty("VerticalDisplay","Lib:pm.a5e.Core")==1,"<br>",", "))]
}]

[h:macro.return = json.set("","ShowIfCondensed",1,"Header",pm.AbilityDisplay+" Abilities Chosen","FalseHeader","","FullContents","","RulesContents",pm.AbilitiesChosenStr,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value","","Units","")]