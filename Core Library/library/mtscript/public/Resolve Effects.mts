[h:effClass = json.get(macro.args,"Class")]
[h:effTargets = json.get(macro.args,"Targets")]
[h:effTargetSpecific = json.get(macro.args,"TargetSpecificEffects")]
[h:effConditionInfo = json.get(macro.args,"ConditionInfo")]
[h,switch(json.type(effConditionInfo)):
    case "OBJECT": effConditionInfo = json.append("",effConditionInfo);
    case "ARRAY": effConditionInfo = effConditionInfo;
    case "UNKNOWN": effConditionInfo = json.append("",json.set("","Conditions","[]","EndInfo","{}"))
]
[h:effDamageData = json.get(macro.args,"Damage")]
[h:effAttackData = json.get(macro.args,"Attack")]
[h:effCheckData = json.get(macro.args,"Check")]
[h:effSaveData = json.get(macro.args,"Save")]
[h:ParentToken = currentToken()]
[h:effGroupID = pm.a5e.CreateConditionID(ParentToken,effTargets)]

[h:effAllConditionIdentifiers = ""]
[h,foreach(conditionSet,effConditionInfo),CODE:{
    [h,foreach(tempCondition,json.get(conditionSet,"Conditions")): effAllConditionIdentifiers = json.append(effAllConditionIdentifiers,json.set("","Name",json.get(tempCondition,"Name"),"Class",json.get(tempCondition,"Class"),"Subclass",json.get(tempCondition,"Subclass")))]
}]

[h:abilityTable = "[]"]
[h,foreach(targetToken,effTargets),CODE:{
	[h:"<!-- Maybe move this all to its own function, so that i can use the return() function if it is completely nullified (e.g. missed AC, immunity, save or suck). May not want to return in case of effects on missing though (or just return that it was a total miss? and no output unless it triggers something like the BM riposte?) -->"]
	
    [h:thisTokenInputDisplay = "junkVar | "+getTokenImage("",targetToken)+" | Resolving Effects on "+getName(targetToken)+" | LABEL | ICON=TRUE "]
	[h:thisTokenAttackData = effAttackData]
	[h:thisTokenSaveData = effSaveData]
	[h:thisTokenCheckData = effCheckData]
	[h:thisTokenDamageDealt = effDamageData]
	[h:thisTokenConditionInfo = effConditionInfo]
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
		[h:hitTarget = or(attackCrit,and(!attackCritFail,attackToHit >= AC))]
		[h,if(attackCrit): thisTokenDamageDealt = json.get(thisTokenAttackData,"CritDamage")]
	};{
		[h:hitTarget = 1]
	}]
	
	[h,if(!hitTarget),CODE:{
		[h:thisTokenSaveData = ""]
		[h:thisTokenCheckData = ""]
		[h:thisTokenDamageDealt = ""]
		[h:thisTokenConditionInfo = ""]
		[h:thisTokenConditionsApplied = json.append("",json.set("","Conditions","[]","EndInfo","{}"))]
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
	
	[h,if(thisTokenSaveData!=""),CODE:{
		[h,MACRO("Save@Lib:pm.a5e.Core"): json.set("","Save",json.get(thisTokenSaveData,"SaveType"),"Type","Save","ParentToken",targetToken)]
		[h:SaveResult = macro.return]
		[h:abilityTable = json.merge(abilityTable,json.get(SaveResult,"Table"))]
		[h:passedSave = json.get(SaveResult,"Value")>=json.get(thisTokenSaveData,"DC")]
		[h:saveDamageModInfo = if(json.get(thisTokenSaveData,"DamageModifier")=="","{}",json.get(thisTokenSaveData,"DamageModifier"))]
		[h:isDamageHalved = if(json.get(saveDamageModInfo,"DamageHalved")=="",0,json.get(saveDamageModInfo,"DamageHalved"))]
		[h:typesHalvedInclusive = json.get(saveDamageModInfo,"TypesInclusive")]
		[h:typesHalvedExclusive = if(json.get(saveDamageModInfo,"TypesExclusive")=="","[]",json.get(saveDamageModInfo,"TypesExclusive"))]
      
		[h,switch(passedSave+""+(isDamageHalved!=0)+json.type(typesHalvedInclusive)):
			case "11UNKNOWN": typesHalvedFinal = if(typesHalvedInclusive == "All",pm.GetDamageTypes("Name","json"),json.difference(pm.GetDamageTypes("Name","json"),typesHalvedExclusive));
			case "11ARRAY": typesHalvedFinal = json.difference(json.intersection(typesHalvedInclusive,pm.GetDamageTypes("Name","json")),typesHalvedExclusive);
			default: typesHalvedFinal = "[]"
		]
		
		[h,if(thisTokenDamageDealt!=""): typesHalvedFinal = json.intersection(typesHalvedFinal,json.fields(thisTokenDamageDealt,"json"))]
      
		[h,foreach(damageType,json.fields(thisTokenDamageDealt,"json")): thisTokenDamageDealt = if(json.contains(typesHalvedFinal,damageType) && isDamageHalved!=0,json.set(thisTokenDamageDealt,damageType,floor(json.get(thisTokenDamageDealt,damageType)*if(isDamageHalved==1,(1/2),0))),thisTokenDamageDealt)]
      
		[h:saveConditionsResistedInfo = json.get(thisTokenSaveData,"ConditionsResisted")]
		[h:conditionsResistedInclusive = json.get(saveConditionsResistedInfo,"Inclusive")]
		[h:conditionsResistedExclusive = if(json.get(saveConditionsResistedInfo,"Exclusive")=="","[]",json.get(saveConditionsResistedInfo,"Exclusive"))]
    
		[h,switch(passedSave+""+json.type(conditionsResistedInclusive)):
			case "1UNKNOWN": conditionsResistedFinal = if(conditionsResistedInclusive == "All",thisTokenConditionsApplied,if(conditionsResistedExclusive=="[]","[]",json.difference(thisTokenConditionsApplied,conditionsResistedExclusive)));
			case "1ARRAY": conditionsResistedFinal = json.difference(conditionsResistedInclusive,conditionsResistedExclusive);
			default: conditionsResistedFinal = "[]"
		]
    
		[h,foreach(condition,conditionsResistedFinal): thisTokenConditionInfo = json.path.delete(thisTokenConditionInfo,"[*]['Conditions'][*][?(@.Name=='"+json.get(condition,"Name")+"' && @.Class=='"+json.get(condition,"Class")+"' && @.Subclass=='"+json.get(condition,"Subclass")+"')]")]
	};{}]
    
    [h:tempDeleteCount = 0]
    [h,foreach(conditionSet,thisTokenConditionInfo),CODE:{
        [h:allResistedTest = json.isEmpty(json.get(conditionSet,"Conditions"))]
        [h,if(allResistedTest): thisTokenConditionInfo = json.remove(thisTokenConditionInfo,(roll.count-tempDeleteCount))]
        [h,if(allResistedTest): tempDeleteCount = tempDeleteCount + 1]
    }]

	[h,if(json.type(effTargetSpecific)=="OBJECT"),CODE:{
		[h:targetSpecificDamage = json.get(effTargetSpecific,targetToken)]
		[h:targetSpecificDamageTypes = json.fields(targetSpecificDamage)]
	};{
		[h:targetSpecificDamage = "{}"]
		[h:targetSpecificDamageTypes = ""]
	}]
	
	[h,foreach(damageType,targetSpecificDamageTypes),CODE:{
		[h:allTargetsDamage = json.get(thisTokenDamageDealt,damageType)]
		[h,if(allTargetsDamage==""):
			thisTokenDamageDealt = json.path.put(thisTokenDamageDealt,"['Damage']",damageType,json.get(targetSpecificDamage,damageType));
			thisTokenDamageDealt = json.path.set(thisTokenDamageDealt,"['Damage']['"+damageType+"']",json.get(targetSpecificDamage,damageType)+allTargetsDamage)
		]			
	}]
	
	[h,if(thisTokenCheckData!=""),CODE:{
        [h:effCheckType = json.get(thisTokenCheckData,"CheckType")]
        [h:multiCheckTypeTest = json.type(effCheckType) == "ARRAY"]
        [h,if(!multiCheckTypeTest): effCheckType = json.append("",effCheckType)]
        [h:checkOptionNames = ""]
        
        [h,foreach(checkOption,effCheckType): checkOptionNames = json.append(checkOptionNames,if(json.get(checkOption,"Type")=="Initiative","Initiative",pm.GetDisplayName(json.get(checkOption,"Skill"),if(json.get(checkOption,"Type")=="Skill","sb.Skills",if(json.get(checkOption,"Type")=="Ability Score","sb.Attributes","sb.Tools")))))]

        [h,if(json.length(effCheckType)>0): 
            abort(input(
                thisTokenInputDisplay,
                " checkChoice | "+checkOptionNames+" | Choose a Skill to Contest the Check DC | LIST | DELIMITER=JSON "
            ));
            checkChoice = 0
        ]
        
        [h:finalCheckData = json.get(effCheckType,checkChoice)]
        
		[h,MACRO("Check@Lib:pm.a5e.Core"): json.set(finalCheckData,"ParentToken",targetToken)]
		[h:CheckResult = macro.return]
		[h:abilityTable = json.merge(abilityTable,json.get(CheckResult,"Table"))]
		[h:passedCheck = json.get(CheckResult,"Value")>=json.get(thisTokenCheckData,"DC")]
		[h:CheckDamageModInfo = if(json.get(thisTokenCheckData,"DamageModifier")=="","{}",json.get(thisTokenCheckData,"DamageModifier"))]
		[h:isDamageHalved = if(json.get(CheckDamageModInfo,"DamageHalved")=="",0,json.get(CheckDamageModInfo,"DamageHalved"))]
		[h:typesHalvedInclusive = json.get(CheckDamageModInfo,"TypesInclusive")]
		[h:typesHalvedExclusive = if(json.get(CheckDamageModInfo,"TypesExclusive")=="","[]",json.get(CheckDamageModInfo,"TypesExclusive"))]
      
		[h,switch(passedCheck+""+(isDamageHalved!=0)+json.type(typesHalvedInclusive)):
			case "11UNKNOWN": typesHalvedFinal = if(typesHalvedInclusive == "All",pm.GetDamageTypes("Name","json"),json.difference(pm.GetDamageTypes("Name","json"),typesHalvedExclusive));
			case "11ARRAY": typesHalvedFinal = json.difference(json.intersection(typesHalvedInclusive,pm.GetDamageTypes("Name","json")),typesHalvedExclusive);
			default: typesHalvedFinal = "[]"
		]
		
		[h,if(thisTokenDamageDealt!=""): typesHalvedFinal = json.intersection(typesHalvedFinal,json.fields(thisTokenDamageDealt,"json"))]
      
		[h,foreach(damageType,json.fields(thisTokenDamageDealt,"json")): thisTokenDamageDealt = if(json.contains(typesHalvedFinal,damageType) && isDamageHalved!=0,json.set(thisTokenDamageDealt,damageType,floor(json.get(thisTokenDamageDealt,damageType)*if(isDamageHalved==1,(1/2),0))),thisTokenDamageDealt)]
      
		[h:CheckConditionsResistedInfo = json.get(thisTokenCheckData,"ConditionsResisted")]
		[h:conditionsResistedInclusive = json.get(CheckConditionsResistedInfo,"Inclusive")]
		[h:conditionsResistedExclusive = if(json.get(CheckConditionsResistedInfo,"Exclusive")=="","[]",json.get(CheckConditionsResistedInfo,"Exclusive"))]
    
		[h,switch(passedCheck+""+json.type(conditionsResistedInclusive)):
			case "1UNKNOWN": conditionsResistedFinal = if(conditionsResistedInclusive == "All",thisTokenConditionsApplied,if(conditionsResistedExclusive=="[]","[]",json.difference(thisTokenConditionsApplied,conditionsResistedExclusive)));
			case "1ARRAY": conditionsResistedFinal = json.difference(conditionsResistedInclusive,conditionsResistedExclusive);
			default: conditionsResistedFinal = "[]"
		]
        
		[h,foreach(condition,conditionsResistedFinal): thisTokenConditionInfo = json.path.delete(thisTokenConditionInfo,"[*]['Conditions'][*][?(@.Name=='"+json.get(condition,"Name")+"' && @.Class=='"+json.get(condition,"Class")+"' && @.Subclass=='"+json.get(condition,"Subclass")+"')]")]
	};{}]
    
    [h:tempDeleteCount = 0]
    [h,foreach(conditionSet,thisTokenConditionInfo),CODE:{
        [h:allResistedTest = json.isEmpty(json.get(conditionSet,"Conditions"))]
        [h,if(allResistedTest): thisTokenConditionInfo = json.remove(thisTokenConditionInfo,(roll.count-tempDeleteCount))]
        [h,if(allResistedTest): tempDeleteCount = tempDeleteCount + 1]
    }]

	[h,if(json.type(effTargetSpecific)=="OBJECT"),CODE:{
		[h:targetSpecificDamage = json.get(effTargetSpecific,targetToken)]
		[h:targetSpecificDamageTypes = json.fields(targetSpecificDamage)]
	};{
		[h:targetSpecificDamage = "{}"]
		[h:targetSpecificDamageTypes = ""]
	}]
	
	[h,foreach(damageType,targetSpecificDamageTypes),CODE:{
		[h:allTargetsDamage = json.get(thisTokenDamageDealt,damageType)]
		[h,if(allTargetsDamage==""):
			thisTokenDamageDealt = json.path.put(thisTokenDamageDealt,"['Damage']",damageType,json.get(targetSpecificDamage,damageType));
			thisTokenDamageDealt = json.path.set(thisTokenDamageDealt,"['Damage']['"+damageType+"']",json.get(targetSpecificDamage,damageType)+allTargetsDamage)
		]			
	}]
	
	[h:"<!-- Note to future self: Add crit data to the damage info here. Will make processing abilities easier if they add/negate a crit. -->"]
	[h,if(thisTokenDamageDealt!=""),CODE:{
		[h,MACRO("Change HP@Lib:pm.a5e.Core"): json.set("","DamageDealt",thisTokenDamageDealt,"ParentToken",targetToken)]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	};{}]
	
	[h,foreach(conditionSet,thisTokenConditionInfo),CODE:{
		[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"):
			json.set(conditionSet,
			"GroupID",effGroupID,
			"Target",targetToken,
			"SetBy",ParentToken)
		]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	}]
}]

[h,if(ParentToken!=""): switchToken(ParentToken)]

[h,if(json.length(effTargets)==1): titleAddon = " on "+getName(json.get(effTargets,0)); titleAddon = ""]
[h:ClassFeatureData = json.set("",
	"Flavor","",
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class",if(effClass=="","zzChecksAndSaves",effClass),
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