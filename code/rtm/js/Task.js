var Task = Ext.extend(Object, {
    constructor: function(json, rtm) {
        Ext.applyIf(this, json);
        this.rtm = rtm;
    },
    addPomodoro: function() {
        this.pomodoros.total++;
        this.updateTaskPomodoros();
    },
    removePomodoro: function() {
        this.pomodoros.total--;
        this.pomodoros.completed = Math.min(this.pomodoros.completed, this.pomodoros.total);
        this.updateTaskPomodoros();
    },
    completePomodoro: function() {
        this.pomodoros.completed++;
        this.pomodoros.total = Math.max(this.pomodoros.total, this.pomodoros.completed);
        this.updateTaskPomodoros();
    },
    uncompletePomodoro: function() {
        if (this.pomodoros.completed > 0) {
            this.pomodoros.completed--;
        }
        this.updateTaskPomodoros();
    },
    completeTask: function() {
        this.rtm.addToUpdateQueue(function(callback) {
            this.rtm.completeTask(this, callback);
        }.bind(this));
    },
    /**
     * Returns true if the task is repetitive
     * @return {boolean}
     */
    isRepetitive: function() {
        return this.repetitive;
    },
    getId: function() {
        return this.id;
    },
    getDueDate: function() {
        return this.dueDate;
    },
    getTags: function() {
        return this.tags;
    },
    getTagsText: function() {
        return this.tags.join(', ');
    },
    /**
     * Pomodoro Note text taking into account number of completed and incomplete pomodoros.
     * Returns new text value.
     * @return {String}
     */
    syncPomodoroNoteText: function() {
        if (this.repetitive) {
            var taskPrefix = this.id + ':';
            var taskLineRegexp = taskPrefix + '.*';
            var newTaskLine = taskPrefix + this.pomodoros.toString();
            if (this.pomodoroNote.getText()) {
                if (this.pomodoroNote.getText().indexOf(taskPrefix) >= 0) {
                    var newNoteText = this.pomodoroNote.getText().replace(new RegExp(taskLineRegexp), newTaskLine);
                    this.pomodoroNote.setText(newNoteText);
                } else {
                    this.pomodoroNote.setText(this.pomodoroNote.getText() + '\n' + newTaskLine);
                }
            } else {
                this.pomodoroNote.setText(newTaskLine);
            }
        } else {
            this.pomodoroNote.setText(this.pomodoros.toString());
        }
        return this.pomodoroNote.getText();
    },
    /**
     * @private
     */
    updateTaskPomodoros: function() {
        this.rtm.addToUpdateQueue(function(callback) {
            this.rtm.updateOrCreatePomodoroNote(this, callback);
        }.bind(this));
    }
});

//static functions
Ext.apply(Task, {
    fromResponse: function(rsp, rtm) {
        var result = [];
        eachItem(rsp.tasks.list, function(item){
            eachItem(item.taskseries, function(serie){
                eachItem(serie.task, function(serieTask){
                    var pomodoroNote;
                    eachItem(serie.notes.note, function(note) {
                        if (note.title == 'pomodoro') {
                            pomodoroNote = rtm.getCachedTaskNote(serie.id, new Note(note.id, note['$t']));
                        }
                    });
                    if (!pomodoroNote) {
                        pomodoroNote = rtm.getCachedTaskNote(serie.id, new Note(null, ''));
                    }
                    var json = {
                        listId: item.id,
                        name:serie.name,
                        taskSeriesId:serie.id,
                        id:serieTask.id,
                        repetitive:serie.rrule != null,
                        pomodoroNote:pomodoroNote,
                        tags: array(serie.tags.tag),
                        url: serie.url,
                        dueDate: new Date(serieTask.due)
                    };
                    var task = new Task(json, rtm);
                    task.pomodoros = Pomodoros.fromNote(pomodoroNote, task.getId());
                    result.push(task);
                });
            });
        });
        return result;
    }
});
