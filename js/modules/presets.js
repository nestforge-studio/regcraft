// presets.js - recipes
export const PRESETS = {
  email: function(){
    const seq = []; let id=1; const add=(u)=>seq.push(u);
    // No anchors so email-like strings can match inside text (simplified)
    add({id:id++, key:'word', type:'atom', colorIndex:0, attachedQuant:'+'});
    add({id:id++, key:'lit', type:'literal', value:'@', colorIndex:1});
    add({id:id++, key:'word', type:'atom', colorIndex:2, attachedQuant:'+'});
    add({id:id++, key:'lit', type:'literal', value:'.', colorIndex:3});
    add({id:id++, key:'word', type:'atom', colorIndex:4, attachedQuant:'+'});
    return seq;
  },
  ipv4: function(){
    const seq = []; let id=1; const add=(u)=>seq.push(u);
    // No anchors so IPv4 can match inside text
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:0});
    add({id:id++, key:'digit', type:'atom'});
    seq[seq.length-1].attachedQuant = '{1,3}';
    add({id:id++, key:'lit', type:'literal', value:'.'});
    add({id:id++, key:'grpClose', type:'groupClose'});
    seq[seq.length-1].attachedQuant = '{3}';
    add({id:id++, key:'digit', type:'atom'});
    seq[seq.length-1].attachedQuant = '{1,3}';
    return seq;
  },
  hexcolor: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so hex colors can be matched inside text
    add({id:id++, key:'lit', type:'literal', value:'#', colorIndex:0});
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:1});
    add({id:id++, key:'class', type:'atom', value:'A-Fa-f0-9', colorIndex:2});
    seq[seq.length-1].attachedQuant = '{3}';
    add({id:id++, key:'alt', type:'alternation'});
    add({id:id++, key:'class', type:'atom', value:'A-Fa-f0-9', colorIndex:3});
    seq[seq.length-1].attachedQuant = '{6}';
    add({id:id++, key:'grpClose', type:'groupClose'});
    return seq;
  },
  date: function(){
    // Match YYYY-MM-DD within larger text (no anchors)
    const seq=[]; let id=1; const add=u=>seq.push(u);
    add({id:id++, key:'digit', type:'atom', colorIndex:0}); seq[seq.length-1].attachedQuant='{4}';
    add({id:id++, key:'lit', type:'literal', value:'-', colorIndex:1});
    add({id:id++, key:'digit', type:'atom', colorIndex:2}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'lit', type:'literal', value:'-', colorIndex:3});
    add({id:id++, key:'digit', type:'atom', colorIndex:4}); seq[seq.length-1].attachedQuant='{2}';
    return seq;
  },
  url: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so URLs can be matched inside larger text
    add({id:id++, key:'lit', type:'literal', value:'http', colorIndex:0});
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:1});
    add({id:id++, key:'lit', type:'literal', value:'s'});
    add({id:id++, key:'grpClose', type:'groupClose'});
    seq[seq.length-1].attachedQuant = '?';
    add({id:id++, key:'lit', type:'literal', value:'://', colorIndex:2});
    add({id:id++, key:'word', type:'atom', colorIndex:3}); seq[seq.length-1].attachedQuant='+';
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:4});
    add({id:id++, key:'lit', type:'literal', value:'.'});
    add({id:id++, key:'word', type:'atom'}); seq[seq.length-1].attachedQuant='+';
    add({id:id++, key:'grpClose', type:'groupClose'}); seq[seq.length-1].attachedQuant = '+';
    return seq;
  },
  uuid: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so UUIDs can match inside text
    add({id:id++, key:'class', type:'atom', value:'0-9A-Fa-f', colorIndex:0}); seq[seq.length-1].attachedQuant='{8}';
    add({id:id++, key:'lit', type:'literal', value:'-', colorIndex:1});
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:2});
    add({id:id++, key:'class', type:'atom', value:'0-9A-Fa-f'}); seq[seq.length-1].attachedQuant='{4}';
    add({id:id++, key:'lit', type:'literal', value:'-'});
    add({id:id++, key:'grpClose', type:'groupClose'}); seq[seq.length-1].attachedQuant='{3}';
    add({id:id++, key:'class', type:'atom', value:'0-9A-Fa-f', colorIndex:3}); seq[seq.length-1].attachedQuant='{12}';
    return seq;
  },
  usphone: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so US phone numbers can match inside text
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:0});
    add({id:id++, key:'lit', type:'literal', value:'('});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{3}';
    add({id:id++, key:'lit', type:'literal', value:')'});
    add({id:id++, key:'grpClose', type:'groupClose'}); seq[seq.length-1].attachedQuant='?';
    add({id:id++, key:'class', type:'atom', value:' -'}); seq[seq.length-1].attachedQuant='?';
    add({id:id++, key:'digit', type:'atom', colorIndex:1}); seq[seq.length-1].attachedQuant='{3}';
    add({id:id++, key:'class', type:'atom', value:' -'}); seq[seq.length-1].attachedQuant='?';
    add({id:id++, key:'digit', type:'atom', colorIndex:2}); seq[seq.length-1].attachedQuant='{4}';
    return seq;
  },
  ukpostcode: function(){
    // More realistic simplified UK postcode (still not fully exhaustive)
    // [A-PR-UWYZ][A-HK-Y]?\d[A-HK-Y0-9]?\s?\d[ABD-HJLN-UW-Z]{2}
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // Outward
    add({id:id++, key:'class', type:'atom', value:'A-PR-UWYZ', colorIndex:0}); // first letter
    add({id:id++, key:'class', type:'atom', value:'A-HK-Y'}); seq[seq.length-1].attachedQuant='?'; // optional second letter
    add({id:id++, key:'digit', type:'atom', colorIndex:1}); // digit
    add({id:id++, key:'class', type:'atom', value:'A-HK-Y0-9'}); seq[seq.length-1].attachedQuant='?'; // optional alnum
    // Optional space
    add({id:id++, key:'space', type:'atom'}); seq[seq.length-1].attachedQuant='?';
    // Inward
    add({id:id++, key:'digit', type:'atom', colorIndex:2});
    add({id:id++, key:'class', type:'atom', value:'ABD-HJLN-UW-Z', colorIndex:3}); seq[seq.length-1].attachedQuant='{2}';
    return seq;
  },
  ukpostcode_strict: function(){
    // Alias to the same improved simplified pattern (kept separate for clarity/UX)
    return this.ukpostcode();
  },
  ukpostcode_formats: function(){
    // Enumerate main valid outward formats: A9, A9A, A99, AA9, AA9A, AA99 followed by inward \s?\d[ABD-HJLN-UW-Z]{2}
    const seq=[]; let id=1; const add=u=>seq.push(u);
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:0});
    // A9
    add({id:id++, key:'class', type:'atom', value:'A-PR-UWYZ'});
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'alt', type:'alternation'});
    // A9A
    add({id:id++, key:'class', type:'atom', value:'A-PR-UWYZ'});
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'class', type:'atom', value:'A-HK-Y'});
    add({id:id++, key:'alt', type:'alternation'});
    // A99
    add({id:id++, key:'class', type:'atom', value:'A-PR-UWYZ'});
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'alt', type:'alternation'});
    // AA9
    add({id:id++, key:'class', type:'atom', value:'A-PR-UWYZ'});
    add({id:id++, key:'class', type:'atom', value:'A-HK-Y'});
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'alt', type:'alternation'});
    // AA9A
    add({id:id++, key:'class', type:'atom', value:'A-PR-UWYZ'});
    add({id:id++, key:'class', type:'atom', value:'A-HK-Y'});
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'class', type:'atom', value:'A-HK-Y'});
    add({id:id++, key:'alt', type:'alternation'});
    // AA99
    add({id:id++, key:'class', type:'atom', value:'A-PR-UWYZ'});
    add({id:id++, key:'class', type:'atom', value:'A-HK-Y'});
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'digit', type:'atom'});
    // Close outward group
    add({id:id++, key:'grpClose', type:'groupClose'});
    // Optional space
    add({id:id++, key:'space', type:'atom'}); seq[seq.length-1].attachedQuant='?';
    // Inward
    add({id:id++, key:'digit', type:'atom'});
    add({id:id++, key:'class', type:'atom', value:'ABD-HJLN-UW-Z'}); seq[seq.length-1].attachedQuant='{2}';
    return seq;
  },
  creditcard: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so credit cards can match inside text (basic)
    add({id:id++, key:'digit', type:'atom', colorIndex:0}); seq[seq.length-1].attachedQuant='{13,16}';
    return seq;
  },
  creditcard_strict: function(){
    // Visa: 4\d{12}(\d{3})? | MasterCard: 5[1-5]\d{14} | Amex: 3[47]\d{13}
    // Discover (simplified): 6011\d{12} | 65\d{14} | 64[4-9]\d{13}
    // JCB (simplified): 35[2-8]\d{14}
    // Diners Club (simplified): 3(?:0[0-5]|[68])\d{11}
    const seq=[]; let id=1; const add=u=>seq.push(u);
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:0});
    // Visa
    add({id:id++, key:'lit', type:'literal', value:'4'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{12}';
    add({id:id++, key:'grpOpen', type:'groupOpen'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{3}';
    add({id:id++, key:'grpClose', type:'groupClose'}); seq[seq.length-1].attachedQuant='?';
    // |
    add({id:id++, key:'alt', type:'alternation'});
    // MasterCard 5[1-5]\d{14}
    add({id:id++, key:'lit', type:'literal', value:'5'});
    add({id:id++, key:'class', type:'atom', value:'1-5'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{14}';
    // |
    add({id:id++, key:'alt', type:'alternation'});
    // Amex 3[47]\d{13}
    add({id:id++, key:'lit', type:'literal', value:'3'});
    add({id:id++, key:'class', type:'atom', value:'47'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{13}';
    // |
    add({id:id++, key:'alt', type:'alternation'});
    // Discover 6011\d{12}
    add({id:id++, key:'lit', type:'literal', value:'6011'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{12}';
    // |
    add({id:id++, key:'alt', type:'alternation'});
    // Discover 65\d{14}
    add({id:id++, key:'lit', type:'literal', value:'65'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{14}';
    // |
    add({id:id++, key:'alt', type:'alternation'});
    // Discover 64[4-9]\d{13}
    add({id:id++, key:'lit', type:'literal', value:'64'});
    add({id:id++, key:'class', type:'atom', value:'4-9'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{13}';
    // |
    add({id:id++, key:'alt', type:'alternation'});
    // JCB 35[2-8]\d{14}
    add({id:id++, key:'lit', type:'literal', value:'35'});
    add({id:id++, key:'class', type:'atom', value:'2-8'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{14}';
    // |
    add({id:id++, key:'alt', type:'alternation'});
    // Diners Club 3(?:0[0-5]|[68])\d{11}
    add({id:id++, key:'lit', type:'literal', value:'3'});
    add({id:id++, key:'grpOpen', type:'groupOpen'});
    add({id:id++, key:'lit', type:'literal', value:'0'});
    add({id:id++, key:'class', type:'atom', value:'0-5'});
    add({id:id++, key:'grpClose', type:'groupClose'});
    add({id:id++, key:'alt', type:'alternation'});
    add({id:id++, key:'class', type:'atom', value:'68'});
    add({id:id++, key:'digit', type:'atom'}); seq[seq.length-1].attachedQuant='{11}';
    // Group end
    add({id:id++, key:'grpClose', type:'groupClose'});
    return seq;
  },
  slug: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so slugs can match inside text
    add({id:id++, key:'class', type:'atom', value:'a-z0-9', colorIndex:0}); seq[seq.length-1].attachedQuant='+';
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:1});
    add({id:id++, key:'lit', type:'literal', value:'-'});
    add({id:id++, key:'class', type:'atom', value:'a-z0-9'}); seq[seq.length-1].attachedQuant='+';
    add({id:id++, key:'grpClose', type:'groupClose'}); seq[seq.length-1].attachedQuant='*';
    return seq;
  },
  mac: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so MAC addresses can match inside text
    add({id:id++, key:'class', type:'atom', value:'0-9A-Fa-f', colorIndex:0}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'grpOpen', type:'groupOpen', colorIndex:1});
    add({id:id++, key:'lit', type:'literal', value:':'});
    add({id:id++, key:'class', type:'atom', value:'0-9A-Fa-f'}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'grpClose', type:'groupClose'}); seq[seq.length-1].attachedQuant='{5}';
    return seq;
  },
  semver: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so SemVer can match inside text
    add({id:id++, key:'digit', type:'atom', colorIndex:0}); seq[seq.length-1].attachedQuant='+';
    add({id:id++, key:'lit', type:'literal', value:'.', colorIndex:1});
    add({id:id++, key:'digit', type:'atom', colorIndex:2}); seq[seq.length-1].attachedQuant='+';
    add({id:id++, key:'lit', type:'literal', value:'.', colorIndex:3});
    add({id:id++, key:'digit', type:'atom', colorIndex:4}); seq[seq.length-1].attachedQuant='+';
    return seq;
  },
  iso8601: function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // No anchors so ISO8601 can match inside text
    add({id:id++, key:'digit', type:'atom', colorIndex:0}); seq[seq.length-1].attachedQuant='{4}';
    add({id:id++, key:'lit', type:'literal', value:'-', colorIndex:1});
    add({id:id++, key:'digit', type:'atom', colorIndex:2}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'lit', type:'literal', value:'-', colorIndex:3});
    add({id:id++, key:'digit', type:'atom', colorIndex:4}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'lit', type:'literal', value:'T', colorIndex:5});
    add({id:id++, key:'digit', type:'atom', colorIndex:6}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'lit', type:'literal', value:':', colorIndex:7});
    add({id:id++, key:'digit', type:'atom', colorIndex:8}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'lit', type:'literal', value:':', colorIndex:9});
    add({id:id++, key:'digit', type:'atom', colorIndex:10}); seq[seq.length-1].attachedQuant='{2}';
    return seq;
  }
};

export function applyPreset(key, setSequence){
  if(!key || !PRESETS[key]) return;
  const seq = PRESETS[key]();
  setSequence(seq);
}


// Additional presets: NINO and SSN
// NINO (simplified): [A-Za-z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]?
// SSN: \d{3}-\d{2}-\d{4}
// Extend PRESETS if not already present
if(!PRESETS.nino){
  PRESETS.nino = function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // two letters (exclude D F I Q U V): A-CEGHJ-PR-TW-Z
    add({id:id++, key:'class', type:'atom', value:'A-CEGHJ-PR-TW-Z', colorIndex:0}); seq[seq.length-1].attachedQuant='{2}';
    // optional space
    add({id:id++, key:'space', type:'atom'}); seq[seq.length-1].attachedQuant='?';
    // 2 digits
    add({id:id++, key:'digit', type:'atom', colorIndex:1}); seq[seq.length-1].attachedQuant='{2}';
    // optional space
    add({id:id++, key:'space', type:'atom'}); seq[seq.length-1].attachedQuant='?';
    // 2 digits
    add({id:id++, key:'digit', type:'atom', colorIndex:2}); seq[seq.length-1].attachedQuant='{2}';
    // optional space
    add({id:id++, key:'space', type:'atom'}); seq[seq.length-1].attachedQuant='?';
    // 2 digits
    add({id:id++, key:'digit', type:'atom', colorIndex:3}); seq[seq.length-1].attachedQuant='{2}';
    // optional space
    add({id:id++, key:'space', type:'atom'}); seq[seq.length-1].attachedQuant='?';
    // optional suffix A-D
    add({id:id++, key:'class', type:'atom', value:'A-D', colorIndex:4}); seq[seq.length-1].attachedQuant='?';
    return seq;
  };
}

if(!PRESETS.ssn){
  PRESETS.ssn = function(){
    const seq=[]; let id=1; const add=u=>seq.push(u);
    // \d{3}-\d{2}-\d{4}
    add({id:id++, key:'digit', type:'atom', colorIndex:0}); seq[seq.length-1].attachedQuant='{3}';
    add({id:id++, key:'lit', type:'literal', value:'-', colorIndex:1});
    add({id:id++, key:'digit', type:'atom', colorIndex:2}); seq[seq.length-1].attachedQuant='{2}';
    add({id:id++, key:'lit', type:'literal', value:'-', colorIndex:3});
    add({id:id++, key:'digit', type:'atom', colorIndex:4}); seq[seq.length-1].attachedQuant='{4}';
    return seq;
  };
}
