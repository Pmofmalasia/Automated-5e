[h:pr.Prereqs = arg(0)]
[h:ParentToken = json.get(pr.Prereqs,"ParentToken")]
[h:switchToken(ParentToken)]

[h:pr.ClassTest = if(json.get(pr.Prereqs,"Class")=="",1,0)]
[h:pr.SubclassTest = if(json.get(pr.Prereqs,"Subclass")=="",1,0)]
[h:pr.RaceTest = if(json.get(pr.Prereqs,"Race")=="",1,0)]
[h:pr.SubraceTest = if(json.get(pr.Prereqs,"Subrace")=="",1,0)]
[h:pr.AttrMetCount = 0]
[h:pr.FeatureTest = 1]

[h,if(json.get(pr.Prereqs,"Level")==""): pr.LevelTest = 1; pr.LevelTest = if(json.get(pr.Prereqs,"Level")>=getProperty("a5e.stat.Level")+pr.IsLevelUp,1,0)]

[h,if(json.get(pr.Prereqs,"Features")!=""),CODE:{
	[h:pr.FeatureNum = 0]
	[h,foreach(feature,json.get(pr.Prereqs,"Features")),CODE:{
		[h:pr.FeatureNum = pr.FeatureNum + !json.isEmpty(json.path.read(allAbilities,"[*][?(@.Name=='"+json.get(feature,"Name")+"' && @.Class=='"+json.get(feature,"Class")+"' && @.Subclass=='"+json.get(feature,"Subclass")+"')]"))]
	}]
	[h,if(json.get(pr.Prereqs,"FeatureNum")==0),CODE:{
		[h:pr.FeatureTest = pr.FeatureNum >= json.length(json.get(pr.Prereqs,"Features"))]
	};{
		[h:pr.FeatureTest = (pr.FeatureNum >= json.get(pr.Prereqs,"FeatureNum"))]
	}]
};{}]

[h,foreach(ClassPrereq,json.get(pr.Prereqs,"Class")): pr.ClassTest = if(json.get(getProperty("a5e.stat.ClassLevels"),ClassPrereq)==0 || json.get(getProperty("a5e.stat.ClassLevels"),ClassPrereq)=="",pr.ClassTest,1)]
[h:"<!-- Subclass processing subject to change -->"]
[h,foreach(SubclassPrereq,json.get(pr.Prereqs,"Subclass")): pr.SubclassTest = if(json.get(Subclasses,json.get(SubclassPrereq,"Class"))==json.get(SubclassPrereq,"Subclass"),1,pr.SubclassTest)]
[h,foreach(RacePrereq,json.get(pr.Prereqs,"Race")): pr.RaceTest = if(getProperty("a5e.stat.Race") == RacePrereq,1,pr.RaceTest)]
[h,foreach(SubracePrereq,json.get(pr.Prereqs,"Subrace")): pr.SubraceTest = if(getProperty("a5e.stat.Subrace") == SubracePrereq,1,pr.SubraceTest)]
[h:"<!-- json.intersection has the dual effect of removing the AllOrOne key from the attribute options AND removing attributes that are not indicated both in the prereqs AND currently enabled on Lib:pm.a5e.Core -->"]
[h,if(json.get(pr.Prereqs,"Attributes")==""): pr.AttrPrereqOptions = ""; pr.AttrPrereqOptions = json.intersection(json.fields(json.get(pr.Prereqs,"Attributes"),"json"),pm.GetAttributes("Name","json"))]
[h,foreach(attribute,pr.AttrPrereqOptions): pr.AttrMetCount = if(and(json.get(Attributes,attribute)>=json.get(json.get(pr.Prereqs,"Attributes"),attribute),json.get(json.get(pr.Prereqs,"Attributes"),attribute)>0),pr.AttrMetCount+1,pr.AttrMetCount)]
[h,if(json.get(pr.Prereqs,"Attributes")==""): pr.AttributeTest = 1; pr.AttributeTest = if(pr.AttrMetCount>=json.get(json.get(pr.Prereqs,"Attributes"),"AllOrOne"),1,0)]
[h:pr.Valid = if(and(pr.FeatureTest,pr.LevelTest,pr.ClassTest,pr.SubclassTest,pr.RaceTest,pr.SubraceTest,pr.AttributeTest),1,0)]

[h:macro.return = pr.Valid]