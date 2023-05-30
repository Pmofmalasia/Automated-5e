[h:subeffectData = arg(0)]
[h:objectTargetData = arg(1)]

[h:objectTargetData = json.set(objectTargetData,"Carried",json.get(subeffectData,"ObjectTargetWornCarried"))]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetWornCarried")]






[h,if(json.get(subeffectData,"ObjectTargetType") != "All"),CODE:{
    [h:objectTypeList = pm.a5e.GetCoreData("sb.ObjectTypes","Name","json")]
    [h:inclusiveObjects = "[]"]
    [h:exclusiveObjects = "[]"]
    [h,foreach(tempObject,objectTypeList),CODE:{
        [h,if(json.contains(subeffectData,"ObjectTypeTargetInclusive"+tempObject)): inclusiveObjects = json.append(inclusiveObjects,tempObject)]
        [h,if(json.contains(subeffectData,"ObjectTypeTargetExclusive"+tempObject)): exclusiveObjects = json.append(exclusiveObjects,tempObject)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTypeTargetInclusive"+tempObject)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTypeTargetExclusive"+tempObject)]
    }]
    [h,if(!json.isEmpty(inclusiveObjects)): objectTargetData = json.set(objectTargetData,"TypeInclusive",inclusiveObjects)]
    [h,if(!json.isEmpty(exclusiveObjects)): objectTargetData = json.set(objectTargetData,"TypeExclusive",exclusiveObjects)]
    [h:subeffectData = json.remove(subeffectData,"ObjectTargetType")]

	[h:"<!-- TODO: Add subtype options when I decide how the hell the input should look -->"]
};{}]






[h,switch(json.get(subeffectData,"ObjectTargetMagical")),CODE:
    case "":{
        
    };
    case "Inclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magical",1)]
    };
    case "Exclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magical",0)]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetMagical")]

[h,switch(json.get(subeffectData,"ObjectTargetSizeType")),CODE:
    case "":{
        
    };
    case "Maximum":{
		[h:objectTargetData = json.set(objectTargetData,"SizeMaximum",json.get(subeffectData,"ObjectTargetSize"))]
    };
    case "Minimum":{
		[h:objectTargetData = json.set(objectTargetData,"SizeMinimum",json.get(subeffectData,"ObjectTargetSize"))]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetSizeType")]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetSize")]

[h,switch(json.get(subeffectData,"ObjectTargetWeightType")),CODE:
    case "":{
        
    };
    case "Maximum":{
		[h:objectTargetData = json.set(objectTargetData,"WeightMaximum",json.get(subeffectData,"ObjectTargetWeight"))]
    };
    case "Minimum":{
		[h:objectTargetData = json.set(objectTargetData,"WeightMinimum",json.get(subeffectData,"ObjectTargetWeight"))]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetWeightType")]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetWeight")]

[h,if(json.get(subeffectData,"ObjectTargetTags") != "All"),CODE:{
    [h:MaterialTagList = pm.a5e.GetCoreData("sb.MaterialTags","Name","json")]
    [h:MaterialList = pm.a5e.GetCoreData("sb.Materials","Name","json")]
	[h:AllTagsList = json.merge(MaterialTagList,MaterialList)]

    [h:inclusiveObjectTags = "[]"]
    [h:exclusiveObjectTags = "[]"]
    [h,foreach(tempObject,AllTagsList),CODE:{
        [h,if(json.contains(subeffectData,"ObjectTargetTagsInclusive"+tempObject)): inclusiveObjectTags = json.append(inclusiveObjectTags,tempObject)]
        [h,if(json.contains(subeffectData,"ObjectTargetTagsExclusive"+tempObject)): exclusiveObjectTags = json.append(exclusiveObjectTags,tempObject)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTargetTagsInclusive"+tempObject)]
        [h:subeffectData = json.remove(subeffectData,"ObjectTargetTagsExclusive"+tempObject)]
    }]
    [h,if(!json.isEmpty(inclusiveObjectTags)): objectTargetData = json.set(objectTargetData,"TagsInclusive",inclusiveObjectTags)]
    [h,if(!json.isEmpty(exclusiveObjectTags)): objectTargetData = json.set(objectTargetData,"TagsExclusive",exclusiveObjectTags)]
    [h:subeffectData = json.remove(subeffectData,"ObjectTargetTags")]
};{}]

[h,switch(json.get(subeffectData,"ObjectTargetFlammable")),CODE:
    case "":{
        
    };
    case "Inclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Flammable",1)]
    };
    case "Exclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Flammable",0)]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetFlammable")]

[h,switch(json.get(subeffectData,"ObjectTargetMagnetic")),CODE:
    case "":{
        
    };
    case "Inclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magnetic",1)]
    };
    case "Exclusive":{
		[h:objectTargetData = json.set(objectTargetData,"Magnetic",0)]
    }
]
[h:subeffectData = json.remove(subeffectData,"ObjectTargetMagnetic")]

[h:macro.return = json.set("","Subeffect",subeffectData,"Object",objectTargetData)]