[h:cond.Name = arg(0)]
[h:cond.Class = arg(1)]
[h,if(argCount()>2): cond.Subclass = arg(2); cond.Subclass = ""]
[h:macro.return = json.get(json.path.read(data.getData("addon:","pm.a5e.core","sb.Conditions"),"[?(@.Name=='"+cond.Name+"' && @.Class=='"+cond.Class+"' && @.Subclass=='"+cond.Subclass+"')]"),0)]