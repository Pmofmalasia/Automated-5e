[h,if(arg(0)==""): return(0)]
[h, if(currentToken() != ""), code:{ 
	[h,if(getVisible()),CODE:{
		[h: broadcastAsToken_image = strformat("<img src='%s'>", getTokenImage(44))]
		[h: broadcastAsToken_name = token.name]
	};{
		[h: broadcastAsToken_image = strformat("<img src='%s'; width=44; height=44>","lib://pm.a5e.core/InterfaceImages/Unknown_Token.png")]
		[h: broadcastAsToken_name = "Unknown Creature"]
	}]
};{ 
	[h: broadcastAsToken_image = ""]
	[h: broadcastAsToken_name = getPlayerName()]
}]

[h: broadcastAsToken_output = strformat("<table valign=top cellspacing=2 cellpadding=0><tr><td style='width:37px;'>%{broadcastAsToken_image}</td><td><span style='font-weight: bold;'>%{broadcastAsToken_name}:</span>&ensp;%s</td></tr></table>", arg(0))]

[h, switch(argCount()):
    case 1: broadcast(broadcastAsToken_output);
    case 2: broadcast(broadcastAsToken_output, arg(1));
    case 3: broadcast(broadcastAsToken_output, arg(1), arg(2));
    default: assert(0, strformat("Function 'broadcastAsToken' requires 1-3 arguments; %s were provided.", argCount()), 0)
]