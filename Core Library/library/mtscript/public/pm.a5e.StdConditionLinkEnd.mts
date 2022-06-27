[h:abilityTable = json.merge(abilityTable,pm.AbilityMagItemMsg(abilityInfo))]

[h:pm.PassiveFunction("AfterCondition",json.set("","ParentToken",cond.SetBy))]