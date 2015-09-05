
require(["network"], function(network) {
    /*
     network.get({
     server: "http://www.google.fi"
     }).then(function (data) {
     alert("success");
     }, function(data){
     alert("fail");
     });
     */
});

require(["jquery"], function($) {
    // For each application div, create application, and store the application data into the element itself.
    $("[application]").each(function(index){
        var element = $(this);
        require(["application/" + element.attr("application").toLowerCase()], function(Application){
            element.data("application", new Application({
                element: element
            }));
        });
    });
});

require(["howler" , "system"], function(howler , System){
    /*
     var sound = new howler.Howl({
     src: ['24_victorious.mp3']
     });

     sound.play();
     */

    var music = new System.Music("abba");

    System.Log({
        message: "Instance ID " + music.getID() + " for " + music.getFile()
    });
});


require(["jquery", "tween"] , function($, TWEEN) {
    var position;
    var target;
    var tween, tweenBack;

    init();
    animate();

    function init() {
        position = {rotation: -20};
        var element = $("#box");

        if(element.length < 1) {
            return;
        }

        target = element[0];
        tween = new TWEEN.Tween(position)
            .to({rotation: 20}, 2000)
            .delay(100)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(update);

        tweenBack = new TWEEN.Tween(position)
            .to({rotation: -20}, 2000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(update);

        tween.chain(tweenBack);
        tweenBack.chain(tween);

        tween.start();
    }

    function animate( time ) {
        requestAnimationFrame( animate );
        TWEEN.update( time );
    }

    function update() {
        target.style.transform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
    }
});

require(["jquery", "three" , "tween" , "system"] , function($, THREE, Tween, System) {
    var container;

    var camera, scene, renderer;

    var uniforms;
    return;

    init();
    animate();

    function init() {
        container = document.getElementById( 'middle' );

        camera = new THREE.Camera();
        camera.position.z = 1;

        scene = new THREE.Scene();

        var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

        uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() }
        };

        var material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        } );

        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        container.appendChild( renderer.domElement );

        onWindowResize();

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize( event ) {
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio( window.devicePixelRatio );

        uniforms.resolution.value.x = renderer.domElement.width;
        uniforms.resolution.value.y = renderer.domElement.height;
    }

    //

    function animate() {
        requestAnimationFrame( animate );

        render();
    }

    function render() {
        uniforms.time.value += 0.05;

        renderer.render( scene, camera );
    }
});

