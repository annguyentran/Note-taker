const router = require("express").Router()
const fs = require("fs")
const util = require("util")
const readfile = util.promisify(fs.readFile)

function getNotes() {
    return readfile("db/db.json", "utf-8").then(notes => {
        let notesArray = [];
        try {
            notesArray = notesArray.concat(JSON.parse(notes));
        } catch (error) {
            notesArray = [];
        }
        return notesArray;

    })
}



router.get("/api/notes",(req,res)=>{
    getNotes().then((notes) => res.json(notes)).catch((error) => res.json(error))

})

router.post("/api/notes",(req,res)=>{
    const note = req.body;
    
    getNotes().then((notes) => {

        note.id = notes.length + 1;

        // 1. Add the note to the notes array
        notes.push(note);
        // 2. Write the notes array back INTO the file
        fs.writeFile("db/db.json", JSON.stringify(notes), (error) => {
            if (error) {
                console.log(error);
            }

            res.status(200).send();
        })

    }).catch((error) => res.json(error))
})

module.exports = router

