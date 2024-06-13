[h:hp.Data = macro.args]
[h:Flavor = json.get(hp.Data,"Flavor")]
[h:ParentToken = json.get(hp.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.EffectData = "[]"]
[h:pm.a5e.OverarchingContext = "Damage"]

[h:hp.DamageDealt = json.get(hp.Data,"DamageDealt")]
[h:hp.SourceID = json.get(hp.Data,"SourceID")]
[h:hp.IsCrit = number(json.get(hp.Data,"IsCrit"))]
[h:hp.BypassConc = number(json.get(hp.Data,"BypassConc"))]
[h:hp.ConcSaveBonus = number(json.get(hp.Data,"ConcSaveBonus"))]

[h:"<!-- Not sure why the intersection with all damage types is required but there must have been a reason? -->"]
[h:hp.TypesDealt = json.intersection(json.append(pm.GetDamageTypes("Name","json"),"None","Healing","TempHP"),json.unique(json.path.read(hp.DamageDealt,"\$[*]['DamageType']")))]
[h:hp.DmgModData = pm.a5e.DamageModCalc(hp.Data)]

[h:hp.FinalDamageDealt = json.set("","Healing",0)]
[h:hp.DamageDealtString = ""]
[h,foreach(damagetype,hp.TypesDealt),CODE:{
	[h,if(damagetype == "None"),CODE:{
		[h:thisDamageTypeInfo = json.path.read(hp.DamageDealt,"\$[*][?(@.DamageType=='"+damagetype+"')]['"+if(hp.IsCrit,"Crit","")+"Total']")]

		[h:tempDamageDealt = math.arraySum(thisDamageTypeInfo)]
		[h:hp.FinalDamageDealt = json.set(hp.FinalDamageDealt,"Untyped",tempDamageDealt)]
		
		[h:hp.DamageDealtString = if(tempDamageDealt==0,hp.DamageDealtString,listAppend(hp.DamageDealtString,tempDamageDealt," + "))]
	};{
		[h:hp.VulnTest = json.contains(json.get(hp.DmgModData,"Vulnerability"),damagetype)]
		[h:hp.ResTest = json.contains(json.get(hp.DmgModData,"Resistance"),damagetype)]
		[h:hp.ImmunTest = json.contains(json.get(hp.DmgModData,"Immunity"),damagetype)]
		[h:hp.AbsorbTest = json.contains(json.get(hp.DmgModData,"Absorption"),damagetype)]
		[h:hp.DRTest = json.get(json.get(hp.DmgModData,"DR"),damagetype)]
		
		[h:hp.ModType = if(hp.AbsorbTest,"Absorption",if(hp.ImmunTest,"Immunity",if(hp.ResTest,if(hp.VulnTest,"","Resistance"),if(hp.VulnTest,"Vulnerability",""))))]
		
		[h:thisDamageTypeInfo = json.path.read(hp.DamageDealt,"\$[*][?(@.DamageType=='"+damagetype+"')]")]

		[h:tempDamageDealt = 0]
		[h,foreach(damageInstance,thisDamageTypeInfo): tempDamageDealt = tempDamageDealt + if(json.get(damageInstance,"NoModification")==0,json.get(damageInstance,if(hp.IsCrit,"Crit","")+"Total")*json.get(damageInstance,"Modifier"),0)]

		[h:tempDamageDealt = floor(tempDamageDealt) - hp.DRTest]
		[h:tempDamageType = damagetype]
		[h,switch(hp.ModType):
			case "Absorption": tempDamageType = "Healing";
			case "Immunity": tempDamageDealt = 0;
			case "Resistance": tempDamageDealt = floor(tempDamageDealt/2);
			case "Vulnerability": tempDamageDealt = tempDamageDealt*2;
			default: tempDamageDealt = tempDamageDealt
		]
		
		[h:noModsDamageDealt = math.arraySum(json.append(json.path.read(hp.DamageDealt,"\$[?(@.NoModification==1 && @.DamageType=='"+damagetype+"')]['"+if(hp.IsCrit,"Crit","")+"Total']"),0))]
	
		[h,if(tempDamageType == "Healing"):
			hp.FinalDamageDealt = json.set(hp.FinalDamageDealt,"Healing",json.get(hp.FinalDamageDealt,"Healing")+tempDamageDealt);
			tempDamageDealt = tempDamageDealt + noModsDamageDealt
		]

		[h,if(tempDamageType == "Healing" && noModsDamageDealt > 0):
			hp.FinalDamageDealt = json.set(hp.FinalDamageDealt,damagetype,tempDamageDealt);
			hp.FinalDamageDealt = if(and(tempDamageDealt>0,tempDamageType != "Healing"),json.set(hp.FinalDamageDealt,tempDamageType,tempDamageDealt),hp.FinalDamageDealt)
		]
		
		[h:hp.DamageDealtString = if(tempDamageDealt==0,hp.DamageDealtString,listAppend(hp.DamageDealtString,tempDamageDealt," + "))]
	}]
}]

[h,if(json.get(hp.FinalDamageDealt,"Healing")==0),CODE:{
	[h:hp.Healing = 0]
};{
	[h:hp.Healing = json.get(hp.FinalDamageDealt,"Healing")]
}]
[h:hp.FinalDamageDealt = json.remove(hp.FinalDamageDealt,"Healing")]

[h:hp.TempHP = json.get(hp.FinalDamageDealt,"TempHP")]
[h,if(hp.TempHP==0 || hp.TempHP==""),CODE:{
	[h:hp.TempHPGain = 0]
};{
	[h:hp.TempHPGain = json.get(hp.FinalDamageDealt,"TempHP")]
}]
[h:hp.FinalDamageDealt = json.remove(hp.FinalDamageDealt,"TempHP")]

[h:hp.TypesDealt = json.fields(hp.FinalDamageDealt,"json")]
[h:TotalDamage = 0]
[h,foreach(damageType,hp.TypesDealt),CODE:{
	[h:TotalDamage = TotalDamage + json.get(hp.FinalDamageDealt,damageType)]
}]
[h:hp.FinalDamageDealt = json.set(hp.FinalDamageDealt,"Total",TotalDamage)]

[h:"<!-- Things get very funky around simultaneous damage and healing when it comes to crossing the 0 HP threshhold or already being downed. Unlikely to actually come up since simultaneous healing/damage on the same target is rare/nonexistent without homebrew so will add in options later. -->"]
[h,if(getProperty("a5e.stat.TempHP")==0),CODE:{
	[h:hp.TempEndTest = 0]
	[h:RemainingDamage = TotalDamage]
};{
	[h:hp.NewTemp = max(0,getProperty("a5e.stat.TempHP") - TotalDamage)]
	[h:hp.TempDiff = getProperty("a5e.stat.TempHP") - hp.NewTemp]
	[h:setProperty("a5e.stat.TempHP",hp.NewTemp)]
	[h:RemainingDamage = TotalDamage - hp.TempDiff]
	[h:hp.TempEndTest = (getProperty("a5e.stat.TempHP")==0)]
}]

[h:hp.AlreadyDying = if(getProperty("a5e.stat.HP")==0,1,0)]
[h:setProperty("a5e.stat.HP",min(getProperty("a5e.stat.HP") - RemainingDamage + hp.Healing,getProperty("a5e.stat.MaxHP")))]

[h,if(hp.AlreadyDying && hp.Healing!=0),CODE:{
	[h:setProperty("a5e.stat.DeathSaves",json.set(getProperty("a5e.stat.DeathSaves"),"Successes",0,"Failures",0))]
	[h:hp.AlreadyDying = 0]
	[h:hp.Resuscitated = 1]
};{
	[h:hp.Resuscitated = 0]
}]

[h:NoHPConditionTable = "[]"]
[h,if(getProperty("a5e.stat.HP")<1 && TotalDamage!=0),CODE:{
	[h:hp.Resuscitated = 0]
	[h,if(hp.AlreadyDying): DeathFailures = min(3,json.get(getProperty("a5e.stat.DeathSaves"),"Failures")+if(hp.IsCrit,2,1)); DeathFailures = 0]
	[h:setProperty("a5e.stat.DeathSaves",json.set(getProperty("a5e.stat.DeathSaves"),"Failures",DeathFailures))]
	[h:hp.DeadTest = or(abs(getProperty("a5e.stat.HP"))>=getProperty("a5e.stat.MaxHP"),DeathFailures==3)]

	[h,if(!hp.AlreadyDying && !hp.DeadTest),CODE:{
		[h:DyingConditionInfo = json.set("",
			"Conditions",json.append("",pm.a5e.GetSpecificCondition("Dying","Condition")),
			"EndInfo","{}",
			"GroupID",pm.a5e.CreateConditionID(ParentToken),
			"Target",ParentToken,
			"SetBy",""
		)]
		[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): DyingConditionInfo]
		[h:NoHPConditionTable = json.get(macro.return,"Table")]
	};{}]

	[h,if(!hp.AlreadyDying && !hp.DeadTest),CODE:{
		[h:"<!-- Note: This allows Unconscious to be separate from Dying, so that effects that stabilize creatures but leave them unconscious can still function (e.g. Spare the Dying, Healer's Kit, etc.). -->"]
		[h:DyingConditionInfo = json.set("",
			"Conditions",json.append("",pm.a5e.GetSpecificCondition("Unconscious","Condition")),
			"EndInfo","{}",
			"GroupID",pm.a5e.CreateConditionID(ParentToken),
			"Target",ParentToken,
			"SetBy",""
		)]
		[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): DyingConditionInfo]
	};{}]

	[h,if(hp.DeadTest),CODE:{
		[h:DeadConditionInfo = json.set("",
			"Conditions",json.append("",pm.a5e.GetSpecificCondition("Dead","Condition")),
			"EndInfo","{}",
			"GroupID",pm.a5e.CreateConditionID(ParentToken),
			"Target",ParentToken,
			"SetBy",""
		)]
		[h,MACRO("ApplyCondition@Lib:pm.a5e.Core"): DeadConditionInfo]
		[h:NoHPConditionTable = json.get(macro.return,"Table")]
	};{}]
	
	[h:setProperty("a5e.stat.HP",0)]
};{
	[h:hp.DeadTest = 0]
	[h,if(hp.Resuscitated),CODE:{
		[h:DeadOrDyingGroups = json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.Name == 'Dead' || @.Name=='Dying')]['GroupID']")]

		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",DeadOrDyingGroups,"Target",ParentToken)]
		[h:NoHPConditionTable = json.get(macro.return,"Table")]
	};{}]
}]

[h:setBar("Health",(getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP")))]

[h:abilityTable = "[]"]
[h,if(hp.TempHPGain!=0),CODE:{
	[h:TempHPLinks = json.path.read(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.EndTriggers.TempHPLost==1)]")]
	[h,if(json.isEmpty(TempHPLinks)),CODE:{
		[h,if(hp.TempHPGain > getProperty("a5e.stat.TempHP")):
			abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Temporary HP",
				"FalseHeader","",
				"FullContents","<span style='font-size:1.5em; color:%{HealingTextColor}'>"+abs(hp.TempHP)+"</span>",
				"RulesContents","",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			));
			abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Temporary HP",
				"FalseHeader","",
				"FullContents","Not Gained - Lower than Current",
				"RulesContents","",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))
		]
		[h,if(hp.TempHPGain > getProperty("a5e.stat.TempHP")): setProperty("a5e.stat.TempHP",hp.TempHPGain)]
	};{
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Temporary HP",
			"FalseHeader","",
			"FullContents","TODO: Add ability to choose whether or not to accept Temp HP via chat link if there is a linked condition.",
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
		[h:"<!-- TODO: also add above link to the 'Not Gained - Lower than Current' option above for if Temp HP is lower but it has a linked condition -->"]
	}]
};{}]

[h:"<!-- Currently, hp.DamageDealtString looks odd if there is a combination of healing and damage. May want to fix later. -->"]
[h:hp.ChangeValue = hp.Healing - TotalDamage]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Total "+if(hp.ChangeValue>0,"Healing","Damage"),
	"FalseHeader","",
	"FullContents","<span style='font-size:1.5em; color:"+if(hp.ChangeValue>0,"%{HealingTextColor}","%{DamageTextColor}")+"'>"+abs(hp.ChangeValue)+"</span>",
	"RulesContents",if(listCount(hp.DamageDealtString," + ")>1,hp.DamageDealtString+" = ",""),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:abilityTable = json.merge(abilityTable,NoHPConditionTable)]

[h:"<!-- I changed this to a code block for a specific purpose and forgot what it was. If this is still here, I never remembered. -->"]
[h,if(hp.AlreadyDying),CODE:{
	[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Death Saves",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(json.get(getProperty("a5e.stat.DeathSaves"),"Failures")==3,"Failures: <b><span style='font-size:2em; color:%{FailureTextColor}'>"+json.get(getProperty("a5e.stat.DeathSaves"),"Failures")+"</span></b>","Successes: <b><span style='font-size:2em; color:%{SuccessTextColor}'>"+json.get(getProperty("a5e.stat.DeathSaves"),"Successes")+"</span></b> / Failures: <b><span style='font-size:2em; color:%{FailureTextColor}'>"+json.get(getProperty("a5e.stat.DeathSaves"),"Failures")+"</span></b>"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
	))]
};{}]

[h,if(hp.DeadTest):
	abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Death",
	"FalseHeader","",
	"FullContents",token.name+" is dead!",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
	))
]

[h,if(hp.Resuscitated):
	abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Healing",
	"FalseHeader","",
	"FullContents",token.name+" is ready to fight!",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
	))
]

[h,if(getProperty("a5e.stat.Concentration")!="" && TotalDamage>0 && !hp.BypassConc),CODE:{
	[h:hp.ConcDC = max(10,floor(TotalDamage/2))]
	[h,MACRO("Save@Lib:pm.a5e.Core"): 
		json.set(hp.Data,
		"Save","Concentration Save",
		"Type","Concentration",
		"ParentToken",ParentToken
	)]
	
	[h:hp.ConcSave = json.get(macro.return,"Value")]
	[h:hp.PassedSave = hp.ConcSave>=hp.ConcDC]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Concentration",
		"FalseHeader","",
		"FullContents","DC <span style='font-size:1.5em'>"+hp.ConcDC+"</span>",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']",
		"BonusSectionNum",1,
		"BonusSectionType1","Full",
		"BonusBody1","<span style='color:"+if(hp.PassedSave,"%{SuccessTextColor}'>Maintained","%{FailureTextColor}'>Broken")+"</span>"
	))]
	
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	
	[h:"<!-- TODO: More complete concentration implementation, e.g. use ResolveEffects -->"]
	[h,if(!hp.PassedSave && 0),CODE:{
		[h,macro("End Concentration@Lib:pm.a5e.Core"): hp.Data]
	};{}]
};{}]

[h:pm.PassiveFunction("AfterDamaged")]
[h:"<!-- Things Still Needed: Shapechange break (later); Temp HP if there is a condition attached to the lesser value (new or old); return damage dealt by type -->"]
[h:return(0,json.set("","Table",abilityTable,"Damage",hp.FinalDamageDealt))]