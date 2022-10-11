[h:subeffectData = macro.args]
[h:totalSubeffects = json.get(subeffectData,"Total")]
[h:thisSubeffectNum = json.get(subeffectData,"WhichEffect")]
[h:spellLevel = json.get(subeffectData,"SpellLevel")]

[h,if(totalSubeffects==1): spellSubeffectHTML = ""; spellSubeffectHTML = "<tr><th text-align='center' colspan='2'>Subeffect #"+thisSubeffectNum+"</th></tr>"]

[h:"<!-- May want to send the subeffect number as an argument in some onchange functions -->"]

[h:spellSubeffectHTML = spellSubeffectHTML + "<input type='hidden' id='SpellLevel' name='SpellLevel' value="+spellLevel+"><input type='hidden' id='whichEffect' name='whichEffect' value="+thisSubeffectNum+">

<tr id='Mitigation'><th><label for='howMitigate'>Make Attack or Force Save?</label></th><td><select id='howMitigate' name='howMitigate' onchange='createMitigationTable()'><option value='Attack'>Make Attack</option><option value='Save'>Force Save</option><option value='Neither' selected>Neither</option></select></td></tr>

<tr id='Damage'><th><label for='isDamage'>Heals or Deals Damage?</label></th><td><input type='checkbox' id='isDamage' name='isDamage' value=1 onchange='createDamageTable()'><input type='hidden' id='differentTypes' name='differentTypes' value=0></td></tr>

<tr id='rowCondition'><th><label for='isCondition'>Sets Conditions on Target:</label></th><td><select id='isCondition' name='isCondition' value=1 onchange='createConditionTable()'><option value='None'>None</option><option value='All'>All Selected</option><option value='Choose'>Choose Among Selected</option><option value='Mixture'>Mixture of Both</option></select></td></tr>

<tr id='rowSummons'><th><label for='isSummons'>Summons a Creature?</label></th><td><select id='isSummons' name='isSummons' onchange='createSummonTable()'><option value='No'>No</option><option value='SpellEffect'>Non-Creature Spell Effect</option><option value='Single'>Single Specific Creature</option><option value='Options'>Creature from List</option><option value='Criteria'>Creature Based on Criteria</option></select></td></tr>

<tr id='rowIsMoveTarget'><th><label for='isMoveTarget'>Moves the Target?</label></th><td><input type='checkbox' id='isMoveTarget' name='isMoveTarget' value=1 onchange='createMoveTargetTable()'></td></tr>

<tr id='rowIsCreateObject'><th><label for='isCreateObject'>Creates an Object?</label></th><td><input type='checkbox' id='isCreateObject' name='isCreateObject' value=1 onchange='createCreateObjectTable()'></td></tr>

<tr id='rowLightType'><th><label for='lightType'>Creates a Light or Darkness?</label></th><td><select id='lightType' name='lightType' onchange='createLightTable()'><option value='None'>No Light</option><option value='Dim'>Dim Light</option><option value='Bright'>Bright Light</option><option value='BrightDim'>Bright + Dim Light</option><option value='Darkness'>Darkness</option><option value='Obscure'>Heavily Obscure</option></select></td></tr>

<tr id='rowIsWeaponAttack'><th><label for='isWeaponAttack'>Makes a Weapon Attack?</label></th><td><input type='checkbox' id='isWeaponAttack' name='isWeaponAttack' value=1 onchange='createWeaponAttackTable()'></td></tr>

<tr id='Missiles'><th><label for='isMissiles'>Is it a Missile Spell?</label></th><td><input type='checkbox' id='isMissiles' name='isMissiles' value=1></td></tr>

<tr id='Range'><th><label for='RangeType'>Range Type:</label></th><td><select id='RangeType' name='RangeType' onchange='createRangeTable()'><option value='Self'>Self</option><option value='SelfRanged'>Self with Range</option><option value='Touch'>Touch</option><option value='Ranged'>Ranged</option>"+if(thisSubeffectNum>1,"<option value='PriorTarget'>Based on Prior Subeffect</option>","")+"</td></tr>

<tr id='AoE'><th><label for='aoeShape'>Area of Effect Shape:</label></th><td><select id='aoeShape' name='aoeShape' onchange='createAoETable(1)'><option value='None'>None</option><option value='Cone'>Cone</option><option value='Cube'>Cube</option><option value='Cylinder'>Cylinder</option><option value='Half Sphere'>Half Sphere</option><option value='Line'>Line</option><option value='Panels'>Panels</option><option value='Sphere'>Sphere</option><option value='Wall'>Wall</option><option value='Choose'>Multiple Options</option></td></tr>

<tr id='rowTargetNumber'><th><label for='targetNumber'>Maximum Number of Targets:</label></th><td><input type='number' id='targetNumber' name='targetNumber' value=1 min=1 style='width:25px'><input type='checkbox' id='targetNumberUnlimited' name='targetNumberUnlimited' value=1 onchange='createTargetNumberToggle()'>Unlimited</td></tr>

<tr id='rowTargetNumberAHL'><th><label for='targetNumberAHL'>Increased Target Number AHL:</label></th><td><input type='number' id='targetNumberAHL' name='targetNumberAHL' value=0 min=0 style='width:25px'><select id='targetNumberAHLScaling' name='targetNumberAHLScaling'><option value='0'>No Increase</option><option value='1'>Every Level</option><option value='2'>Every Other Level</option><option value='3'>Every Three Levels</option></select></td></tr>

<tr id='rowMultitargetMaxDistance'><th><label for='multitargetMaxDistance'>Maximum Distance Between Targets:</label></th><td><input type='number' id='multitargetMaxDistance' name='multitargetMaxDistance' value=5 min=0 style='width:25px'><input type='checkbox' id='multitargetMaxDistanceUnlimited' name='multitargetMaxDistanceUnlimited' value=1>Same as Spell Range</td></tr>

<tr id='rowIsSight'><th><label for='isSight'>Requires Sight on Target:</label></th><td style='text-align:center'><input type='checkbox' id='isSight' name='isSight' value=1></td></tr>

<tr id='Target'><th><label for='targetType'>Target Type:</label></th><td><select id='targetType' name='targetType' onchange='createTargetTable(1)'><option value='AnyCreature'>Any Creature</option><option value='AlliedCreature'>Allied Creature</option><option value='SelfOnly'>Self Only</option><option value='EnemyCreature'>Enemy Creature</option><option value='HumanoidCreature'>Humanoid Creature</option><option value='Creature'>Creature (Custom Limits)</option><option value='Object'>Object</option><option value='Creature or Object'>Creature or Object</option><option value='Point'>Point</option><option value='Effect'>Effect</option><option value='Free Hand'>Free Hand</option></td></tr><tr id='submitRow'><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("Spell Creation","lib://pm.a5e.core/CreateSpellSubeffect.html?cachelib=false","value="+base64.encode(spellSubeffectHTML))]