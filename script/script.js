window.onbeforeunload = function() {
    window.scrollTo(0, 0);
};

const screenOrientation = window.screen.orientation;
screenOrientation.lock('portrait');

// GSAP 
gsap.registerPlugin(ScrollTrigger);

const TL = gsap.timeline();

/* HOMEPAGE */
// Text animation on "Découvrir mon histoire"
const storyTitle = new SplitType('.story-title', { types: 'chars' });

gsap.fromTo(storyTitle.chars,
    { 
        y: 100,
        opacity: 0
    },
    {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 3,
        delay: 3,
        ease: 'power4.out',
    }
)

// Transition from Homepage to First chapter
const bookOpening = document.querySelector('.book-opening');

function handleBookOpening() {

    TL.to('.homepage', 
    {
        opacity: 0, 
        duration: 2
    });
    TL.to(window, 
    {
        scrollTo: '.chapter-1',
        duration: 2.5
    });
};

bookOpening.addEventListener('click', handleBookOpening);


/* CHAPTERS */
const chapters = document.querySelectorAll('.chapter');

// Start reading event for all chapters
for (let i = 1; i <= 3; i++) {

    const startReading = document.querySelector(`.chapter-${i} .current-chapter`);

    startReading.addEventListener('click', () => {
        TL.to('body', 
        {
            opacity: 0,
            duration: 0.75
        });
        TL.to(window, 
        {
            scrollTo: `.chapter-${i} .page-1`,
            duration: 0.1
        });
        TL.to('body', 
        {
            opacity: 1,
            duration: 2.5
        });
    })
}

// Browsing
for (let indexChapter = 0; indexChapter < chapters.length; indexChapter++) {

    const numChapter = indexChapter + 1;

    // Chapter reveal effect
    gsap.to(`.chapter-${numChapter}`, 
    {
        opacity: 1,
        duration: 2,
        delay: 1,

        scrollTrigger: {
            trigger: `.chapter-${numChapter}`,
            start: '25% bottom',
        }
    })

    // Pages browsing
    const btnPreviousPage = document.querySelectorAll(`.chapter-${numChapter} .previous-page`);
    const btnNextPage = document.querySelectorAll(`.chapter-${numChapter} .next-page`);
    
    function changePage(btnType, btnInterval) {

        for (let indexPage = 0; indexPage < btnType.length; indexPage++) {
    
            const numPage = indexPage + btnInterval;
            
            btnType[indexPage].addEventListener('click', () => {
                TL.to('body', 
                {
                    opacity: 0,
                    duration: 0.5
                });
                TL.to(window, 
                {
                    scrollTo: `.chapter-${numChapter} .page-${numPage}`,
                    duration: 0.5
                });
                TL.to('body', {
                    opacity: 1,
                    duration: 0.5
                });
            })
        }
    }

    changePage(btnPreviousPage, 1);
    changePage(btnNextPage, 2);

    // Chapters browsing
    const btnPreviousChapter = document.querySelectorAll(`.chapter-${numChapter} .previous-chapter`);
    const btnNextChapter = document.querySelectorAll(`.chapter-${numChapter} .next-chapter`);

    // Go to previous chapter
    btnPreviousChapter.forEach((btn) => {
        
        if (btn) {
    
            btn.addEventListener('click', () => {
                let numNewChapter = numChapter;
    
                if (btn.classList.contains('other-chapter')) {
                    numNewChapter--;

                    TL.to(`.chapter-${numNewChapter + 1}`,
                    {
                        opacity: 0,
                        duration: 1
                    });
                    TL.to(window, 
                    {
                        scrollTo: `.chapter-${numNewChapter} .intro`,
                        duration: 2
                    });
                    TL.to(`.chapter-${numNewChapter}`,
                    {
                        opacity: 1,
                        duration: 1
                    });

                } else {

                    TL.to(`.chapter-${numNewChapter}`,
                    {
                        opacity: 0,
                        duration: 1
                    });
                    TL.to(window, 
                    {
                        scrollTo: `.chapter-${numNewChapter} .intro`,
                        duration: 2
                    });
                    TL.to(`.chapter-${numNewChapter}`,
                    {
                        opacity: 1,
                        duration: 1
                    });
                }
                
            })
        }
    });

    // Go to next chapter
    btnNextChapter.forEach((btn) => {
        
        if (btn) {
    
            btn.addEventListener('click', () => {
                const numNewChapter = numChapter + 1;
        
                TL.to(`.chapter-${numChapter}`, 
                {
                    opacity: 0,
                    duration: 1
                });
                TL.to(window, 
                {
                    scrollTo: `.chapter-${numChapter} .intro`,
                    duration: 0.1
                });
                TL.to(window, 
                {
                    scrollTo: `.chapter-${numNewChapter} .intro`,
                    duration: 2.5
                });
            })
        }
    });
}

// Pour chaque "feuille" lancer l'effet type writing sur le contenu de la feuille lorsque celle-ci apparait dans le viewport
const storyChars = new SplitType('.storyline', { types: 'chars' });

const sheets = document.querySelectorAll('.sheet');

sheets.forEach((sheet) => {

    let autoTyper;
    
    function lettersReveal(entries, observer) {

        entries.forEach((entry) => {
            
            const sheetDiv = entry.target;
            const letters = sheetDiv.querySelectorAll('.char');
                
            let i = 0;

            function autoTyping() {
                if (i < letters.length) {
                    letters[i].classList.add('fade-in');
                    i++;
                } else {
                    const btnNext = sheetDiv.querySelector('.next-page, .next-chapter');
                    btnNext.classList.add('flash');
                }
            }
    
            if (entry.isIntersecting) {
                autoTyper = setInterval(autoTyping, 75);
    
            } else {
                clearInterval(autoTyper);
            }
        });
    }

    const options = {
        root: null,
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(lettersReveal, options);
    observer.observe(sheet);
});

// Last page text animation
const lastMessage = new SplitType('.last-message', { types: 'chars' });

function messageReveal() {
    TL.fromTo(lastMessage.chars, 
    {
        y: 100,
        opacity: 0
    },
    {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 2,
        ease: 'Back.easeOut',
    })
}

ScrollTrigger.create({
    trigger: '.last-message',
    onEnter: messageReveal,
});