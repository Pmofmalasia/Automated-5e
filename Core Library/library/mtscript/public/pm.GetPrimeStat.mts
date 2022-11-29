[h:pm.PrimeStatTemp = json.get(json.path.read(allAbilities,"[?(@.Name=='"+json.get(arg(0),"Name")+"' && @.Class=='"+json.get(arg(0),"Class")+"' && @.Subclass=='"+json.get(arg(0),"Subclass")+"' && @.IsActive>0)]['PrimeStat']"),0)]

[h:"<!-- If PrimeStat is determined by max/min, if multiple are equal it will choose the last one in the array. Shouldn't really matter for anything, so not going to worry about it too much atm. -->"]
[h,if(json.type(pm.PrimeStatTemp) == "OBJECT"),CODE:{
	[h:pm.StatEval = ""]
	[h,foreach(tempStat,json.get(pm.PrimeStatTemp,"Stats")): pm.StatEval = listAppend(pm.StatEval,"json.get(getProperty('stat.Attributes'),'"+tempStat+"')")]
	[h:pm.StatValue = eval(json.get(pm.PrimeStatTemp,"EvalMethod")+"("+pm.StatEval+")")]
	[h:pm.PrimeStatFinal = ""]
	[h,foreach(tempStat,json.get(pm.PrimeStatTemp,"Stats")): pm.PrimeStatFinal = if(json.get(getProperty("a5e.stat.Attributes"),tempStat)==pm.StatValue,tempStat,pm.PrimeStatFinal)]
	[h:macro.return = pm.PrimeStatFinal]
};{
	[h:macro.return = pm.PrimeStatTemp]
}]