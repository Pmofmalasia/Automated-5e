[h:ItemData = macro.args]
[h:ItemSpellData = json.get(ItemData,"ItemSpellChoice")]
[h:SpellName = json.get(ItemSpellData,"Name")]
[h:SpellLevel = json.get(ItemSpellData,"Level")]
[h:ParentToken = json.get(ItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
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
	[h:allItemResourceData = pm.a5e.UseResource(ItemSpellcastingResource,a5e.UnifiedAbilities,ParentToken)]
	[h:abilityTable = json.merge(abilityTable,json.get(allItemResourceData,"Table"))]
[h:"<!-- TODO: MaxResource - Need to find a better way to do resource data - probably get rid of current array method, and have HitDice data include number of dice by size. May need a way to spend multiple resources at once, gotta think of one. -->"]
	[h:ItemResourceData = json.get(json.get(allItemResourceData,"Data"),0)]
	[h,switch(json.get(ItemResourceData,"ResourceType")):
		case "Feature": resourceTier = json.get(ItemResourceData,"Tier");
		case "HitDice": resourceTier = json.get(ItemResourceData,"Used");
		case "SpellSlot": resourceTier = json.get(ItemResourceData,"SpellLevel");
		case "Time": resourceTier = 1
	]
	[h:SpellLevel = SpellLevel + resourceTier - 1]
};{}]

[h:FinalItemSpellcastingData = json.set("","Spell",SpellName,"FreeCasting",1,"ForcedLevel",SpellLevel,"ForcedClass",json.set("","Class","Item","ItemData",ItemData),"needsSplitGMOutput",needsSplitGMOutput)]
[h:pm.a5e.FeatureSpell(abilityInfo,FinalItemSpellcastingData,FeatureDescription)]

[h:pm.a5e.StdFeatureEnd()]

[r,if(IsTooltip),CODE:{
    [r:pm.a5e.FeatureTooltipCall()]
};{
    [h:pm.a5e.FeatureFormatCall()]
}]