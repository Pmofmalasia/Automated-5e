[h:NoSpellsTest=if(json.equals(ActiveSpells,'[]')==1,0,1)]

[h:assert(NoSpellsTest,"<br>You do not have any active spells!",0)]

[h:listSpells=""]

<!--Object vs array distinction is because spells with a random ongoing effect need to be put in an array instead of an object-->

[h,foreach(spell,ActiveSpells),CODE:{
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

[h:ActiveSpellSend = json.append("",json.get(ActiveSpells,sSelection))]

[r,count(multiCast+1),CODE:{
	[macro("SpellCasting@Lib:pm.a5e.Core"): ActiveSpellSend]
}]

[h:deleteTest=if(json.get(macro.return,"ChaosTest")>0,0,if(json.get(macro.return,"ChaosTest")<0,deleteTest,1))]

[h,if(deleteTest),CODE:{[h:ActiveSpells=json.remove(ActiveSpells,sSelection)]};{}]