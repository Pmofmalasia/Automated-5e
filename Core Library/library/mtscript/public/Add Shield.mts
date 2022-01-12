[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:ShieldName=json.get(macro.args,"ItemName")]
[h:MagicItemTest=json.get(macro.args,"MagicItem")]

[h:dShieldName=if(MagicItemTest,"junkVar|"+ShieldName+"|Shield Name|LABEL","ShieldName|--Name Here--|Shield Name")]

[h:AddShield=input(
	""+dShieldName+"",
	"MagicBonus|0,1,2,3,4,5|Magic Bonus|LIST"
)]
[h:abort(AddShield)]

[h:NewShield=json.set("","Name",ShieldName,"MagicBonus",MagicBonus,"ItemBuffs","")]

[h:Shield=json.append(Shield,NewShield)]

[h:EquipNew=input(
	"EquipAnswer|No,Yes|Would you like to equip "+ShieldName+"?|LIST"
)]
[h:abort(EquipNew)]

[h:Shield=if(EquipAnswer==1,json.set(Shield,0,json.length(Shield)-1),Shield)]

<div style="background-color: #f7ae27; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Add Shield</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:Flavor]</i>
		</div>
		[r:token.name] has acquired [r:if(EquipAnswer==1,"and equipped ","")]<b>[r:ShieldName]</b>!
		<table>
			<tr><td><b>Name: </b> </td><td> [r:ShieldName]</td></tr>
			[r:if(MagicBonus>0,"<tr><td><b>Magic Bonus: </b> </td><td> "+MagicBonus+"</td></tr>","")]
		</table>
	</div>
</div>