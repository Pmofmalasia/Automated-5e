[h:pm.ValidAbilities = json.path.read(allAbilities,"[?(@.IsActive>0 && @.Call"+arg(0)+"==1)]")]
[h,foreach(ability,pm.ValidAbilities,""),CODE:{
	[h:pm.ValidFunction = isFunctionDefined("pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass"))]
	[h,if(pm.ValidFunction): evalMacro("[h:pm."+json.get(ability,"Name")+json.get(ability,"Class")+json.get(ability,"Subclass")+"('"+arg(0)+"')]")]
}]
