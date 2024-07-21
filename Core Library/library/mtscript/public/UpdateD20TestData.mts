[h:TestData = macro.args]
[h:ParentToken = json.get(TestData,"ParentToken")]
[h:d20TestType = json.get(TestData,"TestType")]
[h:effectID = json.get(TestData,"ID")]

[h,if(effectID==""),CODE:{};{
	[h:"<!-- TODO: Add contested check data from the token setting the DC to the effect data -->"]
	[h,switch(d20TestType),CODE:
		case "Check":{
			[h,if(json.get(TestData,"Contested")==1):
				rerollEffectPath = "\$[*][?(@.ID=='"+effectID+"')]['ToResolve']['CheckDC']['DC']";
				rerollEffectPath = "\$[*][?(@.ID=='"+effectID+"')]['ToResolve']['CheckDC']['ChecksMade']['"+ParentToken+"']"
			]
		};
		case "Save":{
			[h:rerollEffectPath = "\$[*][?(@.ID=='"+effectID+"')]['ToResolve']['SaveDC']['SavesMade']['"+ParentToken+"']"]
		};
		case "Attack":{
			[h:rerollEffectPath = "\$[*][?(@.ID=='"+effectID+"')]['ToResolve']['Attack']"]
		}
	]

	[h:rerolledEffect = json.path.set(data.getData("addon:","pm.a5e.core","gd.Effects"),rerollEffectPath,json.remove(TestData,"ID"))]
	[h:data.setData("addon:","pm.a5e.core","gd.Effects",rerolledEffect)]
}]