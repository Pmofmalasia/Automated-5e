[h:BaseCarryStrength = json.get(getProperty("a5e.stat.Attributes"),"Strength")]
[h:BaseCarrySize = getSize()]
[h:BaseCarryBonus = 0]

[h:pm.PassiveFunction("CarryCapacity")]

[h,switch(BaseCarrySize):
	case "Fine": BaseSizeMultiplier = (1/8);
	case "Diminutive": BaseSizeMultiplier = (1/4);
	case "Tiny": BaseSizeMultiplier = (1/2);
	case "Small": BaseSizeMultiplier = 1;
	case "Medium": BaseSizeMultiplier = 1;
	case "Large": BaseSizeMultiplier = 2;
	case "Huge": BaseSizeMultiplier = 4;
	case "Gargantuan": BaseSizeMultiplier = 8;
	case "Colossal": BaseSizeMultiplier = 16;
	default: 1
]

[h:FinalMaxCarryWeight = BaseCarryStrength * 15 * BaseSizeMultiplier]
[h:FinalMaxPushWeight = BaseCarryStrength * 30 * BaseSizeMultiplier]