<script>
    import { onDestroy, onMount } from "svelte";

	// Source: https://codepen.io/brunorcunha/pen/wikEI
    let mouseX = 100;
    let mouseY = 100;
    let nyanX = 0;
    let nyanY = 0;
    let animationState = false;
    let frame = 0;
    
    let nyanElement;
    let rainbowElements = [];
    let rainbowTrail = [];
    
    const WINDOW_HEIGHT = 800;
    const TILE_SIZE = 9;
    const ANIMATION_FRAME_WIDTH = 34;
    const MOVE_INTERVAL = 10;
    const ANIMATION_TOGGLE_INTERVAL = 500;
    const FRAME_UPDATE_INTERVAL = 100;
    
    let tIntervalID1, tIntervalID2, tIntervalID3;

    // function getRandomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    function handleMouseMove(event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    }

	// function criarEstrela()
	// {
	// 	var rand = getRandomInt(3, 14);
	// 	var tempoDeVida = getRandomInt(5,10);
	// 	var star = $('<div class="star"/>').css({
	// 	width:rand+'px',
	// 	height:rand+'px',
	// 	left: largura-10+'px', 
	// 	top: Math.floor((Math.random()*altura)+1), 
	// 	'-webkit-transition': 'all '+tempoDeVida+'s linear',
	// 	'-webkit-transform': 'translate(0px, 0px)'
	// 	});
	// 	$('body').append(star);
		
	// 	window.setTimeout(function(){
	// 		star.css({
	// 			'-webkit-transform': 'translate(-'+largura+'px, 0px)'
	// 		});
	// 	}, getRandomInt(5,10)*10);  

	// 	window.setTimeout(function(){star.remove();}, tempoDeVida*1000);
	// }

    function moveNyan() {
        if (!nyanElement) return;
        
        const nyanWidth = nyanElement.offsetWidth / 2;
        const nyanHeight = nyanElement.offsetHeight / 2;
        
        nyanX += (mouseX - nyanX - nyanWidth) / 50;
        nyanY += (mouseY - nyanY - nyanHeight) / 50;
        
        nyanElement.style.left = nyanX + 'px';
        nyanElement.style.top = nyanY + 'px';
    }

    function drawRainbow() {
        if (!nyanElement) return;
        
        const qnt = Math.floor(nyanElement.offsetLeft / TILE_SIZE) + 2;
        
        if (rainbowTrail.length >= qnt) {
            rainbowTrail.pop();
        }
        
        rainbowTrail.unshift(nyanY);
        
        rainbowElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        for (let i = 0; i < qnt; i++) {
            let offset = i % 2;
            if (animationState) {
                offset = i % 2 ? 0 : 1;
            }
            
            if (rainbowElements[qnt - i - 1]) {
                rainbowElements[qnt - i - 1].style.top = (rainbowTrail[i] + offset) + 'px';
                rainbowElements[qnt - i - 1].style.display = 'block';
            }
        }
    }

    function start() {
        tIntervalID1 = setInterval(() => {
            moveNyan();
            drawRainbow();
        }, MOVE_INTERVAL);
	
		// window.setInterval(function(){ criarEstrela(); }, 300);

        tIntervalID2 = setInterval(() => {
            animationState = !animationState;
        }, ANIMATION_TOGGLE_INTERVAL);

        frame = 0;
        tIntervalID3 = setInterval(() => {
            if (nyanElement) {
                nyanElement.style.backgroundPosition = (ANIMATION_FRAME_WIDTH * frame) + 'px 0px';
                frame++;
            }
        }, FRAME_UPDATE_INTERVAL);
    }

    function stop() {
        clearInterval(tIntervalID1);
        clearInterval(tIntervalID2);
        clearInterval(tIntervalID3);
    }

    onMount(() => {
        if (!nyanElement) return;
        
        // Create rainbow elements
        const windowWidth = window.innerWidth;
        const rainbowTileCount = Math.ceil(windowWidth / TILE_SIZE);
        
        const parentElement = nyanElement.parentElement;
        for (let i = 0; i < rainbowTileCount; i++) {
            const rain = document.createElement('div');
            rain.className = 'rainbow';
            rain.style.left = (i * TILE_SIZE) + 'px';
            parentElement.appendChild(rain);
            rainbowElements.push(rain);
        }
        
        start();
    });

    onDestroy(() => {
        stop();
        rainbowElements.forEach(el => el?.remove());
        rainbowElements = [];
    });
</script>

<svelte:window on:mousemove={handleMouseMove} />

<div bind:this={nyanElement} id='nyanCatCursor' aria-hidden="true"></div>

<style>
#nyanCatCursor {
	z-index:10;
	position:absolute;
	width:34px;height:33px;
	pointer-events: none;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAAgCAYAAABepJcLAAACiUlEQVR4nO2Yi23DMAxEvVMW6Ghdwzt1p7Qp4sKhKIkUqVyUXtEHBIlsPZ9J+bN9fG4bIcQGXICQlYALELIScAFCVgIuQMhKwAUIWQnboG27RkmRpQc9wB4mievXHiYaCj3o8QoePomffzcJodCDHq/iYRepTXTZ9c+KTEog9KAH0MMm0pvI2MHhQOhBjwSP7f680vM4xo03TIdC5CzeEcn0KFwqHl4XeqxfH7ex+77/0spDjktvGFVE6dyaSPaJqbqIE+Nxocf69XHefysPOeahYQ7RA7PIqTOjIqFAxCW46aKcmLQCocf0+pA1GvU45jmj/V40jNw42rlekVAgk1wyV/aVPeTYjJV9JAtZp1kePdSG0ZpGFak8UEVF3IE0HuwyXMyF+uYecltZ5Mj68HqMOBR5yFVECnU791JeSoe71xOI4pEVSq1I0R6IPGRdIOtDa+BjzIjH7a/mJn8rGqbWNH8ijhVsRMQciOGVYaZLtXEBHsg8ZA6o+sisU20xOB9bt2G0YCz3hhki5kCe4KJtg/AIraiTzo37SjfJIeJxvaM1bNHAd6oNY74FUd48RESGA6m8EQqFUjnBSA/zQjbBY+jlwxPqI8NDZiw/mxvmQaRzucsQyfDIdJEFivCQY5B5vFt91BaiM2r2ZpHOJS8qkuUx0wXhcfyO9mjegQDrw+uhubQosjffDhmIiLhDAbjQQ7/6orI49jeah4VizpaIZTUYxdMsMz1GXJAe6DzO8yOzmOXRa1bzSdG+t2xr3c5aIJ79vaML2gE9P9qjusMz2ve9g6lt6ynQ1pwZLl6fV3BBO6Dnz9hP5BhcxUvIfwcuQMhKwAUIWQm4ACErARcgZCXgAoSsxDdoVHw2ca8RoAAAAABJRU5ErkJggg==);
}
:global(.rainbow) {
	position:absolute;width:9px;height:18px;margin-top:6px;z-index:5;pointer-events:none;
	background-image: url(data:image/png;base64,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);
}

</style>