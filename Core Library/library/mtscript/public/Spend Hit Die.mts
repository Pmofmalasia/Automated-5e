[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:Twelve=json.get(HitDice,"1d12")]
[h:Ten=json.get(HitDice,"1d10")]
[h:Eight=json.get(HitDice,"1d8")]
[h:Six=json.get(HitDice,"1d6")]

[h: HDChoice=input(
	"HDPick | 
		"+Twelve+" x 1d12,
		"+Ten+" x 1d10,
		"+Eight+" x 1d8,
		"+Six+" x 1d6
	 | Spend which Hit Die? | RADIO",
	"HealBonus | 0 | Bonus || WIDTH=5"
)]
[h:abort(HDChoice)]

[h,switch(HDPick),code:
	case 0:{[HitDie=12][HDSelect=Twelve][roll=1d12][heal=if(Twelve>0,roll+json.get(AtrMods, "Constitution")+HealBonus,0)][HitDice=json.set(HitDice,"1d12",max(Twelve-1,0))]};
	case 1:{[HitDie=10][HDSelect=Ten][roll=1d10][heal=if(Ten>0,roll+json.get(AtrMods, "Constitution")+HealBonus,0)][HitDice=json.set(HitDice,"1d10",max(Ten-1,0))]};
	case 2:{[HitDie=8][HDSelect=Eight][roll=1d8][heal=if(Eight>0,roll+json.get(AtrMods, "Constitution")+HealBonus,0)][HitDice=json.set(HitDice,"1d8",max(Eight-1,0))]};
	case 3:{[HitDie=6][HDSelect=Six][roll=1d6][heal=if(Six>0,roll+json.get(AtrMods, "Constitution")+HealBonus,0)][HitDice=json.set(HitDice,"1d6",max(Six-1,0))]}
]

<div style="background-color: #22AA22; color: #FFFFFF; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Spend Hit Die</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;"><i>{Flavor}</i></div>

		{token.name} {if(HDSelect>0,"spends a hit die and gains ","cannot spend any more hit dice of that type.")}{if(HDSelect>0,Min(heal,MaxHP-HP)+" ("+roll+")","")}{if(HDSelect>0," HP.","")}<br>
		Current HP: {HP=Min(HP+heal,MaxHP)}<br>
		Hit Dice Remaining: {dHitDice}
	</div>
</div>
[h:bar.Health = HP / MaxHP]