[h:UseItemData = macro.args]
[h:ItemEffects = json.get(UseItemData,"Effects")]
[h:ParentToken = json.get(UseItemData,"ParentToken")]
[h:EffectsNumber = json.length(ItemEffects)]
[h:switchToken(ParentToken)]
[h:allItemData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+json.get(UseItemData,"ItemID")+"')]")]
[h:assert(!json.isEmpty(allItemData),"This item is no longer in the inventory!")]
[h:thisItemData = json.set(json.get(allItemData,0),
	"ParentToken",ParentToken,
	"IsTooltip",json.get(UseItemData,"IsTooltip")
)]

[h,if(EffectsNumber==1),CODE:{
	[h:ChosenEffect = json.get(ItemEffects,0)]
};{
	[h,switch(json.get(thisItemData,"EffectChoiceMethod")),CODE:
		case "Random":{
			[h:ChosenEffectIndex = eval("1d"+EffectsNumber) - 1]
			[h:ChosenEffect = json.get(ItemEffects,ChosenEffectIndex)]
		};
		case "Target":{

		};
		case "StoredValue":{

		};
		case "OutsideRoll":{

		};
		case "ResourceType":{

		};
		case "ItemActivationState":{
			[h:ItemEffects = json.path.read(ItemEffects,"\$[*][?(@.ValidActivationState == '"+json.get(thisItemData,"IsActive")+"')]")]
		};
		default: {}
	]

	[h,if(json.get(thisItemData,"EffectChoiceMethod") != "Random"),CODE:{
		[h:EffectOptions = ""]
		[h,foreach(tempEffect,ItemEffects): EffectOptions = json.append(EffectOptions,json.get(tempEffect,"DisplayName"))]
		[h,if(EffectOptions == ""): assert(0,"There are no usable item effects!")]
		[h,if(json.length(EffectOptions) == 1):
			ChosenEffectIndex = 0;
			abort(input(
				" ChosenEffectIndex | "+EffectOptions+" | Choose an Effect | LIST | DELIMITER=JSON "
			))
		]
		[h:ChosenEffect = json.get(ItemEffects,ChosenEffectIndex)]
	};{}]
}]

[h,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): json.set(thisItemData,"Effect",ChosenEffect)]

[h,if(json.get(thisItemData,"isConsumable")),CODE:{
	[h:AmountConsumed = 1]
	[h:ItemID = json.get(thisItemData,"ItemID")]
	[h:NewNumber = json.get(thisItemData,"Number") - AmountConsumed]

	[h,if(NewNumber == 0),CODE:{
		[h,MACRO("DropItem@Lib:pm.a5e.Core"): json.set("",
			"ItemID",ItemID,
			"Number",AmountConsumed,
			"Location",json.set("","Token",ParentToken),
			"ParentToken",ParentToken,
			"LeaveToken",0
		)]
	};{
		[h:NewInventory = json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+ItemID+"')]['Number']",NewNumber)]
		[h:setProperty("a5e.stat.Inventory",NewInventory)]		
	}]

	[h,if(json.get(thisItemData,"ContainerLeftBehind") != ""),CODE:{
		[h,MACRO("AddItemProcessing@Lib:pm.a5e.Core"): json.set("",
			"ParentToken",json.get(thisItemData,"ParentToken"),
			"ItemChoice",json.get(thisItemData,"ContainerLeftBehind"),
			"NumberAdded",AmountConsumed
		)]
	}]
};{}]

[h:"<!-- TODO: Add method for comparing returned and prior inventory in js, then update the changed rows (and add new row for new items) -->"]
[h:return(0,getProperty("a5e.stat.Inventory"))]

[h,MACRO("ShowInventory@Lib:pm.a5e.Core"): json.set("","ParentToken",json.get(thisItemData,"ParentToken"))]