
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

        // section._p.querySelectorAll('');

        // Create a standalone ST instance, and use the progress value (0 - 1) to tween the timeline's progress
        ScrollTrigger.create({
            trigger: section,
            start: () => i == 0 ? "top top" : "top bottom", // The FIRST section will use a different start value than the rest
            end: () => i == lastIndex ? "top top" : "bottom top", // The LAST section will use a different start value than the rest    
            onRefresh: self => { // onRefresh (so it gets reset upon resize), create a timeline that moves the h1 + bg vertically
                section._tl = gsap.timeline({ paused: true, defaults: { ease: 'none', overwrite: 'auto' } })
                    .fromTo(section._bg, {
                        y: () => i == 0 ? -innerHeight / 2 : 0
                    }, {
                        y: () => i == lastIndex ? -innerHeight / 2 : -innerHeight
                    }, 0)
                //.progress(self.progress); //use progress to position the timeline correctly      
            },
            onUpdate: self => { gsap.to(section._tl, { duration: 0.75, progress: self.progress }); },
            markers: true
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
});
