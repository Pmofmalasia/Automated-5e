[h:BaseSkillSelectionData = macro.args]
[h:BaseSkillSelectionData = pm.a5e.KeyStringsToNumbers(BaseSkillSelectionData)]

[h:tempBaseSaves = "{}"]
[h:savesList = pm.GetAttributes("Name")]
[h,foreach(tempSave,savesList),CODE:{
    [h,if(json.get(BaseSkillSelectionData,tempSave)!=0): tempBaseSaves = json.set(tempBaseSaves,tempSave,json.get(BaseSkillSelectionData,tempSave))]
}]

[h:tempBaseSkills = "{}"]
[h:skillsList = pm.GetSkills("Name")]
[h,foreach(tempSkill,skillsList),CODE:{
    [h,if(json.get(BaseSkillSelectionData,tempSkill)!=0): tempBaseSkills = json.set(tempBaseSkills,tempSkill,json.get(BaseSkillSelectionData,tempSkill))]
}]

[h,if(json.get(BaseSkillSelectionData,"NextInput")==""),CODE:{
    [h,MACRO(json.get(BaseSkillSelectionData,"NextInput")+":@Lib:pm.a5e.Core"): ""]
}]