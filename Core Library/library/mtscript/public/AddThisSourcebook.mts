[h:SourcebookLibrary = macro.args]
[h:allCurrentSourcebooks = data.getData("addon:","pm.a5e.core","ms.Sources")]
[h:hasBookTest = json.path.read(allCurrentSourcebooks,"\$[*][?(@.Library == '"+SourcebookLibrary+"')]")]
[h,if(!json.isEmpty(hasBookTest)): assert(0,"This library has already been added to the core list! Check for any duplicate Lib: tokens if this is unexpected.")]
[h:thisSourcebookData = getLibProperty("sb.SourcebookData","Lib:"+SourcebookLibrary)]
[h:data.setData("addon:","pm.a5e.core","ms.Sources",json.append(,json.set(thisSourcebookData,"Banned",0)))]

[h:broadcast("Sourcebook "+json.get(thisSourcebookData,"DisplayName")+" has been added.")]