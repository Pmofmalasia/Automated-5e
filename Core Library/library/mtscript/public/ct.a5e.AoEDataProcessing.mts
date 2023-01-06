[h,switch(arg(0)),CODE:
    case "Cone":{
        [h:coneDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"coneDimensionValue"),
            "SizeUnits",json.get(subeffectData,"coneDimensionUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"coneSizeAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            coneDimensions = json.set(coneDimensions,
                "AHLValue",json.get(subeffectData,"coneDimensionValueAHL"),
                "AHLScaling",shapeAHLScaling
            );
            coneDimensions = json.set(coneDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = coneDimensions]
        [h:subeffectData = json.remove(subeffectData,"coneDimensionValue")]
        [h:subeffectData = json.remove(subeffectData,"coneDimensionUnits")]
        [h:subeffectData = json.remove(subeffectData,"coneDimensionValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"coneSizeAHLScaling")]
    };
    case "Cube":{
        [h:cubeDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"cubeDimensionValue"),
            "SizeUnits",json.get(subeffectData,"cubeDimensionUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"cubeSizeAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            cubeDimensions = json.set(cubeDimensions,
                "AHLValue",json.get(subeffectData,"cubeDimensionValueAHL"),
                "AHLScaling",shapeAHLScaling
            );
            cubeDimensions = json.set(cubeDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = cubeDimensions]
        [h:subeffectData = json.remove(subeffectData,"cubeDimensionValue")]
        [h:subeffectData = json.remove(subeffectData,"cubeDimensionUnits")]
        [h:subeffectData = json.remove(subeffectData,"cubeDimensionValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"cubeSizeAHLScaling")]
    };
    case "Cylinder":{
        [h:cylinderDimensions = json.set("",
            "RadiusValue",json.get(subeffectData,"cylinderRadiusValue"),
            "RadiusUnits",json.get(subeffectData,"cylinderRadiusUnits"),
            "HeightValue",json.get(subeffectData,"cylinderHeightValue"),
            "HeightUnits",json.get(subeffectData,"cylinderHeightUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"cylinderSizeAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            cylinderDimensions = json.set(cylinderDimensions,
                "AHLRadiusValue",json.get(subeffectData,"cylinderRadiusValueAHL"),
                "AHLHeightValue",json.get(subeffectData,"cylinderHeightValueAHL"),
                "AHLScaling",shapeAHLScaling
            );
            cylinderDimensions = json.set(cylinderDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = cylinderDimensions]
        [h:subeffectData = json.remove(subeffectData,"cylinderRadiusValue")]
        [h:subeffectData = json.remove(subeffectData,"cylinderRadiusUnits")]
        [h:subeffectData = json.remove(subeffectData,"cylinderHeightValue")]
        [h:subeffectData = json.remove(subeffectData,"cylinderHeightUnits")]
        [h:subeffectData = json.remove(subeffectData,"cylinderRadiusValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"cylinderHeightValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"cylinderSizeAHLScaling")]
    };
    case "Half Sphere":{
        [h:halfSphereDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"halfSphereDimensionValue"),
            "SizeUnits",json.get(subeffectData,"halfSphereDimensionUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"halfSphereSizeAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            halfSphereDimensions = json.set(halfSphereDimensions,
                "AHLValue",json.get(subeffectData,"halfSphereDimensionValueAHL"),
                "AHLScaling",shapeAHLScaling
            );
            halfSphereDimensions = json.set(halfSphereDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = halfSphereDimensions]
        [h:subeffectData = json.remove(subeffectData,"halfSphereDimensionValue")]
        [h:subeffectData = json.remove(subeffectData,"halfSphereDimensionUnits")]
        [h:subeffectData = json.remove(subeffectData,"halfSphereDimensionValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"halfSphereSizeAHLScaling")]
    };
    case "Line":{
        [h:lineDimensions = json.set("",
            "LengthValue",json.get(subeffectData,"lineLengthValue"),
            "LengthUnits",json.get(subeffectData,"lineLengthUnits"),
            "WidthValue",json.get(subeffectData,"lineWidthValue"),
            "WidthUnits",json.get(subeffectData,"lineWidthUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"lineSizeAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            lineDimensions = json.set(lineDimensions,
                "AHLLengthValue",json.get(subeffectData,"lineLengthValueAHL"),
                "AHLWidthValue",json.get(subeffectData,"lineWidthValueAHL"),
                "AHLScaling",shapeAHLScaling
            );
            lineDimensions = json.set(lineDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = lineDimensions]
        [h:subeffectData = json.remove(subeffectData,"lineLengthValue")]
        [h:subeffectData = json.remove(subeffectData,"lineLengthUnits")]
        [h:subeffectData = json.remove(subeffectData,"lineWidthValue")]
        [h:subeffectData = json.remove(subeffectData,"lineWidthUnits")]
        [h:subeffectData = json.remove(subeffectData,"lineLengthValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"lineWidthValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"lineSizeAHLScaling")]
    };
    case "Panels":{
        [h:panelsDimensions = json.set("",
            "Number",json.get(subeffectData,"panelsNumber"),
            "SizeValue",json.get(subeffectData,"panelsDimensionValue"),
            "SizeUnits",json.get(subeffectData,"panelsDimensionUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"panelsNumberAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            panelsDimensions = json.set(panelsDimensions,
                "AHLNumber",json.get(subeffectData,"panelsNumberAHL"),
                "AHLScaling",shapeAHLScaling
            );
            panelsDimensions = json.set(panelsDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = panelsDimensions]
        [h:subeffectData = json.remove(subeffectData,"panelsNumber")]
        [h:subeffectData = json.remove(subeffectData,"panelsDimensionValue")]
        [h:subeffectData = json.remove(subeffectData,"panelsDimensionUnits")]
        [h:subeffectData = json.remove(subeffectData,"panelsNumberAHL")]
        [h:subeffectData = json.remove(subeffectData,"panelsNumberAHLScaling")]
    };
    case "Sphere":{
        [h:sphereDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"sphereDimensionValue"),
            "SizeUnits",json.get(subeffectData,"sphereDimensionUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"sphereSizeAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            sphereDimensions = json.set(sphereDimensions,
                "AHLValue",json.get(subeffectData,"sphereDimensionValueAHL"),
                "AHLScaling",shapeAHLScaling
            );
            sphereDimensions = json.set(sphereDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = sphereDimensions]
        [h:subeffectData = json.remove(subeffectData,"sphereDimensionValue")]
        [h:subeffectData = json.remove(subeffectData,"sphereDimensionUnits")]
        [h:subeffectData = json.remove(subeffectData,"sphereDimensionValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"sphereSizeAHLScaling")]
    };
    case "Wall":{
        [h:wallDimensions = json.set("",
            "LengthValue",json.get(subeffectData,"wallLengthValue"),
            "LengthUnits",json.get(subeffectData,"wallLengthUnits"),
            "WidthValue",json.get(subeffectData,"wallWidthValue"),
            "WidthUnits",json.get(subeffectData,"wallWidthUnits"),
            "HeightValue",json.get(subeffectData,"wallHeightValue"),
            "HeightUnits",json.get(subeffectData,"wallHeightUnits")
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"wallSizeAHLScaling"))]
        [h,if(shapeAHLScaling > 0):
            wallDimensions = json.set(wallDimensions,
                "AHLLengthValue",json.get(subeffectData,"wallLengthValueAHL"),
                "AHLWidthValue",json.get(subeffectData,"wallWidthValueAHL"),
                "AHLHeightValue",json.get(subeffectData,"wallHeightValueAHL"),
                "AHLScaling",shapeAHLScaling
            );
            wallDimensions = json.set(wallDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = wallDimensions]
        [h:subeffectData = json.remove(subeffectData,"wallLengthValue")]
        [h:subeffectData = json.remove(subeffectData,"wallLengthUnits")]
        [h:subeffectData = json.remove(subeffectData,"wallWidthValue")]
        [h:subeffectData = json.remove(subeffectData,"wallWidthUnits")]
        [h:subeffectData = json.remove(subeffectData,"wallHeightValue")]
        [h:subeffectData = json.remove(subeffectData,"wallHeightUnits")]
        [h:subeffectData = json.remove(subeffectData,"wallLengthValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"wallWidthValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"wallHeightValueAHL")]
        [h:subeffectData = json.remove(subeffectData,"wallSizeAHLScaling")]
    }
]

[h:shapeDimensions = json.set(shapeDimensions,
    "AoENum",json.get(subeffectData,"AoENum"),
    "AoENumAHL",json.get(subeffectData,"AoENumAHL"),
    "AoENumAHLScaling",json.get(subeffectData,"AoENumAHLScaling")
)]

[h:subeffectData = json.remove(subeffectData,"AoENum")]
[h:subeffectData = json.remove(subeffectData,"AoENumAHL")]
[h:subeffectData = json.remove(subeffectData,"AoENumAHLScaling")]

[h:macro.return = shapeDimensions]