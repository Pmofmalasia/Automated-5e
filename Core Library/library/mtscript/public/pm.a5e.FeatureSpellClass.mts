[h,if(argCount()>0),CODE:{
	[h:pass.CastingClass = json.get(arg(0),"Class")]
};{
	[h:pass.CastingClass = pass.abilityClass]
	[h:pass.CastingLevel = pass.abilityLevel]
}]

[h:ClassOptionsArray = if(and(json.get(sList,pass.CastingClass)>0,pass.CastingLevel>=json.get(sList,pass.CastingClass)),json.append(ClassOptionsArray,pass.abilityInfo),ClassOptionsArray)]