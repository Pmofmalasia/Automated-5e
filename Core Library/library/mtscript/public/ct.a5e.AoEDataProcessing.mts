[h:AoEIDSuffix = arg(1)]
[h,switch(arg(0)),CODE:
    case "Cone":{
        [h:coneDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"coneDimensionValue"+AoEIDSuffix),
            "SizeUnits",json.get(subeffectData,"coneDimensionUnits"+AoEIDSuffix)
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"coneSizeAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            coneDimensions = json.set(coneDimensions,
                "AHLValue",json.get(subeffectData,"coneDimensionValueAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            coneDimensions = json.set(coneDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = coneDimensions]
        [h:subeffectData = json.remove(subeffectData,"coneDimensionValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"coneDimensionUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"coneDimensionValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"coneSizeAHLScaling"+AoEIDSuffix)]
    };
    case "Cube":{
        [h:cubeDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"cubeDimensionValue"+AoEIDSuffix),
            "SizeUnits",json.get(subeffectData,"cubeDimensionUnits"+AoEIDSuffix)
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"cubeSizeAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            cubeDimensions = json.set(cubeDimensions,
                "AHLValue",json.get(subeffectData,"cubeDimensionValueAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            cubeDimensions = json.set(cubeDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = cubeDimensions]
        [h:subeffectData = json.remove(subeffectData,"cubeDimensionValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cubeDimensionUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cubeDimensionValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cubeSizeAHLScaling"+AoEIDSuffix)]
    };
    case "Cylinder":{
        [h:cylinderDimensions = json.set("",
            "RadiusValue",json.get(subeffectData,"cylinderRadiusValue"+AoEIDSuffix),
            "RadiusUnits",json.get(subeffectData,"cylinderRadiusUnits"+AoEIDSuffix),
            "HeightValue",json.get(subeffectData,"cylinderHeightValue"+AoEIDSuffix),
            "HeightUnits",json.get(subeffectData,"cylinderHeightUnits"+AoEIDSuffix)
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"cylinderSizeAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            cylinderDimensions = json.set(cylinderDimensions,
                "AHLRadiusValue",json.get(subeffectData,"cylinderRadiusValueAHL"+AoEIDSuffix),
                "AHLHeightValue",json.get(subeffectData,"cylinderHeightValueAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            cylinderDimensions = json.set(cylinderDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = cylinderDimensions]
        [h:subeffectData = json.remove(subeffectData,"cylinderRadiusValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cylinderRadiusUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cylinderHeightValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cylinderHeightUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cylinderRadiusValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cylinderHeightValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"cylinderSizeAHLScaling"+AoEIDSuffix)]
    };
    case "Half Sphere":{
        [h:halfSphereDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"halfSphereDimensionValue"+AoEIDSuffix),
            "SizeUnits",json.get(subeffectData,"halfSphereDimensionUnits"+AoEIDSuffix)
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"halfSphereSizeAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            halfSphereDimensions = json.set(halfSphereDimensions,
                "AHLValue",json.get(subeffectData,"halfSphereDimensionValueAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            halfSphereDimensions = json.set(halfSphereDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = halfSphereDimensions]
        [h:subeffectData = json.remove(subeffectData,"halfSphereDimensionValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"halfSphereDimensionUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"halfSphereDimensionValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"halfSphereSizeAHLScaling"+AoEIDSuffix)]
    };
    case "Line":{
        [h:lineDimensions = json.set("",
            "LengthValue",json.get(subeffectData,"lineLengthValue"+AoEIDSuffix),
            "LengthUnits",json.get(subeffectData,"lineLengthUnits"+AoEIDSuffix),
            "WidthValue",json.get(subeffectData,"lineWidthValue"+AoEIDSuffix),
            "WidthUnits",json.get(subeffectData,"lineWidthUnits"+AoEIDSuffix)
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"lineSizeAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            lineDimensions = json.set(lineDimensions,
                "AHLLengthValue",json.get(subeffectData,"lineLengthValueAHL"+AoEIDSuffix),
                "AHLWidthValue",json.get(subeffectData,"lineWidthValueAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            lineDimensions = json.set(lineDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = lineDimensions]
        [h:subeffectData = json.remove(subeffectData,"lineLengthValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"lineLengthUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"lineWidthValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"lineWidthUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"lineLengthValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"lineWidthValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"lineSizeAHLScaling"+AoEIDSuffix)]
    };
    case "Panels":{
        [h:panelsDimensions = json.set("",
            "Number",json.get(subeffectData,"panelsNumber"+AoEIDSuffix),
            "SizeValue",json.get(subeffectData,"panelsDimensionValue"+AoEIDSuffix),
            "SizeUnits",json.get(subeffectData,"panelsDimensionUnits"+AoEIDSuffix)
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"panelsNumberAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            panelsDimensions = json.set(panelsDimensions,
                "AHLNumber",json.get(subeffectData,"panelsNumberAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            panelsDimensions = json.set(panelsDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = panelsDimensions]
        [h:subeffectData = json.remove(subeffectData,"panelsNumber"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"panelsDimensionValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"panelsDimensionUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"panelsNumberAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"panelsNumberAHLScaling"+AoEIDSuffix)]
    };
    case "Sphere":{
        [h:sphereDimensions = json.set("",
            "SizeValue",json.get(subeffectData,"sphereDimensionValue"+AoEIDSuffix),
            "SizeUnits",json.get(subeffectData,"sphereDimensionUnits"+AoEIDSuffix)
        )]
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"sphereSizeAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            sphereDimensions = json.set(sphereDimensions,
                "AHLValue",json.get(subeffectData,"sphereDimensionValueAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            sphereDimensions = json.set(sphereDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = sphereDimensions]
        [h:subeffectData = json.remove(subeffectData,"sphereDimensionValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"sphereDimensionUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"sphereDimensionValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"sphereSizeAHLScaling"+AoEIDSuffix)]
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
        
        [h:shapeAHLScaling = number(json.get(subeffectData,"wallSizeAHLScaling"+AoEIDSuffix))]
        [h,if(shapeAHLScaling > 0):
            wallDimensions = json.set(wallDimensions,
                "AHLLengthValue",json.get(subeffectData,"wallLengthValueAHL"+AoEIDSuffix),
                "AHLWidthValue",json.get(subeffectData,"wallWidthValueAHL"+AoEIDSuffix),
                "AHLHeightValue",json.get(subeffectData,"wallHeightValueAHL"+AoEIDSuffix),
                "AHLScaling",shapeAHLScaling
            );
            wallDimensions = json.set(wallDimensions,
                "AHLScaling",0
            );
        ]
        [h:shapeDimensions = wallDimensions]
        [h:subeffectData = json.remove(subeffectData,"wallLengthValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallLengthUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallWidthValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallWidthUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallHeightValue"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallHeightUnits"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallLengthValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallWidthValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallHeightValueAHL"+AoEIDSuffix)]
        [h:subeffectData = json.remove(subeffectData,"wallSizeAHLScaling"+AoEIDSuffix)]
    }
]

[h:shapeDimensions = json.set(shapeDimensions,
    "AoENum",json.get(subeffectData,"AoENum"+AoEIDSuffix),
    "AoENumAHL",json.get(subeffectData,"AoENumAHL"+AoEIDSuffix),
    "AoENumAHLScaling",json.get(subeffectData,"AoENumAHLScaling"+AoEIDSuffix)
)]

[h:subeffectData = json.remove(subeffectData,"AoENum"+AoEIDSuffix)]
[h:subeffectData = json.remove(subeffectData,"AoENumAHL"+AoEIDSuffix)]
[h:subeffectData = json.remove(subeffectData,"AoENumAHLScaling"+AoEIDSuffix)]

[h:macro.return = shapeDimensions]