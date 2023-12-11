[h:DMOnly = json.get(arg(0),"DMOnly")]
[h:OnlyRules=json.get(arg(0),"OnlyRules")]
[h:ParentToken=json.get(arg(0),"ParentToken")]
[h,if(ParentToken!=""): switchToken(ParentToken)]

[h,if(currentToken()!=""),CODE:{
	[h:"<!-- Apparently my past self figured this out, and it works, so not touching it. -->"]
	[h:outputTest.NoRules = if(DMOnly,if(or(and(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros"))<1,getProperty("a5e.stat.Allegiance")=="Enemy"),and(number(data.getData("addon:","pm.a5e.core","HideAllyMacros"))<1,getProperty("a5e.stat.Allegiance")=="Ally")),0,1),0)]
	[h:outputTest.NoRolls = if(DMOnly,if(or(and(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros"))<2,getProperty("a5e.stat.Allegiance")=="Enemy"),and(number(data.getData("addon:","pm.a5e.core","HideAllyMacros"))<2,getProperty("a5e.stat.Allegiance")=="Ally")),0,1),0)]
	[h:outputTest.NoFullMacro = if(DMOnly,if(or(and(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros"))<3,getProperty("a5e.stat.Allegiance")=="Enemy"),and(number(data.getData("addon:","pm.a5e.core","HideAllyMacros"))<3,getProperty("a5e.stat.Allegiance")=="Ally")),if(and(OnlyRules,outputTest.NoRules),1,0),1),0)]
};{
	[h:outputTest.NoRules = DMOnly]
	[h:outputTest.NoRolls = DMOnly]
	[h:outputTest.NoFullMacro = DMOnly]
}]

[h:return(0,json.set("","NoFullMacro",outputTest.NoFullMacro,"NoRolls",outputTest.NoRolls,"NoRules",outputTest.NoRules))]