[h:resolveAllTest = 0]
[h:resolveHow = json.get(macro.args,"ResolveHow")]
[h:chosenEffect = json.get(macro.args,"Effect")]
[h:EffectDisplay = json.get(macro.args,"DisplayName")]

[h:incompleteEffects = data.getData("addon:","pm.a5e.core","gd.Effects")]
[h,switch(resolveAllTest),CODE:
	case 0:{
		[h,switch(resolveHow),CODE:
			case "NoMod":{
				[h:jsonPATH = "[*][?(@.ID=='"+chosenEffect+"')]"]
				[h,MACRO("ResolveEffectsBorder@Lib:pm.a5e.Core"): json.get(json.path.read(incompleteEffects,jsonPATH),0)]
			};
			case "Mods":{
				[h:broadcast("This feature does not exist yet!")]
			};
			case "Remove":{
				[h:jsonPATH = "[*][?(@.ID=='"+chosenEffect+"' || @.ParentSubeffect=='"+chosenEffect+"')]"]
				[h:setLibProperty("gd.Effects",json.path.delete(incompleteEffects,jsonPATH),"Lib:pm.a5e.Core")]
				[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]
				[h:broadcast("Effect "+EffectDisplay+" removed.","gm")]
			}
		]
	};
	case 1:{
		[h,foreach(effect,incompleteEffects),CODE:{
			[h,MACRO("ResolveEffectsBorder@Lib:pm.a5e.Core"): effect]
		}]
	};
	case 2:{
		[h:setLibProperty("gd.Effects","[]","Lib:pm.a5e.Core")]
		[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]
	}
]