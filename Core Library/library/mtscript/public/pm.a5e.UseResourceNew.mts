[h:ResourceList = arg(0)]
[h:UnifiedFeatures = arg(1)]
[h:ParentToken = arg(2)]

[h:allInputData = js.a5e.UseResource(ResourceList,UnifiedFeatures,ParentToken)]
[h:firstInputOptions = json.get(allInputData,"Options")]
[h:firstInputData = json.get(allInputData,"OptionsData")]
[h:secondInputOptions = json.get(allInputData,"SecondaryOptions")]
[h:secondInputData = json.get(allInputData,"SecondaryOptionsData")]

[h,switch(json.length(firstInputData)),CODE:
	case 0:{
		[h:"<!-- TODO: This is bad for both forced expenditure of the resource (other effects should still happen in that case) and giving autonomy to use the feature anyway (possible annoyance, goes against prior philosophy). Will think of something to do in this instance instead. Possibly a 5th key sent used only for this purpose? -->"]
		[h:broadcast("You do not have enough resources left to use this!")]
		[h:abort(0)]
	};
	case 1:{
		[h:resourceChoice = 0]
	};
	default:{
		[h:abort(input(
			"resourceChoice | "+firstInputOptions+" | Choose a Resource to Use | LIST | DELIMITER=JSON "
		))]
	}
]

[h:resourceType = json.get(firstInputData,resourceChoice)]
[h,if(json.type(resourceType) != "UNKNOWN"): resourceTypeTemp = json.get(resourceType,"Type"); resourceTypeTemp = resourceType]
[h:secondInput = json.get(secondInputOptions,resourceChoice)]
[h:secondInputDataChoice = json.get(secondInputData,resourceChoice)]

[h,switch(resourceTypeTemp),CODE:
	case "SpellSlot":{
		[h:"<!-- TODO: Resource - May need the ability to spend multiple spell slots at once -->"]
		[h,if(json.length(secondInput) == 1):
			resourceChoice = 0;
			abort(input(
				"resourceChoice | "+secondInput+" | Spell Slot Used | LIST | DELIMITER=JSON "
			))
		]

		[h:resourceSpent = json.append("",json.get(secondInputDataChoice,resourceChoice))]
	};
	case "HitDice":{
		[h:needsInput = 1]
		[h,if(json.length(secondInput) == 1),CODE:{
			[h:onlyDieSizeData = json.get(secondInput,0)]
			[h:increment = json.get(onlyDieSizeData,"Increment")]
			[h,if(json.type(increment) == "ARRAY"): 
				incrementTarget = json.get(increment,1) - json.get(increment,0);
				incrementTarget = increment
			]
			[h,if(json.get(onlyDieSizeData,"Maximum") == json.get(onlyDieSizeData,"Minimum") || json.get(onlyDieSizeData,"Maximum") - json.get(onlyDieSizeData,"Minimum") < incrementTarget): needsInput = 0]
		};{}]

		[h,if(needsInput),CODE:{
			[h:hdInput = ""]
			[h,foreach(size,secondInput): hdInput = listAppend(hdInput," hitDieChoice"+json.get(size,"DieSize")+" | "+pm.a5e.UseResourceInputOptions(size)+" | d"+json.get(size,"DieSize")+"s Used | LIST | VALUE=STRING DELIMITER=JSON "," ## ")]

			[h:abort(input(
				hdInput
			))]

			[h:rawSizes = json.path.read(secondInput,"\$[*]['DieSize']")]
			[h:resourceSpent = "[]"]
			[h,foreach(size,rawSizes),if(eval("hitDieChoice"+size) > 0): resourceSpent = json.append(resourceSpent,json.set("",
				"Type","HitDice",
				"DieSize",size,
				"Amount",eval("hitDieChoice"+size)
			))]
		};{
			[h:resourceSpent = json.append("",json.set("",
				"Type","HitDice",
				"DieSize",json.get(onlyDieSizeData,"DieSize"),
				"Amount",json.get(onlyDieSizeData,"Minimum")
			))]
		}]
	};
	case "Time":{
		[h:resourceSpent = json.append("",resourceType)]
	};
	case "Feature":{
		[h:increment = json.get(secondInput,"Increment")]
		[h,if(json.type(increment) == "ARRAY"): 
			incrementTarget = json.get(increment,1) - json.get(increment,0);
			incrementTarget = increment
		]
		[h,if(json.get(secondInput,"Maximum") == json.get(secondInput,"Minimum") || json.get(secondInput,"Maximum") - json.get(secondInput,"Minimum") < incrementTarget): needsInput = 0; needsInput = 1]

		[h,if(needsInput),CODE:{
			[h:featureResourceOptions = pm.a5e.UseResourceInputOptions(secondInput)]
			[h:abort(input(
				" resourceAmount | "+featureResourceOptions+" | "+json.get(firstInputOptions,resourceChoice)+" Used | LIST | DELIMITER=JSON "
			))]

			[h:resourceSpent = json.append("",json.set(resourceType,
				"Amount",json.get(featureResourceOptions,resourceAmount),
				"Tier",resourceAmount+1
			))]
		};{
			[h:resourceSpent = json.append("",json.set(resourceType,
				"Amount",json.get(secondInput,"Minimum"),
				"Tier",1
			))]
		}]
	}
]

[h:usedResourceData = js.a5e.ExpendResource(resourceSpent,ParentToken)]
[h:return(0,usedResourceData)]