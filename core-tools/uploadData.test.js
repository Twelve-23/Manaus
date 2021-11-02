const ub = require('./uploadData');
async function test(){
  const res = await ub('moda-test1','hello ram','buffer-test.txt');
  console.log(res);
}
test();