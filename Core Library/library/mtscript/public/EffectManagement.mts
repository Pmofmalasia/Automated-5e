[h:incompleteEffects = getLibProperty("gd.Effects","Lib:pm.a5e.Core")]
[h:em.Options = ""]
[h,foreach(effect,incompleteEffects),CODE:{
	[h:targetList = json.get(effect,"Targets")]
	[h:targetName = ""]
	[h,switch(json.length(targetList)):
		case 1: targetName = getName(json.get(targetList,0));
		case 2: targetName = getName(json.get(targetList,0))+" and "+getName(json.get(targetList,1));
		case 3: targetName = getName(json.get(targetList,0))+", "+getName(json.get(targetList,1))+", and "+getName(json.get(targetList,2));
		default: targetName = "Multiple Targets"
	]
	
	[h,if(json.get(effect,"ParentToken")==""):
		parentName = "World";
		parentName = getName(json.get(effect,"ParentToken"))
	]
	
	[h:em.Options = json.append(em.Options,parentName+" vs. "+targetName)]
}]

[h:abort(input(
	" junkVar | ------------------------------ All Incomplete Effects ------------------------------ | | LABEL | SPAN=TRUE ",
	" resolveAllTest | No,Yes,No - Clear all effects | Resolve all effects at once? | RADIO ",
	if(em.Options==""," junkVar | ---------------------------- There are no active effects! ---------------------------- |  | LABEL | SPAN=TRUE "," em.Choice | "+em.Options+" | Choose an effect to resolve | LIST | DELIMITER=JSON "),
	" resolveHow | No Modifications, With Modifications, Remove Effect | How do you want to resolve this effect? | LIST "
))]

[h,switch(resolveAllTest),CODE:
	case 0:{
		[h,switch(resolveHow),CODE:
			case 0:{
				[h,MACRO("Resolve Effects@Lib:pm.a5e.Core"): json.get(incompleteEffects,em.Choice)]
				[h:setLibProperty("gd.Effects",json.remove(incompleteEffects,em.Choice),"Lib:pm.a5e.Core")]
			};
			case 1:{
				[h:broadcast("This feature does not exist yet!")]
			};
			case 2:{
				[h:setLibProperty("gd.Effects",json.remove(incompleteEffects,em.Choice),"Lib:pm.a5e.Core")]
				[h:broadcast("Effect "+json.get(em.Options,em.Choice)+" removed.","gm")]
			}
		]
	};
	case 1:{
		[h,foreach(effect,incompleteEffects),CODE:{
			[h,MACRO("Resolve Effects@Lib:pm.a5e.Core"): effect]
			[h:setLibProperty("gd.Effects",json.path.delete(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[?(@.ID=="+json.get(effect,"ID")+")]"),"Lib:pm.a5e.Core")]
		}]
	};
	case 2:{
		[h:setLibProperty("gd.Effects","[]","Lib:pm.a5e.Core")]
	}
]