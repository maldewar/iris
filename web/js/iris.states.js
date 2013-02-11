IRIS.States = {
    default:{
        style:{
            r: 1,
            g: 1,
            b: 1,
            a: 1
        },
        opts:{
            type: IRIS.STATE_TYPE_HARD,
            easingIn: false,
            easingOut: false,
            lapseIn: 0,
            lapseOut: 0,
            duration: 0
        },
        onPop: false,
        onPush: false
    },
    hover:{
        style:{
            r: 1,
            g: 1,
            b: 0,
            a: 1
        },
        opts:{
            type: IRIS.STATE_TYPE_HARD,
            easingIn: TWEEN.Easing.Linear.None,
            easingOut: TWEEN.Easing.Linear.None,
            lapseIn: 300,
            lapseOut: 300,
            duration: 200
        },
        onPop: false,
        onPush: false
    }
};
