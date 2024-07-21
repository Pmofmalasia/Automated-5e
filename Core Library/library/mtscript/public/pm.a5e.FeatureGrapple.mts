[h:gr.Data = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:gr.Data = json.set(gr.Data,"Skill","Athletics","Type","Skill")]

[h,if(IsTooltip),CODE:{
    [h:gr.Bonus = if(json.get(gr.Data,"Bonus")=="",0,json.get(gr.Data,"Bonus"))]
    [h:pm.PassiveFunction("GrappleBonus")]

    [h:gr.Adv = if(json.get(gr.Data,"Advantage")=="",0,json.get(gr.Data,"Advantage"))]
    [h:pm.PassiveFunction("GrappleAdv")]
    
    [h:gr.Data = json.set(gr.Data,"Advantage",gr.Adv,"Bonus",gr.Bonus)]
    [h:GrappleReturnInfo = pm.a5e.FeatureCheck(currentFeatureInfo,gr.Data)]

	[h:tableLength = json.length(abilityTable)]
    [h:tableLinetoEdit = json.get(abilityTable,json.length(abilityTable) - 1)]
    [h:tableLinetoEdit = json.set(tableLinetoEdit,
        "Header","Grapple",
        "FullContents","Athletics or Acrobatics",
        "RulesContents"," vs. "+json.get(tableLinetoEdit,"RulesContents"),
        "DisplayOrder","['Full','Rules','Roll']"
    )]
    [h:abilityTable = json.set(abilityTable,tableLength-1,tableLinetoEdit)]
};{
    [h,MACRO("Grapple@Lib:pm.a5e.Core"): json.set(gr.Data,"ParentToken",ParentToken)]
    [h:GrappleInfo = macro.return]
    [h:effectsToMerge = json.get(GrappleInfo,"Effect")]
    [h:abilityTable = json.merge(abilityTable,json.get(GrappleInfo,"Table"))]

    [h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

    [h:pm.a5e.EffectData = macro.return]
}]