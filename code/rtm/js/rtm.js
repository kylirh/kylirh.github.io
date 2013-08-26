var RTM = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        this.apiKey = '5e69d5667c0df4dadd544009c6d873ef';
        this.secret =  '4a393cc5d1683e2e';
        this.authToken =  null;
        this.restUrl =  'http://api.rememberthemilk.com/services/rest/';
        this.updateQueue =  [];
        this.taskNotes = {};
        this.callParent();
    },
    saltParams: function(params) {
        // sort alphabetically
        var sortedParams = sortObject(params, function(a, b){ return a.key.localeCompare(b.key) });
        var tokenToSalt = this.secret + $.map(sortedParams, function(v, k){ return k + v }).join('');
//        console.log(tokenToSalt);
        return '' + CryptoJS.MD5(tokenToSalt);
    },
    paramsToString: function(params) {
        return $.map(params, function(v, k){ return encodeURIComponent(k) + '=' + encodeURIComponent(v)}).join('&');
    },
    getLoginUrl: function() {
        var params = {api_key: this.apiKey, perms: 'write'};
        return "http://api.rememberthemilk.com/services/auth/?" + this.paramsToString(params) + "&api_sig=" + this.saltParams(params);
    },
    rest: function(params, callbacks) {
        callbacks = $.extend({success: Ext.emptyFn, failure: Ext.emptyFn}, callbacks);
        var actualParams = $.extend({}, params);
        var callbackName = $.ajaxSettings.jsonpCallback();
        actualParams.callback = callbackName;
        actualParams.format = 'json';
        actualParams._ = Date.now();
        actualParams.api_sig = rtm.saltParams(actualParams);
        delete actualParams.callback;
        $.ajax({
            url: this.restUrl,
            dataType: 'jsonp',
            data: actualParams,
            cache:true,
            jsonpCallback: callbackName,
            success: function(data, textStatus) {
                console.log('rsp', data);
                if (data && data.rsp && data.rsp.stat == 'ok') {
                    callbacks.success(data.rsp);
                } else {
                    callbacks.failure(data, textStatus);
                }
            },
            error: function(data) {
                console.log('error', data);
                callbacks.failure();
            }
        });
    },
    restGetAuthToken: function(frob, callback) {
        var params = {method: 'rtm.auth.getToken', api_key: rtm.apiKey, frob: frob};
        rtm.rest(params, {success: callback});
    },
    restGetTasks: function(callback) {
        // we have to specify last_sync in order to avoid RTM request caching issue
        var filter = '(due:yesterday OR due:today OR due:tomorrow OR tag:pomodoro) AND status:incomplete';
        var params = {method: 'rtm.tasks.getList', api_key: this.apiKey, auth_token: this.authToken, filter: filter, last_sync: Date.now()};
        this.rest(params, {success:callback});
    },
    restCreateTimeline: function(callback) {
        var params = {method: 'rtm.timelines.create', api_key: this.apiKey, auth_token: this.authToken};
        this.rest(params, {success:callback});
    },
    restTestLogin: function(callbacks) {
        var params = {method: 'rtm.test.login', api_key: this.apiKey, auth_token: this.authToken};
        this.rest(params, callbacks);
    },
    completeTask: function(task, callback) {
        this.restCreateTimeline(function(rsp){
            var params = {method: 'rtm.tasks.complete', api_key: this.apiKey, auth_token: this.authToken,
                timeline: rsp.timeline,
                list_id: task.listId,
                taskseries_id: task.taskSeriesId,
                task_id: task.id
            };
            this.rest(params, {success:callback});
        }.bind(this));
    },
    getTasks: function(callback) {
        rtm.restGetTasks(function(rsp){
            /**
             * We have to filter tasks by due date, because RTM API does not work correctly with timezones.
             * Tasks with #pomodoro tag are also displayed even if their due date is not today.
             */
            var taskFilter = function(task){
                return this.dueToday(task) || this.hasPomodoroTag(task)
            }.bind(this);
            var sortedTasks = this.sortTasksByNameIgnoreCase(filterArray(Task.fromResponse(rsp, this), taskFilter));
            callback(sortedTasks);
        }.bind(this));
    },
    /**
     * Returns true if the task due date is today
     * @private
     * @param task
     * @return {Boolean}
     */
    dueToday: function(task) {
        var beginningOfDay = new Date().setHours(0, 0, 0, 0);
        var endOfDay = new Date().setHours(24, 0, 0, 0);
        var time = task.getDueDate().getTime();
        return time >= beginningOfDay && time < endOfDay;
    },
    hasPomodoroTag: function(task) {
        return task.getTags().indexOf('pomodoro') >= 0;
    },
    sortTasksByNameIgnoreCase: function (tasks) {
        var tasksCopy = cloneArray(tasks);
        tasksCopy.sort(function(a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        });
        return tasksCopy;
    },
    createPomodoroNote: function(task, callback) {
        this.restCreateTimeline(function(rsp) {
            rsp.timeline;
            var params = {method: 'rtm.tasks.notes.add', api_key: this.apiKey, auth_token: this.authToken,
                timeline: rsp.timeline,
                list_id: task.listId,
                taskseries_id: task.taskSeriesId,
                task_id: task.id,
                note_title: 'pomodoro',
                note_text: task.syncPomodoroNoteText()
            };
            this.rest(params, {success:function(rsp){
                task.pomodoroNote.setId(rsp.note.id);
                callback();
            }});
        }.bind(this));
    },
    updatePomodoroNote: function(task, callback) {
        this.restCreateTimeline(function(rsp){
            var params = {method: 'rtm.tasks.notes.edit', api_key: this.apiKey, auth_token: this.authToken,
                timeline: rsp.timeline,
                note_id: task.pomodoroNote.getId(),
                note_title: 'pomodoro',
                note_text: task.syncPomodoroNoteText()
            };
            this.rest(params, {success:callback});
        }.bind(this));
    },
    loadTask: function(taskId, callback) {
        callback = callback || Ext.emptyFn;
        this.restGetTasks(function(rsp) {
            var found = find(Task.fromResponse(rsp, this), function(task){ return task.id == taskId });
            callback(found);
        })
    },
    updateOrCreatePomodoroNote: function(task, callback) {
        if (task.pomodoroNote.getId() != null) {
            this.updatePomodoroNote(task, callback);
        } else {
            this.createPomodoroNote(task, callback);
        }
    },
    addToUpdateQueue: function(func) {
        this.updateQueue.push(func);
        if (this.updateQueue.length == 1) {
            this.processUpdateQueue();
        }
    },
    processUpdateQueue: function() {
        if (this.updateQueue.length > 0) {
            if (this.updateQueue.length == 1) {
                this.fireEvent('updatestarted');
            }
            var updateTask = this.updateQueue[0];
            updateTask(function() {
                this.updateQueue = this.updateQueue.slice(1);
                this.processUpdateQueue();
            }.bind(this));
        } else {
            this.fireEvent('updatecompleted');
        }
    },
    /**
     * Wraps RTM note JSON into the Note object.
     * Returns the same instance of Note for notes with the same ID.
     * @param rtmNote
     */
    wrapTaskNote: function(taskSeriesId, rtmNote) {
        return this.getCachedTaskNote(taskSeriesId, new Note(rtmNote.id, rtmNote['$t']));
    },
    getCachedTaskNote: function(taskSeriesId, defaultNote) {
        if (this.taskNotes[taskSeriesId]) {
            return this.taskNotes[taskSeriesId];
        } else {
            return this.taskNotes[taskSeriesId] = defaultNote;
        }
    }
});

var rtm = new RTM();
