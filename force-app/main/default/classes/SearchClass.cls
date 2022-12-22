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
    public static List<SObject> searchRecords(String searchTerm, List<String> objectApiNames, List<String> searchFields) {
        // Perform SOSL search
        String returningClauseString = '';
        searchTerm += '*';

        /*
        * TODO: check to see if the field in searchFields list is an available field on the object before building that portion of SOSL query
        */
        //start building RETURNING clause in SOSL query. 
        //Result should look something like 'Account(Name), Opportunity(Name), Account(Email), Opportunity(Email)'
        for (String searchField : searchFields) {
            //form objectApiName and fieldinto string for query
            for (String objectApiName : objectApiNames) {
                returningClauseString += objectApiName + '(' + searchField + '),';
            }
        }
        //remove the last character in the string if it is a comma
        if (returningClauseString.endsWith(',')) {
            returningClauseString = returningClauseString.substring(0, returningClauseString.length() - 1);
        }
        

        String sosl = 'FIND \'' + searchTerm + '\' RETURNING ' + returningClauseString;
        System.debug('SOSL Query = ' + sosl);

        List<List<SObject>> searchResults = search.query(sosl);
        List<SObject> flattenedResults = new List<SObject>();

        //Extract SObjects and convert them to list<SObject>
        for (List<SObject> sobList : searchResults) {
            for (SObject sobRecord : sobList) {
                flattenedResults.add(sobRecord);
            }
        }

        return flattenedResults;
    }
}
