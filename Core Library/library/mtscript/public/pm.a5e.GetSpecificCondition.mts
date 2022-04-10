[h:cond.Name = arg(0)]
[h:cond.Class = arg(1)]
[h,if(argCount()>2): cond.Subclass = arg(2); cond.Subclass = ""]
[h:macro.return = json.get(json.path.read(getLibProperty("sb.Conditions","Lib:pm.a5e.Core"),"[?(@.Name=='"+cond.Name+"' && @.Class=='"+cond.Class+"' && @.Subclass=='"+cond.Subclass+"')]"),0)]