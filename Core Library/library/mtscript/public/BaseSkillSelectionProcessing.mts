[h:BaseSkillSelectionData = macro.args]
[h:BaseSkillSelectionData = pm.a5e.KeyStringsToNumbers(BaseSkillSelectionData)]
[h:ParentToken = json.get(BaseSkillSelectionData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:tempBaseSaves = "{}"]
[h:savesList = pm.GetAttributes("Name","json")]
[h,foreach(tempSave,savesList),CODE:{
    [h,if(json.get(BaseSkillSelectionData,"SaveProf"+tempSave)!=0): tempBaseSaves = json.set(tempBaseSaves,tempSave,json.get(BaseSkillSelectionData,"SaveProf"+tempSave))]
}]

[h:tempBaseSkills = "{}"]
[h:skillsList = pm.GetSkills("Name","json")]
[h,foreach(tempSkill,skillsList),CODE:{
    [h,if(json.get(BaseSkillSelectionData,"SkillProf"+tempSkill)!=0): tempBaseSkills = json.set(tempBaseSkills,tempSkill,json.get(BaseSkillSelectionData,"SkillProf"+tempSkill))]
}]

[h:setProperty("a5e.stat.BaseSaves",tempBaseSaves)]
[h:setProperty("a5e.stat.BaseSkills",tempBaseSkills)]
[h:closeDialog("Skill Selection")]

[h,if(json.get(BaseSkillSelectionData,"NextInput")!=""),CODE:{
    [h:NextInputData = base64.decode(json.get(BaseSkillSelectionData,"NextInputData"))]
    [h,MACRO(json.get(BaseSkillSelectionData,"NextInput")+":@Lib:pm.a5e.Core"): NextInputData]
}]