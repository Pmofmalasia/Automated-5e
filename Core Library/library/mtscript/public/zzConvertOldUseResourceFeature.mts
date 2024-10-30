[h:objects = data.getData("addon:","pm.a5e.core","sb.Abilities")]

[h:features = json.path.read(objects,"\$[*][?(@.Effects != null)]['DisplayName']","DEFAULT_PATH_LEAF_TO_NULL")]

[h:broadcast(features)]




[h:objects = data.getData("addon:","pm.a5e.core","sb.MonsterFeatures")]

[h:features = json.path.read(objects,"\$[*][?(@.ButtonInfo != null && @.Effects != null)]['DisplayName']","DEFAULT_PATH_LEAF_TO_NULL")]

[h:broadcast(features)]





[h:objects = data.getData("addon:","pm.a5e.core","sb.Abilities")]

[h:features = json.path.read(objects,"\$[*][?(@.ButtonInfo != null && @.Name == 'WildShape')]['DisplayName']","DEFAULT_PATH_LEAF_TO_NULL")]

[h:broadcast(features)]

[h:i = 0]
[h,foreach(object,objects),CODE:{
	[h:j = 0]
	[h:effects = json.get(object,"Effects")]
	[h:usesResourceTest = !json.isEmpty(json.path.read(object,"\$[?(@.Effects.*.Subeffects.*.UseResource != null && @.Effects != null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
	[h,if(usesResourceTest),foreach(effect,effects),CODE:{
		[h:subeffects = json.get(effect,"Subeffects")]
		[h,foreach(subeffect,subeffects),if(json.get(subeffect,"UseResource") != ""): effect = json.set(effect,"Subeffects",json.set(subeffects,roll.count,json.set(subeffect,"UseResource",zzConvertOldUseResource(json.get(subeffect,"UseResource")))))]
		[h:effects = json.set(effects,j,effect)]
		[h:j = j + 1]
	}]
	[h,if(effects != ""): object = json.set(object,"Effects",effects)]
	[h:objects = json.set(objects,i,object)]
	[h:i = i + 1]
}]

[h:broadcast(objects)]