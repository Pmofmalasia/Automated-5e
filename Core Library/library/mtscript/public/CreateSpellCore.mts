[h:FirstPassTest = json.get(macro.args,"FirstPass")]
[h:sMultiEffects = json.get(macro.args,"EffectNumber")]
[h:IsRandomEffect = json.get(macro.args,"IsRandomEffect")]
[h:sDescriptionTT = json.get(macro.args,"sDescriptionTT")]
[h:sName = json.get(macro.args,"sName")]
[h:RangeType = json.get(macro.args,"RangeType")]
[h:AoEShape = json.get(macro.args,"AoEShape")]
[h:sDuration = json.get(macro.args,"sDuration")]
[h:sCastTime = json.get(macro.args,"CastTime")]
[h:sSchool = json.get(macro.args,"sSchool")]
[h:IsSummon = json.get(macro.args,"IsSummon")]
[h:IsAHLSummon = json.get(macro.args,"IsAHLSummon")]
[h:sList = json.get(macro.args,"sList")]
[h:sLevel = json.get(macro.args,"sLevel")]

[h:list1through9 = ""]
[h,c(9): list1through9 = list1through9 + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]

[h:listSpellLevel = ""]
[h,c(10): listSpellLevel = listSpellLevel + "<option value="+roll.count+if(!FirstPassTest && sLevel==roll.count," selected","")+">"+if(roll.count==0,"Cantrip",roll.count)+"</option>"]

[h:tempListSchools = pm.GetSpellSchools("DisplayName","json")]
[h:listSchools = ""]
[h,foreach(tempSchool,tempListSchools): listSchools = listSchools + "<option value='"+tempSchool+"'"+if(!FirstPassTest && sSchool==tempSchool," selected","")+">"+tempSchool+"</option>"]

[h,if(json.get(sCastTime,"Value")==""),CODE:{
	[h:CastTimeString = ""]
};{
	[h:CastTimeString = json.get(sCastTime,"Value")+" "+json.get(sCastTime,"Units")+if(json.get(sCastTime,"Value")==1,"","s")]
}]
[h:castTimeOptions = json.append("","Action","Bonus Action","Reaction","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours","Custom")]
[h,if(CastTimeString!="" && !json.contains(castTimeOptions,CastTimeString)): castTimeOptions = json.append(castTimeOptions,CastTimeString)]
[h:listCastTime = ""]
[h,foreach(tempCastTime,castTimeOptions): listCastTime = listCastTime + "<option value='"+tempCastTime+"'"+if(CastTimeString==tempCastTime," selected","")+">"+tempCastTime+"</option>"]

[h,if(json.get(sDuration,"Value")==""),CODE:{
	[h:DurationString = ""]
};{
	[h:DurationString = json.get(sDuration,"Value")+" "+json.get(sDuration,"Units")+if(json.get(sDuration,"Value")==1,"","s")]
}]
[h:durationOptions = json.append("","Instantaneous","1 Round","1 Minute","10 Minutes","1 Hour","8 Hours","24 Hours","10 Days","Until Dispelled","Custom")]
[h:previousCustomDurationTest = (DurationString!="" && !json.contains(durationOptions,DurationString))]
[h,if(previousCustomDurationTest): durationOptions = json.append(durationOptions,DurationString)]
[h:listDuration = ""]
[h,foreach(tempDuration,durationOptions): listDuration = listDuration + "<option value='"+tempDuration+"'"+if(DurationString==tempDuration," selected","")+">"+tempDuration+"</option>"]

[h:spellCreationHTML = "<tr><th><label for='SpellName'>Spell Name:</label></th><td><input type='text' id='SpellName' name='SpellName' value='"+sName+"' "+if(FirstPassTest,"","readonly")+" autofocus></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + if(FirstPassTest,"","<tr><th><label for='SpellEffectName'>Effect Name:</label></th><td><input type='text' id='SpellEffectName' name='SpellEffectName' value='Name'></td></tr>")]
[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='SpellLevel'>Spell Level:</label></th><td><select id='SpellLevel' name='SpellLevel' "+if(FirstPassTest,"","readonly")+">"+listSpellLevel+"</select></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='School'>Spell School:</label></th><td><select id='School' name='School' "+if(FirstPassTest,"","readonly")+">"+listSchools+"</select></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr id='rowCastTime'><th><label for='CastTime'>Casting Time:</label></th><td><select id='CastTime' name='CastTime' onchange='customCastTime()'>"+listCastTime+"</select></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr id='Ritual'><th><label for='isRitual'>Ritual Spell:</label></th><td><input type='checkbox' id='isRitual' name='isRitual' value=1></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr id='rowDuration'><th><label for='spellDuration'>Duration:</label></th><td><select id='spellDuration' name='spellDuration' onchange='customDuration()'>"+listDuration+"</select>"+if(previousCustomDurationTest,"<input type='hidden' id='previousCustomDurationValue' name='previousCustomDurationValue' value='"+json.get(sDuration,"Value")+"'><input type='hidden' id='previousCustomDurationUnits' name='previousCustomDurationUnits' value='"+json.get(sDuration,"Units")+"'>","")+"</td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr id='rowDurationAHL'><th><label for='AHLDuration'>Duration Increases at Higher Levels:</label></th><td><input type='checkbox' id='AHLDuration' name='AHLDuration' onchange='ahlDuration()' value=1></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='isConcentration'>Concentration:</label></th><td><input type='checkbox' id='isConcentration' name='isConcentration' value=1></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr id='rowConcLost'><th><label for='ConcentrationLost'>Concentration Not Required at Higher Levels:</label></th><td><input type='checkbox' id='ConcentrationLost' name='ConcentrationLost' onchange='concLost()' value=1></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='vComp'>Verbal Components:</label></th><td><input type='checkbox' id='vComp' name='vComp' value=1></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='sComp'>Somatic Components:</label></th><td><input type='checkbox' id='sComp' name='sComp' value=1></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr id='MaterialComponents'><th><label for='mComp'>Material Components:</label></th><td><input type='checkbox' id='mComp' name='mComp' onchange='mCompInput()' value=1></td></tr>"]

[h,if(FirstPassTest): spellCreationHTML = spellCreationHTML + "<tr><th><label for='multiEffects'><span title='Intended for spells where each effect is significantly different, such as Plant Growth, Control Winds, etc. More minor changes like damage type, creature summoned, etc. do not require a distinct effect. If there is more than one effect, input only features of the spell common to all effects.'>Number of Distinct Effects:</span></label></th><td><input type='number' id='multiEffects' name='multiEffects' min='1' value='1'></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='multiSubeffects'><span title='Increase if a spell effect has different parts that have different conditions for resolving. For example, Ice Knife makes an attack against a single target (effect 1), then forces a save against all creatures around them (effect 2); Ray of Sickness makes a spell attack to deal damage (effect 1), then forces that target to make a save against poison if it hits (effect 2); and Vampiric Touch makes an attack to deal damage (effect 1), then heals the caster for half the amount of damage dealt (effect 2).'>Number of Subeffects:</span></label></th><td><input type='number' id='multiSubeffects' name='multiSubeffects' min='1' value='1'></td></tr>"]

[h:spellCreationHTML = spellCreationHTML + "<tr id='rowCastingClasses'><th text-align='center' colspan='2'>Appears on Base Spell List For:</th></tr>"]
[h:classList = pm.GetClasses()]
[h,foreach(tempClass,classList),CODE:{
	[h:isCastingClass = !json.isEmpty(json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.Class=='"+json.get(tempClass,"Name")+"' && @.UniqueSpellList==1)]","DEFAULT_PATH_LEAF_TO_NULL"))]
	[h,if(isCastingClass): spellCreationHTML = spellCreationHTML + "<tr id='rowIs"+json.get(tempClass,"Name")+"'><th>"+json.get(tempClass,"DisplayName")+":</th><td><input type='checkbox' id='is"+json.get(tempClass,"Name")+"' name='is"+json.get(tempClass,"Name")+"' value=1></td></tr>"]
}]

[h:spellCreationHTML = spellCreationHTML + "<tr id='Description'><th text-align='center' colspan='2'><label for='spellDescription'>Full Spell Description:</label></th colspan='2'></th></tr><tr id='rowSpellTextArea'><th><textarea id='spellDescription' name='spellDescription' rows='10' style='width:177%'></textarea></th></tr><tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Spell Creation","lib://pm.a5e.core/CreateSpellCore.html?cachelib=false","value="+base64.encode(spellCreationHTML))]