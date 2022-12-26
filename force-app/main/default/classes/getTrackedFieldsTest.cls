@isTest
private class getTrackedFieldsTest {
    @isTest
    static void testGetTrackedFields() {
        // Create a test account
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;

        String acctId = String.valueOf(testAccount.Id);
        
        // Add the test account to a list of sObjects
        List<String> recordIdList = new List<String> { acctId };
        Test.startTest();
        // Call the getTrackedFields method and store the results in a list
        List<FieldDefinition> fieldDefs = getTrackedFields.findTrackedFields(recordIdList);
        Test.stopTest();

        System.debug('list of tracked fields = ' + fieldDefs);
        // Verify that the list is not empty
        System.assert(!fieldDefs.isEmpty(), 'Field definition list should not be empty');

        // Verify that all of the FieldDefinition objects in the list have the correct values
        for (FieldDefinition fieldDef : fieldDefs) {
            System.assertEquals(fieldDef.EntityDefinition.QualifiedApiName, 'Account', 'Entity name should be Account');
            System.assertEquals(fieldDef.IsFieldHistoryTracked, true, 'Field history should be tracked');
        }
    }
}
