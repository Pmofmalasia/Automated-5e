[h:DeathData = macro.args]
[h:Flavor=json.get(DeathData,"Flavor")]
[h:ParentToken=json.get(DeathData,"ParentToken")]
[h:outputTargets = if(PC.Ally.Enemy == 2,"none","not-gm")]

[h,if(json.get(DeathData,"PriorDeath")==""),CODE:{};{
	[h,if(HP>0),CODE:{
		[h:HP=0]
		[h:setBar("Health",HP/MaxHP)]
	};{}]
	[h:setState("Dying",1)]
	[h:setState("Unconscious",1)]
	[h:setState("Dead",0)]
	[h:DeathSaves = json.get(DeathData,"PriorDeath")]
}]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"BorderColorOverride",json.get(DeathData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(DeathData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(DeathData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(DeathData,"AccentTextOverride"),
	"TitleFont",json.get(DeathData,"TitleFont"),
	"BodyFont",json.get(DeathData,"BodyFont"),
	"Class","zzDeath",
	"Name","Death Saving Throw",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:LinkColor = pm.LinkColor()]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("Save@Lib:pm.a5e.Core"): 
	json.set(DeathData,
	"Save","Death Save",
	"Type","Death",
	"ParentToken",ParentToken,
	"PCOutput",outputTargets,
	"PriorDeath",DeathSaves
)]

[h:ReturnData = macro.return]
[h:abilityTable = json.get(ReturnData,"Table")]
[h,if(json.get(ReturnData,"FinalRoll")==20),CODE:{
	[h:DeathSaves = json.set("","Successes",0,"Failures",0)]
	[h:setState("Dying",0)]
	[h:setState("Unconscious",0)]
	[h:HP = 1]
	[h:setBar("Health",HP/MaxHP)]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Current Status",
		"FalseHeader","",
		"FullContents",token.name+" shores up their strength, ready to fight again!",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{
	[h:SuccessCount = json.get(DeathSaves,"Successes")]
	[h:FailCount = json.get(DeathSaves,"Failures")]
	[h,if(json.get(ReturnData,"FinalRoll")==1),CODE:{
		[h:DeathSaves = json.set(DeathSaves,"Failures",min(3,FailCount+2))]
	};{
		[h:DeathSaves = if(json.get(ReturnData,"Value")<10,
						json.set(DeathSaves,"Failures",min(3,FailCount+1)),
						json.set(DeathSaves,"Successes",min(3,SuccessCount+1))
						)]
	}]
	
	[h:DeathMessage = "Successes: <b><span style='font-size:2em; color:"+HealingColor+"'>"+json.get(DeathSaves,"Successes")+"</span></b> / Failures: <b><span style='font-size:2em; color:"+DamageColor+"'>"+json.get(DeathSaves,"Failures")+"</span></b>"]
	[h,if(json.get(DeathSaves,"Failures")==3),CODE:{
		[h:DeathMessage = "Failures: <b><span style='font-size:2em; color:"+DamageColor+"'>"+json.get(DeathSaves,"Failures")+"</span></b>"]
		[h:setState("Dead",1)]
	};{}]
	[h,if(json.get(DeathSaves,"Successes")==3),CODE:{
		[h:DeathMessage = "Successes: <b><span style='font-size:2em; color:"+HealingColor+"'>"+json.get(DeathSaves,"Successes")+"</span></b>"]
		[h:setState("Dying",0)]
	};{}]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Current Status",
		"FalseHeader","",
		"FullContents",DeathMessage,
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
}]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]