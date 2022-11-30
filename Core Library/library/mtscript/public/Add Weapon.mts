[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:WeaponName=json.get(macro.args,"ItemName")]
[h:MagicItemTest=json.get(macro.args,"MagicItem")]

[h:WeaponTypeList="Club,Dagger,Greatclub,Handaxe,Javelin,Light Hammer,Mace,Quarterstaff,Sickle,Spear,Light Crossbow,Dart,Shortbow,Sling,Battleaxe,Flail,Glaive,Greataxe,Greatsword,Halberd,Lance,Longsword,Maul,Morningstar,Pike,Rapier,Scimitar,Shortsword,Trident,War Pick,Warhammer,Whip,Blowgun,Hand Crossbow,Heavy Crossbow,Longbow,Net"]

[h:DamageTypeList="None,Acid,Bludgeoning,Cold,Fire,Force,Lightning,Necrotic,Piercing,Poison,Psychic,Radiant,Slashing,Thunder"]
[h:dWeaponName=if(MagicItemTest,"junkVar|"+WeaponName+"|Weapon Name | LABEL","WeaponName|--Name Here--|Weapon Name")]

[h:AddWeapon=input(
	""+dWeaponName+"",
	"WeaponTypeSelection|"+WeaponTypeList+",Custom|Select Weapon Type|LIST|VALUE=STRING",
	"MagicBonus|0,1,2,3,4,5|Magic Bonus|LIST",
	"SecDmg|0d1|Secondary Damage Die",
	"SecDmgType|"+DamageTypeList+"|Secondary Damage Type|LIST|VALUE=STRING",
	"wSpecial|0|Special Ability"
)]
[h:abort(AddWeapon)]

[h:MagicTest=if(or(MagicBonus>0,MagicItemTest==1),1,0)]
[Props=json.set("","Ammo",0,"Magic",0,"Finesse",0,"Heavy",0,"Light",0,"Loading",0,"Reach",0,"Thrown",0,"Two-Handed",0,"Versatile",0,"IntMod",0,"WisMod",0,"ChaMod",0,"DmgMod",1,"CastingFocus",0)]

[h,switch(WeaponTypeSelection),code:
	case "Club":{[wType="Club"][wDamageDie="1d4"][wDamageType="Bludgeoning"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Light",1)]};
	case "Dagger":{[wType="Dagger"][wDamageDie="1d4"][wDamageType="Piercing"][wRange="20/60"][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Finesse",1,"Light",1,"Thrown",1)]};
	case "Greatclub":{[wType="Greatclub"][wDamageDie="1d8"][wDamageType="Bludgeoning"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Two-Handed",1)]};
	case "Handaxe":{[wType="Handaxe"][wDamageDie="1d6"][wDamageType="Slashing"][wRange="20/60"][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Light",1,"Thrown",1)]};
	case "Javelin":{[wType="Javelin"][wDamageDie="1d6"][wDamageType="Piercing"][wRange="30/120"][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Thrown",1)]};
	case "Light Hammer":{[wType="Light Hammer"][wDamageDie="1d4"][wDamageType="Bludgeoning"][wRange="20/60"][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Light",1,"Thrown",1)]};
	case "Mace":{[wType="Mace"][wDamageDie="1d6"][wDamageType="Bludgeoning"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=Props]};
	case "Quarterstaff":{[wType="Quarterstaff"][wDamageDie="1d6"][wDamageType="Bludgeoning"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Versatile",1)]};
	case "Sickle":{[wType="Sickle"][wDamageDie="1d4"][wDamageType="Slashing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Light",1)]};
	case "Spear":{[wType="Spear"][wDamageDie="1d6"][wDamageType="Piercing"][wRange="20/60"][wReach="5"][wMeleeRanged="Melee"][wClass="Simple"][Props=json.set(Props,"Thrown",1,"Versatile",1)]};

	case "Light Crossbow":{[wType="Light Crossbow"][wDamageDie="1d8"][wDamageType="Piercing"][wRange="80/320"][wReach=""][wMeleeRanged="Ranged"][wClass="Simple"][Props=json.set(Props,"Ammo",1,"Loading",1,"Two-Handed",1)]};
	case "Dart":{[wType="Dart"][wDamageDie="1d4"][wDamageType="Piercing"][wRange="20/60"][wReach=""][wMeleeRanged="Ranged"][wClass="Simple"][Props=json.set(Props,"Finesse",1,"Thrown",1)]};
	case "Shortbow":{[wType="Shortbow"][wDamageDie="1d6"][wDamageType="Piercing"][wRange="80/320"][wReach=""][wMeleeRanged="Ranged"][wClass="Simple"][Props=json.set(Props,"Ammo",1,"Two-Handed",1)]};
	case "Sling":{[wType="Sling"][wDamageDie="1d4"][wDamageType="Bludgeoning"][wRange="30/120"][wReach=""][wMeleeRanged="Ranged"][wClass="Simple"][Props=json.set(Props,"Ammo",1)]};

	case "Battleaxe":{[wType="Battleaxe"][wDamageDie="1d8"][wDamageType="Slashing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Versatile",1)]};
	case "Flail":{[wType="Flail"][wDamageDie="1d8"][wDamageType="Bludgeoning"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=Props]};
	case "Glaive":{[wType="Glaive"][wDamageDie="1d10"][wDamageType="Slashing"][wRange=""][wReach="10"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Heavy",1,"Reach",1,"Two-Handed",1)]};
	case "Greataxe":{[wType="Greataxe"][wDamageDie="1d12"][wDamageType="Slashing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Heavy",1,"Two-Handed",1)]};
	case "Greatsword":{[wType="Greatsword"][wDamageDie="2d6"][wDamageType="Slashing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Heavy",1,"Two-Handed",1)]};
	case "Halberd":{[wType="Halberd"][wDamageDie="1d10"][wDamageType="Slashing"][wRange=""][wReach="10"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Heavy",1,"Reach",1,"Two-Handed",1)]};
	case "Lance":{[wType="Lance"][wDamageDie="1d12"][wDamageType="Piercing"][wRange=""][wReach="10"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Reach",1)]};
	case "Longsword":{[wType="Longsword"][wDamageDie="1d8"][wDamageType="Slashing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Versatile",1)]};
	case "Maul":{[wType="Maul"][wDamageDie="2d6"][wDamageType="Bludgeoning"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Heavy",1,"Two-Handed",1)]};
	case "Morningstar":{[wType="Morningstar"][wDamageDie="1d8"][wDamageType="Piercing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=Props]};
	case "Pike":{[wType="Pike"][wDamageDie="1d10"][wDamageType="Piercing"][wRange=""][wReach="10"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Heavy",1,"Reach",1,"Two-Handed",1)]};
	case "Rapier":{[wType="Rapier"][wDamageDie="1d8"][wDamageType="Piercing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Finesse",1)]};
	case "Scimitar":{[wType="Scimitar"][wDamageDie="1d6"][wDamageType="Slashing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Finesse",1)]};
	case "Shortsword":{[wType="Shortsword"][wDamageDie="1d6"][wDamageType="Piercing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Finesse",1,"Light",1)]};
	case "Trident":{[wType="Trident"][wDamageDie="1d6"][wDamageType="Piercing"][wRange="20/60"][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Thrown",1,"Versatile",1)]};
	case "War Pick":{[wType="War Pick"][wDamageDie="1d8"][wDamageType="Piercing"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=Props]};
	case "Warhammer":{[wType="Warhammer"][wDamageDie="1d8"][wDamageType="Bludgeoning"][wRange=""][wReach="5"][wMeleeRanged="Melee"][wClass="Martial"][Props=json.set(Props,"Versatile",1)]};
	case "Whip":{[wType="Whip"][wDamageDie="1d4"][wDamageType="Slashing"][wRange=""][wReach="10"][wMeleeRanged="Melee"][wClass="Martial"][json.set(Props,"Finesse",1,"Reach",1)]};

	case "Blowgun":{[wType="Blowgun"][wDamageDie="1d1"][wDamageType="Piercing"][wRange="25/100"][wReach=""][wMeleeRanged="Ranged"][wClass="Martial"][Props=json.set(Props,"Ammo",1,"Loading",1)]};
	case "Hand Crossbow":{[wType="Hand Crossbow"][wDamageDie="1d6"][wDamageType="Piercing"][wRange="30/120"][wReach=""][wMeleeRanged="Ranged"][wClass="Martial"][Props=json.set(Props,"Ammo",1,"Light",1,"Loading",1)]};
	case "Heavy Crossbow":{[wType="Heavy Crossbow"][wDamageDie="1d10"][wDamageType="Piercing"][wRange="100/400"][wReach=""][wMeleeRanged="Ranged"][wClass="Martial"][Props=json.set(Props,"Ammo",1,"Heavy",1,"Loading",1,"Two-Handed",1)]};
	case "Longbow":{[wType="Longbow"][wDamageDie="1d8"][wDamageType="Piercing"][wRange="150/600"][wReach=""][wMeleeRanged="Ranged"][wClass="Martial"][Props=json.set(Props,"Ammo",1,"Heavy",1,"Two-Handed",1)]};
	case "Net":{[wType="Net"][wDamageDie="0d1"][wDamageType="Bludgeoning"][wRange="5/15"][wReach=""][wMeleeRanged="Ranged"][wClass="Martial"][Props=json.set(Props,"Thrown",1)][wSpecial="A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net.<br>When you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make."]};
	case "Custom":{}
]

[h:wCritRange=0]
[h:wCritDie=0]

[h,if(WeaponTypeSelection=="Custom"),code:{
	[CustomData=input(
		"WeaponName|"+WeaponName+"|Weapon Name",
		"wType|Custom,"+WeaponTypeList+"|Weapon Type|LIST|VALUE=STRING",
		"wDamageDie|0d1|Damage Die",
		"wDamageType|"+DamageTypeList+"|Damage Type|LIST|VALUE=STRING",
		"wMeleeRanged|Melee,Ranged|Melee or Ranged Weapon|LIST|VALUE=STRING",
		"wClass|Simple,Martial,Improvised|Simple, Martial, or Improvised|LIST|VALUE=STRING",
		"wRange|0|Range",
		"MagicBonus|0,1,2,3,4,5|Magic Bonus|LIST|SELECT="+MagicBonus,
		"SecDmg|"+SecDmg+"|Secondary Damage Die",
		"SecDmgType|"+DamageTypeList+"|Secondary Damage Type|LIST|VALUE=STRING SELECT="+listFind(DamageTypeList,SecDmgType),
		"wCritRange|0,1,2,3,4,5|Additional Crit Range|LIST",
		"wCritDie|0,1,2,3,4,5|Bonus Crit Die|LIST",
		"wSpecial|0|Special Ability",
		"wAmmunition||Ammunition|CHECK",
		"wFinesse||Finesse|CHECK",
		"wHeavy||Heavy|CHECK",
		"wLight||Light|CHECK",
		"wLoading||Loading|CHECK",
		"wMagical||Magical|CHECK",
		"wIsReach||Reach|CHECK",
		"wReach|0|Reach Distance",
		"wThrown||Thrown|CHECK",
		"wTwoHanded||Two-Handed|CHECK",
		"wVersatile||Versatile|CHECK",
		"wIntMod||Use Intelligence Modifier|CHECK",
		"wWisMod||Use Wisdom Modifier|CHECK",
		"wChaMod||Use Charisma Modifier|CHECK",
		"wDmgMod|1|Add Main Stat to Damage|CHECK"
	)]
	[abort(CustomData)]
	[h:MagicTest=if(or(MagicBonus>0,wMagical==1),1,0)]
	[h:Props=json.set("","Ammo",wAmmunition,"Magic",MagicTest,"Finesse",wFinesse,"Heavy",wHeavy,"Light",wLight,"Loading",wLoading,"Reach",wIsReach,"Thrown",wThrown,"Two-Handed",wTwoHanded,"Versatile",wVersatile,"IntMod",wIntMod,"WisMod",wWisMod,"ChaMod",wChaMod,"DmgMod",wDmgMod)]
}]
	
[h:SecDmg=if(or(SecDmg==0,substring(SecDmg,0,1)=="0",SecDmg==""),0,SecDmg)]
[h:wRange=if(or(wRange==0,wRange=="0",wRange==""),0,wRange)]
[h:wReach=if(or(wReach==0,wReach=="0",wReach==""),0,wReach)]

<!-- Note to self: check later if theres any reason why this uses changes all entries with 0 as the first character -->
[h:wSpecial=if(or(wSpecial==0,substring(string(wSpecial),0,1)=="0",wSpecial=="",wSpecial=="None"),"",wSpecial)]

[h:NewWeapon=json.set("","Name",WeaponName,"MagicBonus",MagicBonus,"Type",wType,"DamageDie",wDamageDie,"DamageType",wDamageType,"SecDamageDie",SecDmg,"SecDamageType",SecDmgType,"MeleeRanged",wMeleeRanged,"Range",wRange,"Class",wClass,"Reach",wReach,"CritRange",wCritRange,"CritMultiplier",wCritDie,"SpecialAbility",wSpecial,"Props",Props,"MagicItem",MagicItemTest,"ItemBuffs","[]")]

[h:setProperty("a5e.stat.Weapon",json.append(getProperty("a5e.stat.Weapon"),NewWeapon))]

[h:EquipNew=input(
	"EquipAnswer|No,Main Hand,Off Hand|Would you like to equip "+WeaponName+"?|LIST"
)]
[h:abort(EquipNew)]

[h:setProperty("a5e.stat.Weapon",if(EquipAnswer==1,json.set(getProperty("a5e.stat.Weapon"),0,json.length(getProperty("a5e.stat.Weapon"))-1),if(EquipAnswer==2,json.set(getProperty("a5e.stat.Weapon"),1,json.length(getProperty("a5e.stat.Weapon"))-1),getProperty("a5e.stat.Weapon"))))]

<div style="background-color: #f7ae27; color: #000000; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>Add Weapon</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:Flavor]</i>
		</div>
		[r:token.name] has acquired [r:if(EquipAnswer==1,"and equipped ","")]<b>[r:WeaponName]</b>!
		<table>
			<tr><td><b>Name: </b> </td><td> [r:WeaponName]</td></tr>
			[r:if(MagicBonus>0,"<tr><td><b>Magic Bonus: </b> </td><td> "+MagicBonus+"</td></tr>","")]
			<tr><td><b>Weapon Type: </b> </td><td> [r:WeaponTypeSelection]</td></tr>
			<tr><td><b>Damage Die: </b> </td><td> [r:wDamageDie]</td></tr>
			<tr><td><b>Damage Type: </b> </td><td> [r:wDamageType]</td></tr>
			[r:if(SecDmg==0,"","<tr><td><b>Secondary Damage: </b> </td><td> "+SecDmg+"</td></tr>")]
			[r:if(SecDmg==0,"","<tr><td><b>Secondary Damage Type: </b> </td><td> "+SecDmgType+"</td></tr>")]
			[r:if(wRange==0,"","<tr><td><b>Range: </b> </td><td> "+wRange+"</td></tr>")]
			[r:if(wCritRange==0,"","<tr><td><b>Expanded Crit Range: </b> </td><td> "+(20-wCritRange)+"-20</td></tr>")]
			[r:if(wCritDie==0,"","<tr><td><b>Bonus Crit Die: </b> </td><td> "+wCritDie+"</td></tr>")]
			[r:if(wSpecial=="","","<tr><td><b>Special Ability: </b> </td><td> "+wSpecial+"</td></tr>")]
		</table>
	</div>
</div>

[h:macro.return = json.remove(NewWeapon,"Name")]