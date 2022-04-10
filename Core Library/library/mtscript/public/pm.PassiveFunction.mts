[h:a5e.CallingInstance = arg(0)]
[h:pm.ValidAbilities = json.path.read(a5e.UnifiedAbilities,"[*][?(@.IsActive>0 && @.Call"+a5e.CallingInstance+"!=0 && @.Call"+a5e.CallingInstance+"!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,pm.ValidAbilities,""),CODE:{
	[h,switch(json.get(ability,"AbilityType")):
		case "Feature": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Passive";
		case "Condition": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"ConditionPassive"
	]
	
	[h:pm.ValidFunction = isFunctionDefined(a5efunctionName)]
	[h:pm.SpecificAbilityTest = json.type(json.get(ability,"Call"+a5e.CallingInstance))]
	[h,if(pm.SpecificAbilityTest=="UNKNOWN"),CODE:{
		[h,if(argCount()>1 && pm.ValidFunction): pm.ValidFunction = json.get(ability,"Call"+a5e.CallingInstance) == arg(1)]
		[h,if(pm.ValidFunction): evalMacro("[h:"+a5efunctionName+"('"+a5e.CallingInstance+"')]")]
	};{
		[h:pm.ThisAbilityTest = json.contains(json.get(ability,"Call"+a5e.CallingInstance),json.set("","Name",json.get(abilityInfo,"Name"),"DisplayName",json.get(abilityInfo,"DisplayName"),"Class",json.get(abilityInfo,"Class"),"Subclass",json.get(abilityInfo,"Subclass")))]
		[h,if(pm.ValidFunction && pm.ThisAbilityTest): evalMacro("[h:"+a5efunctionName+"('"+a5e.CallingInstance+"')]")]
	}]
}]