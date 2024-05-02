[h:timeAdvanced = json.get(arg(0),"Time")]
[h:timeAdvancedUnits = json.get(arg(0),"TimeUnits")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h,if(ParentToken!=""): switchToken(ParentToken)]
[h:currentDuration = json.get(arg(0),"Duration")]

[h:currentRounds = (number(json.get(currentDuration,"year"))*10*60*24*365)+(number(json.get(currentDuration,"day"))*10*60*24)+(number(json.get(currentDuration,"hour"))*10*60)+(number(json.get(currentDuration,"minute"))*10)+number(json.get(currentDuration,"round"))]

[h,switch(timeAdvancedUnits):
  case "year": roundsAdvanced = timeAdvanced*10*60*24*365;
  case "day": roundsAdvanced = timeAdvanced*10*60*24;
  case "hour": roundsAdvanced = timeAdvanced*10*60;
  case "minute": roundsAdvanced = timeAdvanced*10;
  case "round": roundsAdvanced = timeAdvanced;
  default: roundsAdvanced = timeAdvanced
]

[h:newRounds = max(0,currentRounds-roundsAdvanced)]
[h,if(newRounds==0),CODE:{
  [h:newDuration = json.set(currentDuration,"year",0,"day",0,"hour",0,"minute",0,"round",0,"Expired",1)]
};{
  [h:newYears = floor(newRounds/10/60/24/365)]
  [h:newRounds = newRounds - (newYears*10*60*24*365)]
  
  [h:newDays = floor(newRounds/10/60/24)]
  [h:newRounds = newRounds - (newDays*10*60*24)]
  
  [h:newHours = floor(newRounds/10/60)]
  [h:newRounds = newRounds - (newHours*10*60)]
  
  [h:newMinutes = floor(newRounds/10)]
  [h:newRounds = newRounds - (newMinutes*10)]
  [h:newDuration = json.set(currentDuration,"year",newYears,"day",newDays,"hour",newHours,"minute",newMinutes,"round",newRounds)]
}]

[h:macro.return = newDuration]