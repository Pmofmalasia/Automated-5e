[h:gr.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(gr.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Grapple"]
[h:pm.a5e.EffectData = "[]"]

[h:gr.thisEffect = json.set("","Class","zzChecksAndSaves")]
[h:"<!-- Pick Target -->"]
[h:gr.TargetingData = json.set("",
	"ParentToken",ParentToken,
	"Number",1,
	"AllyFoe","Any",
	"Self",0,
	"Origin",ParentToken,
	"Range",json.set("","Value",5,"Units","Feet")
)]

[h:gr.TargetingFilters = json.set("",
	"MaxSize",pm.a5e.GetSizeChange(getSize(ParentToken),1,1)
)]

[h:gr.Target = pm.a5e.TargetCreatureProcessing(gr.TargetingData,gr.TargetingFilters)]
[h:gr.thisEffect = json.set(gr.thisEffect,"Target",gr.Target)]

[h:"<!-- Needs EndInfo: 
	- Ends when letting go with that hand/equipping something (equipment rework)
	- Ends with successful contested check by target (needs support for ending conditions with check/save)
	- Ends if targets are moved out of range of the grapple (needs movement support in general)
-->"]
[h:gr.Condition = pm.a5e.GetSpecificCondition("Grappled","Condition")]
[h:gr.EndInfo = "{}"]

[h:"<!-- Make contested check to set DC of check for target -->"]