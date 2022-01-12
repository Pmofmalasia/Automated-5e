[h:LeveledClass=json.get(macro.args,"LeveledClass")]

[h:Achy=json.get(FightingStyle,"Achy")]
[h:Defn=json.get(FightingStyle,"Defn")]
[h:Duel=json.get(FightingStyle,"Duel")]
[h:GWFt=json.get(FightingStyle,"GWFt")]
[h:Prot=json.get(FightingStyle,"Prot")]
[h:TWFt=json.get(FightingStyle,"2WFt")]

[h:disAchy=if(Achy==1,"junkVar|Archery|Known|LABEL","")]
[h:disDefn=if(Defn==1,"junkVar|Defense|Known|LABEL","")]
[h:disDuel=if(Duel==1,"junkVar|Dueling|Known|LABEL","")]
[h:disGWFt=if(GWFt==1,"junkVar|Great Weapon Fighting|Known|LABEL","")]
[h:disProt=if(Prot==1,"junkVar|Protection|Known|LABEL","")]
[h:disTWFt=if(TWFt==1,"junkVar|Two-Weapon Fighting|Known|LABEL","")]

[h:StyleList="Archery,Defense,Dueling,Great Weapon Fighting,Protection,Two-Weapon Fighting"]

[h:StyleList=if(or(Achy==1,LeveledClass=="Paladin",LeveledClass=="Bard"),listDelete(StyleList,listFind(StyleList,"Archery")),StyleList)]
[h:StyleList=if(or(Defn==1,LeveledClass=="Bard"),listDelete(StyleList,listFind(StyleList,"Defense")),StyleList)]
[h:StyleList=if(Duel==1,listDelete(StyleList,listFind(StyleList,"Dueling")),StyleList)]
[h:StyleList=if(or(GWFt==1,LeveledClass=="Ranger",LeveledClass=="Bard"),listDelete(StyleList,listFind(StyleList,"Great Weapon Fighting")),StyleList)]
[h:StyleList=if(or(Prot==1,LeveledClass=="Ranger",LeveledClass=="Bard"),listDelete(StyleList,listFind(StyleList,"Protection")),StyleList)]
[h:StyleList=if(or(TWFt==1,LeveledClass=="Paladin"),listDelete(StyleList,listFind(StyleList,"Two-Weapon Fighting")),StyleList)]

[h:StyleSelect=input(
	""+disAchy+"",
	""+disDefn+"",
	""+disDuel+"",
	""+disGWFt+"",
	""+disProt+"",
	""+disTWFt+"",
	"StyleSelection|"+StyleList+"|Choose your Fighting Style|LIST|VALUE=STRING"
)]
[h:abort(StyleSelect)]

[h:FightingStyle=json.set(FightingStyle,"Achy",if(StyleSelection=="Archery",1,0),"Defn",if(StyleSelection=="Defense",1,0),"Duel",if(StyleSelection=="Dueling",1,0),"GWFt",if(StyleSelection=="Great Weapon Fighting",1,0),"Prot",if(StyleSelection=="Protection",1,0),"2WFt",if(StyleSelection=="Two-Weapon Fighting",1,0))]