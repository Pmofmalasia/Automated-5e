[h:TokenData = macro.args]
[h:token = json.get(TokenData,"Token")]
[h:thisTokenProperties = json.get(TokenData,"OldProps")]

[h:ComparisonProperties = json.append("","Attributes","Level","ClassLevels","Subclasses","Proficiency","Alignment","CreatureType","CreatureName","Race","Subrace","Size","Background","Languages","HP","MaxHP","MaxHitDice","AllSpeeds","AC","Saves","Skills","Tools","WeaponProficiencies","ArmorProficiencies","HeldItems","EquippedArmor","Inventory","ConditionList","MaxSpellSlots","CR","XP","whichTeam","Allegiance","Environments")]
[h,foreach(prop,ComparisonProperties): thisTokenProperties = json.set(thisTokenProperties,"a5e.stat."+prop,getProperty("a5e.stat."+prop,token))]
[h:thisTokenProperties = json.set(thisTokenProperties,
	"TokenID",token,
	"a5e.stat.CurrentSize",getSize(token)
)]

[h:return(0,thisTokenProperties)]