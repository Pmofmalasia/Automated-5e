[h:tempDuration = lower(arg(0))]
[h,switch(tempDuration):
    case "actions": finalDuration = "action";
    case "bonus action": finalDuration = "bonus";
    case "bonus actions": finalDuration = "bonus";
    case "reactions": finalDuration = "reaction";
    case "turns": finalDuration = "turn";
    case "rounds": finalDuration = "round";
    case "rnds": finalDuration = "round";
    case "rnd": finalDuration = "round";
    case "r": finalDuration = "round";
    case "minutes": finalDuration = "minute";
    case "mins": finalDuration = "minute";
    case "min": finalDuration = "minute";
    case "m": finalDuration = "minute";
    case "hours": finalDuration = "hour";
    case "hrs": finalDuration = "hour";
    case "hr": finalDuration = "hour";
    case "h": finalDuration = "hour";
    case "days": finalDuration = "day";
    case "d": finalDuration = "day";
    case "years": finalDuration = "year";
    case "yrs": finalDuration = "year";
    case "yr": finalDuration = "year";
    case "y": finalDuration = "year";
    default: finalDuration = tempDuration
]
[h:macro.return = finalDuration]