[h,if(argCount() > 1): sh.Data = arg(1); sh.Data = "{}"]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:sh.Data = json.set(sh.Data,"Skill","Athletics","Type","Skill")]

[h,if(IsTooltip),CODE:{
    [h:sh.Bonus = if(json.get(sh.Data,"Bonus")=="",0,json.get(sh.Data,"Bonus"))]
    [h:pm.PassiveFunction("ShoveBonus")]

    [h:sh.Adv = if(json.get(sh.Data,"Advantage")=="",0,json.get(sh.Data,"Advantage"))]
    [h:pm.PassiveFunction("ShoveAdv")]
    
    [h:sh.Data = json.set(sh.Data,"Advantage",sh.Adv,"Bonus",sh.Bonus)]
    [h:ShoveReturnInfo = pm.a5e.FeatureCheck(currentFeatureInfo,sh.Data)]

	[h:shoveTable = json.get(ShoveReturnInfo,"Table")]
    [h:tableLinetoEdit = json.get(shoveTable,0)]
    [h:tableLinetoEdit = json.set(tableLinetoEdit,
        "Header","Shove",
        "FullContents","Athletics or Acrobatics",
        "RulesContents"," vs. "+json.get(tableLinetoEdit,"RulesContents"),
        "DisplayOrder","['Full','Rules','Roll']"
    )]
    [h:abilityTable = json.merge(abilityTable,json.set(shoveTable,0,tableLinetoEdit))]
};{
    [h,MACRO("Shove@Lib:pm.a5e.Core"): json.set(sh.Data,"ParentToken",ParentToken)]
    [h:ShoveInfo = macro.return]
    [h:effectsToMerge = json.get(ShoveInfo,"Effect")]
    [h:abilityTable = json.merge(abilityTable,json.get(ShoveInfo,"Table"))]

    [h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

    [h:pm.a5e.EffectData = macro.return]
}]