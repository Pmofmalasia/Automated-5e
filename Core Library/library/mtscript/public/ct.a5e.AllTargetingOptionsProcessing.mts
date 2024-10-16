[h:subeffectData = arg(0)]
[h:targetData = arg(1)]
[h:thisTargetKey = arg(2)]
[h,if(argCount() > 3):
	dataKeySuffix = arg(3);
	dataKeySuffix = ""
]

[h,switch(json.get(subeffectData,thisTargetKey+dataKeySuffix)),CODE:
	case "AnyCreature":{
		[h:targetData = json.set(targetData,"Creature","{}")]
	};
	case "AnyOtherCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Self",0)))]
	};
	case "AlliedCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Ally",1,"Self",1)))]
	};
	case "SelfOnly":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Self",1)))]
	};
	case "EnemyCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","Allegiance",json.set("","Foe",1)))]
	};
	case "HumanoidCreature":{
		[h:targetData = json.set(targetData,"Creature",json.set("","TypeInclusive","Humanoid"))]
	};
	case "Creature":{
		[h:CreatureTargetingData = ct.a5e.CreatureTargetingLimitProcessing(subeffectData,dataKeySuffix)]
		[h:subeffectData = json.get(CreatureTargetingData,"Subeffect")]
		[h:creatureData = json.get(CreatureTargetingData,"Creature")]
		[h:targetData = json.set(targetData,"Creature",creatureData)]
	};
	case "AnyObject":{
		[h:targetData = json.set(targetData,"Object","{}")]
	};
	case "ObjectNotWorn":{
		[h:targetData = json.set(targetData,"Object",json.set("","Carried",0))]
	};
	case "ObjectWorn":{
		[h:targetData = json.set(targetData,"Object",json.set("","Carried",1))]
	};
	case "ObjectNonmagical":{
		[h:targetData = json.set(targetData,"Object",json.set("","Magical",0))]
	};
	case "ObjectMagical":{
		[h:targetData = json.set(targetData,"Object",json.set("","Magical",1))]
	};
	case "Object":{
		[h:ObjectTargetingData = ct.a5e.ObjectTargetingLimitProcessing(subeffectData,dataKeySuffix)]
		[h:subeffectData = json.get(ObjectTargetingData,"Subeffect")]
		[h:ObjectData = json.get(ObjectTargetingData,"Object")]
		[h:targetData = json.set(targetData,"Object",ObjectData)]
	};
	case "CreatureObject":{
		[h:CreatureTargetingData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,targetData,"CreatureTargetType",dataKeySuffix)]
		[h:subeffectData = json.get(CreatureTargetingData,"Subeffect")]
		[h:targetData = json.get(CreatureTargetingData,"Targeting")]

		[h:ObjectTargetingData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,targetData,"ObjectTargetLimits",dataKeySuffix)]
		[h:subeffectData = json.get(ObjectTargetingData,"Subeffect")]
		[h:targetData = json.get(ObjectTargetingData,"Targeting")]
	};
	case "Point":{
		[h:targetData = json.set(targetData,"Point",json.set("","OnGround",json.contains(subeffectData,"pointOnGround"+dataKeySuffix)))]
		[h:subeffectData = json.remove(subeffectData,"pointOnGround"+dataKeySuffix)]

		[h:PointTargetingData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,targetData,"secondaryTargetType",dataKeySuffix)]
		[h:subeffectData = json.get(PointTargetingData,"Subeffect")]
		[h:targetData = json.get(PointTargetingData,"Targeting")]
		[h:subeffectData = json.remove(subeffectData,"secondaryTargetType"+dataKeySuffix)]
	};
	case "Effect":{

	};
	case "FreeHand":{

	};
	case "":{
		[h:PriorTargetsData = "{}"]
		[h,if(json.contains(subeffectData,"PriorTargetLimits"+dataKeySuffix)),CODE:{
			[h:TargetingReturnData = ct.a5e.AllTargetingOptionsProcessing(subeffectData,targetData,"PriorTargetType",dataKeySuffix)]
			[h:subeffectData = json.get(TargetingReturnData,"Subeffect")]
			[h:PriorTargetsData = json.set("","PriorTargetLimits",json.get(TargetingReturnData,"Targeting"))]
			[h:subeffectData = json.remove(subeffectData,"PriorTargetLimits"+dataKeySuffix)]
		};{}]

		[h,if(json.contains(subeffectData,"PriorTargetAll"+dataKeySuffix)),CODE:{
			[h:PriorTargetsData = json.set(PriorTargetsData,"TargetAll",1)]
		};{
			[h:PriorTargetsData = json.set(PriorTargetsData,
				"TargetAll",0,
				"TargetNumber",json.get(subeffectData,"PriorTargetNumber"+dataKeySuffix)
			)]
		}]

		[h:targetData = json.set(targetData,"PriorTargets",PriorTargetsData)]

		[h:subeffectData = json.remove(subeffectData,"UsePriorTargets"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"PriorTargetNumber"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"PriorTargetAll"+dataKeySuffix)]
	};
	default: {}
]
[h:subeffectData = json.remove(subeffectData,thisTargetKey+dataKeySuffix)]

[h:macro.return = json.set("","Subeffect",subeffectData,"Targeting",targetData)]