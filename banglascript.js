/** * ==========================================
 * BanglaScript (BN) - The Open Source Bengali Programming Language
 * Creator: Jyotirmoy Mistri
 * ==========================================
 */

function banglaToEnglishNum(str) {
    if (typeof str !== 'string') str = str.toString();
    const banglaNums = {'০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9'};
    return str.replace(/[০-৯]/g, w => banglaNums[w]);
}

function tokenize(code) {
    let current = 0;
    let tokens = [];
    while (current < code.length) {
        let char = code[current];

        if (/\s/.test(char)) { current++; continue; }
        if (char === '/' && code[current+1] === '/') {
            while (current < code.length && code[current] !== '\n') { current++; }
            continue;
        }
        
        if (char === '"' || char === "'") {
            let quoteType = char;
            let strValue = '';
            current++; 
            while (current < code.length && code[current] !== quoteType) {
                strValue += code[current];
                current++;
            }
            current++; 
            tokens.push({ type: 'টেক্সট', value: strValue });
            continue;
        }

        if (/[0-9০-৯]/.test(char)) {
            let value = '';
            while (current < code.length && /[0-9০-৯]/.test(code[current])) {
                value += code[current];
                current++;
            }
            tokens.push({ type: 'সংখ্যা', value: value });
            continue;
        }
        
        if (/[\u0980-\u09FFa-zA-Z_]/.test(char)) {
            let value = '';
            while (current < code.length && /[\u0980-\u09FFa-zA-Z0-9_০-৯]/.test(code[current])) {
                value += code[current];
                current++;
            }
            
            // নতুন 'ফাইল_যুক্ত_করো' সহ সব কিওয়ার্ড
            let keywords = [
                'ধরি', 'দেখাও', 'রং_বদলানো', 'লেখা_বদলানো', 'যদি', 'নাহলে', 'লুপ', 'বার', 'ইনপুট', 
                'ওয়েবসাইট_বানাও', 'স্টাইল_যোগ_করো', 'ক্লিক_করলে', 'কাজ', 'করো', 'তথ্য_আনো', 'বার্তা_দাও', 
                'সময়', 'তারিখ', 'ঘন্টা', 'মিনিট', 'সেকেন্ড', 'মিলিসেকেন্ড', 'দিন', 'মাস', 'বছর', 'র‍্যান্ডম', 
                'প্রতি_সেকেন্ডে', 'স্ক্রিন_পরিষ্কার', 'দৈর্ঘ্য', 'অ্যানিমেশন_দাও', 'সেভ_করো', 'মেমরি_থেকে_আনো', 
                'মেমরি_মুছো', 'গান_বাজাও', 'গান_থামাও', 'সব_বড়_হাতের', 'সব_ছোট_হাতের', 'শব্দ_বদলানো',
                'পূর্ণসংখ্যা', 'বর্গমূল', 'পাওয়ার', 'ক্যানভাস_বানাও', 'আঁকো_চারকোনা', 'আঁকো_গোল',
                'কিবোর্ড_চাপলে', 'ক্যানভাস_মুছো', 'অপেক্ষা_করো', 'টাচ_করলে', 'ফাইল_ডাউনলোড',
                'স্ক্রিনের_চওড়া', 'স্ক্রিনের_লম্বা', 'টেক্সটবক্সের_মান', 'অন্য_পেজে_যাও', 'নতুন_ট্যাবে_খুলুন', 'স্ক্রল_করো',
                'ক্যামেরা_চালু_করো', 'ক্যামেরা_বন্ধ_করো', 'কথা_বলো', 'কথা_শোনো', 'ডেটা_পাঠাও', 'টেক্সট_থেকে_ডেটা', 'ডেটা_থেকে_টেক্সট',
                'ধাক্কা_লেগেছে', 'সরাও', 'ছবি_যুক্ত_করো', 'লুকাও', 'প্রকাশ_করো', 'চেকবক্সের_মান', 'ড্রপডাউনের_মান',
                'লোকেশন_বের_করো', 'ফোন_কাঁপাও', 'কপি_করো', 'নোটিফিকেশন_দাও',
                'এলোমেলো_সংখ্যা', 'টাইমার_থামাও', 'স্টাইল_বদলানো', 'পুরো_স্ক্রিনের_রং', 'পেজ_রিলোড_করো', 'পেছনে_যাও',
                'নিরাপদ_টেক্সট', 'লুকানো_টেক্সট', 'আসল_টেক্সট', 'চার্ট_আঁকো', 'ইউআরএল_ডেটা',
                'ম্যাপ_দেখাও', 'ছবি_তোলো', 'ভয়েস_মেসেজ_শুরু', 'ভয়েস_মেসেজ_থামাও', 'কিউআর_কোড_বানাও',
                'কল_করো', 'এসএমএস_করো', 'ছবি_বাছাই_করো', 'শেয়ার_করো', 'প্রিন্ট_করো', 'ডিভাইস_তথ্য',
                'টেবিল_বানাও', 'নিচে_স্ক্রল_করো', 'সিস্টেম_সাউন্ড', 'অ্যানিমেশন_থামাও', 'ব্যাটারি_লেভেল', 'আবহাওয়া_আনো',
                'তারিখ_বাছাই_করো', 'রং_বাছাই_করো', 'লাইভ_ঘড়ি_চালু', 'কনসোলে_লেখো', 'ফাইল_যুক্ত_করো'
            ];
            
            if (keywords.includes(value)) { tokens.push({ type: 'কীওয়ার্ড', value: value }); } 
            else { tokens.push({ type: 'চলক', value: value }); }
            continue;
        }
        
        if (char === '=' && code[current+1] === '=') { tokens.push({ type: 'চিহ্ন', value: '==' }); current += 2; continue; }
        if (char === '!' && code[current+1] === '=') { tokens.push({ type: 'চিহ্ন', value: '!=' }); current += 2; continue; }
        if (char === '>' && code[current+1] === '=') { tokens.push({ type: 'চিহ্ন', value: '>=' }); current += 2; continue; }
        if (char === '<' && code[current+1] === '=') { tokens.push({ type: 'চিহ্ন', value: '<=' }); current += 2; continue; }
        if (char === '>') { tokens.push({ type: 'চিহ্ন', value: '>' }); current++; continue; }
        if (char === '<') { tokens.push({ type: 'চিহ্ন', value: '<' }); current++; continue; }
        if (['=', ';', '{', '}', '+', '-', '*', '/', '[', ']', ',', ':'].includes(char)) {
            tokens.push({ type: 'চিহ্ন', value: char });
            current++;
            continue;
        }
        current++; 
    }
    return tokens;
}

async function runTokens(tokens, variables, functions, outputBox) {
    let i = 0;
    let lastIfMet = false; 
    
    while(i < tokens.length) {
        let token = tokens[i];
        
        if (token.type === 'কীওয়ার্ড' && token.value === 'ধরি') {
            let varName = tokens[i+1].value; 
            let valToken = tokens[i+3];
            let val1_token = valToken ? valToken.value : '';
            let val1;

            if (val1_token === '{' || val1_token === '[') {
                let braceCount = 0;
                let bracketCount = 0;
                let k = i + 3;
                let structTokens = [];
                
                while (k < tokens.length) {
                    let t = tokens[k];
                    if (t.value === '{') braceCount++;
                    if (t.value === '}') braceCount--;
                    if (t.value === '[') bracketCount++;
                    if (t.value === ']') bracketCount--;
                    
                    structTokens.push(t);
                    if (braceCount === 0 && bracketCount === 0) break;
                    k++;
                }
                
                let jsonStr = structTokens.map((t, idx) => {
                    if (t.type === 'টেক্সট') return '"' + t.value + '"';
                    let nextToken = structTokens[idx+1];
                    if (t.type === 'চলক' && nextToken && nextToken.value === ':') { return '"' + t.value + '"'; }
                    if (t.type === 'চলক' && variables[t.value] !== undefined) {
                        let v = variables[t.value];
                        if (typeof v === 'string') return '"' + v + '"';
                        if (typeof v === 'object') return JSON.stringify(v);
                        return v;
                    }
                    return t.value;
                }).join(' ');

                try { variables[varName] = new Function('return ' + jsonStr)(); } 
                catch(e) { variables[varName] = jsonStr; }
                
                let j = k + 1; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue; 
            }
            else if (val1_token === 'আবহাওয়া_আনো') {
                let cityToken = tokens[i+4];
                let city = cityToken ? (cityToken.type === 'টেক্সট' ? cityToken.value : (variables[cityToken.value] || cityToken.value)) : '';
                try {
                    let response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
                    variables[varName] = await response.text();
                } catch(e) { variables[varName] = "আবহাওয়া পাওয়া যায়নি!"; }
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'নিরাপদ_টেক্সট') {
                let target = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value)) : '';
                let div = document.createElement('div'); div.innerText = String(target); variables[varName] = div.innerHTML;
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'লুকানো_টেক্সট') {
                let target = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value)) : '';
                try { variables[varName] = btoa(unescape(encodeURIComponent(String(target)))); } catch(e) { variables[varName] = target; }
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'আসল_টেক্সট') {
                let target = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value)) : '';
                try { variables[varName] = decodeURIComponent(escape(atob(String(target)))); } catch(e) { variables[varName] = "ভুল গুপ্ত সংকেত!"; }
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'ইউআরএল_ডেটা') {
                let param = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : '';
                let urlParams = new URLSearchParams(window.location.search); variables[varName] = urlParams.get(param) || '';
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'এলোমেলো_সংখ্যা') {
                let minVal = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value)) : 0;
                let maxVal = tokens[i+5] ? (tokens[i+5].type === 'টেক্সট' ? tokens[i+5].value : (variables[tokens[i+5].value] !== undefined ? variables[tokens[i+5].value] : tokens[i+5].value)) : 100;
                let min = parseFloat(banglaToEnglishNum(minVal)) || 0; let max = parseFloat(banglaToEnglishNum(maxVal)) || 100;
                variables[varName] = Math.floor(Math.random() * (max - min + 1)) + min;
                let j = i + 6; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'টেক্সটবক্সের_মান') {
                let targetId = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : '';
                let el = document.getElementById(targetId); variables[varName] = el ? el.value : '';
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'চেকবক্সের_মান') {
                let targetId = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : '';
                let el = document.getElementById(targetId); variables[varName] = (el && el.checked) ? "সত্য" : "মিথ্যা";
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'ড্রপডাউনের_মান') {
                let targetId = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : '';
                let el = document.getElementById(targetId); variables[varName] = el ? el.value : '';
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'ব্যাটারি_লেভেল') {
                if(navigator.getBattery) { let bat = await navigator.getBattery(); variables[varName] = Math.round(bat.level * 100) + "%"; } 
                else { variables[varName] = "অজানা"; }
                let j = i + 4; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'ডিভাইস_তথ্য') {
                let ua = navigator.userAgent; let deviceName = "অজানা ডিভাইস";
                if(/Android/i.test(ua)) deviceName = "Android মোবাইল"; else if(/iPhone|iPad|iPod/i.test(ua)) deviceName = "iPhone বা iPad";
                else if(/Windows/i.test(ua)) deviceName = "Windows কম্পিউটার"; else if(/Mac/i.test(ua)) deviceName = "Mac কম্পিউটার";
                variables[varName] = deviceName;
                let j = i + 4; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'ধাক্কা_লেগেছে') {
                let id1 = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : '';
                let id2 = tokens[i+5] ? (tokens[i+5].type === 'টেক্সট' ? tokens[i+5].value : (variables[tokens[i+5].value] || tokens[i+5].value)) : '';
                let el1 = document.getElementById(id1), el2 = document.getElementById(id2);
                let isColliding = false;
                if(el1 && el2) {
                    let rect1 = el1.getBoundingClientRect(), rect2 = el2.getBoundingClientRect();
                    isColliding = !(rect1.right <= rect2.left || rect1.left >= rect2.right || rect1.bottom <= rect2.top || rect1.top >= rect2.bottom);
                }
                variables[varName] = isColliding ? "সত্য" : "মিথ্যা";
                let j = i + 6; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'টেক্সট_থেকে_ডেটা') {
                let val = variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value;
                try { variables[varName] = JSON.parse(val); } catch(e) { variables[varName] = val; }
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'ডেটা_থেকে_টেক্সট') {
                let val = variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value;
                try { variables[varName] = JSON.stringify(val); } catch(e) { variables[varName] = String(val); }
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'দৈর্ঘ্য') {
                let val = variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value;
                variables[varName] = val ? (Array.isArray(val) || typeof val === 'string' ? val.length : Object.keys(val).length) : 0;
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'সব_বড়_হাতের') {
                let val = variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value;
                variables[varName] = String(val).toUpperCase();
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'সব_ছোট_হাতের') {
                let val = variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value;
                variables[varName] = String(val).toLowerCase();
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'শব্দ_বদলানো') {
                let target = variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value;
                let oldW = tokens[i+5] ? (tokens[i+5].type === 'টেক্সট' ? tokens[i+5].value : (variables[tokens[i+5].value] || tokens[i+5].value)) : '';
                let newW = tokens[i+6] ? (tokens[i+6].type === 'টেক্সট' ? tokens[i+6].value : (variables[tokens[i+6].value] || tokens[i+6].value)) : '';
                variables[varName] = String(target).split(oldW).join(newW);
                let j = i + 7; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'পূর্ণসংখ্যা') {
                let val = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : 0;
                variables[varName] = Math.round(parseFloat(banglaToEnglishNum(val)));
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'বর্গমূল') {
                let val = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : 0;
                variables[varName] = Math.sqrt(parseFloat(banglaToEnglishNum(val)));
                let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'পাওয়ার') {
                let b = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] || tokens[i+4].value)) : 0;
                let e = tokens[i+5] ? (tokens[i+5].type === 'টেক্সট' ? tokens[i+5].value : (variables[tokens[i+5].value] || tokens[i+5].value)) : 0;
                variables[varName] = Math.pow(parseFloat(banglaToEnglishNum(b)), parseFloat(banglaToEnglishNum(e)));
                let j = i + 6; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; continue;
            }
            else if (val1_token === 'ইনপুট') val1 = prompt(`দয়া করে '${varName}' এর মান লিখুন:`);
            else if (val1_token === 'সময়') val1 = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            else if (val1_token === 'তারিখ') val1 = new Date().toLocaleDateString('bn-BD');
            else if (val1_token === 'ঘন্টা') val1 = new Date().getHours();
            else if (val1_token === 'মিনিট') val1 = new Date().getMinutes();
            else if (val1_token === 'সেকেন্ড') val1 = new Date().getSeconds();
            else if (val1_token === 'মিলিসেকেন্ড') val1 = new Date().getMilliseconds();
            else if (val1_token === 'দিন') val1 = new Date().getDate();
            else if (val1_token === 'মাস') val1 = new Date().getMonth() + 1; 
            else if (val1_token === 'বছর') val1 = new Date().getFullYear();
            else if (val1_token === 'র‍্যান্ডম') val1 = Math.floor(Math.random() * 100) + 1; 
            else if (val1_token === 'স্ক্রিনের_চওড়া') val1 = window.innerWidth;
            else if (val1_token === 'স্ক্রিনের_লম্বা') val1 = window.innerHeight;
            else if (valToken && valToken.type === 'টেক্সট') val1 = val1_token; 
            else val1 = variables[val1_token] !== undefined ? variables[val1_token] : val1_token;

            let num1 = parseFloat(banglaToEnglishNum(val1));
            let finalValue = isNaN(num1) ? val1 : num1;

            let j = i + 4; 
            if (tokens[j] && ['+', '-', '*', '/'].includes(tokens[j].value)) {
                let operator = tokens[j].value;
                let val2_token = tokens[j+1].value;
                let val2 = variables[val2_token] !== undefined ? variables[val2_token] : val2_token;
                let num2 = parseFloat(banglaToEnglishNum(val2));

                if (!isNaN(num1) && !isNaN(num2)) {
                    if (operator === '+') finalValue = num1 + num2;
                    if (operator === '-') finalValue = num1 - num2;
                    if (operator === '*') finalValue = num1 * num2;
                    if (operator === '/') finalValue = num1 / num2;
                }
                j += 2; 
            }
            variables[varName] = finalValue; 
            while(j < tokens.length && tokens[j].value !== ';') { j++; }
            i = j + 1; 
        } 
        else if (token.type === 'কীওয়ার্ড' && token.value === 'দেখাও') {
            let targetToken = tokens[i+1];
            let outputValue = "";
            if (tokens[i+2] && tokens[i+2].value === '[') {
                let indexStr = tokens[i+3].value;
                let index = tokens[i+3].type === 'টেক্সট' ? indexStr : (isNaN(parseInt(banglaToEnglishNum(indexStr))) ? indexStr : parseInt(banglaToEnglishNum(indexStr)));
                let arrOrObj = variables[targetToken.value];
                outputValue = arrOrObj ? arrOrObj[index] : 'খুঁজে পাওয়া যায়নি';
                if (typeof outputValue === 'object') outputValue = JSON.stringify(outputValue); 
                i += 6; 
            } else {
                outputValue = targetToken ? ((targetToken.type === 'টেক্সট') ? targetToken.value : (variables[targetToken.value] !== undefined ? variables[targetToken.value] : targetToken.value)) : '';
                if (Array.isArray(outputValue)) outputValue = outputValue.join(", ");
                else if (typeof outputValue === 'object' && outputValue !== null) outputValue = JSON.stringify(outputValue); 
                i += 3;
            }
            if(outputBox) outputBox.insertAdjacentHTML('beforeend', outputValue + '<br>');
        } 
        // নতুন ফিচার: মডিউল ইম্পোর্ট (অন্য .bn ফাইল যুক্ত করা)
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ফাইল_যুক্ত_করো') {
            let fileToken = tokens[i+1];
            let fileName = fileToken ? (fileToken.type === 'টেক্সট' ? fileToken.value : (variables[fileToken.value] || fileToken.value)) : '';
            try {
                let res = await fetch(fileName);
                if (res.ok) {
                    let fileCode = await res.text();
                    let newTokens = tokenize(fileCode);
                    await runTokens(newTokens, variables, functions, outputBox);
                } else {
                    console.error("ফাইল পাওয়া যায়নি: " + fileName);
                }
            } catch(e) { console.error("ফাইল লোড করতে সমস্যা: " + fileName); }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কনসোলে_লেখো') {
            let targetToken = tokens[i+1];
            let outputValue = targetToken ? ((targetToken.type === 'টেক্সট') ? targetToken.value : (variables[targetToken.value] !== undefined ? variables[targetToken.value] : targetToken.value)) : '';
            console.log("BanglaScript Log:", outputValue);
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'তারিখ_বাছাই_করো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let input = document.createElement('input'); input.type = 'date'; input.id = id;
            input.style = "padding: 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 16px; margin: 10px; display: block;";
            if(outputBox) outputBox.appendChild(input);
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'রং_বাছাই_করো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let input = document.createElement('input'); input.type = 'color'; input.id = id;
            input.style = "padding: 0; border: none; width: 60px; height: 60px; border-radius: 10px; cursor: pointer; display: block; margin: 10px;";
            if(outputBox) outputBox.appendChild(input);
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'লাইভ_ঘড়ি_চালু') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let el = document.getElementById(id);
            if (el) {
                let updateClock = () => { el.innerHTML = new Date().toLocaleTimeString('bn-BD'); };
                updateClock();
                let clockInterval = setInterval(updateClock, 1000);
                if (!window.bengaliIntervals) window.bengaliIntervals = []; window.bengaliIntervals.push(clockInterval);
            }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'টেবিল_বানাও') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let dataArr = tokens[i+2] ? (variables[tokens[i+2].value] || []) : [];

            if (Array.isArray(dataArr) && dataArr.length > 0) {
                let tableHTML = `<table id="${id}" style="width:100%; border-collapse: collapse; margin: 15px 0; font-family: sans-serif; text-align: left; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: white;">`;
                tableHTML += `<tr style="background-color: #4CAF50; color: white;">`;
                Object.keys(dataArr[0]).forEach(key => { tableHTML += `<th style="padding: 12px; border: 1px solid #ddd;">${key}</th>`; });
                tableHTML += `</tr>`;
                
                dataArr.forEach((row, index) => {
                    let bg = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
                    tableHTML += `<tr style="background-color: ${bg}; color: #333;">`;
                    Object.values(row).forEach(val => { tableHTML += `<td style="padding: 12px; border: 1px solid #ddd;">${val}</td>`; });
                    tableHTML += `</tr>`;
                });
                tableHTML += `</table>`;
                if(outputBox) outputBox.insertAdjacentHTML('beforeend', tableHTML);
            }
            let j = i + 3; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'নিচে_স্ক্রল_করো') {
            let idToken = tokens[i+1];
            let id = idToken ? (idToken.type === 'টেক্সট' ? idToken.value : (variables[idToken.value] || idToken.value)) : '';
            if(id && id !== ';') {
                let el = document.getElementById(id); if(el) el.scrollTop = el.scrollHeight;
            } else {
                let outBox = document.getElementById('output-box');
                if(outBox) outBox.scrollTop = outBox.scrollHeight; window.scrollTo(0, document.body.scrollHeight);
            }
            let j = i + 1; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'সিস্টেম_সাউন্ড') {
            let sType = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : 'বিপ';
            let ctx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = ctx.createOscillator(); let gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            
            if(sType === 'সফল') {
                osc.type = 'sine'; osc.frequency.setValueAtTime(400, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start(); osc.stop(ctx.currentTime + 0.2);
            } else if(sType === 'ভুল' || sType === 'এরর') {
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(); osc.stop(ctx.currentTime + 0.3);
            } else {
                osc.type = 'square'; osc.frequency.setValueAtTime(300, ctx.currentTime);
                gain.gain.setValueAtTime(1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(); osc.stop(ctx.currentTime + 0.1);
            }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'অ্যানিমেশন_থামাও') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let el = document.getElementById(id); if(el) { el.style.animation = 'none'; }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ছবি_বাছাই_করো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
            input.onchange = e => {
                let file = e.target.files[0];
                if(file) {
                    let reader = new FileReader();
                    reader.onload = event => { let el = document.getElementById(id); if(el) el.src = event.target.result; };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'শেয়ার_করো') {
            let title = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let link = tokens[i+2] ? (tokens[i+2].type === 'টেক্সট' ? tokens[i+2].value : (variables[tokens[i+2].value] || tokens[i+2].value)) : '';
            if (navigator.share) { navigator.share({ title: title, url: link }).catch(err => console.log('শেয়ার বাতিল')); } 
            else { alert("আপনার ব্রাউজার শেয়ার অপশন সাপোর্ট করে না!"); }
            let j = i + 3; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'প্রিন্ট_করো') {
            window.print();
            let j = i + 1; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কল_করো') {
            let num = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            window.location.href = 'tel:' + banglaToEnglishNum(num);
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'এসএমএস_করো') {
            let num = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let msg = tokens[i+2] ? (tokens[i+2].type === 'টেক্সট' ? tokens[i+2].value : (variables[tokens[i+2].value] || tokens[i+2].value)) : '';
            window.location.href = 'sms:' + banglaToEnglishNum(num) + '?body=' + encodeURIComponent(msg);
            let j = i + 3; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ম্যাপ_দেখাও') {
            let latToken = tokens[i+1]; let lngToken = tokens[i+2];
            let lat = latToken ? (latToken.type === 'টেক্সট' ? latToken.value : (variables[latToken.value] !== undefined ? variables[latToken.value] : latToken.value)) : '23.8103';
            let lng = lngToken ? (lngToken.type === 'টেক্সট' ? lngToken.value : (variables[lngToken.value] !== undefined ? variables[lngToken.value] : lngToken.value)) : '90.4125';
            let actualLat = parseFloat(banglaToEnglishNum(lat)); let actualLng = parseFloat(banglaToEnglishNum(lng));
            let mapIframe = `<iframe width="100%" height="250" style="border:0; border-radius:10px; margin: 15px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=${actualLat},${actualLng}&hl=bn&z=15&output=embed"></iframe>`;
            if(outputBox) outputBox.insertAdjacentHTML('beforeend', mapIframe);
            let j = i + 3; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ছবি_তোলো') {
            let vidIdToken = tokens[i+1]; let imgIdToken = tokens[i+2];
            let vidId = vidIdToken ? (vidIdToken.type === 'টেক্সট' ? vidIdToken.value : (variables[vidIdToken.value] || vidIdToken.value)) : '';
            let imgId = imgIdToken ? (imgIdToken.type === 'টেক্সট' ? imgIdToken.value : (variables[imgIdToken.value] || imgIdToken.value)) : 'ক্যাপচার_ছবি';
            let video = document.getElementById(vidId);
            if (video) {
                let canvas = document.createElement('canvas'); canvas.width = video.videoWidth || 300; canvas.height = video.videoHeight || 200;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); let dataUrl = canvas.toDataURL('image/png');
                if(outputBox) outputBox.insertAdjacentHTML('beforeend', `<img id="${imgId}" src="${dataUrl}" style="max-width:100%; border-radius:8px; border: 3px solid lime; display:block; margin: 10px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">`);
            } else { alert("ক্যামেরা আগে চালু করতে হবে!"); }
            let j = i + 3; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'চার্ট_আঁকো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let dataArr = tokens[i+2] ? (variables[tokens[i+2].value] || []) : [];
            let color = tokens[i+3] ? (tokens[i+3].type === 'টেক্সট' ? tokens[i+3].value : (variables[tokens[i+3].value] || tokens[i+3].value)) : 'blue';
            let actualColor = color === 'লাল'?'red':color==='সবুজ'?'green':color==='নীল'?'blue':color==='হলুদ'?'yellow':color;
            let canvas = document.getElementById(id);
            if (canvas && canvas.getContext && Array.isArray(dataArr) && dataArr.length > 0) {
                let ctx = canvas.getContext('2d'); let w = canvas.width; let h = canvas.height; ctx.clearRect(0, 0, w, h);
                let maxVal = Math.max(...dataArr.map(n => parseFloat(banglaToEnglishNum(n)) || 0)); if(maxVal === 0) maxVal = 1;
                let barWidth = w / dataArr.length;
                for(let k=0; k<dataArr.length; k++) {
                    let val = parseFloat(banglaToEnglishNum(dataArr[k])) || 0; let barHeight = (val / maxVal) * (h - 30);
                    ctx.fillStyle = actualColor; ctx.fillRect(k * barWidth + 5, h - barHeight - 20, barWidth - 10, barHeight);
                    ctx.fillStyle = "#fff"; ctx.font = "14px Arial"; ctx.fillText(val, k * barWidth + (barWidth/2) - 10, h - 5);
                }
            }
            let j = i + 4; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কিউআর_কোড_বানাও') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let dataStr = tokens[i+2] ? (tokens[i+2].type === 'টেক্সট' ? tokens[i+2].value : (variables[tokens[i+2].value] || tokens[i+2].value)) : '';
            let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dataStr)}`;
            if(outputBox) outputBox.insertAdjacentHTML('beforeend', `<img id="${id}" src="${qrUrl}" style="border-radius:10px; display:block; margin: 10px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">`);
            let j = i + 3; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'পুরো_স্ক্রিনের_রং') {
            let bgToken = tokens[i+1]; let txtToken = tokens[i+2];
            let bg = bgToken ? (bgToken.type === 'টেক্সট' ? bgToken.value : (variables[bgToken.value] !== undefined ? variables[bgToken.value] : bgToken.value)) : '';
            let txt = txtToken ? (txtToken.type === 'টেক্সট' ? txtToken.value : (variables[txtToken.value] !== undefined ? variables[txtToken.value] : txtToken.value)) : '';
            let actualBg = bg === 'লাল'?'red':bg==='সবুজ'?'green':bg==='নীল'?'blue':bg==='কালো'?'black':bg==='সাদা'?'white':bg==='হলুদ'?'yellow':bg==='ছাই'?'gray':bg;
            let actualTxt = txt === 'লাল'?'red':txt==='সবুজ'?'green':txt==='নীল'?'blue':txt==='কালো'?'black':txt==='সাদা'?'white':txt==='হলুদ'?'yellow':txt==='ছাই'?'gray':txt;
            if(actualBg && outputBox) outputBox.style.backgroundColor = actualBg; if(actualTxt && actualTxt !== ';' && outputBox) outputBox.style.color = actualTxt;
            if(outputBox) { outputBox.style.minHeight = "100vh"; outputBox.style.padding = "20px"; }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'সরাও') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let el = document.getElementById(id);
            if (el) {
                let getVal = (idx) => tokens[idx] ? (tokens[idx].type === 'টেক্সট' ? tokens[idx].value : (variables[tokens[idx].value] !== undefined ? variables[tokens[idx].value] : tokens[idx].value)) : 0;
                el.style.position = 'absolute'; el.style.left = parseFloat(banglaToEnglishNum(getVal(i+2))) + 'px'; el.style.top = parseFloat(banglaToEnglishNum(getVal(i+3))) + 'px';
            }
            let j = i + 4; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'স্টাইল_বদলানো') {
            let idToken = tokens[i+1]; let propToken = tokens[i+2]; let valToken = tokens[i+4]; 
            let targetId = idToken ? (idToken.type === 'টেক্সট' ? idToken.value : (variables[idToken.value] !== undefined ? variables[idToken.value] : idToken.value)) : '';
            let prop = propToken ? (propToken.type === 'টেক্সট' ? propToken.value : (variables[propToken.value] !== undefined ? variables[propToken.value] : propToken.value)) : '';
            let val = valToken ? (valToken.type === 'টেক্সট' ? valToken.value : (variables[valToken.value] !== undefined ? variables[valToken.value] : valToken.value)) : '';
            let el = document.getElementById(targetId); if(el && prop) { el.style[prop] = val; }
            let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ছবি_যুক্ত_করো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let link = tokens[i+3] ? (tokens[i+3].type === 'টেক্সট' ? tokens[i+3].value : (variables[tokens[i+3].value] || tokens[i+3].value)) : '';
            if(outputBox) outputBox.insertAdjacentHTML('beforeend', `<img id="${id}" src="${link}" style="max-width:100%; border-radius:8px; display:block; margin: 10px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">`);
            let j = i + 4; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'লুকাও') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let el = document.getElementById(id); if (el) el.style.display = 'none';
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'প্রকাশ_করো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let el = document.getElementById(id); if (el) el.style.display = 'block';
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ডেটা_পাঠাও') {
            let varName = tokens[i+1].value;
            let url = tokens[i+3] ? (tokens[i+3].type === 'টেক্সট' ? tokens[i+3].value : (variables[tokens[i+3].value] || tokens[i+3].value)) : '';
            let payload = tokens[i+4] ? (tokens[i+4].type === 'টেক্সট' ? tokens[i+4].value : (variables[tokens[i+4].value] !== undefined ? variables[tokens[i+4].value] : tokens[i+4].value)) : {};
            try {
                let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: typeof payload === 'object' ? JSON.stringify(payload) : String(payload) });
                variables[varName] = await response.text();
            } catch(err) { variables[varName] = "ত্রুটি: ডেটা পাঠানো যায়নি!"; }
            let j = i + 5; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ফোন_কাঁপাও') {
            let timeStr = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '200';
            if (navigator.vibrate) navigator.vibrate(parseInt(banglaToEnglishNum(timeStr)) || 200);
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কপি_করো') {
            let txt = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(e=>{});
            else alert("কপি সাপোর্ট করে না!");
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'নোটিফিকেশন_দাও') {
            let msg = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            if ("Notification" in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") new Notification("আপনার অ্যাপ", { body: msg });
                });
            } else { alert("আপনার ব্রাউজারে নোটিফিকেশন সাপোর্ট করে না!"); }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'লোকেশন_বের_করো') {
            let j = i + 1; if (tokens[j] && tokens[j].value === '{') j++;
            let blockStart = j, blockEnd = j, braceCount = 1;
            while (braceCount > 0 && blockEnd < tokens.length) {
                if (tokens[blockEnd].value === '{') braceCount++;
                if (tokens[blockEnd].value === '}') braceCount--;
                blockEnd++;
            }
            let blockTokens = tokens.slice(blockStart, blockEnd - 1);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async function(pos) {
                    variables['অক্ষাংশ'] = pos.coords.latitude;
                    variables['দ্রাঘিমাংশ'] = pos.coords.longitude;
                    await runTokens(blockTokens, variables, functions, outputBox);
                }, function(error) { alert("লোকেশন পারমিশন দিন!"); });
            } else { alert("জিপিএস সাপোর্ট করে না!"); }
            i = blockEnd;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কথা_বলো') {
            let txt = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let utterance = new SpeechSynthesisUtterance(txt); utterance.lang = 'bn-BD'; 
            window.speechSynthesis.speak(utterance);
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কথা_শোনো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                let recognition = new SpeechRecognition(); recognition.lang = 'bn-BD'; 
                recognition.onresult = function(event) {
                    let transcript = event.results[0][0].transcript;
                    let el = document.getElementById(id);
                    if (el) { if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = transcript; else el.innerHTML = transcript; }
                };
                recognition.start();
            } else { alert("ভয়েস টাইপিং সাপোর্ট করে না!"); }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ভয়েস_মেসেজ_শুরু') {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                    window.bengaliAudioRecorder = new MediaRecorder(stream);
                    window.bengaliAudioChunks = [];
                    window.bengaliAudioRecorder.ondataavailable = e => { window.bengaliAudioChunks.push(e.data); };
                    window.bengaliAudioRecorder.start();
                    if(!window.bengaliStreams) window.bengaliStreams = [];
                    window.bengaliStreams.push(stream);
                }).catch(err => alert("মাইক্রোফোন পারমিশন দেওয়া হয়নি!"));
            }
            let j = i + 1; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ভয়েস_মেসেজ_থামাও') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            if (window.bengaliAudioRecorder && window.bengaliAudioRecorder.state === "recording") {
                window.bengaliAudioRecorder.onstop = () => {
                    let audioBlob = new Blob(window.bengaliAudioChunks, { 'type' : 'audio/ogg; codecs=opus' });
                    let audioUrl = URL.createObjectURL(audioBlob);
                    let el = document.getElementById(id);
                    if(el) { el.src = audioUrl; }
                };
                window.bengaliAudioRecorder.stop();
            }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'অন্য_পেজে_যাও') {
            let url = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            window.location.href = url;
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'নতুন_ট্যাবে_খুলুন') {
            let url = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            window.open(url, '_blank');
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'স্ক্রল_করো') {
            let id = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : '';
            let el = document.getElementById(id); if(el) el.scrollIntoView({behavior: 'smooth', block: 'center'});
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'অপেক্ষা_করো') {
            let timeMs = parseInt(banglaToEnglishNum(tokens[i+1].value)) || 1000;
            let j = i + 2; if (tokens[j] && tokens[j].value === '{') j++;
            let blockStart = j, blockEnd = j, braceCount = 1;
            while (braceCount > 0 && blockEnd < tokens.length) {
                if (tokens[blockEnd].value === '{') braceCount++;
                if (tokens[blockEnd].value === '}') braceCount--;
                blockEnd++;
            }
            let blockTokens = tokens.slice(blockStart, blockEnd - 1);
            let timeoutId = setTimeout(async () => { await runTokens(blockTokens, variables, functions, outputBox); }, timeMs);
            if (!window.bengaliTimeouts) window.bengaliTimeouts = []; window.bengaliTimeouts.push(timeoutId);
            i = blockEnd;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'পেজ_রিলোড_করো') {
            window.location.reload();
            let j = i + 1; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'পেছনে_যাও') {
            window.history.back();
            let j = i + 1; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কিবোর্ড_চাপলে') {
            let keyName = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : tokens[i+1].value) : '';
            let j = i + 2; if (tokens[j] && tokens[j].value === '{') j++;
            let blockStart = j, blockEnd = j, braceCount = 1;
            while (braceCount > 0 && blockEnd < tokens.length) {
                if (tokens[blockEnd].value === '{') braceCount++;
                if (tokens[blockEnd].value === '}') braceCount--;
                blockEnd++;
            }
            let blockTokens = tokens.slice(blockStart, blockEnd - 1);
            let keyListener = async function(e) {
                if (e.key === keyName || e.code === keyName) { e.preventDefault(); await runTokens(blockTokens, variables, functions, outputBox); }
            };
            window.addEventListener('keydown', keyListener);
            if (!window.bengaliKeyListeners) window.bengaliKeyListeners = []; window.bengaliKeyListeners.push(keyListener);
            i = blockEnd; 
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'টাচ_করলে') {
            let id = tokens[i+1].value;
            let j = i + 2; if (tokens[j] && tokens[j].value === '{') j++;
            let blockStart = j, blockEnd = j, braceCount = 1;
            while (braceCount > 0 && blockEnd < tokens.length) {
                if (tokens[blockEnd].value === '{') braceCount++;
                if (tokens[blockEnd].value === '}') braceCount--;
                blockEnd++;
            }
            let blockTokens = tokens.slice(blockStart, blockEnd - 1);
            let el = document.getElementById(id);
            if (el) { el.addEventListener('touchstart', async function(e) { await runTokens(blockTokens, variables, functions, outputBox); }, {passive: true}); }
            i = blockEnd; 
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'ফাইল_ডাউনলোড') {
            let name = tokens[i+1] ? (tokens[i+1].type === 'টেক্সট' ? tokens[i+1].value : (variables[tokens[i+1].value] || tokens[i+1].value)) : 'data.txt';
            let data = tokens[i+3] ? (tokens[i+3].type === 'টেক্সট' ? tokens[i+3].value : (variables[tokens[i+3].value] || tokens[i+3].value)) : '';
            if (typeof data === 'object') data = JSON.stringify(data, null, 2);
            let blob = new Blob([data], { type: 'text/plain' }); let a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
            let j = i + 4; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1;
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'কাজ') {
            let funcName = tokens[i+1].value;
            let j = i + 2; if (tokens[j] && tokens[j].value === '{') j++;
            let blockStart = j, blockEnd = j, braceCount = 1;
            while (braceCount > 0 && blockEnd < tokens.length) {
                if (tokens[blockEnd].value === '{') braceCount++;
                if (tokens[blockEnd].value === '}') braceCount--;
                blockEnd++;
            }
            functions[funcName] = tokens.slice(blockStart, blockEnd - 1);
            i = blockEnd; 
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'করো') {
            let funcName = tokens[i+1].value;
            if (functions[funcName]) { await runTokens(functions[funcName], variables, functions, outputBox); }
            let j = i + 2; while(j < tokens.length && tokens[j].value !== ';') { j++; } i = j + 1; 
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'লুপ') {
            let loopCount = parseInt(banglaToEnglishNum(tokens[i+1].value));
            let j = i + 2; if (tokens[j] && tokens[j].value === 'বার') j++; if (tokens[j] && tokens[j].value === '{') j++;
            let blockStart = j, blockEnd = j, braceCount = 1;
            while (braceCount > 0 && blockEnd < tokens.length) {
                if (tokens[blockEnd].value === '{') braceCount++;
                if (tokens[blockEnd].value === '}') braceCount--;
                blockEnd++;
            }
            let loopTokens = tokens.slice(blockStart, blockEnd - 1);
            for(let k = 0; k < loopCount; k++) { await runTokens(loopTokens, variables, functions, outputBox); }
            i = blockEnd; 
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'প্রতি_সেকেন্ডে') {
            let j = i + 1; if (tokens[j] && tokens[j].value === '{') j++;
            let blockStart = j, blockEnd = j, braceCount = 1;
            while (braceCount > 0 && blockEnd < tokens.length) {
                if (tokens[blockEnd].value === '{') braceCount++;
                if (tokens[blockEnd].value === '}') braceCount--;
                blockEnd++;
            }
            let blockTokens = tokens.slice(blockStart, blockEnd - 1);
            runTokens(blockTokens, variables, functions, outputBox);
            let intervalId = setInterval(async () => { await runTokens(blockTokens, variables, functions, outputBox); }, 1000);
            if (!window.bengaliIntervals) window.bengaliIntervals = []; window.bengaliIntervals.push(intervalId);
            i = blockEnd; 
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'যদি') {
            let varName = tokens[i+1].value;
            let operator = tokens[i+2].value; 
            let compareToken = tokens[i+3];
            let compareValue = compareToken ? ((compareToken.type === 'টেক্সট') ? compareToken.value : compareToken.value) : '';
            let actualValue = variables[varName] !== undefined ? variables[varName] : varName;
            
            let numActual = parseFloat(banglaToEnglishNum(actualValue));
            let numComp = parseFloat(banglaToEnglishNum(compareValue));

            let val1 = (!isNaN(numActual) && !isNaN(numComp)) ? numActual : actualValue;
            let val2 = (!isNaN(numActual) && !isNaN(numComp)) ? numComp : compareValue;

            if (operator === '==') lastIfMet = (val1 == val2);
            else if (operator === '!=') lastIfMet = (val1 != val2);
            else if (operator === '>') lastIfMet = (val1 > val2);
            else if (operator === '<') lastIfMet = (val1 < val2);
            else if (operator === '>=') lastIfMet = (val1 >= val2);
            else if (operator === '<=') lastIfMet = (val1 <= val2);
            else lastIfMet = (val1 == val2);
            
            i += 4;
            if (tokens[i] && tokens[i].value === '{') i++;

            if (!lastIfMet) {
                let braceCount = 1;
                while (braceCount > 0 && i < tokens.length) {
                    if (tokens[i].value === '{') braceCount++;
                    if (tokens[i].value === '}') braceCount--;
                    i++;
                }
            }
        }
        else if (token.type === 'কীওয়ার্ড' && token.value === 'নাহলে') {
            i++; if (tokens[i] && tokens[i].value === '{') i++;
            if (lastIfMet) {
                let braceCount = 1;
                while (braceCount > 0 && i < tokens.length) {
                    if (tokens[i].value === '{') braceCount++;
                    if (tokens[i].value === '}') braceCount--;
                    i++;
                }
            }
        }
        else if (token.value === '{' || token.value === '}') { i++; }
        else { i++; }
    }
}

/** * ==========================================
 * পার্ট ৫: ইউনিভার্সাল রানার (CORS Fix & .bn Support)
 * ==========================================
 */
window.addEventListener('DOMContentLoaded', async () => {
    let banglaScripts = document.querySelectorAll('script[type="text/bangla"]');
    
    for (let script of banglaScripts) {
        let code = "";
        
        if (script.hasAttribute('src')) {
            let src = script.getAttribute('src');
            try {
                let res = await fetch(src);
                if(!res.ok) throw new Error("CORS Error");
                code = await res.text();
            } catch(e) {
                console.error(`BanglaScript Error: ${src} ফাইলটি লোড করা যায়নি! সিকিউরিটি বা CORS এর জন্য এটি ব্লক করা হয়েছে। এটি রান করার জন্য Vercel, Netlify বা একটি লোকাল সার্ভার ব্যবহার করুন।`);
                continue;
            }
        } else {
            code = script.innerHTML;
        }
        
        if(code.trim() === "") continue;

        let outputBox = document.getElementById('bangla-app-root') || document.body;
        let variables = {}; let functions = {};
        
        try {
            let tokens = tokenize(code);
            await runTokens(tokens, variables, functions, outputBox);
        } catch (e) {
            console.error("BanglaScript Execution Error: ", e);
        }
    }
});