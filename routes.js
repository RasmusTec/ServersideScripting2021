const { Mongoose } = require('mongoose');
const Character = require('./models/characterModel');
const fs = require('fs');


async function getCharacters(){
    return await Character
    .find() 
    .collation({locale:'en'})
    .sort({'name:':'asc'});
}

module.exports = (app) => {

    app.get('/', async (req, res)=>{
        let characters = await getCharacters();
        res.render('index',{
            characters
        });
    });
    
    app.get('/manage/characters', async(req, res)=>{
        let characters = await getCharacters();
        res.render('managecharacters',{
            characters
        });
    });

    app.post('/manage/characters', async(req, res)=>{
        let character = new Character(req.body);

        let message = []
        if(req.body.name == ""){
            message.push('Name required');
        }
        if(req.body.race == ""){
            message.push('Race required');
        }
        if(req.body.class == ""){
            message.push('Class required');
        }
        if(req.body.level == null){
            message.push('level required');
        }
        if(isNaN(parseInt(req.body.level))){
            message.push('level required');
        }
        if(req.body.strength == null){
            message.push('strength required');
        }
        if(isNaN(parseInt(req.body.strength))){
            message.push('strength required');
        }
        if(req.body.agility == null){
            message.push('agility required');
        }
        if(isNaN(parseInt(req.body.agility))){
            message.push('agility required');
        }
        if(req.body.intellect == null){
            message.push('intellect required');
        }
        if(isNaN(parseInt(req.body.intellect))){
            message.push('intellect required');
        }

        character.ishidden = (req.body.read == "on" ? true : false);

        if(message.length == 0){
            if(req.files != undefined && req.files.image != undefined){
                await req.files.image.mv(`./public/images/${req.files.image.name}`);
                character.imagename = req.files.image.name;
            }
            character.save();
            res.redirect('/');
        }
        else{
            let characters = await getCharacters();
            res.render('managecharacters', {
                character: req.body,
                characters,
                message: message.join(', ')
            });
        }
    });


    app.get('/edit/character/:characterId', async (req, res)=>{
        try{
            let character = await Character.findById(req.params.characterId);
            if (character != null){               
                res.render('managecharacters',{
                    character
                });
            }
        }catch{
                res.redirect('/');
            }
        });

    app.post('/edit/character/:characterId', async (req, res)=>{
        let message = []
        if(req.body.name == ""){
            message.push('Name required');
        }
        if(req.body.race == ""){
            message.push('Race required');
        }
        if(req.body.class == ""){
            message.push('Class required');
        }
        if(req.body.level == null){
            message.push('level required');
        }
        if(isNaN(parseInt(req.body.level))){
            message.push('level required');
        }
        if(req.body.strength == null){
            message.push('strength required');
        }
        if(isNaN(parseInt(req.body.strength))){
            message.push('strength required');
        }
        if(req.body.agility == null){
            message.push('agility required');
        }
        if(isNaN(parseInt(req.body.agility))){
            message.push('agility required');
        }
        if(req.body.intellect == null){
            message.push('intellect required');
        }
        if(isNaN(parseInt(req.body.intellect))){
            message.push('intellect required');
        }

        req.body.ishidden = (req.body.ishidden == "on" ? true : false);

        if(message.length == 0){
            
            if(req.files != undefined && req.files.image != undefined){
                let character = await Character.findById(req.params.characterId);     
                let image = `./public/images/${character.imagename}`;
                if(fs.existsSync(image)){
                    fs.unlinkSync(image);
                }
                //await req.files.image.mv(`./public/images/${req.files.image.name}`);
                //req.body.image = req.files.image.name;
            }

            await Character.findByIdAndUpdate(req.params.characterId, req.body);
            res.redirect('/');
        }
        else{
            res.render('managecharacters', {
                character: req.body,
                message: message.join(', ')
            });
        }
    });

    app.get('/delete/character/:characterId', async (req, res)=>{
        try{
            await Character.findByIdAndDelete(req.params.characterId);
        }catch{
            res.redirect('/');
        }
    });
}