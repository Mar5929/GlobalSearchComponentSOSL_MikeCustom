import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchClass.searchRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
          if (!this.noResults) {
            this.showSuccessToast('Found Records');
          }
          
        })
        .catch(error => {
          this.showErrorToast('Something went wrong while searching for fields');
        });
    } else {
      this.hasResults = false;
    }
  }

  handleResultClick(event) {
    const recordId = event.currentTarget.dataset.recordId;
    // Do something with the selected record's ID, such as dispatch an event
  }

  showErrorToast(errorMessage) {
    const event = new ShowToastEvent({
        title: 'Error',
        message: errorMessage,
        variant: 'error'
    });
    this.dispatchEvent(event);
  }

  showSuccessToast(successMessage) {
    const event = new ShowToastEvent({
        title: 'Success!',
        message: successMessage,
        variant: 'success'
    });
    this.dispatchEvent(event);
  }

}
