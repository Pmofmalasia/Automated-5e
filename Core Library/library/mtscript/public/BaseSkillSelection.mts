[h:priorData = macro.args]
[h,if(priorData==""),CODE:{
    [h:nextInput = ""]
};{
    [h:nextInput = json.get(priorData,"NextInput")]
}]

[h:skillSelectionHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+currentToken()+"'>"]
[h,if(nextInput!=""): skillSelectionHTML = skillSelectionHTML + "<input type='hidden' id='NextInput' name='NextInput' value='"+nextInput+"'>"]
[h,if(currentToken()==""): currentSaves = "{}"; currentSaves = getProperty("a5e.stat.BaseSaves")]
[h,if(currentToken()==""): currentSkills = "{}"; currentSkills = getProperty("a5e.stat.BaseSkills")]

[h:savesList = pm.GetAttributes()]
[h,foreach(tempSave,savesList): skillSelectionHTML = skillSelectionHTML + "<tr id='rowSaveProf"+json.get(tempSave,"Name")+"'><th><label for='SaveProf"+json.get(tempSave,"Name")+"'>"+json.get(tempSave,"DisplayName")+":</label></th><td><select id='SaveProf"+json.get(tempSave,"Name")+"' name='SaveProf"+json.get(tempSave,"Name")+"'><option value='0'>Not Proficient</option><option value='1'"+if(json.get(currentSaves,json.get(tempSave,"Name"))==1," selected","")+">Proficiency</option><option value='2'"+if(json.get(currentSaves,json.get(tempSave,"Name"))==2," selected","")+">Expertise</option></select></td></tr>"]

[h:skillsList = pm.GetSkills()]
[h,foreach(tempSkill,skillsList): skillSelectionHTML = skillSelectionHTML + "<tr id='rowSkillProf"+json.get(tempSkill,"Name")+"'><th><label for='SkillProf"+json.get(tempSkill,"Name")+"'>"+json.get(tempSkill,"DisplayName")+":</label></th><td><select id='SkillProf"+json.get(tempSkill,"Name")+"' name='SkillProf"+json.get(tempSkill,"Name")+"'><option value='0'>Not Proficient</option><option value='1'"+if(json.get(currentSkills,json.get(tempSkill,"Name"))==1," selected","")+">Proficiency</option><option value='2'"+if(json.get(currentSkills,json.get(tempSkill,"Name"))==2," selected","")+">Expertise</option></select></td></tr>"]

[h:skillSelectionHTML = skillSelectionHTML + "</tr><tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Skill Selection","lib://pm.a5e.core/BaseSkillSelection.html?cachelib=false","value="+base64.encode(skillSelectionHTML))]