[h,if(argCount() > 0): switchToken(arg(0))]

[h:hd.Display=""]
[h:MaxHitDice = getProperty("a5e.stat.MaxHitDice")]
[h:CurrentHitDice = getProperty("a5e.stat.HitDice")]

[h,foreach(dieSize,json.fields(CurrentHitDice)),CODE:{
	[h:thisSizeMax = number(json.get(MaxHitDice,dieSize))]
	[h,if(thisSizeMax > 0): hd.Display = listAppend(hd.Display,"d"+dieSize+": "+json.get(CurrentHitDice,dieSize)+"/"+json.get(MaxHitDice,dieSize)," | ")]	
}]

[h:return(0,hd.Display)]