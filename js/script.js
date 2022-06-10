document.addEventListener("DOMContentLoaded", function () {

    /* navbar change when scroll */
    window.addEventListener('scroll', function () {
        if (window.scrollY < 50) {
            document.getElementsByClassName('navbar').item(0).style.background = 'transparent'
            document.getElementsByClassName('navbar').item(0).style.paddingTop = '30px'
            /* document.getElementsByClassName('btn1').item(0).style.marginTop = '0%' */
        } else {
            document.getElementsByClassName('navbar').item(0).style.background = '#161223'
            document.getElementsByClassName('navbar').item(0).style.paddingTop = '10px'
            /* document.getElementsByClassName('btn1').item(0).style.marginTop = '-0.8%' */
        }
    });

    /* scroll to top when reload */
    /*     window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
        window.onload = function () {
            window.scrollTo(0, 0);
        }
        window.onresize = function () {
            location.reload();
        }
     */




    /* responsive slide shows */
    var x = window.matchMedia("(min-width: 991px)")
    var y = window.matchMedia("()")
    function myFunction(x) {
        if (x.matches) {
            $(document).ready(function () {
                $("#lightSlider").lightSlider({
                    loop: true,
                    item: 3
                });
            });
        } else {
            $(document).ready(function () {
                $("#lightSlider").lightSlider({
                    loop: true,
                    item: 1
                });
            });
        }
    }
    myFunction(x)
    x.addListener(myFunction)
});


/* Auto slidshow */
window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

const wrapSlider = document.querySelector("#js-wrapSlider");
const widthWrap = wrapSlider.offsetWidth;

let items;
let sliders;
let sliderList = [];

const getSliderList = () => {
    sliders = document.querySelectorAll(".js-slider");
    sliderList = [...sliders];
};
getSliderList();

const slider = document.querySelectorAll(".js-slider")[0];
const sliderWidth = slider.offsetWidth;
const sumIsLargerThanSlider = sliderWidth >= widthWrap + sliderWidth;
const iterationItems = Math.ceil((widthWrap + sliderWidth) / sliderWidth);

// Clone number of slider
if (iterationItems > 1) {
    for (let i = 0; i < iterationItems - 1; i++) {
        const clone = slider.cloneNode(true);
        wrapSlider.appendChild(clone);
    }
    getSliderList();
}

// Array of the state of each item
let stateList = sliderList.map((item, i) => {
    let pos = 0;
    let start = false;

    // The slide to start fully at left
    if (i < iterationItems - 1) {
        pos = -widthWrap + sliders[i].offsetWidth * i;
        start = true;
        sliders[i].style.transform = `translate(${pos}px, -50%)`;
    }
    return {
        pos,
        start
    };
});

// logic animation for sliding each item at a time
const translate = () => {
    for (let i = 0; i < sliderList.length; i++) {
        const slider = sliderList[i];
        const sliderWidth = slider.offsetWidth;
        const nextIndex = i != sliderList.length - 1 ? i + 1 : 0;
        let pos;

        // if slider should be in movement
        if (stateList[i].start) {
            stateList[i].pos -= 1;
            pos = stateList[i].pos;
            slider.style.transform = `translate(${pos}px, -50%)`;
        }

        const isComplete = pos <= -sliderWidth;
        const isOutSeen = pos <= -widthWrap - sliderWidth;

        // if the slider is fully on screen
        if (isComplete) {
            stateList[nextIndex].start = true;
        }
        // if the slider finished crossing the slider and has disappeared
        if (isOutSeen) {
            stateList[i].start = false;
            stateList[i].pos = 0;
        }
    }
};

let isPaused = false;
function start() {
    if (!isPaused) {
        translate();
    }
    requestAnimFrame(start);
}

wrapSlider.addEventListener("mouseover", () => {
    isPaused = true;
});
wrapSlider.addEventListener("mouseout", () => {
    isPaused = false;
});
start();

