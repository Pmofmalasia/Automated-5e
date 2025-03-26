[h,if(argCount() == 0),CODE:{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
};{
	[h:ParentToken = arg(0)]
	[h:a5e.UnifiedAbilities = arg(1)]
}]

[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:pm.SkillProfs = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.Skills!=null && @.IsActive>0)]['Skills']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalProfs = "{}"]
[h:BaseSkills = getProperty("a5e.stat.BaseSkills")]
[h,foreach(skill,pm.GetSkills("Name","json")),CODE:{
	[h:tempBaseSkillProf = json.get(BaseSkills,skill)]
	[h,if(json.isEmpty(pm.SkillProfs)): TempSkillProfs = ""; TempSkillProfs = json.path.read(pm.SkillProfs,"\$[?(@."+skill+"!=null)]['"+skill+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(tempBaseSkillProf!=0 && tempBaseSkillProf!=""): TempSkillProfs = json.append(TempSkillProfs,tempBaseSkillProf)]
	[h,if(json.isEmpty(TempSkillProfs)): pm.FinalProfs = json.set(pm.FinalProfs,skill,0); pm.FinalProfs = json.set(pm.FinalProfs,skill,if(and(math.arrayMean(TempSkillProfs)>1,or(json.length(TempSkillProfs)>1,json.get(TempSkillProfs,0)==2)),2,if(math.arrayMean(TempSkillProfs)==0,0,1)))]
}]

[h:return(0,pm.FinalProfs)]