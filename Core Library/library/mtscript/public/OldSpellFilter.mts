[h:SpellFilterData = arg(0)]
[h:FinalSpellList = json.get(SpellFilterData,"List")]
[h,if(FinalSpellList == ""): FinalSpellList = getLibProperty("sb.Spells","Lib:pm.a5e.Core")]
[h:SpellFilterParameters = json.get(SpellFilterData,"Parameters")]

[h:ClassFilter = json.get(SpellFilterParameters,"Class")]
[h:SchoolFilter = json.get(SpellFilterParameters,"School")]
[h:LevelMaxFilter = json.get(SpellFilterParameters,"LevelMax")]
[h:LevelMinFilter = json.get(SpellFilterParameters,"LevelMin")]
[h:CastTimeFilter = json.get(SpellFilterParameters,"Time")]
[h:RitualFilter = json.get(SpellFilterParameters,"Ritual")]

[h,switch(json.type(ClassFilter)),CODE:
    case "Array":{
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.ClassesWithSpell.*.Class in "+ClassFilter+")]")]
    };
    case "UNKNOWN":{
        [h,if(ClassFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.ClassesWithSpell.*.Class == '"+ClassFilter+"')]")]
    };
    default:{}
]
[h:return(!json.isEmpty(FinalSpellList),FinalSpellList)]

[h,switch(json.type(SchoolFilter)),CODE:
    case "Array":{
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.School in "+SchoolFilter+")]")]
    };
    case "UNKNOWN":{
        [h,if(SchoolFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.School == '"+SchoolFilter+"')]")]
    };
    default:{}
]
[h:return(!json.isEmpty(FinalSpellList),FinalSpellList)]
[h:broadcast(json.path.read(FinalSpellList,"[*][0]['Level']"))]
[h,if(LevelMaxFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.Level <= '"+LevelMaxFilter+"')]")]
[h:return(!json.isEmpty(FinalSpellList),FinalSpellList)]
[h,if(LevelMinFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.Level >= '"+LevelMinFilter+"')]")]
[h:return(!json.isEmpty(FinalSpellList),FinalSpellList)]

[h,switch(json.type(CastTimeFilter)),CODE:
    case "Array":{
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.*.CastTime.Units in "+CastTimeFilter+")]")]
    };
    case "UNKNOWN":{
        [h,if(CastTimeFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.*.CastTime.Units == '"+CastTimeFilter+"')]")]
    };
    default:{}
]
[h:return(!json.isEmpty(FinalSpellList),FinalSpellList)]

[h,switch(RitualFilter):
    case 0: FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.isRitual == null)]","DEFAULT_PATH_LEAF_TO_NULL");
    case 1: FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.0.isRitual == 1)]");
    default: ""
]

[h:return(0,FinalSpellList)]