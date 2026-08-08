const fs = require('fs');const {execSync} = require('child_process');const filePath = process.argv[2];if(!filePath) throw new Error('Need file path');const s = fs.readFileSync(filePath,'utf8');let lo=0,hi=s.length,ans=-1;while(lo<hi){let mid=Math.floor((lo+hi)/2);const chunk = s.slice(0,mid);fs.writeFileSync('tmp_chunk.js', chunk);try{execSync(`node --check tmp_chunk.js`, {stdio:'pipe'}); // no syntax error so far
lo = mid+1; }catch(err){ans = mid; hi = mid;} }if(ans===-1) console.log('No syntax error found in binary search'); else{ // print context around ans
const before = Math.max(0, ans-200); const after = Math.min(s.length, ans+200);
const prefix = s.slice(before, after);
const lines = s.slice(0, ans).split(/\r?\n/);
const ln = lines.length; const col = lines[lines.length-1].length+1;
console.log('Approx error at char index', ans, 'line', ln, 'col', col); console.log('---context---'); console.log(prefix); }
fs.unlinkSync('tmp_chunk.js');