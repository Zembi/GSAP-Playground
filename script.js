
$(document).ready(function () {
    // ELEMENTS THAT WILL INTERACT WITH GSAP CURSOR
    jQuery('p').attr('data-cursor-scale', 'scale');
    jQuery('img').attr('data-cursor-scale', 'lg-scale');

    // ADD CURSOR ELEMENT TO HTML
    jQuery('body').prepend('<div class="follow_circle"></div>');
});

window.addEventListener("load", (event) => {
    const gsapCursor = new ActivateGSAPCursor('.follow_circle', ['combine1', 'combine2']);
    gsapCursor.start();

    const el7 = new SplitType('.sect7 .p', { types: 'chars, words' });
    const el8 = new SplitType('.sect8 .p', { types: 'chars, words' });
    // const el8 = new SplitText('.sect8 .p', [ 'char', 'word'], [ 'char', 'word']);

    // const tl = gsap.timeline({paused: false});

    // tl.from($('.sect7 .word'), {
    //     opacity: 0, 
    //     y: 100, 
    //     duration: 0.5, 
    //     ease: 'back.out(2)', 
    //     stagger: {amount: 2},
    //     scrollTrigger: {
    //         trigger: $('.sect7'),
    //         start: "top bottom",
    //         onEnter: () => tl.play()
    //     }
    // });

    const sections = gsap.utils.toArray("section");
    const lastIndex = sections.length - 1;

    sections.forEach((section, i) => {
        section._bg = section.querySelector(".bg");
        section._p = section.querySelector(".p");

        // Give the backgrounds some random images
        section._bg.style.backgroundImage = `url(https://picsum.photos/${innerWidth}/${innerHeight * 2}?random=${i})`;


        console.log(section._p.querySelectorAll('.word'));
        // Create a standalone ST instance, and use the progress value (0 - 1) to tween the timeline's progress
        ScrollTrigger.create({
            trigger: section,
            start: () => i == 0 ? "top top" : "top bottom", // The FIRST section will use a different start value than the rest
            end: () => i == lastIndex ? "top top" : "bottom top", // The LAST section will use a different start value than the rest    
            onRefresh: self => { // onRefresh (so it gets reset upon resize), create a timeline that moves the h1 + bg vertically      
                section._tl = gsap.timeline({ paused: true, defaults: { ease: 'none', overwrite: 'auto' } })

                    .fromTo(section._p.querySelectorAll('.word')[12], {
                        y: 100,
                        opacity: 0
                    }, {
                        y: 0,
                        opacity: 1
                    }, 1)
                    .fromTo(section._bg, {
                        y: () => i == 0 ? -innerHeight / 2 : 0
                    }, {
                        y: () => i == lastIndex ? -innerHeight / 2 : -innerHeight
                    }, 0)
                //.progress(self.progress); //use progress to position the timeline correctly      
            },
            onUpdate: self => { gsap.to(section._tl, { duration: 0.75, progress: self.progress }); }
        });

    });

    // tl.from($('.sect8 .word'), {opacity: 0, y: 100, duration: 0.5, ease: 'back.out(2)', stagger: {amount: 2},
    //     scrollTrigger: {
    //         trigger: $('.sect8'),
    //         start: "bottom bottom",
    //         onEnter: () => tl.play(),
    //         onLeaveBack: () => tl.pause()
    //     }
    // });


    // const gsapTrans = new GSAPTransition();
});


// GSAP CUSTOM CLASS
class ActivateGSAPCursor {
    constructor(cursorName = null) {
        // IF TRUE, EVERY CUSTOM CONSOLE LOG MESSAGE WILL BE SHOWN. IF FALSE WE CAN DISABLE ALL MESSAGES THAT HELP WITH THE CONSTRUCTOR
        this.consoleMsgsEnabled = true;

        // CURSOR
        this.cursorName = cursorName;
        this.cursor = this.cursorName && document.querySelector(cursorName);

        this.additions = null;
    }

    start() {
        this.#render();
    }

    #render() {
        // IF THE CURSOR IS BEING PASSED TO CONSTRUCTOR AND EXISTS
        if (this.cursorName && this.cursor) {
            this.#activateCursorEvents();
        }
        else {
            this.conslMsgs('No CURSOR was found!!');
        }
    }


    // -------------------------- CURSOR EVENTS --------------------------
    #activateCursorEvents() {
        // INITIATE CURSOR ACTION
        gsap.set(this.cursor, {
            xPercent: 0, yPercent: 0, opacity: 1
        });


        // ADJUST SPEED FOR HIGHER REFRESH MONITORS
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };

        const xSet = gsap.quickSetter(this.cursor, "x", "px");
        const ySet = gsap.quickSetter(this.cursor, "y", "px");

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        gsap.ticker.add(() => {
            const speed = 0.35;
            const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;
            xSet(pos.x);
            ySet(pos.y);
        });


        // EVENTS THAT CURSOR SHOULD DO
        // IF WE WANT TO PLAY WITH SCALE
        this.#scaleCursorEvents();
    }

    #scaleCursorEvents() {
        const scaleCursorHMTLAttrName = 'data-cursor-scale';
        const hoverItemsScales = document.querySelectorAll(`*[${scaleCursorHMTLAttrName}]`);

        hoverItemsScales && hoverItemsScales.forEach((item) => {
            item.addEventListener("pointerenter", (e) => { this.#handlePointerEnterEvent(e, item, scaleCursorHMTLAttrName, 0.3); });
            item.addEventListener("pointerleave", (e) => { this.#handlePointerLeaveEvent(e, item); });;
        });
    }

    #handlePointerEnterEvent(e, item, nameOfDataAttr, effectDur = 0.3) {
        // TYPES OF SCALES. EVERY SUB ARRAY CONTAINS THE ATTRIBUTE VALUE THAT WE ADD TO HTML AND THE SCALE VALUE 
        const typesOfScalesAttrs = [['scale', 7], ['lg-scale', 10]];
        const mapScales = new Map(typesOfScalesAttrs);

        const currentScale = item.getAttribute(nameOfDataAttr);

        let scaleVal = 1;
        mapScales.forEach(function (value, key) {
            if (currentScale === key) {
                scaleVal = parseInt(value);
            }
        });

        gsap.to(this.cursor, effectDur, {
            opacity: 1,
            scale: scaleVal,
        });

        const videoObj = {
            videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
            imgUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
        }
        // this.#addVideoToCursor(videoObj);
        item.classList.add('hovered');
    }

    #addVideoToCursor({ videoUrl, imgUrl }) {
        this.additions = document.createElement('video');

        this.additions.src = videoUrl;

        this.additions.poster = imgUrl;

        this.additions.autoplay = true;
        this.additions.controls = false;
        this.additions.muted = false;
        this.additions.height = 100; // 👈️ in px
        this.additions.width = 200; // 👈️ in px

        this.cursor.appendChild(this.additions);
    }

    #handlePointerLeaveEvent(e, item, effectDur = 0.3) {
        gsap.to(this.cursor, effectDur, {
            opacity: 0,
            scale: 1,
        });

        this.additions && this.cursor.removeChild(this.additions);

        item.classList.remove('hovered');
    }
    // --------------------------------------------------------------------


    conslMsgs(msg) {
        this.consoleMsgsEnabled && console.log(msg);
    }
}


class GSAPTransition {
    constructor() {
        this.#start();
    }

    #start() {
        this.#render();
    }

    #render() {
        // const tl = gsap.timeline({defaults: {ease: 'power2.out'}});
        // FIRST REGISTER THE PLUGIN OF GSAP
        gsap.registerPlugin(ScrollTrigger);

        const tlStart = gsap.timeline();

        tlStart.fromTo('#customNavBarWrapper', {
            y: '-10vh'
        }, {
            y: 0,
            duration: 2
        });


        gsap.from(".sect2 img", {
            scrollTrigger: {
                trigger: ".sect1 img",
                scrub: true,
                start: "left",
                end: "right"
            },
            scaleX: 0,
            transformOrigin: "left center",
            ease: "none"
        });


        gsap.from(".sect1 .line", {
            scrollTrigger: {
                trigger: ".sect1",
                scrub: true,
                pin: true,
                start: "top 10%",
                end: "+=100%"
            },
            scaleX: 0,
            transformOrigin: "left center",
            ease: "none"
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                scrub: 1,
                pin: true,
                trigger: ".sect1 p",
                start: "top 10%",
                endTrigger: ".sect1",
                end: "bottom 50%",
            },
        });

        // tl.to(".sect1 p", {
        //     rotateX: 14400,
        // });

        var timeline = new TimelineMax();
        timeline.from(".sect2", 1, { x: '-100%' }, 0)
            .from(".sect1", 1, { x: '-100%' }, 0);

    }

    conslMsgs(msg) {
        this.consoleMsgsEnabled && console.log(msg);
    }
}


class SplitText {
    constructor(query, typesOfSplit = [], classesOfSplit = []) {
        this.query = query;
        this.queryEl = this.query ? $(this.query) : null;

        this.typesOfSplit = [...typesOfSplit];
        this.classesOfSplit = [...classesOfSplit];

        this.charsActivated = false;
        this.wordsActivated = false;
        this.sentencesActivated = false;

        this.emptySpacesClass = 'empty-space-custom-123456789';

        this.#main();
    }

    #main() {
        if (this.queryEl.length > 0) {
            this.#fixArray();
            this.typesOfSplit.forEach((item, index) => {
                switch (item.toLocaleLowerCase()) {
                    case 'char':
                        console.log(1);
                        this.charsActivated = true;
                        this.#splitChars(this.#getCurrentClassName(index));
                        break;
                    case 'word':
                        console.log(2);
                        this.wordsActivated = true;
                        this.#splitWords(this.#getCurrentClassName(index));
                        break;
                    case 'sentence':
                        this.sentencesActivated = true;
                        this.#splitSentences(this.#getCurrentClassName(index));
                        break;
                    default:
                        break;
                }
            });
            this.#clearAllEmptyElements();
        }
    }

    #fixArray() {
        const uniqueStrings = new Set([...this.typesOfSplit]);
        this.typesOfSplit = [...uniqueStrings];

        this.typesOfSplit = [...this.typesOfSplit.map(type => type.toLowerCase())];

        const newArr = [];
        if (this.typesOfSplit.includes('char')) {
            newArr.push('char');
        }

        if (this.typesOfSplit.includes('word')) {
            newArr.push('word');
        }

        if (this.typesOfSplit.includes('sentence')) {
            newArr.push('sentence');
        }

        this.typesOfSplit = [...newArr];
    }

    #getCurrentClassName(index) {
        let result = null;

        if (this.classesOfSplit.length > 0) {
            result = this.classesOfSplit[index] ? this.classesOfSplit[index] : null;
        }

        return result;
    }

    #splitChars(className, act = true) {
        className = className ? className : 'gsapcustom-char';
        console.log('chars', className);

        [...this.queryEl].forEach((el) => {
            let result = '';

            let str = el.innerHTML;

            if (act) {
                const allChars = str.split(/(?=[^>]*(?:<|$))/);
                allChars.forEach((char, index) => {
                    let lastSpace = allChars[index + 1] === ' ' ? ' ' : '';

                    if (!validateHTML(char)) {
                        if (char !== ' ') {
                            result += '<span class="' + className + '">' + char + '</span>' + lastSpace;
                        }
                        else {
                            result += '<span class="' + this.emptySpacesClass + '">' + char + '</span>' + lastSpace;
                        }
                    }
                    else {
                        result += char + lastSpace;
                    }
                })
            }
            else {
                const allChars = str.split(/(?=[^>]*(?:<|$))/);
                allChars.forEach((char, index) => {
                    let lastSpace = allChars[index + 1] === ' ' ? ' ' : '';

                    if (char == ' ') {
                        // console.log(1);
                        result += '<span class="' + this.emptySpacesClass + '">' + char + '</span>' + lastSpace;
                    }
                    else {
                        result += char + lastSpace;
                    }
                });
            }

            el.innerHTML = result;
        });
    }

    #splitWords(className) {
        className = className ? className : 'gsapcustom-word';
        console.log('words', className);

        if (!this.charsActivated) {
            this.#splitChars('', false);
        }

        [...this.queryEl].forEach((el) => {

            const charsAct = this.charsActivated;
            const emptyClass = this.emptySpacesClass;
            el.innerHTML = wrapWords(el);

            function wrapWords(elem) {
                let result = '';
                let str = elem.innerHTML;
                const allWords = str.split('<span class="' + emptyClass + '"> </span>');
                // console.log(allWords);
                allWords.forEach((word, index) => {
                    let lastSpace = index === (allWords.length - 1) ? '' : ' ';

                    if (!validateHTML(word)) {
                        if (word !== '' && word !== ' ') {
                            result += '<span class="' + className + '">' + word + '</span>' + lastSpace;
                        }
                    }
                    else {
                        if (charsAct) {
                            result += '<span class="' + className + '">' + word + '</span>' + lastSpace;
                        }
                        else {
                            let doc = new DOMParser().parseFromString(word, "text/xml");
                            doc = doc.children[0];
                            doc.innerHTML = wrapWords(doc);
                            result += doc.outerHTML + lastSpace;
                        }
                    }
                });

                return result;
            }
        });
    }

    #splitSentences(className) {
        className = className ? className : 'gsapcustom-sentence';
        console.log('sentences', className);

    }

    // REMOVE EMPTY SPACES ELEMENTS
    #clearAllEmptyElements() {
        [...this.queryEl].forEach((el) => {
            const empties = el.querySelectorAll(`.${this.emptySpacesClass}`);

            for (const empt of empties) {
                empt.remove();
            }
        });
    }
}

function validateHTML(htmlString) {
    // console.log(htmlString);
    const regex = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
    return regex(htmlString);
}