[h:pm.SaveProfs = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Saves!=null && @.IsActive>0)]['Saves']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalProfs = "{}"]
[h,foreach(save,pm.GetAttributes("Name","json")),CODE:{
	[h:tempBaseSaveProf = json.get(getProperty("a5e.stat.BaseSaves"),save)]
	[h,if(json.isEmpty(pm.SaveProfs)): TempSaveProfs = ""; TempSaveProfs = json.path.read(pm.SaveProfs,"[?(@."+save+"!=null)]['"+save+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(tempBaseSaveProf!=0 && tempBaseSaveProf!=""): TempSaveProfs = json.append(TempSaveProfs,tempBaseSaveProf)]
	[h,if(json.isEmpty(TempSaveProfs)): pm.FinalProfs = json.set(pm.FinalProfs,save,0); pm.FinalProfs = json.set(pm.FinalProfs,save,if(and(math.arrayMean(TempSaveProfs)>1,or(json.length(TempSaveProfs)>1,json.get(TempSaveProfs,0)==2)),2,if(math.arrayMean(TempSaveProfs)==0,0,1)))]
}]

[h:macro.return = pm.FinalProfs]