[h:XPGain = 0]

[h:XPAdd = input(
	"XPGain|0|Experience"
)]
[h:abort(XPAdd)]

{token.name} gained [r:XPGain] experience!<br>

[h:Experience = Experience + XPGain]

<b><font color="green">[if(LevelFunction <= 1 && Experience >= 300): "Level up! "+token.name+" is now level 2!"]
[if(LevelFunction <= 2 && Experience >= 900): "Level up! "+token.name+" is now level 3!"]
[if(LevelFunction <= 3 && Experience >= 2700): "Level up! "+token.name+" is now level 4!"]
[if(LevelFunction <= 4 && Experience >= 6500): "Level up! "+token.name+" is now level 5!"]
[if(LevelFunction <= 5 && Experience >= 14000): "Level up! "+token.name+" is now level 6!"]
[if(LevelFunction <= 6 && Experience >= 23000): "Level up! "+token.name+" is now level 7!"]
[if(LevelFunction <= 7 && Experience >= 34000): "Level up! "+token.name+" is now level 8!"]
[if(LevelFunction <= 8 && Experience >= 48000): "Level up! "+token.name+" is now level 9!"]
[if(LevelFunction <= 9 && Experience >= 64000): "Level up! "+token.name+" is now level 10!"]
[if(LevelFunction <= 10 && Experience >= 85000): "Level up! "+token.name+" is now level 11!"]
[if(LevelFunction <= 11 && Experience >= 100000): "Level up! "+token.name+" is now level 12!"]
[if(LevelFunction <= 12 && Experience >= 120000): "Level up! "+token.name+" is now level 13!"]
[if(LevelFunction <= 13 && Experience >= 140000): "Level up! "+token.name+" is now level 14!"]
[if(LevelFunction <= 14 && Experience >= 165000): "Level up! "+token.name+" is now level 15!"]
[if(LevelFunction <= 15 && Experience >= 195000): "Level up! "+token.name+" is now level 16!"]
[if(LevelFunction <= 16 && Experience >= 225000): "Level up! "+token.name+" is now level 17!"]
[if(LevelFunction <= 17 && Experience >= 265000): "Level up! "+token.name+" is now level 18!"]
[if(LevelFunction <= 18 && Experience >= 305000): "Level up! "+token.name+" is now level 19!"]
[if(LevelFunction <= 19 && Experience >= 355000): "Level up! "+token.name+" is now level 20!"]</span></b>