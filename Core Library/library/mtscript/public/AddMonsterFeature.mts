[h:SharedMonsterFeatureArray = json.sort(getLibProperty("sb.MonsterFeatures","Lib:pm.a5e.Core"),"a","DisplayName")]

[h:SharedMonsterFeatureList = json.path.read(SharedMonsterFeatureArray,"[*]['DisplayName']")]

[h:abort(input(
    " FeatureChoice | "+SharedMonsterFeatureList+" | Choose a Feature | LIST | DELIMITER=JSON "
))]

[h:FeatureToAdd = json.get(SharedMonsterFeatureArray,FeatureChoice)]

[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),FeatureToAdd))]

[h:broadcast("Added "+json.get(SharedMonsterFeatureList,FeatureChoice)+" feature to "+getName()+".")]