[h:ItemSpellcastingData = macro.args]
[h:ItemID = json.get(ItemSpellcastingData,"ItemID")]
[h:ParentToken = json.get(ItemSpellcastingData,"ParentToken")]

[h:ItemData = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == '"+ItemID+"')]")]
[h:assert(!json.isEmpty(ItemData),"Item not found in inventory!")]
[h:ItemData = json.get(ItemData,0)]

[h:SpellOptionsData = json.get(ItemData,"ItemSpellcasting")]
[h,if(json.length(SpellOptionsData) > 1),CODE:{
	[h:SpellOptions = ""]
	[h,foreach(spell,SpellOptionsData),CODE:{
		[h:SpellOptions = json.append(SpellOptions,pm.GetDisplayName(json.get(spell,"Name"),"sb.Spells"))]
	}]

	[h:abort(input(" SpellChoice | "+SpellOptions+" | Choose a Spell | RADIO | DELIMITER=JSON "))]

	[h:SpellChoice = json.get(SpellOptionsData,SpellChoice)]
};{
	[h:SpellChoice = json.get(SpellOptionsData,0)]
}]

[h,MACRO("ItemSpellcasting@Lib:pm.a5e.Core"): json.merge(SpellChoice,ItemSpellcastingData)]