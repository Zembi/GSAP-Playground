
// GSAP CUSTOM CLASS
class ActivateGSAPCursor {
    constructor(cursorName = null, options = {}) {
        // IF TRUE, EVERY CUSTOM CONSOLE LOG MESSAGE WILL BE SHOWN. IF FALSE WE CAN DISABLE ALL MESSAGES THAT HELP WITH THE CONSTRUCTOR
        this.consoleMsgsEnabled = true;
        
        // CURSOR
        this.cursorName = cursorName;
        this.cursor = this.cursorName && document.querySelector(cursorName);

        this.options = options;

        this.additions = null;
    }

    start() {
        this.#render();
    }

    #render() {
        // IF THE CURSOR IS BEING PASSED TO CONSTRUCTOR AND EXISTS
        if(this.cursorName && this.cursor) {
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
            xPercent: 5, yPercent: 5, opacity: 1 
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

    reconsiderItemsOfPage() {
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

    #handlePointerEnterEvent(e, item, nameOfDataAttr, effectDur = 0.5) {
        // TYPES OF SCALES. EVERY SUB ARRAY CONTAINS THE ATTRIBUTE VALUE THAT WE ADD TO HTML AND THE SCALE VALUE 
        const typesOfScalesAttrs = [['scale', 7], ['lg-scale', 10]];
        const mapScales = new Map(typesOfScalesAttrs);

        const currentScale = item.getAttribute(nameOfDataAttr);

        let scaleVal = 1;
        mapScales.forEach(function(value, key) {
            if(currentScale === key) {
                scaleVal = parseInt(value);
            }
        });

        gsap.to(this.cursor, effectDur, {
            opacity: 1,
            scale: scaleVal,
            ease: "elastic.out(1,0.9)",
        });


        if(this.options.video && item.nodeName === 'IMG') {
            this.#activateOrDeactivateVideoOnCursor(this.options.video, true);
        }

        item.classList.add('hovered');
    }

    #activateOrDeactivateVideoOnCursor({url = null}, active) {
        this.additions = document.querySelector(this.cursorName + ' video');

        if(this.additions.nodeName == 'VIDEO') {
            // START VIDEO
            if(active) {
                this.additions.src = url;
                this.additions.autoplay = true;
                this.additions.controls = false;
                this.additions.muted = true;
                this.additions.style.opacity = 1;
            }
            // END VIDEO
            else {
                this.additions.src = '';
                this.additions.autoplay = false;
                this.additions.controls = false;
                this.additions.muted = true;
                this.additions.style.opacity = 0;
            }
        }
    }

    #handlePointerLeaveEvent(e, item, effectDur = 0.3) {
        gsap.to(this.cursor, effectDur, {
            xPercent: 5,
            yPercent: 5, 
            opacity: 1, 
            scale: 1,
            ease: "back.out(1.7, 1)",
        });

        if(this.options.video && item.nodeName === 'IMG') {
            this.#activateOrDeactivateVideoOnCursor(this.options.video, false);
        }

        // this.additions && this.cursor.removeChild(this.additions);

        item.classList.remove('hovered');
    }
    // --------------------------------------------------------------------


    conslMsgs(msg) {
        this.consoleMsgsEnabled && console.log(msg);
    }
}


// CUSTOM FUNCTIONS FOR SPLITTING TEXT (BUT I ACTUALLY FOUND AN NPM PACKAGE THAT ALSO DOES IT, NAME split-type)
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


// function 