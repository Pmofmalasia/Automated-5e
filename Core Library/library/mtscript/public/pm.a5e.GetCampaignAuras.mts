[h:"<!-- Note: This macro was going to be used for gathering all aura names to be used in getTokens, but getTokens can only take one name at a time (not arrays). Leaving this here for posterity in case it's useful later. -->"]

[h:allLights = json.get(getInfo("campaign"),"light sources")]
[h:allAuraNames = json.path.read(allLights,"*.[*][?(@.type == 'AURA')]['name']")]
[h:macro.return = allAuraNames]