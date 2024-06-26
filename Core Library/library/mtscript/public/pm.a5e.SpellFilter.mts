[h:SpellFilterData = arg(0)]
[h:InitialSpellList = json.get(SpellFilterData,"List")]
[h,if(InitialSpellList == ""): InitialSpellList = data.getData("addon:","pm.a5e.core","sb.Spells")]
[h:SpellFilter = json.get(SpellFilterData,"Filter")]

[h:ClassFilter = json.get(SpellFilter,"Class")]
[h:SchoolFilter = json.get(SpellFilter,"School")]
[h:LevelBasedMaxLevel = json.get(SpellFilter,"LevelBasedMaxLevel")]
[h:MaxLevelFilter = json.get(SpellFilter,"MaxLevel")]
[h:MinLevelFilter = json.get(SpellFilter,"MinLevel")]
[h:CastTimeFilter = json.get(SpellFilter,"Time")]
[h:RitualFilter = json.get(SpellFilter,"Ritual")]

[h:NameOverride = json.get(SpellFilter,"Name")]

[h:SpellFilterString = ""]

[h,switch(LevelBasedMaxLevel),CODE:
    case "":{};
    case "All":{[h:LevelBasedMaxLevel = pm.a5e.MaxSpellLevel("All",0)]};
    case "FilterClassesMax":{
        [h:LevelBasedMaxLevel = 0]
        [h,if(json.type(ClassFilter)=="UNKNOWN"): tempClassFilter = json.append("",ClassFilter)]
        [h,foreach(tempClass,tempClassFilter): LevelBasedMaxLevel = max(LevelBasedMaxLevel,pm.a5e.MaxSpellLevel(tempClass,1))]
    };
    default:{[h:LevelBasedMaxLevel = pm.a5e.MaxSpellLevel(LevelBasedMaxLevel,1)]}
]

[h,switch(json.type(ClassFilter)),CODE:
    case "ARRAY":{
        [h:SpellFilterString = listAppend(SpellFilterString,"@.ClassesWithSpell.*.Class in "+ClassFilter," && ")]
    };
    case "UNKNOWN":{
        [h,if(ClassFilter != ""): SpellFilterString = listAppend(SpellFilterString,"@.ClassesWithSpell.*.Class == '"+ClassFilter+"'"," && ")]
    };
    default:{}
]

[h,switch(json.type(SchoolFilter)),CODE:
    case "ARRAY":{
        [h:SpellFilterString = listAppend(SpellFilterString,"@.School in "+SchoolFilter," && ")]
    };
    case "UNKNOWN":{
        [h,if(SchoolFilter != ""): SpellFilterString = listAppend(SpellFilterString,"@.School == '"+SchoolFilter+"'"," && ")]
    };
    default:{}
]

[h,if(LevelBasedMaxLevel == ""): LevelBasedMaxLevel = 9]
[h,if(MaxLevelFilter==""),CODE:{
    [h:MaxSpellLevel = LevelBasedMaxLevel]
};{
    [h:MaxSpellLevel = min(MaxLevelFilter,LevelBasedMaxLevel)]
}]
[h:SpellFilterString = listAppend(SpellFilterString,"@.Level <= "+MaxSpellLevel," && ")]


[h,if(MinLevelFilter==""),CODE:{
    [h:MinSpellLevel = 0]
};{
    [h:MinSpellLevel = MinLevelFilter]
    [h:SpellFilterString = listAppend(SpellFilterString,"@.Level >= "+MinSpellLevel," && ")]
}]

[h:"<!-- TODO: Enable ability to make something like casting time less than 10 minutes, or specific time values (only value 1 currently) - possible solution, filter string being two statements. One, make an array of units smaller than the one given; if units of spell are in the array it's less (reverse for greater). Two, if units are the same then compare the value greater than or less than. -->"]
[h,switch(json.type(CastTimeFilter)),CODE:
    case "ARRAY":{
        [h:SpellFilterString = listAppend(SpellFilterString,"@.Effects.*.CastTime.Units in "+CastTimeFilter," && ")]
    };
    case "UNKNOWN":{
        [h,if(CastTimeFilter != ""): SpellFilterString = listAppend(SpellFilterString,"@.Effects.*.CastTime.Units == '"+CastTimeFilter+"'"," && ")]
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

[h:FinalFilterDescription = pm.a5e.SpellFilterDisplay(SpellFilter)]
[h:FinalSpellInfo = json.path.read(InitialSpellList,"[*][?("+SpellFilterString+")]")]
[h:FinalSpellList = json.sort(json.unique(json.path.read(FinalSpellInfo,"[*]['DisplayName']")))]

[h:ReturnData = json.set("","SpellList",FinalSpellList,"SpellInfo",FinalSpellInfo,"Description",FinalFilterDescription)]

[h:return(0,ReturnData)]