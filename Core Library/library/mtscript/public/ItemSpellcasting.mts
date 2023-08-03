[h:SpellData = macro.args]
[h:SpellName = json.get(SpellData,"Name")]
[h:SpellLevel = json.get(SpellData,"Level")]
[h:ParentToken = json.get(SpellData,"Name")]
[h:ItemID = json.get(SpellData,"ItemID")]
[h:ItemData = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == '"+ItemID+"')]")]
[h:assert(!json.isEmpty(ItemData),"Item not found in inventory!")]
[h:ItemData = json.get(ItemData,0)]
[h:abilityName = "Item Spellcasting"]
[h:abilityDisplayName = json.get(ItemData,"DisplayName")]
[h:SpellcastingOptionsNumber = json.length(json.get(ItemData,"ItemSpellcasting"))]
[h,if(SpellcastingOptionsNumber > 1): abilityDisplayName = abilityDisplayName + ": Cast "+pm.GetDisplayName(SpellName,"sb.Spells")]
[h:abilityClass = "Item"]
[h:abilitySubclass = ""]
[h:abilityFalseName = "Item Effect"]
[h:FeatureFullDescription = ""]
[h:FeatureAbridgedDescription = ""]
[h:pm.a5e.ItemStdVars(SpellData)]

[h:ItemSpellcastingResource = json.get(SpellData,"UseResource")]
[h,if(ItemSpellcastingResource != ""),CODE:{
	[h:pm.a5e.FeatureResources(abilityInfo,ItemSpellcastingResource)]
	[h:BaseResourceUsed = json.get(json.get(ItemSpellcastingResource,"Feature"),"ResourceUsed")]
	[h:CanAHLTest = BaseResourceUsed != json.get(json.get(ItemSpellcastingResource,"Feature"),"ResourceUsedMax")]
	[h,if(CanAHLTest),CODE:{
		[h:ItemSpellResourceUsed = pm.a5e.GetEffectComponent(pm.a5e.EffectData,json.set("","Main","Resource","SecondaryKey","Used"))]
		[h:ExtraResource = ItemSpellResourceUsed - BaseResourceUsed]
		[h:ExtraLevels = floor(ExtraResource / json.get(json.get(ItemSpellcastingResource,"Feature"),"Increment"))]
		[h:SpellLevel = SpellLevel + ExtraLevels]
	};{}]
}]

[h:SpellData = json.set("","Spell",SpellName,"FreeCasting",1,"ForcedLevel",SpellLevel,"ForcedClass",json.set("","Class","Item","ItemData",ItemData),"DMOnly",DMOnly)]

[h:pm.a5e.FeatureSpell(abilityInfo,SpellData,FeatureDescription)]

[h:pm.a5e.StdFeatureEnd()]

[r,if(IsTooltip),CODE:{
    [r:pm.a5e.FeatureTooltipCall()]
};{
    [h:pm.a5e.FeatureFormatCall()]
}]