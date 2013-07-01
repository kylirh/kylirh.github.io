Ext.define('MyApp.store.Customers', {
    extend: 'Ext.data.Store',
    model: 'MyApp.model.Customer',
    autoLoad: true,

    proxy: {
	    type: 'ajax',
	    api: {
	        read: 'data/customers.js',
	        update: 'data/updateCustomers.js'
	    },
	    reader: {
	        type: 'json',
	        root: 'customers',
	        successProperty: 'success'
	    }
	}
});
