[h:effClass = json.get(macro.args,"Class")]
[h:effTargets = json.get(macro.args,"Targets")]
[h:effTargetSpecific = json.get(macro.args,"TargetSpecificEffects")]
[h:effConditionsApplied = json.get(macro.args,"ConditionInfo")]
[h:effDamageInfo = json.get(macro.args,"Damage")]
[h:ParentToken = currentToken()]
[h:effGroupID = pm.a5e.CreateConditionID(ParentToken,effTargets)]

[h:abilityTable = "[]"]
[h,foreach(targetToken,effTargets),CODE:{
	[h:switchToken(targetToken)]
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
		[h:allTargetsDamage = json.get(json.get(effDamageInfo,"DamageDealt"),damageType)]
		[h,if(allTargetsDamage==""):
			effDamageInfo = json.path.put(effDamageInfo,"['Damage']['DamageDealt']",damageType,json.get(targetSpecificDamage,damageType));
			effDamageInfo = json.path.set(effDamageInfo,"['Damage']['DamageDealt']['"+damageType+"']",json.get(targetSpecificDamage,damageType)+allTargetsDamage)
		]			
	}]
	
	[h,if(effDamageInfo!=""),CODE:{
		[h,MACRO("Change HP@Lib:pm.a5e.Core"): json.set(effDamageInfo,"ParentToken",targetToken)]
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