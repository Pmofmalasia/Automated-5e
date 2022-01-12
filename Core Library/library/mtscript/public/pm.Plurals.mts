[h:pm.Num=arg(0)]
[h:pm.Word=arg(1)]
[h:macro.return=if(and(pm.BonusNum==0,pm.ShowIfZero==0),"",if(pm.BonusNum>=0," + "," - ")+abs(pm.BonusNum))]