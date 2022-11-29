[h:XPGain = 0]

[h:XPAdd = input(
	"XPGain|0|Experience"
)]
[h:abort(XPAdd)]

{token.name} gained [r:XPGain] experience!<br>

[h:setProperty("a5e.stat.Experience",getProperty("a5e.stat.Experience") + XPGain)]

<b><font color="green">[if(LevelFunction <= 1 && getProperty("a5e.stat.Experience") >= 300): "Level up! "+token.name+" is now level 2!"]
[if(LevelFunction <= 2 && getProperty("a5e.stat.Experience") >= 900): "Level up! "+token.name+" is now level 3!"]
[if(LevelFunction <= 3 && getProperty("a5e.stat.Experience") >= 2700): "Level up! "+token.name+" is now level 4!"]
[if(LevelFunction <= 4 && getProperty("a5e.stat.Experience") >= 6500): "Level up! "+token.name+" is now level 5!"]
[if(LevelFunction <= 5 && getProperty("a5e.stat.Experience") >= 14000): "Level up! "+token.name+" is now level 6!"]
[if(LevelFunction <= 6 && getProperty("a5e.stat.Experience") >= 23000): "Level up! "+token.name+" is now level 7!"]
[if(LevelFunction <= 7 && getProperty("a5e.stat.Experience") >= 34000): "Level up! "+token.name+" is now level 8!"]
[if(LevelFunction <= 8 && getProperty("a5e.stat.Experience") >= 48000): "Level up! "+token.name+" is now level 9!"]
[if(LevelFunction <= 9 && getProperty("a5e.stat.Experience") >= 64000): "Level up! "+token.name+" is now level 10!"]
[if(LevelFunction <= 10 && getProperty("a5e.stat.Experience") >= 85000): "Level up! "+token.name+" is now level 11!"]
[if(LevelFunction <= 11 && getProperty("a5e.stat.Experience") >= 100000): "Level up! "+token.name+" is now level 12!"]
[if(LevelFunction <= 12 && getProperty("a5e.stat.Experience") >= 120000): "Level up! "+token.name+" is now level 13!"]
[if(LevelFunction <= 13 && getProperty("a5e.stat.Experience") >= 140000): "Level up! "+token.name+" is now level 14!"]
[if(LevelFunction <= 14 && getProperty("a5e.stat.Experience") >= 165000): "Level up! "+token.name+" is now level 15!"]
[if(LevelFunction <= 15 && getProperty("a5e.stat.Experience") >= 195000): "Level up! "+token.name+" is now level 16!"]
[if(LevelFunction <= 16 && getProperty("a5e.stat.Experience") >= 225000): "Level up! "+token.name+" is now level 17!"]
[if(LevelFunction <= 17 && getProperty("a5e.stat.Experience") >= 265000): "Level up! "+token.name+" is now level 18!"]
[if(LevelFunction <= 18 && getProperty("a5e.stat.Experience") >= 305000): "Level up! "+token.name+" is now level 19!"]
[if(LevelFunction <= 19 && getProperty("a5e.stat.Experience") >= 355000): "Level up! "+token.name+" is now level 20!"]</span></b>