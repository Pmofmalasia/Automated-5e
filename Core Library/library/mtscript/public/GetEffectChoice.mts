[h:incompleteEffects = getLibProperty("gd.Effects","Lib:pm.a5e.Core")]
[h:em.TableLines = ""]
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
	
	[h:effectsToResolve = json.get(effect,"ToResolve")]
	[h,if(json.get(effectsToResolve,"CheckDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"CheckDC"),"ChecksMade")),"Checks",""); em.SecondPassDisplay = ""]
	[h,if(json.get(effectsToResolve,"SaveDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"SaveDC"),"SavesMade")),listAppend(em.SecondPassDisplay,"Saves"),em.SecondPassDisplay)]
	[h:em.SecondPassDisplay = pm.a5e.CreateDisplayList(em.SecondPassDisplay,"and")]
	[h,if(em.SecondPassDisplay!=""): em.SecondPassDisplay = ": "+em.SecondPassDisplay+" Made"]
	
	[h:em.EffectDisplay = parentName+" vs. "+targetName+em.SecondPassDisplay]

    [h:em.TableLines = em.TableLines + "<tr><th style = '"+FrameAccentFormat+"'>"+em.EffectDisplay+"</th><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",effect,"ResolveHow","NoMod","DisplayName",em.EffectDisplay)+")' value='Resolve Effect'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",effect,"ResolveHow","Mods","DisplayName",em.EffectDisplay)+")' value='With Modifications'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",effect,"ResolveHow","Remove","DisplayName",em.EffectDisplay)+")' value='Remove Effect'></td></tr>"]
}]

[h:macro.return = em.TableLines]