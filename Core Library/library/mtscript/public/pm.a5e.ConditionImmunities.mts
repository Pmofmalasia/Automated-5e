[h,if(argCount()>0),CODE:{
    [h:ParentToken = json.get(arg(0),"ParentToken")]
    [h,if(ParentToken!=""): switchToken(ParentToken)]
};{
    [h:ParentToken = currentToken()]
}]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:ConditionImmunityInstances = "[]"]
[h:pm.PassiveFunction("CondImmun")]

[h:macro.return = ConditionImmunityInstances]