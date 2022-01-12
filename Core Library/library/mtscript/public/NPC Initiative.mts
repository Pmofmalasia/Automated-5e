[h:Roll1 = 1d20]
[h:Roll2 = 1d20]

[h:AdvRoll = if(Roll1>Roll2,Roll1,Roll2)]

[g,if(InitiativeAdvantage == 1), CODE:
{
<b>Initiative Rolled With Advantage:</b> [g:InitRoll=(AdvRoll+Initiative)] ([g:AdvRoll])
[h:addToInitiative()]
[h:setInitiative(InitRoll+(json.get(AtrMods, "Dexterity")/100))]
[h:sortInitiative()]
};{


<b>Initiative Rolled:</b> [g:InitRoll=(Roll1+Initiative)] ([g:Roll1])
[h:addToInitiative()]
[h:setInitiative(InitRoll+(json.get(AtrMods, "Dexterity")/100))]
[h:sortInitiative()]
}]

[g,if(getPropertyType()=="Basic" || getPropertyType()=="BasicNPC"),code:{

	[g:if(json.get(LClass,"LBrd")>=20,if(BardicInspiration==0,"<br><b>Superior Inspiration:</b> Regain 1 charge of Bardic Inspiration.",""),"")][h:BardicInspiration=if(json.get(LClass,"LBrd")>=20,if(BardicInspiration==0,1,BardicInspiration),BardicInspiration)]
	[g:if(json.get(LClass,"LMnk")>=20,if(Ki==0,"<br><b>Perfect Self:</b> Regain 4 Ki points.",""),"")][h:Ki=if(json.get(LClass,"LMnk")>=20,if(Ki==0,4,Ki),Ki)]
	[g:if(json.get(FtrArchetype,"BtMr")==1,if(json.get(LClass,"LFtr")>=15,if(SuperiorityDice==0,"<br><b>Relentless:</b> Regain 1 superiority Die",""),""),"")][h:SuperiorityDice=if(json.get(FtrArchetype,"BtMr")==1,if(json.get(LClass,"LFtr")>=15,if(SuperiorityDice==0,1,SuperiorityDice),SuperiorityDice),SuperiorityDice)]
};{}]