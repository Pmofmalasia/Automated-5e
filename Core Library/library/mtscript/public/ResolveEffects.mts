[h:effFull = macro.args]
[h:effToResolve = json.get(effFull,"ToResolve")]

[h:"<!-- ColorSubtype is optional - for classes with multiple border colors stored in an object (denotes key to get from that object, mostly for spells) -->"]
[h:effID = json.get(effFull,"ID")]
[h:effClass = json.get(effFull,"Class")]
[h:effClassForDisplay = json.get(effFull,"ClassForDisplay")]
[h:effColorSubtype = json.get(effFull,"ColorSubtype")]
[h:ParentToken = json.get(effFull,"ParentToken")]
[h:parentStillAvailable = json.contains(getTokens("json"),ParentToken)]
[h,if(!parentStillAvailable): ParentToken = ""]

[h:effTargets = json.get(effFull,"Targets")]
[h:effTargets = json.intersection(getTokens("json"),effTargets)]
[h:effTargetedConditions = json.get(effFull,"TargetedConditions")]
[h:effConditionGroupID = pm.a5e.CreateConditionID(ParentToken,effTargets)]

[h,if(json.get(effFull,"SpecificTargets")!=""): effTargets = json.get(effFull,"SpecificTargets")]
[h:remainingTargetsList = json.intersection(getTokens("json"),json.get(effFull,"RemainingTargets"))]
[h:"<!-- MAYDO: May need a test to make sure the SpecificTargets are actually targets of the effect? But not sure how they would get here in the first place -->"]

[h:ParentEffect = json.get(effFull,"ParentSubeffect")]
[h,if(ParentEffect!=""),CODE:{
	[h:ParentEffectData = json.get(effFull,"ParentEffectData")]
	[h:ParentSubeffectRequirementData = json.get(effFull,"ParentSubeffectRequirements")]

	[h,switch(json.get(ParentSubeffectRequirementData,"Requirement")),CODE:
		case "Attack":{
			[h:isHitRequired = (json.get(ParentSubeffectRequirementData,"Result") == "Hit")]
			[h:ParentSubeffectRequirementsMet = (isHitRequired == json.get(ParentEffectData,"AttackHit"))]
			[h:AttackHitMargin = json.get(ParentEffectData,"AttackToHit") - json.get(ParentEffectData,"AttackACToHit")]
			[h,if(isHitRequired == 0): AttackHitMargin = AttackHitMargin * -1]
			[h,if(AttackHitMargin < json.get(ParentSubeffectRequirementData,"Margin")): ParentSubeffectRequirementsMet = 0]
		};
		case "Save":{
			[h:isPassRequired = (json.get(ParentSubeffectRequirementData,"Result") == "Pass")]
			[h:ParentSubeffectRequirementsMet = (isPassRequired == json.get(ParentEffectData,"SavePassed"))]
			[h:SavePassMargin = json.get(ParentEffectData,"SaveValue") - json.get(ParentEffectData,"SaveDCValue")]
			[h,if(isPassRequired == 0): SavePassMargin = SavePassMargin * -1]
			[h,if(SavePassMargin < json.get(ParentSubeffectRequirementData,"Margin")): ParentSubeffectRequirementsMet = 0]
		};
		case "Check":{
			[h:isPassRequired = (json.get(ParentSubeffectRequirementData,"Result") == "Pass")]
			[h:ParentSubeffectRequirementsMet = (isPassRequired == json.get(ParentEffectData,"CheckPassed"))]
			[h:CheckPassMargin = json.get(ParentEffectData,"CheckValue") - json.get(ParentEffectData,"CheckDCValue")]
			[h,if(isPassRequired == 0): CheckPassMargin = CheckPassMargin * -1]
			[h,if(CheckPassMargin < json.get(ParentSubeffectRequirementData,"Margin")): ParentSubeffectRequirementsMet = 0]
		};
		default:{
			[h:ParentSubeffectRequirementsMet = 1]
		}
	]

	[h,if(json.get(effFull,"ParentCrit") != ""):
		UseParentCrit = 1;
		UseParentCrit = 0
	]
	[h:"<!-- TODO: Need to add additional info here for conditions gained/damage/healing. Would be easier on this end to have creation input list all possible effects (from ParentSubeffect) and store as just an array of required effects. However, may prove difficult for effects with choice, which would require the current Any/All option. Also need to add ConditionNotApplied, I think something uses this but forget what. -->"]

	[h,if(!ParentSubeffectRequirementsMet),CODE:{
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

		[h:remainingTargetsList = json.difference(remainingTargetsList,effTargets)]
		[h:effFull = json.set(effFull,"RemainingTargets",remainingTargetsList)]
		[h:effFull = json.remove(effFull,"SpecificTargets")]

		[h:"<!-- TODO: Will need to add further info for resolving LinkedEffects of LinkedEffects that do not meet reqs, likely in the form of making a UDF that covers for here and later in ResolveEffects. -->"]

		[h,if(!json.isEmpty(remainingTargetsList)):
			setLibProperty("gd.Effects",json.path.set(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effID+")]",effFull),"Lib:pm.a5e.Core");
			setLibProperty("gd.Effects",json.path.delete(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effID+")]"),"Lib:pm.a5e.Core")
		]

		[h:return(0,json.set("","Table","[]","FeatureData",ClassFeatureData,"Targets",effTargets))]
	};{}]
};{
	[h:UseParentCrit = 0]
	[h,if(json.type(effTargets)=="OBJECT"): assert(0,"Something unexpected happened: Effect Targets is an object without having a Parent Subeffect")]
}]

[h:LinkedEffects = json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ParentSubeffect == "+effID+")]")]

[h:effTargetSpecific = json.get(effToResolve,"TargetSpecificEffects")]
[h:effConditionInfo = json.get(effToResolve,"ConditionInfo")]
[h,switch(json.type(effConditionInfo)):
    case "OBJECT": effConditionInfo = json.append("",effConditionInfo);
    case "ARRAY": effConditionInfo = effConditionInfo;
    case "UNKNOWN": effConditionInfo = "[]"
]
[h:effConditionModificationInfo = json.get(effToResolve,"ConditionModificationInfo")]
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

[h:targetsWithAdditionalAttackResolution = "[]"]

[h:IsTooltip = 0]
[h:AnyTargetNeedsFurtherResolution = 0]
[h:pm.a5e.OverarchingContext = json.get(effFull,"Context")]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:abilityTable = "[]"]
[h,foreach(tempTarget,effTargets),CODE:{
	[h,if(json.type(tempTarget) == "OBJECT"),CODE:{
		[h,if(json.get(tempTarget,"HeldBy") != ""): targetToken = json.get(tempTarget,"HeldBy")]
		[h,if(json.get(tempTarget,"HeldBy") != ""): thisTokenDisplayName = getName(targetToken)+"'s "+json.get(tempTarget,"DisplayName")]
		[h:targetDataKey = json.get(tempTarget,"ItemID") + "" + targetToken]
	};{
		[h:targetToken = tempTarget]
		[h:thisTokenDisplayName = getName(targetToken)]
		[h:targetDataKey = targetToken]
	}]
	[h:switchToken(targetToken)]
    [h:thisTokenInputDisplay = "junkVar | "+getTokenImage("",targetToken)+" | Resolving Effects on "+thisTokenDisplayName+" | LABEL | ICON=TRUE "]
	[h:thisTokenAttackData = effAttackData]
	[h:thisTokenSaveDCData = effSaveDCData]
	[h:thisTokenCheckDCData = effCheckDCData]
	[h:thisTokenDamageDealt = effDamageData]
	[h:thisTokenConditionInfo = effConditionInfo]
    [h:thisTokenConditionsApplied = effAllConditionIdentifiers]

	[h:needsFurtherResolution = 0]
	[h:AttackHit = 0]
	[h:attackToHit = ""]
	[h:attackACToHit = getProperty("a5e.stat.AC")]
	[h:SavePassed = 0]
	[h:SaveDCValue = ""]
	[h:SaveResultValue = ""]
	[h:CheckPassed = 0]
	[h:CheckResultValue = ""]
	[h:CheckDCValue = ""]
	[h:DamageDealt = "{}"]
	[h:ConditionsSet = "[]"]
	
	[h:"<!-- TODO: The following two (TargetedConditions and TargetSpecific) will need to be updated for objects -->"]
	[h,if(effTargetedConditions==""):
		thisTokenTargetedConditions = "[]";
		thisTokenTargetedConditions = json.get(effTargetedConditions,targetToken)
	]
	[h:thisTokenConditionModificationInfo = effConditionModificationInfo]
	[h,if(json.type(effTargetSpecific)=="OBJECT"):
		thisTokenTargetSpecificEffects = json.get(effTargetSpecific,targetToken);
		thisTokenTargetSpecificEffects = ""
	]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(targetToken)]

	[h:thisTokenModifiableComponents = json.set("",
		"Conditions",thisTokenConditionInfo,
		"Damage",thisTokenDamageDealt,
		"ConditionModification",thisTokenConditionModificationInfo,
		"ConditionsApplied",thisTokenConditionsApplied,
		"TargetSpecific",thisTokenTargetSpecificEffects
	)]

	[h,if(json.length(effTargets)>1):
		abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",thisTokenDisplayName,
		"FalseHeader","",
		"FullContents","",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h,if(thisTokenAttackData!=""),CODE:{
		[h:attackToHit = json.get(thisTokenAttackData,"Value")]
		[h:attackCrit = or(json.get(thisTokenAttackData,"AutoCrit"),attackToHit >= json.get(thisTokenAttackData,"CritRange"))]
		[h:attackCritFail = or(json.get(thisTokenAttackData,"AutoCritFail"),attackToHit == 1)]
		[h:hitTarget = and(!attackCritFail,or(attackCrit,attackToHit >= attackACToHit))]
		[h,if(json.get(thisTokenAttackData,"AdditionalAttackResolution")==""):
			needsAdditionalAttackResolution = 1;
			needsAdditionalAttackResolution = !json.contains(json.get(thisTokenAttackData,"AdditionalAttackResolution"),targetDataKey)
		]
		[h:ResolveOnHitEffects = needsAdditionalAttackResolution * hitTarget]
		[h:ResolveOnMissEffects = needsAdditionalAttackResolution * !hitTarget]

		[h:AttackHit = hitTarget]

		[h,if(hitTarget): abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Attack Result",
			"FalseHeader","",
			"FullContents","<span style='color:"+HealingColor+"'>Hit</span>",
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{
		[h:hitTarget = 1]
		[h:attackCrit = json.get(effFull,"ParentCrit")]
		[h:ResolveOnHitEffects = 0]
		[h:ResolveOnMissEffects = 0]
	}]
	
	[h,if(hitTarget==0),CODE:{
		[h:thisTokenModifiableComponents = json.set("",
			"Conditions","[]",
			"Damage","",
			"ConditionModification","{}",
			"ConditionsApplied",json.append("",json.set("","Conditions","[]","EndInfo","{}"))
		)]
		[h:thisTokenSaveDCData = ""]
		[h:thisTokenCheckDCData = ""]
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Attack Result",
			"FalseHeader","",
			"FullContents","<span style='color:"+DamageColor+"'>Miss</span>",
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{}]

	[h:AdditionalAttackResolution = 0]
	[h:"<!-- Set AdditionalAttackResolution to 1 for any FeatureLinks OnHit/Miss, since they need to wait for the link to be clicked before applying damage and removing the effect. Also need something here to bypass this if it's already been run before. -->"]
	[h:"<!-- Note: switchToken() back to targetToken is needed here because PassiveFunction() switches back to ParentToken, not targetToken. Setting 'ParentToken':targetToken is needed to make the variable ParentToken be the targetToken for purposes of later functions. -->"]
	[h,if(ResolveOnHitEffects),CODE:{
		[h:pm.PassiveFunction("AttackOnHit",json.set("","ParentToken",ParentToken))]
		[h:switchToken(targetToken)]
		[h:pm.PassiveFunction("AttackOnHitTargeted",json.set("","ParentToken",targetToken))]

		[h,if(AdditionalAttackResolution): needsFurtherResolution = 1]
		[h,if(AdditionalAttackResolution): targetsWithAdditionalAttackResolution = json.append(targetsWithAdditionalAttackResolution,targetToken)]
	};{}]

	[h,if(ResolveOnMissEffects),CODE:{
		[h:pm.PassiveFunction("AttackOnMiss",json.set("","ParentToken",ParentToken))]
		[h:switchToken(targetToken)]
		[h:pm.PassiveFunction("AttackOnMissTargeted",json.set("","ParentToken",targetToken))]

		[h,if(AdditionalAttackResolution): needsFurtherResolution = 1]
		[h,if(AdditionalAttackResolution): targetsWithAdditionalAttackResolution = json.append(targetsWithAdditionalAttackResolution,targetToken)]
	};{}]

	[h,if(thisTokenSaveDCData!=""): needsToSave = json.get(effSavesMadeData,targetDataKey)==""; needsToSave = 0]

	[h:"<!-- Wish this could be an if/else but CODE block limits say no -->"]
	[h,switch((thisTokenSaveDCData!="")+""+(needsToSave)),CODE:
		case "11":{
			[h:effSaveDCType = json.get(thisTokenSaveDCData,"SaveType")]
			[h:multiSaveDCTypeTest = json.type(effSaveDCType) == "ARRAY"]
			[h,if(!multiSaveDCTypeTest): effSaveDCType = json.append("",effSaveDCType)]
			[h:SaveDCOptionNames = ""]
			
			[h,foreach(SaveDCOption,effSaveDCType): SaveDCOptionNames = json.append(SaveDCOptionNames,pm.GetDisplayName(SaveDCOption,"sb.Attributes"))]
	
			[h,if(multiSaveDCTypeTest): 
				abort(input(
					thisTokenInputDisplay,
					" saveChoice | "+SaveDCOptionNames+" | Choose a Save Type | LIST | DELIMITER=JSON "
				));
				saveChoice = 0
			]

			[h:finalSaveType = json.get(effSaveDCType,saveChoice)]

			[h,MACRO("Save@Lib:pm.a5e.Core"): json.set("","Save",finalSaveType,"Type","Save","ParentToken",targetToken,"ID",effID)]
			[h:SaveResult = macro.return]
			[h:effSavesMadeData = json.set(effSavesMadeData,targetDataKey,SaveResult)]
			[h:abilityTable = json.merge(abilityTable,json.get(SaveResult,"Table"))]

			[h:SaveResultValue = json.get(SaveResult,"Value")]
			[h:autoResultTest = !isNumber(SaveResultValue)]
			[h,if(autoResultTest):
				SavePassed = (SaveResultValue=="AutoSuccess");
				SavePassed = 0
			]
			[h:SoloTargetTest = json.length(effTargets) == 1]
			[h:ResolveAutoResultNow = and(autoResultTest,SoloTargetTest)]

			[h,switch(ResolveAutoResultNow+""+SavePassed):
				case "11": thisTokenModifiableComponents = pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenSaveDCData,"ModifiableComponents",thisTokenModifiableComponents));
				case "10": thisTokenModifiableComponents = pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenSaveDCData,"ModifiableComponents",thisTokenModifiableComponents));
				case "00": needsFurtherResolution = 1
			]
			[h,if(!ResolveAutoResultNow): AnyTargetNeedsFurtherResolution = 1]
		};
		case "10":{
			[h:SaveResult = json.get(effSavesMadeData,targetDataKey)]
			[h:SaveResultValue = json.get(SaveResult,"Value")]
			[h:autoResultTest = !isNumber(SaveResultValue)]
			[h:SaveDCValue = json.get(thisTokenSaveDCData,"DC")]
			[h,if(autoResultTest):
				SavePassed = (SaveResultValue=="AutoSuccess");
				SavePassed = SaveResultValue >= SaveDCValue
			]

			[h:SavesNotMade = json.difference(effTargets,json.fields(effSavesMadeData,"json"))]
			[h,if(AnyTargetNeedsFurtherResolution == 0): AnyTargetNeedsFurtherResolution = !json.isEmpty(SavesNotMade)]

			[h,switch(AnyTargetNeedsFurtherResolution+""+SavePassed):
				case "01": thisTokenModifiableComponents = pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenSaveDCData,"ModifiableComponents",thisTokenModifiableComponents));
				case "00": thisTokenModifiableComponents = pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenSaveDCData,"ModifiableComponents",thisTokenModifiableComponents));
				default: needsFurtherResolution = 1 
			]

			[h,if(SavePassed):
				saveResultText = "<span style='color:"+HealingColor+"'>"+if(autoResultTest,"Automatic ","")+"Success</span>";
				saveResultText = "<span style='color:"+DamageColor+"'>"+if(autoResultTest,"Automatic ","")+"Failure</span>"
			]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Save Result",
				"FalseHeader","",
				"FullContents",saveResultText,
				"RulesContents","",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};
		default:{}
	]

	[h,if(thisTokenCheckDCData!=""): needsToCheck = json.get(effChecksMadeData,targetDataKey)==""; needsToCheck = 0]

	[h,switch((thisTokenCheckDCData!="")+""+(needsToCheck)),CODE:
		case "11":{
			[h:effCheckDCType = json.get(thisTokenCheckDCData,"CheckType")]
			[h:multiCheckDCTypeTest = json.type(effCheckDCType) == "ARRAY"]
			[h,if(!multiCheckDCTypeTest): effCheckDCType = json.append("",effCheckDCType)]
			[h:CheckDCOptionNames = ""]

			[h,foreach(CheckDCOption,effCheckDCType): CheckDCOptionNames = json.append(CheckDCOptionNames,if(json.get(CheckDCOption,"Type")=="Initiative","Initiative",pm.GetDisplayName(json.get(CheckDCOption,"Skill"),if(json.get(CheckDCOption,"Type")=="Skill","sb.Skills",if(json.get(CheckDCOption,"Type")=="Ability Score","sb.Attributes","sb.Tools")))))]
	
			[h,if(multiCheckDCTypeTest): 
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
			[h:effChecksMadeData = json.set(effChecksMadeData,targetDataKey,CheckResult)]
			[h:abilityTable = json.merge(abilityTable,json.get(CheckResult,"Table"))]

			[h:CheckResultValue = json.get(CheckResult,"Value")]
			[h:autoResultTest = !isNumber(CheckResultValue)]
			[h,if(autoResultTest):
				CheckPassed = (CheckResultValue=="AutoSuccess");
				CheckPassed = 0
			]
			[h,switch(autoResultTest+""+CheckPassed):
				case "11": thisTokenModifiableComponents = pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenCheckDCData,"ModifiableComponents",thisTokenModifiableComponents));
				case "10": thisTokenModifiableComponents = pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenCheckDCData,"ModifiableComponents",thisTokenModifiableComponents));
				case "00": needsFurtherResolution = 1
			]
		};
		case "10":{
			[h:"<!-- Separate storage format for contested checks is so that it can be recognized on the effect filtering side of things as a contested check; as well as retain data needed to modify the check setting the DC -->"]
			[h:CheckResult = json.get(effChecksMadeData,targetDataKey)]
			[h:ContestedCheckTest = json.type(json.get(thisTokenCheckDCData,"DC")) == "OBJECT"]
			[h,if(ContestedCheckTest):
				CheckDCValue = json.get(json.get(thisTokenCheckDCData,"DC"),"Value");
				CheckDCValue = json.get(thisTokenCheckDCData,"DC")
			]

			[h:CheckResultValue = json.get(CheckResult,"Value")]
			[h:CheckPassed = (CheckResultValue >= CheckDCValue)]
			
			[h,if(CheckPassed):
				thisTokenModifiableComponents = pm.a5e.ResolveDCSuccess(json.set("","DCData",thisTokenCheckDCData,"ModifiableComponents",thisTokenModifiableComponents));
				thisTokenModifiableComponents = pm.a5e.ResolveDCFailure(json.set("","DCData",thisTokenCheckDCData,"ModifiableComponents",thisTokenModifiableComponents))
			]

			[h,if(CheckPassed):
				checkResultText = "<span style='color:"+HealingColor+"'>Success</span>";
				checkResultText = "<span style='color:"+DamageColor+"'>Failure</span>"
			]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Check Result",
				"FalseHeader","",
				"FullContents",checkResultText,
				"RulesContents","",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};
		default:{}
	]

	[h:thisTokenDamageDealt = json.get(thisTokenModifiableComponents,"Damage")]
	[h:thisTokenConditionInfo = json.get(thisTokenModifiableComponents,"Conditions")]
	[h:thisTokenConditionModificationInfo = json.get(thisTokenModifiableComponents,"ConditionModification")]
	[h:thisTokenConditionsApplied = json.get(thisTokenModifiableComponents,"ConditionsApplied")]

	[h,if(needsFurtherResolution),CODE:{
		[h:thisTokenDamageDealt = ""]
		[h:thisTokenConditionInfo = "[]"]
		[h:thisTokenConditionModificationInfo = "{}"]
	};{
		[h:remainingTargetsList = json.difference(remainingTargetsList,json.append("",tempTarget))]
	}]

	[h:"<!-- TODO: Temporary bypass to not deal damage to held items. Will decide to change or keep. -->"]
	[h,if(thisTokenDamageDealt!="" && json.type(tempTarget) == "UNKNOWN"),CODE:{
		[h,MACRO("ChangeHP@Lib:pm.a5e.Core"): json.set("","DamageDealt",thisTokenDamageDealt,"IsCrit",attackCrit,"ParentToken",targetToken,"SourceToken",ParentToken)]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
		[h:DamageDealt = json.get(macro.return,"Damage")]
	};{}]

	[h,foreach(conditionSet,thisTokenConditionInfo),CODE:{
		[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): json.set(conditionSet,
			"GroupID",effConditionGroupID,
			"Target",tempTarget,
			"SetBy",ParentToken
		)]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
		[h:ConditionsSet = json.get(macro.return,"Conditions")]
	}]

	[h,if(!json.isEmpty(thisTokenConditionModificationInfo)),CODE:{
		[h,MACRO("ModifyConditions@Lib:pm.a5e.Core"): json.set(thisTokenConditionModificationInfo,"Conditions",thisTokenTargetedConditions,"Target",tempTarget)]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	}]

	[h,if(!needsFurtherResolution),CODE:{
		[h,if(0): thisTargetLinkedEffects = json.path.read(LinkedEffects,"[*][?(@.RemainingTargets.[*] == '"+targetToken+"')]")]
		[h:"<!-- BUGFIX json.path: Above statement or similar can replace below loop once json.paths are fixed -->"]

		[h:thisTargetLinkedEffects = "[]"]
		[h,foreach(tempLinkedEffect,LinkedEffects): thisTargetLinkedEffects = if(json.contains(json.get(tempLinkedEffect,"RemainingTargets"),tempTarget),json.append(thisTargetLinkedEffects,tempLinkedEffect),thisTargetLinkedEffects)]

		[h:"<!-- TODO: Pass information about how much the attack hit by, save failed by, etc. -->"]
		[h:NextEffectData = json.set("",
			"AttackHit",AttackHit,
			"AttackCrit",attackCrit,
			"AttackToHit",attackToHit,
			"AttackACToHit",attackACToHit,
			"SavePassed",SavePassed,
			"SaveValue",SaveResultValue,
			"SaveDCValue",SaveDCValue,
			"CheckPassed",CheckPassed,
			"CheckValue",CheckResultValue,
			"CheckDCValue",CheckDCValue,
			"DamageDealt",DamageDealt,
			"ConditionsSet",ConditionsSet,
			"Targets",effTargets,
			"SpecificTargets",json.append("",tempTarget),
			"LinkedEffects",thisTargetLinkedEffects
		)]
		[h,MACRO("ResolveLinkedEffectSingle@Lib:pm.a5e.Core"): NextEffectData]
		
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]	
	};{}]
}]

[h,if(!json.isEmpty(remainingTargetsList)),CODE:{
	[h:effFull = json.set(effFull,"RemainingTargets",remainingTargetsList)]

	[h,if(json.get(effToResolve,"SaveDC")!=""): effFull = json.set(effFull,
		"ToResolve",json.set(json.get(effFull,"ToResolve"),
			"SaveDC",json.set(json.get(json.get(effFull,"ToResolve"),"SaveDC"),
			"SavesMade",effSavesMadeData)
		)
	)]

	[h,if(json.get(effToResolve,"CheckDC")!=""): effFull = json.set(effFull,
		"ToResolve",json.set(json.get(effFull,"ToResolve"),
			"CheckDC",json.set(json.get(json.get(effFull,"ToResolve"),"CheckDC"),
			"ChecksMade",effChecksMadeData)
		)
	)]

	[h,if(!json.isEmpty(targetsWithAdditionalAttackResolution)): effFull = json.set(effFull,
		"ToResolve",json.set(json.get(effFull,"ToResolve"),
			"Attack",json.set(json.get(json.get(effFull,"ToResolve"),"Attack"),
			"AdditionalAttackResolution",targetsWithAdditionalAttackResolution)
		)
	)]
	[h:effFull = json.remove(effFull,"SpecificTargets")]
	
	[h:setLibProperty("gd.Effects",json.path.set(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effID+")]",effFull),"Lib:pm.a5e.Core")]
};{
	[h:setLibProperty("gd.Effects",json.path.delete(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ID=="+effID+")]"),"Lib:pm.a5e.Core")]
}]

[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

[h,if(ParentToken!=""): switchToken(ParentToken)]

[h,if(json.length(effTargets)==1),CODE:{
	[h:onlyTarget = json.get(effTargets,0)]

	[h,if(json.type(onlyTarget) == "OBJECT"),CODE:{
		[h,if(json.get(onlyTarget,"HeldBy") != ""): targetToken = json.get(onlyTarget,"HeldBy")]
		[h,if(json.get(onlyTarget,"HeldBy") != ""): onlyTokenDisplayName = getName(targetToken)+"'s "+json.get(onlyTarget,"DisplayName")]
	};{
		[h:targetToken = onlyTarget]
		[h:onlyTokenDisplayName = getName(targetToken)]
	}]

	[h:titleAddon = " on "+onlyTokenDisplayName]
};{
	[h:titleAddon = ""]
}]
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

[h:macro.return = json.set("","Table",abilityTable,"FeatureData",ClassFeatureData,"Targets",effTargets)]