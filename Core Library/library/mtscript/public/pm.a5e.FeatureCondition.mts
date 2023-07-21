[h:pm.ConditionNames = json.get(arg(1),"Conditions")]
[h:pm.ChoiceNumber = if(json.get(arg(1),"ChoiceNumber")=="",0,json.get(arg(1),"ChoiceNumber"))]

[h:pm.IsToggle = number(json.get(arg(2),"Toggle"))]
[h:pm.Duration = json.get(arg(2),"Value")]
[h:pm.DurationUnits = json.get(arg(2),"Units")]
[h:pm.AdvancePoint = json.get(arg(2),"AdvancePoint")]
[h:pm.AuraRange = if(json.get(arg(2),"AuraRange")=="",0,json.get(arg(2),"AuraRange"))]
[h:pm.AuraUnits = json.get(arg(2),"AuraUnits")]

[h,if(argCount()>3): pm.ConditionEndTriggers = if(arg(3)=="","{}",arg(3)); pm.ConditionEndTriggers = ""]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(json.type(pm.ConditionNames) == "OBJECT"): pm.ConditionNames = json.append("",pm.ConditionNames)]
[h:AssociatedConditionsInfo = json.path.read(pm.ConditionNames,"[*][?(@.AssociatedConditions == 1)]")]
[h,if(!json.isEmpty(AssociatedConditionsInfo)),CODE:{
	[h:AssociatedConditions = json.path.read(data.getData("addon:","pm.a5e.core","sb.Conditions"),"[*][?(@.Master.Name == '"+currentFeatureName+"' && @.Master.Class == '"+currentFeatureClass+"' && @.Master.Subclass == '"+currentFeatureSubclass+"')]")]
	[h:assert(!json.isEmpty(pm.ConditionNames),"No associated conditions found!")]

	[h:AssociatedConditionsInfo = json.get(AssociatedConditionsInfo,0)]
	[h:AssociatedConditions = json.path.put(AssociatedConditions,"[*]","AlwaysAdded",json.get(AssociatedConditionsInfo,"AlwaysAdded"))]

	[h:pm.ConditionNames = json.path.delete(pm.ConditionNames,"[*][?(@.AssociatedConditions == 1)]")]
	[h:pm.ConditionNames = json.merge(pm.ConditionNames,AssociatedConditions)]
};{}]
[h:pm.ConditionNum = json.length(pm.ConditionNames)]

[h:pm.ConditionEndInfo = json.set("",
	"Duration",pm.Duration,
	"DurationUnits",pm.DurationUnits,
	"AdvancePoint",pm.AdvancePoint,
	"AuraRange",pm.AuraRange,
	"AuraUnits",pm.AuraUnits,
	"EndTriggers",pm.ConditionEndTriggers
)]

[h:pm.GroupIDTest = json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+currentFeatureName+"' && @.Class == '"+currentFeatureClass+"' && @.Subclass == '"+currentFeatureSubclass+"' && @.GroupID != null)]['GroupID']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(json.isEmpty(pm.GroupIDTest)): pm.ActiveConditionTest = 0; pm.ActiveConditionTest = !json.isEmpty(json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?(@.GroupID == '"+json.get(pm.GroupIDTest,0)+"')]","DEFAULT_PATH_LEAF_TO_NULL"))]

[h,if(pm.IsToggle),CODE:{
	[h,SWITCH(IsTooltip+""+pm.ActiveConditionTest),CODE:
		case "10":{
			[h:json.set("","Toggle",1,"IsActive",1)]
			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Active?",
				"FalseHeader","",
				"FullContents","",
				"RulesContents","No",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};
		case "11":{
			[h:pm.CurrentDuration = pm.DurationDisplay(json.get(json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?(@.GroupID=="+json.get(pm.GroupIDTest,0)+")]['Duration']"),0))]
			[h:json.set("","Toggle",1,"IsActive",0)]
			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Active?",
				"FalseHeader","",
				"FullContents","",
				"RulesContents","Yes, "+pm.CurrentDuration+" remaining.",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};
		case "00":{
			[h:pm.ConditionInfo = pm.a5e.ChooseCondition(pm.ConditionNames,pm.ChoiceNumber)]
			[h:pm.GroupID = pm.a5e.CreateConditionID(ParentToken)]
			[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): json.set("",
				"Conditions",pm.ConditionInfo,
				"EndInfo",pm.ConditionEndInfo,
				"SetBy",ParentToken,
				"Target",ParentToken,
				"GroupID",pm.GroupID
			)]
			[h,if(json.isEmpty(pm.GroupIDTest)):
				setProperty("a5e.stat.AllFeatures",json.path.put(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+currentFeatureName+"' && @.Class == '"+currentFeatureClass+"' && @.Subclass == '"+currentFeatureSubclass+"')]","GroupID",pm.GroupID));
				setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+currentFeatureName+"' && @.Class == '"+currentFeatureClass+"' && @.Subclass == '"+currentFeatureSubclass+"')]['GroupID']",pm.GroupID))
			]
			[h:json.set("","ConditionInfo",pm.ConditionInfo,"Toggle",1,"IsActive",1)]
			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Condition"+if(pm.ConditionNum>1,"s","")+" Activated",
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.toList(json.path.read(pm.ConditionInfo,"[*]['DisplayName']"),", "),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};
		case "01":{
			[h:pm.CurrentID = json.get(pm.GroupIDTest,0)]
			[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",pm.CurrentID,"Target",ParentToken)]
			[h:abilityTable = json.get(macro.return,"Table")]

			[h:setProperty("a5e.stat.AllFeatures",json.path.delete(getProperty("a5e.stat.AllFeatures"),"[*][?(@.Name == '"+currentFeatureName+"' && @.Class == '"+currentFeatureClass+"' && @.Subclass == '"+currentFeatureSubclass+"')]['GroupID']"))]
			[h:FeatureDescription=""]
			[h:pm.a5e.EffectData = json.append("",json.set("","Class",currentFeatureClass))]
			[h:abilityClass = currentFeatureClass]
			[h:pm.a5e.FeatureFormatCall()]
			[h:abort(0)]
		}
	]
};{
	[h:pm.ConditionInfo = pm.a5e.ChooseCondition(pm.ConditionNames,pm.ChoiceNumber)]
	[h:pm.ConditionNames = pm.a5e.CreateDisplayList(json.path.read(pm.ConditionInfo,"[*]['DisplayName']"),"and")]
	[h,if(IsTooltip),CODE:{
		[h:oldDataPlacehold = json.set("","ConditionInfo",json.set("","Conditions",pm.ConditionInfo,"EndInfo",pm.ConditionEndInfo),"Toggle",0)]
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Conditions Applied",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.ConditionNames,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Conditions Applied",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.ConditionNames,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
		
		[h:pm.ConditionsToSet = json.set("","Conditions",pm.ConditionInfo,"EndInfo",pm.ConditionEndInfo)]

		[h:effectsToMerge = json.append("",json.set("","ConditionInfo",pm.ConditionsToSet))]
		[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

		[h:pm.a5e.EffectData = macro.return]
	}]		
}]