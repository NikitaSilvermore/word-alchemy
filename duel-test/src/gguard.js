window.DTVNOSTORE=1;
/* Duel test (game copy): the game's own saves are kept under their own names, so the main save is never read or written. */
(function(){
  try{
    var NS='wa-duel-test-game/',P=Storage.prototype,g=P.getItem,s=P.setItem,r=P.removeItem;
    var k=function(x){x=String(x);return x.indexOf('word-alchemy')===0?NS+x:x;};
    P.getItem=function(x){return g.call(this,k(x));};
    P.setItem=function(x,v){return s.call(this,k(x),v);};
    P.removeItem=function(x){return r.call(this,k(x));};
    P.clear=function(){};
  }catch(e){}
  window.DUELTEST_GAME=true;
  try{var ver=parseInt(g.call(localStorage,'wa-duel-test-ver'),10);if(ver===5&&!g.call(localStorage,'wa-dtv6')){ver=6;s.call(localStorage,'wa-duel-test-ver','6');s.call(localStorage,'wa-dtv6','1');}if(ver===6&&!g.call(localStorage,'wa-dtv7')){ver=7;s.call(localStorage,'wa-duel-test-ver','7');s.call(localStorage,'wa-dtv7','1');}if(ver===7&&!g.call(localStorage,'wa-dtv8')){ver=8;s.call(localStorage,'wa-duel-test-ver','8');s.call(localStorage,'wa-dtv8','1');}if(ver===8&&!g.call(localStorage,'wa-dtv9')){ver=9;s.call(localStorage,'wa-duel-test-ver','9');s.call(localStorage,'wa-dtv9','1');}if(ver===9&&!g.call(localStorage,'wa-dtv10')){ver=10;s.call(localStorage,'wa-duel-test-ver','10');s.call(localStorage,'wa-dtv10','1');}if(ver===10&&!g.call(localStorage,'wa-dtv11')){ver=11;s.call(localStorage,'wa-duel-test-ver','11');s.call(localStorage,'wa-dtv11','1');}if(ver===11&&!g.call(localStorage,'wa-dtv12')){ver=12;s.call(localStorage,'wa-duel-test-ver','12');s.call(localStorage,'wa-dtv12','1');}if(ver===12&&!g.call(localStorage,'wa-dtv13')){ver=13;s.call(localStorage,'wa-duel-test-ver','13');s.call(localStorage,'wa-dtv13','1');}if(ver===13&&!g.call(localStorage,'wa-dtv14')){ver=14;s.call(localStorage,'wa-duel-test-ver','14');s.call(localStorage,'wa-dtv14','1');}if(ver===14&&!g.call(localStorage,'wa-dtv15')){ver=15;s.call(localStorage,'wa-duel-test-ver','15');s.call(localStorage,'wa-dtv15','1');}if(ver===15&&!g.call(localStorage,'wa-dtv16')){ver=16;s.call(localStorage,'wa-duel-test-ver','16');s.call(localStorage,'wa-dtv16','1');}if(ver===16&&!g.call(localStorage,'wa-dtv17')){ver=17;s.call(localStorage,'wa-duel-test-ver','17');s.call(localStorage,'wa-dtv17','1');}if(ver===17&&!g.call(localStorage,'wa-dtv18')){ver=18;s.call(localStorage,'wa-duel-test-ver','18');s.call(localStorage,'wa-dtv18','1');}ver=isNaN(ver)?18:ver;var m=JSON.parse(g.call(localStorage,NS+'word-alchemy-match')||'null');
    if(m&&m.dtv!==ver)r.call(localStorage,NS+'word-alchemy-match');}catch(e){}
  try{var v=parseInt(localStorage.getItem('wa-duel-test-ver'),10);window.DTV=isNaN(v)?18:v;}catch(e){window.DTV=18;}
})();
