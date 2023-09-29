[h:SharedMonsterFeatureArray = json.sort(data.getData("addon:","pm.a5e.core","sb.MonsterFeatures"),"a","DisplayName")]

[h:SharedMonsterFeatureList = json.path.read(SharedMonsterFeatureArray,"\$[*]['DisplayName']")]

[h:abort(input(
    " FeatureChoice | "+SharedMonsterFeatureList+" | Choose a Feature | LIST | DELIMITER=JSON "
))]

[h:FeatureToAdd = json.get(SharedMonsterFeatureArray,FeatureChoice)]

[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),FeatureToAdd))]

[h:broadcast("Added "+json.get(SharedMonsterFeatureList,FeatureChoice)+" feature to "+getName()+".")]