[h:ft.Array = getLibProperty("sb.Feats","Lib:pm.a5e.Core")]
[h:ft.UseRestrictions = json.get(macro.args,"Restrictions")]
[h:ft.IsLevelUp = json.get(macro.args,"LevelUp")]
[h:ft.Valid = ""]

[h,foreach(feat,ft.Array),CODE:{
	[h,if(json.get(feat,"Prereqs")=="" || ft.UseRestrictions==0),CODE:{
		[h:ft.Valid = json.append(ft.Valid,feat)]
	};{
		[h:ft.Prereqs = json.get(feat,"Prereqs")]
		[h:ft.ClassTest = if(json.get(ft.Prereqs,"Class")=="",1,0)]
		[h:ft.SubclassTest = if(json.get(ft.Prereqs,"Subclass")=="",1,0)]
		[h:ft.RaceTest = if(json.get(ft.Prereqs,"Race")=="",1,0)]
		[h:ft.SubraceTest = if(json.get(ft.Prereqs,"Subrace")=="",1,0)]
		[h:ft.AttrMetCount = 0]
		[h,if(json.get(ft.Prereqs,"Level")==""): ft.LevelTest = 1; ft.LevelTest = if(json.get(ft.Prereqs,"Level")>=Level+ft.IsLevelUp,1,0)]
		[h,if(json.get(ft.Prereqs,"Ability")==""): ft.AbilityTest = 1; ft.AbilityTest = if(json.isEmpty(json.path.read(allAbilities,"[*][?(@.Name=='"+json.get(ft.Prereqs,"Ability")+"')]")),0,1)]
		[h,foreach(ClassPrereq,json.get(ft.Prereqs,"Class")): ft.ClassTest = if(json.get(LClass,ClassPrereq)==0 || json.get(LClass,ClassPrereq)=="",ft.ClassTest,1)]
		[h:"<!-- Subclass processing subject to change -->"]
		[h,foreach(SubclassPrereq,json.get(ft.Prereqs,"Subclass")): ft.SubclassTest = if(json.get(Subclasses,json.get(SubclassPrereq,"Class"))==json.get(SubclassPrereq,"Subclass"),1,ft.SubclassTest)]
		[h,foreach(RacePrereq,json.get(ft.Prereqs,"Race")): ft.RaceTest = if(Race == json.get(ft.Prereqs,"Race"),1,ft.RaceTest)]
		[h,foreach(SubracePrereq,json.get(ft.Prereqs,"Subrace")): ft.SubraceTest = if(Subrace == json.get(ft.Prereqs,"Subrace"),1,ft.SubraceTest)]
		[h:"<!-- json.intersection has the dual effect of removing the AllOrOne key from the attribute options AND removing attributes that are not indicated both in the prereqs AND currently enabled on Lib:pm.a5e.Core -->"]
		[h,if(json.get(ft.Prereqs,"Attributes")==""): ft.AttrPrereqOptions = ""; ft.AttrPrereqOptions = json.intersection(json.fields(json.get(ft.Prereqs,"Attributes"),"json"),getLibProperty("sb.Attributes","Lib:pm.a5e.Core"))]
		[h,foreach(attribute,ft.AttrPrereqOptions): ft.AttrMetCount = if(and(json.get(Attributes,attribute)>=json.get(json.get(ft.Prereqs,"Attributes"),attribute),json.get(json.get(ft.Prereqs,"Attributes"),attribute)>0),ft.AttrMetCount+1,ft.AttrMetCount)]
		[h,if(json.get(ft.Prereqs,"Attributes")==""): ft.AttributeTest = 1; ft.AttributeTest = if(ft.AttrMetCount>=json.get(json.get(ft.Prereqs,"Attributes"),"AllOrOne"),1,0)]
		[h:ft.Valid = if(and(ft.AbilityTest,ft.LevelTest,ft.ClassTest,ft.SubclassTest,ft.RaceTest,ft.SubraceTest,ft.AttributeTest),json.append(ft.Valid,feat),ft.Valid)]
	}]
}]


[h,if(json.isEmpty(ft.Valid)),CODE:{
	[h:ft.Options = "No valid feats! Hit cancel to restart leveling."]
};{
	[h:ft.Valid = json.sort(ft.Valid,"a","DisplayName")]
	[h:ft.Options = json.toList(json.path.read(ft.Valid,"[*].DisplayName"))]
}]
[h:abort(input(
	if(Level == 0," junkVar | Note: All feats are displayed without restriction, as all decisions have not been applied to your character yet. |  | LABEL | SPAN=TRUE ## junkVar | Make sure to double-check that you have all prerequisites to your choice of feat. |  | LABEL | SPAN=TRUE ## junkVar | ------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE",""),
	" ft.Choice | "+ft.Options+" | Choose a feat | RADIO "
))]

[h:macro.return = json.get(ft.Valid,ft.Choice)]