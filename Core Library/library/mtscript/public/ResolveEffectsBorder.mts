[h,MACRO("ResolveEffects@Lib:pm.a5e.Core"): macro.args]

[h:abilityTable = json.get(macro.return,"Table")]
[h:ClassFeatureData = json.get(macro.return,"FeatureData")]
[h:effTargets = json.get(macro.return,"Targets")]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
[h:output.PC = output.PC + json.get(output.Temp,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(output.Temp,"GM")+"</div></div>"]

[h,if(json.length(effTargets)==1),CODE:{
    [h:broadcastAsToken(output.GM,"gm",",",json.get(effTargets,0))]
    [h:broadcastAsToken(output.PC,"not-gm",",",json.get(effTargets,0))]
};{
    [h:broadcastAsToken(output.GM,"gm")]
    [h:broadcastAsToken(output.PC,"not-gm")]
}]