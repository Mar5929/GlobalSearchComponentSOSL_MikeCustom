import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchClass.searchRecords';

export default class SearchComponent extends LightningElement {
  @track searchTerm;
  @track hasResults = false;
  @track resultWrapperList;
  @track noResults = false;


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
        searchFields: ['Name', 'Tax_Id__c', 'Website', 'StageName']
      })
        .then(results => {
          this.resultWrapperList = results;
          console.log('resultWrapperList = ' + JSON.stringify(this.resultWrapperList));
          this.hasResults = this.resultWrapperList.length >= 1;
          this.noResults = Object.keys(this.resultWrapperList).length === 0;
        })
        .catch(error => {
          // Handle error
        });
    } else {
      this.hasResults = false;
    }
  }

  handleResultClick(event) {
    const recordId = event.currentTarget.dataset.recordId;
    // Do something with the selected record's ID, such as dispatch an event
  }
}
