
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

window.addEventListener("load", (event) => {
    const cursorGSAP = new ActivateGSAPCursor('.follow_circle', 
        {video: {
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
    });
    cursorGSAP.start();

    const elH2 = new SplitType('.section1 h2', { types: 'chars' });
    const elp = new SplitType('.section1 p', { types: 'words' });

    gsap.registerPlugin(ScrollTrigger);

    let tlH = gsap.timeline({
        scrollTrigger: {
          id: 'headersShow',
          trigger: '.section1',
          toggleActions: 'play',
          start: '5% 80%',
          end: '5% 80%',
        //   markers: true,
        }
    });

    let tlPar = gsap.timeline({
        scrollTrigger: {
          id: 'parsShow',
          trigger: '.section1',
          toggleActions: 'play',
          start: '5% 80%',
          end: '5% 80%',
        //   markers: true,
        },
    });

    let tlImages = gsap.timeline({
        scrollTrigger: {
            id: 'pinnedAction',
            trigger: ".section1",
            start: "0% 30%",
            end: 'bottom bottom',
            // markers: true,
        }
    });

    tlH.from('.section1 h2 .char', {
        y: 10,
        opacity: 0,
        stagger: {
            from: 'start',
            amount: 1
        },
    });

    tlPar.from('.section1 .word', {
        y: 20,
        opacity: 0,
        stagger: {
            from: 'center',
            amount: 2
        },
    });

    tlImages.from('.section1 img', {
        opacity: 0,
        stagger: 0.5
    });
});