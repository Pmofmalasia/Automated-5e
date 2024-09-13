[h:InitializedItemData = macro.args]
[h:InitializedItem = json.get(InitializedItemData,"Item")]
[h:ParentToken = json.get(InitializedItemData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:WeaponProperties = json.get(InitializedItem,"WeaponProperties")]
[h:WeaponPropsTest = WeaponProperties != ""]
[h,if(WeaponPropsTest),CODE:{
	[h,if(json.contains(WeaponProperties,"Ammunition")): InitializedItem = json.set(InitializedItem,"AmmunitionID","")]
};{}]

[h,if(json.get(InitializedItem,"isWearable")==1 || json.get(InitializedItem,"isAttunement") == 1):
	InitializedItem = json.set(InitializedItem,"IsActive",0);
	InitializedItem = json.set(InitializedItem,"IsActive",1)	
]
[h,if(json.get(InitializedItem,"isAttunement")==1): InitializedItem = json.set(InitializedItem,"AttunedTo","")]

[h:InitialChargesMethod = json.get(InitializedItem,"InitialChargesMethod")]
[h,switch(InitialChargesMethod),CODE:
	case "Full":{
		[h:InitializedItem = json.set(InitializedItem,"Resource",js.a5e.GetMaximumResources(InitializedItem,ParentToken))]
	};
	case "Fixed":{
[h:"<!-- TODO: MaxResource fix -->"]
[h:"<!-- This and Rolled need new format for setting resources - could do as is just setting key as item name, but need to check for alternative name of resource -->"]
		[h:InitializedItem = json.set(InitializedItem,"Resource",json.get(InitializedItem,"InitialChargesAmount"))]
	};
	case "Rolled":{
		[h:InitialChargesAmount = eval(json.get(InitializedItem,"InitialChargesAmountDieNumber")+"d"+json.get(InitializedItem,"InitialChargesAmountDieSize")+"+"+json.get(InitializedItem,"InitialChargesAmountBonus"))]
		[h:InitializedItem = json.set(InitializedItem,"Resource",InitialChargesAmount)]
	};
	default:{}
]

[h:return(0,InitializedItem)]