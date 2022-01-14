[h:a5e.Conditions = json.get(macro.args,"Conditions")]
[h:a5e.Group = json.get(macro.args,"Group")]
[h:a5e.EndConditionInfo = json.get(macro.args,"EndInfo")]

[h:ConditionList = json.merge(ConditionList,a5e.Conditions)]
[h:ConditionGroups = json.set(ConditionGroups,a5e.Group,json.set("","Names",json.path.read(a5e.Conditions,"[*]['Name']"),"EndCondition",a5e.EndConditionInfo))]