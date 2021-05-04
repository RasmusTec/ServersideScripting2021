const { Mongoose } = require('mongoose');
const Character = require('./models/characterModel');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

async function getCharacters(){
    return await Character
    .find() 
    .collation({locale:'en'})
    .sort({'name:':'asc'});
}

const imagePath = './public/images/';

function createUniqueName(filename){
    return uuidv4() + path.extname(filename);
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
            if(req.files != undefined && req.files.image != undefined && req.files.image.name != ''){
                let filename = createUniqueName(req.files.image.name);
                await req.files.image.mv(imagePath+ filename);
                character.image = filename;
            }else{
                character.image = 'default.png';
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
        res.render('managecharacters',{
            character
        });
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
            let character = await Character.findById(req.params.characterId);
            if(fs.existsSync(imagePath + character.image) && character.image != 'default.png'){
                await fs.unlinkSync(imagePath + character.image);
                req.body.image = 'default.png';
            }
            if(req.files != undefined && req.files.image != undefined && req.files.image.name != ''){
                let filename = createUniqueName(req.files.image.name);
                await req.files.image.mv(imagePath+ filename);
                req.body.image = filename;
            }else{
                req.body.image = 'default.png';
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
            let character = await Character.findById(req.params.characterId);
            if(fs.existsSync(imagePath + character.image) && character.image != 'default.png'){
                await fs.unlinkSync(imagePath + character.image);
            }
            await Character.findByIdAndDelete(req.params.characterId);
            res.redirect('/');
        }catch{
            res.redirect('/');
        }
    });

    app.get('/preview/character/:characterId', async(req, res)=>{
        let character = await Character.findById(req.params.characterId);
        res.render('viewcharacter',{
            character
        });
    });
}