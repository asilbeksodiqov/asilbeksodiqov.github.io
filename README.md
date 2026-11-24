# 040.uz

Shaxsiy sayt. Konsepsiya — **radio**: sahifa chastotalar shkalasi, har bir bo‘lim alohida stansiya.
Stansiyalar orasida shovqin, matn buziladi; to‘lqin topilganda hammasi tiniqlashadi.

Menyu ham, tugma ham yo‘q — mehmon stansiyalarni o‘zi qidirib topadi:
sichqoncha g‘ildiragi, ekranni surish (barmoq yoki sichqoncha) yoki pastdagi shkalani sudrash.
Klaviaturadan faqat `M` ishlaydi — radio shovqini ovozini yoqadi.

| Chastota | Stansiya |
|---|---|
| 013.8 | ??? (yashirin) |
| 040.0 | Salom |
| 058.0 | Ishlar |
| 076.0 | Haqida |
| 094.0 | Aloqa |

Sahifa hech qachon skroll bo‘lmaydi: stansiya matni ekranga sig‘masa, `script.js` uni avtomatik kichraytiradi.
Chiroqcha (yuqorida o‘ngda) stansiya nomini Morze alifbosida uzatadi, pastdagi osilloskop esa har stansiyada o‘z to‘lqinini chizadi.

## Fayllar

- `index.html` — kontent (stansiyalar `<article class="station" data-f="…">`)
- `style.css` — dizayn
- `script.js` — tyuner, shovqin, osilloskop, ovoz
- `404.html` — “signal yo‘q” sahifasi (GitHub Pages avtomatik ishlatadi)
- `CNAME` — domen (`040.uz`)
- `.nojekyll` — GitHub Pages fayllarni Jekyll’siz, o‘zgartirmay chiqarishi uchun

## Yangi stansiya qo‘shish

`index.html` ichiga yangi `<article class="station" id="…" data-f="…" data-name="…">` qo‘shing.
Chastota boshqa stansiyalardan kamida 9 birlik uzoq bo‘lsin (0–110 oralig‘ida), shunda orada shovqin qoladi.
Shkala va markerlar avtomatik yaratiladi.
