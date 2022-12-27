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

    public class trackedFieldWrapper {
        @AuraEnabled
        public String value {get; set;}
        @AuraEnabled
        public String label {get; set;}

        public trackedFieldWrapper() {
            
            this.value = value;
            this.label = label;
        }


    }

    @AuraEnabled
    public static List<trackedFieldWrapper> findTrackedFields(List<String> recordIdList) {
        //instantiate list of wrapper objects
        List<trackedFieldWrapper> wrapperResults = new List<trackedFieldWrapper>();
        

        if(!recordIdList.isEmpty()) {
            //get Object Api name
            String objName = Id.valueOf(recordIdList[0]).getSObjectType().getDescribe().getName();
            
            String soqlQueryForFieldDefinition = 'SELECT Label, DeveloperName,QualifiedApiName,EntityDefinition.QualifiedApiName,IsFieldHistoryTracked FROM FieldDefinition WHERE IsFieldHistoryTracked = true AND EntityDefinition.QualifiedApiName = :objName ORDER BY DeveloperName ASC';
    
            List<FieldDefinition> listQueryRestulst = Database.query(soqlQueryForFieldDefinition);

            if(!listQueryRestulst.isEmpty())
            for(FieldDefinition trackedField : listQueryRestulst) {
                trackedFieldWrapper wrapper = new trackedFieldWrapper();
                wrapper.value = trackedField.QualifiedApiName;
                wrapper.label = trackedField.Label;

                wrapperResults.add(wrapper);
            }
        }

        return wrapperResults;
    }
}
