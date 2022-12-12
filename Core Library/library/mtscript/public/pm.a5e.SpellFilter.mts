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
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.ClassesWithSpell.*.Class in "+ClassFilter+")]")]
        [h:ClassDisplayNames = ""]
        [h,foreach(tempClass,ClassFilter): ClassDisplayNames = json.append(ClassDisplayNames,pm.GetDisplayName(tempClass,"sb.Class"))]
        [h:ClassFilterDescription = pm.a5e.CreateDisplayList(ClassDisplayNames,"or")]
    };
    case "UNKNOWN":{
        [h,if(ClassFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.ClassesWithSpell.*.Class == '"+ClassFilter+"')]")]
        [h:ClassFilterDescription = pm.GetDisplayName(ClassFilter,"sb.Class")]
    };
    default:{[h:ClassFilterDescription = ""]}
]
[h:return(!json.isEmpty(FinalSpellList),json.set("","SpellList","[]","Description",""))]

[h,switch(json.type(SchoolFilter)),CODE:
    case "Array":{
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.School in "+SchoolFilter+")]")]
        [h:SchoolDisplayNames = ""]
        [h,foreach(tempSchool,SchoolFilter): SchoolDisplayNames = json.append(SchoolDisplayNames,pm.GetDisplayName(tempSchool,"sb.SpellSchools"))]
        [h:SchoolFilterDescription = pm.a5e.CreateDisplayList(SchoolDisplayNames,"or")]
    };
    case "UNKNOWN":{
        [h,if(SchoolFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.School == '"+SchoolFilter+"')]")]
        [h:SchoolFilterDescription = pm.GetDisplayName(SchoolFilter,"sb.SpellSchools")]
    };
    default:{[h:SchoolFilterDescription = ""]}
]
[h:return(!json.isEmpty(FinalSpellList),json.set("","SpellList","[]","Description",""))]

[h,if(LevelMaxFilter==""),CODE:{
    [h:MaxSpellLevel = 9]
};{
    [h:MaxSpellLevel = LevelMaxFilter]
    [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.Level <= "+MaxSpellLevel+")]")]
}] 
[h:return(!json.isEmpty(FinalSpellList),json.set("","SpellList","[]","Description",""))]

[h,if(LevelMinFilter==""),CODE:{
    [h:MinSpellLevel = 0]
};{
    [h:MinSpellLevel = LevelMinFilter]
    [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.Level >= "+MinSpellLevel+")]")]
}]
[h:return(!json.isEmpty(FinalSpellList),json.set("","SpellList","[]","Description",""))]

[h:LevelFilterDescription = "Spell"]
[h:LevelFilterDescriptionPreClass = ""]
[h,if(MaxSpellLevel == MinSpellLevel),CODE:{
    [h:LevelFilterDescriptionPreClass = "Level "+MaxSpellLevel+" "]
    [h:LevelFilterDescription = "Spell"]
};{}] 
[h,if(MaxSpellLevel == 0),CODE:{
    [h:LevelFilterDescriptionPreClass = ""]
    [h:LevelFilterDescription = "Cantrip"]
};{
    [h,if(MinSpellLevel != 1 && MaxSpellLevel != 9),CODE:{
        [h:LevelFilterDescriptionPreClass = "Level "+MinSpellLevel+" - "+MaxSpellLevel+" "]
        [h:LevelFilterDescription = "Spell"]
    };{}]
}]

[h:"<!-- TODO: Enable ability to make something like casting time less than 10 minutes, or specific time values (only value 1 currently) -->"]
[h,switch(json.type(CastTimeFilter)),CODE:
    case "Array":{
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.*.CastTime.Units in "+CastTimeFilter+")]")]
        [h:CastTimeFilterDescription = " with casting time of 1 "+pm.a5e.CreateDisplayList(CastTimeFilter,"or")]
    };
    case "UNKNOWN":{
        [h,if(CastTimeFilter!=""): FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.*.CastTime.Units == '"+CastTimeFilter+"')]")]
        [h:CastTimeFilterDescription = " with casting time of 1 "+CastTimeFilter]
    };
    default:{}
]
[h:return(!json.isEmpty(FinalSpellList),json.set("","SpellList","[]","Description",""))]

[h,switch(RitualFilter),CODE:
    case 0:{
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.isRitual == null || @.isRitual == 0)]","DEFAULT_PATH_LEAF_TO_NULL")]
        [h:RitualFilterDescription = "Non-Ritual"]
    };
    case 1:{
        [h:FinalSpellList = json.path.read(FinalSpellList,"[*][?(@.isRitual == 1)]")]
        [h:RitualFilterDescription = "Ritual"]
    };
    default:{[h:RitualFilterDescription = ""]}
]

[h:FinalFilterDescription = LevelFilterDescriptionPreClass + if(LevelFilterDescriptionPreClass!=""," ","") + ClassFilterDescription + if(ClassFilterDescription!=""," ","") + RitualFilterDescription + if(RitualFilterDescription!=""," ","") + LevelFilterDescription + CastTimeFilter]

[h:ReturnData = json.set("","SpellList",FinalSpellList,"Description",FinalFilterDescription)]

[h:return(0,ReturnData)]