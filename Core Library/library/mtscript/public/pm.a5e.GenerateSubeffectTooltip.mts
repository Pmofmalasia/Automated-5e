[h:SubeffectData = arg(0)]
[h:IsTooltip = 1]
[h:abilityTable = "[]"]

[h,if(json.contains(SubeffectData,"UseResource")),CODE:{
	[h:subeffect.ResourceData = pm.a5e.UseResource(json.get(SubeffectData,"UseResource"),IsTooltip)]

	[h:abilityTable = json.merge(abilityTable,json.get(subeffect.ResourceData,"Table"))]
};{}]

[h:subeffect.RangeExecution = pm.a5e.ExecuteSubeffectRange(SubeffectData,0)]
[h:subeffect.RangeData = json.get(subeffect.RangeExecution,"Data")]
[h:rangeTableLine = json.get(subeffect.RangeExecution,"Table")]
[h,if(rangeTableLine != ""): abilityTable = json.append(abilityTable,rangeTableLine)]

[h:return(0,abilityTable)]