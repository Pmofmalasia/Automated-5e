[h:tempDuration = lower(arg(0))]
[h,switch(tempDuration):
    case "round": finalDuration = "round";
    case "rounds": finalDuration = "round";
    case "turn": finalDuration = "turn";
    case "turns": finalDuration = "turn";
    case "minute": finalDuration = "minute";
    case "minutes": finalDuration = "minute";
    case "hour": finalDuration = "hour";
    case "hours": finalDuration = "hour";
    case "day": finalDuration = "day";
    case "days": finalDuration = "day";
    case "year": finalDuration = "year";
    case "years": finalDuration = "year";
]
[h:macro.return = finalDuration]