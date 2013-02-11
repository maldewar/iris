<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery.min.js"></script>
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery-ui.min.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/three.min.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/threex.domevent.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/threex.domevent.object3d.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/tween.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/TrackballControls.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/Sparks.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/Sparks.Zone.js"></script>
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/iris.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/iris.ui.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/iris.states.js"></script>
	<title>Iris</title>
</head>
<body>
<div id="tplNetwork">
</div>
<div>
<script type="text/javascript">
$('body').iris({
    dataSource:{
        network:{
            uri:'/aircrack/index.php?r=api/getNetworks',
            rate:5000,
            auto:true
        },
        device:{
            uri:'/aircrack/index.php?r=api/getDevices',
            rate: 5000,
            auto:true
        }
    },
    entity:{
        network:{},
        device:{},
        neto:{
            ds:'network',
            index:'BSSID'
        },
    },
    view:{
        network:'#tplNetwork'
    }
});
var circle = new SPARKS.CircleZone(0,0,0,10);
</script>
</div>
</body>
</html>
