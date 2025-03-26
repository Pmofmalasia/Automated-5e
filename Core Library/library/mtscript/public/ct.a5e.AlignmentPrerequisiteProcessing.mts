[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]
[h:AlignmentData = "{}"]

[h:alignmentList = json.append("","LawfulGood","LawfulNeutral","LawfulEvil","NeutralGood","NeutralNeutral","NeutralEvil","ChaoticGood","ChaoticNeutral","ChaoticEvil","UnalignedUnaligned")]
[h:validAlignments = "{}"]
[h,foreach(alignment,alignmentList),if(json.contains(inputData,"AlignmentPrereq"+IDSuffix+alignment)),CODE:{
	[h:validAlignments = json.append(validAlignments,alignment)]
    [h:inputData = json.remove(inputData,"AlignmentPrereq"+IDSuffix+alignment)]
}]

[h:AlignmentData = json.set("",json.get(inputData,"AlignmentPrereqMethod"+IDSuffix)+"Alignment",validAlignments)]
[h:inputData = json.remove(inputData,"AlignmentPrereqMethod"+IDSuffix)]

[h:return(0,json.set("","Input",inputData,"Alignment",AlignmentData))]