[h:a5e.DurationObject = arg(0)]
[h:a5e.DurationString = if(json.get(a5e.DurationObject,"year")==0,"",if(json.get(a5e.DurationObject,"year")==1,"1 year",json.get(a5e.DurationObject,"year")+" years"))]
[h:a5e.DurationString = if(json.get(a5e.DurationObject,"day")==0,a5e.DurationString,listAppend(a5e.DurationString,if(json.get(a5e.DurationObject,"day")==1,"1 day",json.get(a5e.DurationObject,"day")+" days"),", "))]
[h:a5e.DurationString = if(json.get(a5e.DurationObject,"hour")==0,a5e.DurationString,listAppend(a5e.DurationString,if(json.get(a5e.DurationObject,"hour")==1,"1 hour",json.get(a5e.DurationObject,"hour")+" hours"),", "))]
[h:a5e.DurationString = if(json.get(a5e.DurationObject,"minute")==0,a5e.DurationString,listAppend(a5e.DurationString,if(json.get(a5e.DurationObject,"minute")==1,"1 minute",json.get(a5e.DurationObject,"minute")+" minutes"),", "))]
[h:a5e.DurationString = if(json.get(a5e.DurationObject,"round")==0,a5e.DurationString,listAppend(a5e.DurationString,if(json.get(a5e.DurationObject,"round")==1,"1 round",json.get(a5e.DurationObject,"round")+" rounds"),", "))]
[h:macro.return = a5e.DurationString]