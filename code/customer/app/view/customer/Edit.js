Ext.define('MyApp.view.customer.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.customeredit',
    title: 'Edit Customer Information',
    layout: 'fit',
    autoShow: true,

    initComponent: function() {
        this.items = [{
            xtype: 'form',
            bodyPadding: '5 5 0',
            border: 0,
            items: [{
                xtype: 'textfield',
                name : 'firstName',
                fieldLabel: 'First Name',
                allowBlank: false,
                width: 400
            }, {
                xtype: 'textfield',
                name : 'lastName',
                fieldLabel: 'Last Name',
                allowBlank: false,
                width: 400
            }, {
                xtype: 'textfield',
                name : 'phone',
                fieldLabel: 'Phone',
                allowBlank: false,
                width: 400
            }, {
                xtype: 'textfield',
                name : 'ssn',
                fieldLabel: 'SSN',
                width: 400
            }, {
                xtype: 'textfield',
                name : 'address',
                fieldLabel: 'Address',
                width: 400
            }]
        }];

        this.buttons = [{
            text: 'Save',
            action: 'save'
        }, {
            text: 'Cancel',
            scope: this,
            handler: this.close
        }];

        this.callParent(arguments);
    }
});