
import inquirer from "inquirer"
import qr from "qr-image"
import {isUrl} from "check-valid-url"
import fileSystem from "fs"

var loop = true;

while (loop) {
    await inquirer.prompt (
        [   {message: "Type the url", name: "url"}]
    ).then(async function(answer) {
        // check url validity
        var url = answer.url;
        var isValid = isUrl(url);
    
        if (isValid) {
            // collect file name
            await inquirer.prompt (
                [{message: "Enter the file name", name: "fileName"}]
            ).then((answer) => {
                // create img file
                var fileName = answer.fileName;
                var qr_img = qr.image(url, {type: "png"});
                qr_img.pipe(fileSystem.createWriteStream(`${fileName}.png`));
                console.log("Success. Process is complete");
            });
            // ask to go again
            loop = await getYesNo("Success! Go again? (y or n)");
        }
        else {
            // case url is not valid
            loop = await getYesNo("Error! URL is not valid. Go again? (y or n)");
        }
    })
}


async function getYesNo(message) {
    var invalid = true;
    var response;

    while (invalid){
        await inquirer.prompt([
            {message: message, name: "bool"}
        ]).then((answer) => {
            switch(answer.bool) {
                case "y":
                    response = true;
                    invalid = false;
                    break;
                case "n":
                    response = false;
                    invalid = false;
                    break;
                default:
                    console.log("Invalid response...");
            }
        })
    }
    return response;
}
