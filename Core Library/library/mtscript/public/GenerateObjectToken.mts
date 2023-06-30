[h:objectData = macro.args]
[h,if(json.get(objectData,"FalseName")==""):
	NewObjectTokenName = json.get(objectData,"DisplayName");
	NewObjectTokenName = json.get(objectData,"FalseName")
]
[h:NewObjectTokenType = json.get(objectData,"Type")]

[h:IKnowWhatTheFuckImDoing = 0]
[h,if(IKnowWhatTheFuckImDoing),CODE:{
	[h:NewObjectImage = "ObjectImages/"+NewObjectTokenType+"/"+json.get(objectData,NewObjectTokenType+"Type")+".png"]
	[h:ImagePresentTest = js.evalURI("isAssetPresent","lib://pm.a5e.core/isAssetPresent.js",NewObjectImage)]
	[h,if(!ImagePresentTest): NewObjectImage = "asset://cae048d4f31ef38cac5ba0df1378c67d"]	
};{
	[h:BugIsFixed = 0]
	[h,if(BugIsFixed),CODE:{
		[h:NewObjectImage = "ObjectImages/"+NewObjectTokenType+"/"+json.get(objectData,NewObjectTokenType+"Type")+".PNG"]
		[h:AllAddonFiles = library.getContents("pm.a5e.core")]
		[h,if(json.contains(AllAddonFiles,"public/"+NewObjectImage)): 
			NewObjectImage = "lib://pm.a5e.core/"+NewObjectImage;
			NewObjectImage = "asset://cae048d4f31ef38cac5ba0df1378c67d"
		]		
	};{
		[h:NewObjectImage = "asset://cae048d4f31ef38cac5ba0df1378c67d"]
	}]

}]

[h:"<!-- TODO: get image from table based on token type -->"]

[h:NewObjectLocation = json.get(objectData,"Location")]
[h:NewObjectXCoord = json.get(NewObjectLocation,"X")]
[h:NewObjectYCoord = json.get(NewObjectLocation,"Y")]
[h,if(NewObjectYCoord == "" || NewObjectXCoord == ""),CODE:{
	[h:NewObjectLocationToken = json.get(NewObjectLocation,"Token")]
	[h:NewObjectXCoord = getTokenX(0,NewObjectLocationToken)]
	[h:NewObjectYCoord = getTokenY(0,NewObjectLocationToken)]
};{}]

[h:NewObjectTokenData = json.set("",
	"name",NewObjectTokenName,
	"tokenImage",NewObjectImage,
	"x",NewObjectXCoord,
	"y",NewObjectYCoord
)]
[h:NewObjectTokenID = createToken(NewObjectTokenData)]

[h:switchToken(NewObjectTokenID)]
[h:setProperty("a5e.stat.InventoryData",objectData)]

[h:objectSize = json.get(objectData,"Size")]
[h:setSize(objectSize)]

[h:setProperty("a5e.stat.Type",NewObjectTokenType)]

[h:setProperty("a5e.stat.Magical",json.get(objectData,"Magical"))]
[h:setProperty("a5e.stat.Flammable",json.get(objectData,"Flammable"))]
[h:setProperty("a5e.stat.Magnetic",json.get(objectData,"Magnetic"))]
[h:setProperty("a5e.stat.Weight",json.get(objectData,"Weight"))]
[h:setProperty("a5e.stat.Size",objectSize)]

[h:ObjectMaterials = json.get(objectData,"Materials")]
[h:MaterialTags = json.get(objectData,"MaterialTags")]
[h:ObjectTags = json.get(objectData,"ObjectTags")]
[h:setProperty("a5e.stat.Tags",json.merge(MaterialTags,ObjectMaterials,ObjectTags))]

[h:objectMainMaterial = json.get(objectData,"MainMaterial")]
[h:mainMaterialData = json.path.read(getLibProperty("sb.ObjectMaterials","Lib:pm.a5e.Core"),"[*][?(@.Name == '"+objectMainMaterial+"')]")]
[h,if(json.isEmpty(mainMaterialData)):
	setProperty("a5e.stat.AC","10");
	setProperty("a5e.stat.AC",json.get(json.get(mainMaterialData,0),"AC"))
]

[h,switch(json.get(objectData,"Integrity")+""+objectSize),CODE:
	case "ResilientDiminutive":{
		[h:objectMaxHP = 2]
		[h:objectHitDieNum = 1]
		[h:objectHitDieSize = 4]
	};
	case "ResilientTiny":{
		[h:objectMaxHP = 5]
		[h:objectHitDieNum = 2]
		[h:objectHitDieSize = 4]
	};
	case "ResilientSmall":{
		[h:objectMaxHP = 10]
		[h:objectHitDieNum = 3]
		[h:objectHitDieSize = 6]
	};
	case "ResilientMedium":{
		[h:objectMaxHP = 18]
		[h:objectHitDieNum = 4]
		[h:objectHitDieSize = 8]
	};
	case "ResilientLarge":{
		[h:objectMaxHP = 27]
		[h:objectHitDieNum = 5]
		[h:objectHitDieSize = 10]
	};
	case "ResilientHuge":{
		[h:objectMaxHP = 65]
		[h:objectHitDieNum = 10]
		[h:objectHitDieSize = 12]
	};
	case "ResilientGargantuan":{
		[h:objectMaxHP = 130]
		[h:objectHitDieNum = 20]
		[h:objectHitDieSize = 12]
	};
	case "ResilientColossal":{
		[h:objectMaxHP = 195]
		[h:objectHitDieNum = 30]
		[h:objectHitDieSize = 12]
	};
	case "FragileDiminutive":{
		[h:objectMaxHP = 1]
		[h:objectHitDieNum = 1]
		[h:objectHitDieSize = 1]
	};
	case "FragileTiny":{
		[h:objectMaxHP = 2]
		[h:objectHitDieNum = 1]
		[h:objectHitDieSize = 4]
	};
	case "FragileSmall":{
		[h:objectMaxHP = 3]
		[h:objectHitDieNum = 1]
		[h:objectHitDieSize = 6]
	};
	case "FragileMedium":{
		[h:objectMaxHP = 4]
		[h:objectHitDieNum = 1]
		[h:objectHitDieSize = 8]
	};
	case "FragileLarge":{
		[h:objectMaxHP = 5]
		[h:objectHitDieNum = 1]
		[h:objectHitDieSize = 10]
	};
	case "FragileHuge":{
		[h:objectMaxHP = 6]
		[h:objectHitDieNum = 1]
		[h:objectHitDieSize = 12]
	};
	case "FragileGargantuan":{
		[h:objectMaxHP = 13]
		[h:objectHitDieNum = 2]
		[h:objectHitDieSize = 12]
	};
	case "FragileColossal":{
		[h:objectMaxHP = 20]
		[h:objectHitDieNum = 3]
		[h:objectHitDieSize = 12]
	}
]
[h:setProperty("a5e.stat.MaxHP",objectMaxHP)]
[h:setProperty("a5e.stat.HP",objectMaxHP)]

[h,if(json.get(objectData,"isEffectRandom")==1),CODE:{
	[h:tempAbilityProps = json.set("",
		"applyToSelected",1,
		"autoExecute",1,
		"color",json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),"Item"),
		"command",'[h,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): '+json.set(objectData,"Effect",json.get(objectData,"Effects"),"ParentToken",NewObjectTokenID)+']',
		"fontColor",json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),"Item"),
		"group","Item Effects",
		"label",if(json.get(tempAbility,"DisplayName") == "",json.get(objectData,"DisplayName"),json.get(tempAbility,"DisplayName")),
		"minWidth",89,
		"playerEditable",0,
		"delim","json"
	)]
	[h:createMacro(tempAbilityProps)]
};{
	[h,foreach(tempAbility,json.get(objectData,"Effects")),CODE:{
		[h:tempAbilityProps = json.set("",
			"applyToSelected",1,
			"autoExecute",1,
			"color",json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),"Item"),
			"command",'[h,MACRO("ExecuteEffectBorder@Lib:pm.a5e.Core"): '+json.set(objectData,"Effect",json.append("",tempAbility),"ParentToken",NewObjectTokenID)+']',
			"fontColor",json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),"Item"),
			"group","Item Effects",
			"label",if(json.get(tempAbility,"DisplayName") == "",json.get(objectData,"DisplayName"),json.get(tempAbility,"DisplayName")),
			"minWidth",89,
			"playerEditable",0,
			"delim","json"
		)]
		[h:createMacro(tempAbilityProps)]
	}]
}]