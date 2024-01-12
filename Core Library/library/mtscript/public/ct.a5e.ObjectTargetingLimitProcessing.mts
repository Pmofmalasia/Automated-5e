[h:subeffectData = arg(0)]
[h,if(argCount() > 1): IDSuffix = arg(1); IDSuffix = ""]
[h:objectTargetData = "{}"]

[h,switch(json.get(subeffectData,"ObjectTargetWornCarried"+IDSuffix)):
	case "NotWorn": objectTargetData = json.set(objectTargetData,"Carried",0);
	case "Worn": objectTargetData = json.set(objectTargetData,"Carried",1);
	default: ""
]

[h,if(json.get(subeffectData,"ObjectTargetWornCarried"+IDSuffix) != "NotWorn"),CODE:{
	[h,if(json.contains(subeffectData,"isUseCreatureTargetingLimits"+IDSuffix)),CODE:{
		[h:objectTargetData = json.set(objectTargetData,"UseCreatureTargetingLimitsForHeld",1)]
		[h:objectTargetData = json.remove(subeffectData,"isUseCreatureTargetingLimits"+IDSuffix)]
	};{
		[h:objectTargetData = json.set(objectTargetData,"UseCreatureTargetingLimitsForHeld",0)]
		[h:HeldItemCreatureData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,"{}","HoldingCreatureLimits","HoldingObject"+IDSuffix)]
		[h:subeffectData = json.get(HeldItemCreatureData,"Subeffect")]
		[h:HeldItemCreatureFilter = json.get(HeldItemCreatureData,"Targeting")]
		[h:HeldItemCreatureFilter = json.get(HeldItemCreatureFilter,"Creature")]
		
		[h:objectTargetData = json.set(objectTargetData,"CarryingCreatureFilter",HeldItemCreatureFilter)]
	}]
}]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetWornCarried"+IDSuffix)]






[h,if(json.get(subeffectData,"ObjectTargetType"+IDSuffix) != "All"),CODE:{
    [h:objectTypeList = pm.a5e.GetCoreData("sb.ObjectTypes","Name","json")]
    [h:inclusiveObjects = "[]"]
    [h:exclusiveObjects = "[]"]
    [h,foreach(tempObject,objectTypeList),CODE:{
        [h,if(json.contains(subeffectData,"ObjectTypeTargetInclusive"+IDSuffix+tempObject)): inclusiveObjects = json.append(inclusiveObjects,tempObject)]
        [h,if(json.contains(subeffectData,"ObjectTypeTargetExclusive"+IDSuffix+tempObject)): exclusiveObjects = json.append(exclusiveObjects,tempObject)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTypeTargetInclusive"+tempObject+IDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTypeTargetExclusive"+tempObject+IDSuffix)]
    }]
    [h,if(!json.isEmpty(inclusiveObjects)): objectTargetData = json.set(objectTargetData,"TypeInclusive",inclusiveObjects)]
    [h,if(!json.isEmpty(exclusiveObjects)): objectTargetData = json.set(objectTargetData,"TypeExclusive",exclusiveObjects)]
    [h:subeffectData = json.remove(subeffectData,"ObjectTargetType"+IDSuffix)]

	[h:"<!-- TODO: Add subtype options when I decide how the hell the input should look -->"]
};{}]






[h,switch(json.get(subeffectData,"ObjectTargetMagical"+IDSuffix)),CODE:
    case "":{
        
    };
    case "Inclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magical",1)]
    };
    case "Exclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magical",0)]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetMagical"+IDSuffix)]

[h,switch(json.get(subeffectData,"ObjectTargetSizeType"+IDSuffix)),CODE:
    case "":{
        
    };
    case "Maximum":{
		[h:objectTargetData = json.set(objectTargetData,"SizeMaximum",json.get(subeffectData,"ObjectTargetSize"+IDSuffix))]
    };
    case "Minimum":{
		[h:objectTargetData = json.set(objectTargetData,"SizeMinimum",json.get(subeffectData,"ObjectTargetSize"+IDSuffix))]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetSizeType"+IDSuffix)]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetSize"+IDSuffix)]

[h,switch(json.get(subeffectData,"ObjectTargetWeightType"+IDSuffix)),CODE:
    case "":{
        
    };
    case "Maximum":{
		[h:objectTargetData = json.set(objectTargetData,"WeightMaximum",json.get(subeffectData,"ObjectTargetWeight"+IDSuffix))]
    };
    case "Minimum":{
		[h:objectTargetData = json.set(objectTargetData,"WeightMinimum",json.get(subeffectData,"ObjectTargetWeight"+IDSuffix))]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetWeightType"+IDSuffix)]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetWeight"+IDSuffix)]

[h,if(json.get(subeffectData,"ObjectTargetTags"+IDSuffix) != "All"),CODE:{
    [h:MaterialTagList = pm.a5e.GetCoreData("sb.MaterialTags","Name","json")]
    [h:ObjectTagList = pm.a5e.GetCoreData("sb.ObjectTags","Name","json")]
	[h:AllTagsList = json.merge(MaterialTagList,ObjectTagList)]

    [h:inclusiveObjectTags = "[]"]
    [h:exclusiveObjectTags = "[]"]
    [h,foreach(tempObject,AllTagsList),CODE:{
        [h,if(json.contains(subeffectData,"ObjectTargetTagsInclusive"+IDSuffix+tempObject)): inclusiveObjectTags = json.append(inclusiveObjectTags,tempObject)]
        [h,if(json.contains(subeffectData,"ObjectTargetTagsExclusive"+IDSuffix+tempObject)): exclusiveObjectTags = json.append(exclusiveObjectTags,tempObject)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTargetTagsInclusive"+IDSuffix+tempObject+IDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTargetTagsExclusive"+IDSuffix+tempObject+IDSuffix)]
    }]
    [h,if(!json.isEmpty(inclusiveObjectTags)): objectTargetData = json.set(objectTargetData,"TagsInclusive",inclusiveObjectTags)]
    [h,if(!json.isEmpty(exclusiveObjectTags)): objectTargetData = json.set(objectTargetData,"TagsExclusive",exclusiveObjectTags)]
};{}]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetTags"+IDSuffix)]

[h,switch(json.get(subeffectData,"ObjectTargetFlammable"+IDSuffix)),CODE:
    case "":{
        
    };
    case "Inclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Flammable",1)]
    };
    case "Exclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Flammable",0)]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetFlammable"+IDSuffix)]

[h,switch(json.get(subeffectData,"ObjectTargetMagnetic"+IDSuffix)),CODE:
    case "":{
        
    };
    case "Inclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magnetic",1)]
    };
    case "Exclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magnetic",0)]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetMagnetic"+IDSuffix)]

[h:macro.return = json.set("","Subeffect",subeffectData,"Object",objectTargetData)]