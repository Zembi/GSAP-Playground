$(document).ready(function () {
    // ELEMENTS THAT WILL INTERACT WITH GSAP CURSOR
    jQuery('p').attr('data-cursor-scale', 'scale');
    jQuery('img').attr('data-cursor-scale', 'lg-scale');

    // ADD CURSOR ELEMENT TO HTML
    jQuery('body').prepend(`
        <div class="follow_circle">
            <div class="cursor_media">
                <video preload="auto" style="opacity: 0; z-index: 1;"></video>
            </div>
        </div>
    `);
});

let globalCursor = null;

window.addEventListener("load", (event) => {
    globalCursor = new ActivateGSAPCursor('.follow_circle',
        {
            video: {
                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            }
        });
    globalCursor.start();

    if (!localStorage.getItem('currState')) {
        localStorage.setItem('currState', 'home');
    }

    // INIT LOADS
    getHTMLData();
    hideShowTopBar(true);

    document.querySelector('#hideBtn').click();
});


function getHTMLData(e) {
    let initialCall = true;
    let destin = localStorage.getItem('currState');
    if (e) {
        initialCall = false;
        destin = e.target.getAttribute('data-target').toLowerCase();
    }

    if (initialCall) {
        sendRequest(destin);
        localStorage.setItem('currState', destin);
    }

    if (localStorage.getItem('currState') !== destin) {
        if (!document.querySelector('#Content').classList.contains('animLoading')) {
            sendRequest(destin);
            localStorage.setItem('currState', destin);
        }
    }

    function sendRequest(destin) {
        const url = `../${destin}Test.html`;
        let req = new Request(url, {
            method: "GET"
        })

        fetch(req)
            .then(response => response.text())
            .then(text => {
                let main = document.querySelector('#Content');
                const oldContent = main.firstElementChild;
                const menu = document.querySelector('#fake-menu');

                let doc = new DOMParser().parseFromString(text, 'text/html');
                let newContent = doc.body.firstElementChild;

                newContent.prepend(menu);
                main.append(newContent);

                // AFTER RETRIEVING NEXT CONTENT CONTAINER, TRIGGER GSAP
                GSAP_Act(oldContent, newContent);

                reAssignNewElementsToInteractWithCursor();
                // ADD THEM TO BROSWER HISTORY SO USER CAN VISIT PREVIOUS AND NEXT PAGES
                window.history.pushState({ "html": text, "pageTitle": destin }, "", window.location.href);
            })
            .catch(error => {
                console.warn('Fetch Failed:', error.message);
            })
    }


    // SO AS TO STOP LINK FROM REDIRECTING TO HREF
    return false;
}


function reAssignNewElementsToInteractWithCursor() {
    jQuery('#Content p').attr('data-cursor-scale', 'scale');
    jQuery('#Content img').attr('data-cursor-scale', 'lg-scale');
    globalCursor.reconsiderItemsOfPage();
}

window.onpopstate = function (e) {
    if (e.state) {
        document.querySelector("#Content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};


function GSAP_Act(toBeRemoved, toBeAdded) {
    console.log(toBeRemoved);
    if (toBeRemoved) {
        // console.log('gsap');
        // console.log(toBeRemoved);
        gsap.timeline({
            ease: 'back.out(2)',
            onStart: atTheStartOfAnimation,
            onComplete: afterAnimationEnded,
        })
            .fromTo(toBeRemoved, {
                opacity: 1,
                width: '100%'
            }, {
                opacity: 0,
                width: '0%',
                duration: 1.2
            }, 0)
            .fromTo(toBeAdded, {
                opacity: 0,
                scale: 0,
                yPercent: 100,
                width: '70%',
            }, {
                opacity: 1,
                scale: 1,
                yPercent: 0,
                width: '100%',
                duration: 0.7
            }, 0);


        function atTheStartOfAnimation() {
            document.querySelector('#Content').classList.add('animLoading');
        }

        function afterAnimationEnded() {
            // REPLACE OLD CONTENT WITH THE NEW ONE
            jQuery(toBeRemoved).remove();
            document.querySelector('#Content').classList.remove('animLoading');
        }
    }
}


function hideShowTopBar(init = false) {
    const topBar = document.querySelector('#topBar');

    // INITIAL ACTION
    if (init) {
        gsap.timeline({
            ease: 'back.out(2)'
        })
            .from(topBar, {
                y: -100
            }, 0);
    }
    else {
        if (!topBar.classList.contains('hidden')) {
            gsap.timeline({
                ease: 'back.out(2)',
                onStart: disableHiddenButton,
                onComplete: enableHiddenButton,
                stagger: 0.4
            })
                .to(topBar, {
                    y: -100
                }, 0)
                .to(topBar.querySelector('#hideBtn'), {
                    y: 100,
                    right: 0
                }, '-=1');

            topBar.querySelector('#hideBtn').innerText = 'Show';
        }
        else {
            gsap.timeline({
                ease: 'back.out(1.7)',
                onStart: disableHiddenButton,
                onComplete: enableHiddenButton,
                stagger: 0.4
            })
                .to(topBar, {
                    y: 0
                }, 0)
                .to(topBar.querySelector('#hideBtn'), {
                    y: 0,
                    right: 'auto'
                }, 0);

            topBar.querySelector('#hideBtn').innerText = 'Hide';
        }
        topBar.classList.toggle('hidden');

        function disableHiddenButton() {
            topBar.querySelector('#hideBtn').disabled = true;
        }

        function enableHiddenButton() {
            topBar.querySelector('#hideBtn').disabled = false;
        }
    }
}