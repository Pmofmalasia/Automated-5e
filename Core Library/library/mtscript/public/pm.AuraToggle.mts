[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.StateName=arg(1)]
[h:pm.AuraRange=arg(2)]
[h:pm.AuraColor=arg(3)]
[h:outputTest.NoRules=arg(4)]

[h,if(outputTest.NoRules),CODE:{
	[h:setLight("GM Aura",pm.AuraColor+" "+pm.AuraRange,if(getState(pm.StateName),1,0))]
};{
	[h:setLight("Basic Aura",pm.AuraColor+" "+pm.AuraRange,if(getState(pm.StateName),1,0))]
}]