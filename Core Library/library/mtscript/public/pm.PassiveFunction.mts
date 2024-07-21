[h:a5e.CallingInstance = arg(0)]

[h,if(argCount()>1),CODE:{
	[h:passiveSpecificFeature = json.get(arg(1),"SpecificFeature")]
	
	[h:switchTest = json.get(arg(1),"ParentToken")]
	[h:noValidTokenTest = and(json.contains(arg(1),"ParentToken"),switchTest=="")]
	[h:return(!noValidTokenTest)]
	[h,if(switchTest!=""),CODE:{
		[h:oldParentToken = ParentToken]
		[h:oldFeatures = a5e.UnifiedAbilities]
		[h:switchType = json.get(arg(1),"SwitchType")]
		[h,switch(switchType):
			case "Condition": a5e.UnifiedAbilities = SetByAbilities;
			case "Target": a5e.UnifiedAbilities = TargetAbilities;
			default: a5e.UnifiedAbilities = a5e.GatherAbilities(switchTest)
		]
		[h:ParentToken = switchTest]
		[h:switchToken(ParentToken)]
	};{}]
};{
	[h:passiveSpecificFeature = ""]
	[h:switchTest = ""]
}]

[h:pm.ValidAbilities = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.IsActive>0 && @.Call"+a5e.CallingInstance+if(passiveSpecificFeature=="","!=0","=='"+passiveSpecificFeature+"'")+" && @.Call"+a5e.CallingInstance+"!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:"<!-- TODO: BUGFIX: When nesting one passivefunction into another, a5e.CallingInstance changes in the second passivefunction. This means that AbilityCallingInstanceValue will be incorrect in the loop after the second passivefunction finishes. -->"]
[h,foreach(ability,pm.ValidAbilities),CODE:{
	[h,switch(json.get(ability,"AbilityType")):
		case "Feature": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Passive";
		case "Condition": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"ConditionPassive";
		case "ItemCondition": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"ConditionPassive";
		default: a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Passive"
	]
	[h:thisFeatureArgs = json.set(ability,"Context",a5e.CallingInstance)]
	[h:AbilityCallingInstanceValue = json.get(ability,"Call"+a5e.CallingInstance)]
	[h:pm.ValidFunction = isFunctionDefined(a5efunctionName)]
	[h:pm.SpecificAbilityTest = json.type(AbilityCallingInstanceValue)]
	[h:"<!-- Ways determine if it's valid to abilities: -->"]
	[h:"<!-- UNKNOWN + no arg is simple: 1 means ability is called -->"]
	[h:"<!-- UNKNOWN + arg of FeatureClassSubclass: The ability being run is calling out to a specific ability in the argument (current use case = CallDieSize) -->"]
	[h:"<!-- UNKNOWN + not a valid function AND first character is [: Indicates that the CallX contains code, and executes that code. This bypasses the need for declaring passive functions. To be made obsolete with OBJECT option in the future (below). -->"]
	[h:"<!-- default: Pass JSON through passive effect execution function. -->"]
	[h:"<!-- TEMPORARY INSTANCE - ARRAY FOR AFTERABILITY INSTANCE: Ability being called is acting on the ability being run (e.g. Instinctive pounce (ability) is acting on Rage). If ability being run (Rage) is in the preset list, then called ability (Instinctive Pounce) is executed. - SHOULD TRADE THIS FOR BEING A PREREQUISITE (VIA EFFECTMEETSPREREQS) INSTEAD OF BEING A SEPARATE THING -->"]
	[h,switch(pm.SpecificAbilityTest),CODE:
		case "UNKNOWN":{
			[h,if(argCount()>1 && pm.ValidFunction): pm.ValidFunction = (AbilityCallingInstanceValue == if(passiveSpecificFeature=="",1,passiveSpecificFeature))]
			[h,if(pm.ValidFunction): evalMacro("[h:"+a5efunctionName+"('"+base64.encode(thisFeatureArgs)+"')]")]
			[h,if(!pm.ValidFunction && substring(AbilityCallingInstanceValue,0,1) == "["): pm.a5e.ExecutePassiveFeature(ability,AbilityCallingInstanceValue)]
		};
		default:{
			[h:pm.ThisAbilityTest = 0]
			[h,if(a5e.CallingInstance == "AfterAbility" && pm.SpecificAbilityTest == "ARRAY"):
				pm.ThisAbilityTest = json.contains(AbilityCallingInstanceValue,json.set("","Name",json.get(abilityInfo,"Name"),"DisplayName",json.get(abilityInfo,"DisplayName"),"Class",json.get(abilityInfo,"Class"),"Subclass",json.get(abilityInfo,"Subclass")));
				pm.a5e.ExecutePassiveEffect(ability,a5e.CallingInstance)
			]
			[h,if(pm.ValidFunction && pm.ThisAbilityTest && a5e.CallingInstance == "AfterAbility" && pm.SpecificAbilityTest == "ARRAY"): evalMacro("[h:"+a5efunctionName+"('"+base64.encode(thisFeatureArgs)+"')]")]
		}
	]
}]

[h,if(switchTest!=""),CODE:{
	[h:ParentToken = oldParentToken]
	[h:a5e.UnifiedAbilities = oldFeatures]
	[h:switchToken(ParentToken)]
};{}]