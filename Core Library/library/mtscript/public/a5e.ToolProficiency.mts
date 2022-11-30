[h:pm.ToolProfs = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Tools!=null && @.IsActive>0)]['Tools']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalProfs = "{}"]
[h,foreach(tool,pm.GetTools("Name")),CODE:{
	[h,if(json.isEmpty(pm.ToolProfs)): TempToolProfs = ""; TempToolProfs = json.path.read(pm.ToolProfs,"[?(@."+tool+"!=null)]['"+tool+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(json.isEmpty(TempToolProfs)): pm.FinalProfs = json.set(pm.FinalProfs,tool,0); pm.FinalProfs = json.set(pm.FinalProfs,tool,if(and(math.arrayMean(TempToolProfs)>1,or(json.length(TempToolProfs)>1,json.get(TempToolProfs,0)==2)),2,if(math.arrayMean(TempToolProfs)==0,0,1)))]
}]

[h:macro.return = pm.FinalProfs]