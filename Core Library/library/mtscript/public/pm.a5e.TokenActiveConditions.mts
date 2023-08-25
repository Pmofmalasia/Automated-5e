[h,if(argCount() > 0): switchToken(arg(0))]

[h:RegularConditions = getProperty("a5e.stat.ConditionList")]
[h:ItemConditions = json.path.read(getProperty("a5e.stat.Inventory"),"[*]['ItemConditions'][*]")]

[h:return(0,json.merge(RegularConditions,ItemConditions))]