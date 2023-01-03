[h:SpellCoreData = macro.args]
[h:currentSpellData = getLibProperty("ct.NewSpell","pm.a5e.Core")]
[h:thisPlayerCurrentSpellData = json.get(currentSpellData,getPlayerName())]
[h:SpellCoreData = pm.a5e.KeyStringsToNumbers(SpellCoreData)]

[h:SpellCoreData = json.set(SpellCoreData,"DisplayName",pm.EvilChars(json.get(SpellCoreData,"DisplayName")))]
[h:SpellCoreData = json.set(SpellCoreData,"Name",pm.RemoveSpecial(json.get(SpellCoreData,"DisplayName")))]

[h,if(!json.contains(SpellCoreData,"isConcentration")): SpellCoreData = json.set(SpellCoreData,"isConcentration",0)]

[h,switch(json.get(SpellCoreData,"CastTime")),CODE:
    case "Action":{
        [h:castTimeInfo = json.set("","Value",1,"Units","Action")]
    };
    case "Bonus Action":{
        [h:castTimeInfo = json.set("","Value",1,"Units","Bonus Action")]
    };
    case "Reaction":{
        [h:castTimeInfo = json.set("","Value",1,"Units","Reaction")]
    };
    case "1 Minute":{
        [h:castTimeInfo = json.set("","Value",1,"Units","Minute")]
    };
    case "10 Minutes":{
        [h:castTimeInfo = json.set("","Value",10,"Units","Minute")]
    };
    case "1 Hour":{
        [h:castTimeInfo = json.set("","Value",1,"Units","Hour")]
    };
    case "8 Hours":{
        [h:castTimeInfo = json.set("","Value",8,"Units","Hour")]
    };
    case "12 Hours":{
        [h:castTimeInfo = json.set("","Value",12,"Units","Hour")]
    };
    case "24 Hours":{
        [h:castTimeInfo = json.set("","Value",24,"Units","Hour")]
    };
    case "Custom":{
        [h:castTimeInfo = json.set("","Value",json.get(SpellCoreData,"customCastTimeValue"),"Units",json.get(SpellCoreData,"customCastTimeUnits"))]
        [h:SpellCoreData = json.remove(SpellCoreData,"customCastTimeValue")]
        [h:SpellCoreData = json.remove(SpellCoreData,"customCastTimeUnits")]
    };
    default:{
        [h:castTimeInfo = json.set("","Value",json.get(SpellCoreData,"previousCustomCastTimeValue"),"Units",json.get(SpellCoreData,"previousCustomCastTimeUnits"))]
    }
]
[h:SpellCoreData = json.set(SpellCoreData,"CastTime",castTimeInfo)]
[h:SpellCoreData = json.remove(SpellCoreData,"previousCustomCastTimeValue")]
[h:SpellCoreData = json.remove(SpellCoreData,"previousCustomCastTimeUnits")]
[h,if(json.contains(SpellCoreData,"ReactionDescription")): SpellCoreData = json.set(SpellCoreData,"ReactionDescription",base64.encode(json.get(SpellCoreData,"ReactionDescription")))]

[h,if(json.contains(SpellCoreData,"mComp")),CODE:{
    [h,if(json.get(SpellCoreData,"mComponents")==""):
        SpellCoreData = json.remove(SpellCoreData,"mComponents");
        SpellCoreData = json.set(SpellCoreData,"mComponents",base64.encode(json.get(SpellCoreData,"mComponents")))
    ]
    
    [h,if(json.get(SpellCoreData,"mComponentsConsumed")==""):
        SpellCoreData = json.remove(SpellCoreData,"mComponentsConsumed");
        SpellCoreData = json.set(SpellCoreData,"mComponentsConsumed",base64.encode(json.get(SpellCoreData,"mComponentsConsumed")))
    ]
};{}]

[h:durationInfo = "{}"]
[h,switch(json.get(SpellCoreData,"Duration")),CODE:
	case "Instantaneous":{
        
	};
	case "1 Round":{
		[h:durationInfo = json.set("","Value",1,"Units","Round")]
	};
	case "1 Minute":{
		[h:durationInfo = json.set("","Value",1,"Units","Minute")]
	};
	case "10 Minutes":{
		[h:durationInfo = json.set("","Value",10,"Units","Minute")]
	};
	case "1 Hour":{
		[h:durationInfo = json.set("","Value",1,"Units","Hour")]
	};
	case "8 Hours":{
		[h:durationInfo = json.set("","Value",8,"Units","Hour")]
	};
	case "24 Hours":{
		[h:durationInfo = json.set("","Value",24,"Units","Hour")]
	};
	case "10 Days":{
		[h:durationInfo = json.set("","Value",10,"Units","Day")]
	};
	case "Until Dispelled":{
        
	};
	case "Custom":{
        [h:durationInfo = json.set("","Value",json.get(SpellCoreData,"customDurationValue"),"Units",json.get(SpellCoreData,"customDurationUnits"))]
        [h:SpellCoreData = json.remove(SpellCoreData,"customDurationValue")]
        [h:SpellCoreData = json.remove(SpellCoreData,"customDurationUnits")]
	};
	default:{
        [h:durationInfo = json.set("","Value",json.get(SpellCoreData,"previousCustomDurationValue"),"Units",json.get(SpellCoreData,"previousCustomDurationUnits"))]
	}
]
[h:SpellCoreData = json.set(SpellCoreData,"Duration",durationInfo)]
[h:SpellCoreData = json.remove(SpellCoreData,"previousCustomDurationValue")]
[h:SpellCoreData = json.remove(SpellCoreData,"previousCustomDurationUnits")]

[h:AHLDurationCountAmount = if(json.contains(SpellCoreData,"AHLDuration"),10,0)]
[h,count(AHLDurationCountAmount),CODE:{
    [h,if(json.contains(SpellCoreData,"AHLDurationLevel"+roll.count)),CODE:{
        [h:tempAHLDuration = "{}"]
        [h,switch(json.get(SpellCoreData,"AHLDurationLevel"+roll.count)):
            case "Instantaneous": "";
            case "1 Round": tempAHLDuration = json.set("","Value",1,"Units","Round");
            case "1 Minute": tempAHLDuration = json.set("","Value",1,"Units","Minute");
            case "10 Minutes": tempAHLDuration = json.set("","Value",10,"Units","Minute");
            case "1 Hour": tempAHLDuration = json.set("","Value",1,"Units","Hour");
            case "8 Hours": tempAHLDuration = json.set("","Value",8,"Units","Hour");
            case "24 Hours": tempAHLDuration = json.set("","Value",24,"Units","Hour");
            case "10 Days": tempAHLDuration = json.set("","Value",10,"Units","Day");
            case "Until Dispelled": "";
            default tempAHLDuration = durationInfo
        ]

        [h:SpellCoreData = json.set(SpellCoreData,"AHLDurationLevel"+roll.count,tempAHLDuration)]
    }]
}]

[h:FirstPassTest = (thisPlayerCurrentSpellData == "")]
[h,if(FirstPassTest),CODE:{
    [h:classesWithSpell = "[]"]
	[h:UniqueSpellListFeatures = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.UniqueSpellList==1)]")]

	[h,foreach(tempFeature,UniqueSpellListFeatures),CODE:{
        [h:onListTest = json.contains(SpellCoreData,"is"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass"))]
        [h,if(onListTest): classesWithSpell = json.append(classesWithSpell,json.set("","Name",json.get(tempFeature,"Name"),"Class",json.get(tempFeature,"Class"),"Subclass",json.get(tempFeature,"Subclass")))]
        [h:SpellCoreData = json.remove(SpellCoreData,"is"+json.get(tempFeature,"Name")+json.get(tempFeature,"Class")+json.get(tempFeature,"Subclass"))]
	}]

    [h:SpellCoreData = json.set(SpellCoreData,"ClassesWithSpell",classesWithSpell)]

    [h:tempDescription = pm.EvilChars(json.get(SpellCoreData,"Description"))]
    [h:tempDescription = replace(encode(tempDescription),"%0A","<br>")]
    [h:tempDescription = decode(tempDescription)]
    [h:SpellCoreData = json.set(SpellCoreData,"Description",base64.encode(tempDescription))]

    [h:tempAHLDescription = pm.EvilChars(json.get(SpellCoreData,"AHLDescription"))]
    [h:tempAHLDescription = replace(encode(tempAHLDescription),"%0A","<br>")]
    [h:tempAHLDescription = decode(tempAHLDescription)]
    [h:SpellCoreData = json.set(SpellCoreData,"AHLDescription",base64.encode(tempAHLDescription))]
};{
    [h:baseSpellData = json.get(thisPlayerCurrentSpellData,0)]
    [h:SpellCoreData = json.set(SpellCoreData,"Description",json.get(baseSpellData,"Description"))]
    [h:SpellCoreData = json.set(SpellCoreData,"AHLDescription",json.get(baseSpellData,"AHLDescription"))]
}]

[h:TotalSubeffects = json.get(SpellCoreData,"multiSubeffects")]
[h:SpellCoreData = json.remove(SpellCoreData,"multiSubeffects")]

[h:newSpellData = json.set(currentSpellData,getPlayerName(),json.append(thisPlayerCurrentSpellData,SpellCoreData))]
[h:setLibProperty("ct.NewSpell",newSpellData,"Lib:pm.a5e.Core")]

[h:closeDialog("Spell Creation")]

[h,MACRO("CreateSpellSubeffect@Lib:pm.a5e.Core"): json.set("","TotalSubeffects",TotalSubeffects,"WhichSubeffect",1,"WhichEffect",json.get(SpellCoreData,"WhichEffect"),"SpellLevel",json.get(SpellCoreData,"Level"),"SpellName",json.get(SpellCoreData,"Name"))]