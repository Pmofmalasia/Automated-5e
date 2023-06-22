[h:pm.TooltipBorder(json.set("",
    "Class","zzWeaponAttack",
    "Name","Effect Management",
    "DisplayName","Effect Management"
))]
[h:effectsTableCellFormat = "<td style='text-align:center; padding-left:4px'>"]

[h:incompleteEffects = getLibProperty("gd.Effects","Lib:pm.a5e.Core")]
[h:em.TableLines = "<tr><th style = '"+FrameAccentFormat+"'>Origin</th><th style = '"+FrameAccentFormat+"'>Target(s)</th><th style = '"+FrameAccentFormat+"'>Status</th><th style = '"+FrameAccentFormat+"' colspan=3>How to Resolve</th></tr>"]
[h:"<!-- TODO: Change removal of blank string so that targets can be selected by the DM on resolution. Blank string occurs when 'Target Not Displayed' is selected during targeting. -->"]

[h,foreach(effect,incompleteEffects),CODE:{
	[h:NoEffectTest = json.get(effect,"ToResolve") == ""]
	[h,if(json.get(effect,"ParentSubeffect") != ""):
		CurrentParentSubeffectTest = !json.isEmpty(json.path.read(incompleteEffects,"[*][?(@.ID == "+json.get(effect,"ParentSubeffect")+")]"));
		CurrentParentSubeffectTest = 0
	]

	[h:NotDisplayedTest = or(NoEffectTest,CurrentParentSubeffectTest)]

	[h,if(NotDisplayedTest),CODE:{};{
		[h:tempTargetList = json.get(effect,"Targets")]
		[h,if(json.type(tempTargetList)=="ARRAY"):
			targetList = json.path.delete(tempTargetList,"[?(@=='')]");
			targetList = tempTargetList
		]
		[h:UnlistedTargetTest = json.length(tempTargetList) != json.length(targetList)]
		[h:targetName = ""]

		[h:TargetNameArray = "[]"]
		[h,foreach(tempTarget,targetList),if(json.type(tempTarget)!="OBJECT"): TargetNameArray = json.append(TargetNameArray,if(json.get(effect,"ParentToken") == tempTarget,"Self",getName(tempTarget)))]
		[h:PriorTargetTest = json.length(TargetNameArray) != json.length(targetList)]

		[h,if(UnlistedTargetTest): TargetNameArray = json.append(TargetNameArray,"Unspecified Target")]
		[h,if(PriorTargetTest): TargetNameArray = json.append(TargetNameArray,"Prior Target")]

		[h:targetName = pm.a5e.CreateDisplayList(TargetNameArray,"and")]
		[h,if(length(targetName) > 50): targetName = "Multiple Targets"]
		
		[h,if(json.get(effect,"ParentToken")==""):
			parentName = "World";
			parentName = getName(json.get(effect,"ParentToken"))
		]
		
		[h:effectsToResolve = json.get(effect,"ToResolve")]
		[h,if(json.get(effectsToResolve,"CheckDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"CheckDC"),"ChecksMade")),"Checks",""); em.SecondPassDisplay = ""]
		[h,if(json.get(effectsToResolve,"SaveDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"SaveDC"),"SavesMade")),listAppend(em.SecondPassDisplay,"Saves"),em.SecondPassDisplay)]
		[h:em.SecondPassDisplay = pm.a5e.CreateDisplayList(em.SecondPassDisplay,"and")]
		[h,if(em.SecondPassDisplay!=""):
			em.SecondPassDisplay = em.SecondPassDisplay+" Made";
			em.SecondPassDisplay = "Unresolved"
		]

		[h:LinkedEffectNumber = json.length(json.path.read(incompleteEffects,"[*][?(@.ParentSubeffect == "+json.get(effect,"ID")+")]"))]
		[h,if(LinkedEffectNumber > 0): em.SecondPassDisplay = em.SecondPassDisplay+ "<br>" + LinkedEffectNumber + " Linked Effect"+if(LinkedEffectNumber==1,"","s")]

		[h:InvolvedTokensDisplay = if(targetName=="Self",parentName+" (self)",parentName+" vs. "+targetName)]
		[h:em.EffectDisplay = InvolvedTokensDisplay]

		[h:thisEffectID = json.get(effect,"ID")]
		[h:em.TableLines = em.TableLines + "<tr>"+effectsTableCellFormat+parentName+"</td>"+effectsTableCellFormat+targetName+"</td>"+effectsTableCellFormat+em.SecondPassDisplay+"</td></th><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",thisEffectID,"ResolveHow","NoMod","DisplayName",em.EffectDisplay)+")' value='Resolve'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",thisEffectID,"ResolveHow","Mods","DisplayName",em.EffectDisplay)+")' value='+ Modify'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set("","Effect",thisEffectID,"ResolveHow","Remove","DisplayName",em.EffectDisplay)+")' value='Remove'></td></tr>"]
	}]
}]

[h:EffectsFrameTargets = getLibProperty("EffectsFramePermissions","Lib:pm.a5e.Core")]
[h,switch(EffectsFrameTargets):
	default: EffectsFrameTargets = "gm"
]
[h:EffectsFrameLink = macroLinkText("OpenEffectsFrame@Lib:pm.a5e.Core","self",base64.encode(em.TableLines))]
[h:execLink(EffectsFrameLink,0,"gm")]