[h:SpellData = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][*][?(@.Name=='"+arg(0)+"')]")]

[h,if(json.isEmpty(SpellData)): broadcast("Error: Spell "+arg(0)+" not found!")]

[h:macro.return = json.sort(SpellData,"a","WhichEffect")]