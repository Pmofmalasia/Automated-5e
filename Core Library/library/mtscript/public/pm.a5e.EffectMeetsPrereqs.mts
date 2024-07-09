[h:EffectToCheck = arg(0)]
[h:EffectPrerequisites = arg(1)]
[h,if(argCount() > 2): ParentToken = arg(2); ParentToken = ""]
[h,if(json.type(EffectToCheck) == "UNKNOWN"),CODE:{
	[h:EffectToCheck = json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"\$[*][?(@.ID == '"+EffectToCheck+"')]")]
	[h,if(json.isEmpty(EffectToCheck)): EffectToCheck = "{}"; EffectToCheck = json.get(EffectToCheck,0)]
};{}]
[h,if(json.type(EffectPrerequisites) == "OBJECT"): EffectPrerequisites = json.append("",EffectPrerequisites)]

[h:anyInstanceMeetsPrereqs = 0]
[h:prerequisiteTypes = json.fields(EffectPrerequisites)]
[h:"<!-- Different instances of EffectPrerequisites are combined with OR, while internally each instance is combined with AND (essentially). NestedPrerequisites would then hypothetically allow for combining with OR within an instance (untested). -->"]
[h,foreach(instance,EffectPrerequisites),CODE:{
	[h:thisInstanceMeetsAllPrereqs = 1]
	[h,foreach(prereq,prerequisiteTypes),CODE:{
		[h,switch(prereq):
			case "General": thisInstanceMeetsAllPrereqs = pm.a5e.EffectGeneralPrereqs(EffectToCheck,json.get(EffectPrerequisites,"General"));
			case "Attack": thisInstanceMeetsAllPrereqs = pm.a5e.EffectAttackPrereqs(EffectToCheck,json.get(EffectPrerequisites,"Attack"));
			case "Weapon": thisInstanceMeetsAllPrereqs = pm.a5e.EffectWeaponPrereqs(EffectToCheck,json.get(EffectPrerequisites,"Weapon"));
			case "Spell": thisInstanceMeetsAllPrereqs = pm.a5e.EffectSpellPrereqs(EffectToCheck,json.get(EffectPrerequisites,"Spell"));
			case "ForcedCheck - Doesn't Exist": thisInstanceMeetsAllPrereqs = pm.a5e.EffectForcedCheckPrereqs(EffectToCheck,json.get(EffectPrerequisites,"ForcedCheck"));
			case "ForcedSave": thisInstanceMeetsAllPrereqs = pm.a5e.EffectForcedSavePrereqs(EffectToCheck,json.get(EffectPrerequisites,"ForcedSave"));
			case "Damage - Doesn't Exist": thisInstanceMeetsAllPrereqs = pm.a5e.EffectDamagePrereqs(EffectToCheck,json.get(EffectPrerequisites,"Damage"));
			case "ConditionsApplied - Doesn't Exist": thisInstanceMeetsAllPrereqs = pm.a5e.EffectConditionsAppliedPrereqs(EffectToCheck,json.get(EffectPrerequisites,"ConditionsApplied"));
			case "Movement - Doesn't Exist": "";
			case "Targets - Doesn't Exist": "<!-- Note: Will need additional steps for Target prereq than just jumping to CreaturePrereq as will need to account for more general things like target number, other target types (object, effects), etc. Likely will have a TargetsPrereq that calls to CreaturePrereq. -->";
			case "User": thisInstanceMeetsAllPrereqs = pm.a5e.CreaturePrereqs(json.get(EffectToCheck,"ParentToken"),json.get(EffectPrerequisites,"User"),ParentToken);
			case "ThisToken": thisInstanceMeetsAllPrereqs = pm.a5e.CreaturePrereqs(ParentToken,json.get(EffectPrerequisites,"ThisToken"));
			case "NestedPrerequisites": thisInstanceMeetsAllPrereqs = pm.a5e.thisInstanceMeetsAllPrereqs(EffectToCheck,json.get(EffectPrerequisites,"NestedPrerequisites"),ParentToken)
			default: ""
		]
	}]
	[h:anyInstanceMeetsPrereqs = max(anyInstanceMeetsPrereqs,thisInstanceMeetsAllPrereqs)]
}]

[h:return(0,anyInstanceMeetsPrereqs)]