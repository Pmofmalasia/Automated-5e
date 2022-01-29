[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.AbilityDisplay=json.get(arg(0),"DisplayName")]
[h:pm.OptionsNum = json.get(arg(1),"Number")]
[h:pm.ActivateNew = json.get(arg(1),"Active")]
[h:pm.FromCharacter = json.get(arg(1),"Character")]

[h:pm.LevelPrereq = pm.GetAbilityLevel(arg(0))]
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
}]

[h:pm.AbilitiesList = json.sort(pm.AbilitiesList,"a","Name")]

[h,if(pm.Tooltip),CODE:{
	[h:pm.AbilitiesChosenStr = json.toList(json.path.read(allAbilities,"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.IsActive > 0)]['DisplayName']"),if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName())=="",if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),"Default")==1,"<br>",", "),if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName())==1,"<br>",", ")))]
};{
	[h:pm.AbilitiesChosenStr = json.toList(json.path.read(allAbilities,"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.IsActive > 0)]['DisplayName']"),if(getLibProperty("VerticalDisplay","Lib:pm.a5e.Core")==1,"<br>",", "))]
	[h:pm.SelectionInput = "junkVar | Choose "+pm.OptionsNum+" of the following "+pm.AbilityDisplay+" abilities |  | LABEL | SPAN=TRUE "]
	[h,foreach(ability,pm.AbilitiesList),CODE:{
		[h:set("pm.Choose"+json.get(ability,"Name"),if(json.isEmpty(json.path.read(allAbilities,"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"' && @.IsActive > 0)]")),0,1))]
		[h:pm.SelectionInput = if(pm.Tooltip,"",listAppend(pm.SelectionInput," pm.Choose"+json.get(ability,"Name")+" | "+eval("pm.Choose"+json.get(ability,"Name"))+" | "+json.get(ability,"DisplayName")+" | CHECK ","##"))]
	}]
	
	[h:abort(input(pm.SelectionInput))]
	
	[h:pm.ChosenAbilities = ""]
	[h,foreach(ability,pm.AbilitiesList),CODE:{
		[h:pm.AbilityChosenTest = eval("pm.Choose"+json.get(ability,"Name"))]
		[h,if(pm.AbilityChosenTest): pm.ChosenAbilities = json.append(pm.ChosenAbilities,ability)]
	}]
	
	[h:pm.NewAbilities = json.difference(pm.ChosenAbilities,pm.CurrentAbilities)]
	[h:pm.RemovedAbilities = json.difference(pm.AbilitiesList,pm.ChosenAbilities)]
	[h,MACRO("New Ability Processing@Lib:pm.a5e.Core"): json.set("","Abilities",pm.NewAbilities)]
	[h,MACRO("New Ability Addition@Lib:pm.a5e.Core"): macro.return]
	[h,MACRO("Ability Removal@Lib:pm.a5e.Core"): pm.RemovedAbilities]
	
	[h:pm.AbilitiesChosenStr = json.toList(json.path.read(allAbilities,"[?(@.Master.Name=='"+pm.Ability+"' && @.Master.Class=='"+pm.Class+"' && @.Master.Subclass=='"+pm.Subclass+"' && @.IsActive > 0)]['DisplayName']"),if(getLibProperty("VerticalDisplay","Lib:pm.a5e.Core")==1,"<br>",", "))]
}]

[h:macro.return = json.set("","ShowIfCondensed",1,"Header",pm.AbilityDisplay+" Abilities Chosen","FalseHeader","","FullContents","","RulesContents",pm.AbilitiesChosenStr,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value","","Units","")]