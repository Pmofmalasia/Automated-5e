[h:monsterCreationHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+currentToken()+"'><tr id='rowMonsterName'><th><label for='DisplayName'>Creature Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSize'><th><label for='Size'>Size:</label></th><td><select id='Size' name='Size'><option value='Tiny'>Tiny</option><option value='Small'>Small</option><option value='Medium' selected>Medium</option><option value='Large'>Large</option><option value='Huge'>Huge</option><option value='Gargantuan'>Gargantuan</option></td></tr>"]

[h:creatureTypeArray = pm.GetCreatureTypes()]
[h:creatureTypeOptions = ""]
[h,foreach(tempType,creatureTypeArray): creatureTypeOptions = creatureTypeOptions + "<option value='"+json.get(tempType,"Name")+"'>"+json.get(tempType,"DisplayName")+"</option>"]
[h:creatureTypeOptions = creatureTypeOptions + "<option value='Multiple'>Multiple</option>"]
[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCreatureType'><th><label for='CreatureType'>Creature Type:</label></th><td><select id='CreatureType' name='CreatureType' onchange='creatureTypeSelectionChanges()'>"+creatureTypeOptions+"</select></td></tr>"]

[h:firstCreatureType = json.get(creatureTypeArray,0)]
[h:PCRaces = pm.GetRaces()]
[h:matchingRaces = json.path.read(PCRaces,"[*][?(@.CreatureType=='"+firstCreatureType+"')]['DisplayName']")]
[h:CreatureSubtypes = pm.a5e.GetCreatureSubtypes()]
[h:matchingSubtypes = json.path.read(CreatureSubtypes,"[*][?(@.CreatureType=='"+firstCreatureType+"')]['DisplayName']")]
[h:allSubtypes = json.unique(json.merge(matchingRaces,matchingSubtypes))]
[h:creatureSubtypeOptions = ""]
[h,foreach(tempSubtype,allSubtypes): creatureSubtypeOptions = creatureSubtypeOptions + "<option value='"+pm.RemoveSpecial(tempSubtype)+"'>"+tempSubtype+"</option>"]
[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCreatureSubtype'><th><label for='CreatureSubtype'>Creature Subtype/Race:</label></th><td><select id='CreatureSubtype' name='CreatureSubtype'><option value=''>None</option>"+creatureSubtypeOptions+"</select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowAlignment'><th><label for='Alignment'>Alignment:</label></th><td>
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

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowIsNaturalArmor'><th><label for='isNaturalArmor'>Has Natural Armor:</label></th><td><input type='checkbox' id='isNaturalArmor' name='isNaturalArmor' onchange='createArmorChoiceRows()' checked></td></tr>"]
[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowAC'><th><label for='AC'>AC:</label></th><td><input type='number' id='AC' name='AC' min='1' style='width:25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowMaxHP'><th><label for='MaxHP'>Maximum HP:</label></th><td><input type='number' id='MaxHP' name='MaxHP' min='1' style='width:40px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowHitDie'><th><label for='HitDieNum'>Total Hit Dice:</label></th><td><input type='number' id='HitDieNum' name='HitDieNum' min='1' style='width:25px'> d <input type='number' id='HitDieSize' name='HitDieSize' min='1' style='width:25px'> + <input type='number' id='HitDieBonus' name='HitDieBonus' min='0' style='width:25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedWalking'><th><label for='SpeedWalking'>Walking Speed:</label></th><td><input type='number' id='SpeedWalking' name='SpeedWalking' min='0' style='width:25px' value='30'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedBurrow'><th><label for='SpeedBurrow'>Burrowing Speed:</label></th><td><input type='number' id='SpeedBurrow' name='SpeedBurrow' min='0' style='width:25px' value='0'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedClimb'><th><label for='SpeedClimb'>Climbing Speed:</label></th><td><input type='number' id='SpeedClimb' name='SpeedClimb' min='0' style='width:25px' value='0'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedFly'><th><label for='SpeedFly'>Flying Speed:</label></th><td><input type='number' id='SpeedFly' name='SpeedFly' min='0' style='width:25px' value='0'> <input type='checkbox' id='isHover' name='isHover'>Hovers?</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpeedSwim'><th><label for='SpeedSwim'>Swimming Speed:</label></th><td><input type='number' id='SpeedSwim' name='SpeedSwim' min='0' style='width:25px' value='0'></td></tr>"]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(tempAttribute,AttributeList): monsterCreationHTML = monsterCreationHTML + "<tr id='rowAttribute"+json.get(tempAttribute,"Name")+"'><th><label for='Attribute"+json.get(tempAttribute,"Name")+"'>"+json.get(tempAttribute,"DisplayName")+" Score:</label></th><td><input type='number' id='Attribute"+json.get(tempAttribute,"Name")+"' name='Attribute"+json.get(tempAttribute,"Name")+"' min='1' style='width:25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowIsVulnerability'><th><label for='IsVulnerability'>Has Vulnerabilities:</label></th><td><input type='checkbox' id='IsVulnerability' name='IsVulnerability' onchange='createDamageTypeRows("+'"Vulnerability"'+")'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowIsResistance'><th><label for='IsResistance'>Has Resistances:</label></th><td><input type='checkbox' id='IsResistance' name='IsResistance' onchange='createDamageTypeRows("+'"Resistance"'+")'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowIsImmunity'><th><label for='IsImmunity'>Has Immunities:</label></th><td><input type='checkbox' id='IsImmunity' name='IsImmunity' onchange='createDamageTypeRows("+'"Immunity"'+")'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowIsConditionImmun'><th><label for='IsConditionImmun'>Has Condition Immunities:</label></th><td><input type='checkbox' id='IsConditionImmun' name='IsConditionImmun' onchange='createConditionRows()'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowHasSight'><th><label for='HasSight'>Has Basic Sight:</label></th><td><input type='checkbox' id='HasSight' name='HasSight' checked></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowDarkvision'><th><label for='Darkvision'>Darkvision Distance:</label></th><td><input type='number' id='Darkvision' name='Darkvision' min='0' style='width:25px' value='0'> feet</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowBlindsight'><th><label for='Blindsight'>Blindsight Distance:</label></th><td><input type='number' id='Blindsight' name='Blindsight' min='0' style='width:25px' value='0'> feet</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowTremorsense'><th><label for='Tremorsense'>Tremorsense Distance:</label></th><td><input type='number' id='Tremorsense' name='Tremorsense' min='0' style='width:25px' value='0'> feet</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowTruesight'><th><label for='Truesight'>Truesight Distance:</label></th><td><input type='number' id='Truesight' name='Truesight' min='0' style='width:25px' value='0'> feet</td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowProficiency'><th><label for='Proficiency'>Proficiency Bonus:</label></th><td><input type='number' id='Proficiency' name='Proficiency' min='1' style='width:25px' value='2'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowCR'><th><label for='CR'>CR:</label></th><td><input type='text' id='CR' name='CR' style='width:25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowXP'><th><label for='XP'>XP:</label></th><td><input type='number' id='XP' name='XP' min='0' style='width:25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Monster Creation","lib://pm.a5e.core/MonsterCreation.html?cachelib=false","value="+base64.encode(monsterCreationHTML)+"; closebutton=0; width=400; height=1050")]