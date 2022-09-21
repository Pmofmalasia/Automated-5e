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
[h,c(10): listSpellLevel = listSpellLevel + "<option value="+roll.count+if(!FirstPassTest && sLevel==roll.count,""," selected")+">"+if(roll.count==0,"Cantrip",roll.count)+"</option>"]

[h:tempListSchools = pm.GetSpellSchools("DisplayName","json")]
[h:listSchools = ""]
[h,foreach(tempSchool,tempListSchools): listSchools = listSchools + "<option value='"+tempSchool+"'"+if(!FirstPassTest && sSchool==tempSchool,""," selected")+">"+tempSchool+"</option>"]

[h:spellCreationHTML = "<tr><th><label for='spellName'>Spell Name:</label></th><td><input type='text' id='spellName' name='spellName' value='"+sName+"' "+if(FirstPassTest,"","disabled")+"></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + if(FirstPassTest,"","<tr><th><label for='spellEffectName'>Effect Name:</label></th><td><input type='text' id='spellEffectName' name='spellEffectName' value='Name'></td></tr>")]
[h:spellCreationHTML = spellCreationHTML + if(FirstPassTest,"","<tr><th><label for='spellEffectName'>Effect Name:</label></th><td><input type='text' id='spellEffectName' name='spellEffectName' value='Name'></td></tr>")]
[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='spellLevel'>Spell Level:</label></th><td><select id='spellLevel' name='spellLevel' "+if(FirstPassTest,"","disabled")+">"+listSpellLevel+"</select></td></tr>"]
[h:spellCreationHTML = spellCreationHTML + "<tr><th><label for='spellSchool'>Spell School:</label></th><td><select id='spellSchool' name='spellSchool' "+if(FirstPassTest,"","disabled")+">"+listSchools+"</select></td></tr>"]