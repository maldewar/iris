$.extend(iris.ui,{
    init:function(options){},
    //IN functions (calls from CORE)
    //create: function(type,id,value){},
    update: function(type,id,value){},
    delete: function(type,id){},
    //OUT functions (calls to CORE)
    createEntity: function(type,value){},
    updateEntity: function(type,id,value){},
    deleteEntity: function(type,id){},
    //UI Entity Functions
    minimize: function(type,id){},
    maximize: function(type,id){},
    restore: function(type,id){},
    enable: function(type,id){},
    disable: function(type,id){},
    focus: function(type,id){}
});
