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
        {video: {
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
    });
    globalCursor.start();

    if(!localStorage.getItem('currState')) {
        localStorage.setItem('currState', 'home');
    }

    getHTMLData();
    // processAjaxData(document.querySelector('#Home'), '/home');
});


function getHTMLData(e) {
    let initialCall = true;
    let destin = localStorage.getItem('currState');
    if(e) {
        initialCall = false;
        destin = e.target.getAttribute('data-target').toLowerCase();
    }
    
    if(initialCall) {
        sendRequest(destin);
    }

    if(localStorage.getItem('currState') !== destin) {
        sendRequest(destin);
    }
    
    localStorage.setItem('currState', destin);

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

                let doc = new DOMParser().parseFromString(text, 'text/html');
                let newContent = doc.body.firstElementChild;

                main.append(newContent);

                console.log(text);

                // AFTER RETRIEVING NEXT CONTENT CONTAINER, TRIGGER GSAP
                GSAP_Act(oldContent, newContent);

                jQuery('#Content p').attr('data-cursor-scale', 'scale');
                jQuery('#Content img').attr('data-cursor-scale', 'lg-scale');
                globalCursor.reconsiderItemsOfPage();
                // ADD THEM TO BROSWER HISTORY SO USER CAN VISIT PREVIOUS AND NEXT PAGES
                window.history.pushState({"html": text, "pageTitle": 'test'}, "", window.location.href);
            })
            .catch(error => {
                console.warn('Fetch Failed:', error.message);
            })
    }

    
    // SO AS TO STOP LINK FROM REDIRECTING TO HREF
    return false;
}

function disableAllFakeMenuBtns(status) {
    const anchors = document.querySelectorAll('#fake-menu a');
    if(status) {
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].onclick = function() {return false;};
        }
    }
    else {
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].onclick = function(e) { console.log(e); return getHTMLData(e);};
        }
    }
}

window.onpopstate = function(e) {
    if(e.state){
        document.querySelector("#Content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};


function GSAP_Act(toBeRemoved, toBeAdded) {
    if(toBeRemoved) {
        // console.log('gsap');
        // console.log(toBeRemoved);
        gsap.timeline({
            ease: 'back.out(2)',
            onStart: atTheStartOfAnimation,
            onComplete: afterAnimationEnded,
        })
            .fromTo(toBeRemoved, {
                opacity: 1,
                scale: 1,
            },{
                opacity: 1,
                scale: 0.7,
                duration: 0.8
            }, 0)
            .fromTo(toBeAdded, {
                opacity: 0,
                yPercent: 100,
            },{
                opacity: 1,
                yPercent: 0,
                duration: 0.8
            }, 0);


        function afterAnimationEnded() {
            // REPLACE OLD CONTENT WITH THE NEW ONE
            jQuery(toBeRemoved).remove();

            // disableAllFakeMenuBtns(true);
        }

        function atTheStartOfAnimation() {
            // disableAllFakeMenuBtns(false);
        }
    }
}