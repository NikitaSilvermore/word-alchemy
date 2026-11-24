/* Loads the engine, the cards, the themes and the bot for Node. */
const E=require('./engine.js');const H=require('./cards1.js')(E);require('./cards2.js')(E,H);require('./themes.js')(E);E.bot=require('./bot.js')(E);module.exports=E;
