[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
	[h:macro.return=if(json.get(ChatColors,"DarkLinkColor")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkLinkColor"),json.get(ChatColors,"DarkLinkColor"))]
};{
	[h:macro.return=if(json.get(ChatColors,"LightLinkColor")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightLinkColor"),json.get(ChatColors,"LightLinkColor"))]
}]