[h:ParentToken = arg(0)]
[h:targetClients = arg(1)]
[h:refreshLink = macroLinkText("RefreshInventory@Lib:pm.a5e.Core","none",json.set("","ParentToken",ParentToken))]
[h:execLink(refreshLink,0,targetClients)]