public without sharing class TableUtils {
    

    @AuraEnabled
    public static TableData getTableData(String tableId){
        try {
            
            TableData retTd= new TableData(); 
            
            Table__c td= [SELECT Id,column__c,(SELECT Id,Data__c FROM Rows__r ORDER BY CreatedDate ASC)
             FROM Table__c WHERE Id=: tableId];
             if(td==NULL){
                 return null;
             }else{
                retTd.column=td.column__c;
                List<String> strList= new List<String>();
                for(Row__c r: td.Rows__r){
                    strList.add(r.Data__c);
                }
                retTd.rowdata=strList;

                return retTd;
             }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string createRow(String tableId){
        try {
            Table__c td= [SELECT Id,column__c,(SELECT Id,Data__c FROM Rows__r ORDER BY CreatedDate DESC LIMIT 1)
             FROM Table__c WHERE Id=: tableId];
            List<String> columnList=(List<String>)JSON.deserialize(td.Column__c,List<String>.class);
            Integer latestNumber=1;
            if(td.Rows__r.size()>0){
                Map<String,Object> mapRow= (Map<String,Object>)JSON.deserializeUntyped(td.Rows__r[0].Data__c);
                latestNumber=mapRow.get('index')+1;
            }
            String rowData='{ "index":"'+latestNumber+'",';
            for(String col: columnList){
                Map<String,Object> mapCol= (Map<String,Object>)JSON.deserializeUntyped(col);
                // for(String key: mapCol.keySet()){
                //     if(key!='index' && key!='type' && key!='editable')
                // }
                
                rowData+='"'+mapCol.get('fieldName')+'":"",';
                
            }
            rowData=rowData.subString(0,rowData.length()-1);
            rowData+='}'

            Row__c rc= new Row__c();
            rc.Table__c=tableId;
            rc.Data__c=rowData;
            Insert rc;

             return 'true';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    public class TableData{
        @AuraEnabled 
        public String column;
        @AuraEnabled
        public List<String> rowData;
        
    }
    


}
