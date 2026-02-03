(function () {
    console.log("Analytics script loaded !");

    function generateUUID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    const sessionDuration = 12 * 60 * 60 * 1000; // 1
    // 2 hours in milliseconds
    const now = Date.now();

    let visitorId = localStorage.getItem('webTrack_visitor_id');
    let sessionTime = localStorage.getItem('webtrack_session_time');

    if (!visitorId || (now - sessionTime) > sessionDuration) {

        if (visitorId) {
            localStorage.removeItem('webTrack_visitor_id');
            localStorage.removeItem('webtrack_session_time');
        }


        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId);
        localStorage.setItem('webtrack_session_time', now);
    } else {
        console.log("Existing Session");
    }

    const script = document.currentScript;



    const websiteId = script.getAttribute('data-website-id');
    const domain = script.getAttribute('data-domain');

    //Get Entry Time
    const entryTime = Math.floor(Date.now() / 1000);


    //Get Regerrer
    const referrer = document.referrer || 'Direct';

    //GET utm sources
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || '';
    const utm_medium = urlParams.get('utm_medium') || '';
    const utm_compaign = urlParams.get('utm_compaign') || '';
    const RefParams = window.location.href.split('?')[1] || '';


    const data = {
        type: 'entry',
        websiteId,
        domain,
        entryTime: entryTime,
        referrer: referrer,
        url: window.location.href,
        visitorId: visitorId,
        urlParams,
        utm_source,
        utm_medium,
        utm_compaign,
        RefParams
    }

    fetch('http://localhost:3000/api/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data
        })
    })

    /*
    ACTIVE TIME TRACKING
    */

    let activeStartTime = Date.now();
    let totalActiveTime = 0;

    const handleExit = () => {
        const exitTime = Math.floor(Date.now() / 1000);
        totalActiveTime += Math.floor(Date.now() / 1000) - activeStartTime;

        fetch('http://localhost:3000/api/track', {
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'exit',
                websiteId,
                domain,
                exitTime: exitTime,
                totalActiveTime: totalActiveTime,
                visitorId: visitorId,
                exitUrl: window.location.href,
            })
        })
        // localStorage.clear();
    }



    window.addEventListener('beforeunload', handleExit);
    //window.addEventListener('pagehide', handleExit);
})();