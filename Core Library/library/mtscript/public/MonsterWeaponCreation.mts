[h:monsterCreationHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+currentToken()+"'><tr id='rowWeaponName'><th><label for='DisplayName'>Weapon Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h:AllWeaponTypes = json.append("","NaturalWeapon","Club","Dagger","Greatclub","Handaxe","Javelin","LightHammer","Mace","Quarterstaff","Sickle","Spear","LightCrossbow","Dart","Shortbow","Sling","Battleaxe","Flail","Glaive","Greataxe","Greatsword","Halberd","Lance","Longsword","Maul","Morningstar","Pike","Rapier","Scimitar","Shortsword","Trident","WarPick","Warhammer","Whip","Blowgun","HandCrossbow","HeavyCrossbow","Longbow","Net","Other")]
[h:WeaponTypeOptions = ""]
[h,foreach(tempWeapon,AllWeaponTypes): WeaponTypeOptions = WeaponTypeOptions + "<option value='"+tempWeapon+"'>"+tempWeapon+"</option>"]
[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponType'><th><label for='WeaponType'>Weapon Type:</label></th><td><select id='WeaponType' name='WeaponType'>"+WeaponTypeOptions+"</select></td></tr>"]
[h:"<!-- TODO: Add function for automatically setting base info of these weapon types once items are fully fleshed out -->"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponClass'><th><label for='WeaponClass'>Weapon Class:</label></th><td><select id='WeaponClass' name='WeaponClass'><option value='NaturalWeapon'>Natural Weapon</option><option value='Simple'>Simple</option><option value='Martial'>Martial</option><option value='Exotic'>Exotic</option></select></td></tr>"]

[h:StatOptions = ""]
[h,foreach(tempStat,pm.GetAttributes()): StatOptions = StatOptions + "<option value='"+json.get(tempStat,"Name")+"'>"+json.get(tempStat,"DisplayName")+"</option>"]
[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponStat'><th><label for='WeaponStat'>Main Stat:</label></th><td><select id='WeaponStat' name='WeaponStat'>"+StatOptions+"</select></td></tr>"]

[h:DamageTypeOptions = ""]
[h,foreach(tempDamageType,pm.GetDamageTypes()): DamageTypeOptions = DamageTypeOptions + "<option value='"+json.get(tempDamageType,"Name")+"'>"+json.get(tempDamageType,"DisplayName")+"</option>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponDamage'><th><label for='WeaponDamageDie'>Weapon Damage:</label></th><td><input type='number' id='WeaponDamageNumber' name='WeaponDamageNumber' min=1 value=1 style='width:25px'> d <input type='number' id='WeaponDamageDie' name='WeaponDamageDie' min=1 value=6 style='width:25px'><select id='WeaponDamageType' name='WeaponDamageType'>"+DamageTypeOptions+"</select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponAddDmgMod'><th><label for='WeaponAddDmgMod'>Add Stat Modifier to Damage?</label></th><td><input type='checkbox' id='WeaponAddDmgMod' name='WeaponAddDmgMod' checked></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponDamage2'><th><label for='WeaponDamageDie2'>Second Damage Type:</label></th><td><input type='number' id='WeaponDamageNumber2' name='WeaponDamageNumber2' min=0 value=0 style='width:25px'> d <input type='number' id='WeaponDamageDie2' name='WeaponDamageDie2' min=1 value=6 style='width:25px'><select id='WeaponDamageType2' name='WeaponDamageType2'><option value=''>None</option>"+DamageTypeOptions+"</select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponMagicBonus'><th><label for='WeaponMagicBonus'>Magic Bonus:</label></th><td><input type='number' id='WeaponMagicBonus' name='WeaponMagicBonus' min='0' value='0' style='width:25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponMeleeRanged'><th><label for='WeaponMeleeRanged'>Range Type:</label></th><td><select id='WeaponMeleeRanged' name='WeaponMeleeRanged' onchange='toggleReachRanged()'><option value='Melee'>Melee</option><option value='Ranged'>Ranged</option><option value='Both'>Both</option></select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponReach'><th><label for='WeaponReach'>Reach:</label></th><td><input type='number' id='WeaponReach' name='WeaponReach' min='0' value='5' style='width:25px'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowWeaponCritThresh'><th><label for='WeaponCritThresh'>Critical Threshhold:</label></th><td><input type='number' id='WeaponCritThresh' name='WeaponCritThresh' max='20' min='0' value='20'></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr id='rowSpecialEffects'><th><label for='SpecialEffects'>Has Special Effects?</label></th><td><select id='SpecialEffects' name='SpecialEffects'><option value='None'>None</option><option value='SameSubeffect'>Occur on Hit</option><option value='NewSubeffect'>Additional Resolution on Hit</option><option value='Mixed'>Mix of Both</option></select></td></tr>"]

[h:monsterCreationHTML = monsterCreationHTML + "<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("MonsterWeaponCreation","lib://pm.a5e.core/MonsterWeaponCreation.html?cachelib=false","value="+base64.encode(monsterCreationHTML)+"; closebutton=0; width=450; height=1050")]