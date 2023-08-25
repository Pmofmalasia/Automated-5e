[h:PassiveFeatureData = arg(0)]
[h:passD20AutoResultData = arg(1)]

[h,switch(passD20AutoResultData):
	case "Success": d20AutoSuccess = 1;
	case "Failure": d20AutoFail = 1;
	default: ""
]