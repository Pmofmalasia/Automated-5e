[h:CurrentActiveSpells = getProperty("a5e.stat.ActiveSpells")]
[h:NoSpellsTest = json.isEmpty(CurrentActiveSpells)]
[h:assert(!NoSpellsTest,"<br>You do not have any active spells!",0)]

[h:SpellOptions = "[]"]
[h,foreach(spell,CurrentActiveSpells),CODE:{
	[h,foreach(effect,json.get(spell,"Effects")),CODE:{
		[h:SpellOptions = json.append(SpellOptions,json.get(effect,"DisplayName"))]
	}]
}]

[h:listSpells=""]

[h:
"<!--Object vs array distinction is because spells with a random ongoing effect need to be put in an array instead of an object-->"]

[h,foreach(spell,getProperty("a5e.stat.ActiveSpells")),CODE:{
	[h:MultiEffectTest = json.type(spell)]
	[h,if(MultiEffectTest == "Object"),CODE:{
		[h:listSpells=listAppend(listSpells,json.get(spell,"SpellName")+if(json.get(spell,"EffectName")=="",""," - "+json.get(spell,"EffectName")))]
	};{
		[h:listSpells=listAppend(listSpells,json.get(json.get(spell,0),"SpellName"))]
	}]
}]

[h:selectSpell=input(
	"sSelection | "+listSpells+" | Which spell effect is being used | RADIO ",
	"multiCast | 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | How many times is the effect triggered? | LIST ",
	"deleteTest | | Remove spell from list once used? | CHECK"
	)]
[h:abort(selectSpell)]

[h:ActiveSpellSend = json.append("",json.get(getProperty("a5e.stat.ActiveSpells"),sSelection))]

[r,count(multiCast+1),CODE:{
	[macro("SpellCasting@Lib:pm.a5e.Core"): ActiveSpellSend]
}]

[h:deleteTest=if(json.get(macro.return,"ChaosTest")>0,0,if(json.get(macro.return,"ChaosTest")<0,deleteTest,1))]

[h,if(deleteTest),CODE:{[h:setProperty("a5e.stat.ActiveSpells",json.remove(getProperty("a5e.stat.ActiveSpells"),sSelection))]};{}]