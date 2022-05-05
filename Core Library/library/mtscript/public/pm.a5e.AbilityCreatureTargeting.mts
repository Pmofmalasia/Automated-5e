[h:abilityInfo = arg(0)]
[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h,if(pm.Tooltip),CODE:{};{
	[h:onlySelfTest = json.get(arg(1),"Self")]
	[h,if(onlySelfTest==1):
		macro.return = json.append("",ParentToken);
		macro.return = pm.a5e.TargetCreatureFiltering(json.set(arg(1),"ParentToken",ParentToken),arg(2))
	]
}]