[h:hd.Display=""]
[h:MaxHitDice = getProperty("a5e.stat.MaxHitDice")]
[h:CurrentHitDice = getProperty("a5e.stat.HitDice")]

[h,if(json.get(MaxHitDice,"1d12")>0): hd.Display = listAppend(hd.Display,"1d12: "+json.get(CurrentHitDice,"1d12")+"/"+json.get(MaxHitDice,"1d12")," | ")]
[h,if(json.get(MaxHitDice,"1d10")>0): hd.Display = listAppend(hd.Display,"1d10: "+json.get(CurrentHitDice,"1d10")+"/"+json.get(MaxHitDice,"1d10")," | ")]
[h,if(json.get(MaxHitDice,"1d8")>0): hd.Display = listAppend(hd.Display,"1d8: "+json.get(CurrentHitDice,"1d8")+"/"+json.get(MaxHitDice,"1d8")," | ")]
[h,if(json.get(MaxHitDice,"1d6")>0): hd.Display = listAppend(hd.Display,"1d6: "+json.get(CurrentHitDice,"1d6")+"/"+json.get(MaxHitDice,"1d6")," | ")]

[h:macro.return = hd.Display]