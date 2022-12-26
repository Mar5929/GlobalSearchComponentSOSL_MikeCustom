
@isTest
public class SearchClassTest {

    @isTest
    public static void testSearchRecords() {
        // Set up test data
        List<String> objectApiNames = new List<String>{'Account', 'Opportunity'};
        List<String> searchFields = new List<String>{'Name', 'Website', 'StageName', 'Amount'};
        String searchTerm = 'Test';

        
        // Insert test records
        Account a = new Account(Name='Test Account', Website='testAccount.com');
        insert a;

        Opportunity o = new Opportunity(Name='Test Opportunity', Amount=100, AccountId=a.Id, CloseDate=System.today() + 3, StageName='Propsecting');
        insert o;

        //setFixedSearchResults to properly test SOSL
        List<Id> fixedSearchResults = new List<Id>();
        fixedSearchResults.add(a.Id);
        fixedSearchResults.add(o.Id);
        Test.setFixedSearchResults(fixedSearchResults);

        Test.startTest();
        // Call the searchRecords method and verify the results
        List<SearchClass.SearchResultWrapper> searchResults = SearchClass.searchRecords(searchTerm, objectApiNames, searchFields);
        System.assertEquals(2, searchResults.size(), 'Incorrect number of search results. Expected 2');

        for(SearchClass.SearchResultWrapper result : searchResults) {
            if (result.objectName == 'Account') {
                // Verify that the first result has the correct object name and fields
                System.assertEquals('Account', result.objectName, 'Expected Account for object name');
                System.assertEquals(1, result.records.size(), 'Incorrect number of Account records. Expected 1');
                System.assertEquals(2, result.fields.size(), 'Incorrect number of Account fields. Expected 2');
            } else {
                //Verify that the second result has the correct object name and fields
                System.assertEquals('Opportunity', result.objectName, 'Expected Opportunity for object name');
                System.assertEquals(1, result.records.size(), 'Incorrect number of Opportunity records. Expected 1');
                System.assertEquals(3, result.fields.size(), 'Incorrect number of Opportunity fields. Expected 3');
            }
        }
        
        Test.stopTest();
    }
}
