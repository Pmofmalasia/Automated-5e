[h:SubeffectData = arg(0)]
[h:AHLTier = arg(1)]

[h:AoEDisplay = ""]
[h:"<!-- TODO:AoE Temporary while AOE is being fully implemented (in MT, not by me) -->"]
[h,if(json.contains(SubeffectData,"AoE")),CODE:{
	[h:subeffect.AoEData = json.get(SubeffectData,"AoE")]
	[h:AoEUnits = json.get(subeffect.AoEData,"SizeUnits")]
	[h,switch(AoEUnits):
		case "Feet": AoEUnitsDisplay = "foot";
		case "Miles": AoEUnitsDisplay = "mile";
		default: AoEUnitsDisplay = AoEUnits;
	]
	[h,switch(json.get(subeffect.AoEData,"Shape")),CODE:
		case "Cone":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
			[h:AoEDisplay = temp.RangeBonus + "-" + AoEUnitsDisplay + " " + json.get(subeffect.AoEData,"Shape")]
		};
		case "Cube":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
			[h:AoEDisplay = temp.RangeBonus + "-" + AoEUnitsDisplay + " " + json.get(subeffect.AoEData,"Shape")]
		};
		case "Cylinder":{
			[h:temp.RangeBonus = max(json.get(subeffect.AoEData,"RadiusValue"),json.get(subeffect.AoEData,"HeightValue"))]
			[h:AoEDisplay = json.get(subeffect.AoEData,"RadiusValue") + " " + AoEUnitsDisplay + " radius x " + json.get(subeffect.AoEData,"HeightValue") + " " + AoEUnitsDisplay + " height " + " " + json.get(subeffect.AoEData,"Shape")]
		};
		case "HalfSphere":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
			[h:AoEDisplay = temp.RangeBonus + "-" + AoEUnitsDisplay + " " + "Half-Sphere"]
		};
		case "Line":{
			[h:temp.RangeBonus = max(json.get(subeffect.AoEData,"LengthValue"),json.get(subeffect.AoEData,"WidthValue"))]
			[h:AoEDisplay = json.get(subeffect.AoEData,"LengthValue") + " " + AoEUnitsDisplay + " length x " + json.get(subeffect.AoEData,"WidthValue") + " " + AoEUnitsDisplay + " width " + " " + json.get(subeffect.AoEData,"Shape")]
		};
		case "Panels":{










			[h:"<!-- panel size x number of panels -->"]











			[h:temp.RangeBonus = 0]
			[h:AoEDisplay = json.get(subeffect.AoEData,"LengthValue") + " " + AoEUnitsDisplay + " length x " + json.get(subeffect.AoEData,"WidthValue") + " " + AoEUnitsDisplay + " width " + " " + json.get(subeffect.AoEData,"Shape")]
		};
		case "Sphere":{
			[h:temp.RangeBonus = json.get(subeffect.AoEData,"SizeValue")]
			[h:AoEDisplay = temp.RangeBonus + "-" + AoEUnitsDisplay + " " + json.get(subeffect.AoEData,"Shape")]
		};
		case "Wall":{
			[h:temp.RangeBonus = max(json.get(subeffect.AoEData,"LengthValue"),json.get(subeffect.AoEData,"WidthValue"),json.get(subeffect.AoEData,"HeightValue"))]
			[h:AoEDisplay = json.get(subeffect.AoEData,"LengthValue") + " " + AoEUnitsDisplay + " length x " + json.get(subeffect.AoEData,"WidthValue") + " " + AoEUnitsDisplay + " width x " + json.get(subeffect.AoEData,"HeightValue") + " " + AoEUnitsDisplay + " height " + json.get(subeffect.AoEData,"Shape")]
		};
		default:{
			[h:temp.RangeBonus = 0]
		}
	]
	[h,if(AoEUnits == "Miles"): temp.RangeBonus = temp.RangeBonus * 5280]
};{
	[h:temp.RangeBonus = 0]
}]

[h:subeffect.RangeData = json.get(SubeffectData,"Range")]
[h:subeffect.RangeType = json.get(SubeffectData,"RangeType")]
[h,if(subeffect.RangeType == "SelfRanged" || subeffect.RangeType == "Ranged"),CODE:{
	[h,if(json.get(subeffect.RangeData,"AHLScaling")>0):
		subeffect.AHLRange = json.get(subeffect.RangeData,"AHLValue") * floor(AHLTier / json.get(subeffect.RangeData,"AHLScaling"));
		subeffect.AHLRange = 0
	]
	[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",json.get(subeffect.RangeData,"Value") + subeffect.AHLRange + temp.RangeBonus)]

	[h,if(subeffect.RangeType == "SelfRanged"):
		subeffect.RangeDisplay = "Self ("+(json.get(subeffect.RangeData,"Value") - temp.RangeBonus)+" "+json.get(subeffect.RangeData,"Units")+")";
		subeffect.RangeDisplay = "Range "+(json.get(subeffect.RangeData,"Value") - temp.RangeBonus)+" "+json.get(subeffect.RangeData,"Units")
	]
};{
	[h,if(subeffect.RangeType == "Touch"),CODE:{
		[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",5 + temp.RangeBonus,"Units","Feet")]
		[h:subeffect.RangeDisplay = "Touch"]
	};{
		[h:subeffect.RangeData = "{}"]
		[h:subeffect.RangeDisplay = "Prior Target"]
	}]

	[h,if(subeffect.RangeType == "Self"),CODE:{
		[h:subeffect.RangeData = json.set(subeffect.RangeData,"Value",0 + temp.RangeBonus,"Units","Feet")]
		[h:subeffect.RangeDisplay = "Self"]
	};{}]
}]

[h,if(AoEDisplay == ""):
	finalRangeDisplay = subeffect.RangeDisplay;
	finalRangeDisplay = subeffect.RangeDisplay + " ("+AoEDisplay+")"
]

[h,if(!json.isEmpty(subeffect.RangeData) || json.contains(SubeffectData,"AoE")):
	rangeTableLine = json.set("",
		"ShowIfCondensed",0,
		"Header","Range",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",finalRangeDisplay,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']");
	rangeTableLine = ""
]

[h:returnData = json.set("",
	"Table",rangeTableLine,
	"Data",subeffect.RangeData
)]
[h:return(0,returnData)]