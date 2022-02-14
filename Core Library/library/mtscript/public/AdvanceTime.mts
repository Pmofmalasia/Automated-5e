[h:timeAdvanced = json.get(macro.args,"Time")]
[h:timeAdvancedUnits = json.get(macro.args,"TimeUnits")]
[h,if(json.get(macro.args,"ParentToken")!=""): switchToken(json.get(macro.args,"ParentToken"))]

[h,foreach(ability,json.get(macro.args,"Abilities")),CODE:{
   [h:currentDuration = json.get(ability,"Duration")]
   [h:currentRounds = (json.get(currentDuration,"year")*10*60*24*365)+(json.get(currentDuration,"day")*10*60*24)+(json.get(currentDuration,"hour")*10*60)+(json.get(currentDuration,"minute")*10)+json.get(currentDuration,"round")]
   
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
   
   [h,SWITCH(json.get(ability,"AbilityType")),CODE:
      case "Feature":{
         [h:allAbilities = json.path.set(allAbilities,"[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['Duration']",newDuration)]
      };
      case "Condition":{
         [h:ConditionList = json.path.set(ConditionList,"[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['Duration']",newDuration)]
      }
   ]
}]