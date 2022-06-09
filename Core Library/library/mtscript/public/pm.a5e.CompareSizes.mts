[h:size1 = arg(0)]
[h:size2 = arg(1)]
[h:sizeArray = json.append("","Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal")]
[h:macro.return = json.indexOf(sizeArray,size1)-json.indexOf(sizeArray,size2)]