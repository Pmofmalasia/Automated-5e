[h:VisionTypeData = macro.args]
[h:VisionTypeData = pm.a5e.KeyStringsToNumbers(VisionTypeData)]
[h:VisionTypeDisplayName = json.get(VisionTypeData,"DisplayName")]
[h:VisionTypeName = pm.RemoveSpecial(VisionTypeDisplayName)]

[h:VisionTypeData = json.set(VisionTypeData,"Name",VisionTypeName)]

[h:closeDialog("Vision Type Creation")]

[h:Library = json.get(VisionTypeData,"Library")]
[h:setLibProperty("sb.VisionTypes",json.append(getLibProperty("sb.VisionTypes","Lib:"+Library),VisionTypeData),"Lib:"+Library)]

[h:SourcebookName = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"\$[?(@.Library=='"+Library+"')]['DisplayName']"),0)]
[h:broadcast(VisionTypeDisplayName+" vision type from the sourcebook "+SourcebookName+" created.")]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]