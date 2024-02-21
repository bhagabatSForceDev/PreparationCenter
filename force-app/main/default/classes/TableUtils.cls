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
            system.debug('Column:'+td.Column__c);
            List<Object> columnList=(List<Object>)JSON.deserializeUntyped(td.Column__c);
            Integer latestNumber=1;
            if(td.Rows__r.size()>0){
                Map<String,Object> mapRow= (Map<String,Object>)JSON.deserializeUntyped(td.Rows__r[0].Data__c);
                latestNumber=Integer.valueOf(mapRow.get('index'))+1;
            }
            String rowData='{ "index":"'+latestNumber+'",';
            for(Object col: columnList){
                system.debug('col:'+JSON.serialize(col));
                Map<String,Object> mapCol= (Map<String,Object>)JSON.deserializeUntyped(JSON.serialize(col));
                // for(String key: mapCol.keySet()){
                //     if(key!='index' && key!='type' && key!='editable')
                // }
                
                rowData+='"'+mapCol.get('fieldName')+'":"",';
                
            }
            rowData=rowData.subString(0,rowData.length()-1);
            rowData+='}';

            Row__c rc= new Row__c();
            rc.Table__c=tableId;
            rc.Data__c=rowData;
            Insert rc;

             return 'true';
        } catch (Exception e) {
            system.debug('Exception e:'+e.getMessage());
            system.debug('Stack: '+e.getStackTraceString());
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
    @AuraEnabled
    public static string saveRows(String editedData, String tableId){
        try{
        List<EditData> editData=(List<EditData>)JSON.deserialize(editedData, List<EditData>.class);
        Table__c td= [SELECT Id,column__c,(SELECT Id,Data__c FROM Rows__r)
             FROM Table__c WHERE Id=: tableId];
            
        Map<String,Id> rowIndexVsId= new Map<String,Id>();
            for(Row__c r: td.Rows__r){
                Map<String,Object> rowMap=(Map<String,Object>)JSON.deserializeUntyped(r.Data__c);
                system.debug('Index value:'+JSON.serialize(rowMap.get('index')));
                rowIndexVsId.put(JSON.serialize(rowMap.get('index')),r.Id);
            }
         system.debug('rowIndexVsId:'+rowIndexVsId);
        List<Row__c> rowsToUpdate= new List<Row__c>();    
        for(EditData e: editData){
            system.debug('e:'+e);
            system.debug('e.index:'+e.index);
            system.debug('rowIndexVsId.get(e.index): '+rowIndexVsId.get(JSON.serialize(e.index)));
            Row__c upRow= new Row__c();
            upRow.Id=rowIndexVsId.get(JSON.serialize(e.index));
            upRow.Data__c=JSON.serialize(e.data);
            
            rowsToUpdate.add(upRow);
        }
            
		update rowsToUpdate;
            
        return 'true';
        }Catch(Exception e){
            system.debug('Error: '+e.getMessage());
            system.debug('Stack trace -- '+e.getStackTraceString());
            return e.getMessage()+'--'+e.getStackTraceString();
        }
    }

    
    public class EditData{
        @AuraEnabled
        public String index;
        @AuraEnabled
        public Map<String,String> data;
    }

    public class TableData{
        @AuraEnabled 
        public String column;
        @AuraEnabled
        public List<String> rowData;
        
    }
    

}