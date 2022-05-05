[h:AttackData = macro.args]
[h:WeaponData = json.get(AttackData,"WeaponData")]

[h:ClassFeatureData = json.set("",
	"Flavor",json.get(WeaponData,"Flavor"),
	"ParentToken",json.get(AttackData,"ParentToken"),
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

[h:sendToResolveEffectsLink = macroLinkText("Resolve Effects@Lib:pm.a5e.Core","gm",json.get(pm.a5e.EffectData,0),ParentToken)]
[h:broadcast("<a href='"+sendToResolveEffectsLink+"'>Click here to apply the effects to all targets</a>","gm")]