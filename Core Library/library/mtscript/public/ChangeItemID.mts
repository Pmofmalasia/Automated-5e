[h:ChangedItem = arg(0)]
[h:hasOldID = json.contains(ChangedItem,"ItemID")]
[h:NewItemID = eval("1d10000") + "a5e" + json.get(getInfo("client"),"timeInMs")]
[h:ChangedItem = json.set(ChangedItem,"ItemID",NewItemID)]

[h:"<!-- If the item has a subeffect that uses its own resource, put the NewItemID into the subeffect -->"]
[h:"<!-- TODO: Effects Data Refactoring: Once data is sent in a more consistent manner, for UseResource should just set ItemID to 'this' and grab the correct ID when using the resource. Other options: '' for using any item of that name, an actual ID for using the resource of a DIFFERENT specific item (this one may cause issues if the other item's ID changes) -->"]
[h,if(hasOldID),CODE:{
	[h:NeedsEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.Effects.*.Subeffects.*.UseResource.*.*.Identifier.ItemID != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"Effects")!="")]
	[h:NeedsWeaponEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.WeaponEffects.*.Subeffects.*.UseResource.*.*.Identifier.ItemID != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"WeaponEffects")!="")]
	[h:NeedsSpellFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.ItemSpellcasting.*.UseResource.*.*.Identifier.ItemID != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"ItemSpellcasting")!="")]

	[h,if(NeedsEffectFeatureResourceTest): ChangedItem = json.path.set(ChangedItem,"\$['Effects'][*]['Subeffects'][*]['UseResource'][*][*]['Identifier'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]['ItemID']",NewItemID)]
	[h,if(NeedsWeaponEffectFeatureResourceTest): ChangedItem = json.path.set(ChangedItem,"\$['WeaponEffects'][*]['Subeffects'][*]['UseResource'][*][*]['Identifier'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]['ItemID']",NewItemID)]
	[h,if(NeedsSpellFeatureResourceTest): ChangedItem = json.path.set(ChangedItem,"\$['ItemSpellcasting'][*]['UseResource'][*][*]['Identifier'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]['ItemID']",NewItemID)]
};{
	[h:NeedsEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.Effects.*.Subeffects.*.UseResource.*.*.Identifier.ItemID != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"Effects")!="")]
	[h:NeedsWeaponEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.WeaponEffects.*.Subeffects.*.UseResource.*.*.Identifier.ItemID != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"WeaponEffects")!="")]
	[h:NeedsSpellFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.ItemSpellcasting.*.UseResource.*.*.Identifier.ItemID != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"ItemSpellcasting")!="")]

	[h,if(NeedsEffectFeatureResourceTest): ChangedItem = json.path.put(ChangedItem,"\$['Effects'][*]['Subeffects'][*]['UseResource'][*][*]['Identifier'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
	[h,if(NeedsWeaponEffectFeatureResourceTest): ChangedItem = json.path.put(ChangedItem,"\$['WeaponEffects'][*]['Subeffects'][*]['UseResource'][*][*]['Identifier'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
	[h,if(NeedsSpellFeatureResourceTest): ChangedItem = json.path.put(ChangedItem,"\$['ItemSpellcasting'][*]['UseResource'][*][*]['Identifier'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
}]

[h:return(0,ChangedItem)]