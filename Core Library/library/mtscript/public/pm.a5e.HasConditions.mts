[h:ConditionInfo = arg(0)]
[h:ConditionNames = json.get(ConditionInfo,"Names")]
[h:AllorOne = json.get(ConditionInfo,"AllorOne")]
[h:ParentToken = json.get(ConditionInfo,"ParentToken")]
[h:switchToken(ParentToken)]

[h,if(json.type(ConditionNames) == "UNKNOWN"): ConditionNames = json.append("",ConditionNames)]

[h:CurrentConditions = json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*]['Name']")]

[h,if(AllorOne=="All"):
    HasCondition = json.isSubset(CurrentConditions,ConditionNames);
    HasCondition = !json.isEmpty(json.intersection(ConditionNames,CurrentConditions))
]

[h:return(0,HasCondition)]