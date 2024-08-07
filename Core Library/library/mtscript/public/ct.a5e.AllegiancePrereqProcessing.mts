[h:input = arg(0)]
[h:IDSuffix = arg(1)]
[h:AllegianceData = "{}"]

[h,switch(json.get(input,"AllegiancePrereq"+IDSuffix)),CODE:
    case "All":{
        
    };
    case "Self":{
        [h:AllegianceData = json.set(AllegianceData,"Allegiance",json.set("","Self",1))]
    };
    case "Allies":{
        [h:AllegianceData = json.set(AllegianceData,"Allegiance",json.set("","Ally",1,"Self",1))]
    };
    case "AlliesNonself":{
        [h:AllegianceData = json.set(AllegianceData,"Allegiance",json.set("","Ally",1))]
    };
    case "NotSelf":{
        [h:AllegianceData = json.set(AllegianceData,"Allegiance",json.set("","NotSelf",1))]
    };
    case "Enemies":{
        [h:AllegianceData = json.set(AllegianceData,"Allegiance",json.set("","Foe",1))]
    };
    case "Nonhostile":{
        [h:AllegianceData = json.set(AllegianceData,"Allegiance",json.set("","Neutral",1,"Ally",1,"Self",1))]
    };
    case "NonhostileNotself":{
        [h:AllegianceData = json.set(AllegianceData,"Allegiance",json.set("","Neutral",1,"Ally",1))]
    }
]
[h:input = json.remove(input,"AllegiancePrereq"+IDSuffix)]

[h:return(0,json.set("","Input",input,"Allegiance",AllegianceData))]