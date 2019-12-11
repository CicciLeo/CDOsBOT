/* main.js */
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const sp = require('synchronized-promise');
const bot = new Telegraf(process.env.BOT_TOKEN);
var A;
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
  console.log("username: " + botInfo.username);
});
bot.use(session());



function cut(toRemove,string){
  var ret = string.replace(toRemove,'');
  return ret;
}

function getUserMsg(context){

  return JSON.stringify(context.message.text);

}

/*bot.start('', (ctx) => {
  ctx.session.counter = ctx.session.counter || 0
  ctx.session.counter++

});*/

function from(context){

  return context.from.id;

}

function getChatID(context){
  return context.chat.id;
}


bot.hears('Sei tu un bug ', (ctx) => {

  ctx.reply('devi morire!');

});

bot.hears('buildnote', (ctx) => {
  ctx.reply(A);

  //ctx.reply('DEVO MORIRE! '+ getUserMsgToBotId(ctx) );

});
bot.hears('@nunocodex', (ctx) => {


  ctx.reply('prima o poi risponderà' );

});


bot.start((ctx) => {
  ctx.session.wasadmin = false;
  bot.telegram.getChatAdministrators(getChatID(ctx))
  .then( function(data) {
var wasadmin = false;
    var n = Object.keys(data).length;
  for (var i = 0; i < n && i < 10; i++){
      var admin = parseInt(data[i].user.id);
      var user = parseInt(ctx.from.id);
    if(admin ==  user){
      /*ctx.reply('Benvenuto Amministratore ');*/
      wasadmin = true;
      break;
    }else{
      /*ctx.reply('non sei un admin, devi morire!');*/
      wasadmin = false;
    }
}
if (wasadmin){
  ctx.reply('Benvenuto Amministratore ');
  ctx.session.wasadmin = true;
}else{
  ctx.reply('non sei un admin, devi morire!');
  ctx.session.wasadmin = false;
}

});
});

bot.command('Setbuildnote', (ctx) => {  //* Precedentemente /addA *//
  if(ctx.session.wasadmin){

    ctx.reply('fatto!');
    A = cut("/Setbuildnote ",getUserMsg(ctx));
    console.log(cut("/Setbuildnote ",getUserMsg(ctx)));
  }else{
    ctx.reply('non hai i permessi!');
  }
})

bot.command('quit', (ctx) => {
  ctx.session.wasadmin = false;
})

bot.launch();
