[h:ChangeHPData = macro.args]
[h:ChangeHPData = pm.a5e.KeyStringsToNumbers(ChangeHPData)]
[h:TargetTokens = base64.decode(json.get(ChangeHPData,"TargetTokens"))]
[h:closeDialog("ChangeHPInput")]

[h:SingleInstanceData = "[]"]
[h,count(json.get(ChangeHPData,"DamageTypeNumber")+1),CODE:{
    [h:tempTotal = json.get(ChangeHPData,"DamageValue"+roll.count)]
    [h:thisDamageSet = json.set("",
        "Array","[]",
        "Total",tempTotal,
        "String",tempTotal,
        "MaxTotal",tempTotal,
        "Dice","[]",
        "Bonus",tempTotal,
        "Formula",tempTotal,
        "CritFormula",tempTotal,
        "CritDice","[]",
        "CritArray","[]",
        "CritString",tempTotal,
        "CritTotal",tempTotal,
        "CritMaxTotal",tempTotal,
        "DamageType",json.get(ChangeHPData,"DamageType"+roll.count),
        "Modifier",1,
        "ScalingBase",0,
        "NoModification",0
    )]

    [h:SingleInstanceData = json.append(SingleInstanceData,thisDamageSet)]
}]

[h:IsDamage = !json.isEmpty(json.path.read(SingleInstanceData,"\$[*][?(@.DamageType in "+json.append(pm.GetDamageTypes("Name"),"None")+")]"))]

[h,switch(json.get(ChangeHPData,"OutputTargets")),CODE:
	case "Everyone":{[h:outputTargets = "not-gm"][h:linkPermissions = "gm-self"]};
	case "YouAndDM":{[h:outputTargets = "self"][h:linkPermissions = "gm-self"]};
	case "needsSplitGMOutput":{[h:outputTargets = "none"][h:linkPermissions = "gm"]}
]

[h:FinalHPData = json.set("",
    "DamageDealt",SingleInstanceData,
    "Flavor","",
    "BypassConc",json.contains(ChangeHPData,"BypassConc"),
    "ConcSaveBonus",json.get(ChangeHPData,"ConcSaveBonus"),
    "ConcSaveAdvantage",or(json.get(ChangeHPData,"ConcSaveAdvantage")==3,json.get(ChangeHPData,"ConcSaveAdvantage")==4),
    "ConcSaveDisadvantage",or(json.get(ChangeHPData,"ConcSaveAdvantage")==0,json.get(ChangeHPData,"ConcSaveAdvantage")==1),
    "ConcForcedAdvantage",or(json.get(ChangeHPData,"ConcSaveAdvantage")==0,json.get(ChangeHPData,"ConcSaveAdvantage")==4),
    "OutputTargets",outputTargets
)]

[h:abilityTable = "[]"]
[h,foreach(target,TargetTokens),CODE:{
	[h,if(json.length(TargetTokens)>1): 
		abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",getName(target),
		"FalseHeader","",
		"FullContents","",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
		))
	]
	[h:FinalHPData = json.set(FinalHPData,"ParentToken",target)]
	[h,MACRO("ChangeHP@Lib:pm.a5e.Core"): FinalHPData]
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
}]

[h:ParentToken = if(json.length(TargetTokens)==1,json.get(TargetTokens,0),"")]
[h:BorderData = json.set("",
	"Flavor","",
	"Name","ChangeHP",
	"DisplayName","Change HP",
	"FalseName","",
	"DisplayClass","zzChangeHP",
	"ColorSubtype",if(IsDamage,"Damage","Healing")
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance",ParentToken) == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","ChangeHP"),
	"Description","",
	"AbridgedDescription",""
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]