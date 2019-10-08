export function toTree(data,pid=''){
	var result = [] , temp;
	for(var i in data){

			if(data[i].pid==pid){
					result.push(data[i]);
					temp = toTree(data,data[i]._id.toString());           
					if(temp.length>0){
							data[i].children=temp;
					}           
			}       
	}
	return result;
}