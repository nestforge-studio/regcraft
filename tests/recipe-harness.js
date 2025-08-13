import { BuilderAPI } from '../js/modules/builder.js';
import { applyPreset } from '../js/modules/presets.js';

const $ = (sel, root=document) => root.querySelector(sel);
const results = $('#results');

function line(msg, ok){
  const el = document.createElement('div');
  el.className = ok ? 'text-emerald-700' : 'text-red-700';
  el.textContent = (ok? '✓ ' : '✗ ') + msg;
  results.appendChild(el);
}

function section(title){
  const el = document.createElement('div');
  el.className = 'mt-4 font-semibold';
  el.textContent = title;
  results.appendChild(el);
}

function clearResults(){ results.innerHTML = ''; }

async function run(){
  clearResults();
  section('Running recipe tests...');

  try{
    // Ensure global flag is on
    const flagG = $('#flag-g');
    if(flagG) flagG.checked = true;

    // 1) UK Postcode in sentence
    applyPreset('ukpostcode', (seq)=> BuilderAPI.setSequence(seq));
    const t1 = 'Where do you live? I live in WN2 5EB.';
    const testInput = $('#test-input');
    testInput.value = t1;
    BuilderAPI.render();
    const highlight1 = $('#highlight-output').textContent;
    const inline1 = $('#inline-output').textContent;
    const ok1 = highlight1.includes('WN2 5EB') && inline1.includes('WN2 5EB');
    line('UK Postcode: highlights WN2 5EB', ok1);

    // 2) Date within sentence
    applyPreset('date', (seq)=> BuilderAPI.setSequence(seq));
    const t2 = "Today's Date is: 2025-09-07";
    testInput.value = t2;
    BuilderAPI.render();
    const highlight2 = $('#highlight-output').textContent;
    const inline2 = $('#inline-output').textContent;
    const ok2 = highlight2.includes('2025-09-07') && inline2.includes('2025-09-07');
    line('Date YYYY-MM-DD: highlights 2025-09-07', ok2);

    // 3) URL simple
    applyPreset('url', (seq)=> BuilderAPI.setSequence(seq));
    const t3 = 'Visit https://example.com/docs today';
    testInput.value = t3;
    BuilderAPI.render();
    const rxOut3 = $('#regex-output').textContent || '';
    const highlight3 = $('#highlight-output').textContent;
    const ok3 = /https?/.test(rxOut3) && highlight3.includes('https://example.com');
    line('URL (basic): highlights https://example.com', ok3);

    // 4) Email inside sentence (now unanchored)
    applyPreset('email', (seq)=> BuilderAPI.setSequence(seq));
    const t4 = 'Contact me at foo@bar.com or call later.';
    testInput.value = t4;
    BuilderAPI.render();
    const highlight4 = $('#highlight-output').textContent;
    const ok4 = highlight4.includes('foo@bar.com');
    line('Email: highlights foo@bar.com', ok4);

    // 5) IPv4 in text
    applyPreset('ipv4', (seq)=> BuilderAPI.setSequence(seq));
    const t5 = 'Ping 10.0.0.1 now';
    testInput.value = t5;
    BuilderAPI.render();
    const highlight5 = $('#highlight-output').textContent;
    const ok5 = highlight5.includes('10.0.0.1');
    line('IPv4: highlights 10.0.0.1', ok5);

    // 6) Hex color in text
    applyPreset('hexcolor', (seq)=> BuilderAPI.setSequence(seq));
    const t6 = 'Primary is #A1B2C3 and secondary is #fff';
    testInput.value = t6;
    BuilderAPI.render();
    const highlight6 = $('#highlight-output').textContent;
    const ok6 = highlight6.includes('#A1B2C3') || highlight6.includes('#fff');
    line('Hex color: highlights #A1B2C3 or #fff', ok6);

    // 7) UUID (anchored) - entire string
    applyPreset('uuid', (seq)=> BuilderAPI.setSequence(seq));
    const t7 = '550e8400-e29b-41d4-a716-446655440000';
    testInput.value = t7;
    BuilderAPI.render();
    const highlight7 = $('#highlight-output').textContent;
    const ok7 = highlight7.includes(t7);
    line('UUID (anchored): matches exact value', ok7);

    // 8) US phone (anchored) - entire string
    applyPreset('usphone', (seq)=> BuilderAPI.setSequence(seq));
    const t8 = '(123) 456-7890';
    testInput.value = t8;
    BuilderAPI.render();
    const highlight8 = $('#highlight-output').textContent;
    const ok8 = highlight8.includes('123') && highlight8.includes('7890');
    line('US phone (anchored): matches exact value', ok8);

    // 9) Credit card (anchored) - entire string
    applyPreset('creditcard', (seq)=> BuilderAPI.setSequence(seq));
    const t9 = '4111111111111111';
    testInput.value = t9;
    BuilderAPI.render();
    const highlight9 = $('#highlight-output').textContent;
    const ok9 = highlight9.includes('4111111111111111');
    line('Credit card (anchored): matches exact value', ok9);

    // 10) Slug (anchored)
    applyPreset('slug', (seq)=> BuilderAPI.setSequence(seq));
    const t10 = 'my-post-title';
    testInput.value = t10;
    BuilderAPI.render();
    const highlight10 = $('#highlight-output').textContent;
    const ok10 = highlight10.includes('my-post-title');
    line('Slug (anchored): matches exact value', ok10);

    // 11) MAC (anchored)
    applyPreset('mac', (seq)=> BuilderAPI.setSequence(seq));
    const t11 = '01:23:45:67:89:ab';
    testInput.value = t11;
    BuilderAPI.render();
    const highlight11 = $('#highlight-output').textContent;
    const ok11 = highlight11.includes('01:23:45:67:89:ab');
    line('MAC (anchored): matches exact value', ok11);

    // 12) SemVer (anchored)
    applyPreset('semver', (seq)=> BuilderAPI.setSequence(seq));
    const t12 = '1.2.3';
    testInput.value = t12;
    BuilderAPI.render();
    const highlight12 = $('#highlight-output').textContent;
    const ok12 = highlight12.includes('1.2.3');
    line('SemVer (anchored): matches exact value', ok12);

    // 13) ISO8601 (anchored)
    applyPreset('iso8601', (seq)=> BuilderAPI.setSequence(seq));
    const t13 = '2025-09-07T12:34:56';
    testInput.value = t13;
    BuilderAPI.render();
    const highlight13 = $('#highlight-output').textContent;
    const ok13 = highlight13.includes('2025-09-07T12:34:56');
    line('ISO 8601 (anchored): matches exact value', ok13);

    // 14) UK NINO (simplified) in text
    applyPreset('nino', (seq)=> BuilderAPI.setSequence(seq));
    const t14 = 'My NINO is AB 12 34 56 C';
    testInput.value = t14;
    BuilderAPI.render();
    const highlight14 = $('#highlight-output').textContent;
    const ok14 = highlight14.includes('AB 12 34 56 C');
    line('UK NINO (simplified): highlights AB 12 34 56 C', ok14);

    // 15) US SSN in text
    applyPreset('ssn', (seq)=> BuilderAPI.setSequence(seq));
    const t15 = 'My SSN is 123-45-6789';
    testInput.value = t15;
    BuilderAPI.render();
    const highlight15 = $('#highlight-output').textContent;
    const ok15 = highlight15.includes('123-45-6789');
    line('US SSN: highlights 123-45-6789', ok15);

  }catch(err){
    console.error(err);
    line('Harness error: ' + err.message, false);
  }
}

$('#run-tests').addEventListener('click', run);
$('#clear').addEventListener('click', clearResults);
