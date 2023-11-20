[h,if(argCount() == 0),CODE:{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
};{
	[h:ParentToken = arg(0)]
	[h:a5e.UnifiedAbilities = arg(1)]
}]

[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:pm.ToolProfs = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.Skills!=null && @.IsActive>0)]['Skills']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalProfs = "{}"]
[h,foreach(tool,pm.GetTools("Name","json")),CODE:{
	[h,if(json.isEmpty(pm.ToolProfs)): TempToolProfs = ""; TempToolProfs = json.path.read(pm.ToolProfs,"\$[?(@."+tool+"!=null)]['"+tool+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(json.isEmpty(TempToolProfs)): pm.FinalProfs = json.set(pm.FinalProfs,tool,0); pm.FinalProfs = json.set(pm.FinalProfs,tool,if(and(math.arrayMean(TempToolProfs)>1,or(json.length(TempToolProfs)>1,json.get(TempToolProfs,0)==2)),2,if(math.arrayMean(TempToolProfs)==0,0,1)))]
}]

[h:macro.return = pm.FinalProfs]