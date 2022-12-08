[h:effFull = macro.args]
[h:effToResolve = json.get(effFull,"ToResolve")]

[h:"<!-- ColorSubtype is optional - for classes with multiple border colors stored in an object (denotes key to get from that object, mostly for spells) -->"]
[h:effID = json.get(effFull,"ID")]
[h:effClass = json.get(effFull,"Class")]
[h:effClassForDisplay = json.get(effFull,"ClassForDisplay")]
[h:effColorSubtype = json.get(effFull,"ColorSubtype")]
[h:ParentToken = json.get(effFull,"ParentToken")]
[h:effTargets = json.get(effFull,"Targets")]
[h:effConditionGroupID = pm.a5e.CreateConditionID(ParentToken,effTargets)]

[h:effTargetSpecific = json.get(effToResolve,"TargetSpecificEffects")]
[h:effConditionInfo = json.get(effToResolve,"ConditionInfo")]
[h,switch(json.type(effConditionInfo)):
    case "OBJECT": effConditionInfo = json.append("",effConditionInfo);
    case "ARRAY": effConditionInfo = effConditionInfo;
    case "UNKNOWN": effConditionInfo = "[]"
]
[h:effConditionsRemovedInfo = json.get(effToResolve,"ConditionsRemovedInfo")]
[h:effDamageData = json.get(effToResolve,"Damage")]
[h:effAttackData = json.get(effToResolve,"Attack")]
[h:effCheckDCData = json.get(effToResolve,"CheckDC")]
[h:effSaveDCData = json.get(effToResolve,"SaveDC")]

[h:effAllConditionIdentifiers = ""]
[h,foreach(conditionSet,effConditionInfo),CODE:{
    [h,foreach(tempCondition,json.get(conditionSet,"Conditions")): effAllConditionIdentifiers = json.append(effAllConditionIdentifiers,json.set("","Name",json.get(tempCondition,"Name"),"Class",json.get(tempCondition,"Class"),"Subclass",json.get(tempCondition,"Subclass")))]
}]
[h,if(effSaveDCData==""): effSavesMadeData = "{}"; effSavesMadeData = if(json.get(effSaveDCData,"SavesMade")=="","{}",json.get(effSaveDCData,"SavesMade"))]
[h,if(effCheckDCData==""): effChecksMadeData = "{}"; effChecksMadeData = if(json.get(effCheckDCData,"ChecksMade")=="","{}",json.get(effCheckDCData,"ChecksMade"))]

[h:needsFurtherResolution = 0]
[h:remainingTargetsList = "[]"]

[h:abilityTable = "[]"]
[h,foreach(targetToken,effTargets),CODE:{
    [h:thisTokenInputDisplay = "junkVar | "+getTokenImage("",targetToken)+" | Resolving Effects on "+getName(targetToken)+" | LABEL | ICON=TRUE "]
	[h:thisTokenAttackData = effAttackData]
	[h:thisTokenSaveDCData = effSaveDCData]
	[h:thisTokenCheckDCData = effCheckDCData]
	[h:thisTokenDamageDealt = effDamageData]
	[h:thisTokenConditionInfo = effConditionInfo]
	[h:thisTokenConditionsRemovedInfo = effConditionsRemovedInfo]
    [h:thisTokenConditionsApplied = effAllConditionIdentifiers]
	[h:switchToken(targetToken)]

	[h,if(json.length(effTargets)>1):
		abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",token.name,
		"FalseHeader","",
		"FullContents","",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
		))
	]

	[h,if(thisTokenAttackData!=""),CODE:{
		[h:attackToHit = json.get(thisTokenAttackData,"ToHit")]
		[h:attackCrit = json.get(thisTokenAttackData,"CritTest")]
		[h:attackCritFail = json.get(thisTokenAttackData,"CritFailTest")]
		[h:hitTarget = and(!attackCritFail,or(attackCrit,attackToHit >= getProperty("a5e.stat.AC")))]
	};{
		[h:hitTarget = 1]
	}]
	
	[h,if(!hitTarget),CODE:{
		[h:broadcast("miss")]
		[h:thisTokenSaveDCData = ""]
		[h:thisTokenCheckDCData = ""]
		[h:thisTokenDamageDealt = ""]
		[h:thisTokenConditionInfo = "[]"]
		[h:thisTokenConditionsApplied = json.append("",json.set("","Conditions","[]","EndInfo","{}"))]
		[h:thisTokenConditionsRemovedInfo = "{}"]
		[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Attack Missed",
		"FalseHeader","",
		"FullContents","",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{}]

	[h,if(thisTokenSaveDCData!=""): needsToSave = json.get(effSavesMadeData,targetToken)==""; needsToSave = 0]

	[h:"<!-- Wish this could be an if/else but CODE block limits say no -->"]
	[h,switch((thisTokenSaveDCData!="")+""+(needsToSave)),CODE:
		case "11":{
			[h,MACRO("Save@Lib:pm.a5e.Core"): json.set("","Save",json.get(thisTokenSaveDCData,"SaveType"),"Type","Save","ParentToken",targetToken,"ID",effID)]
			[h:SaveResult = macro.return]
			[h:effSavesMadeData = json.set(effSavesMadeData,targetToken,SaveResult)]
			[h:abilityTable = json.merge(abilityTable,json.get(SaveResult,"Table"))]

			[h:autoResultTest = !isNumber(json.get(SaveResult,"Value"))]
			[h,if(autoResultTest):
				passedSave = (json.get(SaveResult,"Value")=="AutoSuccess");
				passedSave = 0
			]
			[h,switch(autoResultTest+""+passedSave):
				case "11": pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenSaveDCData));
				case "10": pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenSaveDCData));
				case "00": needsFurtherResolution = 1
			]
		};
		case "10":{
			[h:SaveResult = json.get(effSavesMadeData,targetToken)]
			[h:passedSave = json.get(SaveResult,"Value")>=json.get(thisTokenSaveDCData,"DC")]
			[h,if(passedSave==1):
				pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenSaveDCData));
				pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenSaveDCData))
			]
			[h:abilityTable = json.merge(abilityTable,json.get(SaveResult,"Table"))]
		};
		default:{}
	]

	[h,if(thisTokenCheckDCData!=""): needsToCheck = json.get(effChecksMadeData,targetToken)==""; needsToCheck = 0]

	[h,switch((thisTokenCheckDCData!="")+""+(needsToCheck)),CODE:
		case "11":{
			[h:effCheckDCType = json.get(thisTokenCheckDCData,"CheckType")]
			[h:multiCheckDCTypeTest = json.type(effCheckDCType) == "ARRAY"]
			[h,if(!multiCheckDCTypeTest): effCheckDCType = json.append("",effCheckDCType)]
			[h:CheckDCOptionNames = ""]
			
			[h,foreach(CheckDCOption,effCheckDCType): CheckDCOptionNames = json.append(CheckDCOptionNames,if(json.get(CheckDCOption,"Type")=="Initiative","Initiative",pm.GetDisplayName(json.get(CheckDCOption,"Skill"),if(json.get(CheckDCOption,"Type")=="Skill","sb.Skills",if(json.get(CheckDCOption,"Type")=="Ability Score","sb.Attributes","sb.Tools")))))]
	
			[h,if(json.length(effCheckDCType)>0): 
				abort(input(
					thisTokenInputDisplay,
					" checkChoice | "+CheckDCOptionNames+" | Choose a Skill to Contest the Check DC | LIST | DELIMITER=JSON "
				));
				checkChoice = 0
			]
			
			[h:finalCheckDCData = json.get(effCheckDCType,checkChoice)]
			
			[h:"<!-- TODO: Add ability to select output targets (DM only, everyone, roller + DM) here, likely through some default settings -->"]
			[h,MACRO("Check@Lib:pm.a5e.Core"): json.set(finalCheckDCData,"ParentToken",targetToken,"ID",effID)]
			[h:CheckResult = macro.return]
			[h:effChecksMadeData = json.set(effChecksMadeData,targetToken,CheckResult)]
			[h:abilityTable = json.merge(abilityTable,json.get(CheckResult,"Table"))]
			
			[h:autoResultTest = !isNumber(json.get(CheckResult,"Value"))]
			[h,if(autoResultTest):
				passedCheck = (json.get(CheckResult,"Value")=="AutoSuccess");
				passedCheck = 0
			]
			[h,switch(autoResultTest+""+passedCheck):
				case "11": pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenCheckDCData));
				case "10": pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenCheckDCData));
				case "00": needsFurtherResolution = 1
			]
		};
		case "10":{
			[h:"<!-- Separate storage format for contested checks is so that it can be recognized on the effect filtering side of things as a contested check; as well as retain data needed to modify the check setting the DC -->"]
			[h:CheckResult = json.get(effChecksMadeData,targetToken)]
			[h:ContestedCheckTest = json.type(json.get(thisTokenCheckDCData,"DC")) == "OBJECT"]
			[h,if(ContestedCheckTest):
				DCValue = json.get(json.get(thisTokenCheckDCData,"DC"),"Value");
				DCValue = json.get(thisTokenCheckDCData,"DC")
			]
			
			[h,if(json.get(CheckResult,"Value") >= DCValue):
				pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenCheckDCData));
				pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenCheckDCData))
			]
			[h:abilityTable = json.merge(abilityTable,json.get(CheckResult,"Table"))]
		};
		default:{}
	]

	[h,if(needsFurtherResolution),CODE:{
		[h:thisTokenDamageDealt = ""]
		[h:thisTokenConditionInfo = "[]"]
		[h:thisTokenConditionsRemovedInfo = "{}"]
		[h:remainingTargetsList = json.append(remainingTargetsList,targetToken)]
	};{}]
	
	[h:"<!-- Note to future self: Add crit data to the damage info here. Will make processing abilities easier if they add/negate a crit. -->"]
	[h,if(thisTokenDamageDealt!=""),CODE:{
		[h,MACRO("Change HP@Lib:pm.a5e.Core"): json.set("","DamageDealt",thisTokenDamageDealt,"ParentToken",targetToken)]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	};{}]
	
	[h,foreach(conditionSet,thisTokenConditionInfo),CODE:{
		[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): json.set(conditionSet,
			"GroupID",effConditionGroupID,
			"Target",targetToken,
			"SetBy",ParentToken
		)]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	}]

	[h,if(!json.isEmpty(thisTokenConditionsRemovedInfo)),CODE:{
		[h:tempConditionsRemovedGroups = json.get(thisTokenConditionsRemovedInfo,"Groups")]
		[h,if(tempConditionsRemovedGroups == ""): tempConditionsRemovedGroups = "[]"]
		[h,if(json.type(tempConditionsRemovedGroups)=="UNKNOWN"): tempConditionsRemovedGroups = json.append("",tempConditionsRemovedGroups)]

		[h:tempConditionsRemovedNames = json.get(thisTokenConditionsRemovedInfo,"ConditionNames")]
		[h,if(tempConditionsRemovedNames == "ARRAY"): 
			tempConditionsRemovedGroups = json.merge(tempConditionsRemovedGroups,json.unique(json.path.read(getProperty("a5e.stat.ConditionList",targetToken),"[*][?(@.Name in "+tempConditionsRemovedNames+")]['GroupID']")));
			tempConditionsRemovedGroups = json.merge(tempConditionsRemovedGroups,json.path.read(getProperty("a5e.stat.ConditionList",targetToken),"[*][?(@.Name == '"+tempConditionsRemovedNames+"')]['GroupID']"))
		
		]

		[h:tempConditionsRemovedTypes = json.get(thisTokenConditionsRemovedInfo,"ConditionTypes")]
		[h,if(tempConditionsRemovedTypes == "ARRAY"): 
			tempConditionsRemovedGroups = json.merge(tempConditionsRemovedGroups,json.unique(json.path.read(getProperty("a5e.stat.ConditionList",targetToken),"[*][?(@.ConditionType in "+tempConditionsRemovedTypes+")]['GroupID']")));
			tempConditionsRemovedGroups = json.merge(tempConditionsRemovedGroups,json.path.read(getProperty("a5e.stat.ConditionList",targetToken),"[*][?(@.ConditionType == '"+tempConditionsRemovedTypes+"' && @.ConditionType != '')]['GroupID']"))
		]

		[h:tempEndConditionData = json.set("",
			"ParentToken",targetToken,
			"GroupID",tempConditionsRemovedGroups
		)]
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): tempEndConditionData]

		[h:cn.RemovedList = json.path.read(macro.return,"['Removed'][*]['DisplayName']")]
		[h,if(cn.RemovedList != ""): abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Conditions Removed",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.a5e.CreateDisplayList(cn.RemovedList,"and"),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]
}]

[h,if(!json.isEmpty(remainingTargetsList)),CODE:{
	[h:effFull = json.set(effFull,"Targets",remainingTargetsList)]

	[h:"<!-- This is awful. I am sorry. I blame CODE block limits. -->"]
	[h,if(json.get(effToResolve,"SaveDC")!=""): effFull = json.set(effFull,"ToResolve",json.set(json.get(effFull,"ToResolve"),"SaveDC",json.set(json.get(json.get(effFull,"ToResolve"),"SaveDC"),"SavesMade",effSavesMadeData)))]
	[h,if(json.get(effToResolve,"CheckDC")!=""): effFull = json.set(effFull,"ToResolve",json.set(json.get(effFull,"ToResolve"),"CheckDC",json.set(json.get(json.get(effFull,"ToResolve"),"CheckDC"),"ChecksMade",effChecksMadeData)))]

	[h:setLibProperty("gd.Effects",json.path.set(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effID+")]",effFull),"Lib:pm.a5e.Core")]
};{
	[h:setLibProperty("gd.Effects",json.path.delete(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effID+")]"),"Lib:pm.a5e.Core")]
}]

[h,MACRO("OpenEffectsFrame@Lib:pm.a5e.Core"): ""]

[h,if(ParentToken!=""): switchToken(ParentToken)]

[h,if(json.length(effTargets)==1): titleAddon = " on "+getName(json.get(effTargets,0)); titleAddon = ""]
[h:ClassFeatureData = json.set("",
	"Flavor","",
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class",if(effClassForDisplay=="",if(effClass=="","zzChecksAndSaves",effClass),effClassForDisplay),
	"ColorSubtype",effColorSubtype,
	"Name","Resolve Effects"+titleAddon,
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]

[h,if(json.length(effTargets)==1),CODE:{
    [h:broadcastAsToken(output.GM,"gm",",",json.get(effTargets,0))]
    [h:broadcastAsToken(output.PC,"not-gm",",",json.get(effTargets,0))]
};{
    [h:broadcastAsToken(output.GM,"gm")]
    [h:broadcastAsToken(output.PC,"not-gm")]
}]