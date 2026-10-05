# SYSTEM PROMPT: Лендинг IT Recruiter — Alesia Zayats

## КОНТЕКСТ
Одностраничный CV-сайт для Alesia Zayats — Lead IT Recruiter / Recruitment Team Lead.
Хостинг: GitHub Pages (`https://alesiaz19.github.io/alesia-cv/`).

## КЛЮЧЕВЫЕ РЕШЕНИЯ

### Архитектура
- Статика: HTML + CSS + JS (без фреймворков или сборщиков)
- Данные: `data.js` — единый объект `cvData` с EN/RU локалями
- Рендеринг: `script.js` — `renderPage(lang)` перерисовывает весь DOM при смене языка
- CV файл: `Alesia_Zayats_CV.docx` (редактируется через unpack → XML → repack)

### Мультиязычность
- Детекция: URL query param `?lang=ru` → localStorage → `navigator.language`
- Приоритет: URL query param переопределяет всё (для SEO-краулеров)
- EN — дефолтный язык, RU — по `ru` в браузере
- `history.replaceState` синхронизирует URL с языком без перезагрузки
- hreflang: `en`, `ru`, `x-default` в `<head>`
- canonial: обновляется под текущий язык

### SEO
- meta description, robots, canonical — в HTML
- Open Graph + Twitter Card (обновляются JS под язык)
- JSON-LD Person schema (динамически: url, description, alumniOf, worksFor)
- sitemap.xml + robots.txt
- Google Search Console верификация

### Дизайн — Dark Glass
- Цвета: `--bg-color: #0f172a` (dark slate), акцентный градиент синий-фиолетовый-циан
- Шрифты: Space Grotesk (display) + Inter (body)
- Glass-карточки: `backdrop-filter: blur(20px)`, border `rgba(255,255,255,0.1)`
- Фоновое свечение: fixed gradient blur с медленной анимацией
- Анимации: IntersectionObserver для fade-in секций, header shrink на скролле
- Единая система отступов: карточки 2rem, гриды 1.5rem, h2 margin-bottom 2rem (десктоп)

### Структура страницы
1. **Header** — фиксированный, логотип + навигация + переключатель языка (+ бургер-меню на мобильных)
2. **Hero** — имя, должность, локация · Remote, статус "Open to work" (зелёная точка + текст)
3. **About** — краткое описание в glass-карточке
4. **Achievements** — статы с градиентными числами (25%, 120+, +20%, 8, 95%, 2,000+)
5. **Skills** — сетка навыков (6 карточек)
6. **Experience** — 3 позиции (Andersen, Aston, Status) с датами и описанием
7. **Education** — образование
8. **Certificates** — карточки с изображениями + lightbox
9. **Languages** — flex-контейнер с языками
10. **Contact** — контакты (email, телефон, LinkedIn, Telegram) + кнопка скачивания CV
11. **Footer** — scroll-to-top кнопка

### Секции anchor offset
- `section[id] { scroll-margin-top: 80px }` — для фиксированного хедера

### Рефакторинг (выполнено)
- `renderPage` разбита на 12 отдельных функций (renderMeta, renderHero, renderAbout...)
- `onScrollRaf` — общая утилита для троттлинга scroll-обработчиков
- `IntersectionObserver` переиспользуется: disconnect при повторном рендере
- Мобильное меню: event delegation вместо накопления обработчиков
- `setMeta` — null-безопасная обёртка для meta-тегов
- `data.js`: удалён дублирующийся `heroContacts`
- HTML: fix title (латиница), defer на обоих script, fallback-текст hero
- CSS: clamp-диапазоны пересчитаны, удалены дублирующиеся font-size в медиа-запросах

### Телефон
- Формат: `+375 29 850-85-16` (Беларусь)
- Функция `formatPhone(phone)` в script.js

### Ссылки в контактах
- LinkedIn: отображается только логин (`alesiaromasko`)
- Telegram: отображается `@lesiaRomashko`
- Функция `shortUrl(url)` в script.js

## РАЗРАБОТКА

### Локальный запуск
Просто открой `index.html` в браузере — всё статическое.

### Редактирование DOCX
```bash
# Распаковать
cp Alesia_Zayats_CV.docx cv_temp.zip && unzip -o cv_temp.zip -d unpacked_cv/
# Отредактировать unpacked_cv/word/document.xml
# Запаковать обратно
cd unpacked_cv && zip -r ../Alesia_Zayats_CV.docx * && cd ..
```

## ПРОВЕРКА КАЧЕСТВА
- W3C-валидный HTML (void elements без слешей, закодированные data URI, непустые heading/img alt)
- CSS: сбалансированные скобки, переменные в :root, медиа-запросы без дублирования
- JS: no leaks (Observer disconnect, event delegation, rAF throttle)
