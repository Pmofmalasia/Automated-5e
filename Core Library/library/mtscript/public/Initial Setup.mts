[macro("Reset to Default@Lib:pm.a5e.Core"):""]
[macro("Add Basic Macros@Lib:pm.a5e.Core"):""]

[h:StatList="18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3"]

[h:RaceArray = pm.GetRaces()]
[h:RaceOptions = json.toList(json.path.read(RaceArray,"[*].DisplayName"))]

[h:AttributeList = pm.GetAttributes()]
[h:AttributeInput = ""]
[h,foreach(TempAttribute,AttributeList): AttributeInput = listAppend(AttributeInput," "+json.get(TempAttribute,"Name")+"Choice | "+StatList+" | "+json.get(TempAttribute,"DisplayName")+" | LIST | VALUE=STRING SELECT=8 ","##")]

[h:BasicInfo=input(
	"junkVar | "+getTokenImage()+" | New Character | LABEL | ICON=TRUE ",
	"CharName| "+token.name+" |Character Name",
	"junkVar|(Without Racial Bonuses)|Ability Score Rolls|LABEL",
	AttributeInput,
	"RaceSelection|"+RaceOptions+"|Choose Race|LIST",
	"junkVar|On next screen|Subrace|LABEL",
	"OrderSelection|Lawful,Neutral,Chaotic|Choose Order|LIST|VALUE=STRING",
	"MoralitySelection|Good,Neutral,Evil|Choose Morality|LIST|VALUE=STRING",
	"DeitySelection|"+Deity+"|Deity",
	"PC.Ally.Enemy|PC,Ally,Enemy,Neutral|What type of character is this|LIST"
)]
[h:abort(BasicInfo)]

[h:setName(CharName)]
[h,foreach(TempAttribute,AttributeList): baseAttributes = json.set(baseAttributes,json.get(TempAttribute,"Name"),eval(json.get(TempAttribute,"Name")+"Choice"))]
[h:Race=json.get(json.get(RaceArray,RaceSelection),"DisplayName")]
[h:Deity=DeitySelection]
[h:Alignment=json.set("","Morality",MoralitySelection,"Order",OrderSelection)]
[h:whichTeam=if(PC.Ally.Enemy==2,2,if(PC.Ally.Enemy==3,0,1))]

[h,macro("Race Selection@Lib:pm.a5e.Core"): json.get(RaceArray,RaceSelection)]
[h:lu.NewAbilities = macro.return]
[macro("Background Selection@Lib:pm.a5e.Core"):""]
[h:lu.NewAbilities = json.append(lu.NewAbilities,macro.return)]
[macro("Level Up@Lib:pm.a5e.Core"):lu.NewAbilities]