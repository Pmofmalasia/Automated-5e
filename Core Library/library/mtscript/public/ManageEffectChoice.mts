[h:resolveAllTest = 0]
[h:broadcast(currentToken())]
[h:resolveHow = json.get(macro.args,"ResolveHow")]
[h:chosenEffect = json.get(macro.args,"Effect")]
[h:EffectDisplay = json.get(macro.args,"DisplayName")]

[h,switch(resolveAllTest),CODE:
	case 0:{
		[h,switch(resolveHow),CODE:
			case "NoMod":{
				[h,MACRO("Resolve Effects@Lib:pm.a5e.Core"): json.get(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),chosenEffect)]
			};
			case "Mods":{
				[h:broadcast("This feature does not exist yet!")]
			};
			case "Remove":{
				[h:setLibProperty("gd.Effects",json.remove(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),chosenEffect),"Lib:pm.a5e.Core")]
				[h:broadcast("Effect "+EffectDisplay+" removed.","gm")]
			}
		]
	};
	case 1:{
		[h,foreach(effect,incompleteEffects),CODE:{
			[h,MACRO("Resolve Effects@Lib:pm.a5e.Core"): effect]
		}]
	};
	case 2:{
		[h:setLibProperty("gd.Effects","[]","Lib:pm.a5e.Core")]
	}
]