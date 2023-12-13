function JsonToHTMLTable (opt){
	
	var input = opt.data;
	var groups = opt.groups;
	var groupRowValues=opt.groupRowValues;
	var columnLabels = opt.columnLabels;
	var sumColumns = opt.sumColumns;
	var showTotal = opt.showTotal;
	

	this.setData = function() {
	  return input.map(item => {
		const selectedObject = {};
		const keys = Object.keys(columnLabels)
			keys.forEach(column => {
		  if (item.hasOwnProperty(column)) {
			selectedObject[column] = item[column];
		  }
		});
		return selectedObject;
	  });
	}
	
	this.getAllLeafKeys = function(obj) {
	  let leafKeys = [];

	  function recurse(obj) {
		for (const key in obj) {
		  const fullPath = key;
		  if (typeof obj[key] === 'object' ) { 
			recurse(obj[key]);
		  } else {
			leafKeys.push(fullPath);//if(leafKeys.indexOf(fullPath) == -1) leafKeys.push(fullPath);
		  }
		}
	  }

	  recurse(obj);
	  return leafKeys;
	}
	
	this.getFirst = function(data){
		let firstProp;
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				firstProp = data[key];
				break;
			}
		}
		return firstProp;
	}
	
	function getGroupColumn (obj, keyName) {
	  let colValue='';
	  function recurse(obj, currentPath = '') {
		let colVal='';
		for (const key in obj) {
		  const fullPath = key;//currentPath ? `${currentPath}.${key}` : key;
		  if (typeof obj[key] === 'object') {
			colVal = recurse(obj[key], fullPath);
		  } else {
			if(key==keyName) return obj[key]
		  }
		}
		return colVal;
	  }
	  colValue = recurse(obj);
	  return colValue;
	}

	function getSumByKey (obj, keyName) {
	  let total = 0;
	  function recurse(obj, currentPath = '') {
		for (const key in obj) {
		  const fullPath = key;//currentPath ? `${currentPath}.${key}` : key;

		  if (typeof obj[key] === 'object') {
			recurse(obj[key], fullPath);
		  } else {
			if(key==keyName) total += parseInt(obj[key])
		  }
		}
	  }
	  recurse(obj);
	  return total;
	}
	
	this.groupByCustom = function() {
		const grouped = [];
	
		input.forEach(function (item) {
			let currentGroup = grouped;
			groups.forEach(function (property, i) {
				const value = item[property];
				
				let group = Array.isArray(currentGroup)? currentGroup.find(g => g[property] === value): [];
				if (!group) {
					group = { [property]: value };
					group['group'] = [];//(i + 1 === groups.length) ? [] : [];
					currentGroup.push(group);
				}
				currentGroup = group['group'];
			});

			if (Array.isArray(currentGroup)) {
				currentGroup.push(item);
			}
		});

		return grouped;
	}
	this.getHtmlTable = function() {
	  input = this.setData();
	  var groupedResult = this.groupByCustom();
	  var tableHtml = '<table  class="table ">';

	  var firstRow = this.getFirst(groupedResult)
		
	  var keys = Object.keys(columnLabels) //this.getAllLeafKeys(firstRow)
	  
	  if(groups.length>0){
		  groups.forEach(grpItem=>{
			  let idx = keys.findIndex(p => p == grpItem);
			  if(idx >= 0){ //check if item found
				  keys.splice(idx, 1);     
			  }
		  })
	  }
	  
	  
	  tableHtml += '<thead class="thead-dark print-background"><tr>';
	  keys.forEach(function (colName) {
	  
		if(columnLabels[colName] !== undefined && columnLabels[colName] != "") colName=columnLabels[colName]
		
		tableHtml += '<th>' + colName + '</th>';
	  });
	  tableHtml += '</tr></thead>';
	  var keyLength = keys.length
	  if(sumColumns !== undefined && sumColumns.length>0){
		let index = keys.indexOf(sumColumns[0])
		keyLength = index
	  }
	  groupedResult.forEach(function (group) {
		
		let colName = Object.keys(group)[0]
		
		tableHtml += '<tr style="background-color: rgba(0,0,0,.09);" class="print-background-1">';
		if(columnLabels[colName] !== undefined && columnLabels[colName] != "") colName=columnLabels[colName]
		let groupColName = group[Object.keys(group)[0]] == ""?"":colName + ' : ' +group[Object.keys(group)[0]];
		tableHtml += '<th  colspan="' + keyLength + '"><strong>'+ groupColName + '</strong></th>';
		if(keyLength<keys.length){
			for(let i=0;i<(keys.length-keyLength);i++){
				let keyIndex = keyLength+i
				let total = getSumByKey(group, keys[keyIndex])
				tableHtml += '<th><strong>'+total.toLocaleString()+'</strong></th>';
			}
		}
		tableHtml += '</tr>';
		
		tableHtml += jsonToHTMLRow(group, groups, keyLength, keys)  
		
	  });
		if(showTotal){
			tableHtml += '<tr class="thead-dark">';
			
			tableHtml += '<th  colspan="' + keyLength + '" style="text-align: center;"><strong>Total</strong></th>';
			if(keyLength<keys.length){
				for(let i=0;i<(keys.length-keyLength);i++){
					let keyIndex = keyLength+i
					let total = getSumByKey(groupedResult, keys[keyIndex])
					tableHtml += '<th><strong>'+total.toLocaleString()+'</strong></th>';
				}
			}
			tableHtml += '</tr>';
		}
	  tableHtml += '</table>';
	  document.getElementById('tableContainer').innerHTML = tableHtml;
      return tableHtml;
	}
	function jsonToHTMLRow (group, groups, keyLength, keys){
		let tableHtml=''
		if(group.hasOwnProperty("group") && Array.isArray(group.group)){
			group.group.forEach(function(item){
				if(item.hasOwnProperty("group") && Array.isArray(item.group)){
					let colName = Object.keys(item)[0]
					if(columnLabels[colName] !== undefined && columnLabels[colName] != "") colName=columnLabels[colName]
					
					tableHtml += '<tr style="background-color: rgba(0,0,0,.08);" class="print-background-2">';
					let concatName = '';
					if(groupRowValues.hasOwnProperty(Object.keys(item)[0])){
						let name = groupRowValues[Object.keys(item)[0]][1]
						concatName =  getGroupColumn(item, name)
						concatName = concatName !== undefined && concatName !== null && concatName !==""?" - "+concatName:"";
					}
					let groupColName = item[Object.keys(item)[0]] ==""?"":colName+ ' : ' +item[Object.keys(item)[0]];
					tableHtml += '<th  colspan="' + keyLength + '"><strong>'+ groupColName + concatName.toString()+ '</strong></th>';
					if(keyLength<keys.length){
						for(let i=0;i<(keys.length-keyLength);i++){
							let keyIndex = keyLength+i
							let total = getSumByKey(item, keys[keyIndex])
							tableHtml += '<th><strong>'+total.toLocaleString()+'</strong></th>';
						}
					}
					tableHtml += '</tr>';
				}else{
					tableHtml += '<tr style="">';
					Object.keys(item).forEach(function(k){
						if(groups.indexOf(k) === -1){
							tableHtml += '<td>'+ (sumColumns.some(v=>v==k)?item[k].toLocaleString():item[k])+'</td>'
						}
					})
					tableHtml += '</tr>';
				}
				tableHtml += jsonToHTMLRow(item, groups, keyLength, keys)
			})
		}
		return tableHtml
	}

}
