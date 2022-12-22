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
        System.assertEquals(2, searchResults.size(), 'Incorrect number of search results');

        for(SearchClass.SearchResultWrapper result : searchResults) {
            if (result.objectName == 'Account') {
                // Verify that the first result has the correct object name and fields
                System.assertEquals('Account', result.objectName, 'Incorrect object name');
                System.assertEquals(2, result.fields.size(), 'Incorrect number of fields');
                System.assertEquals(true, result.fields.contains('Name'), 'Something went wrong in determining if field is available on object');
                System.assertEquals(true, result.fields.contains('Website'), 'Something went wrong in determining if field is available on object');
                System.assertEquals(false, result.fields.contains('StageName'), 'Something went wrong in determining if field is available on object');
                System.assertEquals(false, result.fields.contains('Amount'), 'Something went wrong in determining if field is available on object');
            } else {
                //Verify that the second result has the correct object name and fields
                System.assertEquals('Opportunity', result.objectName, 'Incorrect object name');
                System.assertEquals(3, result.fields.size(), 'Incorrect number of fields');
                System.assertEquals(true, result.fields.contains('Name'), 'Something went wrong in determining if field is available on object');
                System.assertEquals(false, result.fields.contains('Website'), 'Something went wrong in determining if field is available on object');
                System.assertEquals(true, result.fields.contains('StageName'), 'Something went wrong in determining if field is available on object');
                System.assertEquals(true, result.fields.contains('Amount'), 'Something went wrong in determining if field is available on object');
            }
        }
        
        Test.stopTest();
    }
}
