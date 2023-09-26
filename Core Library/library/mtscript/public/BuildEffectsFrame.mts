[h:pm.TooltipBorder(json.set("",
    "Class","zzWeaponAttack",
    "Name","Effect Management",
    "DisplayName","Effect Management"
))]
[h:effectsTableCellFormat = "<td style='text-align:center; padding-left:4px'>"]

[h:incompleteEffects = data.getData("addon:","pm.a5e.core","gd.Effects")]
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
		[h:EffectDisplayInfo = pm.a5e.GenerateEffectDisplay(effect)]
		[h:EffectParentTokenName = json.get(EffectDisplayInfo,"ParentTokenName")]
		[h:EffectTargetList = json.get(EffectDisplayInfo,"TargetList")]
		[h:EffectStatusDisplay = json.get(EffectDisplayInfo,"StatusDisplay")]
		[h:EffectDisplayName = json.get(EffectDisplayInfo,"EffectDisplay")]

		[h:thisEffectID = json.get(effect,"ID")]
		[h:BaseResolutionInfo = json.set("","Effect",thisEffectID,"DisplayName",EffectDisplayName)]
		[h:em.TableLines = em.TableLines + "<tr>"+effectsTableCellFormat+EffectParentTokenName+"</td>"+effectsTableCellFormat+EffectTargetList+"</td>"+effectsTableCellFormat+EffectStatusDisplay+"</td></th><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set(BaseResolutionInfo,"ResolveHow","NoMod")+")' value='Resolve'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set(BaseResolutionInfo,"ResolveHow","Mods")+")' value='+ Modify'></td><td style='padding-left:4px'><input type='button' onclick='doEffect("+json.set(BaseResolutionInfo,"ResolveHow","Remove")+")' value='Remove'></td></tr>"]
	}]
}]

[h:EffectsFrameTargets = getLibProperty("EffectsFramePermissions","Lib:pm.a5e.Core")]
[h,switch(EffectsFrameTargets):
	default: EffectsFrameTargets = "gm"
]
[h:EffectsFrameLink = macroLinkText("OpenEffectsFrame@Lib:pm.a5e.Core","self",base64.encode(em.TableLines))]
[h:execLink(EffectsFrameLink,0,"gm")]