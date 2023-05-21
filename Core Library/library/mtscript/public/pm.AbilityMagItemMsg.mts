[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h:pm.MagItemTable="[]"]

[h:"<!-- TODO: Consider re-adding this macro which added any messages a magic item would show after an ability is used -->"]

[h:macro.return = pm.MagItemTable]