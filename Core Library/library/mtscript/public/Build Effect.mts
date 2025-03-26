[h:allEffectData = macro.args]
[h:currentEffectData = json.get(allEffectData,"CurrentEffects")]
[h:baseEffectData = json.get(allEffectData,"BaseEffect")]
[h:effectsToMerge = json.get(allEffectData,"ToMerge")]
[h:whichEffectRaw = json.get(allEffectData,"WhichEffect")]
[h,if(whichEffectRaw == ""): whichEffectRaw = 0]
[h:"<!-- whichEffect array allows for choosing effects to merge with in a non-sequential order -->"]

[h,foreach(effect,effectsToMerge),CODE:{
	[h,if(json.type(whichEffectRaw) == "ARRAY"),CODE:{
		[h,if((roll.count+1)>json.length(whichEffectRaw)):
			whichEffect = json.length(currentEffectData);
			whichEffect = json.get(whichEffectRaw,roll.count)
		]
	};{
		[h:whichEffect = whichEffectRaw]
	}]

	[h:newID =  json.get(effect,"ID")]
	[h,if(newID == ""): newID = pm.a5e.GenerateEffectID()]
	[h:parentTokenData = json.get(effect,"ParentToken")]
	[h:ParentSubeffect = json.get(effect,"ParentSubeffect")]
	[h:checkDCData = json.get(effect,"CheckDC")]
	[h:saveDCData = json.get(effect,"SaveDC")]
	[h:attackData = json.get(effect,"Attack")]
	[h:targetData = json.get(effect,"Targets")]
	[h:targetOptionData = json.get(effect,"TargetOptions")]
	[h:damageData = json.get(effect,"Damage")]
	[h:rollData = json.get(effect,"Roll")]
	[h:rangeData = json.get(effect,"Range")]
	[h:durationData = json.get(effect,"Duration")]
	[h:usageData = json.get(effect,"UseTime")]
	[h:resourceData = json.get(effect,"Resource")]
	[h:conditionData = json.get(effect,"ConditionInfo")]
	[h:conditionModificationData = json.get(effect,"ConditionModificationInfo")]
	[h:targetedConditionsData = json.get(effect,"TargetedConditions")]
	[h:effectTargetData = json.get(effect,"TargetedEffects")]
	[h:effectTargetOptionData = json.get(effect,"TargetedEffectOptions")]
	[h:effectMovementData = json.get(effect,"Movement")]
	[h:effectSummonData = json.get(effect,"Summon")]
	[h:effectIsDropItems = json.get(effect,"isDropItems")]
	[h:effectTransformData = json.get(effect,"Transform")]

	[h:effectWeaponData = json.get(effect,"WeaponData")]
	[h:effectSpellData = json.get(effect,"SpellData")]

	[h:"<!-- Note: I'm not sure why I repeatedly got thisEffect in each block instead of setting it once at the start. Will look and potentially change. -->"]

	[h,if(parentTokenData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,"ParentToken",parentTokenData)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]

	[h,if(ParentSubeffect!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,
			"ParentSubeffect",ParentSubeffect,
			"ParentSubeffectRequirements",json.get(effect,"ParentSubeffectRequirements")
		)]

		[h,if(json.contains(effect,"ParentCrit")): thisEffect = json.set(thisEffect,"ParentCrit",json.get(effect,"ParentCrit"))]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(checkDCData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,"ToResolve",json.set(json.get(thisEffect,"ToResolve"),"CheckDC",checkDCData))]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(saveDCData!=""),CODE:{
		[h,if(whichEffect==""): whichEffect = 0]
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]
		
		[h:thisEffect = json.set(thisEffect,"ToResolve",json.set(json.get(thisEffect,"ToResolve"),"SaveDC",saveDCData))]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(attackData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,"ToResolve",json.set(json.get(thisEffect,"ToResolve"),"Attack",attackData))]
		
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(targetData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h,if(json.get(thisEffect,"Targets")==""):
			thisEffect = json.set(thisEffect,"Targets",targetData);
			thisEffect = json.set(thisEffect,"Targets",json.merge(json.get(thisEffect,"Targets"),targetData))
		]
		[h:thisEffect = json.set(thisEffect,"RemainingTargets",json.get(thisEffect,"Targets"))]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(targetOptionData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h,if(json.get(thisEffect,"TargetOptions")==""):
			thisEffect = json.set(thisEffect,"TargetOptions",targetOptionData);
			thisEffect = json.set(thisEffect,"TargetOptions",json.merge(json.get(thisEffect,"TargetOptions"),targetOptionData))
		]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(damageData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]
		
		[h:tempToResolve = if(json.get(thisEffect,"ToResolve")=="","{}",json.get(thisEffect,"ToResolve"))]

		[h,if(json.get(tempToResolve,"Damage")==""):
			tempToResolve = json.set(tempToResolve,"Damage",damageData);
			tempToResolve = json.set(tempToResolve,"Damage",json.merge(json.get(tempToResolve,"Damage"),damageData))
		]
		[h:thisEffect = json.set(thisEffect,"ToResolve",tempToResolve)]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(rollData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,"Roll",rollData)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(rangeData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]
		
		[h:thisEffect = json.set(thisEffect,"Range",rangeData)]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(durationData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]
		
		[h:thisEffect = json.set(thisEffect,"Duration",durationData)]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(usageData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]
		
		[h:thisEffect = json.set(thisEffect,"UseTime",usageData)]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(resourceData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]
		
		[h:thisEffect = json.set(thisEffect,"Resource",resourceData)]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(conditionData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]
		
		[h:tempToResolve = json.get(thisEffect,"ToResolve")]
		[h,if(tempToResolve==""):
			noPriorConditionsTest = 1;
			noPriorConditionsTest = json.isEmpty(json.get(tempToResolve,"ConditionInfo"))
		]

		[h,if(noPriorConditionsTest):
			tempToResolve = json.set(tempToResolve,"ConditionInfo",json.append("",conditionData));
			tempToResolve = pm.a5e.BuildEffectMergeConditions(tempToResolve,conditionData)
		]

		[h:thisEffect = json.set(thisEffect,"ToResolve",tempToResolve)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(conditionModificationData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:"<!-- TODO: Consider merging instead of overriding multiple datasets. Check old effect resolution vs. new one. If the same, combine effects. If Prolong vs. Shorten, subtract effects and correct method appropriately. -->"]
		
		[h:tempToResolve = json.set(json.get(thisEffect,"ToResolve"),"ConditionModificationInfo",conditionModificationData)]

		[h:thisEffect = json.set(thisEffect,"ToResolve",tempToResolve)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(targetedConditionsData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:"<!-- The following first combines conditions on the same target, then adds conditions not already on currentTargetedConditions to it. -->"]

		[h:currentTargetedConditions = json.get(thisEffect,"TargetedConditions")]
		[h,if(currentTargetedConditions==""): currentTargetedConditions = "{}"]
		[h:oldTargets = json.fields(currentTargetedConditions)]
		[h:targetOverlap = json.intersection(oldTargets,json.fields(targetedConditionsData))]
		[h,foreach(target,targetOverlap): currentTargetedConditions = json.set(currentTargetedConditions,target,json.merge(json.get(currentTargetedConditions,target),json.get(targetedConditionsData,target)))]

		[h:currentTargetedConditions = json.merge(targetedConditionsData,currentTargetedConditions)]

		[h:thisEffect = json.set(thisEffect,"TargetedConditions",currentTargetedConditions)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]

	[h,if(effectTargetData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h,if(json.get(thisEffect,"TargetedEffects")==""):
			thisEffect = json.set(thisEffect,"TargetedEffects",effectTargetData);
			thisEffect = json.set(thisEffect,"TargetedEffects",json.merge(json.get(thisEffect,"TargetedEffects"),effectTargetData))
		]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(effectTargetOptionData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h,if(json.get(thisEffect,"TargetedEffectOptions")==""):
			thisEffect = json.set(thisEffect,"TargetedEffectOptions",effectTargetOptionData);
			thisEffect = json.set(thisEffect,"TargetedEffectOptions",json.merge(json.get(thisEffect,"TargetedEffectOptions"),effectTargetOptionData))
		]
	
		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(effectMovementData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,"Movement",effectMovementData)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(effectSummonData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffectToResolve = json.get(thisEffect,"ToResolve")]
		[h,if(json.isEmpty(thisEffectToResolve)): thisEffectToResolve = "{}"]

		[h:thisEffectToResolve = json.set(thisEffectToResolve,"Summon",json.merge(json.get(thisEffectToResolve,"Summon"),effectSummonData))]
		[h:thisEffect = json.set(thisEffect,"ToResolve",thisEffectToResolve)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
		
	[h,if(effectTransformData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffectToResolve = json.get(thisEffect,"ToResolve")]
		[h,if(json.isEmpty(thisEffectToResolve)): thisEffectToResolve = "{}"]

		[h:thisEffectToResolve = json.set(thisEffectToResolve,"Transform",json.merge(json.get(thisEffectToResolve,"Transform"),effectTransformData))]
		[h:thisEffect = json.set(thisEffect,"ToResolve",thisEffectToResolve)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(effectIsDropItems == 1),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffectToResolve = json.get(thisEffect,"ToResolve")]
		[h,if(json.isEmpty(thisEffectToResolve)): thisEffectToResolve = "{}"]

		[h:thisEffectToResolve = json.set(thisEffectToResolve,"isDropItems",1)]
		[h:thisEffect = json.set(thisEffect,"ToResolve",thisEffectToResolve)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(effectWeaponData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,"WeaponData",effectWeaponData)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(effectSpellData!=""),CODE:{
		[h,if(whichEffect >= json.length(currentEffectData)): thisEffect = json.path.set(baseEffectData,"\$.ID",newID); thisEffect = json.get(currentEffectData,whichEffect)]

		[h:thisEffect = json.set(thisEffect,"SpellData",effectSpellData)]

		[h,if(whichEffect >= json.length(currentEffectData)): currentEffectData = json.append(currentEffectData,thisEffect); currentEffectData = json.set(currentEffectData,whichEffect,thisEffect)]
	};{}]
	
	[h,if(json.type(whichEffectRaw) == "UNKNOWN"): whichEffectRaw = whichEffectRaw+1]
}]

[h:macro.return = currentEffectData]