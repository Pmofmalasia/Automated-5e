[h:newCharData = macro.args]
[h:ParentToken = json.get(macro.args,"activeToken")]
[h:switchToken(ParentToken)]
[h:closeDialog("Character Creation")]

[h:RaceArray = pm.GetRaces()]
[h:RaceSelection = json.get(RaceArray,json.get(newCharData,"raceChoice"))]

[h:setName(json.get(newCharData,"charName"))]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(TempAttribute,AttributeList): setProperty("a5e.stat.BaseAttributes",json.set(getProperty("a5e.stat.BaseAttributes"),json.get(TempAttribute,"Name"),json.get(newCharData,json.get(TempAttribute,"Name")+"Choice")))]

[h:sizeChoice = json.get(newCharData,"sizeChoice")]
[h:setProperty("a5e.stat.Size",sizeChoice)]
[h:setSize(sizeChoice)]

[h:setProperty("a5e.stat.Race",json.get(RaceSelection,"DisplayName"))]
[h:lu.NewAbilities = json.append("",json.set(json.get(RaceSelection,"Traits"),"Size",sizeChoice))]
[h:setProperty("a5e.stat.CreatureType",json.get(RaceSelection,"CreatureType"))]

[h:SubraceArray = pm.GetSubraces(json.get(RaceSelection,"Name"))]
[h,if(json.isEmpty(SubraceArray)),CODE:{
    [h:setProperty("a5e.stat.Subrace","")]
};{
    [h:SubraceSelection = json.get(newCharData,"subraceChoice")]
    [h:chosenSubrace = json.get(SubraceArray,SubraceSelection)]
    [h:lu.NewAbilities = json.append(lu.NewAbilities,json.get(chosenSubrace,"Traits"))]
    [h:setProperty("a5e.stat.Subrace",json.get(chosenSubrace,"DisplayName"))]
}]


[h,switch(json.get(newCharData,"Alignment")),CODE:
    case "Lawful Good":{
        [h:alignmentOrder = "Lawful"]
        [h:alignmentMorality = "Good"]
    };
    case "Lawful Neutral":{
        [h:alignmentOrder = "Lawful"]
        [h:alignmentMorality = "Neutral"]
    };
    case "Lawful Evil":{
        [h:alignmentOrder = "Lawful"]
        [h:alignmentMorality = "Evil"]
    };
    case "Neutral Good":{
        [h:alignmentOrder = "Neutral"]
        [h:alignmentMorality = "Good"]
    };
    case "True Neutral":{
        [h:alignmentOrder = "Neutral"]
        [h:alignmentMorality = "Neutral"]
    };
    case "Neutral Evil":{
        [h:alignmentOrder = "Neutral"]
        [h:alignmentMorality = "Evil"]
    };
    case "Chaotic Good":{
        [h:alignmentOrder = "Chaotic"]
        [h:alignmentMorality = "Good"]
    };
    case "Chaotic Neutral":{
        [h:alignmentOrder = "Chaotic"]
        [h:alignmentMorality = "Neutral"]
    };
    case "Chaotic Evil":{
        [h:alignmentOrder = "Chaotic"]
        [h:alignmentMorality = "Evil"]
    };
    case "Unaligned":{
        [h:alignmentOrder = "Unaligned"]
        [h:alignmentMorality = "Unaligned"]
    }
]
[h:setProperty("a5e.stat.Alignment",json.set("","Order",alignmentOrder,"Morality",alignmentMorality))]
[h:setProperty("a5e.stat.Deity",json.get(newCharData,"deityName"))]

[h:setProperty("stat.Allegiance",json.get(newCharData,"allegianceChoice"))]
[h:setProperty("stat.whichTeam",if(getProperty("stat.Allegiance")=="Enemy",2,if(getProperty("stat.Allegiance")=="Neutral",0,1)))]

[macro("BackgroundSelection@Lib:pm.a5e.Core"): ParentToken]
[h:lu.NewAbilities = json.append(lu.NewAbilities,macro.return)]
[macro("LevelUp@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken,"Abilities",lu.NewAbilities)]