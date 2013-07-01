Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'MyApp',
    appFolder: 'app',
    controllers: [
        'Customers'
    ],
    launch: function() {
        Ext.widget('customerlist', {
            renderTo: Ext.getBody()
        });
    }
});