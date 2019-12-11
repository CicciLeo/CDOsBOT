/* main.js */
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
  console.log("username: " + botInfo.username);
});





function getUserMsgToBotId(context){

  return JSON.stringify(context.message.message_id);

}



function from(context){

  return JSON.stringify(context.from);

}



function getChatID(context){
  return context.chat.id;
}

function getCHATAdmins(context){
var c;
  bot.telegram.getChatAdministrators(getChatID(context))
  .then( function(data) {
    console.log(data);
  c =  data;
  // data contain data.user.id
  // data.user.username
  // some other stuff.
  //usable like data[n].something.something;
  } );
return c ;

}

bot.hears('Sei tu un bug 😆', (ctx) => {

  ctx.reply('devi morire! ');

});


bot.hears('ciao', (ctx) => {


  //ctx.reply('DEVO MORIRE! '+ getUserMsgToBotId(ctx) );

});


bot.start((ctx) => {
  console.log("giuseppe");
var adminArray =  getCHATAdmins(ctx);
console.log(adminArray);
for (var i = 0; i<adminArray && i < 10; i++){

  if(adminArray[i].user.id == from(ctx)){
    ctx.reply('Benvenuto Amministratore ');
  }else{
    ctx.reply('non sei un admin, devi morire!');

  }
}

});


bot.launch();
