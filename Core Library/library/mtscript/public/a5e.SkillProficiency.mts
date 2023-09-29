[h:ParentToken = currentToken()]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]

[h:pm.SkillProfs = json.path.read(a5e.UnifiedAbilities,"\$[?(@.Skills!=null && @.IsActive>0)]['Skills']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalProfs = "{}"]
[h,foreach(skill,pm.GetSkills("Name","json")),CODE:{
	[h:tempBaseSkillProf = json.get(getProperty("a5e.stat.BaseSkills"),skill)]
	[h,if(json.isEmpty(pm.SkillProfs)): TempSkillProfs = ""; TempSkillProfs = json.path.read(pm.SkillProfs,"\$[?(@."+skill+"!=null)]['"+skill+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(tempBaseSkillProf!=0 && tempBaseSkillProf!=""): TempSkillProfs = json.append(TempSkillProfs,tempBaseSkillProf)]
	[h,if(json.isEmpty(TempSkillProfs)): pm.FinalProfs = json.set(pm.FinalProfs,skill,0); pm.FinalProfs = json.set(pm.FinalProfs,skill,if(and(math.arrayMean(TempSkillProfs)>1,or(json.length(TempSkillProfs)>1,json.get(TempSkillProfs,0)==2)),2,if(math.arrayMean(TempSkillProfs)==0,0,1)))]
}]

[h:macro.return = pm.FinalProfs]