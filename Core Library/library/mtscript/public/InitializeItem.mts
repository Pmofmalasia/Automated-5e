[h:InitializedItemData = macro.args]
[h:InitializedItem = json.get(InitializedItemData,"Item")]
[h:ParentToken = json.get(InitializedItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:abilityTable = "[]"]

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

[h,if(json.get(InitializedItem,"ResourceData") != ""),CODE:{
	[h:ItemResourceData = json.get(InitializedItem,"ResourceData")]
	[h:CalculatedResourceData = js.a5e.CalculateResourceData(InitializedItem,ParentToken)]
	[h:InitialResourceData = json.get(ItemResourceData,"InitialResource")]
	[h:ResourceNames = json.fields(InitialResourceData,"json")]
	[h:CurrentResource = "{}"]
	[h,foreach(resourceName,ResourceNames),switch(json.path.read(InitialResourceData,"\$['"+resourceName+"']['Method']")),CODE:
		case "Full":{
			[h:CurrentResource = json.set(CurrentResource,resourceName,json.path.read(CalculatedResourceData,"\$['"+resourceName+"']['MaxResource']"))]
		};
		case "Fixed":{
			[h:CurrentResource = json.set(CurrentResource,resourceName,json.path.read(InitialResourceData,"\$['"+resourceName+"']['Amount']"))]
		};
		case "Rolled":{
			[h:thisResourceInitial = json.get(InitialResourceData,resourceName)]
			[h:rolledAmount = pm.DieRoller(json.get(thisResourceInitial,"DieNumber"),json.get(thisResourceInitial,"DieSize"),json.get(thisResourceInitial,"Bonus"))]
			[h:CurrentResource = json.set(CurrentResource,resourceName,json.get(rolledAmount,"Total"))]

			[h:abilityTable = json.append(abilityTable,json.get("",
				"ShowIfCondensed",1,
				"Header",json.get(json.get(CalculatedResourceData,resourceName),"DisplayName")+" Rolled",
				"FalseHeader","",
				"FullContents",json.get(rolledAmount,"Total"),
				"RulesContents",json.get(rolledAmount,"Formula")+" = ",
				"RollContents",json.get(rolledAmount,"String")+" = ",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		}
	]
};{}]

[h:return(0,json.set("","Item",InitializedItem,"Table",abilityTable))]