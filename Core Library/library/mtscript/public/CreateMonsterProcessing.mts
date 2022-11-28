[h:MonsterData = macro.args]
[h:MonsterData = pm.a5e.KeyStringsToNumbers(MonsterData)]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:switchToken(ParentToken)]
[h:closeDialog("Monster Creation")]

[h:setName(json.get(MonsterData,"DisplayName"))]
[h:setProperty("CreatureType",json.get(MonsterData,"CreatureType"))]
[h:setProperty("Race",json.get(MonsterData,"CreatureSubtype"))]
[h:setProperty("stat.Size",json.get(MonsterData,"Size"))]
[h:setSize(json.get(MonsterData,"Size"))]

[h,switch(json.get(MonsterData,"Alignment")),CODE:
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
[h:setProperty("Alignment",json.set("","Order",alignmentOrder,"Morality",alignmentMorality))]

[h:"<!-- TODO: AC/HP/Speed stuff here -->"]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(TempAttribute,AttributeList): setProperty("baseAttributes",json.set(getProperty("baseAttributes"),json.get(TempAttribute,"Name"),json.get(MonsterData,"Attribute"+json.get(TempAttribute,"Name"))))]