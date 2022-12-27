@isTest
public class getTrackedFieldsTest {
    @isTest
    public static void testGetTrackedFields() {
        // Create a test account
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;

        String acctId = String.valueOf(testAccount.Id);
        
        // Add the test account to a list of sObjects
        List<String> recordIdList = new List<String> { acctId };
        // Call the getTrackedFields method and store the results in a list
        List<getTrackedFields.trackedFieldWrapper> fieldDefs = getTrackedFields.findTrackedFields(recordIdList);
        

    }
}
