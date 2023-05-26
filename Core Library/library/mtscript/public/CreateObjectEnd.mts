[h:ObjectData = json.get(getLibProperty("ct.NewObject","Lib:pm.a5e.Core"),getPlayerName())]
[h:ObjectName = json.get(ObjectData,"Name")]
[h:ObjectType = json.get(ObjectData,"Type")]
[h:weaponSourcebook = json.get(ObjectData,"Sourcebook")]

[h:ObjectData = json.remove(ObjectData,"Sourcebook")]
[h:ObjectData = json.remove(ObjectData,"EffectsNumber")]
[h:ObjectData = json.remove(ObjectData,"SpecialEffects")]
[h:ObjectData = json.remove(ObjectData,"FinalLocation")]
[h:ObjectData = json.remove(ObjectData,"ParentToken")]

[h:setLibProperty("ct.NewObject",json.remove(getLibProperty("ct.NewObject","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h,if(ParentToken == ""),CODE:{
	[h,if(newTemplateTest),CODE:{
		[h:setLibProperty("sb."+objectType+"Types",json.append(getLibProperty("sb."+objectType+"Types","Lib:"+json.get(ObjectData,"Library")),ObjectData),"Lib:"+json.get(ObjectData,"Library"))]
	};{}]

	[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(ObjectData,"Library")),ObjectData),"Lib:"+json.get(ObjectData,"Library"))]

	[h:broadcast("Object "+json.get(ObjectData,"DisplayName")+" has been created.")]
};{
	[h:switchToken(ParentToken)]

	[h:"<!-- Removes the dummy subeffect used to show to the subeffect creation JS -->"]
	[h:ObjectSubeffects = json.get(ObjectData,"Subeffects")]
	[h:ObjectSubeffects = json.remove(ObjectSubeffects,0)]
	[h:ObjectData = json.set(ObjectData,"Subeffects",ObjectSubeffects)]

	[h:ItemID = eval("1d1000000") + json.get(getInfo("client"),"timeInMs")]
	[h:ObjectData = json.set(ObjectData,"ItemID",ItemID)]
	[h:setProperty("a5e.stat.Inventory",json.append(getProperty("a5e.stat.Inventory"),ObjectData))]
}]

[h:broadcast("Object "+json.get(ObjectData,"DisplayName")+" created.")]