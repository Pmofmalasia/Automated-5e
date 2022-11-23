[h:monsterCreationHTML = "<tr id='rowMonsterName'><th><label for='DisplayName'>Creature Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:creatureTypeArray = pm.GetCreatureTypes()]
[h:creatureTypeOptions = ""]
[h,foreach(tempType,creatureTypeArray): creatureTypeOptions = creatureTypeOptions + "<option value='"+json.get(tempType,"Name")+"'>"+json.get(tempType,"DisplayName")+"</option>"]
[h:creatureTypeOptions = creatureTypeOptions + "<option value='Multiple'>Multiple</option>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCreatureType'><th><label for='CreatureType'>Monster Name:</label></th><td><select id='CreatureType' name='CreatureType' onchange='creatureTypeSelectionChanges()'>"+creatureTypeOptions+"</select></td></tr>"]

[h:"<!-- TODO: Add creature subtype selection for first entry of creaturetypeoptions once created -->"]
[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCreatureSubtype'><th><label for='CreatureSubtype'>Monster Name:</label></th><td><select id='CreatureSubtype' name='CreatureSubtype'></select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowAlignmentOrder'><th><label for='orderChoice'>Order:</label></th><td>
    <select id='orderChoice' name='orderChoice'>
        <option value='Lawful'>Lawful</option>
        <option value='Neutral'>Neutral</option>
        <option value='Chaotic'>Chaotic</option>
    </select>
</td></tr>
<tr id='rowAlignmentMorality'><th><label for='moralityChoice'>Morality:</label></th><td>
    <select id='moralityChoice' name='moralityChoice'>
        <option value='Good'>Good</option>
        <option value='Neutral'>Neutral</option>
        <option value='Evil'>Evil</option>
    </select>
</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowMaxHP'><th><label for='MaxHP'>Maximum HP:</label></th><td><input type='number' id='MaxHP' name='MaxHP' min='1' width='40px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowHitDie'><th><label for='HitDieNum'>Total Hit Dice:</label></th><td><input type='number' id='HitDieNum' name='HitDieNum' min='1' width='25px'>d<input type='number' id='HitDieSize' name='HitDieSize' min='1' width='25px'> + <input type='number' id='HitDieBonus' name='HitDieBonus' min='0' width='25px'></td></tr>"]

[h:"<!-- TODO: Insert AC stuff here - need a toggle for using standard calculations vs. natural armor -->"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedGround'><th><label for='SpeedGround'>Base Ground Speed:</label></th><td><input type='number' id='SpeedGround' name='SpeedGround' min='1' width='25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedBurrow'><th><label for='SpeedBurrow'>Base Burrowing Speed:</label></th><td><input type='number' id='SpeedBurrow' name='SpeedBurrow' min='0' width='25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedClimb'><th><label for='SpeedClimb'>Base Climbing Speed:</label></th><td><input type='number' id='SpeedClimb' name='SpeedClimb' min='0' width='25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedFly'><th><label for='SpeedFly'>Base Flying Speed:</label></th><td><input type='number' id='SpeedFly' name='SpeedFly' min='0' width='25px'> <input type='checkbox' id='isHover' name='isHover'> Hovers?</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedClimb'><th><label for='SpeedClimb'>Base Climbming Speed:</label></th><td><input type='number' id='SpeedClimb' name='SpeedClimb' min='0' width='25px'></td></tr>"]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(tempAttribute,AttributeList): monsterCreationHTML = monsterCreationHTML + "<tr id='rowAttribute"+json.get(tempAttribute,"Name")+"'><th><label for='Attribute"+json.get(tempAttribute,"Name")+"'>"+json.get(tempAttribute,"DisplayName")+":</label></th><td><input type='number' id='Attribute"+json.get(tempAttribute,"Name")+"' name='Attribute"+json.get(tempAttribute,"Name")+"' min='1' width='25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowProficiency'><th><label for='Proficiency'>Proficiency Bonus:</label></th><td><input type='number' id='Proficiency' name='Proficiency' min='1' width='25px' value='2'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCR'><th><label for='CR'>CR:</label></th><td><input type='number' id='CR' name='CR' min='0' width='25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowXR'><th><label for='XR'>XR:</label></th><td><input type='number' id='XR' name='XR' min='0' width='25px'></td></tr>"]

[h:html.dialog5("Monster Creation","lib://pm.a5e.core/CreateMonster.html?cachelib=false","value="+base64.encode(monsterCreationHTML))]