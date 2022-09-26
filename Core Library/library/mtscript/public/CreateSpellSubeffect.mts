[h:subeffectData = macro.args]
[h:totalSubeffects = json.get(subeffectData,"Total")]
[h:thisSubeffectNum = json.get(subeffectData,"WhichEffect")]

[h,if(totalSubeffects==1): spellSubeffectHTML = ""; spellSubeffectHTML = "<tr><th text-align='center' colspan='2'>Subeffect #"+thisSubeffectNum+"</th></tr>"]

[h:"<!-- May want to send the subeffect number as an argument in some onchange functions -->"]

[h:spellSubeffectHTML = spellSubeffectHTML + "<tr id='Mitigation'><th><label for='howMitigate'>Forces Attack, Save, or Neither?</label></th><td><select id='howMitigate' name='howMitigate' onchange='createMitigationTable()'><option value='Attack'>Attack</option><option value='Save'>Save</option><option value='Neither' selected>Neither</option></select></td></tr>

<tr id='Damage'><th><label for='isDamage'>Heals or Deals Damage?</label></th><td><input type='checkbox' id='isDamage' name='isDamage' value=1 onchange='createDamageTable()'><input type='hidden' id='differentTypes' name='differentTypes' value=0></td></tr>

<tr id='Missiles'><th><label for='isMissiles'>Is it a Missile Spell?</label></th><td><input type='checkbox' id='isMissiles' name='isMissiles' value=1></td></tr>

<tr id='Range'><th><label for='rangeType'>Range Type:</label></th><td><select id='rangeType' name='rangeType' onchange='createRangeTable()'><option value='Self'>Self</option><option value='SelfRanged'>Self with Range</option><option value='Touch'>Touch</option><option value='Ranged'>Ranged</option></td></tr>

<tr id='AoE'><th><label for='aoeShape'>Area of Effect Shape:</label></th><td><select id='aoeShape' name='aoeShape' onchange='createAoETable()'><option value='None'>None</option><option value='Cone'>Cone</option><option value='Cube'>Cube</option><option value='Cylinder'>Cylinder</option><option value='Half Sphere'>Half Sphere</option><option value='Line'>Line</option><option value='Panels'>Panels</option><option value='Sphere'>Sphere</option><option value='Wall'>Wall</option><option value='Choose'>Multiple Options</option></td></tr>

<tr id='Target'><th><label for='targetType'>Target Type:</label></th><td><select id='targetType' name='targetType'><option value='Creature'>Creature</option><option value='Object'>Object</option><option value='Creature or Object'>Creature or Object</option><option value='Point'>Point</option><option value='Effect'>Effect</option><option value='Free Hand'>Free Hand</option></td></tr>"]

[h:html.dialog5("Spell Creation","lib://pm.a5e.core/CreateSpellSubeffect.html?cachelib=false","value="+base64.encode(spellSubeffectHTML))]