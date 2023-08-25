[h:SpellData = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][?(@.Name=='"+arg(0)+"')]")]

[h,if(json.isEmpty(SpellData)): broadcast("Error: Spell "+arg(0)+" not found!"); SpellData = json.get(SpellData,0)]

[h:macro.return = SpellData]