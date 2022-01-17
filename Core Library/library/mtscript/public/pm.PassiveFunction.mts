[h:pm.ValidAbilities = json.path.read(a5e.UnifiedAbilities,"[?(@.IsActive>0 && @.Call"+arg(0)+"==1)]")]
[h,foreach(ability,pm.ValidAbilities,""),CODE:{
	[h,switch(json.get(ability,"AbilityType")):
		case "Feature": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass");
		case "Condition": a5efunctionName = "pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"Condition"
	]
	[h:pm.ValidFunction = isFunctionDefined(a5efunctionName)]
	[h,if(pm.ValidFunction): evalMacro("[h:"+a5efunctionName+"('"+arg(0)+"')]")]
}]
