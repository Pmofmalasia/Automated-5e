[h:Flavor = json.get(macro.args,"Flavor")]
[h:TargetTokens = getSelected("json")]

[h:ChangeHPHTML = "<input type='hidden' name='TargetTokens' id='TargetTokens' value='"+base64.encode(TargetTokens)+"'>"]

[h,if(json.length(TargetTokens) == 1),CODE:{
	[h:ChangeHPHTML = ChangeHPHTML + "<tr id='rowTargetDisplay'><th text-align='center' colspan='2'><img src='"+getTokenImage(50,json.get(TargetTokens,0))+"'> Changing HP of "+getName(json.get(TargetTokens,0))+"</th></tr>"]
};{
	[h:tempTargetNames = ""]
	[h,foreach(target,targetTokens): tempTargetNames = json.append(tempTargetNames,getName(target))]
	[h:ChangeHPHTML = ChangeHPHTML + "<tr id='rowTargetDisplay><th text-align='center' colspan='2'>Changing HP of "+pm.a5e.CreateDisplayList(tempTargetNames,"and")+"</th></tr>"]
}]

[h:DamageTypeOptions = "<option value='None'>Ignore Type</option>"]
[h,foreach(tempType,pm.GetDamageTypes()): DamageTypeOptions = DamageTypeOptions + "<option value='"+json.get(tempType,"Name")+"'>"+json.get(tempType,"DisplayName")+"</option>"]
[h:DamageTypeOptions = DamageTypeOptions + "<option value='Healing'>Healing</option><option value='TempHP'>Temp HP</option>"]

[h:ChangeHPHTML = ChangeHPHTML + "<input type='hidden' id='DamageTypeNumber' name='DamageTypeNumber' value=0><tr id='rowDamage0'><th><label for='DamageValue0'>Damage:</label></th><td><input type='number' id='DamageValue0' name='DamageValue0' value='0' min=0 style='width:30px' autofocus><select id='DamageType0' name='DamageType0'>"+DamageTypeOptions+"</select></td></tr>"]

[h:ChangeHPHTML = ChangeHPHTML + "<tr id='rowDamageButtons'><th text-align='center' colspan='2'><input type='button' id='addDamageType' name='addDamageType' value='Add' onclick='addDamageTypeRow()'>  <input type='button' id='removeDamageType' name='removeDamageType' value='Remove' onclick='removeDamageTypeRow()'></th></tr>"]

[h:ChangeHPHTML = ChangeHPHTML + "<tr id='rowBypassConc'><th><label for='BypassConc'>Ignore Concentration?</label></th><td><input type='checkbox' id='BypassConc' name='BypassConc' onchange='addConcSaveOptions()' checked></td></tr>"]

[h:ChangeHPHTML = ChangeHPHTML + "<tr id='rowAddSourceInfo'><th><label for='AddSourceInfo'>Apply Detailed Damage Info?</label></th><td><input type='checkbox' id='AddSourceInfo' name='AddSourceInfo' onchange='addSourceInfo()'></td></tr>"]

[h:ChangeHPHTML = ChangeHPHTML + "<tr id='rowOutputTargets'><th><label for='OutputTargets'>Who Sees the Result?</label></th><td><select id='OutputTargets' name='OutputTargets'><option value='Everyone'>Everyone</option>"+if(isGM(),"","<option value='YouAndDM'>You and DM</option>")+"<option value='DMOnly'>DM Only</option></select></td></tr>"]

[h:ChangeHPHTML = ChangeHPHTML + "<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("ChangeHPInput","lib://pm.a5e.core/ChangeHPInput.html?cachelib=false","value="+base64.encode(ChangeHPHTML)+"; closebutton=0; width=450; height=500")]