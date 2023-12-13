# JsonToHTMLTable
Convert JSON Data to HTML Table, Apply Group By to JSON Data
You need to mention group column name(s), minimum one group column is required. 
Each group column will create a new HTML table row, you can show sum of numeric columns

```
var sampleData=[
{'bill_no': '00001', 'bill_date': '2023-12-01', 'code':'1',name:'Ali','amount': 700, 'discount': 100, 'net_total': 600},
{'bill_no': '00002', 'bill_date': '2023-12-02', 'code':'2',name:'Ali','amount': 820, 'discount': 20, 'net_total': 800},
{'bill_no': '00003', 'bill_date': '2023-12-02', 'code':'1',name:'Ali','amount': 900, 'discount': 50, 'net_total': 850},
{'bill_no': '00004', 'bill_date': '2023-12-03', 'code':'2',name:'Ali','amount': 600, 'discount': 0, 'net_total': 600},
{'bill_no': '00005', 'bill_date': '2023-12-04', 'code':'1',name:'Ali','amount': 1200, 'discount': 0, 'net_total': 1200},
{'bill_no': '00006', 'bill_date': '2023-12-04', 'code':'2',name:'Ali','amount': 1500, 'discount': 150, 'net_total': 1350},
{'bill_no': '00007', 'bill_date': '2023-12-04', 'code':'2',name:'Ali','amount': 2000, 'discount': 200, 'net_total': 1800}
]
//You need to pass minimum one column for grouping
//group by columns, array
var groupBy = ["bill_date", "code"]

//columns values to show in grouping row
var groupColValue = { 'code': ['code', 'name'] } 

//Columns and their labels to show on header
var columnsAndLabels  = {
	"bill_no": "Bill No",
	"bill_date": "Bill Date",
	"customer_code": "Code",
	"customer_name": "Name",
	"amount": "Amount",
	"discount": "Discount",
	"net_total": "Net Total"
}
//Sum columns in grouping row and in Total row 
var sumColumns = ['amount', 'discount', 'net_total'] 

//show Total Row of Sum columns
var showTotal = true

//use JsonToHTMLTable to get HTML Table from json data, and configurations
var jsonToHTML = new JsonToHTMLTable({data:sampleData, groups:groupBy, groupRowValues: groupColValue, columnLabels: columnsAndLabels, sumColumns: sumColumns, showTotal: showTotal})

//getHtmlTable function will first create group in json data, then it will convert to HTML Table
var tableHtml =  jsonToHTML.getHtmlTable()

//Suppose you have <div id="tableContainer"></div>  then use the following line to show content inside div
document.getElementById('tableContainer').innerHTML = tableHtml;
```
