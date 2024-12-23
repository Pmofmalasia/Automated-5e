[h:oldResourceData = arg(0)]
[h:newResourceData = arg(1)]

[h,if(json.isEmpty(newResourceData)): return(0,oldResourceData)]
[h,if(json.isEmpty(oldResourceData)): return(0,newResourceData)]

[h:oldResources = json.get(oldResourceData,"Resources")]
[h:newResources = json.get(newResourceData,"Resources")]
[h:newResources = json.merge(oldResources,newResources)]

[h:oldResourceRestoration = json.get(oldResourceData,"Restoration")]
[h:newResourceRestoration = json.get(newResourceData,"Restoration")]
[h,foreach(instance,json.fields(newResourceRestoration,"json")),CODE:{
	[h:oldInstanceData = json.get(oldResourceRestoration,instance)]
	[h,switch(json.type(oldInstanceData)),CODE:
		case "UNKNOWN":{
			[h:oldResourceRestoration = json.set(oldResourceRestoration,instance,json.get(newResourceRestoration,instance))]
		};
		case "ARRAY":{
			[h:newInstanceData = json.get(newResourceRestoration,instance)]
			[h,switch(json.type(newInstanceData)):
				case "UNKNOWN": finalInstanceData = oldInstanceData;
				case "ARRAY": finalInstanceData = json.merge(oldInstanceData,newInstanceData);
				case "OBJECT": finalInstanceData = json.append(oldInstanceData,newInstanceData)
			]
			[h:oldResourceRestoration = json.set(oldResourceRestoration,instance,finalInstanceData)]
		};
		case "OBJECT":{
			[h:newInstanceData = json.get(newResourceRestoration,instance)]
			[h,switch(json.type(newInstanceData)):
				case "UNKNOWN": finalInstanceData = oldInstanceData;
				case "ARRAY": finalInstanceData = json.append(newInstanceData,oldInstanceData);
				case "OBJECT": finalInstanceData = json.append("",oldInstanceData,newInstanceData)
			]
			[h:oldResourceRestoration = json.set(oldResourceRestoration,instance,finalInstanceData)]
		}
	]
}]

[h:finalResourceData = json.set("",
	"Resources",newResources,
	"Restoration",oldResourceRestoration
)]