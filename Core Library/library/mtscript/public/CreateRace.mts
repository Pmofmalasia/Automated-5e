[h:RaceInputHTML = "<tr><th text-align='center' colspan='2'>Create Race</th></tr>"]

[h:RaceInputHTML = RaceInputHTML + "<tr><th><label for='DisplayName'>Race Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:CreatureTypes = pm.a5e.GetCoreData("sb.CreatureTypes")]
[h:CreatureTypeOptions = ut.a5e.GenerateSelectionHTML(CreatureTypes)]
[h:RaceInputHTML = RaceInputHTML + "<tr><th><label for='CreatureType'>Creature Type:</label></th><td><select id='CreatureType' name='CreatureType'>"+CreatureTypeOptions+"</select></td></tr>"]

[h:OtherRaces = pm.a5e.GetCoreData("sb.Races")]
[h:OtherRaceOptions = ut.a5e.GenerateSelectionHTML(OtherRaces)]
[h:RaceInputHTML = RaceInputHTML + "<tr><th><label for='CountsAs'>Creature Type:</label></th><td><select id='CreatureType' name='CreatureType'>"+CreatureTypeOptions+"</select></td></tr>"]