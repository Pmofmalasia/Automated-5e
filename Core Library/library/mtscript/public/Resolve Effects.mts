[h:effClass = json.get(macro.args,"Class")]
[h:effTargets = json.get(macro.args,"Targets")]
[h:effTargetSpecific = json.get(macro.args,"TargetSpecificEffects")]
[h:effConditionsApplied = json.get(macro.args,"ConditionInfo")]
[h:effDamageData = json.get(macro.args,"Damage")]
[h:effSaveData = json.get(macro.args,"SaveData")]
[h:ParentToken = currentToken()]
[h:effGroupID = pm.a5e.CreateConditionID(ParentToken,effTargets)]

[h:abilityTable = "[]"]
[h,foreach(targetToken,effTargets),CODE:{
	[h:switchToken(targetToken)]
	[h:"<!-- Maybe move this to its own function, so that i can use the return() function if it is completely nullified (e.g. missed AC, immunity, save or suck). May not want to return in case of effects on missing though (or just return that it was a total miss? and no output unless it triggers something like the BM riposte?) -->"]
	
	[h,if(effSaveData!=""),CODE:{
		[h,MACRO("Save@Lib:pm.a5e.Core"): json.set("","Save",json.get(effSaveData,"SaveType"),"Type","Save","ParentToken",targetToken)]
		[h:SaveResult = macro.return]
		[h:abilityTable = json.append(abilityTable,json.get(SaveResult,"Table"))]
		[h:passedSave = json.get(SaveResult,"Value")>=json.get(effSaveData,"DC")]
		[h:saveDamageModInfo = json.get(effSaveData,"DamageModifier")]
		[h:isDamageHalved = json.get(saveDamageModInfo,"DamageHalved")]
		[h:typesHalvedInclusive = json.get(saveDamageModInfo,"TypesInclusive")]
		[h:typesHalvedExclusive = if(json.get(saveDamageModInfo,"TypesExclusive")=="","[]",json.get(saveDamageModInfo,"TypesExclusive"))]
		
		[h,switch((isDamageHalved!=0)+json.type(typesHalvedInclusive))
			case "1UNKNOWN": typesHalvedFinal = if(typesHalvedInclusive == "All",pm.GetDamageTypes("json","Name"),"[]");
			case "1ARRAY": typesHalvedFinal = json.difference(json.intersection(typesHalvedInclusive,pm.GetDamageTypes("json","Name")),typesHalvedExclusive);
			default: typesHalvedFinal = "[]"
		]
		
		[h:effDamageDealt = json.get(effDamageData,"DamageDealt")]
		[h,if(effDamageDealt!=""): typesHalvedFinal = json.intersection(typesHalvedFinal,json.fields(json.get(effDamageData,"DamageDealt")))]
		
		[h,foreach(damageType,typesHalvedFinal),if(json.get(effDamageDealt,damageType)!="" && isDamageHalved!=0): effDamageDealt = json.set(effDamageDealt,damageType,floor(json.get(effDamageDealt,damageType)*if(isDamageHalved==1,(1/2),0)))]
		
		[h:effDamageData = json.set(effDamageData,"DamageDealt",effDamageDealt)]
	};{}]
	
	[h,if(json.length(effTargets)>1):
		abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header",token.name,
		"FalseHeader","",
		"FullContents","",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
		))
	]
	
	[h,if(json.type(effTargetSpecific)=="OBJECT"),CODE:{
		[h:targetSpecificDamage = json.get(effTargetSpecific,targetToken)]
		[h:targetSpecificDamageTypes = json.fields(targetSpecificDamage)]
	};{
		[h:targetSpecificDamage = "{}"]
		[h:targetSpecificDamageTypes = ""]
	}]
	
	[h,foreach(damageType,targetSpecificDamageTypes),CODE:{
		[h:allTargetsDamage = json.get(json.get(effDamageData,"DamageDealt"),damageType)]
		[h,if(allTargetsDamage==""):
			effDamageData = json.path.put(effDamageData,"['Damage']['DamageDealt']",damageType,json.get(targetSpecificDamage,damageType));
			effDamageData = json.path.set(effDamageData,"['Damage']['DamageDealt']['"+damageType+"']",json.get(targetSpecificDamage,damageType)+allTargetsDamage)
		]			
	}]
	
	[h,if(effDamageData!=""),CODE:{
		[h,MACRO("Change HP@Lib:pm.a5e.Core"): json.set(effDamageData,"ParentToken",targetToken)]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	};{}]
	
	[h,if(effConditionsApplied!=""),CODE:{
		[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"):
			json.set(effConditionsApplied,
			"GroupID",effGroupID,
			"Target",targetToken,
			"SetBy",ParentToken)
		]
		[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	};{}]
}]

[h,if(ParentToken!=""): switchToken(ParentToken)]

[h:ClassFeatureData = json.set("",
	"Flavor","",
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class",if(effClass=="","zzChecksAndSaves",effClass),
	"Name","Resolve Effects"+if(json.length(effTargets)==1," on "+getName(json.get(effTargets,0)),""),
	"FalseName","",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]

[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]