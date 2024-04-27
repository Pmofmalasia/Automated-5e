[h:UseItemData = macro.args]
[h:ItemEffects = json.get(UseItemData,"Effects")]
[h:ParentToken = json.get(UseItemData,"ParentToken")]
[h:EffectsNumber = json.length(ItemEffects)]
[h:switchToken(ParentToken)]

[h,if(EffectsNumber==1),CODE:{
	[h:ChosenEffect = json.get(ItemEffects,0)]
};{
	[h,if(json.get(UseItemData,"isEffectRandom")==1),CODE:{
	};{
	}]

	[h,switch(json.get(subeffectData,"EffectsChoiceMethod")),CODE:
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
			[h:ValidActivationState = json.get(subeffectData,"ValidActivationState")]
			[h,if(ValidActivationState): ItemEffects = json.path.read(ItemEffects,"\$[*][?(@.ValidActivationState == '"+json.get(UseItemData,"IsActive")+"')]")]
		};
		default: {}
	]

	[h,if(json.get(subeffectData,"EffectsChoiceMethod") != "Random"),CODE:{
		[h:EffectOptions = ""]
		[h,foreach(tempEffect,ItemEffects): EffectOptions = json.append(EffectOptions,json.get(tempEffect,"DisplayName"))]
		[h,if(EffectOptions == ""): assert(0,"There are no usable item effects!")]
		[h:abort(input(
			" ChosenEffectIndex | "+EffectOptions+" | Choose an Effect | LIST | DELIMITER=JSON "
		))]
		[h:ChosenEffect = json.get(ItemEffects,ChosenEffectIndex)]
	};{}]
}]

[h,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): json.set(UseItemData,"Effect",ChosenEffect)]

[h,if(json.get(UseItemData,"isConsumable")),CODE:{
	[h:AmountConsumed = 1]
	[h:ItemID = json.get(UseItemData,"ItemID")]
	[h:NewNumber = json.get(UseItemData,"Number") - AmountConsumed]
	[h:NewInventory = json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+ItemID+"')]['Number']",NewNumber)]
	[h:setProperty("a5e.stat.Inventory",NewInventory)]

	[h,if(json.get(UseItemData,"ContainerLeftBehind") != ""),CODE:{
		[h,MACRO("AddItemProcessing@Lib:pm.a5e.Core"): json.set("",
			"ParentToken",json.get(UseItemData,"ParentToken"),
			"ItemChoice",json.get(UseItemData,"ContainerLeftBehind"),
			"NumberAdded",AmountConsumed
		)]
	}]
};{}]

[h:"<!-- TODO: Add method for comparing returned and prior inventory in js, then update the changed rows (and add new row for new items) -->"]
[h:return(0,getProperty("a5e.stat.Inventory"))]

[h,MACRO("ShowInventory@Lib:pm.a5e.Core"): json.set("","ParentToken",json.get(UseItemData,"ParentToken"))]