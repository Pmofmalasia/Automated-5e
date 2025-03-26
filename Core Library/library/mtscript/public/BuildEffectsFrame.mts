[h:EffectsFrameTargets = getLibProperty("EffectsFramePermissions","Lib:pm.a5e.Core")]
[h,switch(EffectsFrameTargets):
	default: EffectsFrameTargets = "gm"
]
[h:EffectsFrameLink = macroLinkText("OpenEffectsFrame@Lib:pm.a5e.Core","self","")]
[h:execLink(EffectsFrameLink,0,"gm")]