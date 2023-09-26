[h:SpellData = json.path.read(data.getData("addon:","pm.a5e.core","sb.Spells"),"[*][?(@.Name=='"+arg(0)+"')]")]

[h,if(json.isEmpty(SpellData)): broadcast("Error: Spell "+arg(0)+" not found!"); SpellData = json.get(SpellData,0)]

[h:macro.return = SpellData]