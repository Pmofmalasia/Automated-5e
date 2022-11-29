[h:hp.Data = macro.args]
[h:Flavor = json.get(hp.Data,"Flavor")]
[h:ParentToken = json.get(hp.Data,"ParentToken")]
[h:hp.Source = json.get(hp.Data,"SourceType")]
[h:hp.IsCrit = json.get(hp.Data,"IsCrit")]
[h:hp.IsCrit = if(hp.IsCrit=="",0,hp.IsCrit)]
[h:hp.DamageDealt = json.get(hp.Data,"DamageDealt")]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.EffectData = "[]"]
[h:pm.a5e.OverarchingContext = "Damage"]

[h:"<!-- Temporary adjustment to data from the Change HP Input macro -->"]
[h:tempDamageDealt = ""]
[h,if(json.type(hp.DamageDealt)=="OBJECT"),CODE:{
	[h,foreach(damageType,json.fields(hp.DamageDealt)): tempDamageDealt = json.append(tempDamageDealt,json.set(json.get(hp.DamageDealt,damageType),"DamageType",damageType))]
	[h:hp.DamageDealt = tempDamageDealt]
};{}]

[h:hp.TypesDealt = json.intersection(json.append(pm.GetDamageTypes("Name","json"),"None - Modify Manually","Healing","TempHP"),json.unique(json.path.read(hp.DamageDealt,"[*]['DamageType']")))]
[h:hp.DmgModData = pm.a5e.DamageModCalc(hp.Data)]

[h:hp.FinalDamageDealt = json.set("","Healing",0)]
[h:hp.DamageDealtString = ""]
[h,foreach(damagetype,hp.TypesDealt),CODE:{
	[h,if(damagetype == "None - Modify Manually"),CODE:{
		[h:hp.FinalDamageDealt = json.set(hp.FinalDamageDealt,"Untyped",json.get(hp.DamageDealt,damagetype))]
	};{
		[h:hp.VulnTest = json.contains(json.get(hp.DmgModData,"Vulnerability"),damagetype)]
		[h:hp.ResTest = json.contains(json.get(hp.DmgModData,"Resistance"),damagetype)]
		[h:hp.ImmunTest = json.contains(json.get(hp.DmgModData,"Immunity"),damagetype)]
		[h:hp.AbsorbTest = json.contains(json.get(hp.DmgModData,"Absorption"),damagetype)]
		[h:hp.DRTest = json.get(json.get(hp.DmgModData,"DR"),damagetype)]
		
		[h:hp.ModType = if(hp.AbsorbTest,"Absorption",if(hp.ImmunTest,"Immunity",if(hp.ResTest,if(hp.VulnTest,"","Resistance"),if(hp.VulnTest,"Vulnerability",""))))]
		
		[h:thisDamageTypeInfo = json.path.read(hp.DamageDealt,"[*][?(@.DamageType=='"+damagetype+"')]")]

		[h:tempDamageDealt = 0]
		[h,foreach(damageInstance,thisDamageTypeInfo): tempDamageDealt = tempDamageDealt + if(json.get(damageInstance,"NoModification")==0,json.get(damageInstance,"Total")*json.get(damageInstance,"Modifier"),0)]
		[h:tempDamageDealt = floor(tempDamageDealt) - hp.DRTest]

		[h:tempDamageType = damagetype]
		[h,switch(hp.ModType):
			case "Absorption": tempDamageType = "Healing";
			case "Immunity": tempDamageDealt = 0;
			case "Resistance": tempDamageDealt = floor(tempDamageDealt/2);
			case "Vulnerability": tempDamageDealt = tempDamageDealt*2;
			default: tempDamageDealt = tempDamageDealt
		]
		
		[h:noModsDamageDealt = math.arraySum(json.append(json.path.read(hp.DamageDealt,"[?(@.NoModification==1 && @.DamageType=='"+damagetype+"')]['Total']"),0))]
	
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

[h:"<!-- Temp HP is slightly more complex due to effects that are tied to Temp HP. Will code in later. May need to have a way to loop in any conditions to be set with the Temp HP to accomodate situations where old Temp HP > new, but new has a condition attached. -->"]
[h:hp.TempHP = json.get(hp.FinalDamageDealt,"Temp HP")]
[h,if(hp.TempHP==0 || hp.TempHP==""),CODE:{
	[h:hp.TempHPGain = 0]
};{
	[h:hp.TempHPGain = json.get(hp.FinalDamageDealt,"Temp HP")]
}]
[h:hp.FinalDamageDealt = json.remove(hp.FinalDamageDealt,"Temp HP")]

[h:hp.TypesDealt = json.fields(hp.FinalDamageDealt,"json")]
[h:hp.Damage = 0]
[h,foreach(damageType,hp.TypesDealt),CODE:{
	[h:hp.Damage = hp.Damage + json.get(hp.FinalDamageDealt,damageType)]
}]

[h:"<!-- Things get very funky around simultaneous damage and healing when it comes to crossing the 0 HP threshhold or already being downed. Unlikely to actually come up since simultaneous healing/damage on the same target is rare/nonexistent without homebrew so will add in options later. -->"]
[h,if(TempHP==0),CODE:{
	[h:hp.TempEndTest = 0]
};{
	[h:hp.NewTemp = max(0,TempHP-hp.Damage)]
	[h:hp.TempDiff = TempHP - hp.NewTemp]
	[h:TempHP = hp.NewTemp]
	[h:hp.Damage = hp.Damage-hp.TempDiff]
	[h:hp.TempEndTest = (TempHP==0)]
}]

[h:hp.AlreadyDying = if(getProperty("a5e.stat.HP")==0,1,0)]
[h:setProperty("a5e.stat.HP",min(getProperty("a5e.stat.HP") - hp.Damage + hp.Healing,getProperty("a5e.stat.MaxHP")))]

[h,if(hp.AlreadyDying && hp.Healing!=0),CODE:{
	[h:DeathSaves = json.set(DeathSaves,"Successes",0,"Failures",0)]
	[h:hp.AlreadyDying = 0]
	[h:hp.Resuscitated = 1]
};{
	[h:hp.Resuscitated = 0]
}]

[h,if(getProperty("a5e.stat.HP")<1 && hp.Damage!=0),CODE:{
	[h:hp.Resuscitated = 0]
	[h,if(hp.AlreadyDying): DeathFailures = min(3,json.get(DeathSaves,"Failures")+if(hp.IsCrit,2,1)); DeathFailures = 0]
	[h:DeathSaves = json.set(DeathSaves,"Failures",DeathFailures)]
	[h:hp.DeadTest = or(abs(getProperty("a5e.stat.HP"))>=getProperty("a5e.stat.MaxHP"),DeathFailures==3)]
	
	[h,if(!hp.AlreadyDying),CODE:{
		[h:setState("Dying",1)]
		[h:setState("Unconscious",1)]
	};{}]
	
	[h,if(hp.DeadTest),CODE:{
		[h:setState("Dead",1)]
	};{}]
	
	[h:getProperty("a5e.stat.HP") = 0]
};{
	[h:hp.DeadTest = 0]
	[h,if(hp.Resuscitated),CODE:{
		[h:setState("Dying",0)]
		[h:setState("Unconscious",0)]
	};{}]
}]

[h:setBar("Health",(getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP")))]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:CritColor = pm.CritColor()]
[h:CritFailColor = pm.CritFailColor()]
[h:LinkColor = pm.LinkColor()]

[h:abilityTable = "[]"]
[h,if(hp.TempHPGain!=0):
	abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Temp HP",
	"FalseHeader","",
	"FullContents","<span style='font-size:1.5em; color:"+HealingColor+"'>"+abs(hp.TempHP)+"</span>",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
	))
]

[h:"<!-- Currently, hp.DamageDealtString looks odd if there is a combination of healing and damage. May want to fix later. -->"]
[h:hp.ChangeValue = hp.Healing - hp.Damage]
[h:abilityTable = json.append(abilityTable,
	json.set("",
	"ShowIfCondensed",1,
	"Header","Total "+if(hp.ChangeValue>0,"Healing","Damage"),
	"FalseHeader","",
	"FullContents","<span style='font-size:1.5em; color:"+if(hp.ChangeValue>0,HealingColor,DamageColor)+"'>"+abs(hp.ChangeValue)+"</span>",
	"RulesContents",if(listCount(hp.DamageDealtString)>1,hp.DamageDealtString+" = ",""),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
	)
)]

[h:"<!-- I changed this to a code block for a specific purpose and forgot what it was. If this is still here, I never remembered. -->"]
[h,if(hp.AlreadyDying),CODE:{
	[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Death Saves",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(json.get(DeathSaves,"Failures")==3,"Failures: <b><span style='font-size:2em; color:"+DamageColor+"'>"+json.get(DeathSaves,"Failures")+"</span></b>","Successes: <b><span style='font-size:2em; color:"+HealingColor+"'>"+json.get(DeathSaves,"Successes")+"</span></b> / Failures: <b><span style='font-size:2em; color:"+DamageColor+"'>"+json.get(DeathSaves,"Failures")+"</span></b>"),
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

[h,if(getProperty("stat.Concentration")!="" && hp.Damage>0),CODE:{
	[h:hp.ConcDC = max(10,floor(hp.Damage/2))]
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
	"BonusBody1","<span style='color:"+if(hp.PassedSave,HealingColor+"'>Maintained",DamageColor+"'>Broken")+"</span>"
	))]
	
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
	
	[h,if(!hp.PassedSave),CODE:{
		[h,macro("End Concentration@Lib:pm.a5e.Core"): hp.Data]
	};{}]
};{}]

[h:pm.PassiveFunction("AfterDamaged")]
[h:"<!-- Things Still Needed: Shapechange break (later); Temp HP if there is a condition attached to the lesser value (new or old) -->"]

[h:macro.return = json.set("","Table",abilityTable)]