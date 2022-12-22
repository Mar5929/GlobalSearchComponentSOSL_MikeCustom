/*
This Apex class defines a searchRecords method that takes three arguments: searchTerm, objectApiNames, and searchFields. 
The objectApiNames and searchFields arguments are both lists of strings, and they represent the object types and fields 
to include in the search results, respectively.

The searchRecords method constructs a SOSL query using the FIND keyword and the RETURNING clause, 
and it dynamically inserts the objectApiNames and searchFields values into the query. 
The query is then executed using the Database.query method, and the search results are returned as a list of SObject records.
*/

public class SearchClass {
    @AuraEnabled
    public static List<SearchResultWrapper> searchRecords(String searchTerm, List<String> objectApiNames, List<String> searchFields) {
        // Perform SOSL search
        String returningClauseString = '';
        searchTerm += '*';
        
        //map to hold object api name and list of fields queried
        Map<String, List<String>> mapObjFields = new Map<String, List<String>>();

		/*
        @Code Snippet Description: take the list of Object API names and list of fields and form them into a proper SOSL query
		1. Loop through objects (Account, Opportunity)
		2. Add object name to returning clause
		3. Check to see if field is an available field on the object and if so, add to list 'listFieldsForObject'
		4. convert list of fields to string and add to returningClauseString
		5. remove final character in returningClauseString
        @Code Snippet expected Result: should look something like 'Account(Name, Email), Opportunity(Name, Amount)'
		*/
		for (String objectApiName : objectApiNames) {
			//instantiate new list to help form fields portion of query in RETURNING clause
			List<String> listFieldsForObject = new List<String>();
			//instantiate new string to actually add to returningClauseString after looping through fields
			String strFieldsString = '';

			//Add object name to returningClauseString
			returningClauseString += objectApiName + '(';

            mapObjFields.put(objectApiName, new List<String>());
			
			//iterate over fields
			for (String searchField : searchFields) {
						
				//Check to see if field is an available field on the object and if so, add to list 'listFieldsForObject'
				if (isValidField(objectApiName, searchField)) {
					
					listFieldsForObject.add(searchField);

                    //build map for use in wrapper object "Fields" property
                    if(mapObjFields.containsKey(objectApiName)) {
                        mapObjFields.get(objectApiName).add(searchField);
                    } else {
                        List<String> forMapInstance = new List<String>();
                        forMapInstance.add(searchField);
                        mapObjFields.put(objectApiName, forMapInstance);
                    }
                    
				}
			}
			
			//convert list of fields to string and add to returningClauseString
			strFieldsString = String.join(listFieldsForObject,',');
			returningClauseString += strFieldsString + '),';
			
		}

        System.debug('mapObjFields = ' + mapObjFields);

        //remove the last character in the string if it is a comma
        if (returningClauseString.endsWith(',')) {
            returningClauseString = returningClauseString.substring(0, returningClauseString.length() - 1);
        }
        

        String sosl = 'FIND \'' + searchTerm + '\' IN ALL FIELDS RETURNING ' + returningClauseString;
        System.debug('SOSL Query = ' + sosl);

        List<List<SObject>> searchResults = search.query(sosl);
        System.debug('searchResults = ' + searchResults);

        //instantiate result list
        List<SearchResultWrapper> resultWrapperList = new List<SearchResultWrapper>();
        
        if(!searchResults.isEmpty()) {
            //Extract SObjects and convert them to list<SObject>
            for (List<SObject> sobList : searchResults) {
                if(!sobList.isEmpty()) {
                    //create new instance of wrapper object
                    SearchResultWrapper wrapperRecord = new SearchResultWrapper();

                    //set the records property of the object
                    wrapperRecord.records = sobList;
                    System.debug(wrapperRecord);
                    // Set the objectName property of the wrapper object
                    wrapperRecord.objectName = String.valueOf(sobList[0].Id.getSObjectType());
                    System.debug(wrapperRecord.objectName);

                    resultWrapperList.add(wrapperRecord);
                }

            }
        }

        for (SearchResultWrapper wrapperRec : resultWrapperList) {
            if (mapObjFields.containsKey(wrapperRec.objectName)) {
                wrapperRec.fields = mapObjFields.get(wrapperRec.objectName);
            }
        }
        
        System.debug('resultWrapperList = ' + resultWrapperList);
        return resultWrapperList;
    }

    // Method to check if a field is valid on an object
    public static Boolean isValidField(String objectApiName, String fieldApiName) {
        Schema.SObjectType objectType = Schema.getGlobalDescribe().get(objectApiName);
        if (objectType == null) {
            return false;
        }
        Map<String, Schema.SObjectField> fieldMap = objectType.getDescribe().fields.getMap();
        return fieldMap.containsKey(fieldApiName);
    }

    public class SearchResultWrapper {
        @AuraEnabled
        public List<SObject> records {get; set;}
        @AuraEnabled
        public String objectName {get; set;}
        @AuraEnabled
        public List<String> fields {get; set;}

        public SearchResultWrapper() {
            //List<SObject> records, String objectName, List<String> fields
            this.records = records;
            this.objectName = objectName;
            this.fields = fields;
        }
    }

}
