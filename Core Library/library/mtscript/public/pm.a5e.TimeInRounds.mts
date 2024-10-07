[h,if(argCount() > 1),CODE:{
	[h:value = arg(0)]
	[h:units = arg(1)]

	[h,switch(units):
		case "year": timeInRounds = value*5256000;
		case "day": timeInRounds = value*14400;
		case "hour": timeInRounds = value*600;
		case "minute": timeInRounds = value*10;
		case "round": timeInRounds = value;
		default: timeInRounds = timeInRounds
	]
};{
	[h:time = arg(0)]
	[h:timeInRounds = 0]

	[h:timeInRounds = timeInRounds + number(json.get(time,"year")) * 5256000]
	[h:timeInRounds = timeInRounds + number(json.get(time,"day")) * 14400]
	[h:timeInRounds = timeInRounds + number(json.get(time,"hour")) * 600]
	[h:timeInRounds = timeInRounds + number(json.get(time,"minute")) * 10]
	[h:timeInRounds = timeInRounds + number(json.get(time,"round"))]
}]

[h:return(0,timeInRounds)]