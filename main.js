const GREPSKI = 'αβψδεφγηιξκλμνοπθρσςτυшщщχγζάψέλνόσςζжж';
const POLSKI  = 'abcdefghijklmnopqrsçtuvwšxyząćęłńóśḉźżř';
const SOFT    = 'fjlrvwšćńḉźż';
const HARD    = 'cdçtzł';

function transformCharGr(char, endWord) {
    const lower = char.toLowerCase();
    const idx = POLSKI.indexOf(lower);
    if (idx < 0) {
        return char;
    }

    var grchar = GREPSKI[idx];
    // If 'sz,' 'y,' or 'rz,' add combining acute accent
    grchar += 'šyř'.includes(lower) ? '\u0301' : '';

    var endchar = '';
    if (endWord) {
        if (SOFT.includes(lower)) {
            endchar = 'ь';
        } else if (HARD.includes(lower)) {
            endchar = 'ъ';
        }
    }

    // Check for capital letter
    if (/\p{Lu}/u.test(char)) {
        grchar = grchar.toUpperCase();
    }

    return `${grchar}${endchar}`;
}

function transformCharPl(char) {
    const idx = GREPSKI.indexOf(char.toLowerCase());
    if (char === 'ь' || char === 'ъ') {
        return '';
    }
    if (idx < 0) {
        return char;
    }

    var plchar = POLSKI[idx];

    if (/\p{Lu}/u.test(char)) {
        plchar = plchar.toUpperCase();
    }

    return plchar;
}

$(document).ready(() => {
    const inputpl = $('#input-pl');
    const inputgr = $('#input-gr');

    inputpl.on('input', function () {
        const text = $(this).val()
            .replace(/sz/g, 'š')
            .replace(/rz/g, 'ř')
            .replace(/s(?=[\s\p{P}\p{S}]|$)/gu, 'ç')
            .replace(/ś(?=[\s\p{P}\p{S}]|$)/gu, 'ḉ');

        var output = '';
        var lastIndex = text.length - 1;
        for (var i = lastIndex; i >= 0; i--) {
            var endWord = true;
            // If end of string, always end of word
            if (i !== lastIndex) {
                // If the character after is punctuation, symbol, or whitespace
                endWord = /[\s\p{P}\p{S}]/u.test(text.charAt(i + 1));
            }
            const transformed = transformCharGr(text.charAt(i), endWord);
            output = `${transformed}${output}`;
        }

        inputgr.val(output);
    });

    inputgr.on('input', function () {
        // handle special cases here
        const text = $(this).val()
            .replace(/λъ/g, 'ł')
            .replace(/ψь/g, 'ć')
            .replace(/νь/g, 'ń')
            .replace(/σь/g, 'ś')
            .replace(/ζь/g, 'ź')
            .replace(/щ́/g, 'sz')
            .replace(/γ́/g, 'y')
            .replace(/ж́/g, 'rz');

        var output = '';
        for (var char of text) {
            output += transformCharPl(char);
        }

        inputpl.val(output);
    });

    inputpl.trigger('input');
});
