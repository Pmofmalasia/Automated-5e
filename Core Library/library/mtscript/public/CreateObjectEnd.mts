[h:ObjectData = json.get(data.getData("addon:","pm.a5e.core","ct.NewObject"),getPlayerName())]
[h:ObjectName = json.get(ObjectData,"Name")]
[h:ObjectType = json.get(ObjectData,"Type")]

[h:ObjectData = json.remove(ObjectData,"Sourcebook")]
[h:ObjectData = json.remove(ObjectData,"EffectsNumber")]
[h:ObjectData = json.remove(ObjectData,"SpecialEffects")]
[h:ObjectData = json.remove(ObjectData,"FinalLocation")]
[h:ObjectData = json.remove(ObjectData,"ParentToken")]

[h:newTemplateTest = json.get(ObjectData,"NewTemplate")]
[h:ObjectData = json.remove(ObjectData,"NewTemplate")]

[h:setLibProperty("ct.NewObject",json.remove(data.getData("addon:","pm.a5e.core","ct.NewObject"),getPlayerName()),"Lib:pm.a5e.Core")]

[h,if(json.get(ObjectData,"Type") == "Weapon"),CODE:{
	[h:"<!-- Removes the dummy subeffect used to show to the subeffect creation JS -->"]
	[h:ObjectEffects = json.get(ObjectData,"Effects")]
	[h:ObjectEffects = json.path.delete(ObjectEffects,"\$[*]['Subeffects'][?(@.isDummySubeffect==1)]")]

	[h:"<!-- TODO: Remove this shifting of Subeffects to ObjectEffects when fixed (see CreateObjectProcessing note) -->"]
	[h:ObjectData = json.set(ObjectData,"WeaponEffects",ObjectEffects)]
	[h:ObjectData = json.set(ObjectData,"isWeaponEffectRandom",json.get(ObjectData,"isEffectRandom"))]
	[h:ObjectData = json.remove(ObjectData,"Effects")]
	[h:ObjectData = json.remove(ObjectData,"isEffectRandom")]
};{}]

[h,if(json.get(ObjectData,"tempLightEffects")!=""),CODE:{
	[h:ObjectEffects = json.get(ObjectData,"Effects")]
	[h:ObjectEffects = json.merge(ObjectEffects,json.get(ObjectData,"tempLightEffects"))]
	[h:ObjectData = json.set(ObjectData,"Effects",ObjectEffects)]
	[h:ObjectEffects = json.remove(ObjectData,"tempLightEffects")]
};{}]

[h:ParentToken = json.get(macro.args,"ParentToken")]
[h,if(ParentToken == ""),CODE:{
	[h,if(newTemplateTest),CODE:{
		[h:setLibProperty("sb."+objectType+"Types",json.append(getLibProperty("sb."+objectType+"Types","Lib:"+json.get(ObjectData,"Library")),ObjectData),"Lib:"+json.get(ObjectData,"Library"))]
	};{}]

	[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(ObjectData,"Library")),ObjectData),"Lib:"+json.get(ObjectData,"Library"))]
};{
	[h:switchToken(ParentToken)]
	[h,MACRO("AddItemProcessing@Lib:pm.a5e.Core"): json.set("",
		"ParentToken",ParentToken,
		"ItemChoice",ObjectData,
		"NumberAdded",1
	)]
}]

[h:broadcast("Object "+json.get(ObjectData,"DisplayName")+" created.")]