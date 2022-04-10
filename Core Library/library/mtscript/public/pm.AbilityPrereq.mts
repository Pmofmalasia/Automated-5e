[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h:pm.PrereqHeader=arg(1)]
[h:pm.PrereqMet=arg(2)]

[h:miRemovePrereq=json.path.read(MagicItemClassBonuses,"[?(@.IsActive>0 && @.Ability=='"+pm.Ability+"' && @.Class=='"+pm.Class+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass=='') && @.RemovePrereqs==1)]")]
[h:pm.PrereqMetFinal=if(or(pm.PrereqMet==1,miRemovePrereq!="[]"),1,0)]

[h:macro.return = json.set("","ShowIfCondensed",0,"Header",pm.PrereqHeader,"FalseHeader","","FullContents","","RulesContents"," "+if(pm.PrereqMet,"Yes",if(miRemovePrereq=="[]","No","Yes, from a magic item")),"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.PrereqMetFinal,"Units","")]