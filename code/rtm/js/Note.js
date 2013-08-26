/**
 * RTM note wrapper
 */
var Note = Ext.extend(Object, {
    constructor: function(id, text) {
        this.id = id;
        this.text = text;
    },
    getId: function() {
        return this.id;
    },
    getText: function() {
        return this.text;
    },
    setId: function(id) {
        this.id = id;
    },
    setText: function(text) {
        this.text = text;
    }
});
