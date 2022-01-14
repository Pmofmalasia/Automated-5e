[h:ConditionID = macro.args]



[h:ConditionList = json.path.delete(ConditionList,"[?(@.ConditionID=="+pm.CurrentID+")]")]
[h:ConditionGroups = json.delete(ConditionGroups,ConditionID)]