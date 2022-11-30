[h:ParentToken = arg(0)]
[h,if(argCount()>1):
	targetTokens = if(json.type(arg(1))=="ARRAY",arg(1),json.append("",arg(1)));
	targetTokens = ""
]
[h:pm.a5e.AllTokens = json.append(targetTokens,ParentToken)]
[h:"<!-- Should be adding SetBy token to list of targets -->"]

[h:pm.a5e.OccupiedIDs = ""]
[h,foreach(target,pm.a5e.AllTokens): pm.a5e.OccupiedIDs = json.merge(pm.a5e.OccupiedIDs,json.merge(json.path.read(getProperty("a5e.stat.ConditionGroups",ParentToken),"[*]['GroupID']"),json.path.read(getProperty("a5e.stat.ConditionsSet",ParentToken),"[*]['GroupID']")))]

[h:pm.a5e.OccupiedIDs = json.unique(pm.a5e.OccupiedIDs)]

[h:UniqueIDTest = 0]
[h,while(!UniqueIDTest),CODE:{
	[h:pm.GroupID = eval("1d1000000000")]
	[h:UniqueIDTest = !json.contains(pm.a5e.OccupiedIDs,pm.GroupID)]
	[h,if(roll.count>0): broadcast("You've hit a "+json.length(pm.a5e.OccupiedIDs)+" in a billion chance! You win nothing, I just wanted to know if my effort to avoid conflict would pay off.")]
}]

[h:macro.return = pm.GroupID]