[h:a5e.CallingInstance = arg(0)]

[h,if(argCount()>1): switchTest = json.get(arg(1),"ParentToken"); switchTest = ""]
[h,if(switchTest!=""),CODE:{
	[h:oldParentToken = ParentToken]
	[h:oldFeatures = a5e.UnifiedAbilities]
	[h:switchType = json.get(arg(1),"SwitchType")]
	[h,switch(switchType):
		case "Condition": a5e.UnifiedAbilities = SetByAbilities;
		case "Target": a5e.UnifiedAbilities = TargetAbilities;
		default: a5e.UnifiedAbilities = SetByAbilities
	]
	[h:ParentToken = switchTest]
	[h:switchToken(ParentToken)]
};{}]

[h:pm.ValidAbilities = json.path.read(a5e.UnifiedAbilities,"[*][?(@.IsActive>0 && @.Call"+a5e.CallingInstance+"!=0 && @.Call"+a5e.CallingInstance+"!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,pm.ValidAbilities,""),CODE:{
	[h,switch(json.get(ability,"AbilityType")):
		case "Feature": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Passive";
		case "Condition": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"ConditionPassive"
	]
	
	[h:pm.ValidFunction = isFunctionDefined(a5efunctionName)]
	[h:pm.SpecificAbilityTest = json.type(json.get(ability,"Call"+a5e.CallingInstance))]
	[h:"<!-- Ways determine if it's valid to abilities: -->"]
	[h:"<!-- UNKNOWN + no arg is simple: 1 means ability is called -->"]
	[h:"<!-- UNKNOWN + arg of FeatureClassSubclass: The ability being run is calling out to a specific ability in the argument (current use case = CallDieSize) -->"]
	[h:"<!-- Not UNKNOWN (should be ARRAY) + no arg: Ability being called is acting on the ability being run. If ability being run is in the preset list, then ability is called. -->"]
	[h,if(pm.SpecificAbilityTest=="UNKNOWN"),CODE:{
		[h,if(argCount()>1 && pm.ValidFunction): pm.ValidFunction = json.get(ability,"Call"+a5e.CallingInstance) == if(json.get(arg(1),"SpecificFeature")=="",1,json.get(arg(1),"SpecificFeature"))]
		[h,if(pm.ValidFunction): evalMacro("[h:"+a5efunctionName+"('"+a5e.CallingInstance+"')]")]
	};{
		[h:pm.ThisAbilityTest = json.contains(json.get(ability,"Call"+a5e.CallingInstance),json.set("","Name",json.get(abilityInfo,"Name"),"DisplayName",json.get(abilityInfo,"DisplayName"),"Class",json.get(abilityInfo,"Class"),"Subclass",json.get(abilityInfo,"Subclass")))]
		[h,if(pm.ValidFunction && pm.ThisAbilityTest): evalMacro("[h:"+a5efunctionName+"('"+a5e.CallingInstance+"')]")]
	}]
}]

[h,if(switchTest!=""),CODE:{
	[h:ParentToken = oldParentToken]
	[h:a5e.UnifiedAbilities = oldFeatures]
	[h:switchToken(ParentToken)]
};{}]