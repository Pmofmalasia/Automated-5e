[h:pm.Filter = arg(0)]
[h:pm.FilterDisplay = ""]
[h,if(json.get(pm.Filter,"Class")!=""): pm.FilterDisplay = json.append(pm.FilterDisplay,"Valid Classes: "+json.toList(json.get(pm.Filter,"Class"),", "))]
[h,if(json.get(pm.Filter,"Level")!=""): pm.FilterDisplay = json.append(pm.FilterDisplay,"Valid Levels: "+json.toList(json.get(pm.Filter,"Level"),", "))]
[h,if(json.get(pm.Filter,"School")!=""): pm.FilterDisplay = json.append(pm.FilterDisplay,"Valid Schools: "+json.toList(json.get(pm.Filter,"School"),", "))]
[h,if(json.get(pm.Filter,"Level")!=""): pm.FilterDisplay = json.append(pm.FilterDisplay,"Valid Levels: "+json.toList(json.get(pm.Filter,"Level"),", "))]
[h,if(json.get(pm.Filter,"Time")!=""): pm.FilterDisplay = json.append(pm.FilterDisplay,"Valid Casting Times: "+json.toList(json.get(pm.Filter,"Time"),", "))]
[h,if(json.get(pm.Filter,"Ritual")): pm.FilterDisplay = json.append(pm.FilterDisplay,"Ritual spells only")]
[h,if(pm.FilterDisplay == ""): pm.FilterDisplay = json.append(pm.FilterDisplay,"No limitations")]
[h:macro.return = pm.FilterDisplay]