[h,if(getLibProperty("ct.NewFeature","Lib:pm.a5e.Core")==""): setLibProperty("ct.NewFeature","{}","Lib:pm.a5e.Core")]
[h:setLibProperty("ct.NewFeature",json.remove(getLibProperty("ct.NewFeature","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]

[h:list1through20 = ""]
[h,c(20): list1through20 = list1through20 + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]

[h:CreateFeatureHTML = "<tr id='rowDisplayName'><th><label for='DisplayName'>Feature Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowFeatureType'><th><label for='FeatureType'>Feature Type:</label></th><td><select id='FeatureType' name='FeatureType' onchange='createFeatureTypeSpecificRows("+'"CreateFeatureTable"'+")'><option value='Class'>Class</option><option value='Race'>Race</option><option value='Feat'>Feat</option><option value='Background'>Background</option><option value='FightingStyle'>Fighting Style</option><option value='MonsterFeature'>NPC Feature</option></select></td></tr>"]

[h:"<!-- createFeatureTypeSpecificRows() is executed in JS to make those lines there -->"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr><th><label for='School'>Feature School:</label></th><td><select id='School' name='School'>"+listSchools+"</select></td></tr>"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowEffectsNumber'><th><label for='EffectsNumber'>Number of Distinct Effects:</label></th><td><input type='number' id='EffectsNumber' name='EffectsNumber' min='1' value='1' style='width:25px'> <input type='checkbox' id='RandomEffect' name='RandomEffect'> Chosen Randomly?</td></tr>"]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = ""]
[h,foreach(tempBook,allSourcebooks),CODE:{
	[h:tempBookDisplayName = json.get(tempBook,"DisplayName")]
	[h,if(length(tempBookDisplayName) > 22): tempBookDisplayName = substring(tempBookDisplayName,0,20)+"..."]
	[h:sourcebookOptions = sourcebookOptions + "<option value='"+json.get(tempBook,"Library")+"'>"+tempBookDisplayName+"</option>"]
}]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowSourcebook'><th><label for='Sourcebook'>Sourcebook:</label></th><td><select id='Sourcebook' name='Sourcebook'>"+sourcebookOptions+"</select></td></tr>

<tr id='rowDescription'><th text-align='center' colspan='2'><label for='Description'>Full Feature Description:</label></th colspan='2'></th></tr><tr id='rowFeatureTextArea'><th><textarea id='Description' name='Description' rows='10' style='width:197%'></textarea></th></tr>

<tr id='rowAbridgedDescription'><th text-align='center' colspan='2'><label for='AbridgedDescription'>Optional Abridged Description:</label></th colspan='2'></th></tr><tr id='rowAbridgedFeatureTextArea'><th><textarea id='AbridgedDescription' name='AbridgedDescription' rows='4' style='width:197%'></textarea></th></tr>"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Feature Creation","lib://pm.a5e.core/CreateFeature.html?cachelib=false","value="+base64.encode(CreateFeatureHTML)+"; closebutton=0; width=675; height=1050")]