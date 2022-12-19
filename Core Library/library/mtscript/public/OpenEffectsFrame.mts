[h:"<!-- TODO: Needs adaptive window theming when getInfo(Theme) is more set in stone -->"]
[h:pm.TooltipBorder(json.set("",
    "Class","zzWeaponAttack",
    "Name","Effect Management",
    "DisplayName","Effect Management"
))]

[h:incompleteEffects = getLibProperty("gd.Effects","Lib:pm.a5e.Core")]
[h:em.TableLines = ""]
[h:secureCounter = 0]
[h,foreach(effect,incompleteEffects),CODE:{
	[h,if(json.get(effect,"ToResolve")==""),CODE:{};{
		[h:tempTargetList = json.get(effect,"Targets")]
		[h:targetList = json.path.delete(tempTargetList,"[?(@=='')]")]
		[h:UnlistedTargetTest = json.length(tempTargetList) != json.length(targetList)]
		[h:targetName = ""]

		[h:TargetNameArray = "[]"]
		[h,foreach(tempTarget,targetList): TargetNameArray = json.append(TargetNameArray,if(json.get(effect,"ParentToken") == tempTarget,"Self",getName(tempTarget)))]

		[h,if(UnlistedTargetTest): TargetNameArray = json.append(TargetNameArray,"Unspecified Target")]

		[h:targetName = pm.a5e.CreateDisplayList(TargetNameArray,"and")]
		[h,if(length(targetName) > 40): targetName = "Multiple Targets"]
		
		[h,if(json.get(effect,"ParentToken")==""):
			parentName = "World";
			parentName = getName(json.get(effect,"ParentToken"))
		]
		
		[h:effectsToResolve = json.get(effect,"ToResolve")]
		[h,if(json.get(effectsToResolve,"CheckDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"CheckDC"),"ChecksMade")),"Checks",""); em.SecondPassDisplay = ""]
		[h,if(json.get(effectsToResolve,"SaveDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"SaveDC"),"SavesMade")),listAppend(em.SecondPassDisplay,"Saves"),em.SecondPassDisplay)]
		[h:em.SecondPassDisplay = pm.a5e.CreateDisplayList(em.SecondPassDisplay,"and")]
		[h,if(em.SecondPassDisplay!=""): em.SecondPassDisplay = ": "+em.SecondPassDisplay+" Made"]

		[h:InvolvedTokensDisplay = if(targetName=="Self",parentName+" (self)",parentName+" vs. "+targetName)]
		[h:em.EffectDisplay = InvolvedTokensDisplay+em.SecondPassDisplay]

		[h:em.TableLines = em.TableLines + "<tr><th style = '"+FrameAccentFormat+"'>"+em.EffectDisplay+"</th><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",secureCounter,"ResolveHow","NoMod","DisplayName",em.EffectDisplay)+")' value='Resolve Effect'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",secureCounter,"ResolveHow","Mods","DisplayName",em.EffectDisplay)+")' value='With Modifications'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",secureCounter,"ResolveHow","Remove","DisplayName",em.EffectDisplay)+")' value='Remove Effect'></td></tr>"]
	}]
	[h:secureCounter = secureCounter + 1]
}]

[h:html.frame5("Effect Management", "lib://pm.a5e.core/ManageEffectsFrame.html", "value="+base64.encode(em.TableLines))]