[h:ItemData = macro.args]
[h:ItemSpellData = json.get(ItemData,"ItemSpellChoice")]
[h:SpellName = json.get(ItemSpellData,"Name")]
[h:SpellLevel = json.get(ItemSpellData,"Level")]
[h:ParentToken = json.get(ItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemID = json.get(ItemData,"ItemID")]
[h:abilityName = "Item Spellcasting"]
[h:abilityDisplayName = json.get(ItemData,"DisplayName")]
[h:SpellcastingOptionsNumber = json.length(json.get(ItemData,"ItemSpellcasting"))]
[h,if(SpellcastingOptionsNumber > 1): abilityDisplayName = abilityDisplayName + ": Cast "+pm.GetDisplayName(SpellName,"sb.Spells")]
[h:abilityClass = "Item"]
[h:abilitySubclass = ""]
[h:abilityFalseName = "Item Effect"]
[h:FeatureFullDescription = ""]
[h:FeatureAbridgedDescription = ""]
[h:pm.a5e.ItemStdVars(ItemData)]

[h:ItemSpellcastingResource = json.get(ItemSpellData,"UseResource")]
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

[h:FinalItemSpellcastingData = json.set("","Spell",SpellName,"FreeCasting",1,"ForcedLevel",SpellLevel,"ForcedClass",json.set("","Class","Item","ItemData",ItemData),"needsSplitGMOutput",needsSplitGMOutput)]
[h:pm.a5e.FeatureSpell(abilityInfo,FinalItemSpellcastingData,FeatureDescription)]

[h:pm.a5e.StdFeatureEnd()]

[r,if(IsTooltip),CODE:{
    [r:pm.a5e.FeatureTooltipCall()]
};{
    [h:pm.a5e.FeatureFormatCall()]
}]