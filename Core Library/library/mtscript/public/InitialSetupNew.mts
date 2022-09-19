[h:RaceArray = pm.GetRaces()]
[h:RaceOptions = json.path.read(RaceArray,"[*].DisplayName")]

[h,if(macro.args==""): previousSelection = "{}"; previousSelection = macro.args]

[h:charCreationHTML = "<tr><th><label for='charName'>Character Name:</label></th><td><input type='text' id='charName' name='charName'></td></tr>
<tr><th text-align='center' colspan='2'><label for='charName'>Ability Score Selection</label></th></tr>"]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(TempAttribute,AttributeList): charCreationHTML = charCreationHTML + "<tr><th><label for='"+json.get(TempAttribute,"Name")+"Choice'>"+json.get(TempAttribute,"DisplayName")+":</label></th><td><input type='number' value='"+if(json.get(previousSelection,json.get(TempAttribute,"Name")+"Choice")=="","10",json.get(previousSelection,json.get(TempAttribute,"Name")+"Choice"))+"' id='"+json.get(TempAttribute,"Name")+"Choice' name='"+json.get(TempAttribute,"Name")+"Choice' min='1' max='20'></td></tr>"]

[h:charCreationHTML = charCreationHTML + "<tr><th><label for='raceChoice'>Race:</label></th><td>
<select id='raceChoice' name='raceChoice' onchange='refreshSubraces()'>"]

[h:priorRaceSelection = if(json.get(previousSelection,"raceChoice")=="",0,json.get(previousSelection,"raceChoice"))]
[h,foreach(tempRace,RaceOptions): charCreationHTML = charCreationHTML + "<option value='"+roll.count+"' "+if(roll.count==priorRaceSelection,"selected","")+">"+tempRace+"</option>"]
[h:charCreationHTML = charCreationHTML + "</select></td></tr>"]

[h:SubraceArray = pm.GetSubraces(json.get(json.get(RaceArray,priorRaceSelection),"Name"))]
[h,if(json.isEmpty(SubraceArray)),CODE:{
    [h:charCreationHTML = charCreationHTML + "<tr><th><label for='subraceChoice'>Subrace:</label></th><td>
    <select id='subraceChoice' name='subraceChoice' disabled><option value=0>No Subrace</option></select></td></tr>"]
};{
    [h:charCreationHTML = charCreationHTML + "<tr><th><label for='subraceChoice'>Subrace:</label></th><td>
    <select id='subraceChoice' name='subraceChoice'>"]
    [h:SubraceOptions = json.path.read(SubraceArray,"[*].DisplayName")]
    [h,foreach(tempSubrace,SubraceOptions): charCreationHTML = charCreationHTML + "<option value='"+roll.count+"'>"+tempSubrace+"</option>"]
    [h:charCreationHTML = charCreationHTML + "</select></td></tr>"]
}]

[h:charCreationHTML = charCreationHTML + "<tr><th><label for='sizeChoice'>Size:</label></th><td><input type='hidden' id='sizeChoice' name='sizeChoice'></td></tr><tr><th><label for='orderChoice'>Order:</label></th><td>
    <select id='orderChoice' name='orderChoice'>
        <option value='Lawful' "+if(json.get(previousSelection,"orderChoice")=="Lawful","selected","")+">Lawful</option>
        <option value='Neutral' "+if(json.get(previousSelection,"orderChoice")=="Neutral","selected","")+">Neutral</option>
        <option value='Chaotic' "+if(json.get(previousSelection,"orderChoice")=="Chaotic","selected","")+">Chaotic</option>
    </select>
</td></tr>
<tr><th><label for='moralityChoice'>Morality:</label></th><td>
    <select id='moralityChoice' name='moralityChoice'>
        <option value='Good' "+if(json.get(previousSelection,"moralityChoice")=="Good","selected","")+">Good</option>
        <option value='Neutral' "+if(json.get(previousSelection,"moralityChoice")=="Neutral","selected","")+">Neutral</option>
        <option value='Evil' "+if(json.get(previousSelection,"moralityChoice")=="Evil","selected","")+">Evil</option>
    </select>
</td></tr>
<tr><th><label for='deityName'>Deity:</label></th><td><input type='text' id='deityName' name='deityName' value="+json.get(previousSelection,"moralityChoice")+"></td></tr>
<tr><th><label for='charType'>Type of Character:</label></th><td>
    <select id='charType' name='charType'>
        <option value='PC' "+if(json.get(previousSelection,"charType")=="PC","selected","")+">PC</option>
        <option value='Ally' "+if(json.get(previousSelection,"charType")=="Ally","selected","")+">Ally</option>
        <option value='Enemy' "+if(json.get(previousSelection,"charType")=="Enemy","selected","")+">Enemy</option>
        <option value='Neutral' "+if(json.get(previousSelection,"charType")=="Neutral","selected","")+">Neutral</option>
    </select>
</td></tr>"]

[h:html.dialog5("Character Creation", "lib://pm.a5e.core/InitialSetup.html","value="+base64.encode(charCreationHTML))]