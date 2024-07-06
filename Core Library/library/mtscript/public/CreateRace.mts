[h:RaceCreationData = macro.args]
[h:RaceOrSubrace = json.get(RaceCreationData,"RaceOrSubrace")]

[h:RaceInputHTML = "<tr id='rowHeader'><th text-align='center' colspan='2'>Create "+RaceOrSubrace+"</th></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowDisplayName'><th><label for='DisplayName'>"+RaceOrSubrace+" Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:Races = pm.a5e.GetCoreData("sb.Races")]
[h:RaceOptions = ut.a5e.GenerateSelectionHTML(Races)]
[h,if(RaceOrSubrace == "Subrace"),CODE:{
	[h:RaceInputHTML = RaceInputHTML + "<tr id='rowRace'><th><label for='Race'>Associated Race:</label></th><td><select id='Race' name='Race' onchange='setRaceDefaults()'>"+RaceOptions+"</select></td></tr>"]
};{
	[h:RaceInputHTML = RaceInputHTML + "<tr id='rowHasSubrace'><th><label for='hasSubrace'>Has Associated Subraces:</label></th><td><input type='checkbox' id='hasSubrace' name='hasSubrace'></td></tr>"]
}]

[h:CreatureTypes = pm.a5e.GetCoreData("sb.CreatureTypes")]
[h:CreatureTypeOptions = ut.a5e.GenerateSelectionHTML(CreatureTypes)]
[h:RaceInputHTML = RaceInputHTML + "<tr id='rowCreatureType'><th><label for='CreatureType'>Creature Type:</label></th><td><select id='CreatureType' name='CreatureType'>"+CreatureTypeOptions+"</select></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowRaceCountsAs'><th><label for='RaceCountsAs'>Counts as Other Race:</label></th><td><select id='RaceCountsAs' name='RaceCountsAs'><option value=''>None</option>"+RaceOptions+"</select></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowLifespan'><th><label for='Lifespan'>Average Lifespan:</label></th><td><input type='number' id='Lifespan' name='Lifespan' style='width:30px' value=100></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowSize'><th><label for='Size'>Size:</label></th><td><select id='Size' name='Size' onchange='createChooseSizeRows("+'"CreateRaceTable","rowAttributeAllocationMethod"'+")'><option value='Tiny'>Tiny</option><option value='Small'>Small</option><option value='Medium' selected>Medium</option><option value='Large'>Large</option><option value='Huge'>Huge</option><option value='Choose'>Choose From Multiple</option></select></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowAttributeAllocationMethod'><th><label for='AttributeAllocationMethod'>How are Attributes Allocated:</label></th><td><select id='AttributeAllocationMethod' name='AttributeAllocationMethod' onchange='createAttributeSelectionRows("+'"rowSpeed"'+")'><option value='FlexibleChoice'>Any +2/+1 or +1/+1/+1</option><option value='Preset'>Preset</option><option value='Mixed'>Mixed Preset + Choice</option><option value='Choice'>Non- +2/+1 or +1/+1/+1 Choice</option><option value=''>None Granted</option></select></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowSpeed'><th><label for='BaseSpeed'>Base Speed:</label></th><td><input type='number' id='BaseSpeed' name='BaseSpeed' min=0 value=30 style='width:25px'></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowBurrowSpeed'><th><label for='BaseBurrowSpeed'>Base Burrowing Speed:</label></th><td><input type='number' id='BaseBurrowSpeed' name='BaseBurrowSpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowClimbSpeed'><th><label for='BaseClimbSpeed'>Base Climbing Speed:</label></th><td><input type='number' id='BaseClimbSpeed' name='BaseClimbSpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowFlySpeed'><th><label for='BaseFlySpeed'>Base Flying Speed:</label></th><td><input type='number' id='BaseFlySpeed' name='BaseFlySpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowSwimSpeed'><th><label for='BaseSwimSpeed'>Base Swimming Speed:</label></th><td><input type='number' id='BaseSwimSpeed' name='BaseSwimSpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowIsVision'><th><label for='isVision'>Gives Special Vision:</label></th><td><input type='checkbox' id='isVision' name='isVision' onchange='createVisionRows("+'"rowLanguageOptions"'+")'></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowLanguageOptions'><th><label for='LanguageOptions'>Chosen Languages:</label></th><td><input type='number' id='LanguageOptions' name='LanguageOptions' value=1 min=0 style='width:25px'></td></tr>"]

[h:AllLanguages = pm.a5e.GetCoreData("sb.Languages")]
[h:LanguageOptions = ut.a5e.GenerateSelectionHTML(AllLanguages)]
[h:RaceInputHTML = RaceInputHTML + "<tr id='rowLanguageKnown0'><th><label for='LanguageKnown0'>Known Language #1:</label></th><td><select id='LanguageKnown0' name='LanguageKnown0' value=1 min=0>"+LanguageOptions+"</select></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowLanguageKnownButtons'><th text-align='center' colspan='2'><input type='button' id='addLanguageKnown' value='New Language Known' onclick='addLanguageKnownRow()'>  <input type='button' id='removeLanguageKnown' value='Remove Language Known' onclick='removeLanguageKnownRow()'><input type='hidden' id='LanguageKnownNumber' name='LanguageKnownNumber' value=0></th></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowIsFeatChoice'><th><label for='FeatChoice'>Grants a Feat at Level 1:</label></th><td><input type='checkbox' id='FeatChoice' name='FeatChoice'></td></tr>"]

[h,if(RaceOrSubrace == "Subrace"): RaceInputHTML = RaceInputHTML + "<tr id='rowIgnoredBaseFeatures'><th>Base Racial Features Not Gained by Subrace:</th><td><div id='IgnoredBaseFeatures' class='check-multiple' style='width:100%'></div></td></tr>"]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = ""]
[h,foreach(tempBook,allSourcebooks),CODE:{
	[h:tempBookDisplayName = json.get(tempBook,"DisplayName")]
	[h,if(length(tempBookDisplayName) > 22): tempBookDisplayName = substring(tempBookDisplayName,0,20)+"..."]
	[h:sourcebookOptions = sourcebookOptions + "<option value='"+json.get(tempBook,"Library")+"'>"+tempBookDisplayName+"</option>"]
}]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowLibrary'><th><label for='Library'>"+RaceOrSubrace+" Sourcebook:</label></th><td><select id='Library' name='Library'>"+sourcebookOptions+"</select></td></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("RaceCreation","lib://pm.a5e.core/CreateRace.html?cachelib=false","value="+base64.encode(RaceInputHTML)+"; closebutton=0; width=500; height=500")]