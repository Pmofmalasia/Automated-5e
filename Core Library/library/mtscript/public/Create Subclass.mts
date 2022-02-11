[h:abort(input(
	" sp.Name | -- Name Here -- | Enter subclass name ",
	" sp.Class | "+pm.GetClasses("DisplayName")+" | Choose an associated class | LIST | VALUE=STRING ",
	" sp.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the subclass from | LIST | VALUE=STRING ",
	" sp.Spellcasting |  | <html><span title='ONLY for access gained specifically via the subclass - e.g. Arcane Trickster. Must use the general pool of spell slots - so not if they can cast a spell using some other resource. Also does NOT include Warlocks.'>Does this subclass gain access to spellcasting using spell slots</span></html> | CHECK "
	))]

[h:sp.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(sp.Source)+"')]['Library']"),0)]

[h,if(sp.Spellcasting),CODE:{
	[h:pm.CreateSpellcastingClass(json.set("","Class",pm.RemoveSpecial(sp.Class),"Subclass",pm.RemoveSpecial(sp.Name),"Library",sp.SourcebookLib))]
};{}]

[h:setLibProperty("sb.Subclasses",json.append(getLibProperty("sb.Subclasses","Lib:"+sp.SourcebookLib),json.set("","Name",pm.RemoveSpecial(sp.Name),"DisplayName",sp.Name,"Class",pm.RemoveSpecial(sp.Class))),"Lib:"+sp.SourcebookLib)]

[r:sp.Class+" subclass "+sp.Name+" from the sourcebook "+sp.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]