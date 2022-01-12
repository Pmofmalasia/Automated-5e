[h:pm.BonusNum = arg(0)]
[h:pm.ShowIfZero = arg(1)]
[h,if(argCount()>2): pm.UseSpace = arg(2); pm.UseSpace = 1]
[h:macro.return=if(and(pm.BonusNum==0,pm.ShowIfZero==0),"",if(pm.UseSpace," ","")+if(pm.BonusNum>=0,"&#43;","-")+if(pm.UseSpace," ","")+abs(pm.BonusNum))]