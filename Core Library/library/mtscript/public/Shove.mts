[h:sh.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(sh.Data,"ParentToken")]
[h:baseEffectData = json.get(sh.Data,"BaseEffect")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Shove"]
[h:tempEffectData = "[]"]

[h:sh.Bonus = if(json.get(sh.Data,"Bonus")=="",0,json.get(sh.Data,"Bonus"))]
[h:pm.PassiveFunction("ShoveBonus")]

[h:sh.Adv = if(json.get(sh.Data,"Advantage")=="",0,json.get(sh.Data,"Advantage"))]
[h:sh.Dis = if(json.get(sh.Data,"Disadvantage")=="",0,json.get(sh.Data,"Disadvantage"))]
[h:pm.PassiveFunction("ShoveAdv")]

[h:sh.thisEffect = baseEffectData]
[h:"<!-- Pick Target -->"]
[h:sh.TargetingData = json.set("",
	"ParentToken",ParentToken,
	"Number",1,
	"Origin",ParentToken,
	"Range",json.set("","Value",5,"Units","Feet")
)]

[h:sh.TargetingFilters = json.set("",
	"Allegiance",json.set("","NotSelf",1),
	"SizeMax",1
)]

[h:sh.TargetOptions = pm.a5e.TargetCreatureFiltering(sh.TargetingData,sh.TargetingFilters)]
[h:sh.Target = pm.a5e.TargetCreatureTargeting(json.set("",
	"ValidTargets",json.get(sh.TargetOptions,"ValidTargets"),
	"TargetNumber",1,
	"ParentToken",ParentToken,
	"Origin",ParentToken
))]
[h:sh.Target = json.get(sh.Target,0)]
[h:sh.thisEffect = json.set(sh.thisEffect,"Targets",sh.Target)]

[h:abort(input(
	" sh.Choice | Push,Prone | Push or Knock Prone | RADIO "
))]

[h,switch(sh.Choice),CODE:
	case 0:{
		[h:sh.Movement = json.set("",
			"Value",5,
			"Unit","feet",
			"Direction","Away",
			"Type","Physical"
		)]
		[h:sh.thisEffect = json.set(sh.thisEffect,"Movement",sh.Movement)]
	};
	case 1:{
		[h:sh.Condition = json.append("",pm.a5e.GetSpecificCondition("Prone","Condition"))]
		[h:sh.EndInfo = "{}"]
		[h:sh.thisEffect = json.set(sh.thisEffect,
			"ConditionInfo",json.set("",
				"Conditions",sh.Condition,
				"EndInfo",sh.EndInfo)
		)]
	}
]

[h:"<!-- Make contested check to set DC of check for target -->"]
[h:sh.CheckData = json.set(sh.Data,
    "Skill","Athletics",
    "Type","Skill",
    "Advantage",sh.Adv,
    "Disadvantage",sh.Dis,
    "Bonus",sh.Bonus
)]
[h,macro("Check@Lib:pm.a5e.Core"): sh.CheckData]
[h:sh.CheckReturnData = macro.return]

[h:grappleTable = json.get(macro.return,"Table")]
[h:sh.ContestedCheckData = json.set("",
    "DC",json.set(sh.CheckReturnData,"Contested",1),
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

[h:sh.thisEffect = json.set(sh.thisEffect,"CheckDC",sh.ContestedCheckData)]

[h:tempEffectData = json.append(tempEffectData,sh.thisEffect)]

[h:pm.PassiveFunction("AfterShove")]

[h:macro.return = json.set("","Table",grappleTable,"Effect",tempEffectData)]