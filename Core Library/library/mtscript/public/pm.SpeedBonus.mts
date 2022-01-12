[r:if(or(Race=="Hill Dwarf",Race=="Mountain Dwarf",Race=="Lightfoot Halfling",Race=="Stout Halfling",Race=="Forest Gnome",Race=="Rock Gnome"),25,if(Race=="Wood Elf",35,30))]

[h:pm.SpeedBonus=0]
[h,foreach(ability,json.path.read(allAbilities,"[?(@.IsActive>0 && @.CallSpeedBonus==1)]")): evalMacro("[r:pm."+json.get(ability,"Name")+json.get(ability,"Class")+"('SpeedBonus')")]
[h:pm.SpeedBonus=pm.SpeedBonus+json.get(MagicItemStats,"iSpeedBonus")]
[h:macro.return=pm.SpeedBonus]

[r:if(or(getState("Restrained"),getState("Grappled"),getState("Gaseous Form"),Exhaustion>=5),0,if(json.get(MagicItemStats,"iSpeedSetOverride")==-1,max(floor((bSpeed+if(and(json.get(json.get(Armor,json.get(Armor,0)),"ArmorTier")!="Heavy",json.get(LClass,"LBrb")>4),10,0)+if(json.get(LClass,"LMnk")>1,10,0)+if(and(json.get(Armor,0)==1,json.get(Shield,0)==1,json.get(LClass,"LMnk")>0),(5*ceiling((json.get(LClass,"LMnk")-5)/4)),0)+if(json.get(Feats,"Mobile")==1,10,0)+if(getState("Longstrider"),10,0)+json.get(MagicItemStats,"iSpeedBonus"))*if(getState("Haste"),2,1)*json.get(MagicItemStats,"iSpeedMultiplier")*if(getState("Slow"),(1/2),1))

,json.get(MagicItemStats,"iSpeedSet")),json.get(MagicItemStats,"iSpeedSetOverride")))]