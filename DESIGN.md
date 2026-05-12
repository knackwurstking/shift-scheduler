# DESIGN.md – HTML-Designsystem

## 1. Ziel

Einheitliches Erscheinungsbild aller generierten HTML-Dateien im Projekt. Dieses Dokument definiert verbindliche Design-Regeln.

---

## 2. Farbpalette

### 2.1 Hell-Modus

| Rolle | Farbe | Hex |
|-------|-------|-----|
| Hintergrund | Weiß | `#ffffff` |
| Text | Dunkelgrau | `#1a1a1a` |
| Tabellenkopf | Dunkelblau | `#2c3e50` |
| Tabellenkopf Text | Weiß | `#ffffff` |
| Akzent | Blau | `#3498db` |
| Hover-Zeile | Hellblau | `#ebf5fb` |
| Border | Grau | `#e0e0e0` |
| Zebra-Streifen | Hellgrau | `#f9f9f9` |

### 2.2 Dunkel-Modus

| Rolle | Farbe | Hex |
|-------|-------|-----|
| Hintergrund | Schwarz | `#0a0a0a` |
| Text | Hellgrau | `#e0e0e0` |
| Tabellenkopf | Dunkelgrau | `#1a1a1a` |
| Tabellenkopf Text | Weiß | `#ffffff` |
| Akzent | Cyan | `#00d4ff` |
| Hover-Zeile | Dunkelblau | `#1a2a3a` |
| Border | Dunkelgrau | `#2a2a2a` |
| Zebra-Streifen | Fast-Schwarz | `#111111` |

### 2.3 Akzent-Farben (für Datenzellen)

| Verwendung | Farbe | Hex |
|------------|-------|-----|
| Primär | Blau | `#3498db` |
| Erfolg | Grün | `#2ecc71` |
| Warnung | Orange | `#f39c12` |
| Fehler | Rot | `#e74c3c` |
| Info | Cyan | `#00d4ff` |

---

## 3. Dark/Light Mode (automatisch, minimales JS)

### 3.1 System-Erkennung (CSS only)

```css
:root {
	/* Standard = Hell-Modus */
	--bg: #ffffff;
	--text: #1a1a1a;
	--header-bg: #2c3e50;
	--header-text: #ffffff;
	--accent: #3498db;
	--row-hover: #ebf5fb;
	--zebra: #f9f9f9;
	--border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
	:root {
		/* Dunkel-Modus */
		--bg: #0a0a0a;
		--text: #e0e0e0;
		--header-bg: #1a1a1a;
		--header-text: #ffffff;
		--accent: #00d4ff;
		--row-hover: #1a2a3a;
		--zebra: #111111;
		--border: #2a2a2a;
	}
}
```

### 3.2 Minimal JS (nur für manuellen Toggle)

```js
(function() {
	const toggle = localStorage.getItem('theme');
	if (toggle === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
	else if (toggle === 'light') document.documentElement.removeAttribute('data-theme');
})();
```

- **Kein** `DOMContentLoaded` – Inline-Script im `<head>` sofort ausgeführt
- **Kein** Flackern – CSS-Medienabfrage greift wenn kein JS geladen wird
- **Kein** `matchMedia`-Listener nötig (System-Wechsel → Seite neu laden akzeptabel)

### 3.3 CSS-Variablen mit data-theme

```css
[data-theme='dark'] {
	--bg: #0a0a0a;
	--text: #e0e0e0;
	--header-bg: #1a1a1a;
	--header-text: #ffffff;
	--accent: #00d4ff;
	--row-hover: #1a2a3a;
	--zebra: #111111;
	--border: #2a2a2a;
}

@media (prefers-color-scheme: dark) {
	:root:not([data-theme='light']) {
		--bg: #0a0a0a;
		--text: #e0e0e0;
		--header-bg: #1a1a1a;
		--header-text: #ffffff;
		--accent: #00d4ff;
		--row-hover: #1a2a3a;
		--zebra: #111111;
		--border: #2a2a2a;
	}
}
```

**Priorität:** `data-theme` > `prefers-color-scheme` > Standard (Hell)

### 3.4 Toggle-Button (optional)

```html
<button id="theme-toggle" aria-label="Farbschema wechseln">◐</button>
```

```js
document.getElementById('theme-toggle')?.addEventListener('click', () => {
	const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
	document.documentElement.setAttribute('data-theme', isDark ? '' : 'dark');
	localStorage.setItem('theme', isDark ? 'light' : 'dark');
});
```

### 3.5 Print-Override

```css
@media print {
	:root, [data-theme] {
		--bg: #ffffff !important;
		--text: #000000 !important;
		--header-bg: #333333 !important;
		--accent: #3498db !important;
	}
}
```

---

## 4. Typografie

### 4.1 Font-Stack

```
font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
```

Alternative für Hell-Modus:
```
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
```

### 4.2 Schriftgrößen

| Element | Größe |
|---------|-------|
| h1 | `1,6rem` |
| h2 / Sektions-Header | `1,2rem` |
| h3 | `1,0rem` |
| Tabellenkopf | `0,75rem` |
| Tabellen-Zellen | `0,8rem` |
| Legende / Notiz | `0,75rem`–`0,9rem` |

### 4.3 Deklarations-Separator

- Dezimaltrenner: **Komma** (`13,5`), NIEMALS Punkt (`13.5`)

---

## 5. HTML-Grundgerüst

### 5.1 Boilerplate (für alle neuen HTML-Dateien)

```html
<!doctype html>
<html lang="de">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{Titel}</title>
		<style>
			/* CSS hier */
		</style>
	</head>
	<body>
		<!-- Inhalt -->
	</body>
</html>
```

- **Immer** `<!doctype html>` (klein)
- **Immer** `<html lang="de">`
- **Self-closing Tags** mit Leerzeichen vor `/>` (z. B. `<meta ... />`)

### 5.2 Einrückung

- **Tabs** (keine Spaces)
- Eine Einrückungsebene = **1 Tab**
- Tabellen-eigen: `<tr>` und `<td>` eingerückt, `<thead>`/`<tbody>` bündig mit `<table>`

---

## 6. Tabellen-Standards

### 6.1 Grundstruktur

```html
<div class="table-wrapper">
	<table>
		<thead>
			<tr>
				<th>Spalte 1</th>
				<th>Spalte 2</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Wert 1</td>
				<td>Wert 2</td>
			</tr>
		</tbody>
	</table>
</div>
```

- `<table>` innerhalb `<div class="table-wrapper">` (für horizontales Scrollen)
- `<thead>` und `<tbody>` immer verwenden

### 6.2 CSS-Basis

```css
table {
	width: 100%;
	border-collapse: collapse;
}

thead th {
	padding: 8px 4px;
	text-align: center;
	font-weight: 600;
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

tbody td {
	padding: 6px 3px;
	text-align: center;
	font-size: 0.8rem;
}

tbody tr:hover {
	transition: background 0.2s ease;
}

.table-wrapper {
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	width: 100%;
	scrollbar-width: none;
}

.table-wrapper::-webkit-scrollbar {
	display: none;
}
```

### 6.3 Zellen-Klassen

| Klasse | Verwendung |
|--------|------------|
| `.format-cell` | Format-Spalte, fett, hell |
| `.value-cell` | Wert-Spalte, farbig |
| `.empty-cell` | Leere Zellen (`–`), kursiv, grau |

---

## 7. Seiten-Komponenten

### 7.1 Sektions-Header

```html
<div class="section-header">
	<div class="section-title">{Titel}</div>
	<div class="table-wrapper">
		<table>...</table>
	</div>
</div>
```

### 7.2 Notiz-Zeilen

```html
<tr>
	<td colspan="{anzahl}" class="note">↳ Notiztext</td>
</tr>
```

```css
.note {
	padding: 5px 10px 5px 30px;
	border-left: 3px solid #b8860b;
	background: rgba(184, 134, 11, 0.1);
	font-style: italic;
	position: relative;
}

.note::before {
	content: "↳";
	position: absolute;
	left: 4px;
	top: 3px;
}
```

### 7.4 Abkürzungs-Banner

```html
<div class="abbrev-notice">
	<strong>📖 Abkürzungen:</strong><br>
	{Abkürzungen einfügen}
</div>
```

## 9. Print-Styles

### 9.1 Grundgerüst

```css
@page {
	size: landscape;
	margin: 0.5cm;
}

@media print {
	body {
		background: #fff;
		color: #000;
		padding: 0;
		font-size: 9pt;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}

	/* Keine Hover-Effekte im Print */
	tbody tr:hover {
		background: transparent;
	}

	/* Legende ausblenden */
	.legend {
		display: none;
	}
}
```

### 9.2 Print-Farben

- Header: `!important` überschreiben für Print-kompatible Farben
- Tabellen-Linien im Print: `1px solid #999` / `#ddd`

---

## 10. Responsive Verhalten

### 10.1 Mobile-First Prinzip

- Standard-Styles gelten für Mobile – Media Queries nur für größere Bildschirme
- Touch-freundliche Mindestgrößen: Klickflächen ≥ 44×44px, Tabellen-Padding ≥ 10px
- Keine Hover-only-Informationen – alle Inhalte auch ohne Hover sichtbar

### 10.2 Container

```css
body {
	margin: 0;
	padding: 12px;
	min-height: 100vh;
}

.container {
	max-width: 1400px;
	margin: 0 auto;
	width: 100%;
}
```

### 10.3 Tabellen auf Mobile

```css
.table-wrapper {
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	width: 100%;
	margin: 0 0 20px 0;
	-webkit-mask-image: linear-gradient(to right, transparent, #000 20px);
	mask-image: linear-gradient(to right, transparent, #000 20px);
}

/* Kein scrollbar auf Mobile */
.table-wrapper::-webkit-scrollbar {
	display: none;
}

.table-wrapper {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
```

### 10.4 Schriftgrößen auf Mobile

- h1: `1,4rem` (auf Desktop `1,6rem`)
- h2: `1,1rem` (auf Desktop `1,2rem`)
- Tabellen-Zellen: `0,75rem` (auf Desktop `0,8rem`)
- Tabellen-Kopf: `0,65rem` (auf Desktop `0,75rem`)

```css
@media (max-width: 600px) {
	h1 { font-size: 1,4rem; }
	h2, .section-header { font-size: 1,1rem; }
	thead th { font-size: 0,65rem; }
	tbody td { font-size: 0,75rem; }
}
```

### 10.5 Padding/Spacing auf Mobile

```css
@media (max-width: 600px) {
	body { padding: 8px; }
	.section { margin-bottom: 12px; }
	h2 { margin-top: 16px; margin-bottom: 8px; }
	h3 { margin-top: 12px; margin-bottom: 6px; }
}
```

### 10.6 Bilder/HowTo auf Mobile

```css
@media (max-width: 600px) {
	.image-container {
		max-width: 100%;
		margin: 0 0 16px 0;
	}
	.image-container img {
		width: 100%;
		height: auto;
	}
}
```

### 10.7 Toggle-Button auf Mobile

```css
@media (max-width: 600px) {
	#theme-toggle {
		position: fixed;
		top: 10px;
		right: 10px;
		z-index: 100;
		width: 44px;
		height: 44px;
		font-size: 1,2rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
```

---

## 11. Sortierreihenfolge

Alle Tabellen: nach den jeweiligen Datenkriterien sortieren

---

## 12. HowTo-Seiten

### 12.1 Struktur

```html
<h1>{Titel}</h1>

<div class="image-container {class}">
	<img src="./{datei}" alt="{Beschreibung}">
	<div class="image-caption">{Beschreibung}</div>
</div>

<h2>{Abschnitt}</h2>
<ul>
	<li><input type="checkbox" class="checkbox">{Item}</li>
</ul>
```

### 12.2 Stil

- Einfach, clean, fokus auf Lesbarkeit
- Max-width: `800px` für Screen
- Bilder zentriert mit Caption
- Blockquote mit farbigem linkem Rand
- Checkboxen als funktionale `<input type="checkbox">`
- Print: kompakte Schrift, page-break-after für Abschnitte

---

## 13. CSS-Organisation (innerhalb `<style>`)

1. **Globale Resets** (`* { margin: 0; padding: 0; box-sizing: border-box; }`)
2. **Screen-Styles** (Body, Container, Überschriften)
3. **Sektions-Styles** (Sektions-Klassen)
4. **Tabellen-Styles** (table, thead, tbody, Zellen-Klassen)
5. **Komponenten-Styles** (Notizen, Badges, Notices, etc.)
6. **Print-Styles** (`@media print`)
7. **Responsive-Anpassungen** (bei Bedarf)

---

## 16. Vermeidung von Inkonsistenzen (Checkliste)

- [ ] Gleicher `<html lang>` (immer `de`)
- [ ] Gleiches Boilerplate (`<!doctype html>` klein)
- [ ] Gleiche Einrückung (Tabs)
- [ ] Gleiche Tabellen-Struktur (`<thead>`/`<tbody>`)
- [ ] Gleiche Zellen-Klassen (`.format-cell`, `.value-cell`, etc.)
- [ ] Einheitliche Farbpalette pro Modus
- [ ] Dezimaltrenner: Komma (außer englische Parameter)
- [ ] Print-Styles immer vorhanden
- [ ] Keine Media Queries für Mobile (Mobile-First)

---

## 17. Bevorzugte Komponenten-Reihenfolge (pro Seite)

1. `<h1>` (Seitentitel)
2. `<div class="abbrev-notice">` (falls nötig)
3. `<div class="section-header">` mit Tabellen
4. `<div class="legend">` (optional)

**Prinzip:** Wichtigste/aktuellste Inhalte zuerst. Zusätzliche Informationen (Legende, Notizen) nach den Daten.
