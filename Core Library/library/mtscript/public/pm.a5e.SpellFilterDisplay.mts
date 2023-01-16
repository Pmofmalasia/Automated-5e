[h:"<!-- TODO: Fix Create Feature Core reference to this macro -->"]
[h:SpellFilterParameters = arg(0)]
[h:ClassFilter = json.get(SpellFilterParameters,"Class")]
[h:SchoolFilter = json.get(SpellFilterParameters,"School")]
[h:LevelBasedMaxLevel = json.get(SpellFilterParameters,"LevelBasedMax")]
[h:MaxLevelFilter = json.get(SpellFilterParameters,"MaxLevel")]
[h:MinLevelFilter = json.get(SpellFilterParameters,"MinLevel")]
[h:CastTimeFilter = json.get(SpellFilterParameters,"Time")]
[h:RitualFilter = json.get(SpellFilterParameters,"Ritual")]

[h:ClassFilterDescription = ""]
[h,switch(json.type(ClassFilter)),CODE:
    case "ARRAY":{
        [h:ClassDisplayNames = ""]
        [h,foreach(tempClass,ClassFilter): ClassDisplayNames = json.append(ClassDisplayNames,pm.GetDisplayName(tempClass,"sb.Classes"))]
        [h:ClassFilterDescription = pm.a5e.CreateDisplayList(ClassDisplayNames,"or")]
    };
    case "UNKNOWN":{
        [h,if(ClassFilter!=""): ClassFilterDescription = pm.GetDisplayName(ClassFilter,"sb.Classes")]
    };
    default:{}
]

[h:SchoolFilterDescription = ""]
[h,switch(json.type(SchoolFilter)),CODE:
    case "ARRAY":{
        [h:SchoolDisplayNames = ""]
        [h,foreach(tempSchool,SchoolFilter): SchoolDisplayNames = json.append(SchoolDisplayNames,pm.GetDisplayName(tempSchool,"sb.SpellSchools"))]
        [h:SchoolFilterDescription = pm.a5e.CreateDisplayList(SchoolDisplayNames,"or")]
    };
    case "UNKNOWN":{
        [h,if(SchoolFilter!=""): SchoolFilterDescription = pm.GetDisplayName(SchoolFilter,"sb.SpellSchools")]
    };
    default:{}
]

[h,if(LevelBasedMaxLevel == ""): LevelBasedMaxLevel = 9]
[h,if(MinLevelFilter==""): MinSpellLevel = 0; MinSpellLevel = MinLevelFilter]
[h,if(MaxLevelFilter==""): MaxSpellLevel = LevelBasedMaxLevel; MaxSpellLevel = min(MaxLevelFilter,LevelBasedMaxLevel)]

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
    [h,if(MinSpellLevel != 1 && MaxSpellLevel != LevelBasedMaxLevel && MaxSpellLevel != MinSpellLevel),CODE:{
        [h:LevelFilterDescriptionPreClass = "Level "+MinSpellLevel+" - "+MaxSpellLevel+" "]
        [h:LevelFilterDescription = "Spell"]
    };{}]
}]

[h:"<!-- TODO: Enable ability to make something like casting time less than 10 minutes, or specific time values (only value 1 currently) -->"]
[h:CastTimeFilterDescription = ""]
[h,switch(json.type(CastTimeFilter)),CODE:
    case "ARRAY":{
        [h:CastTimeFilterDescription = " with casting time of 1 "+pm.a5e.CreateDisplayList(CastTimeFilter,"or")]
    };
    case "UNKNOWN":{
        [h,if(CastTimeFilter!=""): CastTimeFilterDescription = " with casting time of 1 "+CastTimeFilter]
    };
    default:{}
]

[h,switch(RitualFilter):
    case 0: RitualFilterDescription = "Non-Ritual";
    case 1: RitualFilterDescription = "Ritual";
    default: RitualFilterDescription = ""
]

[h:FinalFilterDescription = LevelFilterDescriptionPreClass + if(LevelFilterDescriptionPreClass!=""," ","") + ClassFilterDescription + if(ClassFilterDescription!=""," ","") + SchoolFilterDescription + if(SchoolFilterDescription!=""," ","") + RitualFilterDescription + if(RitualFilterDescription!=""," ","") + LevelFilterDescription + CastTimeFilterDescription]

[h:macro.return = FinalFilterDescription]