import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchClass.searchRecords';

export default class SearchComponent extends LightningElement {
  @track searchTerm;
  @track searchResults = [];
  @track hasResults = false;
  @track resultWrapperList;


  columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Tax Id', fieldName: 'Tax_Id__c' }
  ];


  handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        // Get the input value from the event target
        this.searchTerm = event.target.value;
        console.log('searchTerm = ' + this.searchTerm);

        this.handleSearchChange();
    }
  }

  handleSearchChange() {
    // Perform SOSL search if the search term is not empty
    if (this.searchTerm) {
      search({
        searchTerm: this.searchTerm,
        objectApiNames: ['Account', 'Opportunity'],
        searchFields: ['Name', 'Tax_Id__c']
      })
        .then(results => {
          this.searchResults = results;
          console.log('searchResults = ' + JSON.stringify(this.searchResults));
          this.resultWrapperList = results;
          console.log('resultWrapperList = ' + JSON.stringify(this.resultWrapperList));
          this.hasResults = this.searchResults.length >= 1;
        })
        .catch(error => {
          // Handle error
        });
    } else {
      this.searchResults = [];
      this.hasResults = false;
    }
  }

  handleResultClick(event) {
    const recordId = event.currentTarget.dataset.recordId;
    // Do something with the selected record's ID, such as dispatch an event
  }
}
