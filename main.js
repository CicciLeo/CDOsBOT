/* main.js */
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const fs = require('fs');
const sp = require('synchronized-promise');
const bot = new Telegraf(process.env.BOT_TOKEN);
var A;
var isAdmin = false;
var notes_list = ["pippo", "pluto", "topolino"]; //Array contenente il nome di ciascun nota salvata
var notes_description = ["cane", "gatto", "topo"];

//LOADING PROCESS
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
  console.log("username: " + botInfo.username);
});
bot.use(session());


fs.exists("/notes.json", function(exists) {
  loadNotes();
  console.log("\n\n\n" + notes_list);
});
//END LOADING

function saveNotes() { //salva i due array delle note
  var notes = function(note_l, note_d) {
    this.notelist = note_l;
    this.notedesc = note_d;
  }
  var notes_obj = new notes(notes_list, notes_description);
  let data = JSON.stringify(notes_obj, null, 2);
  fs.writeFile('notes.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
}

function loadNotes() { //carica gli array del file JSON nei due array delle note
  fs.readFile('notes.json', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes_list = notes.notelist;
    notes_description = notes.notedesc;

    console.log(notes_list);
    console.log(notes_description);
    bot.command("get", (ctx) => {
      var command = cut("/get ", getUserMsg(ctx));
      ctx.reply(notes_description[getNoteIDByName(command)]);
    });
  });
}

function cut(toRemove, string) {          //non è che può dare problemi?
  var ret = string.replace(toRemove, '');
  return ret;
}

function getUserMsg(context) {
  return context.message.text;
}

function from(context) {
  return context.from.id;
}

function getChatID(context) {
  return context.chat.id;
}

function isAdmin(user) {
  return (user.status == "creator") || (user.status == "administrator");
}

/*bot.command('savenotes', (ctx) => {
  if (isAdmin) {
    saveNotes();
    ctx.reply("Notes has been saved");
  } else {
    ctx.reply("You dont have the permission to do that");
  }
});*/
bot.command('savenotes', (ctx) => {                             //ADD new permission check
  bot.telegram.getChatMember(getChatID(ctx), from(ctx))
    .then(function(user) {
      if (isAdmin(user)) {
        saveNotes();
        ctx.reply("Notes have been saved");
      } else {
        ctx.reply("You dont have the permission to do that");
      }
    });
});

/*bot.command('loadnotes', (ctx) => {
  if (isAdmin) {
    loadNotes();
    ctx.reply("Notes has been loaded");
  } else {
    ctx.reply("You dont have the permission to do that");
  }
});*/
bot.command('loadnotes', (ctx) => {                             //ADD new permission check
  bot.telegram.getChatMember(getChatID(ctx), from(ctx))
    .then(function(user) {
      if (isAdmin(user)) {
        loadNotes();
        ctx.reply("Notes have been loaded");
      } else {
        ctx.reply("You dont have the permission to do that");
      }
    });
});



bot.hears('@Shiberal', (ctx) => {
  ctx.reply('prima o poi risponderà \no forse no');
});


/*function getNoteIDByName(name) {
  for (var i = 0; i <= notes_list.length; i++) {
    if (name == notes_list[i]) {
      return i;
    }
  }
}*/
function getNoteIDByName(name) {
  return notes_list.indexOf(name);
}


/*bot.command(notes_list, (ctx) => { //Funzione che si attiva ogni volta che un messaggio contiene il nome di una nota
  var nome_nota = cut("/", getUserMsg(ctx));
  ctx.reply(notes_description[getNoteIDByName(nome_nota)]);
});*/
bot.command( (ctx) => {                           //Replace old "bot.command(notes_list, ecc...)"
  var command = cut("/ ", getUserMsg(ctx)).split(" ")[0];
  var id_nota = getNoteIDByName(command);
  if(id_nota != -1) {
    ctx.reply(notes_description[id_nota]);
  } else {
      console.log("Nota non trovata");
  }
});


bot.command('notes', (ctx) => {
  ctx.reply("List of notes of CleanDroidOS\n" + notes_list.join("\n"));
});

/*bot.command('set', (ctx) => { // EX ADDNOTE NOW SET
  if (isAdmin) {
    var new_note = cut("/set ", getUserMsg(ctx)).split(" ");
    if (notes_list.indexOf(new_note[0]) != -1) {
      //Gestire se la nota è già presente
      ctx.reply("Already exists a note with this name: " + new_note[0]);
    } else {
      notes_list.push("/" + new_note[0]);

    }
  } else {
    ctx.reply('non hai i permessi!');
  }

  ctx.reply("List of notes of CleanDroidOS\n" + notes_list.join("\n"));
});*/
bot.command('set', (ctx) => {
  bot.telegram.getChatMember(getChatID(ctx), from(ctx))
    .then(function(user) {
      if (isAdmin(user)) {
        var new_note = cut("/set ", getUserMsg(ctx));           //stringa che contiene sia il nome della nota sia il contenuto
        var new_note_name = new_note.split(" ")[0];
        var new_note_description = cut(new_note_name + " ", new_note);
        var index = getNoteIDByName(new_note_name);
        if (index != -1) {
          //salvare la nota alla posizione index
          notes_description[index] = new_note_description;
        } else {
          notes_list.push(new_note_name);
          notes_description.push(new_note_description);
        }
        saveNotes();
        ctx.reply("Note has been saved");
      } else {
        ctx.reply("You dont have the permission to do that");
      }
    });
});


bot.command("get", (ctx) => {
  var command = cut("/get ", getUserMsg(ctx));
  var id_nota = getNoteIDByName(command);
  if(id_nota != -1) {
    ctx.reply(notes_description[id_nota]);
  } else {
      console.log("Nota non trovata");
  }
});


/*bot.command((ctx) => {
  bot.telegram.getChatMember(getChatID(ctx), from(ctx))
    .then(function(data) {
      //ctx.reply("---DEBUG-DATA---\n"+data+"\n---DEBUG-DATA.status---\n"+ data.status);
      if ((data.status != "creator") && (data.status != "administrator")) {
        isAdmin = false;
      } else {
        isAdmin = true;
      }
      //ctx.reply(isAdmin);
    });


});*/



bot.launch();
