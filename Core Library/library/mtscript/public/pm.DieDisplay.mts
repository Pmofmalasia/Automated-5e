[h:pm.DieInfo=arg(0)]
[r:json.get(pm.DieInfo,"Formula")+if(json.get(pm.DieInfo,"Number")>1," = "+json.get(pm.DieInfo,"String"),"")+" = "+json.get(pm.DieInfo,"Roll")]