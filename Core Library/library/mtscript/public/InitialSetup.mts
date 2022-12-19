[macro("Reset to Default@Lib:pm.a5e.Core"):""]
[macro("Add Basic Macros@Lib:pm.a5e.Core"):""][h:RaceArray = pm.GetRaces()]
[h:RaceOptions = json.path.read(RaceArray,"[*].DisplayName")]

[h:charCreationHTML = "<tr><th><label for='charName'>Character Name:</label></th><td><input type='text' id='charName' name='charName' value='Name' autofocus></td></tr>
<tr><th text-align='center' colspan='2'><label>Ability Score Selection</label></th></tr>"]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(TempAttribute,AttributeList): charCreationHTML = charCreationHTML + "<tr><th><label for='"+json.get(TempAttribute,"Name")+"Choice'>"+json.get(TempAttribute,"DisplayName")+":</label></th><td><input type='number' value='10' id='"+json.get(TempAttribute,"Name")+"Choice' name='"+json.get(TempAttribute,"Name")+"Choice' min='1' max='20'></td></tr>"]

[h:charCreationHTML = charCreationHTML + "<tr><th><label for='raceChoice'>Race:</label></th><td>
<select id='raceChoice' name='raceChoice' onchange='refreshSubraces()'>"]

[h,foreach(tempRace,RaceOptions): charCreationHTML = charCreationHTML + "<option value='"+roll.count+"'>"+tempRace+"</option>"]
[h:charCreationHTML = charCreationHTML + "</select></td></tr>"]

[h:SubraceArray = pm.GetSubraces(json.get(json.get(RaceArray,0),"Name"))]
[h,if(json.isEmpty(SubraceArray)),CODE:{
    [h:charCreationHTML = charCreationHTML + "<tr><th><label for='subraceChoice'>Subrace:</label></th><td>
    <select id='subraceChoice' name='subraceChoice' readonly><option value='None'>No Subrace</option></select></td></tr>"]
};{
    [h:charCreationHTML = charCreationHTML + "<tr><th><label for='subraceChoice'>Subrace:</label></th><td>
    <select id='subraceChoice' name='subraceChoice'>"]
    [h:SubraceOptions = json.path.read(SubraceArray,"[*].DisplayName")]
    [h,foreach(tempSubrace,SubraceOptions): charCreationHTML = charCreationHTML + "<option value='"+roll.count+"'>"+tempSubrace+"</option>"]
    [h:charCreationHTML = charCreationHTML + "</select></td></tr>"]
}]

[h:charCreationHTML = charCreationHTML + "<tr><th><label for='sizeChoice'>Size:</label></th><td>"]
[h:firstRaceTraits = json.get(json.get(RaceArray,0),"Traits")]
[h:firstRaceSizeOptions = json.get(firstRaceTraits,"SizeOptions")]
[h,if(firstRaceSizeOptions==""),CODE:{
    [h:charCreationHTML = charCreationHTML + "<select id='sizeChoice' name='sizeChoice' value='"+json.get(firstRaceTraits,"Size")+"' readonly><option value='"+json.get(firstRaceTraits,"Size")+"'>"+json.get(firstRaceTraits,"Size")+"</option></td></tr>"]
};{
    [h:sizeOptions = ""]
    [h,foreach(tempSize,firstRaceSizeOptions): sizeOptions = sizeOptions + "<option value='"+tempSize+"'>"+tempSize+"</option>"]
    [h:charCreationHTML = charCreationHTML + "<select id='sizeChoice' name='sizeChoice'>"+sizeOptions+"</td></tr>"]
}]

[h:charCreationHTML = charCreationHTML + "<tr id='rowAlignment'><th><label for='Alignment'>Alignment:</label></th><td>
    <select id='Alignment' name='Alignment'>
        <option value='Lawful Good'>Lawful Good</option>
        <option value='Lawful Neutral'>Lawful Neutral</option>
        <option value='Lawful Evil'>Lawful Evil</option>
        <option value='Neutral Good'>Neutral Good</option>
        <option value='True Neutral'>True Neutral</option>
        <option value='Neutral Evil'>Neutral Evil</option>
        <option value='Chaotic Good'>Chaotic Good</option>
        <option value='Chaotic Neutral'>Chaotic Neutral</option>
        <option value='Chaotic Evil'>Chaotic Evil</option>
        <option value='Unaligned'>Unaligned</option>
    </select>
</td></tr>"]

[h:charCreationHTML = charCreationHTML + "<tr><th><label for='deityName'>Deity:</label></th><td><input type='text' id='deityName' name='deityName'></td></tr>
<tr><th><label for='allegianceChoice'>Character Allegiance:</label></th><td>
    <select id='allegianceChoice' name='allegianceChoice'>
        <option value='PC'>PC</option>
        <option value='Ally'>Ally</option>
        <option value='Enemy'>Enemy</option>
        <option value='Neutral'>Neutral</option>
    </select>
</td></tr>
<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr><input type='hidden' name='activeToken' id='activeToken' value='"+currentToken()+"'>"]

[h:html.dialog5("Character Creation","lib://pm.a5e.core/InitialSetup.html?cachelib=false","value="+base64.encode(charCreationHTML)+"; closebutton=0; width=375; height=500")]