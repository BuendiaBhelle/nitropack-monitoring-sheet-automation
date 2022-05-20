const app = require("./nitropack");

// insertRow,
// listTestDetails,
// mobileScore,
// desktopScore,
// displayFails


async function index() {
    await app.insertRow();

    setTimeout(async function() {
        await app.listTestDetails();

        setTimeout(async function(){
            await app.mobileScore();

            setTimeout(async function(){
                await app.desktopScore();

                setTimeout(async function(){
                    await app.displayFails();
                }, 3000); 

            }, 3000); 

        }, 3000); 

    }, 3000);  
}
index();
