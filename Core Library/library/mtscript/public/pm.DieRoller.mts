[h:pm.DieNumber=arg(0)]
[h:pm.DieSize=arg(1)]
[h,if(argCount()>2): pm.Bonus=arg(2); pm.Bonus=0]
[h:junkVar=getNewRolls()]
[h:pm.Roll=eval(pm.DieNumber+"d"+pm.DieSize)+pm.Bonus]
[h:pm.RollArray = getNewRolls()]
[h:pm.RollStr = json.toList(pm.RollArray," + ")+pm.PlusMinus(pm.Bonus,0)]
[h:pm.RollMax = (pm.DieSize*pm.DieNumber)+pm.Bonus]

[h:macro.return = json.set("",
    "Array",pm.RollArray,
    "Total",pm.Roll,
    "String",pm.RollStr,
    "MaxTotal",pm.RollMax,
    "Number",pm.DieNumber,
    "Size",pm.DieSize,
    "Bonus",pm.Bonus,
    "Formula",(pm.DieNumber+"d"+pm.DieSize)+pm.PlusMinus(pm.Bonus,0)
)]