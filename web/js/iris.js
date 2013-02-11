IRIS = {};

    var iris={
        context:{},
        enum: {
            dsFile:'file',
            dsAjax:'ajax',
            dsObject:'object'
        },
        ui:{},
        id:{},
        clazz:{},
        obj:{},
        objCtrl:{},
        dataSource:{},
        dataSourceCtrl:{},
        rel:{
            dataSourceEntity:{},
            entityDataSource:{}
        },
        entity:{},
        loadDataSource:function(dsName,dsParams) {
            if (!iris.dataSource[dsName])
                return false;
            var ds = iris.dataSource[dsName];
            switch (ds.mode) {
                case iris.enum.dsAjax:
                    $.ajax({
                        url: ds.uri,
                        type: ds.modeOptions.type,
                        data: $.extend(ds.modeOptions.data, dsParams),
                        dataType: ds.modeOptions.dataType,
                        success: iris.loadSuccess,
                        error: iris.loadError,
                        complete: iris.loadComplete,
                        context: {
                            dsName: dsName,
                            dsParams: dsParams
                        }
                    });
                break;
                case iris.enum.dsFile:
                case iris.enum.dsObject:
                default:
                break;
            }
        },
        loadSuccess:function(data){
            iris.extractEntity(this.dsName, data);
        },
        loadError:function(){},
        loadComplete:function(){
            var ds = iris.dataSource[this.dsName];
            if (ds.auto) {
                //if (false)
                var dsName = this.dsName;
                var dsParams = this.dsParams;
                iris.dataSourceCtrl[this.dsName]['timeout'] = setTimeout(function(){
                    iris.loadDataSource(dsName, dsParams);
                }, ds.rate);
            }
        },
        extractEntity: function(dsName, data) {
            if (typeof iris.rel.dataSourceEntity[dsName] == 'object') {
                $.each(iris.rel.dataSourceEntity[dsName], function(index,entityName) {
                    var entity = iris.entity[entityName];
                    if (entity.path != '') {
                        //Look on the path
                    } else {
                        iris.processEntity(entityName, data);
                    }
                });
            }
        },
        processEntity: function(entityName, data) {
            var entity = iris.entity[entityName];
            if (! iris.obj[entityName]) {
                iris.obj[entityName] = {};
                iris.objCtrl[entityName] = {};
            }
            $.each(data,function(key,value){
                var index = key;
                if (typeof entity.index != 'undefined' &&  entity.index != '') {
                    index = value[entity.index];
                    if (typeof index == 'undefined') return false;
                }
                var render = iris.createEntity(entityName, index, value);
                if (render)
                    iris.renderEntity(entityName, index, value);
            });
        },
        createEntity: function(entityName, index, value) {
            var currentTS = (new Date()).getTime();
            if (typeof iris.obj[entityName][index] == 'undefined') {
                iris.objCtrl[entityName][index] = {
                    created:currentTS,
                    updated:currentTS
                };
                if (typeof iris.ui.create == 'function')
                    iris.ui.create(entityName, index, value);
            } else {
                iris.objCtrl[entityName][index]['updated'] = currentTS;
            }
            iris.obj[entityName][index] = value;
        }
    };


(function( $ ) {
    var methods = {
        init: function( options ) {
            //Init dataSources
            $.extend(true, iris.dataSource, options.dataSource);
            var strDataSource={
                    uri:'',
                    rate: 60000,
                    auto: false,
                    mode: iris.enum.dsAjax,
                    modeOptions: {
                        type: 'GET',
                        data: {},
                        dataType: 'json'
                    }
                };
            for (var key in iris.dataSource) {
                var typeOfDS = typeof iris.dataSource[key];
                if (typeOfDS == 'string') {
                    var uri = iris.dataSource[key];
                    iris.dataSource[key] = $.extend(true, iris.dataSource[key], strDataSource);
                    iris.dataSource[key]['uri'] = uri;
                    iris.dataSourceCtrl[key]={};
                } else if (typeOfDS == 'object') {
                    var DS = iris.dataSource[key];
                    DS = $.extend(true, {}, strDataSource, DS);
                    iris.dataSource[key] = DS;
                    iris.dataSourceCtrl[key] = {};
                }
                if (typeof iris.dataSource[key]['uri'] == 'undefined' || $.trim(iris.dataSource[key]['uri']) == ''){
                    delete iris.dataSource[key];
                }
            }

            // Init entities
            $.extend(true, iris.entity, options.entity);
            var strEntity={
                    ds: '',
                    path: '',
                    index: '',
                    label: '',
                    include: {},
                    exclude: {}
                };
            for (var key in iris.entity) {
                var typeOfEnt = typeof iris.entity[key];
                if (typeOfEnt == 'string') {
                    var path = iris.entity[key];
                    iris.entity[key] = $.extend(true, iris.entity[key], strEntity);
                    iris.entity[key]['path'] = path;
                } else if (typeOfEnt == 'object') {
                    var Ent = iris.entity[key];
                    Ent = $.extend(true, {}, strEntity, Ent);
                    iris.entity[key] = Ent;
                }
                if (iris.entity[key]['ds'] == '') {
                    iris.entity[key].ds = key;
                }
                if (typeof iris.dataSource[iris.entity[key]['ds']] != 'object') {
                    delete iris.entity[key];
                } else {
                    if (typeof iris.rel.dataSourceEntity[iris.entity[key]['ds']] != 'object')
                        iris.rel.dataSourceEntity[iris.entity[key]['ds']] = [];
                    iris.rel.dataSourceEntity[iris.entity[key]['ds']].push(key);
                    if (typeof iris.rel.entityDataSource[key] != 'array')
                        iris.rel.entityDataSource[key] = [];
                    iris.rel.entityDataSource[key].push(iris.entity[key]['ds']);
                }
            }

            //Run Datasources on auto
            $.each(iris.dataSource,function(dsName,ds){
                if (ds.auto)
                    iris.loadDataSource(dsName);
            });
            iris.context = this;
            if (typeof iris.ui.init == 'function')
                iris.ui.init();
            return this;
        },
        config: function() {
            return iris;
        },
        load: function( options ) {
            var strOpts = {
                name:'',
                params:{}
            };
            if (typeof options == 'string')
                strOpts.name = options;
            else
                $.extend(strOpts, options);
            iris.loadDataSource(strOpts.name, strOpts.params);
            return this;
        }
    };

    $.fn.iris = function( method ) {

        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
    };

})(jQuery);
