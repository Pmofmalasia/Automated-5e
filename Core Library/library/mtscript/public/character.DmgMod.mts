[h:DmgModStr=""][h:DmgModArray=arg(0)]

[h,foreach(dmgType,DmgModArray),CODE:{[h:DmgModStr=if(json.get(DmgModArray,dmgType)==0,DmgModStr,listAppend(DmgModStr,if(json.get(DmgModArray,dmgType)==1,"Non-Magical "+dmgType,if(json.get(DmgModArray,dmgType)==2,"Magical "+dmgType,dmgType))))]}]
[h:DmgModStr=if(startsWith(DmgModStr,"Bludgeoning, Slashing, Piercing, Acid, Cold, Fire, Force, Lightning, Necrotic, Poison, Psychic, Radiant, Thunder"),"All",DmgModStr)]
[h:DmgModStr=replace(DmgModStr,"Non-Magical Bludgeoning, Non-Magical Slashing, Non-Magical Piercing, Non-Magical Acid, Non-Magical Cold, Non-Magical Fire, Non-Magical Force, Non-Magical Lightning, Non-Magical Necrotic, Non-Magical Poison, Non-Magical Psychic, Non-Magical Radiant, Non-Magical Thunder","All Non-Magical")]
[h:DmgModStr=replace(DmgModStr,"Magical Bludgeoning, Magical Slashing, Magical Piercing, Magical Acid, Magical Cold, Magical Fire, Magical Force, Magical Lightning, Magical Necrotic, Magical Poison, Magical Psychic, Magical Radiant, Magical Thunder","All Magical")]
[h:DmgModStr=replace(DmgModStr,"Non-Magical Bludgeoning, Non-Magical Slashing, Non-Magical Piercing","Non-Magical Physical")]
[h:DmgModStr=replace(DmgModStr,"Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, Transmutation","Spells")]
[r:DmgModStr]