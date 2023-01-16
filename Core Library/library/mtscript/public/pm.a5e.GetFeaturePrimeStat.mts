[h:FeatureInfo = arg(0)]

[h:PrimeStatMethodTest = json.type(json.get(FeatureInfo,"PrimeStat"))]
[h,if(PrimeStatMethodTest == "OBJECT"),CODE:{
	[h:PrimeStatOptions = json.get(json.get(FeatureInfo,"PrimeStat"),"Stats")]
	[h:FeaturePrimeStat = json.get(PrimeStatOptions,0)]
	[h:FeaturePrimeStatValue = json.get(getProperty("a5e.stat.AtrMods"),tempPrimeStat)]
	[h,foreach(tempPrimeStat,json.remove(PrimeStatOptions,0)),CODE:{
		[h:tempPrimeStatValue = json.get(getProperty("a5e.stat.Attributes"),tempPrimeStat)]
		[h,if(tempPrimeStatValue > FeaturePrimeStatValue): FeaturePrimeStat = tempPrimeStat]
		[h,if(tempPrimeStatValue > FeaturePrimeStatValue): FeaturePrimeStatValue = tempPrimeStatValue]
	}]
	[h:FeaturePrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),FeaturePrimeStat)]
};{
	[h:FeaturePrimeStat = json.get(FeatureInfo,"PrimeStat")]
	[h:FeaturePrimeStatValue = json.get(getProperty("a5e.stat.Attributes"),FeaturePrimeStat)]
	[h:FeaturePrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),FeaturePrimeStat)]
}]

[h:macro.return = json.set("",
	"PrimeStat",FeaturePrimeStat,
	"PrimeStatValue",FeaturePrimeStatValue,
	"PrimeStatMod",FeaturePrimeStatMod
)]