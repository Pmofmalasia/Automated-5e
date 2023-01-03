[h:FeatureToSearch = arg(0)]

[h:macro.return = "@.Name == '"+json.get(FeatureToSearch,"Name")+"' && @.Class == '"+json.get(FeatureToSearch,"Class")+"' && @.Subclass == '"+json.get(FeatureToSearch,"Subclass")+"'"]