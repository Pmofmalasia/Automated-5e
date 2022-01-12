[h:pm.SkillProfs = json.path.read(allAbilities,"[?(@.Skills!=null && @.IsActive>0)]['Skills']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalProfs = "{}"]
[h,foreach(skill,pm.GetSkills("json","Name")),CODE:{
	[h,if(json.isEmpty(pm.SkillProfs)): TempSkillProfs = ""; TempSkillProfs = json.path.read(pm.SkillProfs,"[?(@."+skill+"!=null)]['"+skill+"']","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,if(json.isEmpty(TempSkillProfs)): pm.FinalProfs = json.set(pm.FinalProfs,skill,0); pm.FinalProfs = json.set(pm.FinalProfs,skill,if(and(math.arrayMean(TempSkillProfs)>1,or(json.length(TempSkillProfs)>1,json.get(TempSkillProfs,0)==2)),2,if(math.arrayMean(TempSkillProfs)==0,0,1)))]
}]

[h:macro.return = pm.FinalProfs]