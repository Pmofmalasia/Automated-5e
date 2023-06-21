[h:pm.ChoiceNum = json.get(arg(1),"Number")]
[h:pm.ActivateNew = json.get(arg(1),"Active")]
[h:pm.FromCharacter = json.get(arg(1),"Character")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:pm.PassiveFunction("FeatureChoiceNum")]

[h:pm.CurrentAbilitiesTemp = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Master.Name=='"+currentFeatureName+"' && @.Master.Class=='"+currentFeatureClass+"' && @.Master.Subclass=='"+currentFeatureSubclass+"' && @.IsActive > 0)]")]
[h:"<!-- Must grab the Library versions of each ability - since ability objects go through processing before put on the token, they will not be considered 'equal' for comparison later. -->"]
[h:pm.CurrentAbilities = "[]"]
[h,foreach(ability,pm.CurrentAbilitiesTemp),CODE:{
	[h:pm.CurrentAbilities = json.merge(pm.CurrentAbilities,json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"' && @.Master.Name=='"+json.get(json.get(ability,"Master"),"Name")+"' && @.Master.Class=='"+json.get(json.get(ability,"Master"),"Class")+"' && @.Master.Subclass=='"+json.get(json.get(ability,"Master"),"Subclass")+"')]"))]
}]

[h:"<!-- From character means that the abilities to choose from are a limited list on the character (e.g. Alchemist Infusions have a BIG list, they know X amount from that list, and have Y active at one time). -->"]
[h,if(pm.FromCharacter == 1),CODE:{
	[h:pm.TempAbilitiesList = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Master.Name=='"+currentFeatureName+"' && @.Master.Class=='"+currentFeatureClass+"' && @.Master.Subclass=='"+currentFeatureSubclass+"')]")]
	[h:pm.AbilitiesList = "[]"]
	[h,foreach(ability,pm.TempAbilitiesList): pm.AbilitiesList = json.merge(pm.AbilitiesList,json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"' && @.Master.Name=='"+json.get(json.get(ability,"Master"),"Name")+"' && @.Master.Class=='"+json.get(json.get(ability,"Master"),"Class")+"' && @.Master.Subclass=='"+json.get(json.get(ability,"Master"),"Subclass")+"')]"))]
};{
	[h:pm.AbilitiesList = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Master.Name=='"+currentFeatureName+"' && @.Master.Class=='"+currentFeatureClass+"' && @.Master.Subclass=='"+currentFeatureSubclass+"' && @.Level<="+currentFeatureLevel+")]")]
	
	[h:tempAbilitiesWithPrereqs = json.path.read(pm.AbilitiesList,"[*][?(@.Prereqs!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,foreach(feature,tempAbilitiesWithPrereqs),CODE:{
		[h:pm.a5e.CheckFeaturePrereqs(json.set(json.get(feature,"Prereqs"),"ParentToken",ParentToken))]
		[h,if(!macro.return): pm.AbilitiesList = json.path.delete(pm.AbilitiesList,"[*][?(@.Name=='"+json.get(feature,"Name")+"' && @.Class=='"+json.get(feature,"Class")+"' && @.Subclass=='"+json.get(feature,"Subclass")+"')]")]
	}]
}]

[h:pm.AbilitiesList = json.sort(pm.AbilitiesList,"a","Name")]

[h,if(IsTooltip),CODE:{
	[h:pm.AbilitiesChosenStr = json.toList(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Master.Name=='"+currentFeatureName+"' && @.Master.Class=='"+currentFeatureClass+"' && @.Master.Subclass=='"+currentFeatureSubclass+"' && @.IsActive > 0)]['DisplayName']"),if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName())=="",if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),"Default")==1,"<br>",", "),if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName())==1,"<br>",", ")))]
};{
	[h:pm.SelectionInput = "junkVar | Choose "+pm.ChoiceNum+" of the following "+currentFeatureDisplayName+" "+if(substring(currentFeatureDisplayName,length(currentFeatureDisplayName)-1)=="s","abilities","")+" |  | LABEL | SPAN=TRUE "]
	[h,foreach(ability,pm.AbilitiesList),CODE:{
		[h:set("pm.Choose"+json.get(ability,"Name"),if(json.isEmpty(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+json.get(ability,"Name")+"' && @.Master.Name=='"+currentFeatureName+"' && @.Master.Class=='"+currentFeatureClass+"' && @.Master.Subclass=='"+currentFeatureSubclass+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"' && @.IsActive > 0)]")),0,1))]
		[h:pm.SelectionInput = listAppend(pm.SelectionInput," pm.Choose"+json.get(ability,"Name")+" | "+eval("pm.Choose"+json.get(ability,"Name"))+" | "+json.get(ability,"DisplayName")+" | CHECK ","##")]
	}]
	
	[h:abort(input(pm.SelectionInput))]
	
	[h:pm.ChosenAbilities = ""]
	[h,foreach(ability,pm.AbilitiesList),CODE:{
		[h:currentFeatureNameChosenTest = eval("pm.Choose"+json.get(ability,"Name"))]
		[h,if(currentFeatureNameChosenTest): pm.ChosenAbilities = json.append(pm.ChosenAbilities,ability)]
	}]
	
	[h:pm.NewAbilities = json.difference(pm.ChosenAbilities,pm.CurrentAbilities)]
	[h:pm.RemovedAbilities = json.difference(pm.CurrentAbilities,pm.ChosenAbilities)]
	[h,MACRO("NewAbilityProcessing@Lib:pm.a5e.Core"): json.set("","Abilities",pm.NewAbilities,"ParentToken",ParentToken)]
	[h,MACRO("NewFeatureAddition@Lib:pm.a5e.Core"): json.set(macro.return,"ParentToken",ParentToken)]
	[h,MACRO("FeatureRemoval@Lib:pm.a5e.Core"): json.set("","Features",pm.RemovedAbilities,"ParentToken",ParentToken)]
	
	[h:pm.AbilitiesChosenStr = json.toList(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Master.Name=='"+currentFeatureName+"' && @.Master.Class=='"+currentFeatureClass+"' && @.Master.Subclass=='"+currentFeatureSubclass+"' && @.IsActive > 0)]['DisplayName']"),if(getLibProperty("VerticalDisplay","Lib:pm.a5e.Core")==1,"<br>",", "))]
}]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",currentFeatureDisplayName+" Abilities Chosen",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.AbilitiesChosenStr,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]