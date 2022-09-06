[h:Choices1=json.get(MaxSpellSlots,"1")]
[h:Choices2=json.get(MaxSpellSlots,"2")]
[h:Choices3=json.get(MaxSpellSlots,"3")]
[h:Choices4=json.get(MaxSpellSlots,"4")]
[h:Choices5=json.get(MaxSpellSlots,"5")]
[h:Choices6=json.get(MaxSpellSlots,"6")]
[h:Choices7=json.get(MaxSpellSlots,"7")]
[h:Choices8=json.get(MaxSpellSlots,"8")]
[h:Choices9=json.get(MaxSpellSlots,"9")]

[h:ChoicesList1=""]
[h:ChoicesList2=""]
[h:ChoicesList3=""]
[h:ChoicesList4=""]
[h:ChoicesList5=""]
[h:ChoicesList6=""]
[h:ChoicesList7=""]
[h:ChoicesList8=""]
[h:ChoicesList9=""]

[h:RecoveredSlots1=0]
[h:RecoveredSlots2=0]
[h:RecoveredSlots3=0]
[h:RecoveredSlots4=0]
[h:RecoveredSlots5=0]
[h:RecoveredSlots6=0]
[h:RecoveredSlots7=0]
[h:RecoveredSlots8=0]
[h:RecoveredSlots9=0]

[h,count(Choices1+1),CODE:{
	[h:ChoicesList1=if(ChoicesList1=="",ChoicesList1,ChoicesList1+",")]
	[h:ChoicesList1=ChoicesList1+roll.count]
}]
[h,count(Choices2+1),CODE:{
	[h:ChoicesList2=if(ChoicesList2=="",ChoicesList2,ChoicesList2+",")]
	[h:ChoicesList2=ChoicesList2+roll.count]
}]

[h,count(Choices3+1),CODE:{
	[h:ChoicesList3=if(ChoicesList3=="",ChoicesList3,ChoicesList3+",")]
	[h:ChoicesList3=ChoicesList3+roll.count]
}]

[h,count(Choices4+1),CODE:{
	[h:ChoicesList4=if(ChoicesList4=="",ChoicesList4,ChoicesList4+",")]
	[h:ChoicesList4=ChoicesList4+roll.count]
}]

[h,count(Choices5+1),CODE:{
	[h:ChoicesList5=if(ChoicesList5=="",ChoicesList5,ChoicesList5+",")]
	[h:ChoicesList5=ChoicesList5+roll.count]
}]

[h,count(Choices6+1),CODE:{
	[h:ChoicesList6=if(ChoicesList6=="",ChoicesList6,ChoicesList6+",")]
	[h:ChoicesList6=ChoicesList6+roll.count]
}]

[h,count(Choices7+1),CODE:{
	[h:ChoicesList7=if(ChoicesList7=="",ChoicesList7,ChoicesList7+",")]
	[h:ChoicesList7=ChoicesList7+roll.count]
}]

[h,count(Choices8+1),CODE:{
	[h:ChoicesList8=if(ChoicesList8=="",ChoicesList8,ChoicesList8+",")]
	[h:ChoicesList8=ChoicesList8+roll.count]
}]

[h,count(Choices9+1),CODE:{
	[h:ChoicesList9=if(ChoicesList9=="",ChoicesList9,ChoicesList9+",")]
	[h:ChoicesList9=ChoicesList9+roll.count]
}]

[h:SlotOptions1=if(Choices1==0,"","RecoveredSlots1|"+ChoicesList1+"|Level 1 Slots ("+json.get(SpellSlots,'1')+"/"+json.get(MaxSpellSlots,'1')+") |LIST|SELECT="+json.get(SpellSlots,'1')+"")]
[h:SlotOptions2=if(Choices2==0,"","RecoveredSlots2|"+ChoicesList2+"|Level 2 Slots ("+json.get(SpellSlots,'2')+"/"+json.get(MaxSpellSlots,'2')+") |LIST|SELECT="+json.get(SpellSlots,'2')+"")]
[h:SlotOptions3=if(Choices3==0,"","RecoveredSlots3|"+ChoicesList3+"|Level 3 Slots ("+json.get(SpellSlots,'3')+"/"+json.get(MaxSpellSlots,'3')+") |LIST|SELECT="+json.get(SpellSlots,'3')+"")]
[h:SlotOptions4=if(Choices4==0,"","RecoveredSlots4|"+ChoicesList4+"|Level 4 Slots ("+json.get(SpellSlots,'4')+"/"+json.get(MaxSpellSlots,'4')+") |LIST|SELECT="+json.get(SpellSlots,'4')+"")]
[h:SlotOptions5=if(Choices5==0,"","RecoveredSlots5|"+ChoicesList5+"|Level 5 Slots ("+json.get(SpellSlots,'5')+"/"+json.get(MaxSpellSlots,'5')+") |LIST|SELECT="+json.get(SpellSlots,'5')+"")]
[h:SlotOptions6=if(Choices6==0,"","RecoveredSlots6|"+ChoicesList6+"|Level 6 Slots ("+json.get(SpellSlots,'6')+"/"+json.get(MaxSpellSlots,'6')+") |LIST|SELECT="+json.get(SpellSlots,'6')+"")]
[h:SlotOptions7=if(Choices7==0,"","RecoveredSlots7|"+ChoicesList7+"|Level 7 Slots ("+json.get(SpellSlots,'7')+"/"+json.get(MaxSpellSlots,'7')+") |LIST|SELECT="+json.get(SpellSlots,'7')+"")]
[h:SlotOptions8=if(Choices8==0,"","RecoveredSlots8|"+ChoicesList8+"|Level 8 Slots ("+json.get(SpellSlots,'8')+"/"+json.get(MaxSpellSlots,'8')+") |LIST|SELECT="+json.get(SpellSlots,'8')+"")]
[h:SlotOptions9=if(Choices9==0,"","RecoveredSlots9|"+ChoicesList9+"|Level 9 Slots ("+json.get(SpellSlots,'9')+"/"+json.get(MaxSpellSlots,'9')+") |LIST|SELECT="+json.get(SpellSlots,'9')+"")]

[h:NRChoice=input(
	"junkVar|Number of Slots|Spell Level|LABEL",
	""+SlotOptions1+"",
	""+SlotOptions2+"",
	""+SlotOptions3+"",
	""+SlotOptions4+"",
	""+SlotOptions5+"",
	""+SlotOptions6+"",
	""+SlotOptions7+"",
	""+SlotOptions8+"",
	""+SlotOptions9+""
)]
[h:abort(NRChoice)]

[h:SpellSlots=json.set(SpellSlots,"1",RecoveredSlots1,"2",RecoveredSlots2,"3",RecoveredSlots3,"4",RecoveredSlots4,"5",RecoveredSlots5,"6",RecoveredSlots6,"7",RecoveredSlots7,"8",RecoveredSlots8,"9",RecoveredSlots9)]

<div style="background-color: #02F5F5; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px; width:400px">
	<b>Edit Spell Slots</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<b>The DM has edited [r:token.name]'s spell slots.</b><br>
		{dSpellSlots}
	</div>
</div>