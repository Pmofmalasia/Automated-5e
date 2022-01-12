[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:ArmorName=json.get(macro.args,"ItemName")]
[h:MagicItemTest=json.get(macro.args,"MagicItem")]

[h:ArmorTypeList="Padded,Leather,Studded Leather,Hide,Chain Shirt,Scale Mail,Breastplate,Half Plate,Ring Mail,Chain Mail,Splint,Plate,Custom"]
[h:dArmorName=if(MagicItemTest,"junkVar|"+ArmorName+"|Armor Name|LABEL","ArmorName|--Name Here--|Armor Name")]

[h:AddArmor=input(
	""+dArmorName+"",
	"ArmorTypeSelection|"+ArmorTypeList+"|Select Armor Type|LIST|VALUE=STRING",
	"MagicBonus|0,1,2,3,4,5|Magic Bonus|LIST"
)]
[h:abort(AddArmor)]

[h,switch(ArmorTypeSelection),code:
	case "Padded":{[armorAC=11][DexMax=99][StrReq=3][StealthDis=1][ArmorTier="Light"]};
	case "Leather":{[armorAC=11][DexMax=99][StrReq=3][StealthDis=0][ArmorTier="Light"]};
	case "Studded Leather":{[armorAC=12][DexMax=99][StrReq=3][StealthDis=0][ArmorTier="Light"]};
	case "Hide":{[armorAC=12][DexMax=2][StrReq=3][StealthDis=0][ArmorTier="Medium"]};
	case "Chain Shirt":{[armorAC=13][DexMax=2][StrReq=3][StealthDis=0][ArmorTier="Medium"]};
	case "Scale Mail":{[armorAC=14][DexMax=2][StrReq=3][StealthDis=1][ArmorTier="Medium"]};
	case "Breastplate":{[armorAC=14][DexMax=2][StrReq=3][StealthDis=0][ArmorTier="Medium"]};
	case "Half Plate":{[armorAC=15][DexMax=2][StrReq=3][StealthDis=1][ArmorTier="Medium"]};
	case "Ring Mail":{[armorAC=14][DexMax=0][StrReq=3][StealthDis=1][ArmorTier="Heavy"]};
	case "Chain Mail":{[armorAC=16][DexMax=0][StrReq=13][StealthDis=1][ArmorTier="Heavy"]};
	case "Splint":{[armorAC=17][DexMax=0][StrReq=15][StealthDis=1][ArmorTier="Heavy"]};
	case "Plate":{[armorAC=18][DexMax=0][StrReq=15][StealthDis=1][ArmorTier="Heavy"]};
	case "Custom":{[armorAC=11][DexMax=99][StrReq=3][StealthDis=1][ArmorTier=""]}
]

[h,if(ArmorTypeSelection=="Custom"),code:{
	[CustomData=input(
		"ArmorName|"+ArmorName+"|Armor Name",
		"ArmorTier| Light,Medium,Heavy |Armor Category|CHECK",
		"armorAC|11,12,13,14,15,16,17,18,19,20|Base AC|LIST|VALUE=STRING",
		"DexMax|No Limit,2,0|Maximum Dex Modifier|LIST|VALUE=STRING",
		"StrReq|None,10,11,12,13,14,15,16,17,18,19,20|Strength Requirement|LIST|VALUE=STRING",
		"StealthDis| |Stealth Disadvantage|CHECK",
		"MagicBonus|0,1,2,3,4,5|Magic Bonus|LIST"
	)]
	[abort(CustomData)]
	[armorAC=number(armorAC)]
	[DexMax=if(DexMax=="No Limit","99",DexMax)]
	[DexMax=number(DexMax)]
	[StrReq=if(StrReq=="None","3",StrReq)]
	[StrReq=number(StrReq)]
};{}]

[h:NewArmor=json.set("","Name",ArmorName,"MagicBonus",MagicBonus,"Type",ArmorTypeSelection,"ArmorTier",ArmorTier,"BaseAC",armorAC,"DexMax",DexMax,"StrReq",StrReq,"StealthDis",StealthDis,"MagicItem",MagicItemTest,"ItemBuffs","")]

[h:Armor=json.append(Armor,NewArmor)]

[h:EquipNew=input(
	"EquipAnswer|No,Yes|Would you like to equip "+ArmorName+"?|LIST"
)]
[h:abort(EquipNew)]

[h:Armor=if(EquipAnswer==1,json.set(Armor,0,json.length(Armor)-1),Armor)]

<div style="background-color: #f7ae27; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Add Armor</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:Flavor]</i>
		</div>
		[r:token.name] has acquired [r:if(EquipAnswer==1,"and equipped ","")]<b>[r:ArmorName]</b>!
		<table>
			<tr><td><b>Name: </b> </td><td> [r:ArmorName]</td></tr>
			[r:if(MagicBonus>0,"<tr><td><b>Magic Bonus: </b> </td><td> "+MagicBonus+"</td></tr>","")]
			<tr><td><b>Armor Type: </b> </td><td> [r:ArmorTypeSelection]</td></tr>
			<tr><td><b>Base AC: </b> </td><td> [r:armorAC]</td></tr>
			<tr><td><b>Max Dex Mod: </b> </td><td> [r:if(DexMax==99,"None",DexMax)]</td></tr>
			<tr><td><b>Strength Requirement: </b> </td><td> [r:StrReq]</td></tr>
			<tr><td><b>Stealth Disadvantage: </b> </td><td> [r:if(StealthDis==1,"Yes","No")]</td></tr>
		</table>
	</div>
</div>