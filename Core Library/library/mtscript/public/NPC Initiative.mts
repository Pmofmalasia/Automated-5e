[h:Roll1 = 1d20]
[h:Roll2 = 1d20]

[h:AdvRoll = if(Roll1>Roll2,Roll1,Roll2)]

[g,if(InitiativeAdvantage == 1), CODE:
{
<b>Initiative Rolled With Advantage:</b> [g:InitRoll=(AdvRoll+Initiative)] ([g:AdvRoll])
[h:addToInitiative()]
[h:setInitiative(InitRoll+(Dex/100))]
[h:sortInitiative()]
};{


<b>Initiative Rolled:</b> [g:InitRoll=(Roll1+Initiative)] ([g:Roll1])
[h:addToInitiative()]
[h:setInitiative(InitRoll+(Dex/100))]
[h:sortInitiative()]
}]