[h:SpellFilterData = arg(0)]
[h:InitialSpellList = json.get(SpellFilterData,"List")]
[h,if(InitialSpellList == ""): InitialSpellList = getLibProperty("sb.Spells","Lib:pm.a5e.Core")]
[h:SpellFilterParameters = json.get(SpellFilterData,"Parameters")]

[h:ClassFilter = json.get(SpellFilterParameters,"Class")]
[h:SchoolFilter = json.get(SpellFilterParameters,"School")]
[h:LevelBasedLevelMax = json.get(SpellFilterParameters,"LevelBasedLevelMax")]
[h:LevelMaxFilter = json.get(SpellFilterParameters,"LevelMax")]
[h:LevelMinFilter = json.get(SpellFilterParameters,"LevelMin")]
[h:CastTimeFilter = json.get(SpellFilterParameters,"Time")]
[h:RitualFilter = json.get(SpellFilterParameters,"Ritual")]

[h:SpellFilterString = ""]

[h,switch(json.type(ClassFilter)),CODE:
    case "Array":{
        [h:SpellFilterString = listAppend(SpellFilterString,"@.ClassesWithSpell.*.Class in "+ClassFilter," && ")]
    };
    case "UNKNOWN":{
        [h,if(ClassFilter != ""): SpellFilterString = listAppend(SpellFilterString,"@.ClassesWithSpell.*.Class == '"+ClassFilter+"'"," && ")]
    };
    default:{}
]

[h,switch(json.type(SchoolFilter)),CODE:
    case "Array":{
        [h:SpellFilterString = listAppend(SpellFilterString,"@.School in "+SchoolFilter," && ")]
    };
    case "UNKNOWN":{
        [h,if(SchoolFilter != ""): SpellFilterString = listAppend(SpellFilterString,"@.School == '"+SchoolFilter+"'"," && ")]
    };
    default:{}
]

[h,if(LevelBasedLevelMax == ""): LevelBasedLevelMax = 9]
[h,if(LevelMaxFilter==""),CODE:{
    [h:MaxSpellLevel = LevelBasedLevelMax]
};{
    [h:MaxSpellLevel = min(LevelMaxFilter,LevelBasedLevelMax)]
    [h:SpellFilterString = listAppend(SpellFilterString,"@.Level <= "+MaxSpellLevel," && ")]
}]

[h,if(LevelMinFilter==""),CODE:{
    [h:MinSpellLevel = 0]
};{
    [h:MinSpellLevel = LevelMinFilter]
    [h:SpellFilterString = listAppend(SpellFilterString,"@.Level >= "+MinSpellLevel," && ")]
}]

[h:"<!-- TODO: Enable ability to make something like casting time less than 10 minutes, or specific time values (only value 1 currently) -->"]
[h,switch(json.type(CastTimeFilter)),CODE:
    case "Array":{
        [h:SpellFilterString = listAppend(SpellFilterString,"@.*.CastTime.Units in "+CastTimeFilter," && ")]
    };
    case "UNKNOWN":{
        [h,if(CastTimeFilter != ""): SpellFilterString = listAppend(SpellFilterString,"@.*.CastTime.Units == '"+CastTimeFilter+"'"," && ")]
    };
    default:{}
]

[h,switch(RitualFilter),CODE:
    case 0:{
        [h:SpellFilterString = listAppend(SpellFilterString,"(@.isRitual == null || @.isRitual == 0)"," && ")]
    };
    case 1:{
        [h:SpellFilterString = listAppend(SpellFilterString,"@.isRitual == 1"," && ")]
    };
    default:{}
]

[h:FinalFilterDescription = pm.a5e.SpellFilterDisplay(SpellFilterParameters)]
[h:FinalSpellList = json.path.read(InitialSpellList,"[*][?("+SpellFilterString+")]")]

[h:ReturnData = json.set("","SpellList",FinalSpellList,"Description",FinalFilterDescription)]

[h:return(0,ReturnData)]