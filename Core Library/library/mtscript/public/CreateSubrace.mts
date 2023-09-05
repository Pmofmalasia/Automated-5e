[h:SubraceInputHTML = "<tr id='rowHeader'><th text-align='center' colspan='2'>Create Subrace</th></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowDisplayName'><th><label for='DisplayName'>Subrace Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:Races = pm.a5e.GetCoreData("sb.Races")]
[h:RaceOptions = ut.a5e.GenerateSelectionHTML(Races)]
[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowRace'><th><label for='Race'>Associated Race:</label></th><td><select id='Race' name='Race'>"+RaceOptions+"</select></td></tr>"]

[h:OtherSubraces = pm.a5e.GetCoreData("sb.Subraces")]
[h:OtherSubraceOptions = ut.a5e.GenerateSelectionHTML(OtherSubraces)]
[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowSubraceCountsAs'><th><label for='SubraceCountsAs'>Counts as Other Subrace:</label></th><td><select id='SubraceCountsAs' name='SubraceCountsAs'><option value=''>None</option>"+OtherSubraceOptions+"</select></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowLifespan'><th><label for='Lifespan'>Average Lifespan:</label></th><td><input type='number' id='Lifespan' name='Lifespan' style='width:30px' value=100></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowSize'><th><label for='Size'>Size:</label></th><td><select id='Size' name='Size' onchange='createChooseSizeRows("+'"CreateSubraceTable","rowAttributeAllocationMethod"'+")'><option value='Tiny'>Tiny</option><option value='Small'>Small</option><option value='Medium' selected>Medium</option><option value='Large'>Large</option><option value='Huge'>Huge</option><option value='Choose'>Choose From Multiple</option></select></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowAttributeAllocationMethod'><th><label for='AttributeAllocationMethod'>How are Attributes Allocated:</label></th><td><select id='AttributeAllocationMethod' name='AttributeAllocationMethod' onchange='createAttributeSelectionRows("+'"CreateSubraceTable","rowSpeed"'+")'><option value='Choice'>Any +2/+1 or +1/+1/+1</option><option value='Preset'>Preset</option><option value='Mixed'>Mixed Preset + Choice</option><option value=''>None Granted</option></select></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowSpeed'><th><label for='BaseSpeed'>Base Speed:</label></th><td><input type='number' id='BaseSpeed' name='BaseSpeed' min=0 value=30 style='width:25px'></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowBurrowSpeed'><th><label for='BaseBurrowSpeed'>Base Burrowing Speed:</label></th><td><input type='number' id='BaseBurrowSpeed' name='BaseBurrowSpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowClimbSpeed'><th><label for='BaseClimbSpeed'>Base Climbing Speed:</label></th><td><input type='number' id='BaseClimbSpeed' name='BaseClimbSpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowFlySpeed'><th><label for='BaseFlySpeed'>Base Flying Speed:</label></th><td><input type='number' id='BaseFlySpeed' name='BaseFlySpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowSwimSpeed'><th><label for='BaseSwimSpeed'>Base Swimming Speed:</label></th><td><input type='number' id='BaseSwimSpeed' name='BaseSwimSpeed' min=0 value=0 style='width:25px'></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowIsSenses'><th><label for='isSenses'>Gives Special Senses:</label></th><td><input type='checkbox' id='isSenses' name='isSenses'></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowLanguageOptions'><th><label for='LanguageOptions'>Chosen Languages:</label></th><td><input type='number' id='LanguageOptions' name='LanguageOptions' value=1 min=0></td></tr>"]

[h:AllLanguages = pm.a5e.GetCoreData("sb.Languages")]
[h:LanguageOptions = ut.a5e.GenerateSelectionHTML(AllLanguages)]
[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowLanguageKnown0'><th><label for='LanguageKnown0'>Known Language #1:</label></th><td><select id='LanguageKnown0' name='LanguageKnown0' value=1 min=0 style='width:25px'>"+LanguageOptions+"</select></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowLanguageKnownButtons'><th text-align='center' colspan='2'><input type='button' id='addLanguageKnown' value='New Language Known' onclick='addLanguageKnownRow("+'"CreateSubraceTable"'+")'>  <input type='button' id='removeLanguageKnown' value='Remove Language Known' onclick='removeLanguageKnownRow("+'"CreateSubraceTable"'+")'><input type='hidden' id='LanguageKnownNumber' name='LanguageKnownNumber' value=0></th></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowIsFeatChoice'><th><label for='FeatChoice'>Grants a Feat at Level 1:</label></th><td><input type='checkbox' id='FeatChoice' name='FeatChoice'></td></tr>"]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = ""]
[h,foreach(tempBook,allSourcebooks),CODE:{
	[h:tempBookDisplayName = json.get(tempBook,"DisplayName")]
	[h,if(length(tempBookDisplayName) > 22): tempBookDisplayName = substring(tempBookDisplayName,0,20)+"..."]
	[h:sourcebookOptions = sourcebookOptions + "<option value='"+json.get(tempBook,"Library")+"'>"+tempBookDisplayName+"</option>"]
}]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowLibrary'><th><label for='Library'>Subrace Sourcebook:</label></th><td><select id='Library' name='Library'>"+sourcebookOptions+"</select></td></tr>"]

[h:SubraceInputHTML = SubraceInputHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Subrace Creation","lib://pm.a5e.core/CreateSubrace.html?cachelib=false","value="+base64.encode(SubraceInputHTML)+"; closebutton=0; width=500; height=500")]