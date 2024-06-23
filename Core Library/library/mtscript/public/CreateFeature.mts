[h:list1through20 = ""]
[h,c(20): list1through20 = list1through20 + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]

[h:CreateFeatureHTML = "<tr id='rowDisplayName'><th><label for='DisplayName'>Feature Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowFeatureType'><th><label for='FeatureType'>Feature Type:</label></th><td><select id='FeatureType' name='FeatureType' onchange='createFeatureTypeSpecificRows("+'"CreateFeatureTable"'+")'><option value='Class'>Class</option><option value='Race'>Race</option><option value='Feat'>Feat</option><option value='Background'>Background</option><option value='FightingStyle'>Fighting Style</option><option value='MonsterFeature'>NPC Feature</option></select></td></tr>"]

[h:"<!-- createFeatureTypeSpecificRows() is executed in JS to make those lines there -->"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowLevel'><th><label for='Level'>Level Gained:</label></th><td><select id='Level' name='Level'><option value=''>None</option>"+list1through20+"</select></td></tr>"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowIsOnLevel'><th><label for='isOnLevel'><span title='Uncheck if must be chosen to be gained, e.g. Eldritch Invocations, Feats'>Gained Automatically on Level Up:</span></label></th><td><input type='checkbox' id='isOnLevel' name='isOnLevel' checked></td></tr>"]

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

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></th></tr>"]

[h:createFeatureData = json.set("",
	"Input",CreateFeatureHTML,
	"ParentToken",currentToken(),
	"PriorData","{}"
)]

[h:html.dialog5("Feature Creation","lib://pm.a5e.core/CreateFeature.html?cachelib=false","value="+base64.encode(createFeatureData)+"; closebutton=0; width=675; height=1050")]