[h:CheckResourceData = macro.args]
[h:ResourceType = json.get(CheckResourceData,"Type")]
[h:ParentToken = json.get(CheckResourceData,"ParentToken")]
[h:switchToken(ParentToken)]
[h,switch(ResourceType),CODE:
	case "Spell Slot":{
		[h:CurrentSpellSlots = getProperty("a5e.stat.SpellSlots")]
		[h:MinSpellSlot = json.get(CheckResourceData,"MinSpellSlot")]
		[h:MaxSpellSlot = json.get(CheckResourceData,"MaxSpellSlot")]
		[h:RemainingResource = 0]
		[h,if(MinSpellSlot == "" && MaxSpellSlot == ""),CODE:{
			[h,foreach(slotLevel,json.fields(CurrentSpellSlots)): RemainingResource = RemainingResource + number(json.get(CurrentSpellSlots,slotLevel))]
		};{
			[h,for(i,number(MinSpellSlot),number(MaxSpellSlot)+1): RemainingResource = RemainingResource + number(json.get(CurrentSpellSlots,i))]
		}]
	};
	case "Hit Dice":{
		[h:CurrentHitDice = getProperty("a5e.stat.HitDice")]
		[h,if(json.get(CheckResourceData,"Size")==""),CODE:{
			[h:RemainingResource = 0]
			[h:AllDieSizes = json.fields(CurrentHitDice)]
			[h:foreach(dieSize,AllDieSizes): RemainingResource = RemainingResource + number(json.get(CurrentHitDice,"d"+dieSize))]
		};{
			[h:RemainingResource = number(json.get(CurrentHitDice,"d"+json.get(CheckResourceData,"Size")))]
		}]
	};
	default:{
		[h,switch(json.get(CheckResourceData,"ResourceSource")):
			case "Feature": ResourceOrigin = "a5e.stat.AllFeatures";
			case "Item": ResourceOrigin = "a5e.stat.Inventory";
			case "Condition": ResourceOrigin = "a5e.stat.ConditionList"
		]

		[h,if(ResourceType == "Item"),CODE:{
			[h:ResourceData = json.path.read(getProperty(ResourceOrigin),"\$[*][?(@.ItemID=='"+json.get(CheckResourceData,"ItemID")+"')]['Resource']")]
			[h,if(json.isEmpty(ResourceData)):
				RemainingResource = 0;
				RemainingResource = json.get(ResourceData,0)
			]
		};{
			[h:ResourceData = json.path.read(getProperty(ResourceOrigin),"\$[*][?(@.Name=='"+json.get(CheckResourceData,"Name")+"' && @.Class=='"+json.get(CheckResourceData,"Class")+"' && @.Subclass=='"+json.get(CheckResourceData,"Subclass")+"')]['Resource']")]
			[h,if(json.isEmpty(ResourceData)):
				RemainingResource = 0;
				RemainingResource = json.get(ResourceData,0)
			]
		}]

		[h,if(json.get(ResourceData,"ResourceKey") != ""),CODE:{
			[h,if(json.type(RemainingResource)=="OBJECT"):
				RemainingResource = json.get(RemainingResource,json.get(ResourceData,"ResourceKey"));
				RemainingResource = 0
			]
		};{}]
	}
]

[h:return(0,RemainingResource)]