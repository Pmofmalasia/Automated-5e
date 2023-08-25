[h:incompleteEffects = json.path.read(getLibProperty("gd.Effects","Lib:pm.a5e.Core"),"[*][?(@.ToResolve != '' && @.ToResolve != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:em.Options = ""]
[h,foreach(effect,incompleteEffects),CODE:{
	[h:targetList = json.get(effect,"Targets")]
	[h:targetName = ""]
	[h,switch(json.length(targetList)+"REMOVELATER"):
		case 1: targetName = getName(json.get(targetList,0));
		case 2: targetName = getName(json.get(targetList,0))+" and "+getName(json.get(targetList,1));
		case 3: targetName = getName(json.get(targetList,0))+", "+getName(json.get(targetList,1))+", and "+getName(json.get(targetList,2));
		default: targetName = "Multiple Targets (Forced here, come fix this)"
	]
	
	[h,if(json.get(effect,"ParentToken")==""):
		parentName = "World";
		parentName = getName(json.get(effect,"ParentToken"))
	]
	
	[h:effectsToResolve = json.get(effect,"ToResolve")]
	[h,if(json.get(effectsToResolve,"CheckDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"CheckDC"),"ChecksMade")),"Checks",""); em.SecondPassDisplay = ""]
	[h,if(json.get(effectsToResolve,"SaveDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"SaveDC"),"SavesMade")),listAppend(em.SecondPassDisplay,"Saves"),em.SecondPassDisplay)]
	[h:em.SecondPassDisplay = pm.a5e.CreateDisplayList(em.SecondPassDisplay,"and")]
	[h,if(em.SecondPassDisplay!=""): em.SecondPassDisplay = ": "+em.SecondPassDisplay+" Made"]
	
	[h:em.Options = json.append(em.Options,parentName+" vs. "+targetName+em.SecondPassDisplay)]
}]

[h:em.Choice = -1]
[h:abort(input(
	" junkVar | ------------------------------ All Incomplete Effects ------------------------------ | | LABEL | SPAN=TRUE ",
	" resolveAllTest | No,Yes,No - Clear all effects | Resolve all effects at once? | RADIO ",
	if(em.Options==""," junkVar | ---------------------------- There are no active effects! ---------------------------- |  | LABEL | SPAN=TRUE ",
	" em.Choice | "+em.Options+" | Choose an effect to resolve | LIST | DELIMITER=JSON "),
	" resolveHow | No Modifications, With Modifications, Remove Effect | How do you want to resolve this effect? | LIST "
))]
[h:abort(em.Choice!=-1)]

[h,switch(resolveAllTest),CODE:
	case 0:{
		[h,switch(resolveHow),CODE:
			case 0:{
				[h,MACRO("ResolveEffectsBorder@Lib:pm.a5e.Core"): json.get(incompleteEffects,em.Choice)]
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
			[h,MACRO("ResolveEffectsBorder@Lib:pm.a5e.Core"): effect]
		}]
	};
	case 2:{
		[h:setLibProperty("gd.Effects","[]","Lib:pm.a5e.Core")]
	}
]