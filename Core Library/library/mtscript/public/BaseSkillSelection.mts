[h:priorData = macro.args]
[h,if(priorData==""),CODE:{
    [h:nextInput = ""]
    [h:nextInputData = ""]
    [h:ParentToken = currentToken()]
    [h:skillSelectionHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'>"]
};{
    [h:nextInput = json.get(priorData,"NextInput")]
    [h:nextInputData = json.get(priorData,"NextInputData")]
    [h:ParentToken = json.get(priorData,"ParentToken")]
    [h:skillSelectionHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'>"]
    [h:switchToken(ParentToken)]
}]

[h,if(nextInput!=""),CODE:{
    [h:skillSelectionHTML = skillSelectionHTML + "<input type='hidden' id='NextInput' name='NextInput' value='"+nextInput+"'><input type='hidden' id='NextInputData' name='NextInputData' value='"+nextInputData+"'>"]
};{}]
[h,if(currentToken()==""): currentSaves = "{}"; currentSaves = getProperty("a5e.stat.BaseSaves")]
[h,if(currentToken()==""): currentSkills = "{}"; currentSkills = getProperty("a5e.stat.BaseSkills")]

[h:skillSelectionHTML = skillSelectionHTML + "</tr><tr><th text-align='center' colspan='2'>Saving Throw Proficiencies</th></tr>"]
[h:savesList = pm.GetAttributes()]
[h,foreach(tempSave,savesList): skillSelectionHTML = skillSelectionHTML + "<tr id='rowSaveProf"+json.get(tempSave,"Name")+"'><th><label for='SaveProf"+json.get(tempSave,"Name")+"'>"+json.get(tempSave,"DisplayName")+" Saves:</label></th><td><select id='SaveProf"+json.get(tempSave,"Name")+"' name='SaveProf"+json.get(tempSave,"Name")+"'><option value='0'>Not Proficient</option><option value='1'"+if(json.get(currentSaves,json.get(tempSave,"Name"))==1," selected","")+">Proficiency</option><option value='2'"+if(json.get(currentSaves,json.get(tempSave,"Name"))==2," selected","")+">Expertise</option></select></td></tr>"]

[h:skillSelectionHTML = skillSelectionHTML + "</tr><tr><th text-align='center' colspan='2'>Skill Proficiencies</th></tr>"]
[h:skillsList = pm.GetSkills()]
[h,foreach(tempSkill,skillsList): skillSelectionHTML = skillSelectionHTML + "<tr id='rowSkillProf"+json.get(tempSkill,"Name")+"'><th><label for='SkillProf"+json.get(tempSkill,"Name")+"'>"+json.get(tempSkill,"DisplayName")+":</label></th><td><select id='SkillProf"+json.get(tempSkill,"Name")+"' name='SkillProf"+json.get(tempSkill,"Name")+"'><option value='0'>Not Proficient</option><option value='1'"+if(json.get(currentSkills,json.get(tempSkill,"Name"))==1," selected","")+">Proficiency</option><option value='2'"+if(json.get(currentSkills,json.get(tempSkill,"Name"))==2," selected","")+">Expertise</option></select></td></tr>"]

[h:skillSelectionHTML = skillSelectionHTML + "</tr><tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Skill Selection","lib://pm.a5e.core/BaseSkillSelection.html?cachelib=false","value="+base64.encode(skillSelectionHTML)+"; closebutton=0; width=325; height=775")]