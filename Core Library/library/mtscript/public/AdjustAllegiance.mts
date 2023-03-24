[h:AllegianceOptions = json.append("","PC","Ally","Neutral","Enemy")]

[h:abort(input(
    " junkVar | ----------------------------- Adjust Team Info ----------------------------- |  | LABEL | SPAN=TRUE ",
    " AllegianceChoice | "+AllegianceOptions+" | Allegiance to Party | LIST | VALUE=STRING DELIMITER=JSON SELECT="+max(0,json.indexOf(AllegianceOptions,getProperty("a5e.stat.Allegiance"))),
    " TeamChoice | "+getProperty("a5e.stat.whichTeam")+" | Which Team is This Creature On "
))]

[h:setProperty("a5e.stat.Allegiance",AllegianceChoice)]
[h:setProperty("a5e.stat.whichTeam",TeamChoice)]