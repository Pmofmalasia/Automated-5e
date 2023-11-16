[h,if(argCount() == 0),CODE:{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
};{
	[h:ParentToken = arg(0)]
	[h:a5e.UnifiedAbilities = arg(1)]
}]

[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:pm.SaveProfs = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.Saves!=null && @.IsActive>0)]['Saves']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalProfs = "{}"]
[h,foreach(save,pm.GetAttributes("Name","json")),CODE:{
	[h:tempBaseSaveProf = json.get(getProperty("a5e.stat.BaseSaves"),save)]
	[h,if(json.isEmpty(pm.SaveProfs)): TempSaveProfs = ""; TempSaveProfs = json.path.read(pm.SaveProfs,"\$[?(@."+save+"!=null)]['"+save+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(tempBaseSaveProf!=0 && tempBaseSaveProf!=""): TempSaveProfs = json.append(TempSaveProfs,tempBaseSaveProf)]
	[h,if(json.isEmpty(TempSaveProfs)): pm.FinalProfs = json.set(pm.FinalProfs,save,0); pm.FinalProfs = json.set(pm.FinalProfs,save,if(and(math.arrayMean(TempSaveProfs)>1,or(json.length(TempSaveProfs)>1,json.get(TempSaveProfs,0)==2)),2,if(math.arrayMean(TempSaveProfs)==0,0,1)))]
}]

[h:macro.return = pm.FinalProfs]