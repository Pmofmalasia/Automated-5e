[h:skillSelectionHTML = ""]
[h,if(currentToken()==""): currentSaves = "{}"; currentSaves = getProperty("Saves")]
[h,if(currentToken()==""): currentSkills = "{}"; currentSkills = getProperty("Skills")]

[h:savesList = pm.GetAttributes()]
[h,foreach(tempSave,savesList): skillSelectionHTML = skillSelectionHTML + "<tr id='rowSaveProf"+json.get(tempSave,"Name")+"'><th><label for='SaveProf"+json.get(tempSave,"Name")+"'>"+json.get(tempSave,"DisplayName")+":</label></th><td><select id='SaveProf"+json.get(tempSave,"Name")+"' name='SaveProf"+json.get(tempSave,"Name")+"'><option value='0'>Not Proficient</option><option value='1' "+if(json.get(currentSaves,json.get(tempSave,"Name"))==1,"selected","")+">Proficiency</option><option value='2' "+if(json.get(currentSaves,json.get(tempSave,"Name"))==2,"selected","")+">Expertise</option></select></td></tr>"]

[h:html.dialog5("Skill Selection","lib://pm.a5e.core/SkillSelection.html?cachelib=false","value="+base64.encode(skillSelectionHTML))]