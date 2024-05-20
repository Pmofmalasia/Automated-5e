[h:TimeData = arg(0)]
[h,if(json.type(TimeData) == "UNKNOWN"),CODE:{
	[h:"<!-- If it's a number, then it's the time in rounds - need to convert -->"]
	[h:timeInRounds = TimeData]
	[h:TimeData = "{}"]
	[h,if(timeInRounds >= 5256000),CODE:{
		[h:TimeData = json.set(TimeData,"year",floor(timeInRounds/5256000))]
		[h:timeInRounds = math.mod(timeInRounds,5256000)]
	};{
		[h:TimeData = json.set(TimeData,"year",0)]
	}]
	
	[h,if(timeInRounds >= 14400),CODE:{
		[h:TimeData = json.set(TimeData,"day",floor(timeInRounds/14400))]
		[h:timeInRounds = math.mod(timeInRounds,14400)]
	};{
		[h:TimeData = json.set(TimeData,"day",0)]
	}]
	
	[h,if(timeInRounds >= 600),CODE:{
		[h:TimeData = json.set(TimeData,"hour",floor(timeInRounds/600))]
		[h:timeInRounds = math.mod(timeInRounds,600)]
	};{
		[h:TimeData = json.set(TimeData,"hour",0)]
	}]
	
	[h,if(timeInRounds >= 10),CODE:{
		[h:TimeData = json.set(TimeData,"minute",floor(timeInRounds/10))]
		[h:timeInRounds = math.mod(timeInRounds,10)]
	};{
		[h:TimeData = json.set(TimeData,"minute",0)]
	}]
	
	[h:TimeData = json.set(TimeData,"round",0)]
	[h:timeInRounds = 0]
};{}]

[h:timeDisplayArray = "[]"]
[h:yearsAmount = number(json.get(TimeData,"year"))]
[h,if(yearsAmount!=0): timeDisplayArray = json.append(timeDisplayArray,yearsAmount+" year"+if(yearsAmount > 1,"s",""))]
[h:daysAmount = number(json.get(TimeData,"day"))]
[h,if(daysAmount!=0): timeDisplayArray = json.append(timeDisplayArray,daysAmount+" day"+if(daysAmount > 1,"s",""))]
[h:hoursAmount = number(json.get(TimeData,"hour"))]
[h,if(hoursAmount!=0): timeDisplayArray = json.append(timeDisplayArray,hoursAmount+" hour"+if(hoursAmount > 1,"s",""))]
[h:minutesAmount = number(json.get(TimeData,"minute"))]
[h,if(minutesAmount!=0): timeDisplayArray = json.append(timeDisplayArray,minutesAmount+" minute"+if(minutesAmount > 1,"s",""))]
[h:roundsAmount = number(json.get(TimeData,"round"))]
[h,if(roundsAmount!=0): timeDisplayArray = json.append(timeDisplayArray,roundsAmount+" round"+if(roundsAmount > 1,"s",""))]

[h:finalTimeDisplay = pm.a5e.CreateDisplayList(timeDisplayArray,"and")]
[h,if(finalTimeDisplay == ""): finalTimeDisplay = "0 rounds"]

[h:return(0,finalTimeDisplay)]