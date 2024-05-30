[h:Comparitor = arg(0)]

[h,switch(Comparitor):
	case "LessEqual": FinalComparitor = "<=";
	case "Less": FinalComparitor = "<";
	case "Equal": FinalComparitor = "==";
	case "Greater": FinalComparitor = ">";
	case "GreaterEqual": FinalComparitor = ">="
]

[h:return(0,FinalComparitor)]