[h:gr.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(gr.Data,"ParentToken")]
[h:baseEffectData = json.get(gr.Data,"BaseEffect")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Grapple"]
[h:tempEffectData = "[]"]

[h:gr.Bonus = if(json.get(gr.Data,"Bonus")=="",0,json.get(gr.Data,"Bonus"))]
[h:pm.PassiveFunction("GrappleBonus")]

[h:gr.Adv = if(json.get(gr.Data,"Advantage")=="",0,json.get(gr.Data,"Advantage"))]
[h:gr.Dis = if(json.get(gr.Data,"Disadvantage")=="",0,json.get(gr.Data,"Disadvantage"))]
[h:pm.PassiveFunction("GrappleAdv")]

[h:gr.thisEffect = baseEffectData]
[h:"<!-- Pick Target -->"]
[h:gr.TargetingData = json.set("",
	"ParentToken",ParentToken,
	"Number",1,
	"Allegiance",json.set("","NotSelf",1),
	"Origin",ParentToken,
	"Range",json.set("","Value",5,"Units","Feet")
)]

[h:gr.TargetingFilters = json.set("",
	"SizeMax",pm.a5e.GetSizeChange(getSize(ParentToken),1)
)]

[h:gr.TargetOptions = pm.a5e.TargetCreatureFiltering(gr.TargetingData,gr.TargetingFilters)]
[h:gr.Target = pm.a5e.TargetCreatureTargeting(json.get(gr.TargetOptions,"ValidTargets"),1)]

[h:gr.thisEffect = json.set(gr.thisEffect,"Targets",gr.Target)]

[h:"<!-- TODO: Needs EndInfo: 
	- Ends when letting go with that hand/equipping something (equipment rework)
	- Ends with successful contested check by target (needs support for ending conditions with check/save)
	- Ends if targets are moved out of range of the grapple (needs movement support in general)
-->"]
[h:gr.Condition = json.append("",pm.a5e.GetSpecificCondition("Grappled","Condition"))]
[h:gr.EndInfo = "{}"]
[h:gr.thisEffect = json.set(gr.thisEffect,
    "ConditionInfo",json.set("",
        "Conditions",gr.Condition,
        "EndInfo",gr.EndInfo
    )
)]

[h:"<!-- Make contested check to set DC of check for target -->"]
[h:gr.CheckData = json.set(gr.Data,
    "Skill","Athletics",
    "Type","Skill",
    "Advantage",gr.Adv,
    "Disadvantage",gr.Dis,
    "Bonus",gr.Bonus
)]
[h,macro("Check@Lib:pm.a5e.Core"): gr.CheckData]
[h:gr.CheckReturnData = macro.return]

[h:grappleTable = json.get(macro.return,"Table")]
[h:gr.ContestedCheckData = json.set("",
    "DC",json.set(gr.CheckReturnData,"Contested",1),
    "CheckType",json.append("",
        json.set("",
            "Skill","Athletics",
            "Type","Skill",
            "Advantage",0,
            "Disadvantage",0,
            "Bonus",0),
        json.set("",
            "Skill","Acrobatics",
            "Type","Skill",
            "Advantage",0,
            "Disadvantage",0,
            "Bonus",0)
        ),
    "ConditionsResisted",json.set("","Inclusive","All")
)]

[h:gr.thisEffect = json.set(gr.thisEffect,"CheckDC",gr.ContestedCheckData)]

[h:tempEffectData = json.append(tempEffectData,gr.thisEffect)]

[h:pm.PassiveFunction("AfterGrapple")]

[h:macro.return = json.set("","Table",grappleTable,"Effect",tempEffectData)]