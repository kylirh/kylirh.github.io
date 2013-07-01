Ext.define('MyApp.controller.Customers', {
    extend: 'Ext.app.Controller',
    stores: ['Customers'],
    models: ['Customer'],
    views: [
        'customer.List',
        'customer.Edit'
    ],

    init: function() {
        // Wire events up.
        this.control({
            'customerlist textfield[name=searchText]': {
                keyup: this.search
            },
            'customerlist': {
                itemdblclick: this.edit
            },
            'customeredit button[action=save]': {
                click: this.update
            }
        });
    },

    // Search for the customer with ANY of the supplied text.
    search: function(textfield) {
        // Handle no search criteria. Just clear the filter and return.
        if (typeof textfield.value !== 'string' || textfield.value.trim() === '') {
            this.getCustomersStore().clearFilter();
            textfield.focus();
            return;
        }
        
        // Get the search criteria.
        var values = textfield.value.toLowerCase().split(' ');

        // Filter the store by the search values.
        this.getCustomersStore().filterBy(function(item){
            var row = item.getData(),
                found = [];

            // Create a simple array that tracks whether or not all of the search values were found.
            for (var i = 0; i < values.length; i++)
                found.push(false);

            // Examine each piece of data in the row and compare it against the search query.
            for (var key in row) {
                if (row.hasOwnProperty(key) && typeof row[key] === 'string') {
                    var data = row[key].toLowerCase();

                    for (var i = 0; i < values.length; i++) {
                        if (data.indexOf(values[i]) > -1)
                            found[i] = true;
                    }
                }
            }

            // Cycle through the found array. If everything was found, then this item should stay in the grid.
            for (var i = 0; i < found.length; i++) {
                if (!found[i])
                    return false;
            }
            return true;
        });
        
        // Focus the textfield because the grid steals the focus for some silly reason.
        textfield.focus();
    },

    // Edits an existing customer.
    edit: function(grid, record) {
        var view = Ext.widget('customeredit');
        view.down('form').loadRecord(record);
    },

    // Update the customer.
    update: function(button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getCustomersStore().sync();
    }
});
