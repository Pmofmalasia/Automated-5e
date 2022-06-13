[h:gr.Data = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]
[h:gr.Data = json.set(gr.Data,"Skill","Athletics")]

[h,if(IsTooltip),CODE:{
    [h:gr.Bonus = if(json.get(gr.Data,"Bonus")=="",0,json.get(gr.Data,"Bonus"))]
    [h:pm.PassiveFunction("GrappleBonus")]

    [h:gr.Adv = if(json.get(gr.Data,"Advantage")=="",0,json.get(gr.Data,"Advantage"))]
    [h:pm.PassiveFunction("GrappleAdv")]
    
    [h:gr.Data = json.set(gr.Data,"Advantage",gr.Adv,"Bonus",gr.Bonus)]
    [h:GrappleReturnInfo = pm.a5e.FeatureCheck(abilityInfo,gr.Data)]

	[h:abilityTable = json.get(GrappleReturnInfo,"Table")]
    [h:tableLinetoEdit = json.get(abilityTable,0)]
    [h:tableLinetoEdit = json.set(tableLinetoEdit,
        "Header","Grapple",
        "FullContents","Athletics or Acrobatics",
        "RulesContents"," vs. "+json.get(tableLinetoEdit,"RulesContents"),
        "DisplayOrder","['Full','Rules','Roll']"
    )]
    [h:macro.return = json.set("","Table",abilityTable)]
};{
    [h,MACRO("Grapple@Lib:pm.a5e.Core"): json.set(gr.Data,"ParentToken",ParentToken)]
    [h:macro.return = macro.return]
}]