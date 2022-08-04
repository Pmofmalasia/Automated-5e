[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h:pm.MagItemTable="[]"]

[h,foreach(item,MagicItemClassBonuses),CODE:{
	[h:pm.MagItemTable=if(and(json.get(item,"IsActive")>0,json.get(item,"Ability")==pm.Ability,json.get(item,"Class")==pm.Class,json.get(item,"Message")!=""),json.append(pm.MagItemTable,json.set("","ShowIfCondensed",1,"Header",json.get(MagicItemNames,roll.count),"False Header","Item Effect","FullContents","","RulesContents",json.get(item,"Message"),"RollContents","","DisplayOrder","['Full','Rules','Roll']")),pm.MagItemTable)]
}]

[h:macro.return = pm.MagItemTable]