[h:objects = data.getData("addon:","pm.a5e.core","sb.Objects")]

[h:objectsUsingResource = json.path.read(objects,"\$[*][?(@.Effects.*.Subeffects.*.UseResource != null && @.Effects != null)]","DEFAULT_PATH_LEAF_TO_NULL")]

[h:i = 0]
[h,foreach(feature,objectsUsingResource),CODE:{
	[h:j = 0]
	[h:effects = json.get(feature,"Effects")]
	[h,foreach(effect,effects),CODE:{
		[h:subeffects = json.get(effect,"Subeffects")]
		[h,foreach(subeffect,subeffects),if(json.get(subeffect,"UseResource") != ""): effect = json.set(effect,"Subeffects",json.set(subeffects,roll.count,json.set(subeffect,"UseResource",zzConvertOldUseResource(json.get(subeffect,"UseResource")))))]
		[h:feature = json.set(feature,"Effects",json.set(effects,j,effect))]
		[h:j = j + 1]
	}]
	[h:objectsUsingResource = json.set(objectsUsingResource,i,feature)]
	[h:i = i + 1]
}]

[h:broadcast(objectsUsingResource)]