[h:ChangedItem = macro.args]
[h:hasOldID = json.contains(ChangedItem,"ItemID")]
[h:NewItemID = eval("1d10000") + "a5e" + json.get(getInfo("client"),"timeInMs")]

[h:"<!-- If the item has a subeffect that uses its own resource, put the NewItemID into the subeffect -->"]
[h,if(hasOldID),CODE:{
	[h:NeedsEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.Effects.*.Subeffects.*.UseResource.Feature != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"Effects")!="")]
	[h:NeedsEffectTimeResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.Effects.*.Subeffects.*.UseResource.TimeResource.Resource != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"Effects")!="")]
	[h:NeedsWeaponEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.WeaponEffects.*.Subeffects.*.UseResource.Feature != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"WeaponEffects")!="")]
	[h:NeedsSpellFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.ItemSpellcasting.*.UseResource.Feature != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"ItemSpellcasting")!="")]

	[h,if(NeedsEffectFeatureResourceTest): ChangedItem = json.path.set(ChangedItem,"\$['Effects'][*]['Subeffects'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]['ItemID']",NewItemID)]
	[h,if(NeedsEffectTimeResourceTest): ChangedItem = json.path.set(ChangedItem,"\$['Effects'][*]['Subeffects'][*]['UseResource']['TimeResource']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]['ItemID']",NewItemID)]
	[h,if(NeedsWeaponEffectFeatureResourceTest): ChangedItem = json.path.set(ChangedItem,"\$['WeaponEffects'][*]['Subeffects'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]['ItemID']",NewItemID)]
	[h,if(NeedsSpellFeatureResourceTest): ChangedItem = json.path.set(ChangedItem,"\$['ItemSpellcasting'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]['ItemID']",NewItemID)]
};{
	[h:NeedsEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.Effects.*.Subeffects.*.UseResource.Feature != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"Effects")!="")]
	[h:NeedsEffectTimeResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.Effects.*.Subeffects.*.UseResource.TimeResource.Resource != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"Effects")!="")]
	[h:NeedsWeaponEffectFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.WeaponEffects.*.Subeffects.*.UseResource.Feature != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"WeaponEffects")!="")]
	[h:NeedsSpellFeatureResourceTest = and(!json.isEmpty(json.path.read(ChangedItem,"\$[?(@.ItemSpellcasting.*.UseResource.Feature != null)]","DEFAULT_PATH_LEAF_TO_NULL")),json.get(ChangedItem,"ItemSpellcasting")!="")]

	[h,if(NeedsEffectFeatureResourceTest): ChangedItem = json.path.put(ChangedItem,"\$['Effects'][*]['Subeffects'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
	[h,if(NeedsEffectTimeResourceTest): ChangedItem = json.path.put(ChangedItem,"\$['Effects'][*]['Subeffects'][*]['UseResource']['TimeResource']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
	[h,if(NeedsWeaponEffectFeatureResourceTest): ChangedItem = json.path.put(ChangedItem,"\$['WeaponEffects'][*]['Subeffects'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
	[h,if(NeedsSpellFeatureResourceTest): ChangedItem = json.path.put(ChangedItem,"\$['ItemSpellcasting'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChangedItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
}]

[h:return(0,ChangedItem)]