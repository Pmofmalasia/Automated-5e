[h:AddItemData = macro.args]
[h:AddItemData = pm.a5e.KeyStringsToNumbers(AddItemData)]
[h:ParentToken = json.get(AddItemData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ItemChoiceID = json.get(AddItemData,"ItemChoice")]
[h:PriorInventory = getProperty("a5e.stat.Inventory")]

[h,if(ItemChoiceID=="@@ImpromptuItem"),CODE:{
	[h:ChosenItem = "<!-- To implement later -->"]
};{
	[h:ChosenItem = json.get(json.path.read(getLibProperty("sb.Objects","Lib:pm.a5e.Core"),"[*][?(@.ObjectID == '"+ItemChoiceID+"')]"),0)]
	[h,if(json.get(AddItemData,"DisplayName")!=""): ChosenItem = json.set(ChosenItem,"DisplayName",json.get(AddItemData,"DisplayName"))]
	[h,if(json.get(AddItemData,"FalseName")!=""): ChosenItem = json.set(ChosenItem,"FalseName",json.get(AddItemData,"FalseName"))]
}]

[h:WeaponProperties = json.get(ChosenItem,"WeaponProperties")]
[h:WeaponPropsTest = WeaponProperties != ""]
[h,if(WeaponPropsTest),CODE:{
	[h,if(json.contains(WeaponProperties,"Ammunition")): ChosenItem = json.set(ChosenItem,"AmmunitionID","")]
};{}]

[h,if(json.get(ChosenItem,"isWearable")==1 || json.get(ChosenItem,"isAttunement") == 1):
	ChosenItem = json.set(ChosenItem,"IsActive",0);
	ChosenItem = json.set(ChosenItem,"IsActive",1)	
]
[h,if(json.get(ChosenItem,"isAttunement")==1): ChosenItem = json.set(ChosenItem,"AttunedTo","")]

[h:InitialChargesMethod = json.get(ChosenItem,"InitialChargesMethod")]
[h,switch(InitialChargesMethod),CODE:
	case "Full":{
		[h:ChosenItem = json.set(ChosenItem,"Resource",evalMacro(json.get(ChosenItem,"MaxResource")))]
	};
	case "Fixed":{
		[h:ChosenItem = json.set(ChosenItem,"Resource",json.get(ChosenItem,"InitialChargesAmount"))]
	};
	case "Rolled":{
		[h:InitialChargesAmount = eval(json.get(ChosenItem,"InitialChargesAmountDieNumber")+"d"+json.get(ChosenItem,"InitialChargesAmountDieSize")+"+"+json.get(ChosenItem,"InitialChargesAmountBonus"))]
		[h:ChosenItem = json.set(ChosenItem,"Resource",InitialChargesAmount)]
	};
	default:{}
]

[h:newEntryTest = 1]
[h:StackingTest = json.get(ChosenItem,"isStackable")]
[h,if(StackingTest),CODE:{
	[h:SameItemPriorEntry = json.path.read(PriorInventory,"[*][?(@.ObjectID == '"+ItemChoiceID+"')]")]
	[h:newEntryTest = json.isEmpty(SameItemPriorEntry)]
};{}]

[h,if(newEntryTest),CODE:{
	[h,if(StackingTest),CODE:{
		[h:NumberAdded = json.get(AddItemData,"NumberAdded")]
		[h:NumberOfEntries = 1]
	};{
		[h:NumberAdded = 1]
		[h:NumberOfEntries = json.get(AddItemData,"NumberAdded")]
	}]

	[h,count(NumberOfEntries),CODE:{
		[h:NewItemID = eval("1d10000") + json.get(getInfo("client"),"timeInMs")]
		[h:TempChosenItem = json.set(ChosenItem,
			"ItemID",NewItemID,
			"Number",NumberAdded
		)]

		[h:"<!-- If the item has a subeffect that uses its own resource, put the NewItemID into the subeffect -->"]
		[h:NeedsEffectFeatureResourceTest = !json.isEmpty(json.path.read(TempChosenItem,"[?(@.Effects.*.Subeffects.*.UseResource.Feature.Resource.Name == '"+json.get(ChosenItem,"Name")+"' && @.Effects.*.Subeffects.*.UseResource.Feature.Resource.Class == 'Item')]"))]
		[h:NeedsWeaponEffectFeatureResourceTest = !json.isEmpty(json.path.read(TempChosenItem,"[?(@.WeaponEffects.*.Subeffects.*.UseResource.Feature.Resource.Name == '"+json.get(ChosenItem,"Name")+"' && @.WeaponEffects.*.Subeffects.*.UseResource.Feature.Resource.Class == 'Item')]"))]
		[h,if(NeedsEffectFeatureResourceTest): TempChosenItem = json.path.put(TempChosenItem,"['Effects'][*]['Subeffects'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChosenItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]
		[h,if(NeedsWeaponEffectFeatureResourceTest): TempChosenItem = json.path.put(TempChosenItem,"['WeaponEffects'][*]['Subeffects'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChosenItem,"Name")+"' && @.Class == 'Item')]","ItemID",NewItemID)]

		[h:PriorInventory = json.append(PriorInventory,TempChosenItem)]
	}]
	
	[h:setProperty("a5e.stat.Inventory",PriorInventory)]
};{
	[h:OldEntryData = json.get(SameItemPriorEntry,0)]

	[h:"<!-- This is here just in case - Items with charges (resources) should not be stackable anyway -->"]
	[h,if(InitialChargesMethod != ""): ChosenItem = json.path.put(ChosenItem,"['Effects'][*]['Subeffects'][*]['UseResource']['Feature']['Resource'][?(@.Name == '"+json.get(ChosenItem,"Name")+"' && @.Class == 'Item')]","ItemID",json.get(OldEntryData,"ItemID"))]

	[h:NewNumber = json.get(OldEntryData,"Number") + json.get(AddItemData,"NumberAdded")]
	[h:NewInventory = json.path.set(PriorInventory,"[*][?(@.ObjectID == '"+ItemChoiceID+"')]['Number']",NewNumber)]
	[h:setProperty("a5e.stat.Inventory",NewInventory)]
}]

[h:broadcast(json.get(AddItemData,"NumberAdded")+" "+json.get(ChosenItem,"DisplayName")+" added to the inventory of "+getName(ParentToken))]

[h:closeDialog("AddItem")]