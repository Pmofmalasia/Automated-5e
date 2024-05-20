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
		[h:InitializedItem = json.set(InitializedItem,"Resource",evalMacro(json.get(InitializedItem,"MaxResource")))]
	};
	case "Fixed":{
		[h:InitializedItem = json.set(InitializedItem,"Resource",json.get(InitializedItem,"InitialChargesAmount"))]
	};
	case "Rolled":{
		[h:InitialChargesAmount = eval(json.get(InitializedItem,"InitialChargesAmountDieNumber")+"d"+json.get(InitializedItem,"InitialChargesAmountDieSize")+"+"+json.get(InitializedItem,"InitialChargesAmountBonus"))]
		[h:InitializedItem = json.set(InitializedItem,"Resource",InitialChargesAmount)]
	};
	default:{}
]

[h:return(0,InitializedItem)]