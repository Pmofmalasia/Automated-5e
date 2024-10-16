[h:ItemData = macro.args]
[h:ItemID = json.get(ItemData,"ItemID")]
[h:ParentToken = json.get(ItemData,"ParentToken")]
[h:switchToken(ParentToken)]

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

[h,MACRO("ItemSpellcasting@Lib:pm.a5e.Core"): json.set(ItemData,"ItemSpellChoice",SpellChoice)]

[h:return(0,json.append("",ItemID))]