[h:subeffectData = macro.args]
[h:totalSubeffects = json.get(subeffectData,"Total")]
[h:thisSubeffectNum = json.get(subeffectData,"WhichEffect")]

[h,if(totalSubeffects==1): spellSubeffectHTML = ""; spellSubeffectHTML = "<table><tr><th text-align='center' colspan='2'>Subeffect #"+thisSubeffectNum+"</th></tr></table>"]

[h:spellSubeffectHTML = spellSubeffectHTML + "<table id='AttackTable'><tr id='Attack'><th><label for='isAttack'>Spell Attack?</label></th><td><input type='checkbox' id='isAttack' name='isAttack' value=1></td></tr></table>

<table id='SaveTable'><tr id='Save'><th><label for='isSave'>Forces Saving Throw?</label></th><td><input type='checkbox' id='isSave' name='isSave' value=1></td></tr></table>

<table id='DamageTable'><tr id='Damage'><th><label for='isDamage'>Heals or Deals Damage?</label></th><td><input type='checkbox' id='isDamage' name='isDamage' value=1></td></tr></table>

<table id='MissilesTable'><tr id='Missiles'><th><label for='isMissiles'>Is it a Misslie Spell?</label></th><td><input type='checkbox' id='isMissiles' name='isMissiles' value=1></td></tr></table>

<table id='TargetingTable'><tr id='Targeting'><th><label for='rangeType'>Range Type:</label></th><td><select id='rangeType' name='rangeType'><option value='Self'>Self</option><option value='Touch'>Touch</option><option value='Ranged'>Ranged</option></td></tr></table>

<table id='TargetTable'><tr id='Target'><th><label for='targetType'>Target Type:</label></th><td><select id='targetType' name='targetType'><option value='Creature'>Creature</option><option value='Object'>Object</option><option value='Creature or Object'>Creature or Object</option><option value='Point'>Point</option><option value='Effect'>Effect</option><option value='Free Hand'>Free Hand</option></td></tr></table>

<table id='AoETable'><tr id='AoE'><th><label for='aoeShape'>AoE Shape:</label></th><td><select id='aoeShape' name='aoeShape'><option value='None'>None</option><option value='Cone'>Cone</option><option value='Cube'>Cube</option><option value='Cylinder'>Cylinder</option><option value='Half Sphere'>Half Sphere</option><option value='Line'>Line</option><option value='Sphere'>Sphere</option><option value='Wall'>Wall</option><option value='Choose'>Choose From Multiple</option></td></tr></table>"]

[h:html.dialog5("Spell Creation","lib://pm.a5e.core/CreateSpellSubeffect.html?cachelib=false","value="+base64.encode(spellSubeffectHTML))]