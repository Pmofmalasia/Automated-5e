[h:DeathData = macro.args]
[h:Flavor=json.get(DeathData,"Flavor")]
[h:ParentToken=json.get(DeathData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:DamageColor = pm.DamageColor()]
[h:HealingColor = pm.HealingColor()]
[h:LinkColor = pm.LinkColor()]

[h,if(json.get(DeathData,"PriorDeath")==""),CODE:{};{
	[h:setProperty("a5e.stat.HP",json.get(DeathData,"PriorHP"))]
	[h:setBar("Health",getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP"))]
	[h:setState("Dying",1)]
	[h:setState("Unconscious",1)]
	[h:setState("Dead",0)]
	[h:setProperty("a5e.stat.DeathSaves",json.get(DeathData,"PriorDeath"))]
}]

[h,MACRO("Save@Lib:pm.a5e.Core"): 
	json.set(DeathData,
	"Save","Death Save",
	"Type","Death",
	"ParentToken",ParentToken,
	"PriorDeath",getProperty("a5e.stat.DeathSaves"),
	"PriorHP",getProperty("a5e.stat.HP")
)]

[h:ReturnData = macro.return]
[h:abilityTable = json.get(ReturnData,"Table")]
[h,if(json.get(ReturnData,"FinalRoll")==20),CODE:{
	[h:setProperty("a5e.stat.DeathSaves",json.set("","Successes",0,"Failures",0))]
	[h:setState("Dying",0)]
	[h:setState("Unconscious",0)]
	[h:setProperty("a5e.stat.HP",max(1,getProperty("a5e.stat.HP")))]
	[h:setBar("Health",getProperty("a5e.stat.HP")/getProperty("a5e.stat.MaxHP"))]
	
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
	[h:SuccessCount = json.get(getProperty("a5e.stat.DeathSaves"),"Successes")]
	[h:FailCount = json.get(getProperty("a5e.stat.DeathSaves"),"Failures")]
	[h,if(json.get(ReturnData,"FinalRoll")==1),CODE:{
		[h:setProperty("a5e.stat.DeathSaves",json.set(getProperty("a5e.stat.DeathSaves"),"Failures",min(3,FailCount+2)))]
	};{
		[h:setProperty("a5e.stat.DeathSaves",if(json.get(ReturnData,"Value")<10,json.set(getProperty("a5e.stat.DeathSaves"),"Failures",min(3,FailCount+1)),json.set(getProperty("a5e.stat.DeathSaves"),"Successes",min(3,SuccessCount+1))))]
	}]
	
	[h:DeathMessage = "Successes: <b><span style='font-size:2em; color:"+HealingColor+"'>"+json.get(getProperty("a5e.stat.DeathSaves"),"Successes")+"</span></b> / Failures: <b><span style='font-size:2em; color:"+DamageColor+"'>"+json.get(getProperty("a5e.stat.DeathSaves"),"Failures")+"</span></b>"]
	[h,if(json.get(getProperty("a5e.stat.DeathSaves"),"Failures")==3),CODE:{
		[h:DeathMessage = "Failures: <b><span style='font-size:2em; color:"+DamageColor+"'>"+json.get(getProperty("a5e.stat.DeathSaves"),"Failures")+"</span></b>"]
		[h:setState("Dead",1)]
	};{}]
	[h,if(json.get(getProperty("a5e.stat.DeathSaves"),"Successes")==3),CODE:{
		[h:DeathMessage = "Successes: <b><span style='font-size:2em; color:"+HealingColor+"'>"+json.get(getProperty("a5e.stat.DeathSaves"),"Successes")+"</span></b>"]
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

[h:macro.return = json.set(ReturnData,"Table",abilityTable)]