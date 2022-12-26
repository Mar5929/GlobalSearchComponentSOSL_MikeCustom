/**
 * This class contains an Apex method that accepts a list of sObjects as a parameter and
 * returns a list of FieldDefinition objects. The method gets the name of the sObject from 
 * the first element in the sObject list and uses it to build a SOQL query to retrieve all 
 * field definitions for the sObject where the field history is tracked. 
 * The results of the query are returned in a list of FieldDefinition objects.
 */

 //TODO - REWORK TO RETURN A WRAPPER OBJECT THAT RETURNS LABEL AND VALUE PROPERTIES PER FIELD
 //https://www.infallibletechie.com/2021/04/lightning-dual-listboxlightning-combo.html
public class getTrackedFields {

    @AuraEnabled
    public static List<FieldDefinition> findTrackedFields(List<String> recordIdList) {
        List<FieldDefinition> results = new List<FieldDefinition>();
        

        if(!recordIdList.isEmpty()) {
            //get Object Api name
            String objName = Id.valueOf(recordIdList[0]).getSObjectType().getDescribe().getName();
            
            String soqlQueryForFieldDefinition = 'SELECT DeveloperName,QualifiedApiName,EntityDefinition.QualifiedApiName,IsFieldHistoryTracked FROM FieldDefinition WHERE IsFieldHistoryTracked = true AND EntityDefinition.QualifiedApiName = :objName ORDER BY DeveloperName ASC';
    
            results = Database.query(soqlQueryForFieldDefinition);
        }

        return results;
    }
}
