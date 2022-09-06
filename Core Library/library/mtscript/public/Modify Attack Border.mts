[h:AttackData = macro.args]
[h:WeaponData = json.get(AttackData,"WeaponData")]
[h:ParentToken = json.get(AttackData,"ParentToken")]

[h:ClassFeatureData = json.set("",
	"Flavor",json.get(WeaponData,"Flavor"),
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class","zzWeaponAttack",
	"Name",json.get(WeaponData,"Name")+" Attack Reroll",
	"FalseName","Weapon Attack",
	"OnlyRules",0
)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[macro("Attack@Lib:pm.a5e.Core") : AttackData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:pm.a5e.EffectData = json.path.put(json.get(macro.return,"Effect"),"[*]","Class","zzWeaponAttack")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]

[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]