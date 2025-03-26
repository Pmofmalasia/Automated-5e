[h:ParentToken = arg(0)]
[h:Feature = arg(1)]
[h,if(argCount() > 2): EffectPrefix = arg(2); EffectPrefix = ""]

[h,if(ParentToken != ""): switchToken(ParentToken)]

[h:Effects = json.get(Feature,EffectPrefix+"Effects")]
[h:EffectMetadata = json.get(Feature,EffectPrefix+"EffectMetadata")]

[h:EffectsNumber = json.length(Effects)]
[h,if(EffectsNumber == 1),CODE:{
	[h:ChosenEffect = json.get(Effects,0)]
};{
	[h:ChoiceMethod = json.get(EffectMetadata,"ChoiceMethod")]

	[h,switch(ChoiceMethod),CODE:
		case "Random":{
			[h:"<!-- TODO: Effects: Need more options for randomness (e.g. uneven odds for each effect), and should display the roll -->"]
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
		case "ActivationState":{
			[h:validEffects = json.path.read(Effects,"\$[*][?(@.ValidActivationState == '"+json.get(Feature,"IsActive")+"')]")]
		};
		default:{
			[h:validEffects = Effects]
		}
	]

	[h,if(ChoiceMethod != "Random"),CODE:{
		[h:EffectOptions = ""]
		[h,foreach(tempEffect,validEffects): EffectOptions = json.append(EffectOptions,json.get(tempEffect,"DisplayName"))]
		[h,if(EffectOptions == ""): assert(0,"There are no usable effects!")]
		[h,if(json.length(EffectOptions) == 1):
			ChosenEffectIndex = 0;
			abort(input(
				" ChosenEffectIndex | "+EffectOptions+" | Choose an Effect | LIST | DELIMITER=JSON "
			))
		]
		[h:ChosenEffect = json.get(validEffects,ChosenEffectIndex)]
	};{}]
}]

[h:return(0,json.set("","Effect",ChosenEffect,"Table","[]"))]