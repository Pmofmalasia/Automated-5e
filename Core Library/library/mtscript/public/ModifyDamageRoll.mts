[h:PriorDamage = arg(0)]
[h:ModifyHowData = arg(1)]

[h,if(json.type(ModifyHowData) == "OBJECT"): ModifyHowData = json.append("",ModifyHowData)]

[h,foreach(tempInstance,ModifyHowData),CODE:{
    [h:pm.a5e.ModifyDamageRollLoop()]
}]

[h:return(0,PriorDamage)]