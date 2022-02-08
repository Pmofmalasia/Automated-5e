[h:pm.ValidAbilities = json.path.read(a5e.UnifiedAbilities,"[*][?(@.IsActive>0 && @.Call"+arg(0)+"!=0 && @.Call"+arg(0)+"!=null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,pm.ValidAbilities,""),CODE:{
	[h,switch(json.get(ability,"AbilityType")):
		case "Feature": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Passive";
		case "Condition": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Condition"
	]
	
	[h:pm.ValidFunction = isFunctionDefined(a5efunctionName)]
	[h:pm.SpecificAbilityTest = json.type(json.get(ability,"Call"+arg(0)))]
	[h,if(pm.SpecificAbilityTest=="UNKNOWN"),CODE:{
		[h,if(pm.ValidFunction): evalMacro("[h:"+a5efunctionName+"('"+arg(0)+"')]")]
	};{
		[h:pm.ThisAbilityTest = json.contains(json.get(ability,"Call"+arg(0)),json.set("","Name",json.get(abilityInfo,"Name"),"DisplayName",json.get(abilityInfo,"DisplayName"),"Class",json.get(abilityInfo,"Class"),"Subclass",json.get(abilityInfo,"Subclass")))]
		[h,if(pm.ValidFunction && pm.ThisAbilityTest): evalMacro("[h:"+a5efunctionName+"('"+arg(0)+"')]")]
	}]
}]