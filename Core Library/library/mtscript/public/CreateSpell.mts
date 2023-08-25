[h,if(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core")==""): setLibProperty("ct.NewSpell","{}","Lib:pm.a5e.Core")]
[h:setLibProperty("ct.NewSpell",json.remove(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]

[h:list1through9 = ""]
[h,c(9): list1through9 = list1through9 + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]

[h:listSpellLevel = ""]
[h,c(10): listSpellLevel = listSpellLevel + "<option value="+roll.count+">"+if(roll.count==0,"Cantrip",roll.count)+"</option>"]

[h:tempListSchools = pm.GetSpellSchools("DisplayName","json")]
[h:listSchools = ""]
[h,foreach(tempSchool,tempListSchools): listSchools = listSchools + "<option value='"+tempSchool+"'>"+tempSchool+"</option>"]

[h:spellCreationHTML = "<tr><th><label for='DisplayName'>Spell Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='Level'>Spell Level:</label></th><td><select id='Level' name='Level'>"+listSpellLevel+"</select></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='School'>Spell School:</label></th><td><select id='School' name='School'>"+listSchools+"</select></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr id='Ritual'><th><label for='isRitual'>Ritual Spell:</label></th><td><input type='checkbox' id='isRitual' name='isRitual' value=1></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='vComp'>Verbal Components:</label></th><td><input type='checkbox' id='vComp' name='vComp' value=1></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='sComp'>Somatic Components:</label></th><td><input type='checkbox' id='sComp' name='sComp' value=1></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr id='MaterialComponents'><th><label for='mComp'>Material Components:</label></th><td><input type='checkbox' id='mComp' name='mComp' onchange='mCompInput()' value=1></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr><th><span title='Intended for spells where each effect is significantly different, such as Plant Growth, Control Winds, etc. More minor changes like damage type, creature summoned, etc. do not require a distinct effect. If there is more than one effect, input only features of the spell common to all effects.'><label for='EffectsNumber'>Number of Distinct Effects:</label></span></th><td><input type='number' id='EffectsNumber' name='EffectsNumber' min='1' value='1' style='width:25px'> <input type='checkbox' id='RandomEffect' name='RandomEffect'> Chosen Randomly?</td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr id='rowCastingClasses'><th text-align='center' colspan='2'>Appears on Base Spell List For:</th></tr>"]

[h:UniqueSpellListFeatures = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.UniqueSpellList==1)]")]
[h,foreach(tempFeature,UniqueSpellListFeatures),CODE:{
	[h:tempClassDisplayName = pm.GetDisplayName(json.get(tempFeature,"Class"),"sb.Classes")]
	[h:tempSubclassDisplayName = pm.GetDisplayName(json.get(tempFeature,"Subclass"),"sb.Subclasses")]

	[h:spellCreationHTML = spellCreationHTML + "<tr id='rowIs"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass")+"'><th><label for='is"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass")+"'>"+if(tempSubclassDisplayName=="","",tempSubclassDisplayName+" ")+tempClassDisplayName+" "+json.get(tempFeature,"DisplayName")+":</label></th><td><input type='checkbox' id='is"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass")+"' name='is"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass")+"' value=1></td></tr>"]
}]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = ""]
[h,foreach(tempBook,allSourcebooks),CODE:{
	[h:tempBookDisplayName = json.get(tempBook,"DisplayName")]
	[h,if(length(tempBookDisplayName) > 22): tempBookDisplayName = substring(tempBookDisplayName,0,20)+"..."]
	[h:sourcebookOptions = sourcebookOptions + "<option value='"+json.get(tempBook,"Library")+"'>"+tempBookDisplayName+"</option>"]
}]

[h:spellCreationHTML = spellCreationHTML + "<tr id='rowSourcebook'><th><label for='spellSourcebook'>Spell Sourcebook:</label></th><td><select id='spellSourcebook' name='spellSourcebook'>"+sourcebookOptions+"</select></td></tr>

<tr id='rowDescription'><th text-align='center' colspan='2'><label for='Description'>Full Spell Description:</label></th colspan='2'></th></tr><tr id='rowSpellTextArea'><th><textarea id='Description' name='Description' rows='10' style='width:197%'></textarea></th>

<tr id='rowAHLDescription'><th text-align='center' colspan='2'><label for='AHLDescription'>At Higher Levels:</label></th colspan='2'></th></tr><tr id='rowAHLSpellTextArea'><th><textarea id='AHLDescription' name='AHLDescription' rows='3' style='width:197%'></textarea></th>"]

[h:spellCreationHTML = spellCreationHTML + "</tr><tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Spell Creation","lib://pm.a5e.core/CreateSpell.html?cachelib=false","value="+base64.encode(spellCreationHTML)+"; closebutton=0; width=675; height=1050")]