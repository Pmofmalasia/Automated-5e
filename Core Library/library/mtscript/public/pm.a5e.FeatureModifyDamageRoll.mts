[h:EffectToModifyData = arg(1)]
[h:ModifyHowData = arg(2)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:"<!-- Can accept an effect ID and get the damage instances from that (ID), accept WhichEffect and get damage type from the current pm.a5e.EffectData (CurrentEffect), or just accept all of the raw damage instances and modify those (Instances). Not sure what the use for the latter two is, but they're here anyways. Default takes a given effect object and modifies that, returns the modified effect (for use in ResolveEffects, since during resolution effID is modified without updating gd.Effects; may be useful elsewhere) -->"]
[h:EffectToModifySource = json.get(EffectToModifyData,"EffectSource")]
[h,switch(EffectToModifySource),CODE:
	case "ID":{
		[h:EffectID = json.get(EffectToModifyData,"ID")]
		[h:currentEffects = data.getData("addon:","pm.a5e.core","gd.Effects")]
		[h:EffectToModify = json.get(json.path.read(currentEffects,"\$[*][?(@.ID=='"+EffectID+"')]"),0)]
		[h:HasToResolveTest = json.get(EffectToModify,"ToResolve") != ""]
		[h,if(HasToResolveTest):
			HasDamageTest = json.get(json.get(EffectToModify,"ToResolve"),"Damage") != "";
			HasDamageTest = 0
		]
		[h,if(HasDamageTest): 
			EffectDamageToModify = json.path.read(EffectToModify,"\$.ToResolve.Damage");
			EffectDamageToModify = "[]"
		]
	};
	case "CurrentEffect":{
		[h:EffectID = json.get(EffectToModifyData,"WhichEffect")]
		[h:NeedsNewEffectTest = json.length(pm.a5e.EffectData) <= EffectID]
		[h,if(!NeedsNewEffectTest):
			EffectToModify = json.get(pm.a5e.EffectData,EffectID);
			EffectToModify = "{}"
		]
		[h:HasToResolveTest = json.get(EffectToModify,"ToResolve") != ""]
		[h,if(HasToResolveTest):
			HasDamageTest = json.get(json.get(EffectToModify,"ToResolve"),"Damage") != "";
			HasDamageTest = 0
		]
		[h,if(HasDamageTest): 
			EffectDamageToModify = json.path.read(EffectToModify,"\$.ToResolve.Damage");
			EffectDamageToModify = "[]"
		]
	};
	case "Instances":{
		[h:EffectDamageToModify = json.get(EffectToModifyData,"Instances")]
	};
	default:{
		[h:EffectToModify = EffectToModifyData]
		[h:HasToResolveTest = json.get(EffectToModify,"ToResolve") != ""]
		[h,if(HasToResolveTest):
			HasDamageTest = json.get(json.get(EffectToModify,"ToResolve"),"Damage") != "";
			HasDamageTest = 0
		]
		[h,if(HasDamageTest): 
			EffectDamageToModify = json.path.read(EffectToModify,"\$.ToResolve.Damage");
			EffectDamageToModify = "[]"
		]
	}
]

[h,if(json.get(ModifyHowData,"Method")=="AddDamage"),CODE:{
	[h:NewDamageData = json.get(ModifyHowData,"DamageInstance")]
	[h,if(json.get(NewDamageData,"NonDamageData")==""):
		NonDamageData = "{}";
		NonDamageData = json.get(NewDamageData,"NonDamageData")
	]
	[h:pm.a5e.FeatureDamageRoll(
		json.get(NewDamageData,"Number"),
		json.get(NewDamageData,"Size"),
		json.get(NewDamageData,"Bonus"),
		json.get(NewDamageData,"DamageType"),
		NonDamageData
	)]
	[h:return(!IsTooltip)]
	[h:"<!-- Note: pm.DamageRoll is set as part of pm.a5e.FeatureDamageRoll -->"]
	[h:ModifyHowData = json.set(ModifyHowData,"DamageInstance",pm.DamageRoll)]
};{}]
[h:return(!IsTooltip)]

[h,MACRO("ModifyDamageRoll@Lib:pm.a5e.Core"): json.append("",EffectDamageToModify,ModifyHowData)]

[h:ModifiedDamage = macro.return]

[h,switch(EffectToModifySource),CODE:
	case "ID":{
		[h,switch(HasToResolveTest+""+HasDamageTest):
			case "11": data.setData("addon:","pm.a5e.core","gd.Effects",json.path.set(currentEffects,"\$[*][?(@.ID=='"+EffectID+"')]['ToResolve']['Damage']",ModifiedDamage));
			case "10": data.setData("addon:","pm.a5e.core","gd.Effects",json.path.put(currentEffects,"\$[*][?(@.ID=='"+EffectID+"')]['ToResolve']","Damage",ModifiedDamage));
			default: data.setData("addon:","pm.a5e.core","gd.Effects",json.path.put(currentEffects,"\$[*][?(@.ID=='"+EffectID+"')]","ToResolve",json.set("","Damage",ModifiedDamage)))
		]
	};
	case "CurrentEffect":{
		[h,switch(HasToResolveTest+""+HasDamageTest):
			case "11": pm.a5e.EffectData = json.path.set(pm.a5e.EffectData,"\$[*][?(@.ID=='"+EffectID+"')]['ToResolve']['Damage']",ModifiedDamage);
			case "10": pm.a5e.EffectData = json.path.put(pm.a5e.EffectData,"\$[*][?(@.ID=='"+EffectID+"')]['ToResolve']","Damage",ModifiedDamage);
			default: pm.a5e.EffectData = json.path.put(pm.a5e.EffectData,"\$[*][?(@.ID=='"+EffectID+"')]","ToResolve",json.set("","Damage",ModifiedDamage))
		]
	};
	case "Instances":{
		[h:return(0,ModifiedDamage)]
	};
	default:{
		[h,switch(HasToResolveTest+""+HasDamageTest):
			case "11": EffectToModify = json.path.set(EffectToModify,"\$['ToResolve']['Damage']",ModifiedDamage);
			case "10": EffectToModify = json.path.put(EffectToModify,"\$['ToResolve']","Damage",ModifiedDamage);
			default: EffectToModify = json.set(EffectToModify,"ToResolve",json.set("","Damage",ModifiedDamage))
		]
		[h:return(0,EffectToModify)]
	}
]

[h:"<!-- In the future, may adjust this macro to no longer modify as the ability is used, but instead pass a 'DamageModification' key or something to be resolved in ResolveEffects. This macro would then be used to package that key and also roll damage for damage that needs to be added. -->"]