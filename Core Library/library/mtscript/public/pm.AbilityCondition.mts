[h:abilityInfo = arg(0)]
[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h:pm.ConditionNames = json.get(arg(1),"Conditions")]
[h:pm.ConditionNum = json.length(pm.ConditionNames)]
[h:pm.ChoiceMethod = if(json.get(arg(1),"Choice")=="","All",json.get(arg(1),"Choice"))]

[h:pm.IsToggle = json.get(arg(2),"Toggle")]

[h:pm.Duration = json.get(arg(2),"Duration")]
[h:pm.DurationUnits = json.get(arg(2),"DurationUnits")]
[h:pm.AdvancePoint = json.get(arg(2),"AdvancePoint")]
[h:pm.AuraRange = if(json.get(arg(2),"AuraRange")=="",0,json.get(arg(2),"AuraRange"))]
[h:pm.AuraUnits = json.get(arg(2),"AuraUnits")]

[h,if(argCount()>3): pm.ConditionEndTriggers = ""; pm.ConditionEndTriggers = if(arg(3)=="","{}",arg(3))]

[h:pm.ConditionEndInfo = json.set("",
	"Duration",pm.Duration,
	"DurationUnits",pm.DurationUnits,
	"AdvancePoint",pm.AdvancePoint,
	"AuraRange",pm.AuraRange,
	"AuraUnits",pm.AuraUnits,
	"EndTriggers",pm.ConditionEndTriggers
)]

[h:pm.GroupIDTest = json.path.read(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"' && @.GroupID != null)]['GroupID']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(json.isEmpty(pm.GroupIDTest)): pm.ActiveConditionTest = 0; pm.ActiveConditionTest = !json.isEmpty(json.path.read(ConditionList,"[*][?(@.GroupID == '"+json.get(pm.GroupIDTest,0)+"')]","DEFAULT_PATH_LEAF_TO_NULL"))]

[h,if(pm.IsToggle),CODE:{
	[h,SWITCH(pm.Tooltip+""+pm.ActiveConditionTest),CODE:
		case "10":{
			[h:macro.return = json.set("","Table",json.set("","ShowIfCondensed",1,"Header","Active?","FalseHeader","","FullContents","","RulesContents","No","RollContents","","DisplayOrder","['Rules','Roll','Full']"),"Toggle",1,"IsActive",1)]
		};
		case "11":{
			[h:pm.CurrentDuration = pm.DurationDisplay(json.get(json.path.read(ConditionList,"[*][?(@.GroupID=="+json.get(pm.GroupIDTest,0)+")]['Duration']"),0))]
			[h:macro.return = json.set("","Table",json.set("","ShowIfCondensed",1,"Header","Active?","FalseHeader","","FullContents","","RulesContents","Yes, "+pm.CurrentDuration+" remaining.","RollContents","","DisplayOrder","['Rules','Roll','Full']"),"Toggle",1,"IsActive",0)]
		};
		case "00":{
			[h:pm.ConditionInfo = pm.a5e.ChooseCondition(pm.ConditionNames,pm.ChoiceMethod)]
			[h:pm.GroupID = pm.a5e.CreateConditionID(ParentToken)]
			[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): json.set("",
				"Conditions",pm.ConditionInfo,
				"EndInfo",pm.ConditionEndInfo,
				"SetBy",ParentToken,
				"Target",ParentToken,
				"GroupID",pm.GroupID
			)]
			[h,if(json.isEmpty(pm.GroupIDTest)):
				allAbilities = json.path.put(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"')]","GroupID",pm.GroupID);
				allAbilities = json.path.set(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"')]['GroupID']",pm.GroupID)
			]
			
			[h:macro.return = json.set("","Table",json.set("","ShowIfCondensed",1,"Header","Condition"+if(pm.ConditionNum>1,"s","")+" Activated","FalseHeader","","FullContents","","RulesContents",json.toList(json.path.read(pm.ConditionInfo,"[*]['DisplayName']"),", "),"RollContents","","DisplayOrder","['Rules','Roll','Full']"),"ConditionInfo",pm.ConditionInfo,"Toggle",1,"IsActive",1)]
		};
		case "01":{
			[h:pm.CurrentID = json.get(pm.GroupIDTest,0)]
			[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",pm.CurrentID,"ParentToken",ParentToken)]
			[h:pm.CondRemovedList = json.toList(json.path.read(json.get(macro.return,"Removed"),"[*]['DisplayName']"),", ")]
			[h:abilityTable = json.append(json.get(macro.return,"Table"),json.set("","ShowIfCondensed",1,"Header","Condition"+if(pm.ConditionNum>1,"s","")+" Deactivated","FalseHeader","","FullContents","","RulesContents",pm.CondRemovedList,"RollContents","","DisplayOrder","['Rules','Roll','Full']"))]
			[h:allAbilities = json.path.delete(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"')]['GroupID']")]
			[h:abilityEffect=""]
			[h:pm.AbilityFormatCall()]
			[h:abort(0)]
		}
	]
};{
	[h:pm.ConditionInfo = pm.a5e.ChooseCondition(pm.ConditionNames,pm.ChoiceMethod)]
	[h:pm.ConditionNames = json.toList(json.path.read(pm.ConditionInfo,"[*]['DisplayName']"))]
	[h,if(pm.Tooltip),CODE:{
		[h:macro.return = json.set("","Table",json.set("","ShowIfCondensed",1,"Header","Conditions Applied","FalseHeader","","FullContents","","RulesContents",pm.ConditionNames,"RollContents","","DisplayOrder","['Rules','Roll','Full']"),"ConditionInfo",json.set("","Conditions",pm.ConditionInfo,"EndInfo",pm.ConditionEndInfo),"Toggle",0)]
	};{
		[h:ApplyConditionLink = macroLinkText("ApplyCondition@Lib:pm.a5e.Core","all",json.set("",
				"Conditions",pm.ConditionInfo,
				"EndInfo",pm.ConditionEndInfo,
				"SetBy",ParentToken
			),"selected")
		]
		[h:macro.return = json.set("","Table",json.set("","ShowIfCondensed",1,"Header","Conditions Applied","FalseHeader","","FullContents","","RulesContents",pm.ConditionNames+": <a href='"+ApplyConditionLink+"'><span style='color:"+pm.LinkColor()+"'>Select Target(s) and Click to Apply</span></a>","RollContents","","DisplayOrder","['Rules','Roll','Full']"),"ConditionInfo",json.set("","Conditions",pm.ConditionInfo,"EndInfo",pm.ConditionEndInfo),"Toggle",0)]
	}]		
}]