Ext.define('MyApp.view.customer.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.customerlist',
    store: 'Customers',
    loadMask: true,
    emptyText: 'No Matching Records',
    width: 800,
    height: 400,
    frame: true,
    title: 'My Customers',

    initComponent: function() {
        this.columns = [
            { header: 'First Name', dataIndex: 'firstName', width: 100 },
            { header: 'Last Name', dataIndex: 'lastName', width: 100 },
            { header: 'Phone',  dataIndex: 'phone', width: 125 },
            { header: 'SSN',  dataIndex: 'ssn', width: 125 },
            { header: 'Address',  dataIndex: 'address', flex: 1 }
        ];

        this.tools = [{
            // The search textbox.
            xtype: 'textfield',
            name: 'searchText',
            emptyText: 'Search for a customer...',
            enableKeyEvents: true,
            width: 250
        }];

        this.callParent(arguments);
    }
});