[h:newCharData = macro.args]
[h:ParentToken = json.get(macro.args,"activeToken")]
[h:switchToken(ParentToken)]
[h:closeDialog("Character Creation")]

[h:RaceArray = pm.GetRaces()]
[h:RaceSelection = json.get(RaceArray,json.get(newCharData,"raceChoice"))]

[h:setName(json.get(newCharData,"charName"))]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(TempAttribute,AttributeList): setProperty("baseAttributes",json.set(getProperty("baseAttributes"),json.get(TempAttribute,"Name"),json.get(newCharData,json.get(TempAttribute,"Name")+"Choice")))]

[h:setProperty("Race",json.get(RaceSelection,"DisplayName"))]
[h:lu.NewAbilities = json.append("",json.get(RaceSelection,"Traits"))]
[h:setProperty("CreatureType",json.get(RaceSelection,"CreatureType"))]

[h:SubraceArray = pm.GetSubraces(json.get(RaceSelection,"Name"))]
[h,if(json.isEmpty(SubraceArray)),CODE:{
    [h:setProperty("Subrace","")]
};{
    [h:SubraceSelection = json.get(newCharData,"subraceChoice")]
    [h:chosenSubrace = json.get(SubraceArray,SubraceSelection)]
    [h:lu.NewAbilities = json.append(lu.NewAbilities,json.get(chosenSubrace,"Traits"))]
    [h:setProperty("Subrace",json.get(chosenSubrace,"DisplayName"))]
}]

[h:setProperty("stat.Size",json.get(newCharData,"sizeChoice"))]
[h:setSize(json.get(newCharData,"sizeChoice"))]

[h:setProperty("Deity",json.get(newCharData,"deityName"))]
[h:setProperty("Alignment",json.set("","Order",json.get(newCharData,"orderChoice"),"Morality",json.get(newCharData,"moralityChoice")))]

[h:setProperty("stat.Allegiance",json.get(newCharData,"allegianceChoice"))]
[h:setProperty("stat.whichTeam",if(getProperty("stat.Allegiance")=="Enemy",2,if(getProperty("stat.Allegiance")=="Neutral",0,1)))]

[macro("BackgroundSelection@Lib:pm.a5e.Core"): ParentToken]
[h:lu.NewAbilities = json.append(lu.NewAbilities,macro.return)]
[macro("LevelUp@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken,"Abilities",lu.NewAbilities)]