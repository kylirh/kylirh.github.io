var Pomodoros = Ext.extend(Object, {
    constructor: function(total, completed) {
        this.total = total;
        this.completed = completed;
    },
    toString: function() {
        var s = '';
        for (var i = 0; i < this.completed; i++) {
            s += '[*]';
        }
        for (var i = 0; i < this.total - this.completed; i++) {
            s += '[]'
        }
        return s;
    }
});

//static functions
Ext.apply(Pomodoros, {
    /**
     * Creates Pomodoros object using task notes.
     * Since task series can contain several tasks, it uses task id in order to find pomodoros of specific task.
     * Thus two formats are supported for pomodoro notes:
     * Simple note:
     *  [*][*][], where [*] means completed pomodoro, [] means incomplete pomodoro
     * Multitask note:
     *  [][]                    - default pomodoros (optional)
     *  taskId1:[*][*][]        - first task pomodoros
     *  taskId2:[*][*][*][][]   - second task pomodoros
     *
     * @param noteText
     * @param taskId
     * @return {*}
     */
    fromNote: function(note, taskId) {
        var pomodoros;
        Ext.each(note.getText().split('\n'), function(noteLine) {
            var taskPrefix = taskId + ':';
            var pomodorosText;
            if (noteLine.indexOf(taskPrefix) == 0) {
                pomodorosText = noteLine.slice(taskPrefix.length);
            } else {
                pomodorosText = noteLine;
            }
            if (/^(\[\*{0,1}\])*$/.test(pomodorosText)) {
                pomodoros = new Pomodoros(countOfSubstrings(pomodorosText, '['), countOfSubstrings(pomodorosText, '*'));
            }
        });
        if (!pomodoros) {
            pomodoros = new Pomodoros(0, 0);
        }
        return pomodoros;
    }
});
