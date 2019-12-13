/* main.js */
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'notes.csv',
  header: [{
      id: 'note-id',
      title: 'Note-id'
    },
    {
      id: 'note-description',
      title: 'Note-description'
    },
  ]
});
const sp = require('synchronized-promise');
const bot = new Telegraf(process.env.BOT_TOKEN);
var A;
var notes_list = ["/pippo", "/pluto", "/topolino"]; //Array contenente il nome di ciascun nota salvata
var notes_description = ["test1", "test2", "test3"];




/*function saveNotes() { //BOTH VARS MUST BE ARRAY
  var datanote = [""];
  var temp = notes_list.lenght;
  for (var notei = 0; temp > notei; notei++) {
    datanote.push("{ note-id:"+"'"+notes_list[notei]+"'"+", node-description: "+"'"+ notes_description[notei]+"'} ");
  }
  csvWriter
    .writeRecords(datanote)
    .then(() => console.log('The CSV file was written successfully'));

} */




// buildnote_items
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
  console.log("username: " + botInfo.username);
});
bot.use(session());


function cut(toRemove, string) {
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


bot.hears('Sei tu un bug ', (ctx) => {

  ctx.reply('devi morire!');

});


bot.hears('buildnote', (ctx) => {
  ctx.reply(A);
});

bot.hears('brb', (ctx) => {
  ctx.reply("torno subito");
});

bot.hears('save', (ctx) => {
  saveNotes();
});

bot.hears('@nunocodex', (ctx) => {


  ctx.reply('prima o poi risponderà \no forse no');

});


bot.start((ctx) => {
  ctx.session.wasadmin = false;
  bot.telegram.getChatAdministrators(getChatID(ctx))
    .then(function(data) {
      var wasadmin = false;
      var n = Object.keys(data).length;
      for (var i = 0; i < n && i < 10; i++) {
        var admin = parseInt(data[i].user.id);
        var user = parseInt(ctx.from.id);
        if (admin == user) {
          /*ctx.reply('Benvenuto Amministratore ');*/
          wasadmin = true;
          break;
        } else {
          /*ctx.reply('non sei un admin, devi morire!');*/
          wasadmin = false;
        }
      }
      if (wasadmin) {
        ctx.reply('Benvenuto Amministratore ');
        ctx.session.wasadmin = true;
      } else {
        ctx.reply('non sei un admin, devi morire!');
        ctx.session.wasadmin = false;
      }

    });
});
/*
bot.command('set', (ctx) => { // Precedentemente /addA
  if (ctx.session.wasadmin) {

    ctx.reply('fatto!');
    A = cut("/set ", getUserMsg(ctx));
    console.log(cut("/set ", getUserMsg(ctx)));
  } else {
    ctx.reply('non hai i permessi!');
  }
})

bot.command('quit', (ctx) => {
  ctx.session.wasadmin = false;
})
*/
bot.launch();


bot.hears(notes_list, (ctx) => { //Funzione che si attiva ogni volta che un messaggio contiene il nome di una nota

  ctx.reply("Bingo"); //Sostituire con il contenuto della nota (letto da file o da db IDK)

});

bot.command('notes', (ctx) => {
  ctx.reply("List of notes of CleanDroidOS\n" + notes_list.join("\n"));
});

bot.command('addnote', (ctx) => {
  if (ctx.session.wasadmin) {
    var new_note = cut("/addnote ", getUserMsg(ctx)).split(" "); // qui prendi il
    if (notes_list.indexOf(new_note[0]) != -1) {
      //Gestire se la nota è già presente
      ctx.reply("Esiste già GG");
    } else {
      notes_list.push("/" + new_note[0]);

    }
  } else {
    ctx.reply('non hai i permessi!');
  }

  bot.command('notes', (ctx) => {
    ctx.reply("List of notes of CleanDroidOS\n" + notes_list.join("\n")); //Aggiorna la lista dei comandi xD
  });

})
