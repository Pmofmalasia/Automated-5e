[h:SpellCoreData = macro.args]
[h:currentSpellData = data.getData("addon:","pm.a5e.core","ct.NewSpell")]
[h:SpellCoreData = pm.a5e.KeyStringsToNumbers(SpellCoreData)]

[h:SpellCoreData = json.set(SpellCoreData,"DisplayName",pm.EvilChars(json.get(SpellCoreData,"DisplayName")))]
[h:SpellCoreData = json.set(SpellCoreData,"Name",pm.RemoveSpecial(json.get(SpellCoreData,"DisplayName")))]

[h,if(json.contains(SpellCoreData,"mComp")),CODE:{
	[h,if(json.get(SpellCoreData,"mComponents")==""):
		SpellCoreData = json.remove(SpellCoreData,"mComponents");
		SpellCoreData = json.set(SpellCoreData,"mComponents",base64.encode(json.get(SpellCoreData,"mComponents")))
	]
	
	[h,if(json.get(SpellCoreData,"mComponentsConsumed")==""):
		SpellCoreData = json.remove(SpellCoreData,"mComponentsConsumed");
		SpellCoreData = json.set(SpellCoreData,"mComponentsConsumed",base64.encode(json.get(SpellCoreData,"mComponentsConsumed")))
	]
};{}]

[h:classesWithSpell = "[]"]
[h:UniqueSpellListFeatures = json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"[*][?(@.UniqueSpellList==1)]")]

[h,foreach(tempFeature,UniqueSpellListFeatures),CODE:{
	[h:onListTest = json.contains(SpellCoreData,"is"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass"))]
	[h,if(onListTest): classesWithSpell = json.append(classesWithSpell,json.set("","Name",json.get(tempFeature,"Name"),"Class",json.get(tempFeature,"Class"),"Subclass",json.get(tempFeature,"Subclass")))]
	[h:SpellCoreData = json.remove(SpellCoreData,"is"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass"))]
}]

[h:SpellCoreData = json.set(SpellCoreData,"ClassesWithSpell",classesWithSpell)]

[h:tempDescription = pm.EvilChars(json.get(SpellCoreData,"Description"))]
[h:tempDescription = replace(encode(tempDescription),"%0A","<br>")]
[h:tempDescription = decode(tempDescription)]
[h:SpellCoreData = json.set(SpellCoreData,"Description",base64.encode(tempDescription))]

[h:tempAHLDescription = pm.EvilChars(json.get(SpellCoreData,"AHLDescription"))]
[h:tempAHLDescription = replace(encode(tempAHLDescription),"%0A","<br>")]
[h:tempAHLDescription = decode(tempAHLDescription)]
[h:SpellCoreData = json.set(SpellCoreData,"AHLDescription",base64.encode(tempAHLDescription))]

[h:newSpellData = json.set(currentSpellData,getPlayerName(),SpellCoreData)]
[h:setLibProperty("ct.NewSpell",newSpellData,"Lib:pm.a5e.Core")]

[h:closeDialog("Spell Creation")]

[h:EffectsNumber = json.get(SpellCoreData,"EffectsNumber")]

[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
	"WhichSubeffect",1,
	"EffectType","Spell",
	"EffectsNumber",EffectsNumber,
	"ExtraData",json.set("",
		"SpellLevel",json.get(SpellCoreData,"Level"),
		"SpellName",json.get(SpellCoreData,"Name"))
)]

[h,MACRO("CreateSpellEnd@Lib:pm.a5e.Core"): macro.return]